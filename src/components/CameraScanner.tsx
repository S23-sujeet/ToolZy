import { useCallback, useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';
import { BrowserMultiFormatReader, type IScannerControls } from '@zxing/browser';
import type { Result } from '@zxing/library';

interface CameraScannerProps {
  mode: 'qr' | 'barcode';
  onResult: (result: string, format?: string) => void;
}

export default function CameraScanner({ mode, onResult }: CameraScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const controlsRef = useRef<IScannerControls | null>(null);
  const frameRef = useRef<number | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const stop = useCallback(() => {
    if (frameRef.current !== null) cancelAnimationFrame(frameRef.current);
    frameRef.current = null;
    controlsRef.current?.stop();
    controlsRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
    setActive(false);
  }, []);

  const startQrScan = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) throw new Error('Your browser could not prepare the camera preview.');

    const scanFrame = () => {
      if (!video.videoWidth || !video.videoHeight) {
        frameRef.current = requestAnimationFrame(scanFrame);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);
      const result = jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, {
        inversionAttempts: 'attemptBoth',
      });
      if (result) {
        onResult(result.data);
        stop();
        return;
      }
      frameRef.current = requestAnimationFrame(scanFrame);
    };

    void video.play();
    frameRef.current = requestAnimationFrame(scanFrame);
  }, [onResult, stop]);

  const start = async () => {
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false });
      streamRef.current = stream;
      const video = videoRef.current;
      if (!video) throw new Error('Camera preview is unavailable.');
      video.srcObject = stream;
      video.onloadedmetadata = () => {
        if (mode === 'qr') startQrScan();
      };
      await video.play();
      setActive(true);

      if (mode === 'qr' && video.readyState >= HTMLMediaElement.HAVE_METADATA) {
        startQrScan();
      }

      if (mode === 'barcode') {
        const reader = new BrowserMultiFormatReader();
        controlsRef.current = await reader.decodeFromStream(stream, video, (result: Result | undefined) => {
          if (!result) return;
          onResult(result.getText(), result.getBarcodeFormat().toString());
          stop();
        });
      }
    } catch (err) {
      stop();
      setError(err instanceof Error ? err.message : 'Camera access was unavailable. Check your browser permission.');
    }
  };

  const capture = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      setError('Camera preview is not ready yet. Try again in a moment.');
      return;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d', { willReadFrequently: true });
    if (!context) {
      setError('Your browser could not capture the camera preview.');
      return;
    }

    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    try {
      if (mode === 'qr') {
        const result = jsQR(context.getImageData(0, 0, canvas.width, canvas.height).data, canvas.width, canvas.height, {
          inversionAttempts: 'attemptBoth',
        });
        if (!result) throw new Error('No QR code was found in the captured image.');
        onResult(result.data);
      } else {
        const imageUrl = canvas.toDataURL('image/png');
        const reader = new BrowserMultiFormatReader();
        const result = await reader.decodeFromImageUrl(imageUrl);
        onResult(result.getText(), result.getBarcodeFormat().toString());
      }
      stop();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No code was found in the captured image.');
    }
  };

  useEffect(() => stop, [stop]);

  return (
    <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-semibold text-slate-800">Scan with camera</h2>
          <p className="mt-1 text-sm text-slate-500">Use your device camera. Frames are processed locally; nothing is uploaded.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {active && <button type="button" onClick={() => void capture()} className="rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700">Capture image</button>}
          <button type="button" onClick={() => void (active ? stop() : start())} className="rounded-xl bg-slate-800 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-700">
            {active ? 'Stop camera' : 'Open camera'}
          </button>
        </div>
      </div>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className={`${active ? 'mt-4' : 'hidden'} aspect-video w-full rounded-lg bg-slate-900 object-cover`}
        aria-label={`${mode === 'qr' ? 'QR code' : 'barcode'} camera preview`}
      />
      {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
    </div>
  );
}