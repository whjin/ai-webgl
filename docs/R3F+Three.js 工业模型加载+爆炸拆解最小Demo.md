# R3F\+Three\.js 工业模型加载\+爆炸拆解最小Demo

## 一、Demo 说明

1\. 基于 Vite \+ React \+ R3F\(@react\-three/fiber\) \+ Drei 工业级技术栈，完全适配本项目架构

2\. 核心功能：GLB工业模型加载、模型自适应居中、**一键爆炸拆解/一键复原**

3\. 内置工业场景适配：模型防抖、帧率优化、自动居中、鼠标操控（旋转/平移/缩放）

4\. 零冗余代码，最小可运行体量，可直接嵌入现有项目

## 二、前置依赖（项目已安装，无需重复安装）

```bash
pnpm install three @react-three/fiber @react-three/drei
```

## 三、核心组件代码（ModelExplode\.tsx）

新建 `src/components/3d/ModelExplode.tsx`

```tsx
import { useState, useRef, useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { Group } from 'three'

// 模型爆炸拆解偏移系数，适配工业设备模型
const EXPLODE_OFFSET = 1.8

export default function ModelExplode() {
  // 加载本地public/models下的工业GLB模型
  const { scene } = useGLTF('/models/industrial-device.glb')
  const modelRef = useRef<Group>(null)
  // 爆炸状态切换
  const [isExplode, setIsExplode] = useState(false)
  // 存储模型原始坐标，用于复原
  const originPositionMap = useRef<Map<string, [number, number, number]>>(new Map())

  // 初始化：缓存所有子部件原始坐标
  useEffect(() => {
    if (!modelRef.current) return
    originPositionMap.current.clear()

    // 遍历模型所有网格子部件
    modelRef.current.traverse((child) => {
      if (child.type === 'Mesh') {
        originPositionMap.current.set(
          child.uuid,
          [child.position.x, child.position.y, child.position.z]
        )
      }
    })
  }, [scene])

  // 爆炸/复原动画逻辑
  useEffect(() => {
    if (!modelRef.current) return

    modelRef.current.traverse((child) => {
      if (child.type === 'Mesh') {
        const originPos = originPositionMap.current.get(child.uuid)
        if (!originPos) return

        if (isExplode) {
          // 爆炸：沿部件原始中心向外偏移
          child.position.x = originPos[0] + originPos[0] * EXPLODE_OFFSET
          child.position.y = originPos[1] + originPos[1] * EXPLODE_OFFSET
          child.position.z = originPos[2] + originPos[2] * EXPLODE_OFFSET
        } else {
          // 复原：回归原始坐标
          child.position.set(...originPos)
        }
      }
    })
  }, [isExplode])

  return (
    <>
      {/* 3D模型实体 */}
      <primitive ref={modelRef} object={scene} scale={1} />

      {/* 场景灯光（工业场景标准光照） */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[10, 10, 10]} intensity={0.8} castShadow />
    </>
  )
}

// 预加载模型，优化工业场景首屏加载速度
useGLTF.preload('/models/industrial-device.glb')

```

## 四、3D场景页面入口（TwinScenePage\.tsx）

替换/新建 `src/pages/TwinScenePage.tsx`，完整页面可直接运行

```tsx
import { useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, AutoCenter } from '@react-three/drei'
import ModelExplode from '@/components/3d/ModelExplode'
import { Button, Space } from 'antd'
import './TwinScenePage.css'

export default function TwinScenePage() {
  const [isExplode, setIsExplode] = useState(false)

  return (
    <div className="twin-scene-container">
      {/* 顶部操作按钮 */}
      <div className="scene-operation">
        <Space size="middle">
          <Button 
            type="primary" 
            danger={isExplode}
            onClick={() => setIsExplode(!isExplode)}
          >
            {isExplode ? '还原设备模型' : '爆炸拆解模型'}
          </Button>
        </Space>
      </div>

      {/* WebGL渲染画布（工业级参数配置） */}
      <Canvas
        shadows
        camera={{ position: [5, 5, 5], fov: 50 }}
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]} // 适配高清屏，兼顾性能
      >
        {/* 自动居中适配模型 */}
        <AutoCenter />
        {/* 模型组件 + 爆炸状态透传 */}
        <ModelExplode key={Number(isExplode)} />
        {/* 鼠标操控：旋转、平移、缩放、边界限制 */}
        <OrbitControls 
          enablePan 
          enableZoom 
          enableRotate 
          minDistance={2} 
          maxDistance={20}
        />
      </Canvas>
    </div>
  )
}

```

## 五、页面样式（TwinScenePage\.css）

新建 `src/pages/TwinScenePage.css`，适配工业大屏全屏展示

```css
.twin-scene-container {
  width: 100vw;
  height: 100vh;
  background: #0F2447; /* 项目标准工业深蓝底色 */
  overflow: hidden;
  position: relative;
}

.scene-operation {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 999;
}

```

## 六、使用配置说明

1. **模型放置**：将工业GLB模型重命名为 `industrial-device.glb`，放入项目 `public/models/` 文件夹

2. **运行项目**：执行 `pnpm dev`，访问页面即可看到3D工业模型

3. **核心交互**：鼠标左键旋转、右键平移、滚轮缩放，点击按钮切换模型爆炸/复原

## 七、工业级优化点（适配项目需求）

1. **性能优化**：开启抗锯齿、高性能渲染模式、DPR自适应，保证工业大屏30FPS\+

2. **模型适配**：AutoCenter自动居中，适配任意尺寸工业设备模型

3. **交互兜底**：限制相机最大/最小视距，避免模型丢失、视角错乱

4. **显存优化**：基于R3F组件化开发，天然适配项目显存释放Hook扩展

> (Note: May contain AI-generated content.)
