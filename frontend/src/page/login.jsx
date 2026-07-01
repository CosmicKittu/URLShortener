import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // If already logged in, redirect to dashboard
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dash");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Prepare payload depending on whether identifier is email or username
    const payload = { password };
    if (identifier.includes("@")) {
      payload.email = identifier.trim();
    } else {
      payload.username = identifier.trim();
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/login`, payload);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username || "");
      navigate("/dash");
    } catch (err) {
      console.error("Login error:", err);
      if (!err.response) {
        setError("Network error: Unable to connect to the backend server. Please verify it is running.");
      } else {
        const msg = err.response.data?.message || "";
        // Map backend errors to cleaner descriptions
        if (msg.toLowerCase().includes("password did not match") || msg.toLowerCase().includes("invalid credentials")) {
          setError("Incorrect password or username. Please check your credentials and try again.");
        } else if (msg.toLowerCase().includes("provide email or username")) {
          setError("Please enter your username or email address.");
        } else {
          setError(msg || "An unexpected error occurred during login. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <div className="brand" style={{ justifyContent: "center", marginBottom: "1rem" }}>
            <span className="brand-dot"></span> CosmicShort
          </div>
          <h2>Welcome Back</h2>
          <p>Login to manage your shortened links</p>
        </div>

        {error && (
          <div className="alert alert-danger">
            <span className="alert-icon">⚠️</span>
            <div className="alert-content">{error}</div>
            <button className="alert-close" onClick={() => setError("")}>&times;</button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="identifier">Username or Email</label>
            <input
              type="text"
              id="identifier"
              className="form-control"
              placeholder="e.g. kittu or kitty@domain.com"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create one</Link>
        </div>
      </div>
    </div>
  );
}
