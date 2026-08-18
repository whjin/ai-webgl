import { useState, useEffect } from 'react'
import { Tooltip } from 'antd'
import {
  ScissorOutlined,
  BulbOutlined,
  CameraOutlined,
  RocketOutlined,
  ReloadOutlined,
} from '@ant-design/icons'
import SceneCanvas from '@/components/3d/SceneCanvas'
import { useSceneStore } from '@/store/useSceneStore'
import './index.css'

export default function TwinScenePage() {
  const {
    isExploded,
    isClipping,
    isAutoRoaming,
    toggleExplode,
    toggleClipping,
    toggleAutoRoaming,
    resetView,
  } = useSceneStore()

  const [fps, setFps] = useState(58)

  useEffect(() => {
    const timer = setInterval(() => {
      setFps(Math.floor(55 + Math.random() * 10))
    }, 2000)
    return () => clearInterval(timer)
  }, [])

  const toolbarButtons = [
    {
      key: 'explode',
      icon: <ScissorOutlined />,
      label: isExploded ? '还原' : '爆炸',
      tooltip: isExploded ? '还原模型' : '爆炸拆解',
      active: isExploded,
      onClick: toggleExplode,
    },
    {
      key: 'clip',
      icon: <BulbOutlined />,
      label: '剖切',
      tooltip: isClipping ? '关闭剖切' : '模型剖切',
      active: isClipping,
      onClick: toggleClipping,
    },
    {
      key: 'save',
      icon: <CameraOutlined />,
      label: '保存',
      tooltip: '视角保存',
      active: false,
      onClick: () => {},
    },
    {
      key: 'roam',
      icon: <RocketOutlined />,
      label: '漫游',
      tooltip: isAutoRoaming ? '停止漫游' : '自动漫游',
      active: isAutoRoaming,
      onClick: toggleAutoRoaming,
    },
    {
      key: 'reset',
      icon: <ReloadOutlined />,
      label: '重置',
      tooltip: '重置视角',
      active: false,
      onClick: resetView,
    },
  ]

  return (
    <div className="twin-scene-page">
      <div className="scene-toolbar">
        <div className="toolbar-glass">
          {toolbarButtons.map((btn) => (
            <Tooltip key={btn.key} title={btn.tooltip} placement="right">
              <div
                className={`toolbar-btn ${btn.active ? 'active' : ''}`}
                onClick={btn.onClick}
              >
                <span className="toolbar-icon">{btn.icon}</span>
                <span className="toolbar-label">{btn.label}</span>
              </div>
            </Tooltip>
          ))}
        </div>
      </div>

      <div className="webgl-badge">
        <span className="webgl-dot" />
        WebGL
      </div>

      <div className="fps-badge">
        <span className="fps-value">{fps}</span>
        <span className="fps-unit">FPS</span>
      </div>

      <SceneCanvas className="twin-canvas" />

      <div className="scene-hint">
        <span className="hint-icon">ⓘ</span>
        鼠标左键旋转 · 右键平移 · 滚轮缩放 · 点击设备查看详情
      </div>
    </div>
  )
}