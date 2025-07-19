import React, { useState, useEffect, useRef } from 'react';
import {
  TrendingUp,
  Upload,
  BarChart3,
  Brain,
  Shield,
  Zap,
  CheckCircle,
  Star,
  Menu,
  X,
  ArrowRight,
  Play,
  Users,
  Database,
  Target,
  Globe,
  Mail,
  Phone,
  MapPin
} from 'lucide-react';

import { useThemeColor } from '@/hooks/themeColors';

const AnimatedFeatureCard = ({ children, index, direction = 'left' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setTimeout(() => {
            setIsVisible(true);
            setHasAnimated(true);
          }, index * 150); 
        }
      },
      { 
        threshold: 0.1,
        rootMargin: '50px 0px' 
      }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, index]);

  const getInitialTransform = () => {
    return direction === 'left' ? 'translateX(-100px)' : 'translateX(100px)';
  };

  return (
    <div
      ref={cardRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateX(0)' : getInitialTransform(),
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
        transitionDelay: isVisible ? '0s' : '0s'
      }}
    >
      {children}
    </div>
  );
};

const AnimatedTitle = ({background, text}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const titleRef = useRef(null);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      { threshold: 0.1 }
    );

    if (titleRef.current) {
      observer.observe(titleRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  return (
    <div
      ref={titleRef}
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
    >
      <h2 style={{color: text.secondary}} className="text-4xl md:text-5xl font-bold mb-6">
        Powerful Features for
        <span className="text-gradient"> Smart Founders</span>
      </h2>
      <p style={{color: text.secondary}} className="text-xl text-gray-300 max-w-2xl mx-auto">
        Everything you need to turn raw data into actionable business insights
      </p>
    </div>
  );
};

const Features = () => {
  const {background, text} = useThemeColor();

  const features = [
    {
      icon: Upload,
      title: "Easy Data Upload",
      description: "Upload CSV files, connect Google Sheets, or integrate APIs with just a few clicks. Support for multiple data sources.",
      gradient: "from-blue-500 to-blue-600",
      hoverBorder: "hover:border-blue-500/50"
    },
    {
      icon: Brain,
      title: "AI-Powered Insights",
      description: "Get instant summaries, ask questions about your data, and receive personalized growth recommendations powered by OpenAI.",
      gradient: "from-purple-500 to-purple-600",
      hoverBorder: "hover:border-purple-500/50"
    },
    {
      icon: BarChart3,
      title: "Beautiful Dashboards",
      description: "Visualize your data with stunning charts and graphs. Export to PDF, share with your team, and track progress over time.",
      gradient: "from-green-500 to-green-600",
      hoverBorder: "hover:border-green-500/50"
    },
    {
      icon: Database,
      title: "Multi-Dataset Management",
      description: "Manage multiple datasets, rename, delete, and organize your data sources. Compare datasets and track changes over time.",
      gradient: "from-yellow-500 to-yellow-600",
      hoverBorder: "hover:border-yellow-500/50"
    },
    {
      icon: Shield,
      title: "Enterprise Security",
      description: "JWT authentication, CORS protection, rate limiting, and data ownership checks ensure your data stays secure.",
      gradient: "from-red-500 to-red-600",
      hoverBorder: "hover:border-red-500/50"
    },
    {
      icon: Zap,
      title: "Real-time Sync",
      description: "Auto-sync with Google Sheets, webhook integrations with Stripe and Shopify, and scheduled data refresh.",
      gradient: "from-indigo-500 to-indigo-600",
      hoverBorder: "hover:border-indigo-500/50"
    }
  ];

  return (
    <section id="features" style={{background : background.secondary}} className="py-5  min-h-screen max-w-[100vw] overflow-hidden ">
      <div className="container max-w-[100%] px-6 py-10">
        <div className="text-center mb-16">
          <AnimatedTitle  background={background} text={text}/>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            const direction = index % 2 === 0 ? 'left' : 'right';
            
            return (
              <AnimatedFeatureCard key={index} index={index} direction={direction}>
                <div 
                  style={{backgroundColor: background.secondary}} 
                  className={`group backdrop-blur-sm border md:h-[280px] border-gray-700 rounded-2xl p-8 ${feature.hoverBorder} transition-all duration-300 hover:transform hover:scale-105`}
                >
                  <div className={`w-14 h-14 bg-gradient-to-r ${feature.gradient} rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 style={{color: text.primary}} className="text-2xl font-bold mb-4">
                    {feature.title}
                  </h3>
                  <p style={{color: text.secondary}} className="text-gray-300 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </AnimatedFeatureCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Features;