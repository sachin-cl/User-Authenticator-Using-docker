User-Authenticator-Using-docker-

A full-stack user authentication application built with Flask (Python), MySQL, and React, all containerized using Docker & Docker Compose.
This project demonstrates a clean, modular approach to building and deploying modern authentication systems.

🚀 Features
🔐 Authentication

User Registration

Secure Login

Password Hashing

JSON Web Token (JWT) based authentication

Session persistence

🧩 Tech Stack
Frontend

React (Vite or CRA)

Axios for API calls

Responsive UI

Backend

Flask (Python)

Flask-CORS

JWT Authentication

MySQL Database Integration

Infrastructure

Docker

Docker Compose

Multi-container setup (frontend, backend, db)

🗂️ Project Structure
User-Authenticator-Using-docker-/
│
├── backend/
│   ├── app.py
│   ├── Dockerfile
│   ├── requirements.txt
│   └── ...other backend files
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── package.json
│   └── ...other frontend files
│
├── docker-compose.yml
└── README.md

🐳 Run the Project Using Docker

Make sure Docker Desktop is installed.

1️⃣ Build + Start all services
docker-compose up --build

2️⃣ Access the app

Frontend: http://localhost:3000

Backend API: http://localhost:5000

MySQL: localhost:3306

🔌 API Endpoints
POST /register

Registers a new user.

POST /login

Logs in a user and returns a JWT token.

GET /protected

A protected route accessible only with a valid JWT.

🛠️ Environment Variables

Create a .env file inside backend:

MYSQL_HOST=db
MYSQL_USER=root
MYSQL_PASSWORD=yourpassword
MYSQL_DB=authdb
SECRET_KEY=your_secret_key


For frontend .env:

VITE_API_URL=http://localhost:5000

🎯 Why This Project Is Useful

This project teaches:

Full-stack development

JWT authentication

Connecting React → Flask → MySQL

Dockerizing multiple services

Production-style folder structure

Perfect for portfolio, internships, or learning scalable apps.

📌 Future Improvements

Add refresh tokens

Add role-based access

Add email verification

Deploy to AWS / Render

Add CI/CD pipeline

👤 Author

Sachin (sachin-cl)
Flask | React | Docker | Full-Stack Developer

Want me to:

✅ Add screenshots?
✅ Add installation steps without Docker?
✅ Add badges (Docker, React, Flask, etc.)?
Just tell me — I’ll customize it fully.
