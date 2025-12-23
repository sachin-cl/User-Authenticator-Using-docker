import React, { useState, useEffect } from "react";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // 🔹 ADDED
  const [users, setUsers] = useState([]);

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

  // ---------------- FETCH PROFILE ----------------
  async function fetchProfile(token) {
    try {
      const res = await fetch(`${backendUrl}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) return setMessage("Failed to load profile");

      setProfile(data);
    } catch {
      setMessage("Profile request failed");
    }
  }

  // 🔹 ADDED: FETCH USERS (ADMIN ONLY)
  async function fetchUsers() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${backendUrl}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error || "Failed to fetch users");
        return;
      }

      setUsers(data);
    } catch {
      setMessage("User fetch failed");
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
      if (!res.ok) return setMessage(data.error || "Registration failed");

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
      if (!res.ok) return setMessage(data.error || "Login failed");

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
    setUsers([]);
    setEmail("");
    setPassword("");
    setMessage("");
  }

  // ===================== ADMIN DASHBOARD =====================
  if (isLoggedIn && profile?.role === "admin") {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at top, #0f2027, #000)",
          color: "#eaeaea",
          fontWeight: "bold",
        }}
      >
        {/* NAVBAR */}
        <div
          style={{
            background: "linear-gradient(90deg, #141e30, #243b55)",
            padding: "18px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>🛠 Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        <div style={{ padding: "40px", maxWidth: "800px" }}>
          {/* PROFILE */}
          <div
            style={{
              background: "linear-gradient(145deg, #151925, #1c2230)",
              padding: "25px",
              borderRadius: "14px",
              marginBottom: "30px",
            }}
          >
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Role:</strong> ADMIN</p>
          </div>

          {/* ADMIN CONTROLS */}
          <div
            style={{
              background: "linear-gradient(145deg, #151925, #1c2230)",
              padding: "25px",
              borderRadius: "14px",
            }}
          >
            <h3>Admin Controls</h3>

            {/* 🔹 MANAGE USERS BUTTON */}
            <button
              onClick={fetchUsers}
              style={{
                marginTop: "15px",
                marginBottom: "20px",
                padding: "10px 16px",
                backgroundColor: "#3498db",
                color: "white",
                border: "none",
                borderRadius: "6px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Manage Users
            </button>

            {/* 🔹 USERS LIST */}
            {users.length > 0 && (
              <div>
                <h4>Registered Users</h4>
                {users.map((u) => (
                  <div
                    key={u.id}
                    style={{
                      padding: "8px 0",
                      borderBottom: "1px solid #333",
                    }}
                  >
                    {u.email} — <strong>{u.role}</strong>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ===================== USER DASHBOARD =====================
  if (isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          background: "radial-gradient(circle at top, #1b1f2a, #0d0f17)",
          fontWeight: "bold",
          color: "#eaeaea",
        }}
      >
        <div
          style={{
            background: "linear-gradient(90deg, #0f2027, #203a43, #2c5364)",
            padding: "18px 30px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0 }}>Dashboard</h2>
          <button
            onClick={handleLogout}
            style={{
              backgroundColor: "#ff4d4f",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: "6px",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>

        {profile ? (
          <div style={{ padding: "40px", maxWidth: "700px" }}>
            <div
              style={{
                background: "linear-gradient(145deg, #151925, #1c2230)",
                padding: "25px",
                borderRadius: "14px",
                marginBottom: "30px",
              }}
            >
              <p><strong>Email:</strong> {profile.email}</p>
              <p><strong>Role:</strong> {profile.role}</p>
            </div>

            <div
              style={{
                background: "linear-gradient(145deg, #151925, #1c2230)",
                padding: "25px",
                borderRadius: "14px",
              }}
            >
              <p>✔ Authentication Status: AUTHENTICATED</p>
              <p>✔ JWT Session: ACTIVE</p>
              <p>✔ Role-based Access Control</p>
            </div>
          </div>
        ) : (
          <p style={{ padding: "30px" }}>Loading profile...</p>
        )}
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
