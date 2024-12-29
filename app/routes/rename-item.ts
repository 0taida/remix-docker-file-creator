import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import fs from "fs";
import path from "path";

export const action: ActionFunction = async ({ request }) => {
  if (request.method !== "PUT") {
    return json({ message: "Method not allowed" }, { status: 405 });
  }

  try {
    const { type, oldPath, newName } = await request.json();
    const sharedPath = "/shared";
    const oldFullPath = path.join(sharedPath, oldPath.replace(/^\//, ''));
    const newFullPath = path.join(path.dirname(oldFullPath), newName);

    if (fs.existsSync(newFullPath)) {
      return json({ 
        message: `A ${type} with this name already exists`,
        success: false 
      }, { status: 400 });
    }

    fs.renameSync(oldFullPath, newFullPath);

    return json({ 
      message: `${type === 'folder' ? 'Folder' : 'File'} renamed successfully`,
      success: true
    });
  } catch (error) {
    console.error('Error renaming item:', error);
    return json({ 
      message: error instanceof Error ? error.message : "Error renaming item",
      success: false 
    }, { status: 500 });
  }
}; 