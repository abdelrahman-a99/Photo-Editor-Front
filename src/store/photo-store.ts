import { create } from "zustand"

interface PhotoState {
  currentImage: string | null
  imageName: string | null
  originalImage: string | null
  isProcessing: boolean

  uploadImage: (imageData: string, name: string) => void
  setProcessing: (status: boolean) => void
  resetImage: () => void
}

export const usePhotoStore = create<PhotoState>((set) => ({
  currentImage: null,
  originalImage: null,
  imageName: null,
  isProcessing: false,

  uploadImage: (imageData, name) => set({
    currentImage: imageData,
    originalImage: imageData,
    imageName: name,
  }),

  setProcessing: (status) => set({
    isProcessing: status
  }),

  resetImage: () => set((state) => ({
    currentImage: state.originalImage
  }))
}))
