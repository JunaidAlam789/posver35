import { create } from "zustand"

interface MobileMenuStore {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}

export const useMobileMenu = create<MobileMenuStore>((set) => ({
  isOpen: false,
  onOpen: () => set((state) => ({ isOpen: !state.isOpen })),
  onClose: () => set({ isOpen: false }),
}))
