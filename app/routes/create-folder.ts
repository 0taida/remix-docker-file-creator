import { json } from "@remix-run/node";
import fs from "fs";
import path from "path";

export const action = async ({ request }: { request: Request }) => {
  const { folderName, fileName, fileType, fileContent } = await request.json();

  // Path to the shared volume inside the container
  const sharedPath = "/shared";

  // Use the provided folder name
  const folderPath = path.join(sharedPath, folderName);

  // Create the folder if it doesn't exist
  if (!fs.existsSync(folderPath)) {
    fs.mkdirSync(folderPath, { recursive: true });
  }

  // Create a file inside the folder
  const filePath = path.join(folderPath, `${fileName}.${fileType}`);
  fs.writeFileSync(
    filePath,
    fileContent || `This is a file created in the folder ${folderName}.\n`
  );

  return json({
    message: "Folder and file created successfully.",
    folder: folderPath,
  });
};
