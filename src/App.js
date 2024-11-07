import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [data, setData] = useState('');
  const [encodedImageId, setEncodedImageId] = useState(null);
  const [decodedData, setDecodedData] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleDataChange = (e) => {
    setData(e.target.value);
  };

  const handleEncode = async () => {
    if (!file || !data) {
      alert('Please provide both an image and data to encode.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('data', data);

    try {
      const response = await axios.post('http://localhost:8000/encode/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setEncodedImageId(response.data.id);
      alert(`Image encoded successfully. Image ID: ${response.data.id}`);
    } catch (error) {
      console.error('Error encoding image:', error);
      alert('Failed to encode image.');
    }
  };

  const handleDecode = async () => {
    if (!encodedImageId) {
      alert('Please encode an image first.');
      return;
    }

    try {
      const response = await axios.get(`http://localhost:8000/decode/${encodedImageId}`);
      setDecodedData(response.data.data);
    } catch (error) {
      console.error('Error decoding image:', error);
      alert('Failed to decode image.');
    }
  };

  return (
    <div>
      <h1>Steganography Tool</h1>
      <div>
        <h2>Encode Data into Image</h2>
        <input type="file" accept=".png,.bmp" onChange={handleFileChange} />
        <br />
        <textarea
          placeholder="Enter data to encode"
          value={data}
          onChange={handleDataChange}
          rows={4}
          cols={50}
        />
        <br />
        <button onClick={handleEncode}>Encode</button>
      </div>
      <div>
        <h2>Decode Data from Image</h2>
        <button onClick={handleDecode}>Decode</button>
      </div>
      {encodedImageId && (
        <div>
          <h3>Encoded Image Information</h3>
          <p>Image ID: {encodedImageId}</p>
        </div>
      )}
      {decodedData && (
        <div>
          <h3>Decoded Data</h3>
          <p>{decodedData}</p>
        </div>
      )}
    </div>
  );
}

export default App;
