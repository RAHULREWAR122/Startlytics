'use client'
import React from 'react'
import { 
  TrendingUp, 
 
  Menu,
  X,

} from 'lucide-react';
import { useState } from 'react';
import { useEffect } from 'react';
import Register from '../LoginAndRegisterModal/Register';
import LoginModal from '../LoginAndRegisterModal/Login';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { openLoginModal , openRegisterModal } from '../Redux/LoginModal';
import { userDetails } from '@/app/UserDetails/loggedInUserDetails';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '../Redux/AuthSlice';

function Navbar() {
    
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  // const [user, setUser] = useState(null);
  // const { user, token } = userDetails();
  const router = useRouter();
  const dispatch = useDispatch();
  
  const token = useSelector((state)=>state?.userLocalSlice.token)
  const user = useSelector((state)=>state?.userLocalSlice.user)
  
  
  
  useEffect(()=>{
      dispatch(loadTokenFromLocalStorage())
      dispatch(loadUserFromLocalStorage())
  },[dispatch])

    const loginModal = useSelector((state)=> state?.loginModal?.isLoginModalOpen)
    const registernModal = useSelector((state)=> state?.loginModal?.isRegisterModalOpen)
    
    // useEffect(()=>{
    //    userDetails();
    // },[isMenuOpen ,token , window.location.pathname])

    useEffect(() => {
        const handleScroll = () => setScrollY(window.scrollY);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
      }, []);
      
  return (<>
       {loginModal && <LoginModal />}
       {registernModal && <Register />}  

     <header className={`fixed min-w-[100vw] top-0 z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-gray-900/95 backdrop-blur-md shadow-lg' : 'bg-transparent'}`}>
        <nav className="container mx-auto min-w-[100%] px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3 group">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Startlytics
              </span>
            </Link>

            <div className="hidden lg:flex items-center space-x-8">
              {user?.name && <>
              <Link href="/dashboard" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Dashboard</Link>
              <Link href="/csvupload" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Csv Upload</Link>
              <Link href="/googlesheet" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Link Csv Upload</Link>
             </>}

              <Link href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Reviews</Link>
              <Link href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Contact</Link>
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Features</Link>
              <Link href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300 hover:scale-105">Pricing</Link>
             
             {user?.name ? <div onClick={()=> router.push('/profile')} className='rounded-[50px] bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-10 w-10 text-white flex justify-center items-center'>{user?.name[0]}</div> : 
              <button onClick={()=>dispatch(openLoginModal())} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-full text-white font-semibold transition-all duration-300 hover:scale-105 hover:shadow-lg">
                Get Started
              </button>
              }
            </div>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors duration-300"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-700">
              <div className="flex flex-col space-y-4 pt-4">
                <a href="#features" className="text-gray-300 hover:text-white transition-colors duration-300">Features</a>
                <a href="#pricing" className="text-gray-300 hover:text-white transition-colors duration-300">Pricing</a>
                <a href="#testimonials" className="text-gray-300 hover:text-white transition-colors duration-300">Reviews</a>
                <a href="#contact" className="text-gray-300 hover:text-white transition-colors duration-300">Contact</a>
                <button className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-2 rounded-full text-white font-semibold w-full">
                  Get Started
                </button>
              </div>
            </div>
          )}
        </nav>
      </header>

  </>)
}

export default Navbar