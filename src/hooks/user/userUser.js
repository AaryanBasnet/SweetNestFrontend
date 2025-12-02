import { useState } from 'react';
import * as userService from '../../services/user/userServices';

export const useUser = () => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  



  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const profile = await userService.fetchUserProfile();
      setUser(profile);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return { user,   fetchProfile, loading, error };
};
