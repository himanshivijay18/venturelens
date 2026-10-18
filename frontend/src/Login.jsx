
import React, { useState, useEffect } from "react";
import "./Login.css";

export default function Login({
  initialMode = "signup",
  initialRole = "startup",
  onBack,
  onSuccess,
}) {
  const [authMode, setAuthMode] = useState(initialMode);
  const [role, setRole] = useState(initialRole);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    fullName: "",
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    rememberMe: false,
  });

  useEffect(() => {
    setAuthMode(initialMode);
    setRole(initialRole);
    setErrorMessage("");
  }, [initialMode, initialRole]);

  const handleRoleChange = (selectedRole) => {
    setRole(selectedRole);
    setErrorMessage("");

    if (selectedRole === "admin") {
      setAuthMode("login");
    }
  };

  const isSignUp = authMode === "signup" && role !== "admin";

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrorMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    setErrorMessage("");

    if (isSignUp && formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    if (role === "admin") {
      setErrorMessage("Admin login will be connected later.");
      return;
    }

    let url = "";
    let requestData = {};

    // STARTUP API
    if (role === "startup") {
      url = isSignUp
        ? "http://localhost:8085/startup/register"
        : "http://localhost:8085/startup/login";

      requestData = isSignUp
        ? {
            founderName: formData.fullName,
            companyName: formData.companyName,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };
    }

    // INVESTOR API
    else if (role === "investor") {
      url = isSignUp
        ? "http://localhost:8085/investor/register"
        : "http://localhost:8085/investor/login";

      requestData = isSignUp
        ? {
            investorName: formData.fullName,
            firmName: formData.companyName,
            email: formData.email,
            password: formData.password,
          }
        : {
            email: formData.email,
            password: formData.password,
          };
    }

    try {
      setLoading(true);

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const responseText = await response.text();

      let responseData = responseText;

      try {
        responseData = responseText
          ? JSON.parse(responseText)
          : {};
      } catch {
        // Support plain-text backend responses.
      }

      if (!response.ok) {
        let message =
          typeof responseData === "string"
            ? responseData
            : responseData?.message ||
              `Request failed with status ${response.status}.`;

        if (response.status === 401) {
          message = "Invalid email or password.";
        } else if (response.status === 409) {
          message = "An account with this email already exists.";
        }

        throw new Error(message);
      }

      console.log("API Response:", responseData);

      // REGISTRATION SUCCESS
      if (isSignUp) {
        alert(
          `${role === "startup" ? "Startup" : "Investor"} account created successfully! Please sign in.`
        );

        setAuthMode("login");

        setFormData((prev) => ({
          ...prev,
          password: "",
          confirmPassword: "",
        }));

        return;
      }

      // LOGIN SUCCESS
      alert(
        `${role === "startup" ? "Startup" : "Investor"} login successful!`
      );

      if (onSuccess) {
        onSuccess(role, responseData);
      }
    } catch (error) {
      console.error("Authentication error:", error);

      if (error instanceof TypeError) {
        setErrorMessage(
          "Cannot connect to the backend. Check port 8085 and CORS configuration."
        );
      } else {
        setErrorMessage(
          error.message || "Something went wrong. Please try again."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="glow-bg-1" />
      <div className="glow-bg-2" />

      <div className="login-card">
        <div
          className="brand-header"
          onClick={onBack}
          style={{ cursor: "pointer" }}
        >
          <div className="brand-logo">V</div>
          <span className="brand-name">VentureLens</span>
        </div>

        {role !== "admin" ? (
          <div className="auth-mode-toggle">
            <button
              type="button"
              className={`mode-btn ${!isSignUp ? "active" : ""}`}
              onClick={() => {
                setAuthMode("login");
                setErrorMessage("");
              }}
            >
              Sign In
            </button>

            <button
              type="button"
              className={`mode-btn ${isSignUp ? "active" : ""}`}
              onClick={() => {
                setAuthMode("signup");
                setErrorMessage("");
              }}
            >
              Create Account
            </button>
          </div>
        ) : (
          <div className="admin-badge-notice">
            🔒 Super Admin Authentication Mode
          </div>
        )}

        <div className="header-text">
          <h1>
            {role === "admin" ? (
              <>
                Admin <span>Portal.</span>
              </>
            ) : isSignUp ? (
              <>
                Create <span>account.</span>
              </>
            ) : (
              <>
                Welcome <span>back.</span>
              </>
            )}
          </h1>

          <p>
            {role === "admin"
              ? "Access platform moderation, verification and AI monitoring."
              : isSignUp
              ? `Join VentureLens as ${
                  role === "startup" ? "Startup Founder" : "Investor"
                }.`
              : "Log in to access your AI investment intelligence."}
          </p>
        </div>

        <div className="role-toggle role-toggle-3">
          <button
            type="button"
            className={`role-btn ${role === "startup" ? "active" : ""}`}
            onClick={() => handleRoleChange("startup")}
          >
            Startup
          </button>

          <button
            type="button"
            className={`role-btn ${role === "investor" ? "active" : ""}`}
            onClick={() => handleRoleChange("investor")}
          >
            Investor
          </button>

          <button
            type="button"
            className={`role-btn admin-role-btn ${
              role === "admin" ? "active" : ""
            }`}
            onClick={() => handleRoleChange("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {isSignUp && (
            <>
              <div className="form-group">
                <label htmlFor="fullName">Full Name</label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Alex Morgan"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="companyName">
                  {role === "startup"
                    ? "Startup / Company Name"
                    : "Firm / Fund Name (Optional)"}
                </label>

                <input
                  type="text"
                  id="companyName"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  placeholder={
                    role === "startup"
                      ? "Meridian Robotics"
                      : "Horizon Capital"
                  }
                  required={role === "startup"}
                />
              </div>
            </>
          )}

          <div className="form-group">
            <label htmlFor="email">
              {role === "admin"
                ? "Admin Email"
                : role === "startup"
                ? "Founder / Work Email"
                : "Investor Email"}
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={
                role === "admin"
                  ? "admin@venturelens.com"
                  : "name@company.com"
              }
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••••••"
              required
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {isSignUp && (
            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>

              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="••••••••••••"
                required
                autoComplete="new-password"
              />
            </div>
          )}

          {!isSignUp && (
            <div className="form-extras">
              <a
                href="#forgot"
                className="forgot-link"
                onClick={(e) => {
                  e.preventDefault();
                  setErrorMessage(
                    "Password reset is not connected yet."
                  );
                }}
              >
                Forgot password?
              </a>
            </div>
          )}

          {errorMessage && (
            <p role="alert" className="auth-error">
              {errorMessage}
            </p>
          )}

          <button
            type="submit"
            className={`btn-submit ${
              role === "admin" ? "btn-admin-submit" : ""
            }`}
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : role === "admin"
              ? "Access Admin Console →"
              : isSignUp
              ? `Create ${
                  role === "startup" ? "Startup" : "Investor"
                } Account →`
              : `Sign In as ${
                  role === "startup" ? "Startup" : "Investor"
                } →`}
          </button>
        </form>

        {role !== "admin" && (
          <div className="switch-auth-box">
            <span>
              {isSignUp
                ? "Already have an account?"
                : "Don't have an account?"}
            </span>

            <button
              type="button"
              className="btn-switch-auth"
              onClick={() => {
                setAuthMode(isSignUp ? "login" : "signup");
                setErrorMessage("");
              }}
            >
              {isSignUp ? "Sign In" : "Create Account"}
            </button>
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "1.25rem" }}>
          <button
            type="button"
            onClick={onBack}
            className="back-btn"
          >
            ← Back to Landing Page
          </button>
        </div>
      </div>
    </div>
  );
}