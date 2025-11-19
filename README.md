# AI Monitor - AI助手响应时间和Token监控 ⚡

<div align="center">

![Version](https://img.shields.io/badge/version-1.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Tampermonkey](https://img.shields.io/badge/Tampermonkey-Compatible-orange.svg)

一个优雅的用户脚本,用于实时监控 Gemini 和 ChatGPT 的响应时间、Token 使用量和字符数统计

[English](#english) | [中文](#chinese)

</div>

---

<a name="chinese"></a>

## ✨ 功能特性

- 🎯 **实时监控** - 精确追踪从发送问题到首字输出的响应时间
- 📊 **Token统计** - 智能估算每次对话的Token消耗(支持中英文)
- 💾 **数据持久化** - 自动保存历史统计数据到本地存储
- 🎨 **12种主题** - 支持12种精美配色主题,实时切换无需刷新
- 📈 **统计报告** - 生成详细的统计报告,支持导出HTML/JSON
- 🖱️ **可拖拽面板** - 监控面板可自由拖动到任意位置
- 🌈 **二次元风格** - 精美的UI设计,带有动画效果
- 🔄 **自动检测** - 智能检测发送按钮和Enter键,无需手动操作

## 🎨 主题预览

支持12种配色主题:
- 🔵 蓝色 (默认)
- 🟣 紫色
- 🩷 粉色
- 🟢 绿色
- 🔵 青色
- 🟠 橙色
- 🔴 红色
- 🟡 黄色
- 🟣 靛蓝
- 🔷 青绿
- 🟢 柠檬绿
- ⚪ 灰色

## 📦 安装方法

### 前置要求
- 安装 [Tampermonkey](https://www.tampermonkey.net/) 浏览器扩展

### 安装步骤
1. 点击 [安装脚本](https://github.com/YOUR_USERNAME/ai-monitor/raw/main/ai-monitor.user.js)
2. Tampermonkey 会自动打开安装页面
3. 点击"安装"按钮
4. 访问 [Gemini](https://gemini.google.com) 或 [ChatGPT](https://chatgpt.com) 即可使用

## 🚀 使用说明

### 基本使用
1. 访问支持的AI平台(Gemini/ChatGPT)
2. 监控面板会自动出现在右上角
3. 发送问题后,脚本会自动开始监控
4. 实时显示响应时间、Token数和字符数

### 功能按钮
- 🎨 **主题切换** - 点击调色板图标选择喜欢的配色
- **−/+** - 折叠/展开监控面板
- 📊 **统计报告** - 查看详细的历史统计数据
- 🔄 **重置统计** - 清除所有历史数据

### 统计报告功能
点击📊按钮可以查看详细统计,包括:
- 📈 总体统计(响应次数、总耗时、总Token数、总字符数)
- 📊 平均数据(平均响应时间、平均Token数、平均字符数)
- 💡 效率分析(Token/秒、字符/秒)
- 📥 支持导出JSON数据
- 💾 支持下载HTML报告
- 🖨️ 支持打印报告
- 🔗 支持分享统计数据

## 📊 监控指标说明

| 指标 | 说明 |
|------|------|
| ⚡ 状态 | 当前监控状态(就绪/等待响应/接收中/完成) |
| ⏱ 响应时间 | 从发送到首字输出的时间(毫秒) |
| 🎯 Token数 | 当前回复的估算Token数量 |
| 💎 总Token数 | 累计消耗的Token总数 |
| 📝 字符数 | 当前回复的字符数 |
| ✍ 总字符数 | 累计输出的字符总数 |
| ⏰ 浪费时间 | 累计等待AI响应的总时间 |

## 🛠️ 技术特性

- **智能Token估算** - 针对中英文混合文本优化的Token计算算法
- **多种检测方式** - 支持点击发送按钮、Enter键、Shift+Enter等多种输入方式
- **防抖处理** - 避免重复监控和误触发
- **本地存储** - 使用localStorage持久化数据
- **响应式设计** - 适配不同屏幕尺寸
- **性能优化** - 高效的DOM查询和事件监听

## 🌐 支持平台

- ✅ [Google Gemini](https://gemini.google.com)
- ✅ [ChatGPT](https://chatgpt.com)
- ✅ [OpenAI Chat](https://chat.openai.com)

## 📝 更新日志

### v1.0 (2024-11-19)
- 🎉 首次发布
- ✨ 支持Gemini和ChatGPT监控
- 🎨 12种主题配色
- 📊 统计报告功能
- 💾 数据持久化
- 🖱️ 可拖拽面板

## 🤝 贡献指南

欢迎提交Issue和Pull Request!

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 💖 支持项目

如果这个项目对你有帮助,请给个 ⭐️ Star 支持一下!

---

<a name="english"></a>

## ✨ Features

- 🎯 **Real-time Monitoring** - Accurately track response time from question submission to first token output
- 📊 **Token Statistics** - Intelligently estimate token consumption for each conversation (supports Chinese and English)
- 💾 **Data Persistence** - Automatically save historical statistics to local storage
- 🎨 **12 Themes** - Support 12 beautiful color themes with real-time switching without refresh
- 📈 **Statistical Reports** - Generate detailed statistical reports, support HTML/JSON export
- 🖱️ **Draggable Panel** - Monitoring panel can be freely dragged to any position
- 🌈 **Anime Style** - Beautiful UI design with animation effects
- 🔄 **Auto Detection** - Intelligently detect send button and Enter key, no manual operation required

## 🎨 Theme Preview

Support 12 color themes:
- 🔵 Blue (Default)
- 🟣 Purple
- 🩷 Pink
- 🟢 Green
- 🔵 Cyan
- 🟠 Orange
- 🔴 Red
- 🟡 Yellow
- 🟣 Indigo
- 🔷 Teal
- 🟢 Lime
- ⚪ Slate

## 📦 Installation

### Prerequisites
- Install [Tampermonkey](https://www.tampermonkey.net/) browser extension

### Installation Steps
1. Click [Install Script](https://github.com/YOUR_USERNAME/ai-monitor/raw/main/ai-monitor.user.js)
2. Tampermonkey will automatically open the installation page
3. Click the "Install" button
4. Visit [Gemini](https://gemini.google.com) or [ChatGPT](https://chatgpt.com) to use

## 🚀 Usage

### Basic Usage
1. Visit supported AI platforms (Gemini/ChatGPT)
2. The monitoring panel will automatically appear in the upper right corner
3. After sending a question, the script will automatically start monitoring
4. Real-time display of response time, token count, and character count

### Function Buttons
- 🎨 **Theme Switch** - Click the palette icon to select your favorite color scheme
- **−/+** - Collapse/Expand monitoring panel
- 📊 **Statistics Report** - View detailed historical statistics
- 🔄 **Reset Statistics** - Clear all historical data

### Statistics Report Features
Click the 📊 button to view detailed statistics, including:
- 📈 Overall Statistics (response count, total time, total tokens, total characters)
- 📊 Average Data (average response time, average tokens, average characters)
- 💡 Efficiency Analysis (tokens/second, characters/second)
- 📥 Support JSON data export
- 💾 Support HTML report download
- 🖨️ Support report printing
- 🔗 Support statistics sharing

## 📊 Monitoring Metrics

| Metric | Description |
|--------|-------------|
| ⚡ Status | Current monitoring status (Ready/Waiting/Receiving/Complete) |
| ⏱ Response Time | Time from send to first token output (milliseconds) |
| 🎯 Tokens | Estimated token count for current response |
| 💎 Total Tokens | Cumulative total token consumption |
| 📝 Characters | Character count of current response |
| ✍ Total Characters | Cumulative total character output |
| ⏰ Time Wasted | Total time waiting for AI responses |

## 🛠️ Technical Features

- **Smart Token Estimation** - Optimized token calculation algorithm for mixed Chinese-English text
- **Multiple Detection Methods** - Support click send button, Enter key, Shift+Enter and other input methods
- **Debounce Processing** - Avoid duplicate monitoring and false triggers
- **Local Storage** - Use localStorage for data persistence
- **Responsive Design** - Adapt to different screen sizes
- **Performance Optimization** - Efficient DOM queries and event listening

## 🌐 Supported Platforms

- ✅ [Google Gemini](https://gemini.google.com)
- ✅ [ChatGPT](https://chatgpt.com)
- ✅ [OpenAI Chat](https://chat.openai.com)

## 📝 Changelog

### v1.0 (2024-11-19)
- 🎉 Initial release
- ✨ Support Gemini and ChatGPT monitoring
- 🎨 12 theme color schemes
- 📊 Statistics report feature
- 💾 Data persistence
- 🖱️ Draggable panel

## 🤝 Contributing

Issues and Pull Requests are welcome!

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## 💖 Support

If this project helps you, please give it a ⭐️ Star!

---

<div align="center">

Made with ❤️ by AI Monitor Team

</div>