import { create } from 'zustand'
import type { RoleType, RoleConfig } from '@/types'
import { mockRoles } from '@/services/mock/data'

interface UserStore {
  currentRole: RoleType
  roles: RoleConfig[]
  username: string
  setCurrentRole: (role: RoleType) => void
  updatePermission: (roleKey: RoleType, groupKey: string, permKey: string, enabled: boolean) => void
  getCurrentRoleConfig: () => RoleConfig | undefined
}

export const useUserStore = create<UserStore>((set, get) => ({
  currentRole: 'admin',
  roles: mockRoles,
  username: '寒青',

  setCurrentRole: (role) => set({ currentRole: role }),

  updatePermission: (roleKey, groupKey, permKey, enabled) =>
    set((state) => ({
      roles: state.roles.map((role) => {
        if (role.key !== roleKey) return role
        return {
          ...role,
          permissions: role.permissions.map((group) => {
            if (group.key !== groupKey) return group
            return {
              ...group,
              items: group.items.map((item) =>
                item.key === permKey ? { ...item, enabled } : item,
              ),
            }
          }),
        }
      }),
    })),

  getCurrentRoleConfig: () => get().roles.find((r) => r.key === get().currentRole),
}))
