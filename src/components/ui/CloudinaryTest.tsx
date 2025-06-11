"use client";

import { useState } from 'react';
import { Button } from './button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './card';
import { Loader2, Wifi } from 'lucide-react';
import { checkCloudinaryConnectivity, checkNetworkSpeed } from '@/lib/network-check';

export const CloudinaryTest = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [result, setResult] = useState<string | null>(null);
  const [details, setDetails] = useState<any>(null);
  const [networkStatus, setNetworkStatus] = useState<{
    status: 'idle' | 'loading' | 'success' | 'error';
    message: string | null;
    pingTime?: number;
    downloadSpeed?: number | null;
    uploadSpeed?: number | null;
  }>({
    status: 'idle',
    message: null
  });

  const testCloudinaryConnection = async () => {
    setStatus('loading');
    setResult(null);
    setDetails(null);

    try {
      // Use our API endpoint to test connectivity
      const response = await fetch('/api/cloudinary/ping');
      const data = await response.json();

      if (data.success) {
        setStatus('success');
        setResult(data.message);
        setDetails(data);
      } else {
        setStatus('error');
        setResult(data.message);
        setDetails(data);
      }
    } catch (error) {
      setStatus('error');
      setResult(`Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  };

  const testNetworkConnectivity = async () => {
    setNetworkStatus({
      status: 'loading',
      message: 'Testing connectivity...'
    });

    try {
      // Test direct connectivity to Cloudinary
      const connectivityResult = await checkCloudinaryConnectivity();
      
      if (connectivityResult.success) {
        // If connectivity is good, test network speed
        const speedResult = await checkNetworkSpeed();
        
        setNetworkStatus({
          status: 'success',
          message: connectivityResult.message,
          pingTime: connectivityResult.pingTime,
          downloadSpeed: speedResult.downloadSpeed,
          uploadSpeed: speedResult.uploadSpeed
        });
      } else {
        setNetworkStatus({
          status: 'error',
          message: connectivityResult.message
        });
      }
    } catch (error) {
      setNetworkStatus({
        status: 'error',
        message: `Error: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cloudinary Connection Test</CardTitle>
        <CardDescription>Test connectivity to the Cloudinary API</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-2">API Connectivity Test</h3>
          <Button 
            onClick={testCloudinaryConnection}
            disabled={status === 'loading'}
            variant={status === 'error' ? 'destructive' : 'default'}
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : 'Test API Connection'}
          </Button>

          {result && (
            <div className={`mt-4 p-4 rounded-md ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="font-medium">{result}</p>
              
              {details && details.issues && (
                <ul className="mt-2 list-disc pl-5 text-sm">
                  {details.issues.map((issue: string, i: number) => (
                    <li key={i}>{issue}</li>
                  ))}
                </ul>
              )}
              
              {details && details.error && (
                <p className="mt-2 text-sm">{details.error}</p>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium mb-2">Network Connectivity Test</h3>
          <Button 
            onClick={testNetworkConnectivity}
            disabled={networkStatus.status === 'loading'}
            variant="outline"
          >
            {networkStatus.status === 'loading' ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Testing...
              </>
            ) : (
              <>
                <Wifi className="mr-2 h-4 w-4" />
                Test Network
              </>
            )}
          </Button>

          {networkStatus.message && (
            <div className={`mt-4 p-4 rounded-md ${networkStatus.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
              <p className="font-medium">{networkStatus.message}</p>
              
              {networkStatus.status === 'success' && (
                <div className="mt-2 text-sm">
                  <p>Ping: {networkStatus.pingTime}ms</p>
                  {networkStatus.downloadSpeed && (
                    <p>Download speed: {networkStatus.downloadSpeed.toFixed(2)} KB/s</p>
                  )}
                  {networkStatus.uploadSpeed && (
                    <p>Upload speed: {networkStatus.uploadSpeed.toFixed(2)} KB/s</p>
                  )}
                  
                  {(networkStatus.uploadSpeed && networkStatus.uploadSpeed < 50) && (
                    <p className="mt-2 text-amber-600 font-medium">
                      ⚠️ Your upload speed is very low, which may cause timeouts when uploading images.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <h3 className="font-medium">Environment Variables:</h3>
          <ul className="mt-2 space-y-1 text-sm">
            <li>
              <strong>NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME:</strong>{' '}
              {process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ? '✓ Set' : '✗ Missing'}
            </li>
            <li>
              <strong>NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET:</strong>{' '}
              {process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET ? '✓ Set' : '✗ Missing'}
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}; 