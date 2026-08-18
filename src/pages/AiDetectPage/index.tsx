import { useState } from 'react'
import { Upload, Table, Tag, Card, Select, message } from 'antd'
import {
  UploadOutlined,
  CameraOutlined,
  PlayCircleOutlined,
  ClearOutlined,
  FileTextOutlined,
  ScanOutlined,
} from '@ant-design/icons'
import type { DefectResult } from '@/types'
import { mockDefectResults } from '@/services/mock/data'
import './index.css'

const { Dragger } = Upload

const defectColorMap: Record<string, string> = {
  '裂纹': '#E53935',
  '锈蚀': '#FFB300',
  '形变': '#2196F3',
  '松动': '#FFB300',
  '磨损': '#E53935',
  '腐蚀': '#FFB300',
}

export default function AiDetectPage() {
  const [detecting, setDetecting] = useState(false)
  const [results, setResults] = useState<DefectResult[]>([])
  const [hasImage, setHasImage] = useState(false)
  const [inferenceMode, setInferenceMode] = useState('fast')

  const handleDetect = () => {
    if (!hasImage) {
      message.warning('请先上传图片或开启摄像头')
      return
    }
    setDetecting(true)
    setResults([])
    setTimeout(() => {
      setResults(mockDefectResults)
      setDetecting(false)
      message.success('检测完成，发现 3 处缺陷')
    }, 2000)
  }

  const handleClear = () => {
    setResults([])
    setHasImage(false)
  }

  const getConfidenceColor = (v: number) => {
    if (v > 80) return 'var(--color-danger)'
    if (v > 60) return 'var(--color-warning)'
    return 'var(--color-success)'
  }

  const columns = [
    {
      title: '序号',
      key: 'index',
      width: 60,
      render: (_: unknown, __: unknown, i: number) => (
        <span className="result-index">{i + 1}</span>
      ),
    },
    {
      title: '缺陷类型',
      dataIndex: 'type',
      key: 'type',
      render: (v: string) => (
        <Tag color={defectColorMap[v] || 'blue'} className="defect-tag">
          {v}
        </Tag>
      ),
    },
    {
      title: '置信度',
      dataIndex: 'confidence',
      key: 'confidence',
      render: (v: number) => (
        <span className="confidence-value" style={{ color: getConfidenceColor(v) }}>
          {v}%
        </span>
      ),
    },
    { title: '建议处理', dataIndex: 'suggestion', key: 'suggestion' },
  ]

  const thumbs = [
    { id: 1, label: '摄像头预览' },
    { id: 2, label: '' },
    { id: 3, label: '' },
    { id: 4, label: '' },
    { id: 5, label: '' },
  ]

  return (
    <div className="ai-detect-page">
      <div className="ai-left">
        <Card
          title={
            <span className="card-title">
              <span className="title-icon">📷</span> 图片上传
            </span>
          }
          size="small"
          className="ai-card"
          extra={<span className="card-extra">#0F2447</span>}
        >
          <div className="upload-area">
            {hasImage ? (
              <div className="preview-image">
                <svg viewBox="0 0 400 300" width="100%" height="100%" className="mock-svg">
                  <defs>
                    <linearGradient id="bg-grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#1a2a3a" />
                      <stop offset="100%" stopColor="#0f2447" />
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="url(#bg-grad)" />
                  <rect x="80" y="100" width="120" height="80" rx="8" fill="#2a4a6a" stroke="#3a5a7a" strokeWidth="2" />
                  <circle cx="140" cy="140" r="25" fill="#1a3a5a" stroke="#4a7aaa" strokeWidth="2" />
                  <rect x="200" y="120" width="100" height="50" rx="4" fill="#2a4a6a" stroke="#3a5a7a" strokeWidth="2" />
                  <rect x="100" y="200" width="200" height="15" fill="#3a4a5a" />
                  {results.map((r) => (
                    <g key={r.id}>
                      <rect
                        x={r.bbox.x * 4}
                        y={r.bbox.y * 3}
                        width={r.bbox.width * 4}
                        height={r.bbox.height * 3}
                        fill="none"
                        stroke={defectColorMap[r.type] || '#E53935'}
                        strokeWidth="2"
                      />
                      <rect
                        x={r.bbox.x * 4}
                        y={r.bbox.y * 3 - 18}
                        width={60}
                        height={18}
                        fill={defectColorMap[r.type] || '#E53935'}
                        rx="2"
                      />
                      <text
                        x={r.bbox.x * 4 + 4}
                        y={r.bbox.y * 3 - 5}
                        fill="#fff"
                        fontSize="11"
                        fontWeight="600"
                      >
                        {r.type} {r.confidence}%
                      </text>
                    </g>
                  ))}
                </svg>
              </div>
            ) : (
              <Dragger
                accept="image/*"
                showUploadList={false}
                beforeUpload={() => {
                  setHasImage(true)
                  return false
                }}
                className="upload-dragger"
              >
                <p className="ant-upload-drag-icon">
                  <UploadOutlined />
                </p>
                <p className="ant-upload-text">点击或拖拽上传工业设备图片</p>
                <p className="ant-upload-hint">支持 JPG / PNG / BMP 格式</p>
              </Dragger>
            )}
          </div>

          <div className="thumbnail-list">
            {thumbs.map((t, i) => (
              <div key={t.id} className={`thumb ${i === 0 ? 'active' : ''}`}>
                <div className="thumb-placeholder">
                  {i === 0 && <CameraOutlined style={{ fontSize: 16, color: 'var(--color-info)' }} />}
                </div>
                {i === 0 && <span className="thumb-label">{t.label}</span>}
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="ai-center">
        <div className="center-actions">
          <Select
            value={inferenceMode}
            onChange={setInferenceMode}
            className="mode-select"
            options={[
              { value: 'fast', label: '快速模式' },
              { value: 'accurate', label: '精准模式' },
            ]}
          />
          <button
            className="action-btn primary"
            onClick={handleDetect}
            disabled={detecting}
          >
            <PlayCircleOutlined />
            <span>{detecting ? '检测中...' : '开始AI检测'}</span>
          </button>
          <button className="action-btn" onClick={() => message.info('摄像头启动中...')}>
            <CameraOutlined />
            <span>开启摄像头</span>
          </button>
          <button className="action-btn" onClick={handleClear}>
            <ClearOutlined />
            <span>清空素材</span>
          </button>
          <button
            className="action-btn"
            disabled={results.length === 0}
            onClick={() => message.success('报告已生成')}
          >
            <FileTextOutlined />
            <span>生成报告</span>
          </button>
        </div>
      </div>

      <div className="ai-right">
        <Card
          title={
            <span className="card-title">
              <span className="title-icon">🔍</span> AI检测结果
            </span>
          }
          size="small"
          className="ai-card result-card"
          extra={<span className="card-extra">#0F2447</span>}
        >
          {results.length > 0 ? (
            <>
              <div className="result-summary">
                <Tag color="error" className="summary-tag">缺陷数量: {results.length}</Tag>
                <Tag color="warning" className="summary-tag">
                  最高置信度: {Math.max(...results.map((r) => r.confidence))}%
                </Tag>
              </div>
              <Table
                dataSource={results}
                columns={columns}
                size="small"
                pagination={false}
                rowKey="id"
                className="result-table"
              />
            </>
          ) : (
            <div className="empty-result">
              <div className="empty-icon">
                <ScanOutlined />
              </div>
              <p>上传图片后点击开始检测</p>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}