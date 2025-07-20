'use client'
import { useState, useEffect } from 'react';
import { useThemeColor } from '@/hooks/themeColors';
import Image from 'next/image';
import EmailLink from './EmailLink';

export function WelcomePopup({ isOpen, onClose }) {
    const [isVisible, setIsVisible] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const { background, text } = useThemeColor();

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true);
            setTimeout(() => {
                setIsAnimating(true);
            }, 5000);
        }
    }, [isOpen]);

    const handleClose = () => {
        setIsAnimating(false);
    };

    const handleGetStarted = () => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('startlytics-visited', 'true');
            setIsAnimating(false);
            setTimeout(() => {
                setIsVisible(false);
                onClose();
            }, 300);
        }
    };

    if (!isVisible) return null;

    return (
        <div
            className={`fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 md:p-6 z-100 transition-all duration-300 ease-out ${
                isAnimating ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={handleGetStarted}
        >
            <div
                style={{ background: background.secondary , maxHeight : "90vh"  }}
                className={`bg-white rounded-xl px-3 overflow-y-auto custom_scrollbar sm:rounded-2xl shadow-2xl 
                    w-full max-w-[400px] sm:max-w-md md:max-w-lg lg:max-w-xl
                    mx-3 sm:mx-4 
                    relative transition-all duration-300 ease-out transform 
                    ${isAnimating
                        ? 'opacity-100 scale-100 translate-y-0'
                        : 'opacity-0 scale-95 translate-y-4'
                    }`}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={handleGetStarted}
                    className="absolute top-3 right-3 sm:top-4 sm:right-4 
                        cursor-pointer text-gray-400 hover:text-gray-600 
                        transition-colors duration-200 hover:rotate-90 transform
                        p-1 rounded-full hover:bg-gray-100
                        z-10"
                    aria-label="Close popup"
                >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>

                <div className="sm:p-6 md:px-5 py-2">
                    <div className={`text-center mb-1 sm:mb-6 transition-all duration-500 delay-100 ${
                        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}>
                        <div className="rounded-full flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-500 hover:scale-110">
                            <Image
                                src='/images/logo.svg'
                                width={60}
                                height={60}
                                className='rounded-full transition-transform duration-300'
                                alt="Startlytics Logo"
                            />
                        </div>
                        <h3
                            style={{ color: text.primary }}
                            className="text-lg sm:text-lg md:text-xl font-bold text-gray-900 px-2"
                        >
                            Thank you for using Startlytics!
                        </h3>
                    </div>

                    <div className={`text-center  mb-1 sm:mb-8 space-y-2 sm:space-y-4 transition-all duration-500 delay-200 ${
                        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        <p
                            style={{ color: text.secondary }}
                            className="text-sm sm:text-base text-gray-700 leading-relaxed px-2"
                        >
                            We're excited to help you visualize your startup data. New features are coming soon!
                        </p>

                        <div
                            style={{ background: background.primary }}
                            className="bg-blue-50 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:shadow-md"
                        >
                            <p
                                style={{ color: text.primary }}
                                className="text-xs sm:text-sm text-blue-800 font-medium mb-1 sm:mb-2"
                            >
                                🎉 You're using the free version
                            </p>
                            <p className="text-xs sm:text-sm text-blue-700 leading-relaxed">
                                Enjoy all current features at no cost while we continue building amazing tools for you.
                            </p>
                        </div>

                        <div
                            style={{ background: background.primary }}
                            className="bg-gray-50 rounded-lg p-3 sm:p-4 transition-all duration-300 hover:shadow-md"
                        >
                            <p
                                style={{ color: text.primary }}
                                className="text-xs sm:text-sm text-gray-700 mb-1 sm:mb-2 font-medium"
                            >
                                Help us improve!
                            </p>
                            <div
                                style={{ color: text.secondary }}
                                className="text-xs text-gray-600 space-y-2 mb-2  w-full justify-center leading-relaxed"
                            >
                                <span>Share your feedback at{' '}</span>
                                <EmailLink handleGetStarted={handleGetStarted} />
                            </div>
                        </div>
                    </div>

                    <div className={`text-center transition-all mt-[10px] duration-500 delay-300 ${
                        isAnimating ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                        <button
                            onClick={handleGetStarted}
                            className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white font-semibold 
                                py-2.5 px-6 sm:py-3 sm:px-8 
                                text-sm sm:text-base
                                rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl 
                                transform hover:-translate-y-1 hover:scale-105 active:scale-95
                                w-full sm:w-auto
                                min-h-[44px] sm:min-h-auto"
                        >
                            Let's Get Started!
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}