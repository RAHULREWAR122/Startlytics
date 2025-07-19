'use client'
import React from 'react'
import { 
  TrendingUp, 
  Mail,
  Phone,
  MapPin,
  Instagram ,
  Linkedin 

} from 'lucide-react';
import { useThemeColor } from '@/hooks/themeColors';
import Link
 from 'next/link';
 import Image from 'next/image';
function Footer() {
  const {background , text} = useThemeColor();

  return (
    <footer style={{background : background.primary}} className=" border-t border-gray-800">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center space-x-3 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Image src="/images/logo.svg" alt="Logo" width={100} height={100} />
                </div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Startlytics
                </span>
              </Link>
              <p style={{color : text.muted}} className="text-gray-400 mb-6 leading-relaxed">
                Empowering founders with AI-driven analytics to make data-driven decisions and accelerate growth.
              </p>
              <div className="flex space-x-4">
                <a href="https://www.instagram.com/rahul_rewar_00/" target='_blankd' className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {/* <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/> */}
                   <Instagram className="w-5 h-5 text-pink-700"/>
                  </svg>
                </a>
                <a href="https://www.linkedin.com/in/rahul-rewar-202517276/" target='_blank' className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex items-center justify-center hover:bg-blue-600 transition-colors duration-300">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    {/* <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/> */}
                  <Linkedin className="w-5 h-5 text-blue-700"/>
                  </svg>
                </a>
               </div>
            </div>

            <div>
              <h3 style={{color : text.primary}} className="text-lg font-semibold mb-6">Product</h3>
              <ul style={{color : text.secondary}} className="space-y-3">
                <li><a style={{color : text.muted}} href="#features" className="text-gray-400 hover:text-white transition-colors duration-300">Features</a></li>
                <li><a style={{color : text.muted}} href="#pricing" className="text-gray-400 hover:text-white transition-colors duration-300">Pricing</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">API</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Integrations</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Security</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Changelog</a></li>
              </ul>
            </div>

            <div>
              <h3 style={{color : text.primary}} className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-3">
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">About Us</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Blog</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Careers</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Press</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Partners</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Contact</a></li>
              </ul>
            </div>

            <div>
              <h3 style={{color : text.primary}} className="text-lg font-semibold mb-6">Support</h3>
              <ul className="space-y-3">
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Help Center</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Documentation</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Community</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Status</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Privacy</a></li>
                <li><a style={{color : text.muted}} href="/" className="text-gray-400 hover:text-white transition-colors duration-300">Terms</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-gray-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400" />
                <span style={{color : text.secondary}} className="text-gray-400">rrewar75@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400" />
                <span style={{color : text.secondary}} className="text-gray-400">+91 6377283440</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-blue-400" />
                <span style={{color : text.secondary}} className="text-gray-400">Jaipur, Rajasthan - 303802</span>
              </div>
            </div>

            <div style={{background : background.secondary}} className="bg-gray-800/50 rounded-xl p-6 mb-8">
              <h3 style={{color : text.primary}} className="text-lg text-white font-semibold mb-3">Stay Updated</h3>
              <p style={{color : text.muted}} className="text-gray-400 mb-4">Get the latest updates, tips, and insights delivered to your inbox.</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  style={{color : text.secondary , background : background.primary}}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-300"
                />
                <button className="cursor-pointer text-white bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-300 whitespace-nowrap">
                  Subscribe
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-gray-800">
              <p className="text-gray-400 text-sm mb-4 md:mb-0">
                © 2025 Startlytics. All rights reserved.
              </p>
              <div className="flex items-center space-x-6">
                <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Privacy Policy</a>
                <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Terms of Service</a>
                <a href="/" className="text-gray-400 hover:text-white text-sm transition-colors duration-300">Cookie Policy</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
  )
}

export default Footer