'use client';

import QRScanner from '@/components/QRscanner';
import { useRouter } from 'next/navigation';

export default function ScanningPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-950 p-4 sm:p-6">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-white mb-4 text-center">QR Code Scanner</h1>
        <p className="text-gray-400 text-center mb-8">Upload a QR code image to scan</p>

        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 mb-6 shadow-lg border border-gray-700">
          <QRScanner />
        </div>

        <button
          onClick={() => router.back()}
          className="mt-8 w-full bg-gray-800 text-white py-3 px-4 rounded-lg hover:bg-gray-700 transition-colors duration-200 flex items-center justify-center space-x-2"
        >
          <span>←</span>
          <span>Go Back</span>
        </button>
      </div>
    </div>
  );
}
