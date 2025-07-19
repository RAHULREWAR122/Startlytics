'use client'
import React from 'react'
import { useState, useEffect } from 'react'
import { X, Eye, EyeOff, Loader2, Mail, Lock, Chrome, User } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import { closeLoginModal , openRegisterModal , closeRegisterModal , openForgotModal } from '../Redux/LoginModal';
import { useDispatch , useSelector } from 'react-redux';
import { saveUserToLocalStorage , saveTokenToLocalStorage } from '../Redux/AuthSlice';
import ForgotPasswordModal from '../Hero/ForgotPassword';
import { useThemeColor } from '@/hooks/themeColors';
import { BASE_URL } from '@/apiLinks';

const LoginModal = ({}) => {
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [toast, setToast] = useState(null);
  const [rememberMe, setRememberMe] = useState(false);
  const dispatch = useDispatch();
  
  const {background , text} = useThemeColor();

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const closeToast = () => {
    setToast(null);
  };

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!loginForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(loginForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!loginForm.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (loginForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLoginSubmit = async (e) => {
   
    e.preventDefault();
    
    if (!validateForm()) {
       toast.error('Please check All Fileds');
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: loginForm.email.trim().toLowerCase(),
          password: loginForm.password
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      const { token, user } = data;
      dispatch(saveUserToLocalStorage(user));
      dispatch(saveTokenToLocalStorage(token));
     
      // userDetails();
      dispatch(closeLoginModal());
      setLoginForm({ email: '', password: '' });
      setRememberMe(false); // setTimeout(() => {
      //   dispatch(closeLoginModal());
      //   setLoginForm({ email: '', password: '' });
      //   setRememberMe(false);
      // }, 1500);

    } catch (error) {
      console.error('Login failed:', error);
      
      if (error.message.includes('Invalid credentials') || error.message.includes('Unauthorized')) {
        setErrors({ 
          email: 'Invalid email or password',
          password: 'Invalid email or password'
        });
        showToast('Invalid email or password. Please try again.', 'error');
      } else if (error.message.includes('not verified')) {
        showToast('Please verify your email before signing in.', 'error');
      } else if (error.message.includes('account locked')) {
        showToast('Account temporarily locked. Please try again later.', 'error');
      } else {
        showToast('Login failed. Please check your connection and try again.', 'error');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   setIsGoogleLoading(true);
    
  //   try {
  //     showToast('Initiating Google Sign-In...', 'info');
      
  //     // Simulate Google OAuth flow
  //     // In real implementation, you would use Google OAuth SDK
  //     await new Promise(resolve => setTimeout(resolve, 2000));
      
  //     const mockGoogleUser = {
  //       token: 'mock-google-jwt-token',
  //       user: {
  //         id: 'google-user-123',
  //         name: 'John Doe',
  //         email: 'john.doe@gmail.com',
  //         picture: 'https://via.placeholder.com/150',
  //         provider: 'google'
  //       }
  //     };
      
  //     // Store auth data
  //     localStorage.setItem('authToken', mockGoogleUser.token);
  //     localStorage.setItem('userData', JSON.stringify(mockGoogleUser.user));
      
  //     showToast(`Welcome, ${mockGoogleUser.user.name}!`, 'success');
      
  //     setTimeout(() => {
  //       setShowLoginModal(false);
  //     }, 1500);
      
  //   } catch (error) {
  //     console.error('Google login failed:', error);
  //     showToast('Google Sign-In failed. Please try again.', 'error');
  //   } finally {
  //     setIsGoogleLoading(false);
  //   }
  // };

  const switchToRegister = () => {
    dispatch(openRegisterModal())
  };

  

  const handleInputChange = (field, value) => {
    setLoginForm({ ...loginForm, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleForgotPassword = () => {
     dispatch(closeLoginModal());
     dispatch(openForgotModal());
  };
  
  
  return (
    <>
     
      <div onClick={()=>dispatch(closeLoginModal())} className="fixed inset-0 backdrop-blur-sm bg-black/40 bg-opacity-50 flex items-center justify-center z-100 p-4">
        <div onClick={(e)=>e.stopPropagation()} style={{background : background.primary}} className="bg-gray-800 rounded-2xl px-8 py-4 w-full max-w-md relative max-h-[85vh] mt-10  overflow-y-auto border border-gray-700 shadow-2xl">
          <button
            onClick={() => dispatch(closeLoginModal())}
            className="absolute top-4 cursor-pointer right-4 text-gray-400 hover:text-white transition-colors"
            disabled={isLoading || isGoogleLoading}
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <h2 style={{color : text.secondary}} className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
            <p style={{color : text.muted}} className="text-gray-400">Sign in to your Startlytics account</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-white mb-2">
                <div className='flex justify-between items-center'>
                <span style={{color : text.secondary}}>
                   Email <span className="text-red-500">*</span>
                  </span>
                   {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  style={{color : text.secondary , background : background.secondary}}
                  className={`w-full pl-10 pr-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors text-white placeholder-gray-400 ${
                    errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="Enter your email"
                  disabled={isLoading || isGoogleLoading}
                />
              </div>
             
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
               <div className='flex justify-between items-center'>
              <span style={{color : text.secondary}}> 
                  Password <span className="text-red-500">*</span>
                </span>
               {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
               </div>
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={loginForm.password}
                  style={{color : text.secondary , background : background.secondary}}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors text-white placeholder-gray-400 ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="Enter your password"
                  disabled={isLoading || isGoogleLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading || isGoogleLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              
            </div>

            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-400 cursor-pointer hover:text-blue-600 transition-colors"
                disabled={isLoading || isGoogleLoading}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || isGoogleLoading}
              className="w-full cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing In...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">Or continue with</span>
              </div>
            </div>

            <button
              onClick={handleGoogleLogin}
              disabled={isLoading || isGoogleLoading}
              className="w-full mt-4 bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isGoogleLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Signing in with Google...
                </>
              ) : (
                <>
                  <Chrome className="w-5 h-5 mr-2" />
                  Continue with Google
                </>
              )}
            </button>
          </div> */}

          <div className="mt-6 text-center">
            <p style={{color : text.secondary }} className="text-gray-400">
              Don't have an account?{' '}
              <button
                onClick={switchToRegister}
                className="text-blue-400 cursor-pointer hover:text-blue-500 mb-3 font-semibold transition-colors"
                disabled={isLoading || isGoogleLoading}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginModal;