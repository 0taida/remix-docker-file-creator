import { useLoaderData, useNavigate, Form } from "@remix-run/react";
import { useState, useEffect } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { Toaster, toast } from 'react-hot-toast';

const modalOverlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.8)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  backgroundColor: '#1a1a1a',
  padding: '20px',
  borderRadius: '12px',
  width: '90%',
  maxWidth: '500px',
  position: 'relative',
  border: '1px solid #333',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
};

const buttonStyle: React.CSSProperties = {
  padding: "10px 20px",
  borderRadius: "8px",
  border: "none",
  backgroundColor: "#2563eb",
  color: "white",
  cursor: "pointer",
  fontWeight: "bold",
  transition: "all 0.2s ease",
};

type FileInfo = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  path: string;
};

type LoaderData = {
  apiEndpoint: string;
  contents: FileInfo[];
};

// Add new type for tree structure
type FileTree = {
  name: string;
  type: 'file' | 'folder';
  content?: string;
  path: string;
  children?: FileTree[];
};

// Add to existing types
type PathOption = {
  label: string;
  value: string;
};

// Add to existing types
type EditingItem = {
  type: 'file' | 'folder';
  name: string;
  content?: string;
  path: string;
  newName?: string;
};

// Convert flat structure to tree
const buildFileTree = (items: FileInfo[]): FileTree[] => {
  const tree: FileTree[] = [];
  const map = new Map<string, FileTree>();

  items.forEach(item => {
    const parts = item.path.split('/').filter(p => p);
    const fileName = parts.pop() || item.name;
    let currentPath = '';
    let parentPath = '';

    const node: FileTree = {
      ...item,
      name: fileName,
      children: item.type === 'folder' ? [] : undefined
    };

    map.set(item.path, node);

    if (parts.length === 0) {
      tree.push(node);
    } else {
      parentPath = '/' + parts.join('/');
      const parent = map.get(parentPath);
      if (parent && parent.children) {
        parent.children.push(node);
      }
    }
  });

  return tree;
};

// Add this function after buildFileTree
const buildPathOptions = (items: FileTree[]): PathOption[] => {
  const options: PathOption[] = [{ label: "Root (/)", value: "/" }];
  
  const addPaths = (item: FileTree, currentPath: string) => {
    if (item.type === 'folder') {
      const fullPath = `${currentPath}${item.name}/`;
      options.push({ 
        label: `${fullPath}`, 
        value: fullPath 
      });
      
      item.children?.forEach(child => addPaths(child, fullPath));
    }
  };
  
  items.forEach(item => addPaths(item, '/'));
  return options;
};

