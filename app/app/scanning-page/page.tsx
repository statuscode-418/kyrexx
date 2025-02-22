'use client';

import QRScanner from '@/components/QRscanner';
import { useRouter } from 'next/navigation';
import { useState, useRef } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function ScanningPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [uploadedResult, setUploadedResult] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 🔹 Handle QR code scanning from camera
  const handleScan = (data: string | null) => {
    if (data) {
      console.log('Scanned:', data);
    }
  };

  // 🔹 Handle scan errors
  const handleError = (err: Error) => {
    setError(err.message);
    console.error('Scan error:', err);
  };

  // 🔹 Handle file upload and scan QR from image
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      if (e.target?.result) {
        const img = new Image();
        img.src = e.target.result as string;
        img.onload = async () => {
          try {
            const codeReader = new BrowserMultiFormatReader();
            const result = await codeReader.decodeFromImageElement(img);
            setUploadedResult(result.getText());
            router.push(`/result?data=${encodeURIComponent(result.getText())}`);
          } catch (err) {
            setError('Failed to decode QR code from image.');
            console.error(err);
          }
        };
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="min-h-screen bg-gray-950 p-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold text-white mb-6 text-center">Scan QR Code</h1>

        {/* 📷 QR Scanner from Camera */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <QRScanner />
        </div>

        {/* 🖼 Upload QR Code Image */}
        <div className="bg-gray-800 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-white mb-2">Upload QR Code Image</h2>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-300 bg-gray-700 border border-gray-600 rounded-lg cursor-pointer file:py-2 file:px-4 file:mr-4 file:bg-gray-600 file:border-none file:text-white file:rounded-lg hover:file:bg-gray-500"
          />
        </div>

        {/* ✅ Scanned or Uploaded Result */}
        {uploadedResult && (
          <div className="mt-4 p-3 bg-green-900/50 border border-green-500 rounded-lg text-green-200">
            Scanned: {uploadedResult}
          </div>
        )}

        {/* ❌ Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* 🔙 Go Back Button */}
        <button
          onClick={() => router.back()}
          className="mt-6 w-full bg-gray-800 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
        >
          Go Back
        </button>
      </div>
    </div>
  );
}
