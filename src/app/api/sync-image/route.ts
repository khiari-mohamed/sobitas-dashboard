import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import axios from 'axios';

export async function POST(request: NextRequest) {
  try {
    const { imagePath, backendUrl } = await request.json();
    console.log(`API: Syncing ${imagePath} from ${backendUrl}`);
    
    // Clean the image path
    const cleanPath = imagePath.replace(/^\/+/, '');
    const downloadUrl = `${backendUrl}/${cleanPath}`;
    
    console.log(`API: Download URL: ${downloadUrl}`);
    
    // Create local path
    const localPath = path.join(process.cwd(), 'public', cleanPath);
    const localDir = path.dirname(localPath);
    
    // Check if image already exists locally
    if (fs.existsSync(localPath)) {
      console.log(`API: Image already exists locally`);
      return NextResponse.json({ success: true, url: `/${cleanPath}` });
    }
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
      console.log(`API: Created directory: ${localDir}`);
    }
    
    // Download image from backend
    const response = await axios.get(downloadUrl, {
      responseType: 'arraybuffer',
      timeout: 5000
    });
    
    console.log(`API: Download response status: ${response.status}`);
    
    // Save image locally
    fs.writeFileSync(localPath, response.data);
    
    console.log(`API: Image synced successfully: ${cleanPath}`);
    return NextResponse.json({ success: true, url: `/${cleanPath}` });
    
  } catch (error) {
    console.error(`API: Failed to sync image:`, error instanceof Error ? error.message : 'Unknown error');
    if (axios.isAxiosError(error)) {
      console.error(`API: Axios error status: ${error.response?.status}`);
    }
    return NextResponse.json({ success: false, url: "/images/placeholder.png" });
  }
}