import React from 'react';
import Lottie from 'react-lottie';
import animationData from './loadingAnimation.json';

const LoadingAnimation = () => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice'
    }
  };

  return   <div className="fixed inset-0 z-[1000] backdrop-blur-sm bg-gray-500/30 flex justify-center items-center">
  <Lottie options={defaultOptions} height={300} width={300} />
</div>

};

export default LoadingAnimation;
