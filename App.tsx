import React, { useState } from 'react';
import { ImageUpload } from './components/ImageUpload';
import { Download, Lock, Unlock } from 'lucide-react';
import { hideMessage, textToBinary, extractMessage } from './utils/steganography';

function App() {
  const [sourceImage, setSourceImage] = useState<HTMLImageElement | null>(null);
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [message, setMessage] = useState('');
  const [encodedImage, setEncodedImage] = useState<string | null>(null);
  const [extractedMessage, setExtractedMessage] = useState('');
  const [mode, setMode] = useState<'encode' | 'decode'>('encode');

  const handleImageSelect = (img: HTMLImageElement, imgData: ImageData) => {
    setSourceImage(img);
    setImageData(imgData);
    setEncodedImage(null);
    setExtractedMessage('');
  };

  const handleEncode = () => {
    if (!imageData || !message) return;

    const binaryMessage = textToBinary(message);
    try {
      const encodedData = hideMessage(imageData, binaryMessage);
      
      const canvas = document.createElement('canvas');
      canvas.width = imageData.width;
      canvas.height = imageData.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.putImageData(encodedData, 0, 0);
      setEncodedImage(canvas.toDataURL());
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const handleDecode = () => {
    if (!imageData) return;
    try {
      const message = extractMessage(imageData);
      setExtractedMessage(message);
    } catch (error) {
      alert('Failed to extract message');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-3xl font-bold text-center mb-8">
            Image Steganography Tool
          </h1>

          <div className="flex gap-4 justify-center mb-6">
            <button
              onClick={() => setMode('encode')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                mode === 'encode'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Lock size={20} /> Encode
            </button>
            <button
              onClick={() => setMode('decode')}
              className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                mode === 'decode'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-700'
              }`}
            >
              <Unlock size={20} /> Decode
            </button>
          </div>

          <ImageUpload onImageSelect={handleImageSelect} />

          {sourceImage && (
            <div className="mt-6">
              <img
                src={sourceImage.src}
                alt="Selected"
                className="max-w-full h-auto rounded-lg"
              />
            </div>
          )}

          {mode === 'encode' ? (
            <div className="mt-6">
              <textarea
                className="w-full p-3 border rounded-lg"
                rows={4}
                placeholder="Enter your secret message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
              <button
                onClick={handleEncode}
                disabled={!imageData || !message}
                className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Lock size={20} /> Encode Message
              </button>

              {encodedImage && (
                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">
                    Encoded Image (Right-click to save):
                  </h3>
                  <img
                    src={encodedImage}
                    alt="Encoded"
                    className="max-w-full h-auto rounded-lg"
                  />
                  <a
                    href={encodedImage}
                    download="encoded_image.png"
                    className="mt-4 px-6 py-2 bg-green-500 text-white rounded-lg inline-flex items-center gap-2"
                  >
                    <Download size={20} /> Download Image
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="mt-6">
              <button
                onClick={handleDecode}
                disabled={!imageData}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Unlock size={20} /> Decode Message
              </button>

              {extractedMessage && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-2">
                    Extracted Message:
                  </h3>
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <p className="whitespace-pre-wrap">{extractedMessage}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;