import { create } from 'zustand'

interface UiStore {
  sidebarCollapsed: boolean
  rightPanelVisible: boolean
  rightPanelWidth: number
  currentProject: string
  toggleSidebar: () => void
  toggleRightPanel: () => void
  setRightPanelWidth: (w: number) => void
  setCurrentProject: (name: string) => void
}

export const useUiStore = create<UiStore>((set) => ({
  sidebarCollapsed: false,
  rightPanelVisible: true,
  rightPanelWidth: 320,
  currentProject: '产线A数字孪生',

  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleRightPanel: () => set((s) => ({ rightPanelVisible: !s.rightPanelVisible })),
  setRightPanelWidth: (w) => set({ rightPanelWidth: w }),
  setCurrentProject: (name) => set({ currentProject: name }),
}))
