'use client'
import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, X, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';
import { closeForgotModal , openLoginModal } from '../Redux/LoginModal';
import { useDispatch } from 'react-redux';
import { BASE_URL } from '@/apiLinks';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useThemeColor } from '@/hooks/themeColors';
import { toast } from 'react-toastify';

const ForgotPasswordModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [step, setStep] = useState(1); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const {background , text} = useThemeColor();
  const dispatch = useDispatch();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const verifyEmail = async (e) => {
    e.preventDefault();
    if(!formData?.email?.trim()){
       toast.error('Email is required');
       return;
    }
    
    setLoading(true);
    
    // try {
    //   const response = await axios.post(`${BASE_URL}/api/auth/verifyemail`,
    //     {email: formData.email },
    //     {
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
        
    //   });
    //   // console.log('data -------- ', response);
      
    //   if (response?.data?.success) {
    //     toast.success('Email verified successfully!');
        
    //     setTimeout(() => {
    //       setStep(2);
    //     }, 1200);
    //   } else {
    //     const errorData =  response?.data;
    //     toast.error(errorData.message || 'Email verification failed');
    //   }
    // } catch (error) {
    //   toast.error(error?.response?.data?.message || 'Network error. Please try again.');
    //   console.log('error ---- ', error);
      
    // } finally {
    //   setLoading(false);
    // }
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/updatepassword`,
      // const response = await axios.post(`http://localhost:5000/api/auth/updatepassword`,
        {
          email: formData.email,
          password: formData.password ,
          confirmPassword : formData.confirmPassword
        },
        {
        headers: {
          'Content-Type': 'application/json',
        },
       });

      if (response?.data?.success) {
        toast.success('Password updated successfully!');
        setTimeout(() => {
          setIsOpen(false);
          dispatch(closeForgotModal()); 
          dispatch(openLoginModal())
          setStep(1);
          setFormData({ email: '', password: '', confirmPassword: '' });
        }, 1500);
      } else {
        const errorData = response?.data;
        toast.error(errorData.message || 'Password update failed');
      }
    } catch (error) {
      toast.error('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const closeModal = () => {
    dispatch(closeForgotModal())
    setStep(1);
    setFormData({ email: '', password: '', confirmPassword: '' });
  };

  const goBack = () => {
    setStep(1);
  };

  return (
        <div onClick={(e)=> dispatch(closeForgotModal())} className="fixed inset-0 bg-black/4 backdrop-blur-[3px] flex items-center justify-center z-100 p-4">
          <div style={{background : background.primary}} onClick={(e)=>e.stopPropagation()} className="relative bg-slate-800/95 backdrop-blur-xl rounded-2xl p-8 w-full max-w-md shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute cursor-pointer top-4 right-4 text-slate-400 hover:text-white transition-colors"
            >
              <X color={text.primary} className="h-6 w-6" />
            </button>
           
            {step === 1 && (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Mail className="h-8 w-8 text-white" />
                  </div>
                  <h3 style={{color : text.primary}} className="text-2xl font-bold text-white mb-2">Forgot Password?</h3>
                  <p style={{color : text.secondary}} className="text-slate-400 text-sm">
                    Enter your email address and we'll verify your account
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label style={{color : text.primary}} className="block text-sm font-medium text-slate-300 mb-2">
                      Email Address <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        style={{color : text.primary , background : background.secondary}}
                        placeholder="Enter your email"
                        required
                        className="w-full pl-10 pr-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end items-center w-full">
                    <button onClick={()=>{dispatch(openLoginModal()) ; dispatch(closeForgotModal())}} className='text-blue-400 hover:text-blue-500 cursor-pointer text-[14px] '>Back to Login?</button>
                  </div>

                  <button
                    onClick={verifyEmail}
                    disabled={loading}
                    required={true}
                    className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {loading ? 'Verifying...' : 'Verify Email'}
                  </button>
                </div>

              </div>
            )}

            {step === 2 && (
              <div>
                <div className="text-center mb-8">
                  <button
                    onClick={goBack}
                     
                    className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
                  >
                    <ArrowLeft color={text.primary} className="h-6 w-6" />
                  </button>
                  
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Lock className="h-8 w-8 text-white" />
                  </div>
                  <h3 style={{color : text.primary}} className="text-2xl font-bold text-white mb-2">Set New Password</h3>
                  <p style={{color : text.secondary}} className="text-slate-400 text-sm">
                    Create a new password for your account
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label style={{color : text.primary}} className="block text-sm font-medium text-slate-300 mb-2">
                      New Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        style={{color : text.secondary , background : background.secondary}}
                        placeholder="Enter new password"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff color={text.primary} className="h-5 w-5" /> : <Eye color={text.primary} className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label style={{color : text.primary}} className="block text-sm font-medium text-slate-300 mb-2">
                      Confirm Password <span className="text-red-400">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
                      <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        style={{color : text.secondary , background : background.secondary}}
                        placeholder="Confirm new password"
                        required
                        className="w-full pl-10 pr-12 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff color={text.primary} className="h-5 w-5" /> : <Eye color={text.primary} className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={updatePassword}
                    disabled={loading}
                    className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-xl transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-purple-500/20"
                  >
                    {loading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
  );
};

export default ForgotPasswordModal;