import type {
  Device,
  AlarmRecord,
  DefectResult,
  ProjectConfig,
  RoleConfig,
  StatCardData,
} from '@/types'

// ===== 设备数据 =====
export const mockDevices: Device[] = [
  {
    id: 'dev-001',
    name: '电机A-07',
    type: '电动机',
    status: 'alarm',
    temperature: 42,
    pressure: 1.6,
    speed: 1450,
    healthRate: 88,
    aiFaultProbability: 12,
    position: [0, 0, 0],
  },
  {
    id: 'dev-002',
    name: '泵组B-03',
    type: '离心泵',
    status: 'warning',
    temperature: 38,
    pressure: 2.1,
    speed: 2900,
    healthRate: 92,
    aiFaultProbability: 8,
    position: [3, 0, 1],
  },
  {
    id: 'dev-003',
    name: '传送带C-01',
    type: '传送带',
    status: 'normal',
    temperature: 28,
    pressure: 0,
    speed: 120,
    healthRate: 98,
    aiFaultProbability: 2,
    position: [-2, 0, 2],
  },
  {
    id: 'dev-004',
    name: '减速机D-05',
    type: '减速机',
    status: 'normal',
    temperature: 35,
    pressure: 0.8,
    speed: 750,
    healthRate: 95,
    aiFaultProbability: 5,
    position: [1, 0, -2],
  },
]

// ===== 告警数据 =====
export const mockAlarms: AlarmRecord[] = [
  {
    id: 'alm-001',
    time: '2026-06-02 14:32',
    deviceName: '电机A-07',
    deviceId: 'dev-001',
    level: 'critical',
    content: '温度超标，当前42°C',
    status: 'pending',
  },
  {
    id: 'alm-002',
    time: '2026-06-02 14:18',
    deviceName: '泵组B-03',
    deviceId: 'dev-002',
    level: 'warning',
    content: '压力异常波动',
    status: 'processing',
  },
  {
    id: 'alm-003',
    time: '2026-06-02 12:18',
    deviceName: '泵组B-03',
    deviceId: 'dev-002',
    level: 'warning',
    content: '振动值偏高',
    status: 'processing',
  },
  {
    id: 'alm-004',
    time: '2026-06-02 12:05',
    deviceName: '传送带C-01',
    deviceId: 'dev-003',
    level: 'info',
    content: '通信延迟',
    status: 'resolved',
  },
  {
    id: 'alm-005',
    time: '2026-06-02 10:30',
    deviceName: '电机A-07',
    deviceId: 'dev-001',
    level: 'critical',
    content: '轴承温度异常',
    status: 'resolved',
  },
  {
    id: 'alm-006',
    time: '2026-06-02 09:15',
    deviceName: '减速机D-05',
    deviceId: 'dev-004',
    level: 'info',
    content: '定期维护提醒',
    status: 'resolved',
  },
  {
    id: 'alm-007',
    time: '2026-06-01 16:45',
    deviceName: '传送带C-01',
    deviceId: 'dev-003',
    level: 'warning',
    content: '皮带张力不足',
    status: 'resolved',
  },
  {
    id: 'alm-008',
    time: '2026-06-01 14:20',
    deviceName: '泵组B-03',
    deviceId: 'dev-002',
    level: 'critical',
    content: '密封泄漏报警',
    status: 'resolved',
  },
]

// ===== AI缺陷检测结果 =====
export const mockDefectResults: DefectResult[] = [
  {
    id: 'def-001',
    type: '裂纹',
    confidence: 87,
    suggestion: '停机复检',
    bbox: { x: 15, y: 35, width: 25, height: 20 },
  },
  {
    id: 'def-002',
    type: '锈蚀',
    confidence: 76,
    suggestion: '清洁保养',
    bbox: { x: 45, y: 40, width: 30, height: 25 },
  },
  {
    id: 'def-003',
    type: '形变',
    confidence: 62,
    suggestion: '进一步测量',
    bbox: { x: 60, y: 20, width: 20, height: 15 },
  },
]

// ===== 工程配置 =====
export const mockProjects: ProjectConfig[] = [
  {
    id: 'proj-001',
    name: '产线A数字孪生',
    thumbnail: '',
    modelSize: '248MB',
    updatedAt: '2026-06-02',
    lodLevel: 'LOD2',
    dracoCompress: true,
    autoDecimate: true,
    collisionBody: false,
  },
  {
    id: 'proj-002',
    name: '车间B设备集群',
    thumbnail: '',
    modelSize: '512MB',
    updatedAt: '2026-05-28',
    lodLevel: 'LOD3',
    dracoCompress: true,
    autoDecimate: false,
    collisionBody: true,
  },
  {
    id: 'proj-003',
    name: '泵站C远程监控',
    thumbnail: '',
    modelSize: '128MB',
    updatedAt: '2026-05-20',
    lodLevel: 'LOD1',
    dracoCompress: false,
    autoDecimate: true,
    collisionBody: false,
  },
]

