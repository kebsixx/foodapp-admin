import { CloudinaryTest } from '@/components/ui/CloudinaryTest';
import { checkCloudinaryConfig } from '@/lib/check-cloudinary';

export default function CloudinaryTestPage() {
  const cloudinaryConfig = checkCloudinaryConfig();
  
  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">Cloudinary Connection Test</h1>
      
      {!cloudinaryConfig.isConfigured && (
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-md">
          <h2 className="text-lg font-medium text-amber-800 mb-2">⚠️ Configuration Issues</h2>
          <ul className="list-disc pl-5 text-amber-700">
            {cloudinaryConfig.issues.map((issue, index) => (
              <li key={index}>{issue}</li>
            ))}
          </ul>
          <p className="mt-2 text-sm text-amber-700">
            Please check your <code className="bg-amber-100 px-1 py-0.5 rounded">.env.local</code> file 
            and ensure all required environment variables are set.
          </p>
        </div>
      )}
      
      <CloudinaryTest />
    </div>
  );
} 