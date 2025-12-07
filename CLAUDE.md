# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目的js脚本已经可以在Tampermonkey/Greasemonkey正常运行，我的一切需求尽可能基于代码现有架构进行局部修改，避免修改后代码无法正常运行

## 项目概述

JavPack 是一个 Tampermonkey/Greasemonkey 用户脚本集合，主要用于增强视频网站（115、JavDB）的功能。项目包含多个独立的用户脚本和共享库文件。

## 目录结构

```
/115              # 115 网站用户脚本
  ├── 115.delDir.user.js       # 播放页删除功能
  └── 115.playlist.user.js     # 播放页列表功能

/javdb            # JavDB 网站用户脚本
  ├── JavDB.filter.user.js     # 影片过滤
  ├── JavDB.lists.user.js      # 相关清单
  ├── JavDB.magnet.user.js     # 磁链扩展
  ├── JavDB.match115.user.js   # 115 网盘匹配
  ├── JavDB.offline115.user.js # 115 网盘离线
  ├── JavDB.openTab.user.js    # 标签页打开
  ├── JavDB.scroll.user.js     # 滚动加载
  ├── JavDB.search.user.js     # 快捷搜索
  ├── JavDB.sprite.user.js     # 雪碧图
  ├── JavDB.style.user.js      # 样式调整
  └── JavDB.trailer.user.js    # 预告片

/libs             # 共享库文件
  ├── JavPack.Grant.lib.js         # UI 和通知辅助
  ├── JavPack.Magnet.lib.js        # 磁链处理
  ├── JavPack.Offline.lib.js       # 离线下载管理
  ├── JavPack.Req.lib.js           # 基础请求库
  ├── JavPack.Req115.lib.js        # 115 API 请求
  ├── JavPack.ReqDB.lib.js         # JavDB API 请求
  ├── JavPack.ReqMagnet.lib.js     # 磁链请求
  ├── JavPack.ReqSprite.lib.js     # 雪碧图请求
  ├── JavPack.ReqTrailer.lib.js    # 预告片请求
  ├── JavPack.Util.lib.js          # 工具函数
  └── JavPack.Verify115.lib.js     # 115 验证

/assets           # 图片资源（状态图标）
  ├── error.png
  ├── pend.png
  ├── success.png
  └── warn.png

/static           # 静态文件
  └── JavDB.style.user.css  # JavDB 样式

/examples         # 示例配置
  └── customConfig.example.js  # 自定义配置示例
```

## 开发工作流

### 代码格式化与检查

```bash
# 格式化所有 JavaScript 和 CSS 文件
pnpm exec prettier --write **/*.{js,css}

# 运行 ESLint 检查
pnpm exec eslint **/*.js

# 运行 Stylelint 检查
pnpm exec stylelint **/*.css
```

### 包管理

```bash
# 安装依赖
pnpm install

# 更新依赖
pnpm update
```

### 项目规范

- **包管理器**: pnpm (版本要求见 package.json)
- **代码风格**: ESLint alloy 配置 + Prettier (120字符行宽)
- **缩进**: 2个空格
- **语言特性**: ES6+ (浏览器/Greasemonkey 环境)

## 核心库说明

### Grant (`libs/JavPack.Grant.lib.js`)
- 提供统一的 UI 操作和通知功能
- `openTab()`: 新标签页打开
- `notify()`: 显示系统通知

### Offline (`libs/JavPack.Offline.lib.js`)
- 管理离线下载配置和参数解析
- `parseVar()`: 解析动态参数 `${var}`
- `parseDir()`: 解析目录路径
- `getActions()`: 获取操作按钮配置

### Magnet (`libs/JavPack.Magnet.lib.js`)
- 磁链数据处理和验证
- 磁链筛选和排序逻辑

### Req* 系列 (`libs/JavPack.Req*.lib.js`)
- `Req`: 基础 HTTP 请求封装
- `Req115`: 115 API 请求封装
- `ReqDB`: JavDB API 请求封装
- `ReqMagnet`: 磁链信息请求
- `ReqTrailer`: 预告片信息请求

### Util (`libs/JavPack.Util.lib.js`)
- `upStore()`: 清理过期的 GM 存储
- `codeParse()`: 解析番号格式
- `setFavicon()`: 设置页面图标
- `dispatchEvent()`: 分发自定义事件

## 用户脚本开发

### 用户脚本头部格式
```javascript
// ==UserScript==
// @name            ScriptName
// @namespace       script@blc
// @version         0.0.1
// @author          blc
// @description     描述
// @match           https://example.com/*
// @icon            https://example.com/favicon.ico
// @require         https://github.com/axunrun/JavPack/raw/main/libs/JavPack.Grant.lib.js
// @run-at          document-start
// @grant           GM_functionName
// ==/UserScript==
```

### 常用 GM API
- `GM_getValue(key, defaultValue)`: 获取存储值
- `GM_setValue(key, value)`: 设置存储值
- `GM_xmlhttpRequest(options)`: HTTP 请求
- `GM_openInTab(url, options)`: 新标签页打开
- `GM_notification(options)`: 显示通知
- `GM_addElement(parent, tag, attrs)`: 添加 DOM 元素
- `GM_getResourceURL(name)`: 获取资源 URL

## 自定义配置

参考 `examples/customConfig.example.js`，用户可以通过 `CUSTOM_CONFIG` 配置自定义离线下载选项。

配置支持：
- 按钮显示/隐藏
- 目录路径动态参数
- 磁链筛选和排序
- 文件重命名规则
- 验证选项

## 脚本安装

用户脚本安装地址：
- 115 脚本: https://github.com/axunrun/JavPack/raw/main/115/
- JavDB 脚本: https://github.com/axunrun/JavPack/raw/main/javdb/

## 注意事项

1. **无构建过程**: 用户脚本是独立的 .js 文件，可直接安装使用
2. **库文件依赖**: 用户脚本通过 `@require` 引用共享库
3. **资源文件**: 图片资源通过 `@resource` 引用
4. **API 权限**: 需要在 `@connect` 中声明外部域名
5. **版本管理**: 每个脚本独立版本号管理
