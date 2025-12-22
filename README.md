# 🚀 Code-Share - Real-time Collaborative Code Editor

A real-time collaborative code editor that allows multiple users to write and edit code together in synchronized rooms. Built with React, Node.js, Express, and Socket.io.

## 🌐 Live Demo

**Link:** [https://code-share-production-cb5a.up.railway.app](https://code-share-production-cb5a.up.railway.app)

---

## ✨ Features

- 🔄 **Real-time Collaboration** - Multiple users can edit code simultaneously
- 🎨 **Syntax Highlighting** - Support for multiple programming languages
- 🎭 **Multiple Themes** - Dracula, GitHub, Monokai, Solarized, Tokyo Night, VS Code
- 👥 **User Presence** - See who's currently in the room
- 📋 **Room System** - Create or join rooms with unique IDs
- 🔗 **Easy Sharing** - Share room ID to invite collaborators
- 💾 **Code Sync** - Automatic code synchronization across all users
- 📱 **Responsive Design** - Works on desktop and mobile devices

---

## 🛠️ Tech Stack

### Frontend

- **React** - UI library
- **React Router** - Client-side routing
- **CodeMirror** - Code editor component
- **Socket.io Client** - Real-time communication
- **React Hot Toast** - Notifications
- **Tailwind CSS** - Styling

### Backend

- **Node.js** - Runtime environment
- **Express** - Web framework
- **Socket.io** - WebSocket implementation
- **CORS** - Cross-origin resource sharing

---

## 📋 Prerequisites

Before you begin, ensure you have:

- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **Git**

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/code-share.git
cd code-share
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Setup

Create `.env` file in the **root directory**:

```env
REACT_APP_BACKEND_URL=http://localhost:4000
```

Create `.env` file in the **server directory**:

```env
PORT=4000
CLIENT_ORIGIN=http://localhost:3000
```

### 4. Run Development Server

**Option A: Run Both (Frontend + Backend)**

```bash
npm run dev
```

- Frontend: http://localhost:3000
- Backend: http://localhost:4000

**Option B: Run Separately**

Terminal 1 (Backend):

```bash
npm run dev:server
```

Terminal 2 (Frontend):

```bash
npm run dev:client
```

---

## 📂 Project Structure

```
code-share/
├── public/               # Static files
├── src/                  # React frontend source
│   ├── components/       # React components
│   ├── socket.js         # Socket.io client configuration
│   ├── App.js            # Main App component
│   └── index.js          # Entry point
├── server/               # Backend server
│   ├── index.js          # Express + Socket.io server
│   └── socketAction.js   # Socket event constants
├── .env                  # Frontend environment variables
├── server/.env           # Backend environment variables
└── package.json          # Dependencies and scripts
```

---

## 🔧 How It Works

### 1. **User Creates/Joins a Room**

```javascript
// User enters Room ID and Username
// Frontend generates UUID for new rooms
const roomId = v4(); // e.g., "a1b2c3d4-e5f6-..."
```

### 2. **Socket Connection Established**

```javascript
// src/socket.js
const socket = io(BACKEND_URL, {
  transports: ["websocket"],
  reconnectionAttempts: Infinity,
});
```

### 3. **User Joins Room**

```javascript
// Client emits JOIN event
socket.emit(ACTIONS.JOIN, { roomId, username });

// Server handles connection
io.on("connection", (socket) => {
  socket.on(ACTIONS.JOIN, ({ roomId, username }) => {
    socket.join(roomId); // Join socket room
    // Notify all users in room
    io.to(roomId).emit(ACTIONS.JOINED, { users, socketId });
  });
});
```

### 4. **Code Synchronization**

```javascript
// When user types code
socket.emit(ACTIONS.CODE_CHANGE, { roomId, code });

// Server broadcasts to all other users
socket.to(roomId).emit(ACTIONS.CODE_CHANGE, { code });

// Other users receive and update their editor
socket.on(ACTIONS.CODE_CHANGE, ({ code }) => {
  editorRef.current.setValue(code);
});
```

### 5. **User Leaves Room**

```javascript
// On disconnect or leave
socket.on("disconnect", () => {
  // Remove user from room
  // Notify remaining users
  io.to(roomId).emit(ACTIONS.DISCONNECTED, { socketId, users });
});
```

---

## 🌐 Deployment

### Deploy to Railway (Backend)

1. **Create Railway Account**: [railway.app](https://railway.app)

2. **Connect GitHub Repository**:

   - Click "New Project" → "Deploy from GitHub repo"
   - Select your repository

3. **Add Environment Variables**:

   ```env
   PORT=3000
   CLIENT_ORIGIN=https://your-frontend-url.vercel.app
   ```

4. **Deploy**:
   - Railway auto-deploys on every push
   - Get your URL: `https://your-app.up.railway.app`

### Deploy to Vercel (Frontend)

1. **Install Vercel CLI**:

   ```bash
   npm install -g vercel
   ```

2. **Update `.env`**:

   ```env
   REACT_APP_BACKEND_URL=https://your-backend.up.railway.app
   ```

3. **Deploy**:

   ```bash
   npm run build
   vercel --prod
   ```

4. **Add Environment Variable in Vercel Dashboard**:
   - Go to Project Settings → Environment Variables
   - Add: `REACT_APP_BACKEND_URL=https://your-backend.up.railway.app`

### Deploy to Heroku (Full Stack)

1. **Create Heroku App**:

   ```bash
   heroku create your-app-name
   ```

2. **Add Buildpack**:

   ```bash
   heroku buildpacks:set heroku/nodejs
   ```

3. **Set Environment Variables**:

   ```bash
   heroku config:set PORT=3000
   ```

4. **Deploy**:
   ```bash
   git push heroku main
   ```

---

## 📜 Available Scripts

| Script               | Description                              |
| -------------------- | ---------------------------------------- |
| `npm start`          | Start production server (Heroku)         |
| `npm run dev`        | Run both frontend & backend concurrently |
| `npm run dev:server` | Run backend only (nodemon)               |
| `npm run dev:client` | Run frontend only (React)                |
| `npm run build`      | Build React app for production           |
| `npm test`           | Run tests                                |

---

## 🔌 Socket Events

| Event          | Direction       | Description                      |
| -------------- | --------------- | -------------------------------- |
| `JOIN`         | Client → Server | User joins a room                |
| `JOINED`       | Server → Client | Notify all users about new user  |
| `CODE_CHANGE`  | Client ↔ Server | Sync code changes                |
| `SYNC_CODE`    | Server → Client | Send existing code to new user   |
| `LEAVE`        | Client → Server | User manually leaves room        |
| `DISCONNECTED` | Server → Client | Notify users about disconnection |

---

## 🐛 Troubleshooting

### WebSocket Connection Failed

**Problem**: `WebSocket connection to 'ws://localhost:4000' failed`

**Solution**:

1. Ensure backend is running: `npm run dev:server`
2. Check `.env` file has correct `REACT_APP_BACKEND_URL`
3. Restart React app: `npm run dev:client`

### CORS Error

**Problem**: `Access to XMLHttpRequest blocked by CORS policy`

**Solution**:

```javascript
// server/index.js
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:3000", "https://your-frontend.vercel.app"],
    credentials: true,
  },
});
```

### Railway Deployment Issues

**Problem**: Server not listening

**Solution**:

```javascript
// Bind to 0.0.0.0 for Railway
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**

- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

---

## 📸 Screenshots

### Home Page

![Home Page](screenshots/home.png)

### Editor Room

![Editor Room](screenshots/editor.png)

### Multiple Users

![Multiple Users](screenshots/collaboration.png)

---

⭐ **Star this repo if you found it helpful!**

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
