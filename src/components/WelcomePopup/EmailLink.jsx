'use client'
import { useState } from "react";
import { useThemeColor } from "@/hooks/themeColors";
export default function EmailLink({handleGetStarted}) {
  const [showPrompt, setShowPrompt] = useState(false);
  const {background , text} = useThemeColor(); 
  const handleClick = () => {
    setShowPrompt(true);
  };

const handleConfirm = () => {
  setShowPrompt(false);
  if(typeof window !== 'undefined'){
     window.open(
        "https://mail.google.com/mail/?view=cm&fs=1&to=rrewar75@gmail.com&su=Startlytics%20Feedback&body=Hi%20Startlytics%20Team%2C%0A%0AI've%20been%20using%20your%20platform%20and%20wanted%20to%20share%20some%20feedback%3A%0A%0A-%20What%20I%20like%3A%20%0A-%20Suggestions%20for%20improvement%3A%20%0A-%20Features%20I'd%20like%20to%20see%3A%20%0A%0AThanks%20for%20building%20such%20a%20useful%20tool!%0A%0ABest%20regards",
        "_blank",
        "noopener,noreferrer"
      );
      handleGetStarted();
  }
};

  const handleCancel = () => {
    setShowPrompt(false);
  };

  return (
    <div>
      <button
        onClick={handleClick}
        className=" bg-blue-600 rounded-sm text-white px-2 py-1 cursor-pointer ml-2 hover:text-blue-200 font-medium  transition-colors duration-200"
      >
        rrewar75@gmail.com
      </button>

      {showPrompt && (
        <div className="fixed  rounded-md top-0 left-0 w-full h-full backdrop-blur-sm bg-opacity-0 flex items-center justify-center z-50">
          <div style={{background : background.primary}} className=" p-6 rounded shadow-lg text-center">
            <p style={{color : text.primary}} className="mb-4 text-gray-800 font-semibold">
              Do you want to send feedback via email?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirm}
                className="px-4 py-2 cursor-pointer bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Yes
              </button>
              <button
                onClick={handleCancel}
                className="px-4 py-2 cursor-pointer bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
