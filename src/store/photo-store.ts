import { create } from "zustand"
import { uploadImage as apiUploadImage, downloadImage as apiDownloadImage } from "@/lib/api"
import axios from 'axios'

const API_BASE_URL = 'http://localhost:5000'

interface PhotoState {
  currentImage: string | null
  imageName: string | null
  originalImage: string | null
  isProcessing: boolean
  error: string | null
  rotation: number
  crop: { x: number; y: number; width: number; height: number } | null
  scale: number

  uploadImage: (imageData: string, name: string) => Promise<void>
  downloadImage: () => Promise<void>
  setProcessing: (status: boolean) => void
  resetImage: () => void
  setError: (error: string | null) => void
  rotateImage: (degrees: number) => void
  cropImage: (crop: { x: number; y: number; width: number; height: number }) => void
  resizeImage: (scale: number) => void
}

// Helper function to update the backend with the current image
const updateBackendImage = async (imageData: string, filename: string, processed: boolean = true) => {
  try {
    // Convert base64 to blob
    const response = await fetch(imageData);
    const blob = await response.blob();
    const file = new File([blob], filename, { type: blob.type });

    // Create form data
    const formData = new FormData();
    formData.append('file', file);
    formData.append('processed', processed.toString());

    // Send to backend
    await axios.post(`${API_BASE_URL}/upload/update/${filename}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    });
  } catch (error) {
    console.error('Failed to update backend:', error);
  }
};

// Helper function to apply all operations to the original image
const applyOperations = async (
  originalImage: string,
  rotation: number,
  crop: { x: number; y: number; width: number; height: number } | null,
  scale: number
): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Start with original image dimensions
      let width = img.width;
      let height = img.height;
      
      // Apply rotation first
      if (rotation !== 0) {
        const angle = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(angle));
        const cos = Math.abs(Math.cos(angle));
        width = img.width * cos + img.height * sin;
        height = img.width * sin + img.height * cos;
      }
      
      // Apply crop if exists
      if (crop) {
        width = crop.width;
        height = crop.height;
      }
      
      // Apply scale
      width *= scale;
      height *= scale;
      
      // Set canvas size
      canvas.width = width;
      canvas.height = height;
      
      // Clear canvas
      ctx?.clearRect(0, 0, width, height);
      
      // Apply transformations in sequence
      if (rotation !== 0) {
        ctx?.translate(width / 2, height / 2);
        ctx?.rotate((rotation * Math.PI) / 180);
        ctx?.translate(-img.width / 2, -img.height / 2);
      }
      
      // Draw the image
      if (crop) {
        ctx?.drawImage(
          img,
          crop.x,
          crop.y,
          crop.width,
          crop.height,
          0,
          0,
          width,
          height
        );
      } else {
        ctx?.drawImage(
          img,
          0,
          0,
          width,
          height
        );
      }
      
      resolve(canvas.toDataURL());
    };
    
    img.src = originalImage;
  });
};

export const usePhotoStore = create<PhotoState>((set, get) => ({
  currentImage: null,
  originalImage: null,
  imageName: null,
  isProcessing: false,
  error: null,
  rotation: 0,
  crop: null,
  scale: 1,

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
      if (result && result.filename) {
        set({
          currentImage: imageData,
          originalImage: imageData,
          imageName: result.filename,
          isProcessing: false,
          rotation: 0,
          crop: null,
          scale: 1
        });
      } else {
        throw new Error('Failed to upload image to server');
      }
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to upload image',
        isProcessing: false 
      });
      throw error;
    }
  },

  downloadImage: async () => {
    try {
      set({ isProcessing: true, error: null });
      const state = usePhotoStore.getState();
      
      if (!state.imageName) {
        throw new Error('No image to download');
      }

      await apiDownloadImage(state.imageName);
      set({ isProcessing: false });
    } catch (error) {
      set({ 
        error: error instanceof Error ? error.message : 'Failed to download image',
        isProcessing: false 
      });
      throw error;
    }
  },

  setProcessing: (status) => set({
    isProcessing: status
  }),

  resetImage: () => set((state) => {
    if (!state.imageName) return state;
    
    // Update backend to set processed to false
    updateBackendImage(state.originalImage!, state.imageName, false);
    
    return {
      currentImage: state.originalImage,
      rotation: 0,
      crop: null,
      scale: 1
    };
  }),

  setError: (error) => set({
    error
  }),

  rotateImage: (degrees) => set((state) => {
    if (!state.originalImage || !state.imageName) return state;
    
    // Calculate new rotation (add to current rotation)
    const newRotation = (state.rotation + degrees) % 360;
    
    // Apply operations with new rotation
    applyOperations(
      state.originalImage,
      newRotation,
      state.crop,
      state.scale
    ).then(newImageData => {
      set({ 
        currentImage: newImageData,
        rotation: newRotation 
      });
      updateBackendImage(newImageData, state.imageName!);
    });
    
    return state;
  }),

  cropImage: (crop) => set((state) => {
    if (!state.originalImage || !state.imageName) return state;
    
    set({ crop });
    
    applyOperations(
      state.originalImage,
      state.rotation,
      crop,
      state.scale
    ).then(newImageData => {
      set({ currentImage: newImageData });
      updateBackendImage(newImageData, state.imageName!);
    });
    
    return state;
  }),

  resizeImage: (scale) => set((state) => {
    if (!state.originalImage || !state.imageName) return state;
    
    set({ scale });
    
    applyOperations(
      state.originalImage,
      state.rotation,
      state.crop,
      scale
    ).then(newImageData => {
      set({ currentImage: newImageData });
      updateBackendImage(newImageData, state.imageName!);
    });
    
    return state;
  })
}))
