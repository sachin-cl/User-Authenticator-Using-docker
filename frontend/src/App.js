import React, { useState } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // Use environment variable for backend URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || "http://backend:5000";

  async function handleRegister() {
    try {
      const res = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      setMessage("Error connecting to server");
    }
  }

  async function handleLogin() {
    try {
      const res = await fetch(`${backendUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Login failed");
      } else {
        setMessage(data.message || "Login successful");
      }
    } catch (err) {
      setMessage("Error connecting to server");
    }
  }

  return (
    <div style={{ maxWidth: "400px", margin: "50px auto" }}>
      <h2>User Authenticator</h2>

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      />

      <button
        onClick={handleLogin}
        style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
      >
        Login
      </button>

      <button onClick={handleRegister} style={{ width: "100%", padding: "10px" }}>
        Register
      </button>

      <p style={{ marginTop: "20px", color: "blue" }}>{message}</p>
    </div>
  );
}

export default App;
