'use client'
import React, { useState, useRef, useEffect } from 'react'
import axios from 'axios';
import { useDispatch , useSelector } from 'react-redux';
import { loadTokenFromLocalStorage , loadUserFromLocalStorage } from '@/components/Redux/AuthSlice';
function ChatAi() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    { id: 1, text: "Hi! I'm your AI assistant. How can I help you today?", isBot: true }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
   const dispatch = useDispatch();
  const token = useSelector((state)=>state?.userLocalSlice.token)
  const user = useSelector((state)=>state?.userLocalSlice.user)
 
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }
      
   
     useEffect(()=>{
          dispatch(loadTokenFromLocalStorage())
         dispatch(loadUserFromLocalStorage())
     },[dispatch])

   
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputValue.trim() || isLoading) return

    const userMessageText = inputValue
    setInputValue('')
    setIsLoading(true)

    const userMessage = {
      id: Date.now(),
      text: userMessageText,
      isBot: false
    }
    
    setMessages(prev => [...prev, userMessage])

    try {
      const response = await axios.post('https://myprod.onrender.com/api/ai/assistant', {
        question: userMessageText,
        id : user?._id
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        timeout: 30000, 
      })
     

      const botMessage = {
        id: Date.now() + 1,
        text: response.data.answer || response.data.answer || 'I received your message!',
        isBot: true
      }
      setMessages(prev => [...prev, botMessage])

    } catch (error) {
      console.error('API Error:', error)
      
      const errorMessage = {
        id: Date.now() + 1,
        text: error.response?.status === 429 
          ? "I'm receiving too many requests. Please try again in a moment."
          : error.code === 'ECONNABORTED'
          ? "Request timed out. Please try again."
          : "Sorry, I'm having trouble responding right now. Please try again.",
        isBot: true,
        isError: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const toggleChat = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="fixed bottom-4 right-8 z-50 ">
      <div className={`
        absolute bottom-20 right-0 w-96 bg-gray-800 rounded-2xl shadow-2xl border border-gray-200
        custom_scrollbar
        transform transition-all duration-500 ease-in-out origin-bottom-right
        ${isOpen 
          ? 'scale-100 opacity-100 translate-y-0' 
          : 'scale-95 opacity-0 translate-y-4 pointer-events-none'
        }
      `} style={{ height: '70vh' }}>
        
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.847a4.5 4.5 0 003.09 3.09L15.75 12l-2.847.813a4.5 4.5 0 00-3.09 3.091z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">AI Assistant</h3>
              <p className="text-white/80 text-xs">Online</p>
            </div>
          </div>
          <button 
            onClick={toggleChat}
            className="text-white/80 hover:text-white transition-colors p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 custom_scrollbar" style={{ height: 'calc(60vh - 140px)' }}>
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
              <div className={`
                max-w-xs px-4 py-2 rounded-2xl text-sm
                ${message.isBot 
                  ? message.isError
                    ? 'bg-gray-100 text-gray-800 rounded-bl-sm '
                    : 'bg-gradient-to-r from-blue-500 to-purple-600  text-white rounded-bl-sm'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-br-sm'
                }
                animate-fadeIn
              `}>
                {message.text}
              </div>
            </div>
          ))}
          
         
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 px-4 py-2 rounded-2xl rounded-bl-sm animate-fadeIn">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-gray-100">
          <div className="flex gap-2">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage(e)}
              placeholder="Type your message..."
              className="flex-1 px-4 py-2 border text-white border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={toggleChat}
        className={`
          bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 
          w-14 h-14 rounded-full flex items-center justify-center shadow-2xl 
          hover:scale-110 transition-all duration-300 group
          ${isOpen ? 'rotate-0' : 'rotate-0'}
        `}
      >
        <svg 
          className={`w-6 h-6 text-white transition-all duration-300 ${
            isOpen ? 'rotate-180 scale-90' : 'group-hover:scale-110'
          }`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          )}
        </svg>
      </button>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}

export default ChatAi