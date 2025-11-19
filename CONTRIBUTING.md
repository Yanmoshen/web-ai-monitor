# 贡献指南 / Contributing Guide

感谢你考虑为 AI Monitor 做出贡献!

Thank you for considering contributing to AI Monitor!

[中文](#中文) | [English](#english)

---

<a name="中文"></a>

## 🤝 如何贡献

### 报告问题 (Bug Reports)

如果你发现了 bug,请创建一个 Issue 并包含以下信息:

1. **问题描述** - 清晰简洁地描述问题
2. **复现步骤** - 详细的复现步骤
3. **预期行为** - 你期望发生什么
4. **实际行为** - 实际发生了什么
5. **环境信息**
   - 浏览器版本
   - Tampermonkey 版本
   - AI 平台(Gemini/ChatGPT)
   - 操作系统
6. **截图** - 如果可能,提供截图

### 功能建议 (Feature Requests)

我们欢迎新功能建议!请创建 Issue 并说明:

1. **功能描述** - 详细描述你想要的功能
2. **使用场景** - 这个功能解决什么问题
3. **替代方案** - 你考虑过的其他解决方案
4. **附加信息** - 任何其他相关信息

### 提交代码 (Pull Requests)

#### 开发流程

1. **Fork 仓库**
   ```bash
   # 点击 GitHub 页面右上角的 Fork 按钮
   ```

2. **克隆你的 Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-monitor.git
   cd ai-monitor
   ```

3. **创建特性分支**
   ```bash
   git checkout -b feature/amazing-feature
   # 或
   git checkout -b fix/bug-fix
   ```

4. **进行修改**
   - 遵循代码风格指南
   - 添加必要的注释
   - 确保代码可读性

5. **测试你的修改**
   - 在 Gemini 和 ChatGPT 上测试
   - 测试不同的主题
   - 测试所有功能按钮

6. **提交修改**
   ```bash
   git add .
   git commit -m "feat: 添加某个功能"
   # 或
   git commit -m "fix: 修复某个问题"
   ```

7. **推送到你的 Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **创建 Pull Request**
   - 访问你的 Fork 页面
   - 点击 "New Pull Request"
   - 填写 PR 描述

#### Commit 消息规范

使用语义化的 commit 消息:

- `feat:` 新功能
- `fix:` 修复 bug
- `docs:` 文档更新
- `style:` 代码格式(不影响代码运行)
- `refactor:` 重构代码
- `perf:` 性能优化
- `test:` 测试相关
- `chore:` 构建过程或辅助工具的变动

示例:
```
feat: 添加深色模式支持
fix: 修复主题切换时的显示问题
docs: 更新安装说明
```

### 代码风格

- 使用 4 空格缩进
- 使用有意义的变量名
- 添加必要的注释(中文或英文)
- 保持代码简洁清晰
- 遵循现有代码的风格

### 测试清单

在提交 PR 前,请确保:

- [ ] 代码在 Gemini 上正常工作
- [ ] 代码在 ChatGPT 上正常工作
- [ ] 所有主题都能正常切换
- [ ] 统计功能正常工作
- [ ] 没有控制台错误
- [ ] 代码已添加必要注释
- [ ] 更新了相关文档(如需要)

## 📝 文档贡献

文档改进同样重要!你可以:

- 修正拼写或语法错误
- 改进现有文档的清晰度
- 添加使用示例
- 翻译文档到其他语言

## 🎨 设计贡献

如果你擅长设计,可以贡献:

- UI/UX 改进建议
- 新的主题配色方案
- 图标设计
- 截图和演示图片

## 💡 其他贡献方式

- ⭐ 给项目点 Star
- 📢 分享项目给其他人
- 💬 参与 Issue 讨论
- 📝 撰写使用教程或博客

## ❓ 需要帮助?

如果你在贡献过程中遇到问题:

1. 查看现有的 Issues 和 Pull Requests
2. 阅读项目文档
3. 创建新的 Issue 寻求帮助

## 📜 行为准则

- 尊重所有贡献者
- 保持友好和专业
- 接受建设性的批评
- 关注对项目最有利的事情

---

<a name="english"></a>

## 🤝 How to Contribute

### Bug Reports

If you find a bug, please create an Issue with:

1. **Description** - Clear and concise description
2. **Steps to Reproduce** - Detailed reproduction steps
3. **Expected Behavior** - What you expected to happen
4. **Actual Behavior** - What actually happened
5. **Environment**
   - Browser version
   - Tampermonkey version
   - AI Platform (Gemini/ChatGPT)
   - Operating System
6. **Screenshots** - If applicable

### Feature Requests

We welcome feature suggestions! Please create an Issue explaining:

1. **Feature Description** - Detailed description
2. **Use Case** - What problem does it solve
3. **Alternatives** - Other solutions you've considered
4. **Additional Context** - Any other relevant information

### Pull Requests

#### Development Workflow

1. **Fork the Repository**
   ```bash
   # Click the Fork button on GitHub
   ```

2. **Clone Your Fork**
   ```bash
   git clone https://github.com/YOUR_USERNAME/ai-monitor.git
   cd ai-monitor
   ```

3. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/bug-fix
   ```

4. **Make Changes**
   - Follow code style guidelines
   - Add necessary comments
   - Ensure code readability

5. **Test Your Changes**
   - Test on Gemini and ChatGPT
   - Test different themes
   - Test all feature buttons

6. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add some feature"
   # or
   git commit -m "fix: fix some bug"
   ```

7. **Push to Your Fork**
   ```bash
   git push origin feature/amazing-feature
   ```

8. **Create Pull Request**
   - Visit your fork page
   - Click "New Pull Request"
   - Fill in PR description

#### Commit Message Convention

Use semantic commit messages:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation update
- `style:` Code formatting
- `refactor:` Code refactoring
- `perf:` Performance improvement
- `test:` Testing related
- `chore:` Build process or auxiliary tools

Examples:
```
feat: add dark mode support
fix: fix theme switching display issue
docs: update installation instructions
```

### Code Style

- Use 4 spaces for indentation
- Use meaningful variable names
- Add necessary comments (Chinese or English)
- Keep code clean and simple
- Follow existing code style

### Testing Checklist

Before submitting PR, ensure:

- [ ] Code works on Gemini
- [ ] Code works on ChatGPT
- [ ] All themes switch correctly
- [ ] Statistics feature works
- [ ] No console errors
- [ ] Code has necessary comments
- [ ] Documentation updated (if needed)

## 📝 Documentation Contributions

Documentation improvements are equally important! You can:

- Fix spelling or grammar errors
- Improve clarity of existing docs
- Add usage examples
- Translate docs to other languages

## 🎨 Design Contributions

If you're good at design, you can contribute:

- UI/UX improvement suggestions
- New theme color schemes
- Icon designs
- Screenshots and demo images

## 💡 Other Ways to Contribute

- ⭐ Star the project
- 📢 Share the project
- 💬 Participate in Issue discussions
- 📝 Write tutorials or blog posts

## ❓ Need Help?

If you encounter problems while contributing:

1. Check existing Issues and Pull Requests
2. Read project documentation
3. Create a new Issue for help

## 📜 Code of Conduct

- Respect all contributors
- Be friendly and professional
- Accept constructive criticism
- Focus on what's best for the project

---

<div align="center">

Thank you for your contribution! 🎉

感谢你的贡献! 🎉

</div>