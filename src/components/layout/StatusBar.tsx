import { useState, useEffect } from 'react'
import './StatusBar.css'

export default function StatusBar() {
  const [fps, setFps] = useState(58)
  const [onlineDevices, setOnlineDevices] = useState(128)
  const [vertices] = useState('12.6万')

  useEffect(() => {
    const timer = setInterval(() => {
      setFps(Math.floor(55 + Math.random() * 10))
      setOnlineDevices(120 + Math.floor(Math.random() * 15))
    }, 3000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="status-bar">
      <div className="status-left">
        <span className="status-item">
          <span className="status-dot online" />
          <span className="status-text">系统在线</span>
        </span>
      </div>

      <div className="status-center">
        <span className="status-item fps-item">
          <span className="fps-label">FPS</span>
          <span className="fps-value">{fps}</span>
        </span>
        <span className="status-divider" />
        <span className="status-item">
          <span className="status-label">在线设备</span>
          <span className="status-value">{onlineDevices}</span>
        </span>
        <span className="status-divider" />
        <span className="status-item">
          <span className="status-label">模型顶点</span>
          <span className="status-value">{vertices}</span>
        </span>
      </div>

      <div className="status-right">
        <span className="status-item">
          <span className="status-dot online" />
          <span className="status-text">已连接</span>
        </span>
        <span className="status-divider" />
        <span className="status-item">
          <span className="status-label">模型</span>
          <span className="status-value">v0.1.0</span>
        </span>
      </div>
    </div>
  )
}