// TreeItem component for recursive rendering
const TreeItem = ({ 
  item, 
  depth = 0,
  onEdit,
  onDelete 
}: { 
  item: FileTree; 
  depth?: number;
  onEdit: (file: FileInfo) => void;
  onDelete: (name: string, type: 'file' | 'folder') => void;
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(item.name);

  const handleRename = async () => {
    try {
      const response = await fetch("/rename-item", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: item.type,
          oldPath: item.path,
          newName: newName
        }),
      });

      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setIsEditing(false);
        window.location.reload(); // Refresh to update tree
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to rename item");
      console.error(error);
    }
  };

  const openFile = () => {
    // Construct the file URL
    const fileUrl = `/shared${item.path}`;
    window.open(fileUrl, '_blank');
  };

  return (
    <div style={{ marginLeft: `${depth * 20}px` }}>
      <div style={{
        display: "flex",
        alignItems: "center",
        padding: "8px",
        borderRadius: "6px",
        backgroundColor: "#222",
        marginBottom: "4px",
        transition: "all 0.2s ease",
      }}
      onMouseOver={(e) => {
        e.currentTarget.style.backgroundColor = "#2a2a2a";
      }}
      onMouseOut={(e) => {
        e.currentTarget.style.backgroundColor = "#222";
      }}
      >
        {item.type === 'folder' && item.children && item.children.length > 0 ? (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            style={{
              background: 'none',
              border: 'none',
              color: '#fff',
              cursor: 'pointer',
              padding: '0 8px',
              fontSize: '1.2em',
              display: 'flex',
              alignItems: 'center',
              transition: 'transform 0.2s ease'
            }}
          >
            <span style={{
              display: 'inline-block',
              transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ▶
            </span>
            <span style={{ marginLeft: '4px' }}>
              {isExpanded ? '📂' : '📁'}
            </span>
          </button>
        ) : (
          <span style={{ padding: '0 8px' }}>
            {item.type === 'folder' ? '📁' : '📄'}
          </span>
        )}
        
        {isEditing ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            autoFocus
            style={{
              flex: 1,
              padding: "4px 8px",
              backgroundColor: "#333",
              border: "1px solid #444",
              borderRadius: "4px",
              color: "#fff",
              marginRight: "8px",
            }}
          />
        ) : (
          <span style={{ 
            flex: 1, 
            color: '#fff',
            marginLeft: item.type === 'folder' && (!item.children || item.children.length === 0) ? '24px' : '0'
          }}>
            {item.name}
            {item.type === 'folder' && item.children && (
              <span style={{ 
                color: '#666', 
                fontSize: '0.8em',
                marginLeft: '8px' 
              }}>
                ({item.children.length} {item.children.length === 1 ? 'item' : 'items'})
              </span>
            )}
          </span>
        )}

        <div style={{ display: "flex", gap: "8px" }}>
          {item.type === 'file' && (
            <>
              <button
                onClick={() => onEdit(item)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Edit
              </button>
              <button
                onClick={openFile}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#059669",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Open
              </button>
            </>
          )}
          {isEditing ? (
            <>
              <button
                onClick={handleRename}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#059669",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#666",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#2563eb",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Rename
              </button>
              <button
                onClick={() => onDelete(item.name, item.type)}
                style={{
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "none",
                  backgroundColor: "#dc2626",
                  color: "white",
                  cursor: "pointer",
                  fontSize: "12px"
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      </div>

      {/* Children are only rendered if the folder is expanded */}
      {item.type === 'folder' && item.children && isExpanded && (
        <div style={{
          overflow: 'hidden',
          transition: 'all 0.3s ease',
        }}>
          {item.children.map((child) => (
            <TreeItem 
              key={child.path} 
              item={child} 
              depth={depth + 1}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
};

// Add new type for file upload
type UploadModalProps = {
  onClose: () => void;
  selectedPath: string;
  setSelectedPath: (path: string) => void;
  pathOptions: PathOption[];
};

// Add FileUploadModal component
const FileUploadModal = ({ onClose, selectedPath, setSelectedPath, pathOptions }: UploadModalProps) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const fileInput = event.currentTarget.querySelector('input[type="file"]') as HTMLInputElement;
    
    if (!fileInput.files || fileInput.files.length === 0) {
      toast.error("Please select a file");
      return;
    }

    const formData = new FormData();
    // Important: append file first with the correct field name
    formData.append('file', fileInput.files[0], fileInput.files[0].name);
    formData.append('path', selectedPath);

    setIsSubmitting(true);
    
    try {
      // console.log('Uploading file:', {
      //   fileName: fileInput.files[0].name,
      //   path: selectedPath,
      //   fileSize: fileInput.files[0].size
      // });

      const response = await fetch("/upload-file", {
        method: "POST",
        // Important: don't set Content-Type header, let the browser handle it
        body: formData
      });
      
      const result = await response.json();
      
      if (response.ok) {
        toast.success(result.message || "File uploaded successfully");
        onClose();
        navigate(".", { replace: true }); // Refresh the content
      } else {
        toast.error(result.message || "Failed to upload file");
      }
    } catch (error) {
      toast.error("Failed to upload file");
      console.error("Upload error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={modalOverlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={e => e.stopPropagation()}>
        <h2 style={{ color: "#4A90E2", marginBottom: "15px" }}>Upload File</h2>
        
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <select
            name="path"
            value={selectedPath}
            onChange={(e) => setSelectedPath(e.target.value)}
            style={{ 
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#222",
              color: "#fff",
              marginBottom: "12px",
              width: "100%",
              outline: "none",
            }}
          >
            {pathOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          <input
            type="file"
            name="file"
            required
            accept="*/*"
            style={{ 
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #333",
              backgroundColor: "#222",
              color: "#fff",
              marginBottom: "12px",
              width: "100%",
              outline: "none",
            }}
          />
          
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              style={{ ...buttonStyle, backgroundColor: "#666" }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                ...buttonStyle,
                opacity: isSubmitting ? 0.7 : 1,
                cursor: isSubmitting ? 'not-allowed' : 'pointer'
              }}
            >
              {isSubmitting ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const loader: LoaderFunction = async (): Promise<LoaderData> => {
  try {
    const response = await fetch("http://localhost:3000/list-contents");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // console.log('Loaded contents:', data); // Debug log
    return { 
      apiEndpoint: "/create-folder",
      contents: data.items || []
    };
  } catch (error) {
    console.error("Error loading contents:", error);
    return {
      apiEndpoint: "/create-folder",
      contents: []
    };
  }
};

export default function Index() {
  const { apiEndpoint, contents } = useLoaderData<LoaderData>();
  const navigate = useNavigate();
  const [showFileModal, setShowFileModal] = useState(false);
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [folderName, setFolderName] = useState("");
  const [fileName, setFileName] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [editingFile, setEditingFile] = useState<FileInfo | null>(null);
  const [selectedFolderPath, setSelectedFolderPath] = useState("/");
  const [selectedFilePath, setSelectedFilePath] = useState("/");
  const [isEditing, setIsEditing] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedUploadPath, setSelectedUploadPath] = useState("/");

  const refreshContents = () => {
    if (!isEditing) {
      navigate(".", { replace: true });
    }
  };

  const createFolder = async () => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          folderName,
          path: selectedFolderPath,
          fileName: "", 
          fileType: "", 
          fileContent: "" 
        }),
      });

      const result = await response.json();
      toast.success(result.message);
      setFolderName("");
      setShowFolderModal(false);
      refreshContents(); // Refresh after creation
    } catch (error) {
      toast.error("Failed to create folder");
      console.error(error);
    }
  };

  const createFile = async () => {
    try {
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          folderName: "", 
          path: selectedFilePath,
          fileName, 
          fileType, 
          fileContent 
        }),
      });

      const result = await response.json();
      toast.success(result.message);
      setFileName("");
      setFileType("");
      setFileContent("");
      setShowFileModal(false);
      refreshContents(); // Refresh after creation
    } catch (error) {
      toast.error("Failed to create file");
      console.error(error);
    }
  };

  const deleteItem = async (name: string, type: 'file' | 'folder') => {
    try {
      const response = await fetch("/delete-item", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, type }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        refreshContents(); // Refresh after deletion
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to delete item");
      console.error(error);
    }
  };

  const editFile = async (name: string, content: string) => {
    try {
      const response = await fetch("/edit-file", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, content }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        setEditingFile(null);
        refreshContents(); // Refresh after edit
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to edit file");
      console.error(error);
    }
  };

  // Convert flat contents to tree structure
  const fileTree = buildFileTree(contents);

  // Convert contents to path options
  const pathOptions = buildPathOptions(fileTree);

  // Edit File Modal
  const EditFileModal = () => {
    if (!editingFile) return null;
    
    return (
      <div style={modalOverlayStyle} onClick={() => {
        setEditingFile(null);
        setIsEditing(false);
      }}>
        <div style={modalStyle} onClick={e => e.stopPropagation()}>
          <h2 style={{ 
            color: "#2563eb", 
            marginBottom: "20px",
            fontSize: "1.5rem",
            textShadow: "0 2px 8px rgba(37, 99, 235, 0.2)"
          }}>
            Edit File: {editingFile.name}
          </h2>
          <textarea
            value={editingFile.content}
            onChange={(e) => setEditingFile({ ...editingFile, content: e.target.value })}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            style={{ 
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
            }}
          />
          <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
            <button
              onClick={() => {
                setEditingFile(null);
                setIsEditing(false);
              }}
              style={{ ...buttonStyle, backgroundColor: "#666" }}
            >
              Cancel
            </button>
            <button
              onClick={() => {
                editFile(editingFile.name, editingFile.content || '');
                setIsEditing(false);
              }}
              style={buttonStyle}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Modify useEffect to respect editing state
  useEffect(() => {
    // Only set up auto-refresh if we're not editing
    if (!isEditing) {
      const interval = setInterval(() => {
        refreshContents();
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isEditing]); // Add isEditing to dependencies

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "15px", 
      maxWidth: "900px", 
      margin: "auto", 
      padding: "20px",
      backgroundColor: "#111",
      minHeight: "100vh",
      color: "#fff"
    }}>
      <Toaster 
        position="top-right" 
        toastOptions={{ 
          duration: 3000,
          style: {
            background: '#333',
            color: '#fff',
          },
        }} 
      />
      <h1 style={{ 
        textAlign: "center", 
        color: "#2563eb",
        fontSize: "2.5rem",
        textShadow: "0 2px 10px rgba(37, 99, 235, 0.3)",
        marginBottom: "20px"
      }}>
        Remix Folder Creator
      </h1>
      
      {/* Action Buttons */}
      <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
        <button
          onClick={() => setShowFolderModal(true)}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          Create Folder
        </button>
        <button
          onClick={() => setShowFileModal(true)}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          Create File
        </button>
        <button
          onClick={() => setShowUploadModal(true)}
          style={buttonStyle}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#1d4ed8"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#2563eb"}
        >
          Upload File
        </button>
      </div>

      {/* Folder Modal */}
      {showFolderModal && (
        <div style={modalOverlayStyle} onClick={() => setShowFolderModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: "#4A90E2", marginBottom: "15px" }}>Create New Folder</h2>
            
            {/* Add Path Selector */}
            <select
              value={selectedFolderPath}
              onChange={(e) => setSelectedFolderPath(e.target.value)}
              style={{ 
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#222",
                color: "#fff",
                marginBottom: "12px",
                width: "100%",
                outline: "none",
              }}
            >
              {pathOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="Folder Name"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              style={{ 
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#222",
                color: "#fff",
                marginBottom: "12px",
                width: "100%",
                outline: "none",
              }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowFolderModal(false)}
                style={{ ...buttonStyle, backgroundColor: "#666" }}
              >
                Cancel
              </button>
              <button
                onClick={createFolder}
                style={buttonStyle}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* File Modal with Path Selector */}
      {showFileModal && (
        <div style={modalOverlayStyle} onClick={() => setShowFileModal(false)}>
          <div style={modalStyle} onClick={e => e.stopPropagation()}>
            <h2 style={{ color: "#4A90E2", marginBottom: "15px" }}>Create New File</h2>
            
            {/* Add Path Selector */}
            <select
              value={selectedFilePath}
              onChange={(e) => setSelectedFilePath(e.target.value)}
              style={{ 
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#222",
                color: "#fff",
                marginBottom: "12px",
                width: "100%",
                outline: "none",
              }}
            >
              {pathOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="File Name"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              style={{ 
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#222",
                color: "#fff",
                marginBottom: "12px",
                width: "100%",
                outline: "none",
              }}
            />
            <input
              type="text"
              placeholder="File Type (e.g., txt, js, py)"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              style={{ 
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#222",
                color: "#fff",
                marginBottom: "12px",
                width: "100%",
                outline: "none",
              }}
            />
            <textarea
              placeholder="File Content"
              value={fileContent}
              onChange={(e) => setFileContent(e.target.value)}
              style={{ 
                padding: "12px",
                borderRadius: "8px",
                border: "1px solid #333",
                backgroundColor: "#222",
                color: "#fff",
                minHeight: "150px",
                width: "100%",
                marginBottom: "12px",
                outline: "none",
                resize: "vertical",
              }}
            />
            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowFileModal(false)}
                style={{ ...buttonStyle, backgroundColor: "#666" }}
              >
                Cancel
              </button>
              <button
                onClick={createFile}
                style={buttonStyle}
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit File Modal */}
      <EditFileModal />

      {/* Upload Modal */}
      {showUploadModal && (
        <FileUploadModal
          onClose={() => setShowUploadModal(false)}
          selectedPath={selectedUploadPath}
          setSelectedPath={setSelectedUploadPath}
          pathOptions={pathOptions}
        />
      )}

      {/* Contents List as Tree */}
      <div style={{ 
        border: "1px solid #333",
        padding: "25px",
        borderRadius: "12px",
        backgroundColor: "#1a1a1a",
        boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)"
      }}>
        <h2 style={{ 
          color: "#2563eb", 
          marginBottom: "20px",
          fontSize: "1.8rem",
          textShadow: "0 2px 8px rgba(37, 99, 235, 0.2)"
        }}>
          Volume Contents
        </h2>
        <div>
          {fileTree.length > 0 ? (
            fileTree.map((item) => (
              <TreeItem 
                key={item.path} 
                item={item}
                onEdit={setEditingFile}
                onDelete={deleteItem}
              />
            ))
          ) : (
            <div style={{ 
              color: "#666", 
              textAlign: "center", 
              padding: "30px",
              backgroundColor: "#222",
              borderRadius: "8px",
              border: "1px solid #333"
            }}>
              No files or folders found
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
