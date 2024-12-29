import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

export const action = async ({ request }: { request: Request }) => {
  const { folderName, fileName, fileType, fileContent, path: itemPath } = await request.json();
  const sharedPath = "/shared";

  try {
    if (folderName) {
      // Create folder with path
      const fullPath = path.join(sharedPath, itemPath.replace(/^\//, ''), folderName);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
      return json({ message: `Folder '${folderName}' created successfully` });
    } else if (fileName) {
      // Create file with path
      const fullPath = path.join(sharedPath, itemPath.replace(/^\//, ''), `${fileName}.${fileType}`);
      const dirPath = path.dirname(fullPath);
      
      // Ensure directory exists
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
      
      fs.writeFileSync(fullPath, fileContent || '');
      return json({ message: `File '${fileName}.${fileType}' created successfully` });
    } else {
      return json({ message: "No folder name or file name provided" }, { status: 400 });
    }
  } catch (error) {
    console.error('Error creating item:', error);
    return json({ message: "Error creating item" }, { status: 500 });
  }
};
