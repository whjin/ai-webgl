import { Layout } from 'antd'
import { Outlet, useLocation } from 'react-router-dom'
import Header from './Header'
import Sidebar from './Sidebar'
import RightPanel from './RightPanel'
import StatusBar from './StatusBar'
import './MainLayout.css'

const { Content } = Layout

// 不需要右侧面板的页面
const noRightPanelRoutes = ['/ai-detect', '/project', '/permission', '/report']

export default function MainLayout() {
  const location = useLocation()
  const showRightPanel = !noRightPanelRoutes.includes(location.pathname)

  return (
    <Layout className="app-layout">
      <Header />
      <Layout className="app-body">
        <Sidebar />
        <Content className="app-content page-fade-in" key={location.pathname}>
          <Outlet />
        </Content>
        {showRightPanel && <RightPanel />}
      </Layout>
      <StatusBar />
    </Layout>
  )
}
