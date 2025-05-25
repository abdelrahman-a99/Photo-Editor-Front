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
  brightness: number
  contrast: number
  saturation: number
  applyFilter: (filterType: string, params: Record<string, number | string>) => Promise<void>
  setCurrentImage: (image: string) => void

  uploadImage: (imageData: string, name: string) => Promise<void>
  downloadImage: () => Promise<{ success: boolean; error: string | null }>
  setProcessing: (status: boolean) => void
  resetImage: () => void
  setError: (error: string | null) => void
  rotateImage: (degrees: number) => void
  cropImage: (crop: { x: number; y: number; width: number; height: number }) => void
  resizeImage: (scale: number) => void
  adjustImage: (brightness: number, contrast: number, saturation: number) => void
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
  scale: number,
  brightness: number = 100,
  contrast: number = 100,
  saturation: number = 100
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

      // Apply adjustments
      if (brightness !== 100 || contrast !== 100 || saturation !== 100) {
        const imageData = ctx?.getImageData(0, 0, width, height);
        if (imageData) {
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
            // Apply brightness and contrast
            data[i] = ((data[i] - 128) * contrast / 100 + 128) * brightness / 100;
            data[i + 1] = ((data[i + 1] - 128) * contrast / 100 + 128) * brightness / 100;
            data[i + 2] = ((data[i + 2] - 128) * contrast / 100 + 128) * brightness / 100;

            // Apply saturation
            if (saturation !== 100) {
              const gray = 0.2989 * data[i] + 0.5870 * data[i + 1] + 0.1140 * data[i + 2];
              data[i] = gray + (data[i] - gray) * saturation / 100;
              data[i + 1] = gray + (data[i + 1] - gray) * saturation / 100;
              data[i + 2] = gray + (data[i + 2] - gray) * saturation / 100;
            }
          }
          ctx?.putImageData(imageData, 0, 0);
        }
      }
      
      resolve(canvas.toDataURL());
    };
    
    img.src = originalImage;
  });
};

export const usePhotoStore = create<PhotoState>((set, get) => ({
  currentImage: null,
  imageName: null,
  originalImage: null,
  isProcessing: false,
  error: null,
  rotation: 0,
  crop: null,
  scale: 1,
  brightness: 100,
  contrast: 100,
  saturation: 100,

  setCurrentImage: (image) => set({ currentImage: image }),

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
    const state = get();
    if (!state.imageName) {
      set({ error: 'No image selected' });
      return { success: false, error: 'No image selected' };
    }
    
    try {
      set({ isProcessing: true, error: null });
      const result = await apiDownloadImage(state.imageName);
      
      if (!result.success) {
        set({ 
          error: result.error,
          isProcessing: false 
        });
        return { success: false, error: result.error };
      }
      
      set({ isProcessing: false, error: null });
      return { success: true, error: null };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to download image';
      set({ 
        error: errorMessage,
        isProcessing: false 
      });
      return { success: false, error: errorMessage };
    }
  },

  setProcessing: (status) => set({ isProcessing: status }),

  resetImage: () => set((state) => {
    if (!state.imageName) return state;
    
    // Update backend to set processed to false
    updateBackendImage(state.originalImage!, state.imageName, false);
    
    return {
      currentImage: state.originalImage,
      rotation: 0,
      crop: null,
      scale: 1,
      brightness: 100,
      contrast: 100,
      saturation: 100
    };
  }),

  setError: (error) => set({ error }),

  rotateImage: (degrees) => set((state) => {
    if (!state.originalImage || !state.imageName) return state;
    
    // Calculate new rotation (add to current rotation)
    const newRotation = (state.rotation + degrees) % 360;
    
    // Apply operations with new rotation
    applyOperations(
      state.originalImage,
      newRotation,
      state.crop,
      state.scale,
      state.brightness,
      state.contrast,
      state.saturation
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
      state.scale,
      state.brightness,
      state.contrast,
      state.saturation
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
      scale,
      state.brightness,
      state.contrast,
      state.saturation
    ).then(newImageData => {
      set({ currentImage: newImageData });
      updateBackendImage(newImageData, state.imageName!);
    });
    
    return state;
  }),

  adjustImage: (brightness, contrast, saturation) => set((state) => {
    if (!state.originalImage || !state.imageName) return state;
    
    set({ brightness, contrast, saturation });
    
    applyOperations(
      state.originalImage,
      state.rotation,
      state.crop,
      state.scale,
      brightness,
      contrast,
      saturation
    ).then(newImageData => {
      set({ currentImage: newImageData });
      updateBackendImage(newImageData, state.imageName!);
    });
    
    return state;
  }),

  applyFilter: async (filterType: string, params: Record<string, number | string>) => {
    const state = get();
    if (!state.imageName) {
      set({ error: 'No image selected' });
      return;
    }

    try {
      set({ isProcessing: true, error: null });

      // Convert current image to blob
      const response = await fetch(state.currentImage!);
      const blob = await response.blob();
      const file = new File([blob], state.imageName, { type: blob.type });

      // Create form data
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', filterType);
      formData.append('params', JSON.stringify(params));

      // Send to backend
      const filterResponse = await axios.post(`${API_BASE_URL}/filters/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });

      if (filterResponse.data.processed_image) {
        // Fetch the processed image
        const processedImageResponse = await fetch(`${API_BASE_URL}/static/uploads/${filterResponse.data.processed_image}`);
        if (!processedImageResponse.ok) {
          throw new Error('Failed to fetch processed image');
        }
        const processedImageBlob = await processedImageResponse.blob();
        const processedImageUrl = URL.createObjectURL(processedImageBlob);

        set({
          currentImage: processedImageUrl,
          imageName: filterResponse.data.processed_image,
          isProcessing: false,
          error: null
        });
      } else {
        throw new Error('Failed to process image');
      }
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to apply filter',
        isProcessing: false
      });
      throw error;
    }
  },
}))
