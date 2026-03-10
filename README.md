# 博物馆知识图谱交互系统（前端）

面向游客的博物馆知识图谱可视化交互系统。通过知识图谱展示文物之间的关联关系，提供自然语言问答与智能推荐，帮助用户探索和了解博物馆馆藏文物。

## 技术栈

| 类别 | 技术 |
|------|------|
| 框架 | Vue 3 + TypeScript |
| 构建 | Vite 7 |
| 状态管理 | Pinia 3 |
| 路由 | Vue Router 4 |
| UI 组件库 | Element Plus |
| 图谱可视化 | vis-network |
| 图表 | ECharts（vue-echarts） |
| 网络请求 | Axios |
| 工具库 | VueUse |

## 功能模块

### 首页概览

- 系统介绍与功能入口
- 知识图谱统计卡片（节点数、关系数、文物数、实体类型数）
- ECharts 环形图展示实体类型数量分布

### 知识图谱探索

- 搜索框支持按文物名、人物、朝代等关键词检索
- vis-network 渲染图谱，10 种实体类型以不同颜色区分
- 支持缩放、拖拽、节点点击查看详情
- 双击节点展开邻居关系
- 右侧抽屉展示节点属性，可跳转文物详情页

### 智能问答

- 聊天式交互界面
- 调用后端 `/api/v1/qa/ask` 接口回答用户自然语言问题
- 展示 AI 返回的 Cypher 查询语句及命中实体
- 相关文物可点击跳转详情页
- 侧边栏提供推荐问题与使用提示

### 推荐发现

- 卡片网格布局展示推荐文物
- 每张卡片包含图片、标题、朝代/类别标签、摘要与推荐理由
- 匹配度百分比展示
- 点击卡片进入文物详情页

### 文物详情

- 图片轮播
- 基本信息（摘要 + infobox 属性表 + 标签）
- 迷你关系图谱展示该文物的知识图谱邻居
- 相关推荐文物列表
- 来源链接

## 项目结构

```
src/
├── api/                          # API 封装层
│   ├── request.ts                #   Axios 实例 + 拦截器
│   ├── graph.ts                  #   图谱搜索与邻居查询
│   ├── artifact.ts               #   文物详情
│   ├── qa.ts                     #   智能问答
│   ├── recommend.ts              #   相似推荐
│   ├── stats.ts                  #   统计概览
│   └── index.ts                  #   统一导出
├── mock/                         # Mock 数据层
│   ├── index.ts                  #   Mock 开关
│   ├── graph.ts                  #   图谱 Mock（15 节点 + 14 边）
│   ├── artifact.ts               #   文物 Mock（5 件文物）
│   ├── qa.ts                     #   问答 Mock
│   ├── recommend.ts              #   推荐 Mock
│   └── stats.ts                  #   统计 Mock
├── stores/                       # Pinia 状态管理
│   ├── graph.ts                  #   图谱 Store
│   ├── qa.ts                     #   问答 Store
│   └── index.ts
├── router/
│   └── index.ts                  # 路由配置
├── types/
│   └── index.ts                  # TypeScript 接口定义
├── components/
│   ├── layout/
│   │   └── AppLayout.vue         #   顶部导航 + 页脚布局
│   ├── graph/
│   │   ├── GraphCanvas.vue       #   vis-network 图谱画布
│   │   └── NodeDetailDrawer.vue  #   节点详情抽屉
│   ├── qa/
│   │   ├── ChatMessageList.vue   #   聊天消息列表
│   │   └── ChatInput.vue         #   聊天输入框
│   ├── recommend/
│   │   └── RecommendCard.vue     #   推荐卡片
│   └── artifact/
│       ├── ArtifactImageCarousel.vue   # 图片轮播
│       ├── ArtifactRelationGraph.vue   # 迷你关系图谱
│       └── ArtifactRelatedList.vue     # 相关推荐列表
├── views/                        # 页面视图
│   ├── HomeView.vue              #   首页概览
│   ├── GraphView.vue             #   知识图谱
│   ├── QAView.vue                #   智能问答
│   ├── RecommendView.vue         #   推荐发现
│   └── ArtifactDetailView.vue    #   文物详情
├── styles/
│   └── global.css                # 全局样式
├── main.ts                       # 应用入口
└── App.vue                       # 根组件
```

## 后端接口

本项目对接以下后端 API（默认代理到 `http://localhost:8000`）：

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/graph/search` | 图谱关键词搜索 |
| GET | `/api/v1/graph/neighbors/{artifact_id}` | 获取节点邻居 |
| GET | `/api/v1/artifacts/{artifact_id}` | 文物详情 |
| POST | `/api/v1/qa/ask` | 自然语言问答 |
| GET | `/api/v1/recommend/similar/{artifact_id}` | 相似文物推荐 |
| GET | `/api/v1/stats/overview` | 图谱统计概览 |

## 快速开始

### 环境要求

- Node.js >= 18
- npm >= 9

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

启动后访问 [http://localhost:3000](http://localhost:3000)。

### 生产构建

```bash
npm run build
```

构建产物输出到 `dist/` 目录，可部署到任意静态资源服务器。

### 预览构建产物

```bash
npm run preview
```

## Mock 数据

项目内置了完整的 Mock 数据层，后端未就绪时可直接使用 Mock 数据进行开发和演示。

- Mock 开关位于 `src/mock/index.ts`
- 当前默认为 `ENABLE_MOCK = true`（使用 Mock 数据）
- 后端就绪后将其改为 `false` 即可切换到真实接口，无需修改任何业务代码

## 图谱节点类型与颜色

| 类型 | 颜色 | 说明 |
|------|------|------|
| Artifact | 蓝色 `#409EFF` | 文物 |
| Person | 绿色 `#67C23A` | 人物 |
| Dynasty | 橙色 `#E6A23C` | 朝代 |
| Museum | 红色 `#F56C6C` | 博物馆 |
| Category | 灰色 `#909399` | 类别 |
| Material | 紫色 `#9B59B6` | 材质 |
| Location | 青色 `#1ABC9C` | 地点 |
| Event | 深红 `#E74C3C` | 事件 |
| Style | 蓝色 `#3498DB` | 风格 |
| Technique | 金色 `#F39C12` | 技法 |

## 许可证

本项目为毕业设计作品，仅供学习交流使用。
