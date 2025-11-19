# 截图说明 / Screenshots Guide

本文档说明如何为项目添加截图以及截图的命名规范。

This document explains how to add screenshots to the project and naming conventions.

---

## 📁 目录结构 / Directory Structure

```
ai-monitor/
├── screenshots/           # 截图文件夹
│   ├── main-panel.png    # 主面板截图
│   ├── theme-picker.png  # 主题选择器截图
│   ├── stats-report.png  # 统计报告截图
│   ├── themes/           # 主题截图文件夹
│   │   ├── blue.png
│   │   ├── purple.png
│   │   ├── pink.png
│   │   └── ...
│   └── demo/             # 演示截图
│       ├── gemini-demo.png
│       └── chatgpt-demo.png
```

## 📸 需要的截图 / Required Screenshots

### 1. 主面板截图 (main-panel.png)
- **内容**: 显示完整的监控面板
- **要求**: 
  - 包含所有监控指标
  - 显示实际数据(非默认值)
  - 清晰可见所有按钮
- **尺寸**: 建议 800x600 或更高
- **格式**: PNG

### 2. 主题选择器 (theme-picker.png)
- **内容**: 打开的主题选择器面板
- **要求**:
  - 显示所有12种颜色选项
  - 高亮当前选中的主题
- **尺寸**: 建议 400x300
- **格式**: PNG

### 3. 统计报告 (stats-report.png)
- **内容**: 完整的统计报告页面
- **要求**:
  - 显示所有统计数据
  - 包含图表和进度条
  - 显示所有功能按钮
- **尺寸**: 建议 1200x800 或全屏
- **格式**: PNG

### 4. 主题截图 (themes/*.png)
为每个主题创建一张截图:
- `blue.png` - 蓝色主题
- `purple.png` - 紫色主题
- `pink.png` - 粉色主题
- `green.png` - 绿色主题
- `cyan.png` - 青色主题
- `orange.png` - 橙色主题
- `red.png` - 红色主题
- `yellow.png` - 黄色主题
- `indigo.png` - 靛蓝主题
- `teal.png` - 青绿主题
- `lime.png` - 柠檬绿主题
- `slate.png` - 灰色主题

**要求**:
- 每张截图显示该主题下的监控面板
- 包含实际数据
- 尺寸统一: 600x400
- 格式: PNG

### 5. 演示截图 (demo/*.png)
- `gemini-demo.png` - 在 Gemini 上的使用演示
- `chatgpt-demo.png` - 在 ChatGPT 上的使用演示

**要求**:
- 显示完整的浏览器窗口
- 包含 AI 对话界面和监控面板
- 展示实际使用场景
- 尺寸: 1920x1080 或实际屏幕分辨率
- 格式: PNG

## 🎨 截图规范 / Screenshot Guidelines

### 质量要求
- **分辨率**: 高清,至少 72 DPI
- **格式**: PNG (支持透明背景)
- **压缩**: 适当压缩以减小文件大小(建议 < 500KB)
- **清晰度**: 文字清晰可读

### 内容要求
- **隐私**: 不包含个人敏感信息
- **语言**: 优先使用中文界面
- **数据**: 使用真实但非敏感的示例数据
- **完整性**: 截图完整,不裁剪关键部分

### 命名规范
- 使用小写字母
- 使用连字符 `-` 分隔单词
- 使用描述性名称
- 示例: `main-panel.png`, `theme-blue.png`

## 📝 如何添加截图 / How to Add Screenshots

### 方法 1: 直接上传
1. 在 GitHub 仓库中创建 `screenshots` 文件夹
2. 上传截图文件
3. 在 README.md 中引用

### 方法 2: 使用 Git
```bash
# 创建截图文件夹
mkdir -p screenshots/themes screenshots/demo

# 添加截图文件
git add screenshots/

# 提交
git commit -m "docs: 添加项目截图"

# 推送
git push
```

## 🔗 在文档中引用截图 / Reference Screenshots in Docs

### Markdown 语法
```markdown
![主面板](screenshots/main-panel.png)

![蓝色主题](screenshots/themes/blue.png)
```

### HTML 语法(带尺寸控制)
```html
<img src="screenshots/main-panel.png" alt="主面板" width="600">
```

### 居中显示
```html
<div align="center">
  <img src="screenshots/main-panel.png" alt="主面板" width="600">
</div>
```

## 📋 截图清单 / Screenshot Checklist

在提交 PR 前,确保:

- [ ] 所有必需的截图都已添加
- [ ] 截图质量符合要求
- [ ] 文件命名符合规范
- [ ] 文件大小合理(< 500KB)
- [ ] 在 README.md 中正确引用
- [ ] 不包含敏感信息
- [ ] 截图清晰可读

## 🎯 示例 / Examples

### 好的截图示例 ✅
- 高清晰度
- 完整的界面
- 真实的使用场景
- 适当的文件大小

### 不好的截图示例 ❌
- 模糊不清
- 裁剪不当
- 包含敏感信息
- 文件过大

## 💡 提示 / Tips

1. **使用截图工具**
   - Windows: Snipping Tool, Snip & Sketch
   - macOS: Command + Shift + 4
   - Linux: GNOME Screenshot, Flameshot
   - 浏览器扩展: Awesome Screenshot

2. **优化截图**
   - 使用 TinyPNG 或 ImageOptim 压缩
   - 保持清晰度的同时减小文件大小
   - 考虑使用 WebP 格式(更小的文件)

3. **保持一致性**
   - 所有截图使用相同的浏览器
   - 统一的窗口大小
   - 一致的缩放比例

## 📞 需要帮助? / Need Help?

如果你在添加截图时遇到问题:
- 查看现有的截图作为参考
- 在 Issue 中寻求帮助
- 参考 CONTRIBUTING.md

---

<div align="center">

感谢你为项目文档做出贡献! 📸

Thank you for contributing to project documentation! 📸

</div>