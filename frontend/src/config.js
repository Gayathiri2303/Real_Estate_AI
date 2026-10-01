// ✅ FIXED: fallback now points to backend, not localhost
const API_URL = process.env.REACT_APP_API_URL || 'https://real-estate-ai-backend-kappa.vercel.app/api';

export { API_URL };
export default API_URL;
