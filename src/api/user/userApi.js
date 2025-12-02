import api from '../api';

export const getUserProfileApi = () => api.get('/users/profile');
export const updateUserProfileApi = (data) => api.put('/users/profile', data);
