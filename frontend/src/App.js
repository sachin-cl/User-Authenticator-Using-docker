import React, { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // ---------------- CHECK TOKEN ON LOAD ----------------
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
      fetchProfile(token);
    }
  }, []);

  // ---------------- FETCH PROFILE (JWT PROTECTED) ----------------
  async function fetchProfile(token) {
    try {
      const res = await fetch(`${backendUrl}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      let data;
      try {
        data = await res.json();
      } catch {
        setMessage("Invalid profile response");
        return;
      }

      if (!res.ok) {
        console.error("PROFILE ERROR:", data);
        setMessage("Failed to load profile");
        return; // ❌ DO NOT LOGOUT
      }

      setProfile(data);
    } catch (err) {
      console.error("PROFILE FETCH FAILED:", err);
      setMessage("Profile request failed");
    }
  }

  // ---------------- REGISTER ----------------
  async function handleRegister() {
    try {
      const res = await fetch(`${backendUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Registration failed");
        return;
      }

      setMessage(data.message);
    } catch {
      setMessage("Error connecting to server");
    }
  }

  // ---------------- LOGIN ----------------
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
        return;
      }

      localStorage.setItem("token", data.access_token);
      setIsLoggedIn(true);
      setMessage("");
      fetchProfile(data.access_token);
    } catch {
      setMessage("Error connecting to server");
    }
  }

  // ---------------- LOGOUT ----------------
  function handleLogout() {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setProfile(null);
    setEmail("");
    setPassword("");
    setMessage("");
  }

  // ===================== DASHBOARD =====================
  if (isLoggedIn) {
    return (
      <div style={{ maxWidth: "400px", margin: "50px auto" }}>
        <h2>Dashboard</h2>

        {profile ? (
          <>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> {profile.role}</p>
          </>
        ) : (
          <p>Loading profile...</p>
        )}

        <p style={{ color: "blue" }}>{message}</p>

        <button onClick={handleLogout} style={{ marginTop: "20px" }}>
          Logout
        </button>
      </div>
    );
  }

  // ===================== LOGIN PAGE =====================
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

      <button
        onClick={handleRegister}
        style={{ width: "100%", padding: "10px" }}
      >
        Register
      </button>

      <p style={{ marginTop: "20px", color: "blue" }}>{message}</p>
    </div>
  );
}

export default App;
