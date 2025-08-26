/**
 * Auto-detect backend URL based on availability
 */

const PROD_BACKEND = 'https://145.223.118.9:5000';
const DEV_BACKEND = 'http://localhost:5000';

let cachedBackendUrl: string | null = null;

export async function getBackendUrl(): Promise<string> {
  if (cachedBackendUrl) return cachedBackendUrl;
  
  // Try prod backend first
  try {
    const response = await fetch(`${PROD_BACKEND}/health`, { 
      method: 'GET',
      mode: 'cors',
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      cachedBackendUrl = PROD_BACKEND;
      return PROD_BACKEND;
    }
  } catch {
    console.log('Prod backend not available, trying local...');
  }
  
  // Fallback to local backend
  try {
    const response = await fetch(`${DEV_BACKEND}/health`, { 
      method: 'GET',
      mode: 'cors',
      signal: AbortSignal.timeout(3000)
    });
    if (response.ok) {
      cachedBackendUrl = DEV_BACKEND;
      return DEV_BACKEND;
    }
  } catch {
    console.log('Local backend not available');
  }
  
  // Default to prod if both fail
  cachedBackendUrl = PROD_BACKEND;
  return PROD_BACKEND;
}

export function getStaticBackendUrl(): string {
  return process.env.NEXT_PUBLIC_BACKEND_URL || PROD_BACKEND;
}