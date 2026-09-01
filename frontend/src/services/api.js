import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 45000, // 45 seconds for AI analysis
});

/**
 * Fetch system health status from FastAPI backend.
 */
export const getHealthStatus = async () => {
  try {
    const response = await apiClient.get('/health');
    return response.data;
  } catch (error) {
    console.error('Failed to connect to backend health endpoint:', error);
    throw new Error('We couldn\'t reach the analysis service. Please check if the backend server is running.');
  }
};

/**
 * Analyze resume against job description via POST /api/analyze.
 * @param {File} file - Resume file (.pdf or .docx)
 * @param {string} jobDescription - Target job description text
 */
export const analyzeResume = async (file, jobDescription) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('job_description', jobDescription);

  try {
    // Note: Do NOT set explicit 'Content-Type': 'multipart/form-data' header.
    // Axios & browser automatically append the correct boundary parameter when passing FormData.
    const response = await apiClient.post('/analyze', formData);
    return response.data;
  } catch (error) {
    if (error.response) {
      // Backend returned a response with status code outside 2xx
      const status = error.response.status;
      const detail = error.response.data?.detail;

      if (typeof detail === 'string') {
        throw new Error(detail);
      } else if (Array.isArray(detail)) {
        // Validation errors array
        const messages = detail.map(err => err.msg || JSON.stringify(err)).join(', ');
        throw new Error(`Validation error: ${messages}`);
      } else if (status === 400) {
        throw new Error('Invalid upload. Please check your resume file format and size.');
      } else if (status === 422) {
        throw new Error('Please provide a job description with at least 20 characters.');
      } else if (status >= 500) {
        throw new Error('Something went wrong on our server while analyzing your resume. Please try again.');
      }
    } else if (error.code === 'ECONNABORTED') {
      throw new Error('The analysis request timed out. Please try again.');
    } else if (error.request) {
      throw new Error('We couldn\'t reach the analysis service. Please check your connection and try again.');
    }

    throw new Error(error.message || 'An unexpected error occurred during analysis.');
  }
};

export default apiClient;
