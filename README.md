# Docker Volume File Creator

A web application built with Remix.js that provides a user-friendly interface to create folders and files within Docker volumes. This tool allows you to specify file content and extensions, making it perfect for managing files in Docker volumes through a web interface.

## 🚀 Features

- Create folders in Docker volumes
- Create files with custom content
- Specify file extensions
- User-friendly web interface
- Real-time file system operations
- Docker volume integration

## 🛠️ Technologies

- [Remix.js](https://remix.run/) - Full-stack web framework
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- Docker - Container and volume management

## 🏁 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Docker with running daemon
- Docker volume(s) to manage

Create the required Docker volume:
```bash
docker volume create shared_volume
```

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/docker-volume-file-creator.git
cd docker-volume-file-creator
```

2. Install dependencies:
```bash
npm install
```

## 💻 Usage

1. Start the development server:
```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

3. Using the web interface:
   - Enter the folder path you want to create
   - Specify the file name and extension (e.g., `config.json`, `script.sh`)
   - Add your file content in the text editor
   - Click create to generate the folder and file

## 🚀 Production Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

### Docker Volume Access

Make sure the application has proper permissions to access and modify the Docker volumes you want to manage. The application needs to be run with appropriate user permissions or Docker socket access.

## 🔒 Security Considerations

- Ensure proper access controls are in place
- Validate file paths to prevent directory traversal
- Implement user authentication if needed
- Restrict access to specific Docker volumes

## 📝 License

[MIT License](LICENSE)

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest new features
- Submit pull requests
