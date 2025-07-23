'use client'
import LoginModal from "@/components/LoginAndRegisterModal/Login";
import Register from "@/components/LoginAndRegisterModal/Register";
import ForgotPasswordModal from "@/components/Hero/ForgotPassword";
import { useSelector } from "react-redux";

const AuthModals = () => {

    const loginModal = useSelector( ( state ) => state?.loginModal?.isLoginModalOpen )
    const registernModal = useSelector( ( state ) => state?.loginModal?.isRegisterModalOpen )
    const forgotModalOpen = useSelector( ( state ) => state?.loginModal?.isForgotModalOpen )
  
  return (
    <>
     {loginModal && <LoginModal />}
    {registernModal && <Register />}
    {forgotModalOpen && <ForgotPasswordModal />}


    </>
  );
}

export default AuthModals