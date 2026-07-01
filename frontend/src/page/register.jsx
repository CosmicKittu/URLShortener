import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function Register() {
  const [formdata, setFormdata] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
  });
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

  const handleChange = (e) => {
    setFormdata({ ...formdata, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (formdata.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/auth/register`, formdata);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("username", res.data.username || formdata.username);
      navigate("/dash");
    } catch (err) {
      console.error("Registration error:", err);
      if (!err.response) {
        setError("Network error: Unable to connect to the backend server. Please verify it is running.");
      } else {
        const msg = err.response.data?.message || "";
        // Map backend errors
        if (msg.toLowerCase().includes("email already exist")) {
          setError("This email address is already registered. Try logging in instead.");
        } else if (msg.toLowerCase().includes("username already exist")) {
          // Note backend controller has a bug where it returns "email already exist" even when username is taken! 
          // (Let's check backend auth.js lines 24-30: it finds by username, but returns "email already exist").
          // Since the backend returns "email already exist" for duplicate username as well, we should show a message 
          // mentioning email or username is already taken. Let's make it robust!
          setError("This email or username is already registered. Please check or try logging in.");
        } else if (msg.toLowerCase().includes("somthing is missing")) {
          setError("All fields are required. Please fill in all information.");
        } else {
          setError(msg || "Failed to create account. Please try again.");
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
          <h2>Create Account</h2>
          <p>Get started with smart link sharing</p>
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
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              className="form-control"
              placeholder="e.g. Priyanshu"
              value={formdata.name}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              className="form-control"
              placeholder="e.g. user@domain.com"
              value={formdata.email}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              name="username"
              id="username"
              className="form-control"
              placeholder="e.g. kittu"
              value={formdata.username}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              className="form-control"
              placeholder="Min. 6 characters"
              value={formdata.password}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: "0.5rem" }} disabled={loading}>
            {loading ? <span className="spinner"></span> : "Sign Up"}
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
