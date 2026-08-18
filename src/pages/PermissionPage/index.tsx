import { Card, Switch, Button, Avatar, List, Divider, message } from 'antd'
import { UserOutlined, SaveOutlined, RedoOutlined, SafetyOutlined, TeamOutlined } from '@ant-design/icons'
import { useUserStore } from '@/store/useUserStore'
import type { RoleType } from '@/types'
import './index.css'

export default function PermissionPage() {
  const { roles, currentRole, setCurrentRole, updatePermission } = useUserStore()

  const currentRoleConfig = roles.find((r) => r.key === currentRole)!

  const handleRoleSelect = (key: RoleType) => {
    setCurrentRole(key)
  }

  const handlePermissionChange = (groupKey: string, permKey: string, enabled: boolean) => {
    updatePermission(currentRole, groupKey, permKey, enabled)
  }

  const handleSave = () => {
    message.success('权限配置已保存')
  }

  const handleReset = () => {
    message.info('权限已重置')
  }

  const mockUsers = [
    { name: '寒青', role: '管理员', lastLogin: '2026-06-02 14:30' },
    { name: '张工', role: '工程师', lastLogin: '2026-06-02 09:15' },
    { name: '李巡检', role: '巡检员', lastLogin: '2026-06-01 16:45' },
  ]

  const roleAvatars: Record<string, { bg: string; icon: React.ReactNode }> = {
    admin: { bg: 'var(--color-success)', icon: <SafetyOutlined /> },
    engineer: { bg: 'var(--color-info)', icon: <UserOutlined /> },
    inspector: { bg: 'var(--color-warning)', icon: <TeamOutlined /> },
  }

  return (
    <div className="permission-page">
      <div className="perm-left">
        <Card
          title={
            <span className="card-title">
              <UserOutlined /> 角色选择
            </span>
          }
          size="small"
          className="perm-card"
          extra={<span className="card-extra">#0F2447</span>}
        >
          <div className="role-list">
            {roles.map((role) => {
              const avatarInfo = roleAvatars[role.key] || roleAvatars.admin
              const enabledCount = role.permissions.reduce(
                (sum, g) => sum + g.items.filter((i) => i.enabled).length,
                0,
              )
              return (
                <div
                  key={role.key}
                  className={`role-card ${currentRole === role.key ? 'active' : ''}`}
                  onClick={() => handleRoleSelect(role.key)}
                >
                  <Avatar
                    size={44}
                    icon={avatarInfo.icon}
                    style={{ backgroundColor: avatarInfo.bg, flexShrink: 0 }}
                  />
                  <div className="role-info">
                    <span className="role-name">{role.name}</span>
                    <span className="role-desc">{enabledCount} 项权限</span>
                  </div>
                  {currentRole === role.key && <span className="role-check">✓</span>}
                </div>
              )
            })}
          </div>
        </Card>
      </div>

      <div className="perm-right">
        <Card
          title={
            <span className="card-title">
              <SafetyOutlined /> 角色权限配置 - {currentRoleConfig.name}
            </span>
          }
          size="small"
          className="perm-card"
          extra={<span className="card-extra">#142A50</span>}
        >
          <div className="perm-groups">
            {currentRoleConfig.permissions.map((group) => (
              <div key={group.key} className="perm-group">
                <div className="perm-group-title">{group.label}</div>
                <div className="perm-items">
                  {group.items.map((item) => (
                    <div key={item.key} className="perm-item">
                      <div className="perm-item-info">
                        <span className="perm-item-label">{item.label}</span>
                        <span className="perm-item-desc">{item.description}</span>
                      </div>
                      <Switch
                        checked={item.enabled}
                        onChange={(checked) => handlePermissionChange(group.key, item.key, checked)}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <Divider className="perm-divider" />

          <div className="perm-actions">
            <Button type="primary" icon={<SaveOutlined />} onClick={handleSave} className="save-btn">
              保存配置
            </Button>
            <Button icon={<RedoOutlined />} onClick={handleReset}>
              重置权限
            </Button>
          </div>
        </Card>

        <Card
          title={
            <span className="card-title">
              <TeamOutlined /> 用户管理
            </span>
          }
          size="small"
          className="perm-card"
          style={{ marginTop: 16 }}
          extra={<span className="card-extra">#0F2447</span>}
        >
          <List
            dataSource={mockUsers}
            renderItem={(user) => (
              <List.Item className="user-item">
                <div className="user-info">
                  <Avatar size={36} icon={<UserOutlined />} style={{ backgroundColor: 'var(--color-primary-light-2)' }} />
                  <div className="user-detail">
                    <span className="user-name">{user.name}</span>
                    <span className="user-login">最后登录: {user.lastLogin}</span>
                  </div>
                </div>
                <span className="user-role-tag">{user.role}</span>
              </List.Item>
            )}
          />
        </Card>
      </div>
    </div>
  )
}