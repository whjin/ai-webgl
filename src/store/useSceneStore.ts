import { create } from 'zustand'
import type { SceneState } from '@/types'

interface SceneStore extends SceneState {
  toggleExplode: () => void
  setExploded: (v: boolean) => void
  toggleClipping: () => void
  toggleAutoRoaming: () => void
  setSelectedDevice: (id: string | null) => void
  setCameraPosition: (pos: [number, number, number]) => void
  resetView: () => void
}

export const useSceneStore = create<SceneStore>((set) => ({
  isExploded: false,
  isClipping: false,
  isAutoRoaming: false,
  selectedDeviceId: null,
  cameraPosition: [6, 5, 7],

  toggleExplode: () => set((s) => ({ isExploded: !s.isExploded })),
  setExploded: (v) => set({ isExploded: v }),
  toggleClipping: () => set((s) => ({ isClipping: !s.isClipping })),
  toggleAutoRoaming: () => set((s) => ({ isAutoRoaming: !s.isAutoRoaming })),
  setSelectedDevice: (id) => set({ selectedDeviceId: id }),
  setCameraPosition: (pos) => set({ cameraPosition: pos }),
  resetView: () =>
    set({
      isExploded: false,
      isClipping: false,
      isAutoRoaming: false,
      cameraPosition: [6, 5, 7],
    }),
}))
