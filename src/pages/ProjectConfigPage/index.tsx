import { useState } from 'react'
import { Button, Upload, Form, Select, Switch, Table, Card, Space, message, Progress } from 'antd'
import {
  InboxOutlined,
  SaveOutlined,
  FolderOpenOutlined,
  EditOutlined,
  DeleteOutlined,
  CloudUploadOutlined,
  SettingOutlined,
} from '@ant-design/icons'
import { mockProjects } from '@/services/mock/data'
import type { ProjectConfig } from '@/types'
import './index.css'

const { Dragger } = Upload

export default function ProjectConfigPage() {
  const [form] = Form.useForm()
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [projects, setProjects] = useState<ProjectConfig[]>(mockProjects)

  const handleUpload = () => {
    setUploading(true)
    setUploadProgress(0)
    const timer = setInterval(() => {
      setUploadProgress((p) => {
        if (p >= 100) {
          clearInterval(timer)
          setUploading(false)
          message.success('模型上传完成')
          return 100
        }
        return p + 10
      })
    }, 200)
  }

  const handleSave = () => {
    message.success('场景配置已保存')
  }

  const columns = [
    {
      title: '工程名称',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => (
        <Space>
          <div className="project-thumb">
            <svg viewBox="0 0 60 40" width="60" height="40">
              <rect width="60" height="40" fill="#1a3466" rx="4" />
              <rect x="10" y="15" width="20" height="15" fill="#254888" rx="2" />
              <rect x="35" y="10" width="15" height="20" fill="#2a5a9a" rx="2" />
            </svg>
          </div>
          <span className="project-name">{text}</span>
        </Space>
      ),
    },
    { title: '模型大小', dataIndex: 'modelSize', key: 'modelSize', render: (v: string) => <span className="project-size">{v}</span> },
    { title: 'LOD等级', dataIndex: 'lodLevel', key: 'lodLevel', render: (v: string) => <span className="lod-tag">{v}</span> },
    { title: '更新时间', dataIndex: 'updatedAt', key: 'updatedAt', render: (v: string) => <span className="project-date">{v}</span> },
    {
      title: '操作',
      key: 'action',
      render: () => (
        <Space size="small">
          <Button type="link" size="small" icon={<FolderOpenOutlined />}>打开</Button>
          <Button type="link" size="small" icon={<EditOutlined />}>编辑</Button>
          <Button type="link" size="small" danger icon={<DeleteOutlined />}>删除</Button>
        </Space>
      ),
    },
  ]

  return (
    <div className="project-page">
      <div className="project-top">
        <Card
          title={
            <span className="card-title">
              <CloudUploadOutlined /> 模型上传
            </span>
          }
          size="small"
          className="project-card upload-card"
          extra={<span className="card-extra">#0F2447</span>}
        >
          <Dragger
            accept=".glb,.gltf"
            showUploadList={false}
            beforeUpload={() => {
              handleUpload()
              return false
            }}
            disabled={uploading}
            className="upload-dragger"
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">上传 GLB/glTF 工业模型</p>
            <p className="ant-upload-hint">支持拖拽上传，单文件最大 500MB</p>
          </Dragger>
          {uploading && (
            <div className="upload-progress">
              <Progress
                percent={uploadProgress}
                status="active"
                strokeColor={{ from: 'var(--color-info)', to: 'var(--color-success)' }}
              />
            </div>
          )}
        </Card>

        <Card
          title={
            <span className="card-title">
              <SettingOutlined /> 模型预处理配置
            </span>
          }
          size="small"
          className="project-card config-card"
          extra={<span className="card-extra">#142A50</span>}
        >
          <Form
            form={form}
            layout="vertical"
            initialValues={{ lod: 'LOD2', draco: true, decimate: true, collision: false }}
          >
            <div className="form-row">
              <Form.Item label="模型名称" name="name" className="form-item">
                <Select
                  allowClear
                  placeholder="选择或输入模型名称"
                  className="form-select"
                  options={projects.map((p) => ({ value: p.name, label: p.name }))}
                />
              </Form.Item>
              <Form.Item label="LOD等级" name="lod" className="form-item">
                <Select
                  className="form-select"
                  options={[
                    { value: 'LOD0', label: 'LOD0 - 最高精度' },
                    { value: 'LOD1', label: 'LOD1 - 高精度' },
                    { value: 'LOD2', label: 'LOD2 - 中精度' },
                    { value: 'LOD3', label: 'LOD3 - 低精度' },
                  ]}
                />
              </Form.Item>
            </div>
            <div className="form-row">
              <Form.Item label="Draco压缩" name="draco" valuePropName="checked" className="form-item">
                <Switch />
              </Form.Item>
              <Form.Item label="自动减面" name="decimate" valuePropName="checked" className="form-item">
                <Switch />
              </Form.Item>
              <Form.Item label="碰撞体生成" name="collision" valuePropName="checked" className="form-item">
                <Switch />
              </Form.Item>
            </div>
            <div className="form-actions">
              <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} className="save-btn">
                保存场景
              </Button>
            </div>
          </Form>
        </Card>
      </div>

      <Card
        title={
          <span className="card-title">
            <span className="title-icon">📁</span> 工程项目列表
          </span>
        }
        size="small"
        className="project-card"
        extra={<span className="card-extra">#0F2447</span>}
      >
        <Table
          dataSource={projects}
          columns={columns}
          rowKey="id"
          size="middle"
          pagination={{ pageSize: 5 }}
          className="project-table"
        />
      </Card>
    </div>
  )
}