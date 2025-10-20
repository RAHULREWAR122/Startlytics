'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { useThemeColor } from '@/hooks/themeColors';
import { BASE_URL } from '@/apiLinks';

const DatasetInsights = ({ datasetId = '', userId = '' }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showButton, setShowButton] = useState(false);
  
  const token = useSelector((state) => state?.userLocalSlice.token);
  const { background, text } = useThemeColor();
  const router = useRouter();

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.post(`${BASE_URL}/api/users/summary/${datasetId}`,
        {},
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

      setInsights(response.data);
      setDisplayedText('');
      setCurrentIndex(0);
      setIsTypingComplete(false);
      setShowButton(false);
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Failed to fetch insights');
      console.error('Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (datasetId && userId) {
      fetchInsights();
    }
  }, [datasetId, userId]);

  const formatTextWithNumbers = (text) => {
    if (!text) return '';

    const lines = text.split('\\n').filter(line => line.trim() !== '');
    
    let formattedLines = [];
    let lineNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      formattedLines.push(`${lineNumber}.  ${line}`);
      lineNumber++;
    }

    return formattedLines.join('\n');
  };

  useEffect(() => {
    if (!insights?.summary) return;

    const fullFormattedText = formatTextWithNumbers(insights.summary);
    const fullTextLength = fullFormattedText.length;
    
    const charLimit = fullTextLength < 1500 ? 700 : 1500;
    const speed = 30;

    if (currentIndex < fullFormattedText.length && currentIndex < charLimit) {
      const timer = setTimeout(() => {
        setDisplayedText(fullFormattedText.slice(0, currentIndex + 1));
        setCurrentIndex(currentIndex + 1);
      }, speed);

      return () => clearTimeout(timer);
    } else if (currentIndex >= charLimit || currentIndex >= fullFormattedText.length) {
      setIsTypingComplete(true);
      if (fullTextLength > charLimit) {
        setShowButton(true);
      }
    }
  }, [currentIndex, insights]);

  const tryAgain = () => {
    fetchInsights();
  };

  const handleSubscription = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <div style={{ backgroundColor: background.secondary }} className="w-full p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <div className="absolute inset-0 w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin animate-reverse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ backgroundColor: background.secondary }} className="bg-slate-900 p-8 w-full">
        <div className="max-w-6xl mx-auto">
          <div className="border border-red-500/30 rounded-lg p-6 text-center">
            <div className="text-red-400 text-xl mb-2">{error}</div>
            <button
              onClick={tryAgain}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: background.primary }} className="h-auto md:p-8 w-full">
      <div className="w-full">
        <div className="mb-8">
          <h1 style={{ color: text.primary }} className="text-4xl text-center font-bold text-white mb-2">
            Dataset <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">Insights</span>
          </h1>
          <p style={{ color: text.secondary }} className="text-gray-400 text-center">AI-powered analytics and insights for your data</p>
        </div>
        {insights && (
          <div className="w-full">
            {insights?.summary && (
              <div className="w-full gap-6 mb-8">
                <div className="max-w-full px-10 mx-auto">
                  <div 
                    style={{ color: text.secondary }} 
                    className="text-xl md:text-2xl mb-12 leading-relaxed whitespace-pre-line"
                  >
                    {displayedText}
                    {!isTypingComplete && (
                      <span className="inline-block w-2 h-5 bg-blue-500 ml-1 animate-pulse"></span>
                    )}
                  </div>
                  
                  {showButton && isTypingComplete && (
                    <div className="mt-6 text-center">
                      <button
                        onClick={handleSubscription}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                      >
                        Take Subscription for Complete Insights
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!insights.summary && !insights.keyInsights && !insights.recommendations && !insights.charts && !insights.data && (
              <div className="rounded-lg p-6 border border-slate-700 bg-red-500">
                <h2 className="text-2xl font-bold text-white mb-4">Insights Response</h2>
                <div className="overflow-x-auto">
                  <pre className="text-gray-300 text-sm bg-slate-700 p-4 rounded-lg overflow-auto max-h-96">
                    {JSON.stringify(insights, null, 2)}
                  </pre>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DatasetInsights;
