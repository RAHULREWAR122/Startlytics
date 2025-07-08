import React, { useState, useMemo } from 'react';

const SpreadsheetViewer = ({ sheetData }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(50); 
  const [searchTerm, setSearchTerm] = useState('');
  const currentData = sheetData || { columns: ['Column A', 'Column B', 'Column C'], rawData: [] };
  const { columns, rawData } = currentData;

  const filteredData = useMemo(() => {
    if (!searchTerm) return rawData;
    
    return rawData.filter(row => 
      Object.values(row).some(value => 
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [rawData, searchTerm]);

  const totalPages = Math.ceil(filteredData?.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = filteredData?.slice(startIndex, endIndex);

  const generateColumnLabels = (count) => {
    const labels = [];
    for (let i = 0; i < count; i++) {
      if (i < 26) {
        labels.push(String.fromCharCode(65 + i)); 
      } else {
        const firstLetter = String.fromCharCode(65 + Math.floor(i / 26) - 1);
        const secondLetter = String.fromCharCode(65 + (i % 26));
        labels.push(firstLetter + secondLetter);
      }
    }
    return labels;
  };

  const columnLabels = generateColumnLabels(columns?.length);

  const handleCellChange = (rowIndex, header, value) => {
    console.log(`Cell changed: Row ${rowIndex}, Column ${header}, Value: ${value}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setCurrentPage(1); 
  };

  const getPaginationRange = () => {
    const range = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      range.push(i);
    }
    
    return range;
  };

  return (
    <div onClick={(e) => e.stopPropagation()} className="p-3 bg-gray-800 h-[80vh] w-[80vw] rounded-[10px]">
      <div className="bg-gray-900 rounded-lg shadow-2xl overflow-hidden h-full flex flex-col border border-gray-700">
        
        <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            
            <select
              value={rowsPerPage}
              onChange={(e) => handleRowsPerPageChange(Number(e.target.value))}
              className="px-3 py-2 bg-gray-700 border border-gray-600 rounded-md text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            >
              <option value={25}>25 rows</option>
              <option value={50}>50 rows</option>
              <option value={100}>100 rows</option>
              <option value={200}>200 rows</option>
            </select>
          </div>
          <div className="text-sm text-gray-400">
            Showing {startIndex + 1}-{Math.min(endIndex, filteredData?.length)} of {filteredData?.length} rows
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #374151;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #6b7280;
              border-radius: 4px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #9ca3af;
            }
            .custom-scrollbar::-webkit-scrollbar-corner {
              background: #374151;
            }
          `}</style>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="w-12 h-8 bg-gray-700 border border-gray-600 text-xs font-medium text-gray-300 sticky left-0 z-10">
                  #
                </th>
                {columns?.map((header, colIndex) => (
                  <th
                    key={colIndex}
                    className="min-w-32 h-8 bg-gray-700 border border-gray-600 text-xs font-medium text-gray-300 px-2"
                  >
                    {columnLabels[colIndex]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="w-12 h-8 bg-gray-700 border border-gray-600 text-xs text-center font-medium text-gray-300 sticky left-0 z-10">
                  H
                </td>
                {columns?.map((header, colIndex) => (
                  <td
                    key={colIndex}
                    className="min-w-32 h-8 border border-gray-600 p-0"
                  >
                    <input
                      type="text"
                      value={header}
                      readOnly
                      className="w-full h-full px-2 text-xs border-none outline-none bg-gray-700 text-gray-200 font-medium"
                    />
                  </td>
                ))}
              </tr>
              {currentRows?.map((rowData1, rowIndex) => (
                <tr key={startIndex + rowIndex}>
                  <td className="w-12 h-8 bg-gray-700 border border-gray-600 text-xs text-center font-medium text-gray-300 sticky left-0 z-10">
                    {startIndex + rowIndex + 1}
                  </td>
                  {columns?.map((header, colIndex) => (
                    <td
                      key={colIndex}
                      className="min-w-32 h-8 border border-gray-600 p-0"
                    >
                      <input
                        type="text"
                        value={rowData1[header] || ''}
                        onChange={(e) => handleCellChange(startIndex + rowIndex, header, e.target.value)}
                        className="w-full h-full px-2 text-xs border-none outline-none bg-gray-800 text-gray-200 focus:bg-gray-700 focus:ring-1 focus:ring-purple-500"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-gray-800 border-t border-gray-700 flex justify-between items-center">
          <div className="text-sm text-gray-400">
            Total Rows: {filteredData?.length} | Columns: {columns?.length}
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                First
              </button>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              
              {getPaginationRange()?.map(page => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 text-sm border border-gray-600 rounded transition-colors ${
                    currentPage === page 
                      ? 'bg-purple-600 text-white border-purple-500' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
              <button
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm bg-gray-700 border border-gray-600 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Last
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SpreadsheetViewer;