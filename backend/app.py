from flask import Flask, request, jsonify
from flask_jwt_extended import (
    JWTManager,
    create_access_token,
    jwt_required,
    get_jwt_identity,
    get_jwt
)
from flask_cors import CORS
import mysql.connector
import bcrypt
import os

app = Flask(__name__)
CORS(app)

# ---------------- JWT CONFIG ----------------
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY", "super-secret-key")
app.config["JWT_TOKEN_LOCATION"] = ["headers"]
app.config["JWT_HEADER_NAME"] = "Authorization"
app.config["JWT_HEADER_TYPE"] = "Bearer"

jwt = JWTManager(app)

# ---------------- DB CONNECTION (SAFE) ----------------
def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "mysql-db"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "student@123"),
        database=os.getenv("DB_NAME", "authdb")
    )

# ---------------- HEALTH CHECK ----------------
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "Backend is healthy"}), 200

# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password required"}), 400

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT id FROM users WHERE email=%s", (email,))
    if cursor.fetchone():
        return jsonify({"error": "User already exists"}), 409

    hashed_password = bcrypt.hashpw(
        password.encode(), bcrypt.gensalt()
    ).decode()

    cursor.execute(
        "INSERT INTO users (email, password, role) VALUES (%s, %s, %s)",
        (email, hashed_password, "user")
    )
    db.commit()

    return jsonify({"message": "User registered"}), 201

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data:
        return jsonify({"error": "Invalid JSON"}), 400

    email = data.get("email")
    password = data.get("password")

    db = get_db()
    cursor = db.cursor(dictionary=True)

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        return jsonify({"error": "Invalid credentials"}), 401

    if not bcrypt.checkpw(password.encode(), user["password"].encode()):
        return jsonify({"error": "Invalid credentials"}), 401

    # ✅ JWT CORRECT: identity MUST be a string
    token = create_access_token(
        identity=user["email"],
        additional_claims={"role": user["role"]}
    )

    return jsonify({
        "message": "Login successful",
        "access_token": token
    }), 200

# ---------------- PROFILE (PROTECTED) ----------------
@app.route("/profile", methods=["GET"])
@jwt_required()
def profile():
    email = get_jwt_identity()      # string
    claims = get_jwt()              # extra data
    role = claims.get("role")

    return jsonify({
        "email": email,
        "role": role
    }), 200

# ---------------- ADMIN (ROLE PROTECTED) ----------------
@app.route("/admin", methods=["GET"])
@jwt_required()
def admin():
    claims = get_jwt()
    if claims.get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    return jsonify({"message": "Welcome Admin"}), 200

# ---------------- START ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
