import * as authApi from '../../api/user/authApi';

export const registerUser = async (userData) => {
  const res = await authApi.registerUserApi(userData);
  return res.data;
};

export const loginUser = async (credentials) => {
  const res = await authApi.loginUserApi(credentials);
  return res.data;
};