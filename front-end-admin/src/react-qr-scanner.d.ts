declare module 'react-qr-scanner' {
  import React from 'react';

  export interface QrScannerProps {
    delay?: number;
    onError?: (error: Error) => void;
    onScan?: (data: { text: string } | string | null) => void;
    style?: React.CSSProperties;
    facingMode?: 'user' | 'environment';
  }

  const QrScanner: React.FC<QrScannerProps>;
  export default QrScanner;
}
