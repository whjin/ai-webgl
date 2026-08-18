import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button, Select, Input, Table, Space, Card, Popconfirm, message } from 'antd'
import {
  SearchOutlined,
  ExportOutlined,
  EnvironmentOutlined,
  EyeOutlined,
  CheckOutlined,
  DeleteOutlined,
  BellOutlined,
} from '@ant-design/icons'
import ReactECharts from 'echarts-for-react'
import { useAlarmStore } from '@/store/useAlarmStore'
import { useSceneStore } from '@/store/useSceneStore'
import { mockAlarmTrend } from '@/services/mock/data'
import type { AlarmLevel, AlarmStatus } from '@/types'
import './index.css'

const levelMap: Record<AlarmLevel, { color: string; text: string }> = {
  critical: { color: '#E53935', text: '紧急' },
  warning: { color: '#FFB300', text: '预警' },
  info: { color: '#2196F3', text: '提示' },
  success: { color: '#00C853', text: '正常' },
}

const statusMap: Record<AlarmStatus, { color: string; text: string }> = {
  pending: { color: '#E53935', text: '未处理' },
  processing: { color: '#FFB300', text: '处理中' },
  resolved: { color: '#64748B', text: '已处理' },
}

export default function AlarmListPage() {
  const navigate = useNavigate()
  const { alarms, markAsResolved, deleteAlarm } = useAlarmStore()
  const { setSelectedDevice } = useSceneStore()
  const [levelFilter, setLevelFilter] = useState<string | undefined>()
  const [statusFilter, setStatusFilter] = useState<string | undefined>()
  const [searchText, setSearchText] = useState('')

  const filtered = alarms.filter((a) => {
    if (levelFilter && a.level !== levelFilter) return false
    if (statusFilter && a.status !== statusFilter) return false
    if (searchText && !a.deviceName.includes(searchText) && !a.content.includes(searchText)) return false
    return true
  })

  const handleLocate = (deviceId: string) => {
    setSelectedDevice(deviceId)
    navigate('/scene')
    message.info('已定位到设备')
  }

  const handleResolve = (id: string) => {
    markAsResolved(id)
    message.success('已标记为已处理')
  }

  const handleDelete = (id: string) => {
    deleteAlarm(id)
    message.success('已删除')
  }

  const columns = [
    {
      title: '告警时间',
      dataIndex: 'time',
      key: 'time',
      width: 160,
      render: (v: string) => <span className="alarm-time">{v}</span>,
    },
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
      width: 140,
      render: (v: string) => <span className="device-name">{v}</span>,
    },
    {
      title: '等级',
      dataIndex: 'level',
      key: 'level',
      width: 90,
      render: (v: AlarmLevel) => (
        <span className="level-tag" style={{ background: levelMap[v].color }}>
          {levelMap[v].text}
        </span>
      ),
    },
    {
      title: '告警内容',
      dataIndex: 'content',
      key: 'content',
      ellipsis: true,
      render: (v: string) => <span className="alarm-content">{v}</span>,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (v: AlarmStatus) => (
        <span
          className="status-tag"
          style={{
            background: `${statusMap[v].color}20`,
            color: statusMap[v].color,
            border: `1px solid ${statusMap[v].color}`,
          }}
        >
          {statusMap[v].text}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      width: 220,
      render: (_: unknown, record: { deviceId: string; id: string; status: AlarmStatus }) => (
        <Space size="small">
          <Button
            type="link"
            size="small"
            icon={<EnvironmentOutlined />}
            onClick={() => handleLocate(record.deviceId)}
          >
            定位
          </Button>
          <Button type="link" size="small" icon={<EyeOutlined />}>
            详情
          </Button>
          {record.status !== 'resolved' && (
            <Button
              type="link"
              size="small"
              icon={<CheckOutlined />}
              onClick={() => handleResolve(record.id)}
            >
              已处理
            </Button>
          )}
          <Popconfirm title="确认删除?" onConfirm={() => handleDelete(record.id)}>
            <Button type="link" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  const trendOption = {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis' },
    legend: {
      data: ['紧急', '预警', '提示'],
      textStyle: { color: 'var(--color-text-secondary)' },
      top: 0,
      right: 10,
    },
    grid: { left: 40, right: 16, top: 30, bottom: 24 },
    xAxis: {
      type: 'category',
      data: mockAlarmTrend.hours,
      axisLabel: { color: 'var(--color-text-secondary)', fontSize: 10 },
      axisLine: { lineStyle: { color: 'var(--color-border)' } },
    },
    yAxis: {
      type: 'value',
      axisLabel: { color: 'var(--color-text-secondary)', fontSize: 10 },
      splitLine: { lineStyle: { color: 'var(--color-border)' } },
    },
    series: [
      {
        name: '紧急',
        type: 'line',
        data: mockAlarmTrend.critical,
        smooth: true,
        itemStyle: { color: '#E53935' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(229, 57, 53, 0.3)' },
              { offset: 1, color: 'rgba(229, 57, 53, 0)' },
            ],
          },
        },
      },
      {
        name: '预警',
        type: 'line',
        data: mockAlarmTrend.warning,
        smooth: true,
        itemStyle: { color: '#FFB300' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0, y: 0, x2: 0, y2: 1,
            colorStops: [
              { offset: 0, color: 'rgba(255, 179, 0, 0.3)' },
              { offset: 1, color: 'rgba(255, 179, 0, 0)' },
            ],
          },
        },
      },
      {
        name: '提示',
        type: 'line',
        data: mockAlarmTrend.info,
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
    ],
  }

  const criticalCount = alarms.filter((a) => a.level === 'critical').length
  const warningCount = alarms.filter((a) => a.level === 'warning').length
  const infoCount = alarms.filter((a) => a.level === 'info').length
  const resolvedCount = alarms.filter((a) => a.status === 'resolved').length

  return (
    <div className="alarm-page">
      <div className="alarm-main">
        <Card
          size="small"
          className="alarm-card"
          title={
            <span className="card-title">
              <BellOutlined /> 告警列表
            </span>
          }
          extra={<span className="card-extra">#0F2447</span>}
        >
          <div className="alarm-filters">
            <Space size="middle" wrap>
              <Select
                placeholder="告警等级"
                allowClear
                className="filter-select"
                style={{ width: 140 }}
                value={levelFilter}
                onChange={setLevelFilter}
                options={[
                  { value: 'critical', label: '紧急' },
                  { value: 'warning', label: '预警' },
                  { value: 'info', label: '提示' },
                ]}
              />
              <Select
                placeholder="处理状态"
                allowClear
                className="filter-select"
                style={{ width: 140 }}
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: 'pending', label: '未处理' },
                  { value: 'processing', label: '处理中' },
                  { value: 'resolved', label: '已处理' },
                ]}
              />
              <Input
                placeholder="搜索设备/内容"
                prefix={<SearchOutlined style={{ color: 'var(--color-text-secondary)' }} />}
                className="filter-input"
                style={{ width: 220 }}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                allowClear
              />
              <Button type="primary" icon={<ExportOutlined />} className="export-btn">
                导出报表
              </Button>
            </Space>
          </div>

          <Table
            dataSource={filtered}
            columns={columns}
            rowKey="id"
            size="middle"
            pagination={{ pageSize: 10, showSizeChanger: false, showTotal: (t) => `共 ${t} 条` }}
            className="alarm-table"
            rowClassName={(record) => `alarm-row-${record.status}`}
          />
        </Card>
      </div>

      <div className="alarm-side">
        <Card
          size="small"
          title={
            <span className="card-title">
              <span className="title-icon">📈</span> 今日告警趋势
            </span>
          }
          className="alarm-card"
          extra={<span className="card-extra">#142A50</span>}
        >
          <ReactECharts
            option={trendOption}
            style={{ height: 220 }}
            opts={{ renderer: 'canvas' }}
          />
        </Card>

        <Card
          size="small"
          title={
            <span className="card-title">
              <span className="title-icon">📊</span> 告警统计
            </span>
          }
          className="alarm-card"
          style={{ marginTop: 16 }}
        >
          <div className="alarm-stats">
            <div className="stat-item critical">
              <span className="stat-num">{criticalCount}</span>
              <span className="stat-label">紧急</span>
            </div>
            <div className="stat-item warning">
              <span className="stat-num">{warningCount}</span>
              <span className="stat-label">预警</span>
            </div>
            <div className="stat-item info">
              <span className="stat-num">{infoCount}</span>
              <span className="stat-label">提示</span>
            </div>
            <div className="stat-item resolved">
              <span className="stat-num">{resolvedCount}</span>
              <span className="stat-label">已处理</span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}