// ===== 角色权限 =====
export const mockRoles: RoleConfig[] = [
  {
    key: 'admin',
    name: '管理员',
    avatar: 'A',
    permissions: [
      {
        key: 'scene',
        label: '3D场景权限',
        items: [
          { key: 'scene-view', label: '场景查看', description: '查看3D数字孪生场景', enabled: true },
          { key: 'scene-edit', label: '场景编辑', description: '编辑场景布局与设备位置', enabled: true },
        ],
      },
      {
        key: 'ai',
        label: 'AI推理权限',
        items: [
          { key: 'ai-detect', label: 'AI检测', description: '使用AI缺陷检测功能', enabled: true },
          { key: 'ai-config', label: '模型配置', description: '配置AI推理模型参数', enabled: true },
        ],
      },
      {
        key: 'data',
        label: '数据导出权限',
        items: [
          { key: 'data-export', label: '数据导出', description: '导出报表与检测数据', enabled: true },
        ],
      },
      {
        key: 'alarm',
        label: '告警查看权限',
        items: [
          { key: 'alarm-view', label: '告警查看', description: '查看所有告警记录', enabled: true },
          { key: 'alarm-handle', label: '告警处理', description: '标记处理与删除告警', enabled: true },
        ],
      },
      {
        key: 'system',
        label: '系统配置权限',
        items: [
          { key: 'system-config', label: '系统配置', description: '系统参数与权限管理', enabled: true },
        ],
      },
    ],
  },
  {
    key: 'engineer',
    name: '工程师',
    avatar: 'E',
    permissions: [
      {
        key: 'scene',
        label: '3D场景权限',
        items: [
          { key: 'scene-view', label: '场景查看', description: '查看3D数字孪生场景', enabled: true },
          { key: 'scene-edit', label: '场景编辑', description: '编辑场景布局与设备位置', enabled: true },
        ],
      },
      {
        key: 'ai',
        label: 'AI推理权限',
        items: [
          { key: 'ai-detect', label: 'AI检测', description: '使用AI缺陷检测功能', enabled: true },
          { key: 'ai-config', label: '模型配置', description: '配置AI推理模型参数', enabled: false },
        ],
      },
      {
        key: 'data',
        label: '数据导出权限',
        items: [
          { key: 'data-export', label: '数据导出', description: '导出报表与检测数据', enabled: true },
        ],
      },
      {
        key: 'alarm',
        label: '告警查看权限',
        items: [
          { key: 'alarm-view', label: '告警查看', description: '查看所有告警记录', enabled: true },
          { key: 'alarm-handle', label: '告警处理', description: '标记处理与删除告警', enabled: true },
        ],
      },
      {
        key: 'system',
        label: '系统配置权限',
        items: [
          { key: 'system-config', label: '系统配置', description: '系统参数与权限管理', enabled: false },
        ],
      },
    ],
  },
  {
    key: 'inspector',
    name: '巡检员',
    avatar: 'I',
    permissions: [
      {
        key: 'scene',
        label: '3D场景权限',
        items: [
          { key: 'scene-view', label: '场景查看', description: '查看3D数字孪生场景', enabled: true },
          { key: 'scene-edit', label: '场景编辑', description: '编辑场景布局与设备位置', enabled: false },
        ],
      },
      {
        key: 'ai',
        label: 'AI推理权限',
        items: [
          { key: 'ai-detect', label: 'AI检测', description: '使用AI缺陷检测功能', enabled: true },
          { key: 'ai-config', label: '模型配置', description: '配置AI推理模型参数', enabled: false },
        ],
      },
      {
        key: 'data',
        label: '数据导出权限',
        items: [
          { key: 'data-export', label: '数据导出', description: '导出报表与检测数据', enabled: false },
        ],
      },
      {
        key: 'alarm',
        label: '告警查看权限',
        items: [
          { key: 'alarm-view', label: '告警查看', description: '查看所有告警记录', enabled: true },
          { key: 'alarm-handle', label: '告警处理', description: '标记处理与删除告警', enabled: false },
        ],
      },
      {
        key: 'system',
        label: '系统配置权限',
        items: [
          { key: 'system-config', label: '系统配置', description: '系统参数与权限管理', enabled: false },
        ],
      },
    ],
  },
]

// ===== 报表统计卡片 =====
export const mockStatCards: StatCardData[] = [
  { title: '设备总数', value: 128, unit: '台', trend: 5, icon: 'tool' },
  { title: '在线率', value: '96.8', unit: '%', trend: 1.2, icon: 'link' },
  { title: '今日告警', value: 42, unit: '条', trend: -8, icon: 'bell' },
  { title: 'AI检测', value: 186, unit: '次', trend: 15, icon: 'scan' },
]

// ===== 健康趋势数据 =====
export const mockHealthTrend = {
  months: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月'],
  temperature: [40, 62, 50, 72, 68, 80, 85, 75, 70, 65, 72],
  pressure: [35, 55, 48, 60, 52, 58, 50, 45, 55, 60, 58],
  speed: [15, 22, 30, 35, 18, 20, 25, 30, 38, 40, 42],
}

// ===== 缺陷类型统计 =====
export const mockDefectStats = {
  types: ['裂纹', '锈蚀', '形变', '松动', '磨损', '腐蚀', '裂纹', '锈蚀', '形变', '松动'],
  values: [320, 350, 280, 310, 340, 290, 330, 300, 360, 310],
}

// ===== 告警趋势 =====
export const mockAlarmTrend = {
  hours: ['0:00', '2:00', '4:00', '6:00', '8:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'],
  critical: [10, 8, 5, 12, 25, 30, 28, 35, 32, 28, 20, 15],
  warning: [20, 15, 12, 18, 35, 40, 38, 45, 42, 38, 30, 22],
  info: [30, 25, 20, 28, 50, 55, 52, 60, 58, 50, 40, 35],
}
