'use client';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loadTokenFromLocalStorage , loadUserFromLocalStorage } from './AuthSlice';
export default function AuthLoader() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadUserFromLocalStorage());
    dispatch(loadTokenFromLocalStorage());
  }, [dispatch]);

  return null;
}
