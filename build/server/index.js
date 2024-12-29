import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable, json } from "@remix-run/node";
import { RemixServer, Outlet, Meta, Links, ScrollRestoration, Scripts, useLoaderData } from "@remix-run/react";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import fs from "fs";
import path from "path";
import { useState } from "react";
import { Toaster, toast } from "react-hot-toast";
const ABORT_DELAY = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, remixContext, loadContext) {
  return isbot(request.headers.get("user-agent") || "") ? handleBotRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  ) : handleBrowserRequest(
    request,
    responseStatusCode,
    responseHeaders,
    remixContext
  );
}
function handleBotRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onAllReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
function handleBrowserRequest(request, responseStatusCode, responseHeaders, remixContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(
        RemixServer,
        {
          context: remixContext,
          url: request.url,
          abortDelay: ABORT_DELAY
        }
      ),
      {
        onShellReady() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, ABORT_DELAY);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest
}, Symbol.toStringTag, { value: "Module" }));
const links = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous"
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
  }
];
function Layout({ children }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("meta", { charSet: "utf-8" }),
      /* @__PURE__ */ jsx("meta", { name: "viewport", content: "width=device-width, initial-scale=1" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { style: {
      backgroundColor: "#111",
      color: "#fff",
      minHeight: "100vh",
      margin: 0,
      fontFamily: "Inter, system-ui, sans-serif"
    }, children: [
      children,
      /* @__PURE__ */ jsx(ScrollRestoration, {}),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
}
function ErrorBoundary({ error }) {
  return /* @__PURE__ */ jsxs("html", { lang: "en", className: "dark", children: [
    /* @__PURE__ */ jsxs("head", { children: [
      /* @__PURE__ */ jsx("title", { children: "Error!" }),
      /* @__PURE__ */ jsx(Meta, {}),
      /* @__PURE__ */ jsx(Links, {})
    ] }),
    /* @__PURE__ */ jsxs("body", { style: {
      backgroundColor: "#111",
      color: "#fff",
      minHeight: "100vh",
      margin: 0,
      padding: "20px",
      fontFamily: "Inter, system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center"
    }, children: [
      /* @__PURE__ */ jsxs("div", { style: {
        maxWidth: "600px",
        textAlign: "center",
        padding: "40px",
        backgroundColor: "#1a1a1a",
        borderRadius: "12px",
        border: "1px solid #333",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
      }, children: [
        /* @__PURE__ */ jsx("h1", { style: { color: "#ef4444", marginTop: 0 }, children: "Error" }),
        /* @__PURE__ */ jsx("p", { style: { color: "#999" }, children: error.message })
      ] }),
      /* @__PURE__ */ jsx(Scripts, {})
    ] })
  ] });
}
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: App,
  links
}, Symbol.toStringTag, { value: "Module" }));
const action$2 = async ({ request }) => {
  const { folderName, fileName, fileType, fileContent } = await request.json();
  const sharedPath = "/shared";
  try {
    if (folderName) {
      const folderPath = path.join(sharedPath, folderName);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      return json({ message: `Folder '${folderName}' created successfully` });
    } else if (fileName) {
      const filePath = path.join(sharedPath, `${fileName}.${fileType}`);
      fs.writeFileSync(filePath, fileContent || "");
      return json({ message: `File '${fileName}.${fileType}' created successfully` });
    } else {
      return json({ message: "No folder name or file name provided" }, { status: 400 });
    }
  } catch (error) {
    console.error("Error creating item:", error);
    return json({ message: "Error creating item" }, { status: 500 });
  }
};
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$2
}, Symbol.toStringTag, { value: "Module" }));
const loader$1 = async () => {
  const sharedPath = "/shared";
  const items = [];
  try {
    const contents = fs.readdirSync(sharedPath);
    for (const item of contents) {
      const fullPath = path.join(sharedPath, item);
      const stat = fs.statSync(fullPath);
      const itemInfo = {
        name: item,
        type: stat.isDirectory() ? "folder" : "file",
        path: fullPath,
        content: stat.isDirectory() ? void 0 : fs.readFileSync(fullPath, "utf-8")
      };
      items.push(itemInfo);
    }
    return json({ items });
  } catch (error) {
    console.error("Error reading directory:", error);
    return json({ items: [] });
  }
};
const route2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  loader: loader$1
}, Symbol.toStringTag, { value: "Module" }));
const action$1 = async ({ request }) => {
  if (request.method !== "DELETE") {
    return json({ message: "Method not allowed" }, { status: 405 });
  }
  const { name, type } = await request.json();
  const sharedPath = "/shared";
  const itemPath = path.join(sharedPath, name);
  try {
    if (type === "folder") {
      fs.rmSync(itemPath, { recursive: true, force: true });
    } else {
      fs.unlinkSync(itemPath);
    }
    return json({ message: `${type} '${name}' deleted successfully` });
  } catch (error) {
    console.error("Error deleting item:", error);
    return json({ message: `Error deleting ${type}` }, { status: 500 });
  }
};
const route3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action: action$1
}, Symbol.toStringTag, { value: "Module" }));
const action = async ({ request }) => {
  if (request.method !== "PUT") {
    return json({ message: "Method not allowed" }, { status: 405 });
  }
  const { name, content } = await request.json();
  const sharedPath = "/shared";
  const filePath = path.join(sharedPath, name);
  try {
    fs.writeFileSync(filePath, content);
    return json({ message: `File '${name}' updated successfully` });
  } catch (error) {
    console.error("Error updating file:", error);
    return json({ message: `Error updating file` }, { status: 500 });
  }
};
const route4 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  action
}, Symbol.toStringTag, { value: "Module" }));
const buildFileTree = (items) => {
  const tree = [];
  const map = /* @__PURE__ */ new Map();
  items.forEach((item) => {
    const parts = item.path.split("/").filter((p) => p);
    const fileName = parts.pop() || item.name;
    let parentPath = "";
    const node = {
      ...item,
      name: fileName,
      children: item.type === "folder" ? [] : void 0
    };
    map.set(item.path, node);
    if (parts.length === 0) {
      tree.push(node);
    } else {
      parentPath = "/" + parts.join("/");
      const parent = map.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  });
  return tree;
};
const TreeItem = ({
  item,
  depth = 0,
  onEdit,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  return /* @__PURE__ */ jsxs("div", { style: { marginLeft: `${depth * 20}px` }, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          padding: "8px",
          borderRadius: "6px",
          backgroundColor: "#222",
          marginBottom: "4px",
          transition: "all 0.2s ease"
        },
        onMouseOver: (e) => {
          e.currentTarget.style.backgroundColor = "#2a2a2a";
        },
        onMouseOut: (e) => {
          e.currentTarget.style.backgroundColor = "#222";
        },
        children: [
          item.type === "folder" && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: () => setIsExpanded(!isExpanded),
              style: {
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                padding: "0 8px",
                fontSize: "1.2em"
              },
              children: isExpanded ? "📂" : "📁"
            }
          ),
          item.type === "file" && /* @__PURE__ */ jsx("span", { style: { padding: "0 8px" }, children: "📄" }),
          /* @__PURE__ */ jsx("span", { style: { flex: 1, color: "#fff" }, children: item.name }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px" }, children: [
            item.type === "file" && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onEdit(item),
                style: {
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                },
                children: "Edit"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => onDelete(item.name, item.type),
                style: {
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                },
                children: "Delete"
              }
            )
          ] })
        ]
      }
    ),
    item.children && isExpanded && /* @__PURE__ */ jsx("div", { children: item.children.map((child) => /* @__PURE__ */ jsx(
      TreeItem,
      {
        item: child,
        depth: depth + 1,
        onEdit,
        onDelete
      },
      child.path
    )) })
  ] });
};
const loader = async () => {
  try {
    const response = await fetch("http://localhost:3000/list-contents");
    const contents = await response.json();
    return {
      apiEndpoint: "/create-folder",
      contents: contents.items
    };
  } catch (error) {
    console.warn("Could not fetch contents from API:", error);
    return {
      apiEndpoint: "/create-folder",
      contents: []
    };
  }
};
function Index() {
  const { apiEndpoint, contents } = useLoaderData();
  const [showFileModal, setShowFileModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [editingFile, setEditingFile] = useState(null);
  const createFolder = async () => {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ folderName, fileName: "", fileType: "", fileContent: "" })
    });
    const result = await response.json();
    toast.success(result.message);
    setFolderName("");
    setShowFolderModal(false);
  };
  const createFile = async () => {
    const response = await fetch(apiEndpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ folderName: "", fileName, fileType, fileContent })
    });
    const result = await response.json();
    toast.success(result.message);
    setFileName("");
    setFileType("");
    setFileContent("");
    setShowFileModal(false);
  };
  const deleteItem = async (name, type) => {
    const response = await fetch("/delete-item", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, type })
    });
    const result = await response.json();
    if (response.ok) {
      toast.success(result.message);
    } else {
      toast.error(result.message);
    }
  };
  const editFile = async (name, content) => {
    const response = await fetch("/edit-file", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name, content })
    });
    const result = await response.json();
    if (response.ok) {
      toast.success(result.message);
      setEditingFile(null);
    } else {
      toast.error(result.message);
    }
  };
  const modalOverlayStyle = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1e3
  };
  const modalStyle = {
    backgroundColor: "#1a1a1a",
    padding: "20px",
    borderRadius: "12px",
    width: "90%",
    maxWidth: "500px",
    position: "relative",
    border: "1px solid #333",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4)"
  };
  const buttonStyle = {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    backgroundColor: "#2563eb",
    color: "white",
    cursor: "pointer",
    fontWeight: "bold",
    transition: "all 0.2s ease"
  };
  const fileTree = buildFileTree(contents);
  const EditFileModal = () => {
    if (!editingFile) return null;
    return /* @__PURE__ */ jsx("div", { style: modalOverlayStyle, onClick: () => setEditingFile(null), children: /* @__PURE__ */ jsxs("div", { style: modalStyle, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsxs("h2", { style: {
        color: "#2563eb",
        marginBottom: "20px",
        fontSize: "1.5rem",
        textShadow: "0 2px 8px rgba(37, 99, 235, 0.2)"
      }, children: [
        "Edit File: ",
        editingFile.name
      ] }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          value: editingFile.content,
          onChange: (e) => setEditingFile({ ...editingFile, content: e.target.value }),
          style: {
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#222",
            color: "#fff",
            minHeight: "300px",
            width: "100%",
            marginBottom: "20px",
            outline: "none",
            resize: "vertical",
            fontFamily: "monospace"
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setEditingFile(null),
            style: { ...buttonStyle, backgroundColor: "#666" },
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => editFile(editingFile.name, editingFile.content || ""),
            style: buttonStyle,
            children: "Save Changes"
          }
        )
      ] })
    ] }) });
  };
  return /* @__PURE__ */ jsxs("div", { style: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    maxWidth: "900px",
    margin: "auto",
    padding: "20px",
    backgroundColor: "#111",
    minHeight: "100vh",
    color: "#fff"
  }, children: [
    /* @__PURE__ */ jsx(
      Toaster,
      {
        position: "top-right",
        toastOptions: {
          duration: 3e3,
          style: {
            background: "#333",
            color: "#fff"
          }
        }
      }
    ),
    /* @__PURE__ */ jsx("h1", { style: {
      textAlign: "center",
      color: "#2563eb",
      fontSize: "2.5rem",
      textShadow: "0 2px 10px rgba(37, 99, 235, 0.3)",
      marginBottom: "20px"
    }, children: "Remix Folder Creator" }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "15px", marginBottom: "20px" }, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowFolderModal(true),
          style: buttonStyle,
          onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#1d4ed8",
          onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#2563eb",
          children: "Create Folder"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: () => setShowFileModal(true),
          style: buttonStyle,
          onMouseOver: (e) => e.currentTarget.style.backgroundColor = "#1d4ed8",
          onMouseOut: (e) => e.currentTarget.style.backgroundColor = "#2563eb",
          children: "Create File"
        }
      )
    ] }),
    showFolderModal && /* @__PURE__ */ jsx("div", { style: modalOverlayStyle, onClick: () => setShowFolderModal(false), children: /* @__PURE__ */ jsxs("div", { style: modalStyle, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h2", { style: { color: "#4A90E2", marginBottom: "15px" }, children: "Create New Folder" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "Folder Name",
          value: folderName,
          onChange: (e) => setFolderName(e.target.value),
          style: {
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#222",
            color: "#fff",
            marginBottom: "12px",
            width: "100%",
            outline: "none"
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowFolderModal(false),
            style: { ...buttonStyle, backgroundColor: "#666" },
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: createFolder,
            style: buttonStyle,
            children: "Create"
          }
        )
      ] })
    ] }) }),
    showFileModal && /* @__PURE__ */ jsx("div", { style: modalOverlayStyle, onClick: () => setShowFileModal(false), children: /* @__PURE__ */ jsxs("div", { style: modalStyle, onClick: (e) => e.stopPropagation(), children: [
      /* @__PURE__ */ jsx("h2", { style: { color: "#4A90E2", marginBottom: "15px" }, children: "Create New File" }),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "File Name",
          value: fileName,
          onChange: (e) => setFileName(e.target.value),
          style: {
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#222",
            color: "#fff",
            marginBottom: "12px",
            width: "100%",
            outline: "none"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          placeholder: "File Type (e.g., txt, js, py)",
          value: fileType,
          onChange: (e) => setFileType(e.target.value),
          style: {
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#222",
            color: "#fff",
            marginBottom: "12px",
            width: "100%",
            outline: "none"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          placeholder: "File Content",
          value: fileContent,
          onChange: (e) => setFileContent(e.target.value),
          style: {
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #333",
            backgroundColor: "#222",
            color: "#fff",
            minHeight: "150px",
            width: "100%",
            marginBottom: "12px",
            outline: "none",
            resize: "vertical"
          }
        }
      ),
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", justifyContent: "flex-end" }, children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: () => setShowFileModal(false),
            style: { ...buttonStyle, backgroundColor: "#666" },
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            onClick: createFile,
            style: buttonStyle,
            children: "Create"
          }
        )
      ] })
    ] }) }),
    /* @__PURE__ */ jsx(EditFileModal, {}),
    /* @__PURE__ */ jsxs("div", { style: {
      border: "1px solid #333",
      padding: "25px",
      borderRadius: "12px",
      backgroundColor: "#1a1a1a",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
    }, children: [
      /* @__PURE__ */ jsx("h2", { style: {
        color: "#2563eb",
        marginBottom: "20px",
        fontSize: "1.8rem",
        textShadow: "0 2px 8px rgba(37, 99, 235, 0.2)"
      }, children: "Volume Contents" }),
      /* @__PURE__ */ jsx("div", { children: fileTree.length > 0 ? fileTree.map((item) => /* @__PURE__ */ jsx(
        TreeItem,
        {
          item,
          onEdit: setEditingFile,
          onDelete: deleteItem
        },
        item.path
      )) : /* @__PURE__ */ jsx("div", { style: {
        color: "#666",
        textAlign: "center",
        padding: "30px",
        backgroundColor: "#222",
        borderRadius: "8px",
        border: "1px solid #333"
      }, children: "No files or folders found" }) })
    ] })
  ] });
}
const route5 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: Index,
  loader
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/assets/entry.client-CUOtaLec.js", "imports": ["/assets/components-CWk_E0by.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": true, "module": "/assets/root-CMZzfPLW.js", "imports": ["/assets/components-CWk_E0by.js"], "css": ["/assets/root-C9ZsCBK5.css"] }, "routes/create-folder": { "id": "routes/create-folder", "parentId": "root", "path": "create-folder", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/create-folder-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/list-contents": { "id": "routes/list-contents", "parentId": "root", "path": "list-contents", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/list-contents-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/delete-item": { "id": "routes/delete-item", "parentId": "root", "path": "delete-item", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/delete-item-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/edit-file": { "id": "routes/edit-file", "parentId": "root", "path": "edit-file", "index": void 0, "caseSensitive": void 0, "hasAction": true, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/edit-file-l0sNRNKZ.js", "imports": [], "css": [] }, "routes/_index": { "id": "routes/_index", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": true, "hasClientAction": false, "hasClientLoader": false, "hasErrorBoundary": false, "module": "/assets/_index-D_cNoKT1.js", "imports": ["/assets/components-CWk_E0by.js"], "css": [] } }, "url": "/assets/manifest-926cd23d.js", "version": "926cd23d" };
const mode = "production";
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "v3_fetcherPersist": true, "v3_relativeSplatPath": true, "v3_throwAbortReason": true, "v3_routeConfig": false, "v3_singleFetch": true, "v3_lazyRouteDiscovery": true, "unstable_optimizeDeps": false };
const isSpaMode = false;
const publicPath = "/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/create-folder": {
    id: "routes/create-folder",
    parentId: "root",
    path: "create-folder",
    index: void 0,
    caseSensitive: void 0,
    module: route1
  },
  "routes/list-contents": {
    id: "routes/list-contents",
    parentId: "root",
    path: "list-contents",
    index: void 0,
    caseSensitive: void 0,
    module: route2
  },
  "routes/delete-item": {
    id: "routes/delete-item",
    parentId: "root",
    path: "delete-item",
    index: void 0,
    caseSensitive: void 0,
    module: route3
  },
  "routes/edit-file": {
    id: "routes/edit-file",
    parentId: "root",
    path: "edit-file",
    index: void 0,
    caseSensitive: void 0,
    module: route4
  },
  "routes/_index": {
    id: "routes/_index",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route5
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  mode,
  publicPath,
  routes
};
