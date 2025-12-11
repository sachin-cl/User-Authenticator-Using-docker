from flask import Flask, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import mysql.connector
import time

app = Flask(__name__)
CORS(app)

# Wait until MySQL is ready
while True:
    try:
        db = mysql.connector.connect(
            host="mysql-db",
            user="root",
            password="student@123",
            database="authdb"
        )
        print("Connected to MySQL")
        break
    except:
        print("Waiting for MySQL...")
        time.sleep(2)

cursor = db.cursor(dictionary=True)

@app.post("/register")
def register():
    data = request.json
    email = data["email"]
    password = generate_password_hash(data["password"])

    try:
        cursor.execute(
            "INSERT INTO users (email, password) VALUES (%s, %s)",
            (email, password)
        )
        db.commit()
        return {"message": "User registered"}

    except:
        return {"error": "Email already exists"}, 400


@app.post("/login")
def login():
    data = request.json
    email = data["email"]
    password = data["password"]

    cursor.execute("SELECT * FROM users WHERE email=%s", (email,))
    user = cursor.fetchone()

    if not user:
        return {"error": "User not found"}, 400

    if not check_password_hash(user["password"], password):
        return {"error": "Wrong password"}, 400

    return {"message": "Login successful"}


@app.get("/")
def home():
    return {"status": "Backend running with MySQL"}


app.run(host="0.0.0.0", port=5000)
