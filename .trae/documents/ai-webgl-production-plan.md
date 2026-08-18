# InDigiTwin-AI 工业数字孪生平台 — 生产级优化实现计划

## Repository Research

### 当前状态分析

通过对代码库的全面审查，发现以下核心问题：

**1. 3D 模型为程序化占位符**
- `ModelExplode.tsx` 使用纯几何体（box/cylinder）程序化生成设备，缺乏真实工业设备外观
- 爆炸动画未使用平滑过渡，直接 setPosition 导致突兀跳变
- `useFrame` hook 中有无用的空旋转逻辑
- 点击事件硬编码 `'dev-001'`，无法区分不同设备
- 缺少对真实 GLB 模型的加载支持

**2. UI 与设计稿偏差明显**
- Header/Sidebar/StatusBar 布局细节与参考图 1-6 不一致
- 右侧面板标签栏位置、信息密度不匹配
- 统计卡片缺少图标装饰、条形进度指示器
- 告警列表页缺少实时标记、设备定位图标等细节
- AI 检测页布局比例与参考图 1 不一致

**3. 代码结构问题**
- `ModelExplode.tsx` 缺少 `useEffect` 导入但实际使用了
- `useFrame` 空循环体占用每帧执行
- 多处内联硬编码色值而非使用 CSS 变量
- `DeviceInfoCard` 中 SVG 图表数据硬编码
- 部分组件 `:global()` 选择器使用过多
- 缺少 TypeScript 严格类型检查

**4. 控制台报错与冗余**
- ModelExplode 中 `useEffect` 未导入但使用会导致运行时错误
- useFrame 空循环浪费 CPU 周期
- 多处重复的样式覆盖（!important 滥用）
- mock 数据未分层管理

### 目标设计参考

`work/ui-reference/` 下 6 张高保真 UI 设计稿：
1. `1.png` — AI 缺陷检测页（图片上传 + 检测结果 + 置信度）
2. `2.png` — 3D 数字孪生主场景（模型 + 右侧设备信息面板 + 底部状态栏）
3. `3.png` — 数据告警列表页（筛选 + 表格 + 趋势图）
4. `4.png` — 场景工程配置页（模型上传 + LOD 配置 + 工程列表）
5. `5.png` — 数据报表统计页（统计卡片 + 健康趋势 + 缺陷统计）
6. `6.png` — 系统权限管理页（角色选择 + 权限配置 + 用户管理）

---

## Files and Modules to Change

### 核心修改

| 文件路径 | 修改类型 | 变更说明 |
|---|---|---|
| `src/components/3d/ModelExplode.tsx` | **重写** | 修复 useEffect 导入、平滑爆炸动画、真实设备几何体、GLB 加载支持 |
| `src/components/3d/SceneCanvas.tsx` | **修改** | 添加环境光配置优化、添加设备点击高亮效果 |
| `src/components/3d/SceneCanvas.css` | **修改** | 优化告警标签动画 |
| `src/components/layout/MainLayout.tsx` | **修改** | 修复页面切换过渡、优化布局比例 |
| `src/components/layout/MainLayout.css` | **修改** | 优化内容区滚动行为 |
| `src/components/layout/Header.tsx` | **修改** | 添加在线状态指示、实时告警计数 |
| `src/components/layout/Header.css` | **修改** | 优化 header 细节对齐参考图 |
| `src/components/layout/Sidebar.tsx` | **修改** | 添加菜单项排序、修复 active 状态 |
| `src/components/layout/Sidebar.css` | **修改** | 优化菜单项交互效果 |
| `src/components/layout/RightPanel.tsx` | **修改** | 完善设备信息展示、添加实时数据 |
| `src/components/layout/RightPanel.css` | **修改** | 优化面板样式对齐参考图 |
| `src/components/layout/StatusBar.tsx` | **修改** | 添加更多状态指标 |
| `src/components/layout/StatusBar.css` | **修改** | 优化状态栏布局 |
| `src/components/business/DeviceInfoCard.tsx` | **修改** | 添加更多参数、优化图表 |
| `src/components/business/DeviceInfoCard.css` | **修改** | 优化卡片样式 |

