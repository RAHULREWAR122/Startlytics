'use client'
import { useState , useEffect } from 'react';
import { ExternalLink, Globe, Lock, CheckCircle, AlertCircle, RefreshCw, Eye, Settings, Upload } from 'lucide-react';
import Papa from 'papaparse';
import LoadingAnimation from '../Animation/LoadingAnimation';
import { useAuth } from '../AuthPage';
import { userDetails } from '../UserDetails/loggedInUserDetails';
import { useSelector , useDispatch } from 'react-redux';
import { loadUserFromLocalStorage , loadTokenFromLocalStorage } from '@/components/Redux/AuthSlice';
import { useRouter } from 'next/navigation';
import { BASE_URL } from '@/apiLinks';
import { useThemeColor } from '@/hooks/themeColors';

const GoogleSheetsUpload = () => {
  const [sheetUrl, setSheetUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [importing, setImporting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [importedSheets, setImportedSheets] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const [selectedSheetId, setSelectedSheetId] = useState(null);
  const [urlError, setUrlError] = useState('');
  const [uploadError, setUploadError] = useState('');
  const [uploadSuccess, setUploadSuccess] = useState('');
  
  const {background , text} = useThemeColor();

  const route = useRouter()
  const dispatch = useDispatch();
  const token = useSelector((state)=>state?.userLocalSlice?.token)
  const user = useSelector((state)=>state?.userLocalSlice?.user)
      
  useEffect(()=>{
          dispatch(loadTokenFromLocalStorage())
          dispatch(loadUserFromLocalStorage())
  },[dispatch , token])
  

  const validateUrl = (url) => {
    const csvRegex = /\.(csv)$/i;
    const googleSheetsRegex = /^https:\/\/docs\.google\.com\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
    const csvUrlRegex = /https?:\/\/.*\.csv/i;
    const googleDriveRegex = /^https:\/\/drive\.google\.com\/file\/d\/([a-zA-Z0-9-_]+)/;
    
    return googleSheetsRegex.test(url) || csvRegex.test(url) || csvUrlRegex.test(url) || googleDriveRegex.test(url);
  };

  const convertGoogleSheetsToCSV = (url) => {
    const sheetsMatch = url.match(/\/spreadsheets\/d\/([a-zA-Z0-9-_]+)/);
    if (sheetsMatch) {
      const fileId = sheetsMatch[1];
      return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv`;
    }
    
    const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
    if (driveMatch) {
      const fileId = driveMatch[1];
      return `https://docs.google.com/spreadsheets/d/${fileId}/export?format=csv&gid=0`;
    }
    
    return url;
  };

  const parseCSVFromUrl = async (url) => {
    return new Promise((resolve, reject) => {
      Papa.parse(url, {
        download: true,
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true,
        delimitersToGuess: [',', ';', '\t', '|'],
        complete: (results) => {
          if (results.errors.length > 0) {
            console.warn('CSV parsing warnings:', results.errors);
          }
          resolve(results);
        },
        error: (error) => {
          console.error('PapaParse error:', error);
          reject(new Error('Failed to parse CSV. Please ensure the file is publicly accessible or try converting it to a Google Sheets document.'));
        }
      });
    });
  };

  const createPreviewData = (sheet) => {
    if (!sheet || !sheet.data || sheet.data.length === 0) return null;

    const headers = Object.keys(sheet.data[0] || {});
    const previewRows = sheet.data.slice(0, 7).map(row => {
      return headers.map(header => {
        const value = row[header];
        return value !== undefined && value !== null ? String(value) : '';
      });
    });

    return {
      sheetName: sheet.name,
      headers: headers,
      rows: previewRows,
      totalRows: sheet.data.length,
      sheetId: sheet.id
    };
  };

  const updatePreviewData = (sheetId) => {
    const sheet = importedSheets.find(s => s.id === sheetId);
    const preview = createPreviewData(sheet);
    setPreviewData(preview);
  };

  const handleSheetSelection = (sheetId) => {
    setSelectedSheetId(sheetId);
    updatePreviewData(sheetId);
    setUploadError('');
    setUploadSuccess('');
  };

  const handleImport = async () => {
    if (!validateUrl(sheetUrl)) {
      setUrlError('Please enter a valid Google Sheets URL, Google Drive CSV link, or direct CSV URL');
      return;
    }
    
    setUrlError('');
    setImporting(true);
    
    try {
      const csvUrl = convertGoogleSheetsToCSV(sheetUrl);
      
      const results = await parseCSVFromUrl(csvUrl);
      
      if (!results.data || results.data.length === 0) {
        throw new Error('No data found in the CSV file');
      }

      const headers = results.meta.fields ? 
        results.meta.fields.map(field => field.trim()) : 
        Object.keys(results.data[0] || {});

      const newSheet = {
        id: Date.now(),
        name: `Sheet_${Date.now()}`,
        url: sheetUrl,
        csvUrl: csvUrl,
        status: 'preview',
        lastSync: new Date().toISOString(),
        rows: results.data.length,
        columns: headers.length,
        isPublic: sheetUrl.includes('docs.google.com') || sheetUrl.includes('drive.google.com'),
        owner: 'Unknown',
        data: results.data 
      };
      
      // Add the new sheet to the list
      setImportedSheets(prev => [...prev, newSheet]);
      
      // Auto-select the newly imported sheet and show its preview
      setSelectedSheetId(newSheet.id);
      const preview = createPreviewData(newSheet);
      setPreviewData(preview);
      
      setSheetUrl('');
      
    } catch (error) {
      console.error('Import failed:', error);
      if (error.message.includes('CORS') || error.message.includes('cross-origin')) {
        setUrlError('CORS Error: Please use a Google Sheets URL instead of Google Drive, or ensure the CSV file is hosted on a CORS-enabled server.');
      } else if (error.message.includes('403') || error.message.includes('Forbidden')) {
        setUrlError('Access Forbidden: Please make sure the file is publicly accessible or convert it to a Google Sheets document.');
      } else {
        setUrlError(`Failed to import: ${error.message}`);
      }
    } finally {
      setImporting(false);
    }
  };

 const handleUpload = async () => {
  if (!previewData || !previewData.sheetId) {
    setUploadError('No data to upload');
    return;
  }

  setUploading(true);
  setUploadError('');
  setUploadSuccess('');

  try {
    const sheet = importedSheets.find(s => s.id === previewData.sheetId);
    if (!sheet) {
      throw new Error('Sheet data not found');
    }
    

    const response = await fetch(`${BASE_URL}/api/users/googlesheetUrl` , {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` 
      },
      body: JSON.stringify({
        sheetUrl: sheet.url
      }),
    });

    if (response.ok) {
      const result = await response.json();
      
      if (result.isUpdate) {
        setUploadSuccess(`Sheet updated successfully! ${result.changes.changeType === 'added' ? 
          `${result.changes.rowsChanged} rows added` : 
          result.changes.changeType === 'removed' ? 
          `${result.changes.rowsChanged} rows removed` : 
          'No changes detected'}`);
      } else {
        setUploadSuccess('Sheet uploaded successfully!');
      }
      
      setImportedSheets(prev => 
        prev.map(s => 
          s.id === previewData.sheetId 
            ? { 
                ...s, 
                status: 'connected', 
                lastSync: result.lastSyncedAt,
                backendId: result.datasetId,
                syncCount: result.syncCount
              }
            : s
        )
      );
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || response.statusText);
    }
  } catch (error) {
    console.error('Upload failed:', error);
    setUploadError(`Upload failed: ${error.message}`);
  } finally {
    setUploading(false);
  }
};

  const syncSheet = async (sheetId) => {
    const sheet = importedSheets.find(s => s.id === sheetId);
    if (!sheet) return;
    
    setImportedSheets(prev => 
      prev.map(s => 
        s.id === sheetId 
          ? { ...s, status: 'syncing' }
          : s
      )
    );
    
    try {
      const results = await parseCSVFromUrl(sheet.csvUrl);
      
      const updatedSheet = {
        ...sheet,
        status: 'connected', 
        lastSync: new Date().toISOString(),
        rows: results.data.length,
        data: results.data
      };

      setImportedSheets(prev => 
        prev.map(s => 
          s.id === sheetId ? updatedSheet : s
        )
      );
      
      // Update preview if this is the selected sheet
      if (selectedSheetId === sheetId) {
        const preview = createPreviewData(updatedSheet);
        setPreviewData(preview);
      }
      
    } catch (error) {
      console.error('Sync failed:', error);
      setImportedSheets(prev => 
        prev.map(s => 
          s.id === sheetId 
            ? { ...s, status: 'error' }
            : s
        )
      );
    }
  };

  // Fixed removeSheet function to handle preview properly
  const removeSheet = (sheetId) => {
    const updatedSheets = importedSheets.filter(s => s.id !== sheetId);
    setImportedSheets(updatedSheets);
    
    // If the removed sheet was selected, handle preview properly
    if (selectedSheetId === sheetId) {
      if (updatedSheets.length > 0) {
        // Select the most recent sheet (last in array)
        const nextSheet = updatedSheets[updatedSheets.length - 1];
        setSelectedSheetId(nextSheet.id);
        const preview = createPreviewData(nextSheet);
        setPreviewData(preview);
      } else {
        // No sheets left, clear everything
        setSelectedSheetId(null);
        setPreviewData(null);
        setUploadError('');
        setUploadSuccess('');
      }
    }
  };

  const formatTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

   useEffect(()=>{
        if(!token || !user?.email){
          route.push('/')
        }
   },[token , dispatch , user])

  return (<>
      {!token ? <LoadingAnimation/> : 
    <div style={{background : background.primary}}  className="min-h-screen bg-gray-900 text-white">
    
      <div className="absolute top-32 right-24 w-28 h-28 bg-green-600 rounded-full opacity-20 blur-xl"></div>
      <div className="absolute bottom-32 left-16 w-36 h-36 bg-blue-600 rounded-full opacity-15 blur-2xl"></div>
      
      <div className="relative z-10 p-6 max-w-[100%] px-10 mx-auto">
      
        <div className="mb-8 mt-20 text-center">
          <h1 className="text-4xl font-bold mb-4">
            <span className="bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
              Google Sheets Import
            </span>
          </h1>
          <p style={{color : text.secondary}}  className="text-gray-300 text-lg">
            Connect and import CSV data from Google Sheets, Google Drive, or direct CSV links
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
          <div className="lg:col-span-2 space-y-6 ">
          
            <div style={{background : background.primary}} className="bg-gray-800 shadow-xl rounded-xl p-6">
              <h3 style={{color : text.secondary}} className="text-xl font-semibold mb-4">Import New Sheet</h3>
              
              <div className="space-y-4">
                <div>
                  <label style={{color : text.secondary}} className="block text-sm font-medium mb-2">Google Sheets URL, Google Drive CSV, or Direct CSV Link</label>
                  <div className="relative">
                    <input
                      type="url"
                      value={sheetUrl}
                      style={{background : background.secondary , color : text.secondary}}
                      onChange={(e) => {
                        setSheetUrl(e.target.value);
                        setUrlError('');
                      }}
                      placeholder="https://docs.google.com/spreadsheets/d/... or https://drive.google.com/file/d/... or https://example.com/data.csv"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:border-green-500 transition-colors pr-12"
                    />
                    <ExternalLink className="absolute right-3 top-3 w-5 h-5 text-gray-400" />
                  </div>
                  {urlError && (
                    <p className="text-red-400 text-sm mt-2 flex items-center">
                      <AlertCircle className="w-4 h-4 mr-1" />
                      {urlError}
                    </p>
                  )}
                </div>

                <div style={{background : background.secondary}} className="bg-gray-700/50 shadow-xl rounded-lg p-4">
                  <h4 style={{color : text.primary}} className="font-medium mb-2">Supported Formats:</h4>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li style={{color : text.secondary}} className="flex items-center">
                      <Globe className="w-4 h-4 mr-2 text-green-400" />
                      Google Sheets (public or shareable links)
                    </li>
                    <li style={{color : text.secondary}}  className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2 text-blue-400" />
                      Google Drive CSV files (convert to Google Sheets for best results)
                    </li>
                    <li style={{color : text.secondary}} className="flex items-center">
                      <ExternalLink className="w-4 h-4 mr-2 text-purple-400" />
                      Direct CSV file links
                    </li>
                  </ul>
                  <div className="mt-3 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
                    <p className="text-yellow-400 text-xs">
                      <strong>Tip:</strong> For Google Drive CSV files, consider uploading to Google Sheets first, then sharing the Sheets URL for better compatibility.
                    </p>
                  </div>
                </div>

                <button
                  onClick={handleImport}
                  disabled={importing || !sheetUrl}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {importing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    'Import & Preview'
                  )}
                </button>
              </div>
            </div>

            <div style={{background : background.secondary}} className="bg-gray-800 shadow-xl rounded-xl p-6 ">
              <h3 style={{color : text.secondary}} className="text-xl font-semibold mb-4">Connected Sheets</h3>
              {importedSheets.length === 0 ? (
                <div className="text-center py-8">
                  <ExternalLink className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                  <p style={{color : text.secondary}}  className="text-gray-400">No sheets connected yet</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[260px] overflow-y-auto py-2 custom_scrollbar px-5">
                  {importedSheets.map((sheet) => (
                    <div 
                      key={sheet.id} 
                      style={{background : background.primary}}
                      className={`bg-gray-700 rounded-lg p-4 shadow-lg transition-all cursor-pointer ${
                        selectedSheetId === sheet.id ? 'ring-2 ring-green-500 bg-gray-700/80' : 'hover:bg-gray-600'
                      }`}
                      onClick={() => handleSheetSelection(sheet.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <h4 style={{color : text.secondary}} className="font-medium">{sheet.name}</h4>
                            {sheet.isPublic ? (
                              <Globe className="w-4 h-4 text-green-400" />
                            ) : (
                              <Lock className="w-4 h-4 text-blue-400" />
                            )}
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              sheet.status === 'connected' ? 'bg-green-500/20 text-green-400' :
                              sheet.status === 'syncing' ? 'bg-yellow-500/20 text-yellow-400' :
                              sheet.status === 'preview' ? 'bg-blue-500/20 text-blue-400' :
                              'bg-red-500/20 text-red-400'
                            }`}>
                              {sheet.status}
                            </span>
                            {selectedSheetId === sheet.id && (
                              <Eye color={text.primary}  className="w-4 h-4 text-green-400" />
                            )}
                          </div>
                          <p style={{color : text.secondary}} className="text-sm text-gray-400 mb-2">
                            {sheet.rows.toLocaleString()} rows • {sheet.columns} columns
                          </p>
                          <p style={{color : text.secondary}} className="text-xs text-gray-500">
                            Last synced: {formatTimeAgo(sheet.lastSync)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              syncSheet(sheet.id);
                            }}
                            disabled={sheet.status === 'syncing'}
                            className="p-2 hover:bg-gray-400 rounded-lg transition-colors disabled:opacity-50"
                          >
                            <RefreshCw color={text.secondary} className={`w-4 cursor-pointer  h-4 ${sheet.status === 'syncing' ? 'animate-spin' : ''}`} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeSheet(sheet.id);
                            }}
                            className="p-2 hover:bg-gray-600 rounded-lg transition-colors text-red-400"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div style={{background : background.secondary}} className="bg-gray-800 shadow-xl rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 style={{color : text.secondary}} className="text-xl font-semibold">Live Preview</h3>
              {importedSheets.length > 1 && (
                <div style={{color : text.secondary}} className="text-xs text-gray-400">
                  Click sheet to preview
                </div>
              )}
            </div>
            
            {previewData ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span style={{color : text.secondary}} className="text-gray-400">Sheet: {previewData.sheetName}</span>
                  <span className="text-green-400 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Ready
                  </span>
                </div>
                
                <div style={{color : text.secondary}} className="text-sm text-gray-400">
                  Showing 7 of {previewData.totalRows.toLocaleString()} rows
                </div>
                
                <div className="overflow-x-auto custom_scrollbar_bottom">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-700">
                        {previewData.headers.map((header, idx) => (
                          <th key={idx} style={{color : text.primary}} className="text-left p-2 font-medium text-gray-300 text-xs">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.rows.map((row, idx) => (
                        <tr key={idx} className="border-b border-gray-700/50">
                          {row.map((cell, cellIdx) => (
                            <td key={cellIdx} style={{color : text.secondary}} className="p-2 text-gray-300 text-xs">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {uploadError && (
                  <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                    <p className="text-red-400 text-sm flex items-center">
                      <AlertCircle className="w-4 h-4 mr-2" />
                      {uploadError}
                    </p>
                  </div>
                )}

                {uploadSuccess && (
                  <div className="bg-green-500/20 border border-green-500/50 rounded-lg p-3">
                    <p className="text-green-400 text-sm flex items-center">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {uploadSuccess}
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <button 
                    onClick={handleUpload}
                    disabled={uploading}
                    className="w-full bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 rounded-lg hover:from-green-700 hover:to-blue-700 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                  >
                    {uploading ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 mr-2" />
                        Upload to Server
                      </>
                    )}
                  </button>
                  <button className="w-full bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors text-sm">
                    Export to Dashboard
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <ExternalLink className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <p className="text-gray-400 text-sm">
                  {importedSheets.length > 0 ? 'Click on a sheet to preview' : 'Import a sheet to see live preview'}
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
          <div style={{background : background.primary}}  className="bg-gray-800 shadow-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">
              {importedSheets.length}
            </div>
            <div className="text-gray-400 text-sm">Connected Sheets</div>
          </div>
          <div style={{background : background.primary}} className="bg-gray-800 shadow-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">
              {importedSheets.filter(s => s.status === 'connected').length}
            </div>
            <div className="text-gray-400 text-sm">Uploaded</div>
          </div>
          <div  style={{background : background.primary}} className="bg-gray-800 shadow-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">
              {importedSheets.reduce((acc, sheet) => acc + sheet.rows, 0).toLocaleString()}
            </div>
            <div className="text-gray-400 text-sm">Total Rows</div>
          </div>
          <div style={{background : background.primary}} className="bg-gray-800 shadow-xl rounded-xl p-6 text-center">
            <div className="text-3xl font-bold text-pink-400 mb-2">
              {importedSheets.filter(s => s.isPublic).length}
            </div>
            <div className="text-gray-400 text-sm">Public Sheets</div>
          </div>
        </div>
      </div>
    </div>
  } 
  </>);
}

export default GoogleSheetsUpload;