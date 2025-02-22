'use client';
import { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

const QRScanner = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    
    const startScanner = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' }, // Use rear camera if available
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsCameraActive(true);
        }

        // Start scanning
        codeReader.decodeFromVideoDevice(null, videoRef.current!, (result, err) => {
          if (result) {
            setScannedResult(result.getText());
          }
          if (err) {
            console.error('Scanning error:', err);
          }
        });
      } catch (err: any) {
        setError('Camera permission denied. Please allow camera access in your browser settings.');
        console.error('Camera access error:', err);
      }
    };

    startScanner();

    return () => {
      codeReader.reset();
      // Stop camera when unmounting
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-white">QR Code Scanner</h1>

      {error ? (
        <p className="mt-4 p-2 bg-red-200 text-red-800 rounded">{error}</p>
      ) : (
        <>
          <video ref={videoRef} className="border rounded-lg shadow-md w-full max-w-md" autoPlay playsInline />
          {!isCameraActive && <p className="text-white mt-2">Waiting for camera access...</p>}
        </>
      )}

      {scannedResult && (
        <p className="mt-4 p-2 bg-green-200 text-green-800 rounded">Scanned: {scannedResult}</p>
      )}
    </div>
  );
};

export default QRScanner;