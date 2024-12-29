import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

// Helper function to recursively read directory
const readDirRecursive = (dirPath: string, basePath: string) => {
  const items: Array<{ name: string; type: 'file' | 'folder'; content?: string; path: string }> = [];
  
  const contents = fs.readdirSync(dirPath);
  
  for (const item of contents) {
    const fullPath = path.join(dirPath, item);
    const relativePath = path.relative(basePath, fullPath);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      items.push({
        name: item,
        type: 'folder',
        path: '/' + relativePath,
        children: readDirRecursive(fullPath, basePath)
      });
    } else {
      items.push({
        name: item,
        type: 'file',
        path: '/' + relativePath,
        content: fs.readFileSync(fullPath, 'utf-8')
      });
    }
  }
  
  return items;
};

export const loader = async () => {
  const sharedPath = "/shared";

  try {
    // Check if directory exists, if not create it
    if (!fs.existsSync(sharedPath)) {
      fs.mkdirSync(sharedPath, { recursive: true });
    }

    const items = readDirRecursive(sharedPath, sharedPath);
    
    // Log the items for debugging
    console.log('Found items:', JSON.stringify(items, null, 2));

    return json({ items });
  } catch (error) {
    console.error('Error reading directory:', error);
    return json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      items: [] 
    }, { status: 500 });
  }
}; 