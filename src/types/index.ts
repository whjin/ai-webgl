// 设备类型
export interface Device {
  id: string
  name: string
  type: string
  status: 'normal' | 'warning' | 'alarm' | 'offline'
  temperature: number
  pressure: number
  speed: number
  healthRate: number
  aiFaultProbability: number
  position: [number, number, number]
}

// 告警等级
export type AlarmLevel = 'critical' | 'warning' | 'info' | 'success'

// 告警状态
export type AlarmStatus = 'pending' | 'processing' | 'resolved'

// 告警记录
export interface AlarmRecord {
  id: string
  time: string
  deviceName: string
  deviceId: string
  level: AlarmLevel
  content: string
  status: AlarmStatus
}

// 缺陷检测结果
export interface DefectResult {
  id: string
  type: string
  confidence: number
  suggestion: string
  bbox: { x: number; y: number; width: number; height: number }
}

// 工程配置
export interface ProjectConfig {
  id: string
  name: string
  thumbnail: string
  modelSize: string
  updatedAt: string
  lodLevel: string
  dracoCompress: boolean
  autoDecimate: boolean
  collisionBody: boolean
}

// 角色
export type RoleType = 'admin' | 'engineer' | 'inspector'

// 权限项
export interface PermissionItem {
  key: string
  label: string
  description: string
  enabled: boolean
}

// 权限分组
export interface PermissionGroup {
  key: string
  label: string
  items: PermissionItem[]
}

// 角色配置
export interface RoleConfig {
  key: RoleType
  name: string
  avatar: string
  permissions: PermissionGroup[]
}

// 统计卡片数据
export interface StatCardData {
  title: string
  value: string | number
  unit?: string
  trend?: number
  icon: string
}

// 3D场景状态
export interface SceneState {
  isExploded: boolean
  isClipping: boolean
  isAutoRoaming: boolean
  selectedDeviceId: string | null
  cameraPosition: [number, number, number]
}
