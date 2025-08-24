/**
 * Utility to automatically sync images from backend to dashboard public folder
 */

export async function syncImageFromBackend(imagePath: string, backendUrl: string): Promise<string> {
  try {
    console.log(`Attempting to sync: ${imagePath} from ${backendUrl}`);
    
    const response = await fetch('/api/sync-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ imagePath, backendUrl }),
    });
    
    const result = await response.json();
    console.log(`Sync result:`, result);
    
    return result.success ? result.url : '/images/placeholder.png';
    
  } catch (error) {
    console.log(`Failed to sync image: ${imagePath}`, error instanceof Error ? error.message : 'Unknown error');
    return "/images/placeholder.png";
  }
}

export async function getImageUrlWithSync(imagePath: string | null | undefined): Promise<string> {
  if (!imagePath) return "/images/placeholder.png";
  
  // If it's already a full URL, return as is
  if (/^https?:\/\//.test(imagePath)) {
    return imagePath;
  }
  
  const cleanPath = imagePath.replace(/^\/+/, "");
  
  // All backend images are saved to dashboard public folder
  // No syncing needed - just use local paths
  if (cleanPath.includes('August2025') || cleanPath.includes('août2025') || cleanPath.includes('aout2025')) {
    return `/${cleanPath}`;
  }
  
  // For old images, use local public folder
  return `/${cleanPath}`;
}