'use client'
import { useDispatch , useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import React from 'react'
import {
  CheckCircle,
  Lock
} from 'lucide-react';
import { openLoginModal } from '@/components/Redux/LoginModal';
import { useState  , useEffect} from 'react';
// import { userDetails } from '../../app/UserDetails/loggedInUserDetails';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '../Redux/AuthSlice';

export default function Pricing() {
  const route = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state)=>state?.userLocalSlice.token)
  const user = useSelector((state)=>state?.userLocalSlice.user)
    

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

  return ( <section id="pricing" className="py-20">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Simple, Transparent
          <span className="text-gradient"> Pricing</span>
        </h2>
        <p className="text-xl text-gray-300 max-w-2xl mx-auto">
          Choose the perfect plan for your startup's growth stage
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-blue-500/50 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4">Starter</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">$0</span>
            <span className="text-gray-400">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Up to 3 datasets</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>CSV upload (10MB limit)</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Basic dashboard With Charts</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Product Insights</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>csv upload via link</span>
            </li>
          </ul>
          <button onClick={handleFreeStart} className="cursor-pointer w-full bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl font-semibold transition-colors duration-300">
            {token ? 'Go to Dashboard' : 'Get Started Free'}
          </button>
        </div>

        <div className="relative bg-gradient-to-br from-blue-500/10 to-purple-500/10 backdrop-blur-sm border-2 border-blue-500/50 rounded-2xl p-8 overflow-hidden transform scale-105">
          <div className="absolute top-4 right-4 bg-gradient-to-r from-blue-500 to-purple-600 px-3 py-1 rounded-full text-sm font-semibold">
            Most Popular
          </div>
          <h3 className="text-2xl font-bold mb-4">Pro</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">$29</span>
            <span className="text-gray-400">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Unlimited datasets</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>AI insights & summaries</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Google Sheets integration</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Export to PDF/Excel</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Weekly growth tips</span>
            </li>
          </ul>
          <button disabled={true} className="w-full cursor-not-allowed bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-xl font-semibold transition-all duration-300">
            Coming Soon
          </button>

          <div className="absolute inset-0 bg-black/70 backdrop-blur-2xl rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-12 h-12 text-white/80 mx-auto mb-3" />
              <p className="text-white/90 font-semibold text-lg">Coming Soon</p>
              <p className="text-white/60 text-sm mt-1">Available in Version 2 2025</p>
            </div>
          </div>
        </div>

        <div className="relative bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-purple-500/50 transition-all duration-300">
          <h3 className="text-2xl font-bold mb-4">Enterprise</h3>
          <div className="mb-6">
            <span className="text-4xl font-bold">$99</span>
            <span className="text-gray-400">/month</span>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Everything in Pro</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Team collaboration</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>API integrations</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Custom webhooks</span>
            </li>
            <li className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-green-500" />
              <span>Priority support</span>
            </li>
          </ul>
          <button disabled={true} className="w-full cursor-not-allowed bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold transition-colors duration-300">
            Coming Soon
          </button>

          <div className="absolute inset-0 bg-black/60 backdrop-blur-2xl rounded-2xl flex items-center justify-center">
            <div className="text-center">
              <Lock className="w-12 h-12 text-white/80 mx-auto mb-3" />
              <p className="text-white/90 font-semibold text-lg">Coming Soon</p>
              <p className="text-white/60 text-sm mt-1">Available in Version 2 2025</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
  )
}