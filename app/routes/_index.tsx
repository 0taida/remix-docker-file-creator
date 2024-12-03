import { useLoaderData } from "@remix-run/react";
import { useState } from "react";

type LoaderData = {
  apiEndpoint: string;
};

export const loader = async (): Promise<LoaderData> => {
  return { apiEndpoint: "/create-folder" };
};

export default function Index() {
  const { apiEndpoint } = useLoaderData<LoaderData>();
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileContent, setFileContent] = useState("");

  const createFolder = async () => {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ folderName, fileName, fileType, fileContent }),
    });

    const result = await response.json();
    alert(result.message);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "400px", margin: "auto" }}>
      <h1 style={{ textAlign: "center", color: "#4A90E2" }}>Remix Folder Creator</h1>
      <input
        type="text"
        placeholder="Folder Name"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <input
        type="text"
        placeholder="File Name"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <input
        type="text"
        placeholder="File Type"
        value={fileType}
        onChange={(e) => setFileType(e.target.value)}
        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc" }}
      />
      <textarea
        placeholder="File Content"
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
        style={{ padding: "10px", borderRadius: "5px", border: "1px solid #ccc", minHeight: "100px" }}
      />
      <button
        onClick={createFolder}
        style={{
          padding: "10px",
          borderRadius: "5px",
          border: "none",
          backgroundColor: "#4A90E2",
          color: "white",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        Create Folder
      </button>
    </div>
  );
}
