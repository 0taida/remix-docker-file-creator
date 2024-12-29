import { json, unstable_parseMultipartFormData, writeAsyncIterableToWritable } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import fs from "fs";
import path from "path";
import { PassThrough } from "stream";

export const action: ActionFunction = async ({ request }) => {
  try {
    let uploadPath = "/";
    let fileName = "";
    let fileData: Buffer | null = null;

    // Parse the multipart form data
    await unstable_parseMultipartFormData(
      request,
      async ({ name, filename, contentType, data }) => {
        if (name === "path") {
          const chunks = [];
          for await (const chunk of data) {
            chunks.push(chunk);
          }
          uploadPath = Buffer.concat(chunks).toString('utf8');
        }
        
        if (name === "file" && filename) {
          fileName = filename;
          const chunks = [];
          for await (const chunk of data) {
            chunks.push(chunk);
          }
          fileData = Buffer.concat(chunks);
        }
      }
    );

    // Validate we have all required data
    if (!fileData || !fileName) {
      console.log('Missing required data:', { fileName, hasFileData: !!fileData });
      return json({ 
        message: "No valid file data provided",
        success: false 
      }, { status: 400 });
    }

    // Ensure we have valid strings for path construction
    const basePath = "/shared";
    const cleanPath = uploadPath.replace(/^\/+|\/+$/g, '');

    // Construct the full path safely
    const pathParts = [basePath];
    if (cleanPath) pathParts.push(cleanPath);
    pathParts.push(fileName);

    const fullPath = path.join(...pathParts);
    
    console.log('Path construction:', {
      basePath,
      cleanPath,
      fileName,
      fullPath,
      pathParts,
      fileDataLength: fileData.length
    });

    // Get directory path safely
    const dir = path.dirname(fullPath);
    console.log('Directory to create:', dir);

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, fileData);

    return json({ 
      message: `File '${fileName}' uploaded successfully`,
      path: fullPath,
      success: true
    });
  } catch (error) {
    console.error('Error uploading file:', error);
    return json({ 
      message: error instanceof Error ? error.message : "Error uploading file",
      error: error instanceof Error ? error.stack : undefined,
      success: false
    }, { status: 500 });
  }
}; 