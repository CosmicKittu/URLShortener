import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../config";

export default function Dash() {
  const [shortAurl, setShortAurl] = useState({
    originalUrl: "",
    isCustom: false,
    customAlias: "",
    withUsername: false,
  });
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);
  
  // My URLs list state
  const [myUrls, setMyUrls] = useState([]);
  const [listLoading, setListLoading] = useState(false);
  const [listError, setListError] = useState("");

  // Stats Modal state
  const [statsData, setStatsData] = useState(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [statsError, setStatsError] = useState("");
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [activeShortCode, setActiveShortCode] = useState("");

  // Toast notifications state
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";

  // Check authentication & load user URLs
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMyUrls();
  }, [navigate]);

  // Fetch My URLs from API
  const fetchMyUrls = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;

    setListLoading(true);
    setListError("");
    try {
      const res = await axios.get(`${API_URL}/api/urls/my`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setMyUrls(res.data.data || []);
    } catch (err) {
      console.error("Failed to fetch URLs:", err);
      setListError("Could not retrieve your links. Make sure the backend service is running.");
    } finally {
      setListLoading(false);
    }
  };

  // Fetch Statistics for specific Short Code
  const handleViewStats = async (shortCode) => {
    setActiveShortCode(shortCode);
    setStatsLoading(true);
    setStatsError("");
    setStatsData(null);
    setShowStatsModal(true);

    try {
      const res = await axios.get(`${API_URL}/api/urls/${shortCode}/stats`);
      setStatsData(res.data.data);
    } catch (err) {
      console.error("Failed to fetch stats:", err);
      setStatsError(err.response?.data?.message || "Failed to load click stats.");
    } finally {
      setStatsLoading(false);
    }
  };

  const handleUrlshort = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setShortAurl((prev) => ({ ...prev, [name]: checked }));
    } else {
      setShortAurl((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    triggerToast("Link copied to clipboard!");
  };

  const handleshort = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setShortUrl("");
    setLoading(true);

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    // Basic URL validation
    let urlToShorten = shortAurl.originalUrl.trim();
    if (!/^https?:\/\//i.test(urlToShorten)) {
      urlToShorten = "http://" + urlToShorten;
    }

    const data = {
      originalUrl: urlToShorten,
      withUsername: shortAurl.withUsername,
    };
    if (shortAurl.isCustom && shortAurl.customAlias.trim()) {
      data.customAlias = shortAurl.customAlias.trim();
    }

    try {
      const res = await axios.post(`${API_URL}/api/urls/shorten`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShortUrl(res.data.data.shortUrl);
      setSuccessMsg("Link shortened successfully!");
      triggerToast("Short URL created!");
      
      // Reset form options
      setShortAurl({
        originalUrl: "",
        isCustom: false,
        customAlias: "",
        withUsername: false,
      });

      // Refresh list to show newly created URL
      fetchMyUrls();
    } catch (err) {
      console.error("Shorten error:", err);
      if (!err.response) {
        setError("Network error: Could not reach shortening server.");
      } else {
        const msg = err.response.data?.message || "";
        if (msg.toLowerCase().includes("short code already exists")) {
          setError("This custom alias is already in use. Please select a different one.");
        } else if (msg.toLowerCase().includes("original url is required")) {
          setError("Please enter a valid destination URL.");
        } else {
          setError(msg || "Failed to create short URL. Please try again.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">
      {/* Navbar */}
      <nav className="navbar">
        <div className="container navbar-container">
          <div className="brand">
            <span className="brand-dot"></span> CosmicShort
          </div>
          <div className="nav-user">
            <div className="user-badge">
              <span className="user-avatar">{username[0].toUpperCase()}</span>
              <span style={{ fontWeight: 500 }}>{username}</span>
            </div>
            <button onClick={handleLogout} className="btn btn-secondary btn-danger" style={{ padding: "0.4rem 1rem", fontSize: "0.85rem" }}>
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main dashboard body */}
      <main className="dashboard-main container">
        <div className="dashboard-grid">
          
          {/* Left Column: Shortener Console */}
          <div className="dash-card glass-panel">
            <h2 className="dash-card-title">Shorten a Link</h2>
            
            {error && (
              <div className="alert alert-danger">
                <span className="alert-icon">⚠️</span>
                <div className="alert-content">{error}</div>
                <button className="alert-close" onClick={() => setError("")}>&times;</button>
              </div>
            )}

            {successMsg && (
              <div className="alert alert-success">
                <span className="alert-icon">✅</span>
                <div className="alert-content">{successMsg}</div>
                <button className="alert-close" onClick={() => setSuccessMsg("")}>&times;</button>
              </div>
            )}

            <form onSubmit={handleshort}>
              <div className="form-group">
                <label htmlFor="originalUrl">Destination URL</label>
                <input
                  type="text"
                  id="originalUrl"
                  name="originalUrl"
                  className="form-control"
                  placeholder="Paste a long URL (e.g. google.com)"
                  value={shortAurl.originalUrl}
                  onChange={handleUrlshort}
                  required
                  disabled={loading}
                />
              </div>

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="isCustom"
                  name="isCustom"
                  checked={shortAurl.isCustom}
                  onChange={handleUrlshort}
                  disabled={loading}
                />
                <label htmlFor="isCustom">Custom Alias</label>
              </div>

              {shortAurl.isCustom && (
                <div className="form-group" style={{ animation: "slideUp var(--transition-fast)" }}>
                  <label htmlFor="customAlias">Your Custom Alias</label>
                  <input
                    type="text"
                    id="customAlias"
                    name="customAlias"
                    className="form-control"
                    placeholder="e.g. my-cool-link"
                    value={shortAurl.customAlias}
                    onChange={handleUrlshort}
                    required={shortAurl.isCustom}
                    disabled={loading}
                  />
                </div>
              )}

              <div className="checkbox-group">
                <input
                  type="checkbox"
                  id="withUsername"
                  name="withUsername"
                  checked={shortAurl.withUsername}
                  onChange={handleUrlshort}
                  disabled={loading}
                />
                <label htmlFor="withUsername">Include Username Prefix</label>
              </div>

              <button type="submit" className="btn btn-primary" style={{ width: "100%", marginTop: "0.5rem" }} disabled={loading}>
                {loading ? <span className="spinner"></span> : "Shorten URL"}
              </button>
            </form>

            {shortUrl && (
              <div className="success-link-box">
                <div className="success-link-title">Your Shortened URL:</div>
                <div className="success-link-body">
                  <span className="success-link-url">{shortUrl}</span>
                  <button 
                    onClick={() => handleCopy(shortUrl)} 
                    className="btn btn-icon"
                    title="Copy to Clipboard"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                      <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: URLs List */}
          <div className="dash-card glass-panel" style={{ flexGrow: 1 }}>
            <div className="url-list-header">
              <h2 style={{ fontSize: "1.25rem" }}>My Links</h2>
              <button 
                onClick={fetchMyUrls} 
                className="btn btn-secondary" 
                style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                disabled={listLoading}
              >
                {listLoading ? <span className="spinner" style={{ width: "0.8rem", height: "0.8rem" }}></span> : "Refresh"}
              </button>
            </div>

            {listError && (
              <div className="alert alert-danger">
                <span className="alert-icon">⚠️</span>
                <div className="alert-content">{listError}</div>
              </div>
            )}

            {listLoading && myUrls.length === 0 ? (
              <div className="empty-state">
                <span className="spinner" style={{ width: "2rem", height: "2rem", marginBottom: "1rem" }}></span>
                <p>Loading your shortened links...</p>
              </div>
            ) : myUrls.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon">🔗</div>
                <h3>No shortened links yet</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: "0.25rem" }}>
                  Your shortened links will appear here. Create one on the left panel!
                </p>
              </div>
            ) : (
              <div className="urls-container">
                {myUrls.map((url) => {
                  const baseUrl = API_URL;
                  const finalShortUrl = url.withUsername 
                    ? `${baseUrl}/username/${url.shortCode}`
                    : `${baseUrl}/${url.shortCode}`;
                  
                  return (
                    <div key={url._id} className="url-row">
                      <div className="url-info">
                        <div className="url-short">
                          {url.shortCode}
                          {url.isCustom && <span className="badge-custom">Alias</span>}
                        </div>
                        <div className="url-original" title={url.originalUrl}>
                          {url.originalUrl}
                        </div>
                        <div className="url-meta">
                          <div className="meta-item">
                            <span>📅 {new Date(url.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div className="meta-item">
                            <span>🖱️ {url.clicks} clicks</span>
                          </div>
                        </div>
                      </div>

                      <div className="url-actions">
                        <button 
                          onClick={() => handleCopy(finalShortUrl)}
                          className="btn btn-secondary"
                          style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                          title="Copy Link"
                        >
                          Copy
                        </button>
                        <button 
                          onClick={() => handleViewStats(url.shortCode)}
                          className="btn btn-primary"
                          style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}
                          title="View Live Analytics"
                        >
                          Stats
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Real-Time Stats Modal (Unused Endpoint Integration) */}
      {showStatsModal && (
        <div className="modal-overlay" onClick={() => setShowStatsModal(false)}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <button className="btn-icon modal-close-btn" onClick={() => setShowStatsModal(false)}>
              &times;
            </button>
            <h3 className="modal-title">
              📊 Analytics for <span style={{ color: "var(--primary)" }}>/{activeShortCode}</span>
            </h3>

            {statsLoading ? (
              <div style={{ textAlign: "center", padding: "3rem" }}>
                <span className="spinner" style={{ width: "2rem", height: "2rem", marginBottom: "1rem" }}></span>
                <p>Retrieving click details from Redis...</p>
              </div>
            ) : statsError ? (
              <div className="alert alert-danger" style={{ margin: "2rem 0" }}>
                <span className="alert-icon">⚠️</span>
                <div className="alert-content">{statsError}</div>
              </div>
            ) : statsData ? (
              <div>
                <div className="stats-grid">
                  <div className="stats-card">
                    <div className="stats-num">{statsData.clicks}</div>
                    <div className="stats-label">Total Clicks</div>
                  </div>
                  <div className="stats-card">
                    <div className="stats-num" style={{ color: "var(--secondary)", fontSize: "1.2rem", height: "2rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {statsData.isCustom ? "Branded" : "Random"}
                    </div>
                    <div className="stats-label">Link Type</div>
                  </div>
                </div>

                <div className="modal-list">
                  <div className="modal-list-item">
                    <div className="modal-list-label">Original URL</div>
                    <div className="modal-list-val" style={{ maxHeight: "70px", overflowY: "auto" }}>
                      <a href={statsData.originalUrl} target="_blank" rel="noreferrer" style={{ wordBreak: "break-all" }}>
                        {statsData.originalUrl}
                      </a>
                    </div>
                  </div>

                  <div className="modal-list-item">
                    <div className="modal-list-label">Short Code</div>
                    <div className="modal-list-val">{statsData.shortCode}</div>
                  </div>

                  <div className="modal-list-item">
                    <div className="modal-list-label">Created At</div>
                    <div className="modal-list-val">
                      {new Date(statsData.createdAt).toLocaleString()}
                    </div>
                  </div>

                  <div className="modal-list-item">
                    <div className="modal-list-label">Expiration Date</div>
                    <div className="modal-list-val">
                      {statsData.expiresAt ? new Date(statsData.expiresAt).toLocaleString() : "Permanent (No Expiry)"}
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "2rem", display: "flex", justifyContent: "flex-end" }}>
                  <button onClick={() => setShowStatsModal(false)} className="btn btn-secondary">
                    Close Window
                  </button>
                </div>
              </div>
            ) : (
              <p>No statistics found.</p>
            )}
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast">
            <span style={{ color: "var(--success)" }}>✓</span>
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
}
