'use client'
import React from 'react'
import logo from '../../../public/images/logo.svg'
import Image from 'next/image';
import {
  TrendingUp,

  Menu,
  X,
  Sun,
  Moon
} from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import Register from '../LoginAndRegisterModal/Register';
import LoginModal from '../LoginAndRegisterModal/Login';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { openLoginModal } from '../Redux/LoginModal';
import { userDetails } from '@/app/UserDetails/loggedInUserDetails';
import { loadUserFromLocalStorage, loadTokenFromLocalStorage } from '../Redux/AuthSlice';
import ForgotPasswordModal from '../Hero/ForgotPassword';
import { useTheme } from '../Redux/ThemeProvider';
import { useThemeColor } from '@/hooks/themeColors';
function Navbar() {

  const [ isMenuOpen, setIsMenuOpen ] = useState( false );
  const [ scrollY, setScrollY ] = useState( 0 );
  const router = useRouter();
  const dispatch = useDispatch();

  const token = useSelector( ( state ) => state?.userLocalSlice.token )
  const user = useSelector( ( state ) => state?.userLocalSlice.user )
  
  const { theme, toggleTheme } = useTheme();
  const { background, text, border } = useThemeColor();
  
  
  useEffect( () => {
    dispatch( loadTokenFromLocalStorage() )
    dispatch( loadUserFromLocalStorage() )
  }, [ dispatch ] )
 
  const loginModal = useSelector( ( state ) => state?.loginModal?.isLoginModalOpen )
  const registernModal = useSelector( ( state ) => state?.loginModal?.isRegisterModalOpen )
  const forgotModalOpen = useSelector( ( state ) => state?.loginModal?.isForgotModalOpen )

  // console.log('bg is -' , background.secondary);
  

  useEffect( () => {
    const handleScroll = () => setScrollY( window.scrollY );
    window.addEventListener( 'scroll', handleScroll );
    return () => window.removeEventListener( 'scroll', handleScroll );
  }, [] );

  return ( <>
    {loginModal && <LoginModal />}
    {registernModal && <Register />}
    {forgotModalOpen && <ForgotPasswordModal />}


   <header 
  className={`fixed min-w-[100vw] top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'backdrop-blur-md shadow-lg' : ''}`}
  style={{
    backgroundColor: scrollY > 50 ? background.primary : 'transparent'
  }}
>
      <nav className="container mx-auto min-w-[100%] px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <Image src="/images/logo.svg" alt="Logo" width={200} height={200} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Startlytics

            </span>
          </Link>

          <div className="hidden lg:flex items-center space-x-8">
            {user?.name && <>
              <Link style={{color : text.primary}} href="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Dashboard</Link>
              <Link style={{color : text.primary}} href="/csvupload" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Csv Upload</Link>
              <Link style={{color : text.primary}} href="/googlesheet" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Link Csv Upload</Link>
            </>}

            <Link style={{color : text.primary}} href="/howtouse" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">How to Use</Link>
            <Link style={{color : text.primary}} href="/about" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">About</Link>
          
            {user?.name ? <div onClick={() => router.push( '/profile' )} className='rounded-[50px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-10 w-10 text-white flex justify-center items-center'>{user?.name[ 0 ]}</div> :
              <button onClick={() => dispatch( openLoginModal() )} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get Started
              </button>
            }

            <div className='cursor-pointer mr-6'>
              {theme === 'dark' ? 
                <p onClick={()=>toggleTheme()}><Sun color={text.primary} /></p>  :
                <p onClick={()=>toggleTheme()}>
                  <Moon color={text.primary}/>
                </p> 
               }
            </div>
          </div>
         
          <button
            onClick={() => setIsMenuOpen( !isMenuOpen )}
            className="lg:hidden p-2  rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> :  <Menu className="w-6 h-6" />}
          </button>
        </div>

        {isMenuOpen && (
          <div  className="lg:hidden backdrop-blur-sm mt-4 pb-4 border-t border-gray-700">
            <div className="flex flex-col space-y-4 pt-4">
              {user?.name && <>
              <Link onClick={()=>setIsMenuOpen( !isMenuOpen )} style={{color : text.primary}} href="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Dashboard</Link>
              <Link onClick={()=>setIsMenuOpen( !isMenuOpen )} style={{color : text.primary}} href="/csvupload" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Csv Upload</Link>
              <Link onClick={()=>setIsMenuOpen( !isMenuOpen )} style={{color : text.primary}} href="/googlesheet" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Link Csv Upload</Link>
            </>}
              <Link onClick={()=>setIsMenuOpen( !isMenuOpen )} style={{color : text.primary}} href="/howtouse" className="text-gray-300 hover:text-white transition-colors duration-300">How To Use</Link>
              <Link onClick={()=>setIsMenuOpen( !isMenuOpen )} style={{color : text.primary}} href="/about" className="text-gray-300 hover:text-white transition-colors duration-300">About</Link>
              
              {user?.name ? <div onClick={() => {router.push( '/profile' ) ;setIsMenuOpen( !isMenuOpen ) }} className='bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-10 w-auto rounded-sm text-white flex justify-start px-6 items-center'>{user?.name}</div> :
              <button  onClick={() => {dispatch( openLoginModal() );setIsMenuOpen( !isMenuOpen )}} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-sm text-white text-start font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get Started
              </button>
              }
              <div className="lg:hidden mt-[-10px] cursor-pointer">
              {theme === 'dark' ? 
                <p  className='flex justify-between bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-sm text-white ' onClick={()=>toggleTheme()}>
                  <span>Dark</span>  <Sun color={text.primary} />
                  </p>  :
                <p className='flex justify-between bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-sm text-white ' onClick={()=>toggleTheme()}>
                  <span>Light</span> <Moon color={text.reverse}/>
                </p> 
               }
          </div>

            </div>
          </div>
        )}
      </nav>
    </header>

  </> )
}

export default Navbar