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
jwt = JWTManager(app)

# ---------------- DB CONNECTION ----------------
def get_db():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "mysql-db"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASSWORD", "student@123"),
        database=os.getenv("DB_NAME", "authdb")
    )

# ---------------- HEALTH ----------------
@app.route("/health")
def health():
    return jsonify({"status": "Backend healthy"}), 200

# ---------------- REGISTER ----------------
@app.route("/register", methods=["POST"])
def register():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email & password required"}), 400

    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("SELECT id FROM users WHERE email=%s", (email,))
    if cur.fetchone():
        return jsonify({"error": "User already exists"}), 409

    hashed = bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

    cur.execute(
        "INSERT INTO users (email, password, role) VALUES (%s, %s, 'user')",
        (email, hashed)
    )
    db.commit()

    return jsonify({"message": "User registered"}), 201

# ---------------- LOGIN ----------------
@app.route("/login", methods=["POST"])
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cur.fetchone()

    if not user or not bcrypt.checkpw(password.encode(), user["password"].encode()):
        return jsonify({"error": "Invalid credentials"}), 401

    token = create_access_token(
        identity=user["email"],
        additional_claims={"role": user["role"]}
    )

    return jsonify(access_token=token), 200

# ---------------- PROFILE ----------------
@app.route("/profile")
@jwt_required()
def profile():
    return jsonify({
        "email": get_jwt_identity(),
        "role": get_jwt().get("role")
    }), 200

# ---------------- LIST USERS (ADMIN) ----------------
@app.route("/admin/users")
@jwt_required()
def list_users():
    if get_jwt().get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    db = get_db()
    cur = db.cursor(dictionary=True)
    cur.execute("SELECT id, email, role FROM users")
    return jsonify(cur.fetchall()), 200

# ---------------- UPDATE ROLE ----------------
@app.route("/admin/users/<int:user_id>/role", methods=["PUT"])
@jwt_required()
def update_role(user_id):
    if get_jwt().get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    admin_email = get_jwt_identity()
    new_role = request.get_json().get("role")

    if new_role not in ["admin", "user"]:
        return jsonify({"error": "Invalid role"}), 400

    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("SELECT email FROM users WHERE id=%s", (user_id,))
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["email"] == admin_email:
        return jsonify({"error": "Cannot change your own role"}), 400

    cur.execute("UPDATE users SET role=%s WHERE id=%s", (new_role, user_id))
    db.commit()

    return jsonify({"message": "Role updated"}), 200

# ---------------- DELETE USER ----------------
@app.route("/admin/users/<int:user_id>", methods=["DELETE"])
@jwt_required()
def delete_user(user_id):
    if get_jwt().get("role") != "admin":
        return jsonify({"error": "Admins only"}), 403

    admin_email = get_jwt_identity()

    db = get_db()
    cur = db.cursor(dictionary=True)

    cur.execute("SELECT email FROM users WHERE id=%s", (user_id,))
    user = cur.fetchone()

    if not user:
        return jsonify({"error": "User not found"}), 404

    if user["email"] == admin_email:
        return jsonify({"error": "Cannot delete your own account"}), 400

    cur.execute("DELETE FROM users WHERE id=%s", (user_id,))
    db.commit()

    return jsonify({"message": "User deleted"}), 200

# ---------------- START ----------------
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
