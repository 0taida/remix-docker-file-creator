# Docker Volume Explorer

A modern web application built with Remix.js that provides a sleek, dark-themed interface for exploring and managing Docker volumes. This tool offers an intuitive tree-view interface for browsing volume contents, with real-time file management capabilities.

## 🚀 Features

- **Interactive Tree View**
  - Hierarchical display of volume contents
  - Expandable/collapsible folders
  - Real-time folder content count
  - Intuitive navigation through nested structures

- **File Management**
  - Upload files to any location
  - Create files and folders
  - Edit file contents in a modal window
  - Rename files and folders
  - Delete files and folders
  - Path selection for all operations

- **Modern UI/UX**
  - Dark theme interface
  - Smooth animations and transitions
  - Real-time updates
  - Toast notifications
  - Responsive design
  - Tree-based navigation

- **Docker Integration**
  - Direct Docker volume access
  - Persistent storage
  - Real-time file system operations
  - Safe file handling

## 🛠️ Technologies

- [Remix.js](https://remix.run/) - Full-stack web framework
- Docker - Container and volume management
- React Hot Toast - Notifications
- TypeScript - Type safety

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- Docker with running daemon

### Initial Setup

1. Create the required Docker volume:
```bash
docker volume create shared_volume
```

2. Clone the repository:
```bash
git clone https://github.com/yourusername/remix-folder-creator.git
cd remix-folder-creator
```

3. Install dependencies:
```bash
npm install
```

## 🚀 Development

1. Start the development environment:
```bash
docker-compose up --build
```

2. Access the application at `http://localhost:3000`

## 💻 Usage

### Managing Files and Folders

1. **Creating Folders**
   - Click "Create Folder"
   - Select the desired path from the dropdown
   - Enter folder name
   - Click Create

2. **Creating Files**
   - Click "Create File"
   - Select the destination path
   - Enter file name and extension
   - Add content in the editor
   - Click Create

3. **Editing Files**
   - Click the "Edit" button on any file
   - Modify content in the modal editor
   - Save changes

4. **Deleting Items**
   - Click the "Delete" button on any file or folder
   - Confirm the deletion

### Tree Navigation

- Click the arrow (▶) to expand/collapse folders
- View item counts for each folder
- Navigate through nested structures

## 🐳 Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up -d
```

2. Access the application at `http://localhost:3000`

## 🔒 Security Notes

- Ensure proper volume permissions
- Validate all file operations
- Implement access controls as needed
- Monitor volume usage

## 📝 License

[MIT License](LICENSE)

## 🤝 Contributing

Contributions are welcome! Please feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
- Improve documentation

## 🎨 Future Enhancements

- File upload capability
- Search functionality
- File type icons
- Drag and drop interface
- Multi-file operations
- User authentication
- Theme customization
