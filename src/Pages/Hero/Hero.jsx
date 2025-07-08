'use client';
import React, { useState } from 'react'
import { 
  ArrowRight,
  Play,
  X
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '@/components/Redux/LoginModal';
import { useRouter } from 'next/navigation';

const Hero = ()=>{
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const route = useRouter();
    const dispatch = useDispatch();
  const openModal = () => {
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const handleGetstart = ()=>{
    const token = localStorage.getItem('authToken');
    
    if(token){
       route.push('csvupload')
    }else{
      dispatch(openLoginModal())  
    }
  }

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'unset';
  }; 
    
    return <>
         <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          <div className="container mx-auto px-6 py-20 relative z-10">
            <div className="text-center max-w-5xl mx-auto">
              <div className="animate-fade-in">
                <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
                  Transform Your 
                  <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Startup Data </span>
                  Into
                 <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent"> Growth</span>
                  
                </h1>

                <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
                  AI-powered analytics platform that turns your CSV files, Google Sheets, and API data into actionable insights for smarter business decisions.
                </p>

                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
                  <button onClick={handleGetstart} className="group bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 hover:scale-105 hover:shadow-2xl flex items-center space-x-2">
                    <span>Start Free Trial</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                  
                  <button 
                    onClick={openModal}
                    className="group flex items-center space-x-2 text-gray-300 hover:text-white transition-colors duration-300"
                  >
                    <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center group-hover:bg-white/20 transition-colors duration-300">
                      <Play className="w-5 h-5 ml-1" />
                    </div>
                    <span className="text-lg">Watch Demo</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-400 mb-2">50+</div>
                    <div className="text-gray-400">Active Founders</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-400 mb-2">2k+</div>
                    <div className="text-gray-400">Data Points Analyzed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-pink-400 mb-2">99.9%</div>
                    <div className="text-gray-400">Uptime SLA</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="absolute top-20 left-10 w-20 h-20 bg-blue-500/20 rounded-full animate-float"></div>
          <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-500/20 rounded-full animate-float" style={{animationDelay: '2s'}}></div>
          <div className="absolute top-1/3 right-20 w-12 h-12 bg-pink-500/20 rounded-full animate-float" style={{animationDelay: '4s'}}></div>
        </section>

        {isModalOpen && (
          <div className="fixed inset-0  backdrop-blur-sm flex items-center justify-center z-50 p-4 ">
            <div className="relative w-full max-w-4xl aspect-video bg-black rounded-lg overflow-hidden">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors duration-300"
              >
                <X className="w-6 h-6 text-white" />
              </button>
              
             <iframe width="100%" height="100%" src="https://www.youtube.com/embed/YJg1rs0R2sE?si=uhIst2GiJgg_lH2l" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
            </div>
          </div>
        )}
    </>
}

export default Hero