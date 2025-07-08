'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { 
  CheckCircle,
  Star,
 
} from 'lucide-react';
import { useRouter } from 'next/navigation';

import Hero from '@/Pages/Hero/Hero';
import ChatAi from '@/Pages/ChatAi/ChatAi';
import { userDetails } from '@/app/UserDetails/loggedInUserDetails';
import Features from '@/Pages/Features/Features';
import Pricing from '@/Pages/Pricing/Pricing';
import { openLoginModal } from '../Redux/LoginModal';
import { useDispatch } from 'react-redux';


export default function HomePage() {
   
  const route = useRouter();
  const dispatch = useDispatch(); 
  useEffect(()=>{
      userDetails();  
  },[route])
    
  const getStart = ()=>{
     const token = localStorage.getItem('authToken');
     if(token){
        route.push('/dashboard')
     }else{
       dispatch(openLoginModal());
     }
  }

  return (
    <>
      <Head>
        <title>Startlytics - Analytics Platform for Smart Founders</title>
        <meta name="description" content="Transform your startup data into actionable insights with AI-powered analytics, CSV uploads, Google Sheets integration, and personalized growth recommendations." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
       <main className="bg-gray-900 text-white ">
       
       <Hero/>
       <Features/>
       <Pricing/>
       
        <section id="testimonials" className="py-20 bg-gray-800/50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Loved by 
                <span className="text-gradient"> Founders Worldwide</span>
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                See what successful entrepreneurs are saying about Startlytics
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "Startlytics transformed how we analyze our user data. The AI insights helped us identify growth opportunities we never saw before."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">SJ</span>
                  </div>
                  <div>
                    <div className="font-semibold">Sarah Johnson</div>
                    <div className="text-gray-400 text-sm">CEO, TechFlow</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "The Google Sheets integration is seamless. We can now track our metrics in real-time without any manual work."
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">MC</span>
                  </div>
                  <div>
                    <div className="font-semibold">Mike Chen</div>
                    <div className="text-gray-400 text-sm">Founder, DataViz</div>
                  </div>
                </div>
              </div>

              <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-8">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  "Best investment for our startup. The weekly AI tips alone are worth the subscription price. Highly recommend!"
                </p>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold">AR</span>
                  </div>
                  <div>
                    <div className="font-semibold">Alex Rodriguez</div>
                    <div className="text-gray-400 text-sm">Co-founder, GrowthLab</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-3xl p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                Ready to Transform Your Data?
              </h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join thousands of founders who are already using Startlytics to make smarter decisions and grow faster.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={getStart} className="bg-white cursor-pointer text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105">
                  Start Free Trial
                </button>
                
              </div>
            </div>
          </div>
        </section>
      </main>
 
     <ChatAi/>
    </>
    

)}  