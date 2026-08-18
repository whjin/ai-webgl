import { Layout, Badge, Avatar, Dropdown, Space, Tooltip } from 'antd'
import {
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
} from '@ant-design/icons'
import { useState, useEffect } from 'react'
import { useUiStore } from '@/store/useUiStore'
import { useAlarmStore } from '@/store/useAlarmStore'
import { useUserStore } from '@/store/useUserStore'
import './Header.css'

const { Header: AntHeader } = Layout

export default function Header() {
  const { sidebarCollapsed, toggleSidebar, currentProject } = useUiStore()
  const { alarms } = useAlarmStore()
  const { username } = useUserStore()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d')

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const pendingCount = alarms.filter((a) => a.status !== 'resolved').length

  const formatTime = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`
  }

  const userMenuItems = [
    { key: 'profile', icon: <UserOutlined />, label: '个人中心' },
    { key: 'settings', icon: <SettingOutlined />, label: '系统设置' },
    { type: 'divider' as const },
    { key: 'logout', icon: <LogoutOutlined />, label: '退出登录', danger: true },
  ]

  return (
    <AntHeader className="app-header">
      <div className="header-left">
        <div className="header-logo">
          <div className="logo-icon">In</div>
          <div className="logo-text-group">
            <span className="logo-text">InDigiTwin-AI</span>
            <span className="logo-sub">工业数字孪生平台</span>
          </div>
        </div>
      </div>

      <div className="header-center">
        <span className="project-name">{currentProject}</span>
      </div>

      <div className="header-right">
        <Space size={16} className="header-actions">
          <div className="header-time">
            <span className="time-text">{formatTime(currentTime)}</span>
          </div>

          <div className="view-mode-switch">
            <Tooltip title="3D场景模式">
              <div
                className={`mode-btn ${viewMode === '3d' ? 'active' : ''}`}
                onClick={() => setViewMode('3d')}
              >
                <DashboardOutlined />
                <span>3D</span>
              </div>
            </Tooltip>
            <Tooltip title="2D平面模式">
              <div
                className={`mode-btn ${viewMode === '2d' ? 'active' : ''}`}
                onClick={() => setViewMode('2d')}
              >
                <DashboardOutlined />
                <span>2D</span>
              </div>
            </Tooltip>
          </div>

          <div className="header-icon-btn" onClick={toggleSidebar}>
            <Tooltip title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'}>
              {sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </Tooltip>
          </div>

          <div className="header-icon-btn">
            <Tooltip title={`${pendingCount} 条未处理告警`}>
              <Badge count={pendingCount} size="small" offset={[-4, 4]}>
                <BellOutlined className="header-icon" />
              </Badge>
            </Tooltip>
          </div>

          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight" trigger={['click']}>
            <div className="header-user">
              <Avatar size={32} icon={<UserOutlined />} style={{ backgroundColor: 'var(--color-primary-light-2)' }} />
              <span className="username">{username}</span>
            </div>
          </Dropdown>
        </Space>
      </div>
    </AntHeader>
  )
}