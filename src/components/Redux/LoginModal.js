import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  isLoginModalOpen: false,
  isRegisterModalOpen: false,
  isForgotModalOpen : false
};

const modalSlice = createSlice({
  name: 'modal',
  initialState,
  reducers: {
    openLoginModal: (state) => {
      state.isLoginModalOpen = true;
      state.isRegisterModalOpen = false;
    },
    closeLoginModal: (state) => {
      state.isLoginModalOpen = false;
    },
    openRegisterModal: (state) => {
      state.isRegisterModalOpen = true;
      state.isLoginModalOpen = false; 
    },
    closeRegisterModal: (state) => {
      state.isRegisterModalOpen = false;
    },
    openForgotModal : (state)=>{
       state.isForgotModalOpen = true;
    },
    closeForgotModal : (state)=>{
       state.isForgotModalOpen = false;
    },
    closeAllModals: (state) => {
      state.isLoginModalOpen = false;
      state.isRegisterModalOpen = false;
    },
  },
});

export const {
  openLoginModal,
  closeLoginModal,
  openRegisterModal,
  closeRegisterModal,
  closeAllModals,
  openForgotModal,
  closeForgotModal
} = modalSlice.actions;

export default modalSlice.reducer;
