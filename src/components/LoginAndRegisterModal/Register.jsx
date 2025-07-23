'use client'
import React from 'react'
import { useState } from 'react'
import { X, Play, TrendingUp, Eye, EyeOff, Loader2 } from 'lucide-react';
import axios from 'axios';
import { closeLoginModal , openRegisterModal , openLoginModal , closeRegisterModal } from '../Redux/LoginModal';
import { useDispatch , useSelector } from 'react-redux';
import { useThemeColor } from '@/hooks/themeColors';
import { BASE_URL } from '@/apiLinks';
import { ToastContainer , toast as toastMsg } from 'react-toastify';

const Register = ({ }) => {
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    startupType: ''
  });

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const {background , text} = useThemeColor();

  const validateForm = () => {
    const newErrors = {};
    
    if (!registerForm.name.trim()) {
      newErrors.name = 'Full name is required';
    } else if (registerForm.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    if (!registerForm.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(registerForm.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!registerForm.password) {
      newErrors.password = 'Password is required';
    } else if (registerForm.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!registerForm.startupType) {
      newErrors.startupType = 'Please select a startup type';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegisterSubmit = async(e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toastMsg.error('Please check all fields.')
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/register`, {
        name: registerForm.name.trim(),
        email: registerForm.email.trim().toLowerCase(),
        password: registerForm.password,
        startupType: registerForm.startupType
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 10000 
      });

      if (response?.data) {
        toastMsg.success("Account created successfully")
        setRegisterForm({
          name: '',
          email: '',
          password: '',
          startupType: ''
        });
        
        setTimeout(() => {
          switchToLogin();
        }, 2000);
      }
    } catch (error) {
      console.error('Registration error:', error);
      
      if (error.response) {
        const errorMessage = error.response.data?.message || 
                           error.response.data?.error || 
                           'Registration failed. Please try again.';
        
        if (error.response.status === 400) {
          if (errorMessage.toLowerCase().includes('email')) {
            setErrors({ email: errorMessage });
            toastMsg.error(errorMessage)
          } else if (errorMessage.toLowerCase().includes('password')) {
            setErrors({ password: errorMessage });
            toastMsg.error(errorMessage)
          } else {
            toastMsg.error(errorMessage)
          }
        } else if (error.response.status === 409) {
          setErrors({ email: 'An account with this email already exists' });
          toastMsg.error('Email already registered. Please use a different email or sign in.')
        } else {
          toastMsg.error(errorMessage)
        }
      } else if (error.request) {
        toastMsg.error('Network error. Please check your connection and try again.')
      } else {
        toastMsg.error('An unexpected error occurred. Please try again.')
      }
    } finally {
      setIsLoading(false);
    }
  };

  const switchToLogin = () => {
     dispatch(openLoginModal());
  };

  const handleInputChange = (field, value) => {
    setRegisterForm({ ...registerForm, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  return (
    <>
    {/* <ToastContainer/> */}

      <div onClick={()=>dispatch(closeRegisterModal())} className="fixed inset-0 backdrop-blur-[3px] bg-black/4 bg-opacity-50 flex items-center justify-center z-100 p-4">
        <div style={{background : background.primary}}  onClick={(e)=> e.stopPropagation()} className=" mt-4 rounded-2xl py-4 px-8 w-full max-w-md relative max-h-[90vh] overflow-y-auto">
          <button
            onClick={() => dispatch(closeRegisterModal())}
            className="absolute top-4 right-4 cursor-pointer text-gray-400 hover:text-white transition-colors"
            disabled={isLoading}
          >
            <X className="w-6 h-6" />
          </button>
         
          <div className="text-center mb-6">
            <h2 style={{color : text.secondary}} className="text-3xl font-bold text-white ">Get Started</h2>
          </div>

          <form  onSubmit={handleRegisterSubmit} className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-white ">
                <div className='flex justify-between items-center'>
                <span style={{color : text.secondary}}>Full Name <span className="text-red-500">*</span></span>
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                </div>

              </label>
              <input
                type="text"
                value={registerForm.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                style={{background : background.secondary , color : text.secondary}}
                className={`text-white w-full px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors ${
                  errors.name ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Enter your full name"
                disabled={isLoading}
              />
              
            </div>

            <div>
              <label className="block text-sm font-medium text-white ">
                <div className='flex justify-between items-center'>
                <span style={{color : text.secondary}}>
                  Email <span className="text-red-500">*</span>
                </span>
                 {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                </div>
              </label>
              <input
                type="email"
                value={registerForm.email}
                style={{color : text.secondary , background : background.secondary}}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`w-full text-white px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors ${
                  errors.email ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                placeholder="Enter your email"
                disabled={isLoading}
              />
             
            </div>

            <div>
              <label className="block text-sm font-medium text-white ">
                <div className='flex justify-between items-center'>
                <span style={{color : text.secondary}}>
                 Password <span className="text-red-500">*</span>
                </span>
                 {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
                </div>

              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={registerForm.password}
                  style={{color : text.secondary , background : background.secondary}}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={`w-full text-white px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors pr-12 ${
                    errors.password ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                  }`}
                  placeholder="Create a password (min 6 characters)"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 cursor-pointer top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" color={text.secondary} /> : <Eye color={text.secondary} className="w-5 h-5" />}
                </button>
              </div>
             
            </div>

            <div>
              <label className="block text-sm font-medium text-white ">
               <div className="flex justify-between items-center">
                <span style={{color : text.secondary}}>
                 Startup Type <span className="text-red-500">*</span>
                </span>
                  {errors.startupType && <p className="text-red-500 text-sm mt-1">{errors.startupType}</p>}
               </div>
              </label>
              <select
                value={registerForm.startupType}
                style={{color : text.secondary ,background : background.secondary}}
                onChange={(e) => handleInputChange('startupType', e.target.value)}
                className={`w-full text-white px-4 py-3 bg-gray-700 border rounded-lg focus:outline-none transition-colors ${
                  errors.startupType ? 'border-red-500 focus:border-red-500' : 'border-gray-600 focus:border-blue-500'
                }`}
                disabled={isLoading}
              >
                <option value="">Select your startup type</option>
                <option value="saas">SaaS</option>
                <option value="ecommerce">E-commerce</option>
                <option value="fintech">Fintech</option>
                <option value="healthtech">Healthtech</option>
                <option value="edtech">Edtech</option>
                <option value="marketplace">Marketplace</option>
                <option value="other">Other</option>
              </select>
              
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white cursor-pointer bg-gradient-to-r from-blue-600 to-purple-600 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p style={{color : text.secondary}} className="text-gray-400">
              Already have an account?{' '}
              <button
                onClick={()=>dispatch(openLoginModal())}
                className="text-blue-400 hover:text-blue-300 font-semibold cursor-pointer mb-4 transition-colors"
                disabled={isLoading}
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default Register