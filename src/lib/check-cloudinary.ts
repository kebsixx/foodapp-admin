/**
 * Utility to check if Cloudinary environment variables are set correctly
 */

export const checkCloudinaryConfig = () => {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  
  const issues: string[] = [];
  
  if (!cloudName) {
    issues.push('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not defined');
  }
  
  if (!uploadPreset) {
    issues.push('NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not defined');
  }
  
  return {
    isConfigured: issues.length === 0,
    cloudName,
    uploadPreset,
    issues,
  };
};

export const logCloudinaryStatus = () => {
  const config = checkCloudinaryConfig();
  
  if (config.isConfigured) {
    console.log('✅ Cloudinary configuration is valid:');
    console.log(`  - Cloud Name: ${config.cloudName}`);
    console.log(`  - Upload Preset: ${config.uploadPreset}`);
  } else {
    console.error('❌ Cloudinary configuration issues:');
    config.issues.forEach(issue => console.error(`  - ${issue}`));
  }
  
  return config;
}; 