import { create } from "zustand"

export interface LayoutState {
  hideHeader: boolean
  showDrawer: boolean
  setLayout: (state: Partial<LayoutState>) => void
}

export const useLayout = create<LayoutState>((set) => ({
  hideHeader: false,
  showDrawer: false,
  setLayout: (state) => set(state),
}))
