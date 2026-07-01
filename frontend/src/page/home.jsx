import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="container">
      {/* Premium Header */}
      <header style={{
        display: "flex", 
        justifyContent: "space-between", 
        alignItems: "center", 
        padding: "1.5rem 0",
        borderBottom: "1px solid var(--border-color)"
      }}>
        <div className="brand">
          <span className="brand-dot"></span> CosmicShort
        </div>
        <nav style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
          {isLoggedIn ? (
            <Link to="/dash" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
              Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ padding: "0.5rem 1.25rem" }}>
                Get Started
              </Link>
            </>
          )}
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="brand-badge">⚡ Instant Redirection & Caching</div>
        <h1 className="hero-title">
          Shorten. Brand. Track. <br />
          <span style={{ color: "var(--primary)" }}>In Real-Time.</span>
        </h1>
        <p className="hero-subtitle">
          Create clean, custom, and memorable links in seconds. Trace analytics instantly with Redis-backed caching and detailed click insights.
        </p>
        <div className="hero-actions">
          {isLoggedIn ? (
            <Link to="/dash" className="btn btn-primary btn-accent">
              Open Dashboard
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Create Free Account
              </Link>
              <Link to="/login" className="btn btn-secondary">
                Sign In
              </Link>
            </>
          )}
        </div>

        {/* Features Grid */}
        <div className="features-grid">
          {/* Card 1 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path>
              </svg>
            </div>
            <h3>Custom Aliases</h3>
            <p>Define custom aliases to make your links fully branded, readable, and highly clickable for your audience.</p>
          </div>

          {/* Card 2 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10"></line>
                <line x1="12" y1="20" x2="12" y2="4"></line>
                <line x1="6" y1="20" x2="6" y2="14"></line>
              </svg>
            </div>
            <h3>Real-Time Analytics</h3>
            <p>Monitor metrics and track total click counts instantly using our high-performance Redis caching layer.</p>
          </div>

          {/* Card 3 */}
          <div className="feature-card glass-panel">
            <div className="feature-icon-wrapper">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3>Secure Storage</h3>
            <p>Organize all your created links securely in your personal account space with full access history.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{
        textAlign: "center",
        padding: "2rem 0",
        color: "var(--text-muted)",
        fontSize: "0.85rem",
        borderTop: "1px solid var(--border-color)",
        marginTop: "auto"
      }}>
        &copy; {new Date().getFullYear()} CosmicShort. Powered by AWS, Redis, and React.
      </footer>
    </div>
  );
}