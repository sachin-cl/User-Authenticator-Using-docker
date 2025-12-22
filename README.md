User Authenticator Using Docker

A full-stack authentication system built with React, Flask, JWT, and MySQL, fully containerized using Docker Compose.
The application supports user registration, login, JWT-based authentication, protected dashboard access, and role-based authorization.

🚀 Features

✅ User Registration & Login

🔐 JWT-based Authentication

🛡️ Protected Backend Routes

📊 Protected Frontend Dashboard

👤 Role-based Access (User / Admin)

🐳 Dockerized Backend, Frontend & Database

🔁 Persistent MySQL Database using Docker Volumes

🧱 Tech Stack
Frontend

React

JavaScript

Fetch API

Backend

Flask

Flask-JWT-Extended

Flask-CORS

bcrypt (password hashing)

Database

MySQL 5.7

DevOps / Tools

Docker

Docker Compose

Git & GitHub

🔄 Application Flow

User registers with email & password

Password is securely hashed using bcrypt

User logs in → backend generates JWT

JWT is stored on the client

Frontend uses JWT to access protected routes

Dashboard is accessible only when authenticated

Role-based authorization controls admin access

🔐 JWT Authentication

JWT identity stores the user email (string)

User role is stored as additional JWT claims

Protected backend routes require valid JWT

Frontend dashboard is protected using JWT state
