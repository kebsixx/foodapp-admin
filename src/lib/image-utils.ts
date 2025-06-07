export const isValidImageUrl = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    const contentType = response.headers.get('content-type');
    return response.ok && !!contentType && contentType.startsWith('image/');
  } catch {
    return false;
  }
};

export const getImageDimensions = (url: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = reject;
    img.src = url;
  });
};

export const preloadImage = (url: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = url;
  });
};

// Helper untuk mendapatkan URL terbaik berdasarkan konteks
export const getBestImageUrl = (
  heroImage: string,
  heroImageUrls?: {
    original?: string;
    display?: string;
    medium?: string;
    thumb?: string;
  },
  context: 'thumbnail' | 'preview' | 'display' = 'display'
): { primary: string; fallback: string } => {
  switch (context) {
    case 'thumbnail':
      return {
        primary: heroImageUrls?.thumb || heroImageUrls?.medium || heroImage,
        fallback: heroImage,
      };
    case 'preview':
      return {
        primary: heroImageUrls?.medium || heroImageUrls?.display || heroImage,
        fallback: heroImage,
      };
    case 'display':
    default:
      return {
        primary: heroImageUrls?.display || heroImageUrls?.medium || heroImage,
        fallback: heroImage,
      };
  }
};