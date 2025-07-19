'use client'
import React, { useState, useMemo } from 'react';
import { X, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useThemeColor } from '@/hooks/themeColors';
const ChartDetailModal = ({ 
  isOpen,
  onClose,
  chart,
  data,
  renderChart,
  itemsPerPage = 10
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const {background , text} = useThemeColor();

  const stats = useMemo(() => {
    if (!data || data.length === 0) return {};

    const numericValues = data.map(item => {
      const value = typeof item.value === 'number' ? item.value : 
                   typeof item.y === 'number' ? item.y : 
                   parseFloat(Object.values(item).find(v => typeof v === 'number')) || 0;
      return value;
    }).filter(v => !isNaN(v));
     
    switch (chart?.type) {
      case 'bar':
        return {
          total: numericValues.reduce((sum, val) => sum + val, 0),
          average: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
          maximum: Math.max(...numericValues),
          minimum: Math.min(...numericValues)
        };
      
      case 'pie':
        const categories = [...new Set(data.map(item => item.name || item.category || item.label))].filter(Boolean);
        if (categories.length === 0) return {};
        const categoryCounts = categories.map(cat => 
          data.filter(item => (item.name || item.category || item.label) === cat).length
        );
        const maxCount = Math.max(...categoryCounts);
        const mostCommonIndex = categoryCounts.indexOf(maxCount);
        
        return {
          totalCategories: categories.length,
          totalRecords: data.length,
          mostCommon: categories[mostCommonIndex] || 'N/A',
          diversity: ((categories.length / data.length) * 100).toFixed(1)
        };
      
      case 'scatter':
        const xValues = data.map(item => item.x || 0).filter(v => typeof v === 'number');
        const yValues = data.map(item => item.y || 0).filter(v => typeof v === 'number');
        
        // Simple correlation calculation
        const n = Math.min(xValues.length, yValues.length);
        if (n === 0) return { correlation: 0, totalPoints: 0 };
        
        const xMean = xValues.reduce((sum, val) => sum + val, 0) / n;
        const yMean = yValues.reduce((sum, val) => sum + val, 0) / n;
        
        let numerator = 0;
        let xDenominator = 0;
        let yDenominator = 0;
        
        for (let i = 0; i < n; i++) {
          const xDiff = xValues[i] - xMean;
          const yDiff = yValues[i] - yMean;
          numerator += xDiff * yDiff;
          xDenominator += xDiff * xDiff;
          yDenominator += yDiff * yDiff;
        }
        
        const correlation = xDenominator === 0 || yDenominator === 0 ? 0 : 
          numerator / Math.sqrt(xDenominator * yDenominator);
        
        return {
          correlation: correlation.toFixed(3),
          totalPoints: data.length,
          xStats: {
            min: Math.min(...xValues),
            max: Math.max(...xValues)
          },
          yStats: {
            min: Math.min(...yValues),
            max: Math.max(...yValues)
          }
        };
      
      case 'line':
      case 'area':
        if (numericValues.length === 0) return {};
        const change = numericValues.length > 1 ? numericValues[numericValues.length - 1] - numericValues[0] : 0;
        const variance = numericValues.reduce((sum, val) => {
          const avg = numericValues.reduce((s, v) => s + v, 0) / numericValues.length;
          return sum + Math.pow(val - avg, 2);
        }, 0) / numericValues.length;
        const volatility = Math.sqrt(variance).toFixed(2);
        
        return {
          trend: change > 0 ? 'Increasing' : change < 0 ? 'Decreasing' : 'Stable',
          totalChange: change,
          averageValue: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length,
          volatility: volatility
        };
      
      case 'groupedBar':
        const groups = [...new Set(data.map(item => item.group || item.category))].filter(Boolean);
        if (groups.length === 0) return {};
        
        const groupTotals = groups.map(group => {
          const groupData = data.filter(item => (item.group || item.category) === group);
          const groupValues = groupData.map(item => {
            const value = typeof item.value === 'number' ? item.value : 
                         typeof item.y === 'number' ? item.y : 
                         parseFloat(Object.values(item).find(v => typeof v === 'number')) || 0;
            return value;
          }).filter(v => !isNaN(v));
          return { group, total: groupValues.reduce((sum, val) => sum + val, 0) };
        });
        
        const highestGroupData = groupTotals.reduce((a, b) => a.total >= b.total ? a : b);
        
        return {
          totalGroups: groups.length,
          overallTotal: numericValues.reduce((sum, val) => sum + val, 0),
          highestGroup: highestGroupData?.group || 'N/A',
          overallAverage: numericValues.reduce((sum, val) => sum + val, 0) / numericValues.length
        };
      
      default:
        return {};
    }
  }, [data, chart]);

  // Pagination calculations
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = data.slice(startIndex, endIndex);

  const goToPage = (page) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const renderStatsCards = () => {
    const statsConfig = {
      bar: [
        { key: 'total', label: 'Total Sum', format: (val) => val?.toFixed(2) || '0' },
        { key: 'average', label: 'Average', format: (val) => val?.toFixed(2) || '0' },
        { key: 'maximum', label: 'Maximum', format: (val) => val?.toFixed(2) || '0' },
        { key: 'minimum', label: 'Minimum', format: (val) => val?.toFixed(2) || '0' }
      ],
      pie: [
        { key: 'totalCategories', label: 'Total Categories', format: (val) => val || '0' },
        { key: 'totalRecords', label: 'Total Records', format: (val) => val || '0' },
        { key: 'mostCommon', label: 'Most Common', format: (val) => val || 'N/A' },
        { key: 'diversity', label: 'Diversity %', format: (val) => `${val || 0}%` }
      ],
      scatter: [
        { key: 'correlation', label: 'Correlation', format: (val) => val || '0' },
        { key: 'totalPoints', label: 'Total Points', format: (val) => val || '0' },
        { key: 'xStats', label: 'X Range', format: (val) => val ? `${val.min?.toFixed(2)} - ${val.max?.toFixed(2)}` : 'N/A' },
        { key: 'yStats', label: 'Y Range', format: (val) => val ? `${val.min?.toFixed(2)} - ${val.max?.toFixed(2)}` : 'N/A' }
      ],
      line: [
        { key: 'trend', label: 'Trend', format: (val) => val || 'Stable' },
        { key: 'totalChange', label: 'Total Change', format: (val) => val?.toFixed(2) || '0' },
        { key: 'averageValue', label: 'Average Value', format: (val) => val?.toFixed(2) || '0' },
        { key: 'volatility', label: 'Volatility', format: (val) => val || '0' }
      ],
      area: [
        { key: 'trend', label: 'Trend', format: (val) => val || 'Stable' },
        { key: 'totalChange', label: 'Total Change', format: (val) => val?.toFixed(2) || '0' },
        { key: 'averageValue', label: 'Average Value', format: (val) => val?.toFixed(2) || '0' },
        { key: 'volatility', label: 'Volatility', format: (val) => val || '0' }
      ],
      groupedBar: [
        { key: 'totalGroups', label: 'Total Groups', format: (val) => val || '0' },
        { key: 'overallTotal', label: 'Overall Total', format: (val) => val?.toFixed(2) || '0' },
        { key: 'highestGroup', label: 'Highest Group', format: (val) => val || 'N/A' },
        { key: 'overallAverage', label: 'Overall Average', format: (val) => val?.toFixed(2) || '0' }
      ]
    };

    const currentStats = statsConfig[chart.type] || statsConfig.bar;

    return currentStats.map((statConfig, index) => (
      <div style={{background : background.secondary}} key={index} className="bg-gray-700/50 shadow-xl rounded-lg p-4">
        <h4 style={{color : text.secondary}} className="text-sm font-medium text-gray-300 mb-1">{statConfig.label}</h4>
        <p style={{color: text.primary}} className="text-xl font-bold text-white truncate">
          {statConfig.format(stats[statConfig.key])}
        </p>
      </div>
    ));
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
      const delta = 2;
      const range = [];
      const rangeWithDots = [];

      for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
        range.push(i);
      }

      if (currentPage - delta > 2) {
        rangeWithDots.push(1, '...');
      } else {
        rangeWithDots.push(1);
      }

      rangeWithDots.push(...range);

      if (currentPage + delta < totalPages - 1) {
        rangeWithDots.push('...', totalPages);
      } else {
        rangeWithDots.push(totalPages);
      }

      return rangeWithDots;
    };

    return (
      <div className="flex items-center justify-between mt-4">
        <div style={{color: text.secondary}} className="text-sm text-gray-400">
          Showing {startIndex + 1}-{Math.min(endIndex, data.length)} of {data.length} results
        </div>
        <div className="flex items-center space-x-1">
          <button
            onClick={() => goToPage(1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-700 cursor-pointer text-gray-400 hover:text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-700 cursor-pointer text-gray-400 hover:text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          {getVisiblePages().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' ? goToPage(page) : null}
              disabled={page === '...'}
              className={`px-3 py-2 cursor-pointer rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-blue-400 text-white'
                  : page === '...'
                  ? 'text-gray-400 cursor-default'
                  : 'bg-gray-700 text-gray-400 hover:text-white hover:bg-gray-600'
              }`}
            >
              {page}
            </button>
          ))}
          
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-700 cursor-pointer text-gray-400 hover:text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => goToPage(totalPages)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-700 cursor-pointer text-gray-400 hover:text-white hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div  className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div style={{background : background.secondary}}  className="bg-gray-800 rounded-xl w-full max-w-6xl custom_scrollbar max-h-[90vh] overflow-y-scroll custom-scrollbar border border-gray-700">
        <div style={{background : background.primary}}  className="sticky top-0 shadow-xl bg-gray-800  p-6 flex items-center justify-between z-10">
          <div>
            <h2 style={{color: text.primary}} className="text-2xl font-bold text-white">{chart.title}</h2>
            <p style={{color: text.secondary}} className="text-gray-400 mt-1">{chart.description}</p>
            <div className="flex items-center space-x-2 mt-2">
              {/* <span className="text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                {chart.type}
              </span> */}
              <span className="text-xs text-gray-400 bg-blue-600 px-2 py-1 rounded">
                Complete Dataset: {data.length} data points
              </span>
            </div>
            {(data.length > 20 && chart.type === 'pie') && (
              <p className="bg-amber-50 px-4 py-2 rounded mt-4 text-black">
                We show <span className="text-red-500">only 20 {chart.title.slice(0, -10)} details in chart</span>, 
                <span> more you can see in Table</span>
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            style={{color: text.primary}}
            className="text-gray-400  cursor-pointer transition-colors p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6">
          <div  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {renderStatsCards()}
          </div>

          <div style={{background : background.secondary}} className="bg-gray-700/30 shadow-xl rounded-xl p-4 mb-6">
            <h3 style={{color: text.primary}} className="text-lg underline font-semibold text-white mb-4">Complete Data Visualization</h3>
            <div>
              {renderChart(chart, true)}
            </div>
          </div>

          <div style={{background : background.secondary}} className="bg-gray-700/30 shadow-xl rounded-xl p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{color: text.primary}} className="text-lg font-semibold text-white">Raw Data Table</h3>
              <div style={{color: text.secondary}} className="text-sm text-gray-400">
                Page {currentPage} of {totalPages}
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full border border-gray-400 rounded-md  text-gray-300">
                <thead>
                  <tr style={{background : background.secondary}} className="bg-gray-800 shadow-xl ">
                    {data.length > 0 &&
                      Object.keys(data[0])
                        ?.filter(col => col !== 'color')
                        ?.map((col) => (
                          <th style={{color : text.primary}} key={col} className="px-4 py-2 text-left font-medium">
                            {col}
                          </th>
                        ))
                    }
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((row, idx) => (
                    <tr style={{color : text.secondary}} key={startIndex + idx} className="border-b border-gray-400 hover:bg-gray-700/30 transition-colors">
                      {Object.entries(row)
                        .filter(([key]) => key !== 'color')
                        .map(([key, value], i) => (
                          <td key={i} className="px-4 py-2">
                            {String(value)}
                          </td>
                        ))
                      }
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {renderPagination()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartDetailModal;