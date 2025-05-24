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