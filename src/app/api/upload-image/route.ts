import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { image } = await request.json();

    if (!image) {
      return NextResponse.json(
        { success: false, error: 'No image data provided' },
        { status: 400 }
      );
    }

    const formData = new FormData();
    formData.append('image', image);
    formData.append('key', process.env.IMGBB_API_KEY!);
    formData.append('expiration', '0');

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    const result = await response.json();

    if (result.success && result.data) {
      // Return object dengan semua URL yang dibutuhkan
      return NextResponse.json({
        success: true,
        urls: {
          original: result.data.url,
          display: result.data.display_url,
          medium: result.data.medium?.url,
          thumb: result.data.thumb?.url,
        },
        // Untuk backward compatibility, gunakan medium sebagai default
        url: result.data.medium?.url || result.data.display_url,
        delete_url: result.data.delete_url,
        viewer_url: result.data.url_viewer,
        width: result.data.width,
        height: result.data.height,
        size: result.data.size,
      });
    } else {
      return NextResponse.json({
        success: false,
        error: result.error?.message || 'Upload failed',
      });
    }
  } catch (error) {
    console.error('Upload API error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error' 
      },
      { status: 500 }
    );
  }
}