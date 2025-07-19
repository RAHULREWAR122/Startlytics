'use client'
import { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '@/apiLinks';
export default function FileUploader({ uploadUrl }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
     console.log('clicked   -----------------------');
     
    if (!file || !uploadUrl) {
      setStatus('Please select a file and ensure upload URL is set.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setStatus('Uploading...');
      const response = await axios.post(uploadUrl, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization' : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTRkYWZjYmNmMzY3ODkxMjNiYTBkOSIsImlhdCI6MTc1MDM5MTU0OCwiZXhwIjoxNzUwOTk2MzQ4fQ.mwVbJtEmWhCdAJOU_IyyzLYugqflamJ-huGMP_38pIk`
        },
      });
      setStatus('Upload successful!');
      console.log('Response:', response.data);
    } catch (error) {
      setStatus('Upload failed.');
      console.error('Upload error:', error);
    }
  };


  const handleGet = async()=>{
     try {
         const req = await axios.get('http://localhost:5000/api/data/6855012eac327994095ad5b1/export?type=excel', {
            headers : {
                'Authorization' : `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4NTRkYWZjYmNmMzY3ODkxMjNiYTBkOSIsImlhdCI6MTc1MDM5MTU0OCwiZXhwIjoxNzUwOTk2MzQ4fQ.mwVbJtEmWhCdAJOU_IyyzLYugqflamJ-huGMP_38pIk`
            }
            
         })

         console.log('data download success' , req);  
     } catch (error) {
        
     }
  }
  return (
    <div className="p-4 border rounded shadow-md max-w-md mx-auto bg-white">
      <h2 className="text-xl font-semibold mb-4">Upload File</h2>
      <input type="file" onChange={handleFileChange} className="mb-4" />
      <button
        onClick={handleUpload}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Upload
      </button>

      <button onClick={handleGet}>Download </button>
      {status && <p className="mt-2 text-sm">{status}</p>}
    </div>
  );
}
