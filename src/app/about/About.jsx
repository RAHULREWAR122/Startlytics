'use client';
import Head from 'next/head';
import React from 'react';
import { useThemeColor } from '@/hooks/themeColors';
import { openLoginModal } from '@/components/Redux/LoginModal';
import { useDispatch , useSelector} from 'react-redux';
import { useRouter } from 'next/navigation';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '@/components/Redux/AuthSlice';
import { useEffect } from 'react';

export default function AboutPage() {
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector( ( state ) => state?.userLocalSlice.token )
  const user = useSelector( ( state ) => state?.userLocalSlice.user )
  
  const { background, text, border } = useThemeColor();
  
  
  useEffect( () => {
    dispatch( loadTokenFromLocalStorage() )
    dispatch( loadUserFromLocalStorage() )
  }, [ dispatch ] )
 
  const handleStart = ()=>{
     if(token && user?.email){
        router.push('/csvupload') 
     }else{
       dispatch(openLoginModal());
     }
  }
  
  return (<>
    <Head>
        <title>About | Startlytics - Data Made Simple</title>
        <meta name="description" content="Startlytics is the easiest way to upload CSV/Sheets and get instant AI-powered analytics. Try it today!" />
        <meta name="keywords" content="data analytics, csv upload, ai analytics, google sheets, dashboard, startlytics" />
        <meta property="og:title" content="Startlytics - Instant AI-Powered Data Insights" />
        <meta property="og:description" content="Turn your spreadsheets into dashboards and answers." />
        <meta property="og:image" content="/images/logo.svg" />
        <meta property="og:url" content="https://startlytics-gi2w.vercel.app/" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://startlytics-gi2w.vercel.app/about" />
    </Head>

    <div style={{background : background.secondary}} className="bg-gray-800 text-white min-h-screen relative overflow-hidden">
     <br />
     <br />
     <br />
      <div className="relative z-10 px-4 py-12 md:px-16">
        <div className="max-w-6xl mx-auto space-y-16">
          <div className="text-center space-y-6">
            <h1 style={{color : text.secondary}} className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 bg-clip-text text-transparent animate-pulse">
              About Startlytics
            </h1>
            <p style={{color : text.secondary}} className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Transforming startup data into growth opportunities through AI-powered analytics
            </p>
          </div>

          <section className="relative">
            <div className=" backdrop-blur-sm  shadow-2xl rounded-2xl p-8 md:p-12 border ">
              <h2 color={text.primary} className="text-3xl md:text-4xl font-bold text-center mb-6 bg-gradient-to-r from-purple-300 to-pink-400 bg-clip-text text-transparent">
                Our Mission
              </h2>
              <p style={{color : text.secondary}} className="text-lg md:text-xl text-gray-300 text-center leading-relaxed">
                We believe data should be accessible, understandable, and drive real growth decisions. 
                Startlytics empowers startups to make data-driven decisions without the complexity.
              </p>
            </div>
          </section>

          <section className="space-y-8">
            <h2  className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  step: "01",
                  title: "Upload Data",
                  description: "Drag & drop CSV files, Excel sheets, or paste Google Sheet links",
                  icon: "📁"
                },
                {
                  step: "02", 
                  title: "Auto Processing",
                  description: "Our AI automatically parses and structures your data securely",
                  icon: "⚡"
                },
                {
                  step: "03",
                  title: "Visualize",
                  description: "View data in intuitive dashboards with interactive charts",
                  icon: "📊"
                },
                {
                  step: "04",
                  title: "Get Insights",
                  description: "Receive AI-powered recommendations for startup growth",
                  icon: "🚀"
                }
              ].map((item, index) => (
                <div key={index} className="relative group">
                  <div className="shadow-xl backdrop-blur-sm rounded-xl h-[230px] p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300 hover:transform hover:scale-105">
                    <div className="text-3xl mb-4">{item.icon}</div>
                    <div className="text-sm font-bold text-purple-300 mb-2">STEP {item.step}</div>
                    <h3 style={{color : text.secondary}} className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                    <p style={{color : text.secondary}} className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Platform Features
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  title: "Modern Dashboard",
                  description: "Clean, intuitive interface with real-time data visualizations and interactive charts",
                  features: ["Real-time updates", "Interactive charts", "Custom views", "Mobile responsive"]
                },
                {
                  title: "Data Management",
                  description: "Complete control over your datasets with easy upload, organization, and export options",
                  features: ["Multiple formats", "Bulk operations", "Data validation", "Secure storage"]
                },
                {
                  title: "AI Assistant",
                  description: "Intelligent analysis that provides actionable insights and answers your data questions",
                  features: ["Natural language queries", "Trend analysis", "Predictive insights", "Custom reports"]
                },
                {
                  title: "Export & Share",
                  description: "Generate professional reports and share insights with your team effortlessly",
                  features: ["PDF reports", "Excel export", "Team sharing", "Scheduled reports"]
                }
              ].map((feature, index) => (
                <div key={index} className="shadow-xl backdrop-blur-sm  rounded-xl p-6 border border-purple-500/20 hover:border-purple-400/40 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-3 text-pink-400">{feature.title}</h3>
                  <p style={{color : text.primary}} className="text-gray-300 mb-4 leading-relaxed">{feature.description}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {feature.features.map((item, idx) => (
                      <div key={idx} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full"></div>
                        <span style={{color : text.secondary}} className="text-sm text-gray-300">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="relative">
            <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 backdrop-blur-sm rounded-2xl p-8 md:p-12 border border-blue-500/20">
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Why Choose Startlytics?
              </h2>
              <div className="grid md:grid-cols-3 gap-6">
                {[
                  {
                    title: "No Technical Skills Required",
                    description: "Designed for simplicity - anyone can use it without coding knowledge",
                    icon: "🎯"
                  },
                  {
                    title: "Enterprise-Grade Security",
                    description: "Your data is encrypted and stored securely with industry-standard protocols",
                    icon: "🔒"
                  },
                  {
                    title: "Startup-Focused",
                    description: "Built specifically for startups with features that matter to growing businesses",
                    icon: "💡"
                  }
                ].map((item, index) => (
                  <div key={index} className="text-center space-y-3">
                    <div className="text-4xl">{item.icon}</div>
                    <h3 style={{color : text.secondary}} className="text-xl font-semibold text-white">{item.title}</h3>
                    <p style={{color : text.secondary}} className="text-gray-300 text-sm leading-relaxed">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Ready to Transform Your Data?
            </h2>
            <p style={{color : text.secondary}} className="text-lg text-gray-300 max-w-2xl mx-auto">
              Join thousands of startups already using Startlytics to make better data-driven decisions
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                 onClick={handleStart}                
                className="inline-block cursor-pointer px-8 py-4 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-pink-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-purple-500/25"
              >
                Start Free Trial
              </button>
              
            </div>
          </section>
        </div>
      </div>
    </div>
  </>);
}