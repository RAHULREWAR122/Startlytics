'use cleint'
import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useSelector , useDispatch } from 'react-redux';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '@/components/Redux/AuthSlice';
import { openLoginModal } from '@/components/Redux/LoginModal';
import { useThemeColor } from '@/hooks/themeColors';
const HowItWorks = () => {
  const [visibleSteps, setVisibleSteps] = useState([]);
  const sectionRef = useRef(null);
  const stepRefs = useRef([]);
  const route = useRouter();
  const dispatch = useDispatch();
  const token = useSelector( ( state ) => state?.userLocalSlice.token )
  const user = useSelector( ( state ) => state?.userLocalSlice.user )
  
  const {background , text} = useThemeColor();

  useEffect( () => {
      dispatch( loadTokenFromLocalStorage() )
      dispatch( loadUserFromLocalStorage() )
  }, [ dispatch ] )
  
  const handleGoTOUploadCsv = ()=>{
      if(token){
          route.push('/googlesheet')
      }else{
         dispatch(openLoginModal())
      }
  }

  const steps = [
    {
      id: 1,
      title: "Upload Your CSV",
      description: "Simply drag and drop your CSV files or click to select them from your computer. Our system processes files locally first for your privacy.",
      image: "/images/1.png"
    },
    {
      id: 2,
      title: "Preview & Process",
      description: "Review your data in our intuitive preview interface. See columns, rows, and get insights before processing your files.",
      image: "/images/2.png"
    },
    {
      id: 3,
      title: "Analyze & Export",
      description: "Get comprehensive analytics and export your processed data. Upload to server or download refined results instantly.",
      image: "/images/3.png"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const stepIndex = parseInt(entry.target.dataset.step);
            setVisibleSteps(prev => [...new Set([...prev, stepIndex])]);
          }
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
    );

    stepRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen ">
      <section ref={sectionRef} className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 style={{color  : text.secondary}} className={`text-4xl md:text-5xl font-bold text-white mb-4 `}>
              How It Works
            </h2>
            <p style={{color  : text.secondary}} className="text-xl text-gray-300 max-w-2xl mx-auto">
              Three simple steps to transform your CSV data into actionable insights
            </p>
          </div>

          <div className="space-y-32">
            {steps.map((step, index) => (
              <div
                key={step.id}
                ref={el => stepRefs.current[index] = el}
                data-step={index}
                className={`transition-all duration-1000 transform ${
                  visibleSteps.includes(index)
                    ? 'opacity-100 translate-y-0'
                    : 'opacity-0 translate-y-20'
                }`}
              >
                <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                  index % 2 === 1 ? 'lg:grid-flow-col-dense' : ''
                }`}>
                  {/* Content */}
                  <div className={`space-y-6 ${index % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                        {step.id}
                      </div>
                      <div className="h-px bg-gradient-to-r from-purple-500 to-transparent flex-1"></div>
                    </div>
                    
                    <h3 style={{color  : text.secondary}} className="text-3xl md:text-4xl font-bold text-white">
                      {step.title}
                    </h3>
                    
                    <p style={{color  : text.secondary}} className="text-lg text-gray-300 leading-relaxed">
                      {step.description}
                    </p>
                    
                    <div className="pt-4">
                      <div className="inline-flex items-center text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                        <span className="mr-2">Learn more</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div className={`relative ${index % 2 === 1 ? 'lg:col-start-1' : ''}`}>
                    <div className={`transform transition-all duration-1000 delay-100 ${
                      visibleSteps.includes(index)
                        ? 'scale-100 rotate-0'
                        : index % 2 === 0 ? 'scale-75 -rotate-12' : 'scale-75 rotate-12'
                    }`}>
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-xl opacity-10 scale-110"></div>
                      
                      <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-2 border border-white/20 shadow-xl">
                        <img
                          src={step.image}
                          alt={step.title}
                          className="w-full h-auto rounded-xl shadow-lg"
                          style={{
                            transform: visibleSteps.includes(index) ? 'translateY(0)' : 'translateY(50px)',
                            transition: 'transform 0.8s ease-out'
                          }}
                        />
                        
                        <div className={`absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse ${
                          visibleSteps.includes(index) ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-1000 delay-500`}></div>
                        
                        <div className={`absolute -bottom-4 -left-4 w-6 h-6 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-bounce ${
                          visibleSteps.includes(index) ? 'opacity-100' : 'opacity-0'
                        } transition-opacity duration-1000 delay-700`}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-30">
            <div className="inline-flex items-center justify-center space-x-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl cursor-pointer">
              <button className='cursor-pointer' onClick={handleGoTOUploadCsv}>{token ? 'Upload GoogleSheet' : 'Get Started Now' }</button>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HowItWorks;