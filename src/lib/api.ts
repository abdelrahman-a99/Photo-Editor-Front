import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000';

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    console.log('Attempting to upload image to:', `${API_BASE_URL}/upload/`);
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    });

    const response = await axios.post(`${API_BASE_URL}/upload/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    });
    
    console.log('Server response:', response.data);
    
    if (response.status !== 201) {
      throw new Error(response.data?.message || 'Failed to upload image');
    }
    
    if (!response.data.filename) {
      throw new Error('Server did not return a filename');
    }
    
    return response.data;
  } catch (error) {
    console.error('Detailed upload error:', error);
    
    if (axios.isAxiosError(error)) {
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        code: error.code
      });

      if (error.code === 'ECONNREFUSED') {
        throw new Error('Cannot connect to server. Please make sure the backend is running.');
      }
      
      if (error.response) {
        const errorMessage = error.response.data?.message || error.response.statusText;
        throw new Error(`Server error: ${error.response.status} - ${errorMessage}`);
      }
      
      throw new Error('Failed to upload image to server');
    }
    throw error;
  }
};

export const getImageLogs = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/upload/logs`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        throw new Error('Image logs endpoint not found. Please check backend configuration.');
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch image logs');
    }
    throw error;
  }
};

export const downloadImage = async (filename: string) => {
  try {
    console.log('Attempting to download image:', filename);
    
    const response = await axios.get(`${API_BASE_URL}/upload/download/${filename}`, {
      responseType: 'blob',
      validateStatus: function (status) {
        return status < 500; // Resolve only if the status code is less than 500
      }
    });

    if (response.status === 400) {
      // If the image hasn't been processed
      const reader = new FileReader();
      const text = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsText(response.data);
      });
      const error = JSON.parse(text as string);
      console.log('Image not processed:', error);
      return { 
        success: false, 
        error: 'Please apply some operations to the image before downloading. No changes have been made to this image yet.' 
      };
    }

    if (response.status === 404) {
      const reader = new FileReader();
      const text = await new Promise((resolve) => {
        reader.onload = () => resolve(reader.result);
        reader.readAsText(response.data);
      });
      const error = JSON.parse(text as string);
      console.log('Image not found:', error);
      return { 
        success: false, 
        error: 'Image not found' 
      };
    }

    if (response.status !== 200) {
      console.log('Download failed:', response.status);
      return { 
        success: false, 
        error: 'Failed to download image' 
      };
    }

    // Create a download link and trigger it
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);

    return { success: true };
  } catch (error) {
    console.log('Download error:', error);
    if (axios.isAxiosError(error)) {
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to download image' 
      };
    }
    return { 
      success: false, 
      error: 'An unexpected error occurred while downloading the image' 
    };
  }
};

export const generateHistogram = async (imagePath: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/histogram/get`, {
      filename: imagePath
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to generate histogram');
    }
    throw error;
  }
};

export const equalizeHistogram = async (imagePath: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/histogram/equalize`, {
      filename: imagePath
    });
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to equalize histogram');
    }
    throw error;
  }
}; 