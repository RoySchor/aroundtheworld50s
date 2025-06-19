import React, { useState } from "react";
import PropTypes from "prop-types";
import "./AdminLogin.css";

const AdminLogin = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return hash.toString();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const envPassword = process.env.REACT_APP_ADMIN_PASSWORD;

    if (!envPassword) {
      setError(
        "Admin access not configured. Please contact the administrator.",
      );
      setIsLoading(false);
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 500));

    // Compare hashed passwords for basic security
    const hashedInput = simpleHash(password);
    const hashedEnv = simpleHash(envPassword);

    if (hashedInput === hashedEnv) {
      // Store authentication in session storage
      sessionStorage.setItem("adminAuthenticated", "true");
      sessionStorage.setItem("authTimestamp", Date.now().toString());
      onLogin(true);
    } else {
      setError("Invalid password. Please try again.");
      setPassword("");
    }

    setIsLoading(false);
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <h1 className="admin-login-title">🔐 Admin Access</h1>
          <p className="admin-login-subtitle">
            Enter the password to access the blog generator
          </p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-login-field">
            <label htmlFor="password" className="admin-login-label">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="admin-login-input"
              placeholder="Enter admin password"
              required
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="admin-login-error">
              <span className="admin-login-error-icon">⚠️</span>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="admin-login-button"
            disabled={isLoading || !password.trim()}
          >
            {isLoading ? (
              <>
                <span className="admin-login-spinner"></span>
                Authenticating...
              </>
            ) : (
              <>
                <span className="admin-login-button-icon">🚀</span>
                Access Admin Panel
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <small className="admin-login-help">
            💡 Your session will remain active for 12 hours
          </small>
        </div>
      </div>
    </div>
  );
};

AdminLogin.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default AdminLogin;
