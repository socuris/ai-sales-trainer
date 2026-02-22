# AI销售训练与增长系统 - 微信云开发版

## 项目结构

```
ai-sales-trainer/
├── cloud/                  # 云函数
│   └── functions/
│       ├── ai/            # AI统一接口（调用通义千问）
│       ├── knowledge/     # 知识库管理
│       ├── training/      # 训练系统
│       └── summary/       # 接待总结
└── miniprogram/           # 微信小程序
    ├── pages/
    │   ├── index/         # 首页
    │   ├── qa/           # 客户问答
    │   ├── training/     # 产品训练
    │   ├── summary/      # 接待总结
    │   └── knowledge/    # 知识库
    └── app.js
```

## 部署步骤

### 1. 开通微信云开发
1. 登录微信公众平台 https://mp.weixin.qq.com
2. 开发管理 → 开发设置 → 开通云开发
3. 创建环境（生产环境/开发环境）

### 2. 配置阿里云API Key
在云函数环境变量中配置：
- 登录微信开发者工具
- 云开发 → 更多 → 环境设置 → 环境变量
- 添加：`DASHSCOPE_API_KEY` = 你的阿里云Key

### 3. 上传云函数
```bash
# 在微信开发者工具中
右键 cloud/functions/ai → 上传并部署
右键 cloud/functions/knowledge → 上传并部署
右键 cloud/functions/training → 上传并部署
右键 cloud/functions/summary → 上传并部署
```

### 4. 配置云数据库
在微信开发者工具中：
- 云开发 → 数据库 → 添加集合
- 创建以下集合：
  - `knowledge` - 知识库
  - `training_records` - 训练记录
  - `summaries` - 接待总结

### 5. 修改云环境ID
在 `miniprogram/app.js` 中替换 `your-env-id` 为你的云环境ID

### 6. 导入小程序
用微信开发者工具打开 miniprogram 目录即可

## 获取阿里云API Key
1. 访问 https://dashscope.console.aliyun.com
2. 注册账号
3. 开通"文本生成"服务（免费）
4. 获取 API Key

## 功能
- ❓ 客户问题实时解答
- 📚 产品知识训练
- 📝 接待总结 + 微信草稿
- 📚 企业知识库管理
