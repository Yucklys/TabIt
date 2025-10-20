# Tab Sense - AI 驱动的 Chrome 标签页管理器

Tab Sense 是一个智能的 Chrome 浏览器扩展，使用 AI 技术来自动归纳和管理您的标签页，帮助您提高浏览效率。

## ✨ 主要功能

### 🤖 AI 智能分组
- 自动将标签页按类别分组（工作学习、社交媒体、新闻资讯、购物消费、娱乐休闲、技术开发、生活服务等）
- 基于页面内容、标题、域名等多维度信息进行智能分类
- 支持中文和英文网站的分类识别

### 📊 AI 智能总结
- 提供标签页使用统计和分析
- 生成个性化的浏览洞察和建议
- 显示热门网站和分类分布
- 提供性能优化和安全建议

### 🎯 标签页管理
- 查看所有当前标签页
- 一键打开或关闭标签页
- 显示标签页的访问时间和网站图标
- 支持标签页的快速操作

## 🚀 快速开始

### 安装扩展

1. **构建扩展**
   ```bash
   npm install
   npm run build
   ```

2. **加载到 Chrome**
   - 打开 Chrome 浏览器
   - 访问 `chrome://extensions/`
   - 开启"开发者模式"
   - 点击"加载已解压的扩展程序"
   - 选择 `build` 文件夹

3. **开始使用**
   - 点击浏览器工具栏中的 Tab Sense 图标
   - 查看您的标签页列表
   - 点击"AI 分组"进行智能分类
   - 点击"AI 总结"查看分析报告

## 🛠️ 开发指南

### 技术栈
- **前端**: React + TypeScript + Vite
- **扩展**: Chrome Extension Manifest V3
- **样式**: CSS3 + 现代设计系统
- **AI**: 基于规则的智能分类算法

### 项目结构
```
TabSense/
├── src/                    # React 源代码
│   ├── App.tsx            # 主应用组件
│   ├── App.css            # 样式文件
│   └── aiService.ts       # AI 服务模块
├── public/                 # 静态资源
│   ├── manifest.json      # 扩展清单
│   ├── background.js      # 后台脚本
│   └── content.js         # 内容脚本
├── build/                  # 构建输出
└── package.json           # 项目配置
```

### 本地开发

1. **安装依赖**
   ```bash
   npm install
   ```

2. **启动开发服务器**
   ```bash
   npm run dev
   ```

3. **构建扩展**
   ```bash
   npm run build
   ```

### 自定义 AI 分类

您可以在 `src/aiService.ts` 中自定义分类规则：

```typescript
const categories: AICategory[] = [
  {
    name: '自定义分类',
    description: '分类描述',
    keywords: ['关键词1', '关键词2'],
    color: '#颜色代码'
  }
];
```

## 🔧 功能详解

### AI 分组算法
- **关键词匹配**: 基于页面标题、内容、URL 中的关键词
- **域名识别**: 识别知名网站的特殊域名
- **路径分析**: 分析 URL 路径模式
- **内容分析**: 提取页面主要内容进行语义分析

### 智能总结功能
- **使用统计**: 标签页数量、域名多样性分析
- **时间分析**: 最近访问时间分布
- **性能建议**: 基于标签页数量和类型的优化建议
- **安全提醒**: 检测可疑网站和 HTTP 连接

## 📱 界面预览

- **标签页列表**: 显示所有当前标签页，支持快速操作
- **AI 分组**: 按类别展示标签页，便于管理
- **AI 总结**: 提供详细的使用分析和建议

## 🔒 隐私保护

- 所有数据处理都在本地进行
- 不会向外部服务器发送任何用户数据
- 标签页内容仅用于本地分类分析
- 支持 Chrome 的隐私保护政策

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 🙏 致谢

- React 团队提供的优秀框架
- Chrome Extensions API 文档
- 所有贡献者和用户的支持

---

**Tab Sense** - 让 AI 帮您管理标签页，提高浏览效率！ 🚀
