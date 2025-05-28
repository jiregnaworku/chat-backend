# Chat Backend API

A real-time chat backend built with **Node.js**, **Express**, **MongoDB**, and **Socket.IO** to support user registration, login, and instant messaging.

---

## Features

- User Registration and Login with JWT authentication
- MongoDB integration for persistent user and message storage
- Real-time chat functionality using Socket.IO
- Clean REST API endpoints for authentication and messaging
- Ready to deploy on cloud services like Render

---

## Tech Stack

- **Node.js** (v18+)
- **Express.js** (Web framework)
- **MongoDB** (Database)
- **Mongoose** (MongoDB ORM)
- **Socket.IO** (Real-time communication)
- **JSON Web Tokens (JWT)** (Authentication)
- **dotenv** (Environment variables)

---

## Getting Started

### Prerequisites

- Node.js installed ([Download](https://nodejs.org/))
- MongoDB instance (local or cloud, e.g., [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- Git installed ([Download](https://git-scm.com/))

### Installation

1. Clone the repository

```bash
git clone https://github.com/jiregnaworku/chat-backend.git
cd chat-backend
Install dependencies


npm install
Create a .env file in the root directory and add the following environment variables:


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
Start the server


npm start
The server should be running at http://localhost:5000

API Endpoints
Auth
Method	Endpoint	Description
POST	/api/auth/register	Register new user
POST	/api/auth/login	Login and get JWT token

Messages
Method	Endpoint	Description
GET	/api/messages/:userId	Get messages for user
POST	/api/messages	Send a new message

Socket.IO Events
sendMessage: Client emits to send a new message.

receiveMessage: Server emits when a message is received.

Deployment
You can deploy this backend easily on Render or any other cloud provider.

Example Render configuration:

Branch: main

Build Command: npm install

Start Command: node server.js

Environment Variables: Set your .env values in Render dashboard

Contributing
Contributions are welcome! Feel free to open issues or submit pull requests.



Contact
For questions or support, contact jiregnaworku.