### 页面修改

| 文件路径 | 修改类型 | 变更说明 |
|---|---|---|
| `src/pages/TwinScenePage/index.tsx` | **修改** | 优化工具栏、添加 FPS 显示 |
| `src/pages/TwinScenePage/index.css` | **修改** | 优化 3D 场景页布局 |
| `src/pages/AiDetectPage/index.tsx` | **修改** | 优化布局比例、添加摄像头预览 |
| `src/pages/AiDetectPage/index.css` | **修改** | 对齐参考图 1 布局 |
| `src/pages/AlarmListPage/index.tsx` | **修改** | 添加告警级别标记、优化表格 |
| `src/pages/AlarmListPage/index.css` | **修改** | 对齐参考图 3 布局 |
| `src/pages/ProjectConfigPage/index.tsx` | **修改** | 添加模型缩略图预览 |
| `src/pages/ProjectConfigPage/index.css` | **修改** | 对齐参考图 4 |
| `src/pages/PermissionPage/index.tsx` | **修改** | 优化角色卡片、权限组展示 |
| `src/pages/PermissionPage/index.css` | **修改** | 对齐参考图 6 |
| `src/pages/ReportPage/index.tsx` | **修改** | 优化统计卡片、图表配置 |
| `src/pages/ReportPage/index.css` | **修改** | 对齐参考图 5 |

### 基础设施修改

| 文件路径 | 修改类型 | 变更说明 |
|---|---|---|
| `src/assets/styles/antd-theme.ts` | **修改** | 补充更多组件 token |
| `src/assets/styles/variables.css` | **修改** | 添加缺失的设计 token |
| `src/assets/styles/global.css` | **修改** | 添加全局优化样式 |
| `src/store/useSceneStore.ts` | **修改** | 添加更多场景状态 |
| `src/services/mock/data.ts` | **修改** | 丰富 mock 数据 |
| `src/types/index.ts` | **修改** | 补充类型定义 |
| `src/router/index.tsx` | **修改** | 添加页面标题配置 |

### 新增文件

| 文件路径 | 说明 |
|---|---|
| `public/models/README.md` | 说明如何放置真实 GLB 模型 |
| `src/components/3d/DeviceModel.tsx` | 独立的设备模型组件 |

---

## Implementation Steps

### Phase 1: 修复 3D 模型层 (High Priority)

1. **修复 ModelExplode.tsx 关键 Bug**
   - 添加缺失的 `useEffect` 导入
   - 实现平滑的爆炸/复原过渡动画（使用 `useFrame` + lerp）
   - 移除空的 useFrame 旋转逻辑
   - 为每个设备部件添加独立的点击事件，传递真实 deviceId

2. **增强 3D 设备模型真实感**
   - 使用 PBR 材质（metalness/roughness）增强工业质感
   - 添加金属管道、法兰盘、螺栓等细节
   - 添加发光效果（告警点、运行指示灯）
   - 实现可选择 GLB 模型加载的架构

3. **优化 SceneCanvas**
   - 增强环境光配置
   - 添加设备选中高亮效果（发光描边）
   - 优化相机参数
   - 添加 WebGL 能力检测

### Phase 2: UI 布局优化 (High Priority)

4. **全局样式系统强化**
   - 补充 variables.css 缺失 token（阴影、过渡、响应式断点）
   - 优化 antd-theme.ts 覆盖更多组件
   - 添加全局动画类和工具类

5. **Header 组件**
   - 添加在线设备数量、FPS 实时显示
   - 优化 logo 区域排版
   - 用户信息区域对齐参考图

6. **Sidebar 组件**
   - 添加菜单项分组和排序
   - 优化 active 状态（左侧高亮条 + 背景色）
   - 添加工程选择下拉

