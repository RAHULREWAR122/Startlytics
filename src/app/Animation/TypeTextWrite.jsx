import React, { useState, useEffect } from 'react';

export const TypewriterText = ({ 
  text, 
  speed = 50, 
  startDelay = 500, 
  showCursor = true, 
  cursorChar = '|',
  className = '',
  style = {},
  textsize =21,
  color ='#000'
}) => {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  

  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setDisplayText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, currentIndex === 0 ? startDelay : speed);

      return () => clearTimeout(timeout);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, text, speed, startDelay]);

  return (
    <p className={`${className}`} style={[style]}>
      <span style={{fontSize : textsize , color: color}} className=''>{displayText}</span>
      {showCursor && (
        <span 
          className={`inline-block ${isComplete ? 'animate-pulse' : ''}`}
          style={{ 
            fontSize : textsize ,
            animation: isComplete ? 'blink 1s infinite' : 'none',
            marginLeft: '2px'
          }}
        >
          {cursorChar}
        </span>
      )}
      <style jsx>{`
        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }
      `}</style>
    </p>
  );
};
