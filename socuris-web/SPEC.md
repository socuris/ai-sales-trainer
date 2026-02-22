# 索奇思科技 website SPEC.md

## 1. Project Overview

- **Project Name:** 索奇思信息科技有限公司官网
- **Type:** Single-page corporate website
- **Core Functionality:** 展示公司形象、产品解决方案、团队介绍、招聘信息
- **Target Users:** To B企业客户、潜在求职者

## 2. UI/UX Specification

### Layout Structure

- **Header:** 固定顶部导航栏，包含Logo和四个模块链接
- **Hero Section:** 全屏首屏，展示公司名称和slogan
- **Sections:** 四个主要模块垂直排列
  - 公司介绍（含企业文化）
  - 产品和解决方案
  - 创始团队介绍
  - 加入我们
- **Footer:** 版权信息

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

### Visual Design

#### Color Palette
- **Primary:** #0A1628 (深邃藏青 - 背景主色)
- **Secondary:** #1E3A5F (科技蓝)
- **Accent:** #00D4AA (活力青绿 - 强调色)
- **Accent Secondary:** #FF6B35 (活力橙 - 点缀)
- **Text Primary:** #FFFFFF
- **Text Secondary:** #94A3B8
- **Card Background:** rgba(30, 58, 95, 0.5)

#### Typography
- **Headings:** "Noto Sans SC", sans-serif (700 weight)
- **Body:** "Noto Sans SC", sans-serif (400 weight)
- **English Accent:** "Outfit", sans-serif

#### Spacing System
- Section padding: 100px vertical
- Container max-width: 1200px
- Card padding: 32px
- Element gap: 24px

#### Visual Effects
- 玻璃拟态卡片 (backdrop-filter: blur)
- 渐变光晕背景动画
- 滚动时section淡入上浮
- 悬停时卡片微微上浮 + 边框发光
- 文字渐变高亮

### Components

#### Header
- Logo文字: "SOCURIS" + "索奇思"
- 导航链接: 公司介绍 | 产品方案 | 创始团队 | 加入我们
- 滚动后背景变深 + 模糊

#### Hero Section
- 大标题: "以AI驱动企业销售增长"
- 副标题: "索奇思科技 - 企业最值得信赖的「硅基员工」伙伴"
- 装饰: 动态渐变光环

#### 公司介绍 Section
- 公司简介文字
- 企业文化卡片: 使命、愿景、价值观（6个核心价值）

#### 产品方案 Section
- 方案概述文字
- 5个解决方案卡片:
  1. AI智能获客与线索挖掘
  2. AI智能售前与自动化接待
  3. AI销售过程赋能
  4. AI售中跟进与转化加速
  5. AI智能售后服务与体验提升
- 每个卡片含图标、标题、描述

#### 创始团队 Section
- 团队介绍文字
- 团队理念卡片

#### 加入我们 Section
- 招聘标题
- AI产品经理岗位卡片（包含职责和要求）
- 联系邮箱

#### Footer
- 公司名称 + ©2026

## 3. Functionality Specification

### Core Features
- 单页平滑滚动导航
- 滚动动画 (Intersection Observer)
- 导航高亮跟随滚动位置
- 移动端 hamburger 菜单

### User Interactions
- 点击导航跳转对应section
- 卡片悬停效果
- 滚动触发动画

## 4. Acceptance Criteria

- [ ] 页面在现代浏览器正常加载
- [ ] 四个模块内容完整展示
- [ ] 导航点击平滑滚动到对应位置
- [ ] 滚动动画正常触发
- [ ] 移动端响应式布局正常
- [ ] 颜色、字体符合规范
