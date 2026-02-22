#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
A股量化策略 - 十五五规划成长动量策略 v2
更新日期: 2026-02-22

策略逻辑:
- 选股池: 沪深300 + 中证500
- 入场: MA20>MA60, 20日涨幅>0, 量比>1.5
- 出场: 止损-7%, 止盈+15%, 死叉
- 仓位: 单票10%, 总仓位80%
- 排除: 白酒、银行、新能源车
"""

import requests
import pandas as pd
from datetime import datetime

# ============== 策略配置 ==============
CONFIG = {
    'name': '十五五规划成长动量策略v2',
    # 选股池
    'index_list': ['000300', '000905'],  # 沪深300 + 中证500
    
    # 排除行业
    'exclude_industries': ['白酒', '银行', '新能源汽车', '新能源车'],
    
    # 入场条件
    'ma_short': 20,
    'ma_long': 60,
    'min_return_20d': 0,  # 20日涨幅>0
    'volume_ratio': 1.5,  # 量比>1.5
    
    # 出场条件
    'stop_loss': -0.07,   # 止损-7%
    'stop_profit': 0.15,  # 止盈+15%
    
    # 仓位管理
    'position_size': 0.10,    # 单票10%
    'max_position': 0.80,     # 总仓位80%
    'max_stocks': 8,           # 最多8只
    'max_daily_loss': -0.03,  # 单日最大亏损3%
    
    # 行业加分（十五五规划）
    'industry_bonus': {
        '人工智能': 1.5, 'AI': 1.5,
        '半导体': 1.5, '芯片': 1.5, '集成电路': 1.5,
        '生物医药': 1.5, '创新药': 1.5, '医疗器械': 1.5,
        '软件服务': 1.2, '云计算': 1.2, '互联网': 1.2,
        '光伏设备': 1.0, '风电设备': 1.0,
        '电子': 1.0, '家用电器': 1.0,
        '非银金融': 1.0, '保险': 1.0,
    }
}

# 股票池（沪深300+中证500代表）
STOCK_CODES = [
    # 沪深300
    'sh600519', 'sh600036', 'sh601318', 'sh600030', 'sh600276',
    'sh600690', 'sh600016', 'sh600887', 'sh600030', 'sh600009',
    'sh600050', 'sh600104', 'sh600176', 'sh600309', 'sh600585',
    'sh600588', 'sh600690', 'sh600760', 'sh600809', 'sh600900',
    # 中证500
    'sh688981', 'sh688256', 'sh688126', 'sh688327', 'sh688399',
    'sh300496', 'sh300760', 'sh300308', 'sh300750', 'sh300142',
    'sh300015', 'sh300003', 'sh300122', 'sh300124', 'sh300212',
    'sz000725', 'sz000858', 'sz000333', 'sz002475', 'sz000001',
    'sz000002', 'sz000333', 'sz000425', 'sz000538', 'sz000651',
]

# 股票名称和行业映射
STOCK_INFO = {
    'sh600519': {'name': '贵州茅台', 'industry': '白酒'},
    'sh600036': {'name': '招商银行', 'industry': '银行'},
    'sh601318': {'name': '中国平安', 'industry': '保险'},
    'sh600030': {'name': '中信证券', 'industry': '非银金融'},
    'sh600276': {'name': '恒瑞医药', 'industry': '生物医药'},
    'sh600690': {'name': '海尔智家', 'industry': '家用电器'},
    'sh688981': {'name': '中芯国际', 'industry': '半导体'},
    'sh688256': {'name': '寒武纪', 'industry': '人工智能'},
    'sh688126': {'name': '沪硅产业', 'industry': '半导体'},
    'sh688327': {'name': '华大九天', 'industry': '软件服务'},
    'sh300496': {'name': '中科创达', 'industry': '软件服务'},
    'sh300760': {'name': '迈瑞医疗', 'industry': '医疗器械'},
    'sh300308': {'name': '金山办公', 'industry': '软件服务'},
    'sh300750': {'name': '迈为股份', 'industry': '光伏设备'},
    'sh300142': {'name': '沃森生物', 'industry': '生物医药'},
    'sz000725': {'name': '京东方A', 'industry': '半导体'},
    'sz000858': {'name': '五粮液', 'industry': '白酒'},
    'sz000333': {'name': '美的集团', 'industry': '家用电器'},
    'sz002475': {'name': '立讯精密', 'industry': '电子'},
    'sz000001': {'name': '平安银行', 'industry': '银行'},
    'sz000002': {'name': '万科A', 'industry': '房地产'},
    'sz000651': {'name': '格力电器', 'industry': '家用电器'},
}


def get_realtime_data(codes):
    """获取实时行情"""
    url = f"https://qt.gtimg.cn/q={','.join(codes)}"
    try:
        resp = requests.get(url, timeout=10)
        
        results = []
        for line in resp.text.split(';'):
            if '=' not in line:
                continue
            try:
                parts = line.split('="')
                if len(parts) < 2:
                    continue
                    
                code_raw = parts[0].split('_')[-1]
                data = parts[1].split('~')
                
                if len(data) < 32:
                    continue
                
                # 获取股票信息
                info = STOCK_INFO.get(code_raw, {'name': data[0][:10], 'industry': '其他'})
                
                price = float(data[3]) if data[3] else 0
                yesterday = float(data[4]) if data[4] else price
                
                if yesterday > 0:
                    pct_change = (price - yesterday) / yesterday * 100
                else:
                    pct_change = 0
                
                results.append({
                    'code': code_raw,
                    'name': info['name'],
                    'industry': info['industry'],
                    'price': price,
                    'yesterday': yesterday,
                    'change': price - yesterday,
                    'pct_change': pct_change,
                })
            except:
                continue
        return results
    except Exception as e:
        print(f"获取数据失败: {e}")
        return []


def calculate_score(stock):
    """计算综合分数"""
    pct = stock['pct_change']
    industry = stock['industry']
    
    # 动量分数
    if pct > 0:
        momentum_score = pct * 10
    else:
        momentum_score = pct * 3
    
    # 行业加分
    industry_score = CONFIG['industry_bonus'].get(industry, 1.0)
    
    return momentum_score * industry_score


def check_entry_conditions(stock):
    """检查入场条件"""
    # 简化版：使用当日涨幅和行业判断
    # 完整版需要历史K线计算MA20/MA60和量比
    
    # 排除行业
    if stock['industry'] in CONFIG['exclude_industries']:
        return False, "排除行业"
    
    # 涨幅>0
    if stock['pct_change'] <= CONFIG['min_return_20d']:
        return False, "涨幅不足"
    
    return True, "符合"


def run_strategy():
    """运行策略"""
    today = datetime.now().strftime('%Y-%m-%d')
    
    print("="*70)
    print(f"A股量化策略 v2 | {today}")
    print("="*70)
    print(f"策略: {CONFIG['name']}")
    print("-"*70)
    
    # 获取实时数据
    print("\n[1] 获取实时行情...")
    stocks = get_realtime_data(STOCK_CODES)
    print(f"    获取到 {len(stocks)} 只股票")
    
    if not stocks:
        print("    无法获取数据!")
        return
    
    # 入场筛选
    print("\n[2] 入场条件筛选...")
    qualified = []
    for s in stocks:
        passed, reason = check_entry_conditions(s)
        if passed:
            s['score'] = calculate_score(s)
            qualified.append(s)
        else:
            print(f"    {s['code']} {s['name']}: {reason}")
    
    print(f"    符合条件: {len(qualified)} 只")
    
    if not qualified:
        print("    没有符合条件的股票!")
        return
    
    # 排序选股
    sorted_stocks = sorted(qualified, key=lambda x: x['score'], reverse=True)
    selected = sorted_stocks[:CONFIG['max_stocks']]
    
    # 输出结果
    print("\n[3] 选股结果")
    print("-"*70)
    print(f"{'代码':<12}{'名称':<12}{'最新价':<10}{'涨跌幅':<10}{'行业':<15}{'分数':<8}")
    print("-"*70)
    for s in selected:
        print(f"{s['code']:<12}{s['name']:<12}{s['price']:<10.2f}{s['pct_change']:>+8.2f}%{s['industry']:<15}{s['score']:>8.1f}")
    
    # 仓位
    print("\n[4] 仓位建议")
    print(f"    单票仓位: {CONFIG['position_size']*100:.0f}%")
    print(f"    总仓位: {len(selected) * CONFIG['position_size'] * 100:.0f}%")
    print(f"    现金储备: {(1 - len(selected) * CONFIG['position_size']) * 100:.0f}%")
    
    # 风控
    print("\n[5] 风险控制")
    print(f"    止损: {CONFIG['stop_loss']*100:.0f}%")
    print(f"    止盈: {CONFIG['stop_profit']*100:.0f}%")
    print(f"    单日最大亏损: {CONFIG['max_daily_loss']*100:.0f}%")
    
    # 行业分布
    print("\n[6] 行业分布")
    industry_count = {}
    for s in selected:
        ind = s['industry']
        industry_count[ind] = industry_count.get(ind, 0) + 1
    for ind, count in sorted(industry_count.items(), key=lambda x: x[1], reverse=True):
        print(f"    {ind}: {count}只")
    
    # 交易信号
    print("\n[7] 交易信号")
    buy = [s for s in selected if s['pct_change'] > 0]
    print(f"    买入: {len(buy)}只")
    print(f"    观望: {len(selected) - len(buy)}只")
    
    print("\n" + "="*70)
    
    # 保存
    df = pd.DataFrame(selected)
    filename = f"strategy_v2_{today.replace('-','')}.csv"
    df.to_csv(filename, index=False, encoding='utf-8-sig')
    print(f"\n结果已保存到 {filename}")
    
    return selected


if __name__ == "__main__":
    run_strategy()