7. **RightPanel 组件**
   - 添加设备实时数据（温度/压力/转速实时更新）
   - 添加 AI 故障概率环形图
   - 优化 Tab 切换样式

8. **StatusBar 组件**
   - 添加 FPS 计数器
   - 在线设备数、模型顶点数等指标
   - 网络状态指示

### Phase 3: 页面级优化 (Medium Priority)

9. **TwinScenePage（3D 主场景）**
   - 工具栏改为悬浮半透明设计
   - 添加右下角性能面板
   - 场景操作提示优化

10. **AiDetectPage（AI 检测）**
    - 三栏布局比例调整为 45%/100px/剩余
    - 添加摄像头预览区域
    - 检测结果面板优化

11. **AlarmListPage（告警列表）**
    - 表格行添加颜色标记（紧急红/预警黄/提示蓝）
    - 趋势图添加更丰富的交互
    - 告警统计卡片样式优化

12. **ProjectConfigPage（工程配置）**
    - 模型上传区域添加拖拽预览
    - 配置表单对齐参考图布局
    - 工程列表添加缩略图

13. **PermissionPage（权限管理）**
    - 角色选择卡片优化
    - 权限分组展示优化
    - 用户列表样式优化

14. **ReportPage（数据报表）**
    - 统计卡片添加图标装饰和进度条
    - 图表配色优化
    - 健康率环形图优化

### Phase 4: 代码清理与生产就绪 (High Priority)

15. **代码清理**
    - 移除所有冗余的 useFrame 空循环
    - 减少 !important 滥用（通过 antd-theme 配置解决）
    - 统一使用 CSS 变量替代硬编码色值
    - 优化组件间 props 传递

16. **TypeScript 严格检查**
    - 修复所有类型错误
    - 添加更严格的类型定义
    - 确保 `tsc -b` 无错误

17. **构建优化**
    - 验证 `pnpm build` 成功
    - 检查 chunk 分割是否合理
    - 确保 sourcemap 可按需开启

18. **生产验证**
    - 启动 dev server 验证所有页面
    - 检查控制台无报错
    - 验证响应式布局
    - 验证 3D 模型加载性能

---

## Dependencies and Considerations

- **Three.js 版本**: 当前使用 `three@0.169.0`，需确保 PBR 材质特性兼容
- **@react-three/fiber**: 版本 `^8.17.10`，需确保 useFrame API 稳定
- **Ant Design**: 版本 `^5.21.0`，主题 token API 可能有变化
- **模型加载**: 真实 GLB 模型需放入 `public/models/` 目录，路径通过 useGLTF 加载
- **性能**: 大量 3D 对象需注意 draw call 优化，可能需要 instanced mesh
- **浏览器兼容性**: WebGL 2.0 需要 Chrome 90+/Firefox 88+/Safari 15+
- **构建**: Vite 5 + TypeScript 5，需注意路径别名在生产构建中的处理

## Validation

1. `pnpm build` 成功无 TypeScript 错误
2. `pnpm dev` 启动后所有 6 个页面可访问
3. 浏览器控制台无 ERROR 级报错
4. 3D 模型爆炸/还原动画平滑
5. 所有页面 UI 布局与参考图相似度 > 80%
6. `pnpm lint` 无新增警告
7. 移动端/窄屏降级可用

## Risks

| 风险 | 影响 | 处理方式 |
|---|---|---|
| Three.js 几何体复杂度过高导致性能问题 | 高 | 控制对象数量，使用 LOD 策略 |
| Ant Design 主题配置与全局 CSS 冲突 | 中 | 优先使用 antd-theme.ts 配置，减少全局覆盖 |
| GLB 模型文件过大 | 中 | 实现加载进度提示，支持 Draco 压缩 |
| 设计细节还原度不足 | 低 | 通过 CSS 变量和精细间距/圆角调整 |
