'use client'
import { useDispatch , useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React from 'react'
import {
  CheckCircle,
  Lock
} from 'lucide-react';
import { openLoginModal } from '@/components/Redux/LoginModal';
import { useState , useEffect} from 'react';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '../Redux/AuthSlice';
import { useThemeColor } from '@/hooks/themeColors';

export default function Pricing() {
  const route = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state)=>state?.userLocalSlice.token)
  const user = useSelector((state)=>state?.userLocalSlice.user)
  
  
  const { background, text } = useThemeColor();

  useEffect(()=>{
    
    dispatch(loadTokenFromLocalStorage())
    dispatch(loadUserFromLocalStorage())
  },[dispatch]) 
 
  const handleFreeStart = ()=>{
    
    if(token){
      route.push('/dashboard')
    }else{
      dispatch(openLoginModal())
    }
  }

  return (
    <section id="pricing" className="py-16 px-4 sm:px-6 lg:px-8" >
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 style={{color : text.primary}} className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            Simple, Transparent
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600"> Pricing</span>
          </h2>
          <p style={{color : text.secondary}} className="text-lg md:text-xl max-w-3xl mx-auto opacity-90">
            Choose the perfect plan for your startup's growth stage. No hidden fees, just clear value.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
          <div 
            style={{backgroundColor : background.secondary}} 
            className="relative bg-opacity-80 shadow-xl backdrop-blur-md border border-gray-600/50 rounded-3xl p-8 lg:p-10 flex flex-col justify-between 
                       hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div>
              <h3 style={{color : text.primary}} className="text-3xl font-bold mb-4">Starter</h3>
              <div className="mb-6">
                <span style={{color : text.primary}} className="text-5xl font-extrabold">$0</span>
                <span style={{color : text.secondary}} className="text-xl ml-1 opacity-70">/month</span>
              </div>
              <ul style={{color : text.primary}} className="space-y-4 mb-8 text-lg">
                <li  className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Up to 3 datasets</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>CSV upload (10MB limit)</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Basic dashboard With Charts</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Product Insights</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>CSV upload via link</span>
                </li>
              </ul>
            </div>
            <button 
              onClick={handleFreeStart} 
              className="w-full cursor-pointer bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg 
                         hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-75"
            >
              {token ? 'Go to Dashboard' : 'Get Started Free'}
            </button>
          </div>

          <div 
               style={{background: background.secondary}}
               className="relative backdrop-blur-[2px] border-2 border-blue-500/70 rounded-3xl p-8 lg:p-10 flex flex-col justify-between 
                       transform scale-105 shadow-2xl z-10"
          >
            <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-1.5 rounded-full text-sm font-semibold shadow-md">
              Most Popular
            </div>
            <div>
              <h3 style={{color : text.primary}} className="text-3xl font-bold mb-4">Pro</h3>
              <div className="mb-6">
                <span style={{color : text.primary}} className="text-5xl font-extrabold">$29</span>
                <span style={{color : text.secondary}} className="text-xl ml-1 opacity-70">/month</span>
              </div>
              <ul style={{color : text.secondary}} className="space-y-4 mb-8 text-lg">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Unlimited datasets</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>AI insights & summaries</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Google Sheets integration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Export to PDF/Excel</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Weekly growth tips</span>
                </li>
              </ul>
            </div>
            <button 
              disabled={true} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg 
                         opacity-70 cursor-not-allowed shadow-md focus:outline-none"
            >
              Coming Soon
            </button>

            <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-14 h-14 text-white/80 mx-auto mb-4" />
                <p className="text-white font-bold text-xl mb-1">Coming Soon</p>
                <p className="text-white/70 text-sm mt-1">Available in Version 2, 2025</p>
              </div>
            </div>
          </div>

          <div 
            style={{backgroundColor : background.primary}} 
            className="relative bg-opacity-80 shadow-xl backdrop-blur-md border border-gray-600/50 rounded-3xl p-8 lg:p-10 flex flex-col justify-between 
                       hover:border-purple-500 transition-all duration-300 transform hover:-translate-y-2"
          >
            <div>
              <h3 style={{color : text.primary}} className="text-3xl font-bold mb-4">Enterprise</h3>
              <div className="mb-6">
                <span style={{color : text.primary}} className="text-5xl font-extrabold">$99</span>
                <span style={{color : text.secondary}} className="text-xl ml-1 opacity-70">/month</span>
              </div>
              <ul style={{color : text.secondary}} className="space-y-4 mb-8 text-lg">
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Everything in Pro</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Team collaboration</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>API integrations</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Custom webhooks</span>
                </li>
                <li className="flex items-center space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0" />
                  <span>Priority support</span>
                </li>
              </ul>
            </div>
            <button 
              disabled={true} 
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-semibold text-lg 
                         opacity-70 cursor-not-allowed shadow-md focus:outline-none"
            >
              Coming Soon
            </button>

            <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px] rounded-3xl flex items-center justify-center">
              <div className="text-center">
                <Lock className="w-14 h-14 text-white/80 mx-auto mb-4" />
                <p className="text-white font-bold text-xl mb-1">Coming Soon</p>
                <p className="text-white/70 text-sm mt-1">Available in Version 2, 2025</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}