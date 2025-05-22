# GitHub发布指南

本指南将帮助您将AI采用程度评估工具发布到GitHub上开源。

## 步骤一：准备工作

1. 确保您已经安装了Git
2. 如果没有GitHub账号，请先[注册GitHub账号](https://github.com/join)
3. 在本地项目中，我们已经添加了以下文件：
   - LICENSE: MIT许可证
   - 更新后的.gitignore文件
   - 改进的README.md

## 步骤二：创建GitHub仓库

1. 登录您的GitHub账号
2. 点击右上角的"+"图标，选择"New repository"
3. 填写仓库信息：
   - Repository name: evalAI
   - Description: 评估任务中AI介入适宜程度的Web应用
   - 选择"Public"
   - 不要勾选"Initialize this repository with a README"
   - 点击"Create repository"

## 步骤三：上传项目到GitHub

打开命令提示符(CMD)，然后运行以下命令：

```bash
# 切换到项目目录
cd D:\Developer\AI_rating\ai-adoption-calculator

# 初始化git仓库
git init

# 添加远程仓库
git remote add origin https://github.com/raphaelxiao/evalAI.git

# 添加所有文件到暂存区
git add .

# 提交更改
git commit -m "初始版本：AI采用程度评估工具"

# 推送到GitHub (master分支)
git push -u origin master
```

如果您使用的是`main`分支而不是`master`分支，请将最后一条命令改为：

```bash
git push -u origin main
```

## 步骤四：添加应用截图

1. 运行应用：`npm start`
2. 使用浏览器开发者工具调整到移动和桌面视图，分别截图
3. 将截图保存为`screenshot-mobile.png`和`screenshot-desktop.png`
4. 添加截图到仓库：

```bash
git add screenshot-mobile.png screenshot-desktop.png
git commit -m "添加应用截图"
git push origin master  # 或 main
```

## 步骤五：启用GitHub Pages (可选)

如果您想让他人直接在线体验您的应用：

1. 构建生产版本：`npm run build`
2. 安装gh-pages包：`npm install --save-dev gh-pages`
3. 在package.json中添加：
   ```json
   "homepage": "https://你的用户名.github.io/evalAI",
   "scripts": {
     // 其他脚本...
     "predeploy": "npm run build",
     "deploy": "gh-pages -d build"
   }
   ```
4. 部署到GitHub Pages：`npm run deploy`
5. 在GitHub仓库设置中启用GitHub Pages，选择gh-pages分支

## 步骤六：完善项目信息

1. 在GitHub上添加项目标签(Topics)，如：ai, react, material-ui, assessment-tool等
2. 完善README.md中的链接和信息
3. 考虑添加CONTRIBUTING.md文件，说明如何参与贡献

## 注意事项

- 确保不要上传敏感信息
- 定期更新依赖包以修复安全漏洞
- 及时回应Issue和Pull Request

## 维护建议

- 使用Semantic Versioning管理版本
- 添加CHANGELOG.md记录更新内容
- 考虑添加自动化测试
- 使用GitHub Actions自动构建和部署 