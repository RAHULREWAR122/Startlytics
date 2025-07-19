'use client'
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useThemeColor } from '@/hooks/themeColors';

import Features from '../Features/Features';
import { openLoginModal } from '../Redux/LoginModal';
import { useDispatch , useSelector} from 'react-redux';
import Hero from '../Hero/Hero';
import Pricing from '../Pricing/Pricing';
import { loadTokenFromLocalStorage , loadUserFromLocalStorage } from '../Redux/AuthSlice';

import Reviews from '../Reviews/Reviews';
import HowItWorks from '../HowItWorks/HowItWorks';
export default function HomePage() {
   
  const route = useRouter();
  const dispatch = useDispatch();
  const token = useSelector((state)=>state?.userLocalSlice.token)
  const user = useSelector((state)=>state?.userLocalSlice.user)
  const {background , text} = useThemeColor(); 
 
   
    useEffect(()=>{
        dispatch(loadTokenFromLocalStorage())
        dispatch(loadUserFromLocalStorage())
    },[dispatch])
  
  
    
  const getStart = ()=>{
     if(token){
        route.push('/googlesheet')
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
         
        <meta name="description" content="Startlytics is the easiest way to upload CSV/Sheets and get instant AI-powered analytics. Try it today!" />
        <meta name="keywords" content="data analytics, csv upload, ai analytics, google sheets, dashboard, startlytics" />
        <meta property="og:title" content="Startlytics - Instant AI-Powered Data Insights" />
        <meta property="og:description" content="Turn your spreadsheets into dashboards and answers." />
        <meta property="og:image" content="/images/logo.svg" />
        <meta property="og:url" content="https://startlytics-gi2w.vercel.app/" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://startlytics-gi2w.vercel.app/about" />
 
      </Head>
      
       <main style={{background : background.secondary}} className="bg-gray-900 text-white ">
       
       <Hero/>
       <HowItWorks/>
       <Features/>
       <Pricing/>
       <Reviews/>
   

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
                  {token ? 'Upload GoogleSheet' : 'Start Free Trial'}
                </button>
                
              </div>
            </div>
          </div>
        </section>
      </main>
 
    </>
    

)}  