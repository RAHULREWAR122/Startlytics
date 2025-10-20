'use client'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { TypewriterText } from '../Animation/TypeTextWrite';
import { useThemeColor } from '@/hooks/themeColors';
import { BASE_URL } from '@/apiLinks';

const DatasetInsights = ({ datasetId = '', userId = '' }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

  const tryAgain = () => {
    fetchInsights();
  };

  const formatTextWithNumbers = (text, maxChars = 900) => {
    if (!text) return { formattedText: '', isTruncated: false };

    const lines = text.split('\\n').filter(line => line.trim() !== '');
    
    let charCount = 0;
    let formattedLines = [];
    let isTruncated = false;
    let lineNumber = 1;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;
      
      const numberedLine = `${lineNumber}.  ${line}`;
      
      if (charCount + line.length > maxChars) {
        const remainingChars = maxChars - charCount;
        if (remainingChars > 10) {
          formattedLines.push(`${lineNumber}.  ${line.substring(0, remainingChars)}...`);
        }
        isTruncated = true;
        break;
      }
      
      formattedLines.push(numberedLine);
      charCount += line.length;
      lineNumber++;
    }

    return { 
      formattedText: formattedLines.join('\n'), 
      isTruncated 
    };
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
                {(() => {
                  const { formattedText, isTruncated } = formatTextWithNumbers(insights.summary, 900);
                  return (
                    <>
                      <TypewriterText
                        text={formattedText}
                        speed={30}
                        startDelay={100}
                        showCursor={true}
                        cursorChar=""
                        className="text-xl md:text-2xl mb-12 max-w-full px-10 mx-auto leading-relaxed whitespace-pre-line"
                        style={{ color: 'white' }}
                        textsize={17}
                        color={text.secondary}
                      />
                      {isTruncated && (
                        <div className="mt-6 text-center px-10">
                          <button
                            onClick={handleSubscription}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold px-8 py-3 rounded-lg transition-all transform hover:scale-105 shadow-lg"
                          >
                            Take Subscription for Complete Insights
                          </button>
                        </div>
                      )}
                    </>
                  );
                })()}
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
