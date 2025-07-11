'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from './AuthSlice';
export default function Protect({ children }) {
  const router = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state)=>state?.userLocalSlice.token)
  const user = useSelector((state)=>state?.userLocalSlice.user)
   
  useEffect(() => {
    dispatch(loadTokenFromLocalStorage());
    dispatch(loadUserFromLocalStorage());
  }, [dispatch , router , token , user]);

  useEffect(() => {
    if (!token || !user) {
      router.replace('/');
    }
  }, [token, user, router]);

  return <>{children}</>;
}
