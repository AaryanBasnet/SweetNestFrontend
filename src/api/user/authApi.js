import api from '../api';

export const registerUserApi = (data) => api.post('/users/register', data);
export const loginUserApi = (data) => api.post('/users/login', data);