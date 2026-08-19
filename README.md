# InDigiTwin-AI 工业数字孪生平台

基于 WebGL 的工业数字孪生平台，集成 3D 模型可视化、AI 缺陷检测、数据告警、场景配置、权限管理和数据报表等能力。

以work/ui-reference/目录下的UI设计稿为标准图，生成3D模型的真实GLB；检查整体代码，优化UI布局和代码结构，减少冗余代码和控制台报错，达到真实可靠，体验优良，实现生产环境部署上线的效果。

解决步骤：

- `git pull --rebase origin main` — 把本地提交 `rebase` 到远程头上
- 3 次冲突全部是 `._Deploy.command`（我们刚清理的 macOS 元数据文件），全部用 `git rm ._Deploy.command` 丢弃
- `git rebase --continue` — 最终 `rebase` 成功
- `git push origin main` → `Everything up-to-date` ✅

## 技术栈

- **构建工具**: Vite 5
- **框架**: React 18 + TypeScript
- **3D 渲染**: Three.js + @react-three/fiber + @react-three/drei
- **UI 组件**: Ant Design 5（工业深色主题定制）
- **图表**: ECharts 5
- **状态管理**: Zustand
- **路由**: React Router v6
- **包管理器**: pnpm

## 功能模块

<!-- prettier-ignore-start -->
| 页面 | 路由 | 核心功能 |
|---|---|---|
| 3D 数字孪生主场景 | `/scene` | 模型加载、爆炸拆解、剖切、视角漫游、设备测点、告警定位 |
| AI 缺陷检测 | `/ai-detect` | 图片/摄像头上传、AI 推理、缺陷标注、置信度分析 |
| 数据告警列表 | `/alarm` | 告警筛选、表格管理、3D 定位联动、趋势统计 |
| 场景工程配置 | `/project` | 模型上传、LOD/Draco 配置、工程管理 |
| 系统权限管理 | `/permission` | 角色管理、权限开关、用户管理 |
| 数据报表统计 | `/report` | 统计卡片、健康趋势、缺陷统计、健康率环形图 |
<!-- prettier-ignore-end -->

## 快速开始

### 环境要求

- Node.js >= 22
- pnpm >= 9

### 安装依赖

```bash
pnpm install
```

> 首次安装后如果提示 `Ignored build scripts: esbuild`，请运行 `pnpm approve-builds` 并选择允许 esbuild 构建脚本。

### 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:5173

### 类型检查

```bash
pnpm build
```

### 生产构建

```bash
pnpm build
```

## 项目结构

```
src/
├── assets/              # 静态资源（样式、图标）
│   └── styles/          # 全局样式、CSS Variables、AntD 主题
├── components/          # 组件
│   ├── layout/          # 布局组件（Header/Sidebar/RightPanel/StatusBar）
│   ├── 3d/              # 3D 组件（SceneCanvas/ModelExplode）
│   ├── ui/              # 基础 UI 组件
│   └── business/        # 业务组件
├── pages/               # 6 个业务页面
├── store/               # Zustand 状态管理
├── services/mock/       # Mock 数据
├── types/               # TypeScript 类型定义
├── router/              # 路由配置
├── hooks/               # 自定义 Hooks
├── utils/               # 工具函数
├── App.tsx              # 根组件
└── main.tsx             # 入口文件
```

## 设计系统

工业深色 B 端风格，主色 `#0F2447`，完整设计 Token 见 `src/assets/styles/variables.css`。

## 3D 模型说明

当前使用程序化生成的工业设备占位模型（电机+泵组），无需外部模型文件即可运行。

如需替换为真实 GLB 模型：

1. 将模型文件放入 `public/models/`
2. 修改 `src/components/3d/ModelExplode.tsx`，使用 `useGLTF` 加载模型

## 文档

- `work/01-技术方案与实现思路.md` — 整体技术方案
- `work/02-核心资料与资源汇总.md` — 设计系统、组件规范、页面结构
- `docs/` — 原始需求文档和 UI 参考图

# 兼容处理部署脚本

```bash
git pull --rebase origin main

git rebase --continue

git push origin main
```
