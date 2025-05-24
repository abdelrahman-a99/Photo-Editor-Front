import { create } from "zustand"
import { uploadImage as apiUploadImage } from "@/lib/api"

interface PhotoState {
  currentImage: string | null
  imageName: string | null
  originalImage: string | null
  isProcessing: boolean
  error: string | null

  uploadImage: (imageData: string, name: string) => Promise<void>
  setProcessing: (status: boolean) => void
  resetImage: () => void
  setError: (error: string | null) => void
}

export const usePhotoStore = create<PhotoState>((set) => ({
  currentImage: null,
  originalImage: null,
  imageName: null,
  isProcessing: false,
  error: null,

  uploadImage: async (imageData, name) => {
    try {
      set({ isProcessing: true, error: null });
      
      // Convert base64 to File object
      const response = await fetch(imageData);
      const blob = await response.blob();
      const file = new File([blob], name, { type: blob.type });
      
      // Upload to backend
      const result = await apiUploadImage(file);
      
      // Only set the image state if backend upload was successful
      if (result) {
        set({
          currentImage: imageData,
          originalImage: imageData,
          imageName: name,
          isProcessing: false
        });
      } else {
        throw new Error('Failed to upload image to server');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload image',
        isProcessing: false 
      });
      throw error; // Re-throw to handle in the component
    }
  },

  setProcessing: (status) => set({
    isProcessing: status
  }),

  resetImage: () => set((state) => ({
    currentImage: state.originalImage
  })),

  setError: (error) => set({
    error
  })
}))
