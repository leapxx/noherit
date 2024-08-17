# 非物质文化遗产展示应用

这是一个展示非物质文化遗产的 Web 应用，使用 React 构建前端，Node.js 和 Express 构建后端。

## 功能特性

- 首页随机展示非遗图片
- 点击图片查看详细信息
- 与 AI 助手对话，获取更多信息

## 运行步骤

1. 克隆仓库
   ```
   git clone https://github.com/your-username/intangible-cultural-heritage-app.git
   cd intangible-cultural-heritage-app
   ```

2. 安装依赖
   ```
   cd server
   npm install
   cd ../client
   npm install
   ```

3. 启动后端服务器
   ```
   cd ../server
   npm start
   ```

4. 启动前端开发服务器
   ```
   cd ../client
   npm start
   ```

5. 打开浏览器访问 `http://localhost:3000`

## 技术栈

- 前端：React, React Router
- 后端：Node.js, Express
- 样式：CSS

## 注意事项

- 本示例使用模拟数据，实际部署时需要替换为真实的数据源和 AI 服务。
- 图片资源需要放在 `client/public/images/` 目录下。
- 生产环境部署时，需要先构建 React 应用（`npm run build`），然后通过 Express 服务静态文件。
