'use client'
// https://myprod.onrender.com/api/auth/user/details
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const loggedInUserDetails = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);

  const getFromLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  };

  const setToLocalStorage = (key, value) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  };

  const removeFromLocalStorage = (key) => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  };
    
  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const authToken = getFromLocalStorage('authToken');
      const userData = getFromLocalStorage('userData');

      if (!authToken || !userData) {
        setError('No authentication data found');
        setLoading(false);
        return null;
      }

      setToken(authToken);

      const parsedUserData = JSON.parse(userData);
      const userId = parsedUserData._id;

      if (!userId) {
        setError('User ID not found');
        setLoading(false);
        return null;
      }

      const response = await axios.post('https://myprod.onrender.com/api/auth/user/details', {
        userId: userId
      }, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response?.data?.success) {
        setUser(response?.data?.user);
        setLoading(false);
        return response?.data?.user;
      } else {
        setError(response.data.message || 'Failed to fetch user details');
        setLoading(false);
        return null;
      }

    } catch (error) {
      console.error('Error fetching user details:', error);
      
      if (error.response) {
        setError(error.response.data.message || 'Server error');
        if (error.response.status === 401) {
          removeFromLocalStorage('authToken');
          removeFromLocalStorage('userData');
          setToken(null);
        }
      } else if (error.request) {
        setError('Network error. Please check your connection.');
      } else {
        setError('An unexpected error occurred.');
      }
      
      setLoading(false);
      return null;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      fetchUserDetails();
    }
  }, []);

  const refreshUserDetails = () => {
    fetchUserDetails();
  };

  const isAuthenticated = () => {
    const authToken = getFromLocalStorage('authToken');
    const userData = getFromLocalStorage('userData');
    return !!(authToken && userData && user);
  };

  const logout = () => {
    removeFromLocalStorage('authToken');
    removeFromLocalStorage('userData');
    setUser(null);
    setToken(null);
    setError(null);
    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  };

  return {
    user,
    loading,
    token,
    error,
    fetchUserDetails,
    refreshUserDetails,
    isAuthenticated,
    logout
  };
};

export const userDetails = ()=>{
    const token = localStorage.getItem('authToken');
    const user = JSON.parse(localStorage.getItem('userData')) 
    return {token , user}
    
}

export default loggedInUserDetails;