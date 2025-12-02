import * as userApi from '../../api/user/userApi';


export const fetchUserProfile = async () => {
  const res = await userApi.getUserProfileApi();
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await userApi.updateUserProfileApi(data);
  return res.data;
};
