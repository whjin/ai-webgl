import { Card, Row, Col } from 'antd'
import {
  ToolOutlined,
  LinkOutlined,
  BellOutlined,
  ScanOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { mockStatCards, mockHealthTrend, mockDefectStats } from '@/services/mock/data'
import './index.css'

const iconMap: Record<string, React.ReactNode> = {
  tool: <ToolOutlined />,
  link: <LinkOutlined />,
  bell: <BellOutlined />,
  scan: <ScanOutlined />,
}

export default function ReportPage() {
  const trendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['温度', '压力', '转速'],
      textStyle: { color: 'var(--color-text-secondary)' },
      top: 0,
      right: 10,
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: mockHealthTrend.months,
      axisLabel: { color: 'var(--color-text-secondary)', fontSize: 11 },
      axisLine: { lineStyle: { color: 'var(--color-border)' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: 'var(--color-text-secondary)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'var(--color-border)' } },
    },
    series: [
      {
        name: '温度',
        type: 'line',
        data: mockHealthTrend.temperature,
        smooth: true,
        itemStyle: { color: '#00C853' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(0, 200, 83, 0.3)' },
              { offset: 1, color: 'rgba(0, 200, 83, 0)' },
            ],
          },
        },
      },
      {
        name: '压力',
        type: 'line',
        data: mockHealthTrend.pressure,
        smooth: true,
        itemStyle: { color: '#2196F3' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(33, 150, 243, 0.3)' },
              { offset: 1, color: 'rgba(33, 150, 243, 0)' },
            ],
          },
        },
      },
      {
        name: '转速',
        type: 'line',
        data: mockHealthTrend.speed,
        smooth: true,
        itemStyle: { color: '#FFB300' },
      },
    ],
  }

  const healthRingOption = {
    backgroundColor: 'transparent',
    series: [
      {
        type: 'pie',
        radius: ['60%', '75%'],
        center: ['50%', '50%'],
        avoidLabelOverlap: false,
        label: { show: false },
        data: [
          { value: 91, name: '健康率', itemStyle: { color: '#00C853' } },
          { value: 6, name: '预警率', itemStyle: { color: '#FFB300' } },
          { value: 3, name: '故障率', itemStyle: { color: '#E53935' } },
        ],
      },
    ],
  }

  const defectBarOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['裂纹', '锈蚀', '形变'],
      textStyle: { color: 'var(--color-text-secondary)' },
      top: 0,
      right: 10,
    },
    grid: { left: 50, right: 20, top: 40, bottom: 30 },
    xAxis: {
      type: 'category',
      data: mockDefectStats.types,
      axisLabel: { color: 'var(--color-text-secondary)', fontSize: 11 },
      axisLine: { lineStyle: { color: 'var(--color-border)' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: 'var(--color-text-secondary)', fontSize: 11 },
      splitLine: { lineStyle: { color: 'var(--color-border)' } },
    },
    series: [
      {
        name: '裂纹',
        type: 'bar',
        data: mockDefectStats.values.map((v) => Math.round(v * 0.9)),
        itemStyle: { color: '#2196F3' },
        barWidth: 16,
      },
      {
        name: '锈蚀',
        type: 'bar',
        data: mockDefectStats.values.map((v) => Math.round(v * 0.7)),
        itemStyle: { color: '#00C853' },
        barWidth: 16,
      },
      {
        name: '形变',
        type: 'bar',
        data: mockDefectStats.values.map((v) => Math.round(v * 0.5)),
        itemStyle: { color: '#FFB300' },
        barWidth: 16,
      },
    ],
  }

  return (
    <div className="report-page">
      <Row gutter={16} className="stat-row">
        {mockStatCards.map((card) => (
          <Col span={6} key={card.title}>
            <Card size="small" className="stat-card">
              <div className="stat-card-content">
                <div className="stat-card-info">
                  <span className="stat-card-title">{card.title}</span>
                  <span className="stat-card-value">
                    {card.value}
                    <span className="stat-card-unit">{card.unit}</span>
                  </span>
                  <span className={`stat-card-trend ${(card.trend || 0) >= 0 ? 'up' : 'down'}`}>
                    {(card.trend || 0) >= 0 ? <ArrowUpOutlined /> : <ArrowDownOutlined />}
                    {Math.abs(card.trend || 0)}%
                  </span>
                </div>
                <div className="stat-card-icon">{iconMap[card.icon]}</div>
              </div>
              <div className="stat-card-bar">
                <div
                  className="stat-card-bar-fill"
                  style={{ width: `${Math.min(100, Number(card.value) / 2)}%` }}
                />
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Row gutter={16} className="chart-row">
        <Col span={16}>
          <Card
            title={
              <span className="card-title">
                <span className="title-icon">📈</span> 设备健康趋势
              </span>
            }
            size="small"
            className="chart-card"
            extra={<span className="card-extra">#0F2447</span>}
          >
            <ReactECharts option={trendOption} style={{ height: 280 }} opts={{ renderer: 'canvas' }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <span className="card-title">
                <span className="title-icon">💯</span> 设备健康率
              </span>
            }
            size="small"
            className="chart-card"
            extra={<span className="card-extra">#142A50</span>}
          >
            <div className="health-ring-container">
              <ReactECharts option={healthRingOption} style={{ height: 200 }} opts={{ renderer: 'canvas' }} />
              <div className="health-ring-center">
                <span className="health-value">91%</span>
                <span className="health-label">健康率</span>
              </div>
            </div>
            <div className="health-legend">
              <span><i style={{ background: '#00C853' }} />健康 91%</span>
              <span><i style={{ background: '#FFB300' }} />预警 6%</span>
              <span><i style={{ background: '#E53935' }} />故障 3%</span>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={16} className="chart-row">
        <Col span={24}>
          <Card
            title={
              <span className="card-title">
                <span className="title-icon">📊</span> 缺陷类型统计
              </span>
            }
            size="small"
            className="chart-card"
            extra={<span className="card-extra">#0F2447</span>}
          >
            <ReactECharts option={defectBarOption} style={{ height: 260 }} opts={{ renderer: 'canvas' }} />
          </Card>
        </Col>
      </Row>
    </div>
  )
}