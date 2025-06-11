import { NextResponse } from 'next/server';
import { checkCloudinaryConfig } from '@/lib/check-cloudinary';

export async function GET() {
  try {
    const config = checkCloudinaryConfig();
    
    if (!config.isConfigured) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Cloudinary configuration is incomplete', 
          issues: config.issues 
        },
        { status: 500 }
      );
    }
    
    // Try to ping Cloudinary API
    const response = await fetch(`https://api.cloudinary.com/v1_1/${config.cloudName}/ping`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    
    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: 'Cloudinary API is reachable',
        cloudName: config.cloudName,
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json(
        { 
          success: false, 
          message: `Cloudinary API returned an error: ${response.status} ${response.statusText}`,
          details: errorText
        },
        { status: response.status }
      );
    }
  } catch (error) {
    console.error('Error pinging Cloudinary API:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to connect to Cloudinary API',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 