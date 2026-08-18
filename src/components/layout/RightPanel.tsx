import { Button, Empty, Tabs, Divider, Tag } from 'antd'
import { CloseOutlined, ThunderboltOutlined, ExclamationCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { useUiStore } from '@/store/useUiStore'
import { useSceneStore } from '@/store/useSceneStore'
import { mockDevices } from '@/services/mock/data'
import DeviceInfoCard from '@/components/business/DeviceInfoCard'
import './RightPanel.css'

export default function RightPanel() {
  const { rightPanelVisible, toggleRightPanel, rightPanelWidth } = useUiStore()
  const { selectedDeviceId } = useSceneStore()

  if (!rightPanelVisible) {
    return (
      <div className="right-panel-collapsed" onClick={toggleRightPanel}>
        <ThunderboltOutlined />
        <span>展开面板</span>
      </div>
    )
  }

  const selectedDevice = mockDevices.find((d) => d.id === selectedDeviceId) || mockDevices[0]

  const statusMap: Record<string, { color: string; text: string }> = {
    normal: { color: 'success', text: '正常' },
    warning: { color: 'warning', text: '预警' },
    alarm: { color: 'error', text: '告警' },
    offline: { color: 'default', text: '离线' },
  }

  const tabItems = [
    {
      key: 'info',
      label: '设备信息',
      children: <DeviceInfoCard device={selectedDevice} />,
    },
    {
      key: 'ai',
      label: 'AI分析',
      children: (
        <div className="panel-section">
          <div className="ai-header">
            <ExclamationCircleOutlined className="ai-header-icon" />
            <span className="ai-header-title">AI故障诊断分析</span>
          </div>

          <div className="ai-fault-rate">
            <div className="fault-ring">
              <svg viewBox="0 0 100 100" width={120} height={120}>
                <defs>
                  <linearGradient id="faultGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00C853" />
                    <stop offset="100%" stopColor="#2196F3" />
                  </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-border)" strokeWidth="8" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke="url(#faultGradient)"
                  strokeWidth="8"
                  strokeDasharray={`${(1 - selectedDevice.aiFaultProbability / 100) * 251.2} 251.2`}
                  strokeLinecap="round"
                  transform="rotate(-90 50 50)"
                  className="fault-ring-progress"
                />
              </svg>
              <div className="fault-center">
                <span className="fault-value">{selectedDevice.aiFaultProbability}%</span>
                <span className="fault-label">故障概率</span>
              </div>
            </div>
          </div>

          <Divider style={{ borderColor: 'var(--color-border)', margin: '12px 0' }} />

          <div className="ai-suggestions">
            <div className="suggestions-title">
              <CheckCircleOutlined className="suggestions-icon" />
              <span>AI诊断建议</span>
            </div>
            <div className="suggestions-content">
              <p>设备当前状态良好，故障概率低于阈值。</p>
              <p>建议继续监测温度变化趋势，注意振动特征。</p>
            </div>
          </div>

          <div className="ai-meta">
            <div className="meta-item">
              <span className="meta-label">置信度</span>
              <span className="meta-value">92.5%</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">检测时间</span>
              <span className="meta-value">2026-06-02 14:32</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      key: 'history',
      label: '历史告警',
      children: (
        <div className="panel-section">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span className="empty-text">暂无历史告警记录</span>
            }
          />
        </div>
      ),
    },
  ]

  const deviceStatus = statusMap[selectedDevice.status] || statusMap.normal

  return (
    <div className="right-panel" style={{ width: rightPanelWidth }}>
      <div className="panel-header">
        <div className="panel-header-info">
          <span className="panel-title">{selectedDevice.name}</span>
          <Tag color={deviceStatus.color} className="panel-status-tag">
            {deviceStatus.text}
          </Tag>
        </div>
        <Button
          type="text"
          icon={<CloseOutlined />}
          onClick={toggleRightPanel}
          className="panel-close"
        />
      </div>
      <div className="panel-content">
        <Tabs
          items={tabItems}
          defaultActiveKey="info"
          size="small"
          className="panel-tabs"
        />
      </div>
    </div>
  )
}