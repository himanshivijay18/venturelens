
import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./Login";
import StartupDashboard from "./StartupDashboard";
import InvestorDashboard from "./InvestorDashboard";
import AdminDashboard from "./AdminDashboard";

export default function App() {
  const getRoute = () => {
    const hash = window.location.hash.toLowerCase();
    const path = window.location.pathname.toLowerCase();

    if (hash.startsWith("#admin") || path === "/admin") return "admin-dashboard";
    if (hash.startsWith("#investor") || path === "/investor") return "investor-dashboard";
    if (hash.startsWith("#dashboard") || path === "/dashboard") return "startup-dashboard";
    if (hash.startsWith("#login") || path === "/login") return "auth";

    return "landing";
  };

  const [currentPage, setCurrentPage] = useState(getRoute);

  const [authConfig, setAuthConfig] = useState({
    mode: "signup",
    role: "startup",
  });

  // Store the logged-in startup's backend data
  const [startupData, setStartupData] = useState(null);

  useEffect(() => {
    const handleUrlChange = () => {
      setCurrentPage(getRoute());
    };

    window.addEventListener("hashchange", handleUrlChange);
    window.addEventListener("popstate", handleUrlChange);

    return () => {
      window.removeEventListener("hashchange", handleUrlChange);
      window.removeEventListener("popstate", handleUrlChange);
    };
  }, []);

  const navigateTo = (path, stateName) => {
    window.history.pushState({}, "", path);
    setCurrentPage(stateName);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openAuth = (mode = "signup", role = "startup") => {
    setAuthConfig({ mode, role });
    navigateTo("/login", "auth");
  };

  // Handle successful login
  const handleLoginSuccess = (role, responseData) => {
    if (role === "startup") {
      setStartupData(responseData);
      navigateTo("/dashboard", "startup-dashboard");
    } else {
      navigateTo("/investor", "investor-dashboard");
    }
  };

  // Admin Dashboard
  if (currentPage === "admin-dashboard") {
    return (
      <AdminDashboard
        onLogout={() => navigateTo("/", "landing")}
      />
    );
  }

  // Investor Dashboard
  if (currentPage === "investor-dashboard") {
    return (
      <InvestorDashboard
        onLogout={() => navigateTo("/", "landing")}
      />
    );
  }

  // Startup Dashboard
  if (currentPage === "startup-dashboard") {
    return (
      <StartupDashboard
        startupData={startupData}
        onLogout={() => {
          setStartupData(null);
          navigateTo("/", "landing");
        }}
      />
    );
  }

  // Login / Sign Up Page
  if (currentPage === "auth") {
    return (
      <Login
        initialMode={authConfig.mode}
        initialRole={authConfig.role}
        onBack={() => navigateTo("/", "landing")}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  // Landing Page
  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div
          className="brand"
          onClick={() => navigateTo("/", "landing")}
          style={{ cursor: "pointer" }}
        >
          <div className="brand-logo">V</div>
          <span>VentureLens</span>
        </div>

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#how-it-works">How It Works</a>
          <a href="#startups">For Startups</a>
          <a href="#investors">For Investors</a>
          <a href="#about">About</a>
        </div>

        <div className="nav-actions">
          <button
            className="login-btn"
            onClick={() => openAuth("login", "startup")}
          >
            Login
          </button>

          <button
            className="get-started-btn"
            onClick={() => openAuth("signup", "startup")}
          >
            Get Started
          </button>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero" id="home">
        <div className="hero-left">
          <div className="eyebrow">
            <span>✧</span>
            AI INVESTMENT INTELLIGENCE
          </div>

          <h1>
            See Beyond <br />
            <span>the Pitch.</span>
          </h1>

          <p className="hero-subtitle">
            AI-powered startup intelligence for smarter investment decisions.
          </p>

          <p className="hero-description">
            VentureLens helps investors evaluate startups through structured
            business analysis, pitch deck intelligence, market insights,
            financial indicators and AI-powered due diligence.
          </p>

          <div className="hero-buttons">
            <button
              className="primary-btn"
              onClick={() => openAuth("signup", "startup")}
            >
              I'm a Startup
              <span>→</span>
            </button>

            <button
              className="secondary-btn"
              onClick={() => openAuth("signup", "investor")}
            >
              I'm an Investor
            </button>
          </div>

          <div className="stats">
            <div className="stat">
              <strong>142</strong>
              <span>STARTUPS</span>
            </div>

            <div className="stat">
              <strong>83.4</strong>
              <span>AVG SCORE</span>
            </div>

            <div className="stat">
              <strong>38</strong>
              <span>REPORTS</span>
            </div>
          </div>
        </div>

        {/* HERO VISUAL */}
        <div className="hero-right">
          <div className="visual-container">
            <div className="glow glow-one"></div>
            <div className="glow glow-two"></div>
            <div className="ai-orbit orbit-one"></div>
            <div className="ai-orbit orbit-two"></div>
            <div className="ai-orbit orbit-three"></div>

            <div className="ai-core">
              <div className="core-shape shape-one"></div>
              <div className="core-shape shape-two"></div>
              <div className="core-shape shape-three"></div>
            </div>

            <div className="score-card">
              <div className="score-header">
                <div>
                  <span className="small-label">AI DUE DILIGENCE</span>
                  <h3>Meridian Robotics</h3>
                </div>
                <span className="mock-data">MOCK DATA</span>
              </div>

              <div className="score-content">
                <div className="score-circle">
                  <div>
                    <strong>84</strong>
                    <span>/ 100</span>
                  </div>
                </div>

                <div className="score-bars">
                  <div className="score-bar">
                    <div className="bar-label">
                      <span>MARKET</span>
                      <span>86</span>
                    </div>
                    <div className="bar">
                      <div style={{ width: "86%" }}></div>
                    </div>
                  </div>

                  <div className="score-bar">
                    <div className="bar-label">
                      <span>TEAM</span>
                      <span>88</span>
                    </div>
                    <div className="bar">
                      <div style={{ width: "88%" }}></div>
                    </div>
                  </div>

                  <div className="tags">
                    <span className="low-risk">LOW RISK</span>
                    <span className="series">SERIES A</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURE STRIP */}
      <section className="feature-strip">
        <FeatureCard
          icon="◫"
          title="Pitch deck intelligence"
          description="Structured extraction of business, market and financial signals."
        />

        <FeatureCard
          icon="▥"
          title="Investment scoring"
          description="One comparable score across six weighted investment factors."
        />

        <FeatureCard
          icon="♢"
          title="Risk framing"
          description="Explicit low, medium and high risk calls with written reasoning."
        />
      </section>

      {/* HOW IT WORKS */}
      <section className="how-section" id="how-it-works">
        <div className="section-label">HOW IT WORKS</div>

        <h2>
          From pitch deck to investment decision,
          <br />
          in four steps.
        </h2>

        <div className="workflow-grid">
          <WorkflowCard
            number="01"
            title="Create Your Profile"
            description="Startups and investors create their accounts and complete their profiles."
          />

          <WorkflowCard
            number="02"
            title="Upload & Share"
            description="Startups upload their pitch deck and relevant business information."
          />

          <WorkflowCard
            number="03"
            title="AI Analysis"
            description="The platform analyzes the startup across multiple investment factors."
          />

          <WorkflowCard
            number="04"
            title="Make Better Decisions"
            description="Investors receive structured insights, scores and reports to support decisions."
          />
        </div>
      </section>

      {/* STARTUPS AND INVESTORS */}
      <section className="audience-section">
        <div className="audience-card" id="startups">
          <span className="audience-label">FOR STARTUPS</span>

          <h2>Present your business like a fund would read it.</h2>

          <ul>
            <li>Create and edit your startup profile</li>
            <li>Upload your pitch deck (PDF, PPT, PPTX)</li>
            <li>Track analysis status and AI-generated insights</li>
            <li>See investor interest and profile completeness</li>
          </ul>

          <button
            className="audience-primary-btn"
            onClick={() => openAuth("signup", "startup")}
          >
            Build Your Startup Profile
          </button>
        </div>

        <div className="audience-card" id="investors">
          <span className="audience-label">FOR INVESTORS</span>

          <h2>Analyze, compare and decide with evidence.</h2>

          <ul>
            <li>Set investment preferences and discover startups</li>
            <li>View AI investment scores and analyze pitch decks</li>
            <li>Compare startups side by side and save deals</li>
            <li>Generate structured due-diligence reports</li>
          </ul>

          <button
            className="audience-secondary-btn"
            onClick={() => openAuth("signup", "investor")}
          >
            Explore Investment Opportunities
          </button>
        </div>
      </section>

      {/* ABOUT */}
      <section className="about-section" id="about">
        <span className="section-label">ABOUT VENTURELENS</span>

        <h2>
          Smarter startup evaluation.
          <br />
          Better investment decisions.
        </h2>

        <p>
          VentureLens uses AI-powered analysis to help investors evaluate
          startups and help founders present their businesses more effectively.
        </p>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-left">
          <div className="footer-brand">
            <div className="brand-logo">V</div>
            <span>VentureLens</span>
          </div>

          <p>
            AI-powered startup intelligence for smarter investment decisions.
          </p>
        </div>

        <div className="footer-right">
          <a
            href="#admin"
            style={{
              color: "#64748b",
              textDecoration: "none",
              marginRight: "1rem",
            }}
          >
            Admin Access
          </a>

          PROTOTYPE · MOCK DATA · © 2026 VENTURELENS
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }) {
  return (
    <div className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function WorkflowCard({ number, title, description }) {
  return (
    <div className="workflow-card">
      <span className="workflow-number">{number}</span>
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
