import { Progress, Tag } from 'antd'
import type { Device } from '@/types'
import './DeviceInfoCard.css'

interface Props {
  device: Device
}

const statusMap: Record<string, { color: string; text: string }> = {
  normal: { color: 'success', text: '正常' },
  warning: { color: 'warning', text: '预警' },
  alarm: { color: 'error', text: '告警' },
  offline: { color: 'default', text: '离线' },
}

export default function DeviceInfoCard({ device }: Props) {
  const status = statusMap[device.status] || statusMap.normal

  const parameters = [
    { label: '温度', value: `${device.temperature}`, unit: '°C', icon: '🌡' },
    { label: '压力', value: `${device.pressure}`, unit: 'MPa', icon: '⚡' },
    { label: '转速', value: `${device.speed}`, unit: 'RPM', icon: '⚙' },
  ]

  return (
    <div className="device-info-card">
      <div className="device-header">
        <div className="device-title-row">
          <span className="device-name">{device.name}</span>
          <Tag color={status.color} className="device-status-tag">
            {status.text}
          </Tag>
        </div>
        <div className="device-type">{device.type} · ID: {device.id}</div>
      </div>

      <div className="device-params">
        {parameters.map((param) => (
          <div key={param.label} className="param-item">
            <span className="param-label">
              <span className="param-icon">{param.icon}</span>
              {param.label}
            </span>
            <span className="param-value">
              {param.value}
              <span className="param-unit">{param.unit}</span>
            </span>
          </div>
        ))}
      </div>

      <div className="health-section">
        <div className="health-header">
          <span className="health-label">健康度</span>
          <span className="health-value">{device.healthRate}%</span>
        </div>
        <Progress
          percent={device.healthRate}
          strokeColor={{ '0%': '#00C853', '100%': '#2196F3' }}
          trailColor="var(--color-border)"
          size={['100%', 6]}
          showInfo={false}
        />
      </div>

      <div className="realtime-chart">
        <div className="chart-header">
          <span className="chart-title">实时测点</span>
          <span className="chart-unit">单位：°C / MPa</span>
        </div>
        <div className="chart-container">
          <svg viewBox="0 0 280 60" className="mini-chart" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGradient1" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#2196F3" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#2196F3" stopOpacity="0" />
              </linearGradient>
              <linearGradient id="chartGradient2" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#00C853" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#00C853" stopOpacity="0" />
              </linearGradient>
            </defs>
            <line x1="0" y1="30" x2="280" y2="30" stroke="var(--color-border)" strokeWidth="0.5" strokeDasharray="4 4" />
            <path
              d="M0,40 L20,35 L40,38 L60,28 L80,32 L100,22 L120,26 L140,18 L160,24 L180,15 L200,20 L220,12 L240,18 L260,10 L280,14 L280,60 L0,60 Z"
              fill="url(#chartGradient1)"
            />
            <polyline
              fill="none"
              stroke="#2196F3"
              strokeWidth="1.5"
              strokeLinejoin="round"
              points="0,40 20,35 40,38 60,28 80,32 100,22 120,26 140,18 160,24 180,15 200,20 220,12 240,18 260,10 280,14"
            />
            <path
              d="M0,45 L20,42 L40,44 L60,38 L80,40 L100,35 L120,37 L140,32 L160,34 L180,30 L200,32 L220,28 L240,30 L260,26 L280,28 L280,60 L0,60 Z"
              fill="url(#chartGradient2)"
            />
            <polyline
              fill="none"
              stroke="#00C853"
              strokeWidth="1.5"
              strokeLinejoin="round"
              opacity="0.7"
              points="0,45 20,42 40,44 60,38 80,40 100,35 120,37 140,32 160,34 180,30 200,32 220,28 240,30 260,26 280,28"
            />
          </svg>
        </div>
        <div className="chart-legend">
          <span className="legend-item">
            <span className="legend-dot legend-dot-blue" />
            温度
          </span>
          <span className="legend-item">
            <span className="legend-dot legend-dot-green" />
            压力
          </span>
        </div>
      </div>
    </div>
  )
}