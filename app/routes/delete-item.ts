import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

export const action = async ({ request }: { request: Request }) => {
  if (request.method !== "DELETE") {
    return json({ message: "Method not allowed" }, { status: 405 });
  }

  const { name, type } = await request.json();
  const sharedPath = "/shared";
  const itemPath = path.join(sharedPath, name);

  try {
    if (type === 'folder') {
      fs.rmSync(itemPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(itemPath);
    }

    return json({ message: `${type} '${name}' deleted successfully` });
  } catch (error) {
    console.error('Error deleting item:', error);
    return json({ message: `Error deleting ${type}` }, { status: 500 });
  }
}; 