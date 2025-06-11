/**
 * Utility for checking network connectivity
 */

export const checkCloudinaryConnectivity = async (): Promise<{
  success: boolean;
  message: string;
  pingTime?: number;
}> => {
  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return {
      success: false,
      message: 'You are offline. Please check your internet connection.'
    };
  }
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  
  if (!cloudName) {
    return {
      success: false,
      message: 'Cloudinary cloud name is not configured.'
    };
  }
  
  try {
    const startTime = Date.now();
    
    // Try to ping Cloudinary
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    
    const response = await fetch(`https://res.cloudinary.com/${cloudName}/image/upload/sample`, {
      method: 'HEAD',
      signal: controller.signal,
    });
    
    clearTimeout(timeoutId);
    
    const endTime = Date.now();
    const pingTime = endTime - startTime;
    
    if (response.ok) {
      return {
        success: true,
        message: `Connected to Cloudinary (${pingTime}ms)`,
        pingTime
      };
    } else {
      return {
        success: false,
        message: `Failed to connect to Cloudinary: ${response.status} ${response.statusText}`,
        pingTime
      };
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return {
        success: false,
        message: 'Connection to Cloudinary timed out (10s)'
      };
    }
    
    return {
      success: false,
      message: `Error connecting to Cloudinary: ${error.message || 'Unknown error'}`
    };
  }
};

export const checkNetworkSpeed = async (): Promise<{
  downloadSpeed: number | null;
  uploadSpeed: number | null;
  message: string;
}> => {
  try {
    // Simple download speed test (download a small image and measure time)
    const startDownload = Date.now();
    const downloadResponse = await fetch('https://res.cloudinary.com/demo/image/upload/sample');
    
    if (!downloadResponse.ok) {
      return {
        downloadSpeed: null,
        uploadSpeed: null,
        message: 'Failed to test download speed'
      };
    }
    
    const blob = await downloadResponse.blob();
    const downloadTime = Date.now() - startDownload;
    const downloadSizeKB = blob.size / 1024;
    const downloadSpeedKBps = downloadSizeKB / (downloadTime / 1000);
    
    // Simple upload speed test (upload a small blob and measure time)
    const testData = new Blob([new ArrayBuffer(50 * 1024)]); // 50KB test data
    const formData = new FormData();
    formData.append('file', testData);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    
    const startUpload = Date.now();
    const uploadResponse = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/upload`, {
      method: 'POST',
      body: formData
    });
    
    let uploadSpeedKBps = null;
    
    if (uploadResponse.ok) {
      const uploadTime = Date.now() - startUpload;
      const uploadSizeKB = 50; // 50KB
      uploadSpeedKBps = uploadSizeKB / (uploadTime / 1000);
    }
    
    return {
      downloadSpeed: downloadSpeedKBps,
      uploadSpeed: uploadSpeedKBps,
      message: `Download: ${downloadSpeedKBps.toFixed(2)} KB/s, Upload: ${uploadSpeedKBps ? uploadSpeedKBps.toFixed(2) : 'N/A'} KB/s`
    };
  } catch (error: any) {
    return {
      downloadSpeed: null,
      uploadSpeed: null,
      message: `Network test failed: ${error.message || 'Unknown error'}`
    };
  }
}; 