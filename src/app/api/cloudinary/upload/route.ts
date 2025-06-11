import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Get Cloudinary credentials from environment variables
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      return NextResponse.json(
        { success: false, message: 'Cloudinary configuration is missing' },
        { status: 500 }
      );
    }
    
    // Create a new FormData instance for the Cloudinary API
    const cloudinaryFormData = new FormData();
    cloudinaryFormData.append('file', file);
    cloudinaryFormData.append('upload_preset', uploadPreset);
    cloudinaryFormData.append('cloud_name', cloudName);
    
    // Set a longer timeout for the fetch request (120 seconds)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);
    
    try {
      // Upload to Cloudinary
      const cloudinaryResponse = await fetch(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        {
          method: 'POST',
          body: cloudinaryFormData,
          signal: controller.signal,
        }
      );
      
      // Clear the timeout
      clearTimeout(timeoutId);
      
      if (!cloudinaryResponse.ok) {
        const errorText = await cloudinaryResponse.text();
        console.error('Cloudinary API error:', errorText);
        return NextResponse.json(
          { 
            success: false, 
            message: `Upload failed: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`,
            details: errorText
          },
          { status: cloudinaryResponse.status }
        );
      }
      
      const data = await cloudinaryResponse.json();
      
      return NextResponse.json({
        success: true,
        result: {
          public_id: data.public_id,
          secure_url: data.secure_url,
          width: data.width,
          height: data.height,
          format: data.format,
          resource_type: data.resource_type,
        }
      });
    } catch (error: any) {
      if (error.name === 'AbortError') {
        return NextResponse.json(
          { success: false, message: 'Upload timed out after 120 seconds' },
          { status: 504 }
        );
      }
      
      throw error;
    }
  } catch (error: any) {
    console.error('Server-side upload error:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Server-side upload failed',
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
} 