import { Layout, Menu, Tooltip } from 'antd'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppstoreOutlined,
  ToolOutlined,
  ScanOutlined,
  AlertOutlined,
  BarChartOutlined,
  SettingOutlined,
  CaretDownOutlined,
} from '@ant-design/icons'
import { useUiStore } from '@/store/useUiStore'
import './Sidebar.css'

const { Sider } = Layout

const menuItems = [
  { key: '/scene', icon: <AppstoreOutlined />, label: '场景管理' },
  { key: '/device', icon: <ToolOutlined />, label: '设备资源库', disabled: true },
  { key: '/ai-detect', icon: <ScanOutlined />, label: 'AI智能检测' },
  { key: '/alarm', icon: <AlertOutlined />, label: '数据告警' },
  { key: '/report', icon: <BarChartOutlined />, label: '报表中心' },
  { key: '/permission', icon: <SettingOutlined />, label: '系统设置' },
]

export default function Sidebar() {
  const navigate = useNavigate()
  const location = useLocation()
  const { sidebarCollapsed, currentProject } = useUiStore()

  const selectedKey = location.pathname === '/' ? '/scene' : location.pathname

  return (
    <Sider
      className="app-sider"
      width={220}
      collapsedWidth={60}
      collapsed={sidebarCollapsed}
      trigger={null}
    >
      <div className="sidebar-project">
        {sidebarCollapsed ? (
          <Tooltip title={currentProject} placement="right">
            <div className="project-collapsed">
              <span className="project-value-short">{currentProject.slice(0, 2)}</span>
            </div>
          </Tooltip>
        ) : (
          <>
            <span className="project-label">当前工程</span>
            <div className="project-selector">
              <span className="project-value">{currentProject}</span>
              <CaretDownOutlined className="project-arrow" />
            </div>
          </>
        )}
      </div>

      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[selectedKey]}
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        className="sidebar-menu"
      />
    </Sider>
  )
}