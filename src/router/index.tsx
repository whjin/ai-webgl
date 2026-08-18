import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from '@/components/layout/MainLayout'

const TwinScenePage = lazy(() => import('@/pages/TwinScenePage'))
const AiDetectPage = lazy(() => import('@/pages/AiDetectPage'))
const AlarmListPage = lazy(() => import('@/pages/AlarmListPage'))
const ProjectConfigPage = lazy(() => import('@/pages/ProjectConfigPage'))
const PermissionPage = lazy(() => import('@/pages/PermissionPage'))
const ReportPage = lazy(() => import('@/pages/ReportPage'))

function PageLoader() {
  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94A3B8' }}>
      加载中...
    </div>
  )
}

export default function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/scene" replace />} />
          <Route path="scene" element={<TwinScenePage />} />
          <Route path="ai-detect" element={<AiDetectPage />} />
          <Route path="alarm" element={<AlarmListPage />} />
          <Route path="project" element={<ProjectConfigPage />} />
          <Route path="permission" element={<PermissionPage />} />
          <Route path="report" element={<ReportPage />} />
        </Route>
      </Routes>
    </Suspense>
  )
}
