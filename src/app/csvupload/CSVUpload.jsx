'use client'
import { useState, useCallback } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, Eye, Loader2, Send, Database } from 'lucide-react';
import Papa from 'papaparse';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../AuthPage';
import LoadingAnimation from '../Animation/LoadingAnimation';
import { userDetails } from '../UserDetails/loggedInUserDetails';
import { useSelector , useDispatch } from 'react-redux';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '@/components/Redux/AuthSlice';
import { useThemeColor } from '@/hooks/themeColors';
import { BASE_URL } from '@/apiLinks';
import { toast } from 'react-toastify';
export default function CSVUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [parsedData, setParsedData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processingToServer, setProcessingToServer] = useState(false);
  const {background , text} = useThemeColor();
  
  const route = useRouter();
    const dispatch = useDispatch();
    const token = useSelector((state)=>state?.userLocalSlice.token)
    const user = useSelector((state)=>state?.userLocalSlice.user)
    
      
    
    useEffect(()=>{
        dispatch(loadTokenFromLocalStorage())
        dispatch(loadUserFromLocalStorage())
    },[dispatch])
  
  const getAuthToken = () => {
    return token;
  };

 

 const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
};

  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files);
      
    }
  }, []);

  const parseCSVFile = (file) => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        delimitersToGuess: [',', '\t', '|', ';'],
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
            const criticalErrors = results.errors.filter(error => 
              error.type === 'Delimiter' || error.type === 'Quotes'
            );
            if (criticalErrors.length > 0) {
              reject(new Error('CSV parsing error: ' + criticalErrors[0].message));
              return;
            }
          }
          resolve(results);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  };

  const handleFiles = async (files) => {
    const file = files[0];
    
    if (!file) return;
    
    if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
      setError('Please upload a valid CSV file');
      toast.error('Please upload a valid CSV file')
      return;
    }

    setLoading(true);
    setError(null);
    // console.log('Processing file:', file.name, 'Size:', file.size);

    try {
      const results = await parseCSVFile(file);
      // console.log('Parse results:', results);
      
      const headers = results.meta.fields || [];
      const rows = results.data || [];
      
      const cleanHeaders = headers.map(header => 
        typeof header === 'string' ? header.trim() : header
      );
      
      const newFile = {
        id: Date.now(),
        name: file.name,
        size: file.size,
        status: 'parsed',
        uploadedAt: new Date().toISOString(),
        rows: rows.length,
        columns: cleanHeaders.length,
        originalFile: file, 
        parsedData: {
          headers: cleanHeaders,
          data: rows
        },
        serverUploaded: false
      };
      
      // console.log('Created file object:', newFile);
      setUploadedFiles(prev => [...prev, newFile]);
      toast.success('File Ready to Preview.')
      
      setParsedData({
        headers: cleanHeaders,
        rows: rows.slice(0, 20).map(row => 
          cleanHeaders.map(header => {
            const value = row[header];
            return value !== undefined && value !== null ? value : '';
          })
        ),
        totalRows: rows.length,
        fileId: newFile.id,
        allData: rows
      });
      
    } catch (error) {
      // console.error('Error parsing CSV:', error);
      setError(`Failed to parse CSV: ${error.message}`);
      toast.error(`Failed to parse CSV: ${error.message}`)
    } finally {
      setLoading(false);
    }
  };

  const removeFile = (id) => {
    setUploadedFiles(prev => prev.filter(file => file.id !== id));
    toast.success('file removed successfully.')
    if (parsedData && parsedData.fileId === id) {
      setParsedData(null);
      setPreviewData(null);
    }
  };
  

  const previewFile = (file) => {
    if (file.parsedData) {
      const headers = file.parsedData.headers;
      const data = file.parsedData.data;
      
      setParsedData({
        headers: headers,
        rows: data.slice(0, 100).map(row => 
          headers.map(header => {
            const value = row[header];
            return value !== undefined && value !== null ? value : '';
          })
        ),
        totalRows: data.length,
        fileId: file.id,
        allData: data
      });
      setPreviewData(file);
    }
  };

  const downloadProcessedFile = (file) => {
    if (!file.parsedData) return;

    const csv = Papa.unparse({
      fields: file.parsedData.headers,
      data: file.parsedData.data
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = `processed_${file.name}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    toast.success('Download successfully');
  };

  const uploadToServer = async (file) => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please login again.');
        toast.error('invalid token.').
        return;
      }

      if (!file.originalFile) {
        setError('Original file not found. Please re-upload the file.');
        toast.error('Original file not found.')
        return;
      }

      setProcessingToServer(true);
      setUploadProgress(0);
      setError(null);

      // console.log('Starting upload for file:', file.name);
      // console.log('Original file exists:', !!file.originalFile);

      const formData = new FormData();
      formData.append('file', file.originalFile);
      
      if (file.parsedData) {
        formData.append('metadata', JSON.stringify({
          headers: file.parsedData.headers,
          rowCount: file.parsedData.data.length,
          columnCount: file.parsedData.headers.length
        }));
      }

      // console.log('FormData contents:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await fetch(`${BASE_URL}/api/users/upload`, {
        method: 'POST',
        headers: {'Authorization': `Bearer ${token}`},
        body: formData
      });

      // console.log('Upload response status:', response.status);
      // console.log('Upload response headers:', response.headers);

      if (response.status === 401) {
        throw new Error('Unauthorized. Please login again.');
        toast.error('Unauthorized. Please login again.')
      }
     
        
      if (!response.ok) {
        const errorText = await response.text();
        // console.error('Upload error response:', errorText);
        toast.error('Upload failed, try again.')
        throw new Error(`Upload failed: ${response.status} ${response.statusText}. ${errorText}`);
      }

      const result = await response.json();
      // console.log('Upload successful:', result);
      

      setUploadedFiles(prev => prev.map(f => 
        f.id === file.id 
          ? { ...f, serverUploaded: true, serverId: result.fileId || result.id || result._id }
          : f
      ));
      toast.success(result?.message || 'file uploaded successfully.') 
      setError(null);
      // route.push('/dashboard')
      
    } catch (error) {
      console.error('Error uploading to server:', error);
      setError(`Upload failed: ${error.message}`);
    } finally {
      setProcessingToServer(false);
      setUploadProgress(0);
    }
  };

  
   
  useEffect(()=>{
   if(!token || !user?.email){
       route.push('/')
     }
 
  },[token , user , dispatch])
    

  return (
    <div style={{background : background.secondary}} className="min-h-screen bg-gray-900 text-white custom_scrollbar hide-scrollbar overflow-hidden">
      {!token ? <LoadingAnimation/> : 
     <>  
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-600 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-40 right-32 w-24 h-24 bg-purple-600 rounded-full opacity-30 blur-lg"></div>
      
      <div className="relative z-10 p-6 max-w-[100%] mx-auto px-10">
        {/* Header */}
        <div className="mb-8 mt-20  text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              CSV Upload & Processing
            </span>
          </h1>
          <p style={{color : text.secondary}} className="text-gray-300 text-lg">
            Upload, preview and process your CSV files locally, then optionally send to server
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-900/50 border border-red-500 rounded-xl p-4 flex items-center space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400" />
            <span className="text-red-200">{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div  className="grid  grid-cols-1 lg:grid-cols-2 gap-8 ">
          {/* Upload Section */}
          <div className="space-y-6">
            {/* Drag & Drop Area */}
            <div
              className={`border-2 border-dashed shadow-2xl rounded-2xl p-8 text-center transition-all duration-200 ${
                dragActive 
                  ? 'border-blue-500 bg-blue-500/10' 
                  : 'border-gray-600 hover:border-gray-500'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 style={{color : text.primary}} className="text-xl font-semibold mb-2">Drop CSV files here</h3>
              <p style={{color : text.secondary}} className="text-gray-400 mb-4">Files will be processed locally first</p>
              <input
                type="file"
                accept=".csv"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
                id="file-upload"
                disabled={loading}
              />
              <label
                htmlFor="file-upload"
                className={`inline-block px-6 py-3 rounded-lg cursor-pointer transition-all ${
                  loading 
                    ? 'bg-gray-600 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {loading ? 'Processing...' : 'Select CSV Files'}
              </label>
            </div>

            
            {(loading || processingToServer) && (
              <div style={{background : background.secondary}}  className="bg-gray-800 shadow-xl rounded-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-500" />
                  <span style={{color : text.primary}}>
                    {loading ? 'Parsing CSV file...' : 'Uploading to server...'}
                  </span>
                </div>
                {processingToServer && (
                  <>
                    <div style={{background : background.primary}}  className="w-full bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      ></div>
                    </div>
                    <div style={{color : text.secondary}} className="text-sm text-gray-400 mt-2">
                      {Math.round(uploadProgress)}% uploaded
                    </div>
                  </>
                )}
              </div>
            )}

            <div style={{background: background.secondary}} className="bg-gray-800 shadow-xl rounded-xl p-6  max-h-[300px] overflow-y-auto custom_scrollbar">
              <h3 style={{color : text.primary}} className="text-xl font-semibold mb-4">Processed Files</h3>
              {uploadedFiles.length === 0 ? (
                <p style={{color : text.primary}} className="text-gray-400">No files processed yet</p>
              ) : (
                <div className="space-y-3">
                  {uploadedFiles.map((file) => (
                    <div style={{background : background.secondary}} key={file.id} className="p-4 shadow-2xl bg-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <FileText className="w-6 h-6 text-blue-400" />
                          <div>
                            <p style={{color : text.primary}} className="font-medium">{file.name}</p>
                            <p style={{color : text.secondary}} className="text-sm text-gray-400">
                              {file.rows?.toLocaleString() || 0} rows, {file.columns || 0} columns
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          {file.serverUploaded ? (
                            <span className="text-green-400 text-sm flex items-center space-x-1">
                              <Database className="w-4 h-4" />
                              <span>Server</span>
                            </span>
                          ) : (
                            <span className="text-yellow-400 text-sm">Local</span>
                          )}
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap space-x-2 justify-between items-center">
                        <div className='flex space-x-4'>
                          <button
                          onClick={() => previewFile(file)}
                          className="px-2 hover:bg-blue-700 py-[1.4px] bg-blue-600 cursor-pointer rounded-md transition-colors"
                          title="Preview"
                        >
                          View
                          {/* <Eye color={text.primary} className="w-4 h-4" /> */}
                        </button>
                        {!file.serverUploaded && (
                          <button
                            onClick={() => uploadToServer(file)}
                            className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded-lg transition-colors text-sm"
                            disabled={processingToServer}
                            title="Upload to Server"
                          >
                            <Send className="w-4 h-4" />
                            <span>Upload</span>
                          </button>
                        )}
                        <button
                          onClick={() => downloadProcessedFile(file)}
                          className="p-2 hover:bg-gray-600 rounded-lg transition-colors"
                          title="Download CSV"
                        >
                          <Download color={text.primary} className="w-4 h-4" />
                        </button>
                      
                        
                        </div>
                        <button
                          onClick={() => removeFile(file.id)}
                          className="p-2 hover:bg-red-600 bg-red-500 cursor-pointer text-right rounded-lg transition-colors"
                          title="Remove"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{background : background.secondary}} className="bg-gray-800 shadow-xl rounded-xl p-6 ">
            <h3 style={{color : text.primary}} className="text-xl font-semibold mb-4">Data Preview</h3>
            {parsedData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span style={{color : text.primary}} className="text-sm text-gray-400">
                    Showing first {Math.min(parsedData.rows.length, 100)} rows of {parsedData.totalRows?.toLocaleString() || 0} total rows
                  </span>
                  <div className="flex items-center space-x-2">
                    {previewData && !previewData.serverUploaded && (
                      <span style={{color : text.secondary}} className="text-yellow-400 text-xs bg-yellow-900/30 px-2 py-1 rounded">
                        Local Only
                      </span>
                    )}
                    <button 
                      onClick={() => downloadProcessedFile(previewData)}
                      className="flex items-center space-x-2 text-blue-400 hover:text-blue-300"
                    >
                      <Download className="w-4 h-4" />
                      <span >Download</span>
                    </button>
                  </div>
                </div>
                
                <div className="overflow-x-auto max-h-96 custom_scrollbar custom_scrollbar_bottom">
                  <table className="w-full text-sm">
                    <thead style={{background : background.secondary}} className="shadow-xl sticky top-0 bg-gray-800">
                      <tr className="border-b border-gray-700">
                        {parsedData.headers.map((header, idx) => (
                          <th style={{color : text.primary}} key={idx} className="text-left p-2 font-medium text-gray-300">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>  
                    <tbody>
                      {parsedData.rows.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-700/50">
                          {row.map((cell, cellIdx) => (
                            <td style={{color : text.primary}} key={cellIdx} className="p-2 text-gray-300">
                              {String(cell || '')}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p style={{color : text.secondary}} className="text-gray-400">Upload a CSV file to see preview</p>
              </div>
            )}
          </div>
        </div>

        {/* Processing Stats */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div style={{background : background.primary}} className="bg-gray-800 shadow-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {uploadedFiles.length}
            </div>
            <div className="text-gray-400">Files Processed</div>
          </div>
          <div style={{background : background.primary}} className="bg-gray-800 shadow-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {uploadedFiles.reduce((acc, file) => acc + (file.rows || 0), 0).toLocaleString()}
            </div>
            <div className="text-gray-400">Total Rows</div>
          </div>
          <div style={{background : background.primary}} className="bg-gray-800 shadow-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {uploadedFiles.reduce((acc, file) => acc + (file.columns || 0), 0)}
            </div>
            <div className="text-gray-400">Total Columns</div>
          </div>
          <div style={{background : background.primary}} className="bg-gray-800 shadow-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {uploadedFiles.filter(f => f.serverUploaded).length}
            </div>
            <div className="text-gray-400">Uploaded to Server</div>
          </div>
        </div>
      </div>
      </>}
    </div>
  );
}