import api from '../api';

export const registerUserApi = (data) => api.post('/users/register', data);
export const loginUserApi = (data) => api.post('/users/login', data);


// Password Reset APIs
export const forgotPasswordApi = (data) => api.post('/users/forgot-password', data);
export const verifyResetCodeApi = (data) => api.post('/users/verify-reset-code', data);
export const resetPasswordApi = (data) => api.post('/users/reset-password', data);