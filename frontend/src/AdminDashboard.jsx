import React, { useState } from "react";
import "./AdminDashboard.css";

export default function AdminDashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState("startups"); // "startups" | "investors" | "ai-pipeline"

  // 1. Platform Startups Directory
  const [startups, setStartups] = useState([
    {
      id: 1,
      name: "Meridian Robotics",
      founder: "Alex Morgan",
      sector: "Hardware / AI",
      stage: "Series A",
      aiScore: 84,
      status: "Verified",
      registeredDate: "2026-08-14",
    },
    {
      id: 2,
      name: "Synthetix Health",
      founder: "Dr. Elena Rostova",
      sector: "BioTech / AI",
      stage: "Seed",
      aiScore: 88,
      status: "Verified",
      registeredDate: "2026-08-20",
    },
    {
      id: 3,
      name: "Apex Logistics",
      founder: "Marcus Chen",
      sector: "Supply Chain",
      stage: "Series A",
      aiScore: 78,
      status: "Pending Review",
      registeredDate: "2026-08-28",
    },
    {
      id: 4,
      name: "CloudShield Sec",
      founder: "Sarah Jenkins",
      sector: "Cybersecurity",
      stage: "Seed",
      aiScore: 81,
      status: "Verified",
      registeredDate: "2026-08-29",
    },
  ]);

  // 2. Platform Investors Directory
  const [investors, setInvestors] = useState([
    {
      id: 1,
      firmName: "Horizon Capital",
      partner: "David Vance",
      thesis: "Early Stage DeepTech",
      dealsTracked: 14,
      status: "Active",
      joinedDate: "2026-07-10",
    },
    {
      id: 2,
      firmName: "Apex Global Ventures",
      partner: "Priya Sharma",
      thesis: "B2B SaaS & AI",
      dealsTracked: 22,
      status: "Active",
      joinedDate: "2026-08-01",
    },
    {
      id: 3,
      firmName: "NextWave Syndicate",
      partner: "Michael Scott",
      thesis: "BioTech / Climate",
      dealsTracked: 6,
      status: "Pending Verification",
      joinedDate: "2026-08-30",
    },
  ]);

  // Action handlers
  const handleToggleStartupStatus = (id) => {
    setStartups((prev) =>
      prev.map((s) =>
        s.id === id
          ? { ...s, status: s.status === "Verified" ? "Pending Review" : "Verified" }
          : s
      )
    );
  };

  const handleDeleteStartup = (id) => {
    if (window.confirm("Are you sure you want to remove this startup entity?")) {
      setStartups((prev) => prev.filter((s) => s.id !== id));
    }
  };

  const handleToggleInvestorStatus = (id) => {
    setInvestors((prev) =>
      prev.map((inv) =>
        inv.id === id
          ? { ...inv, status: inv.status === "Active" ? "Pending Verification" : "Active" }
          : inv
      )
    );
  };

  return (
    <div className="admin-layout">
      {/* Top Navbar */}
      <header className="admin-topbar">
        <div className="admin-brand">
          <div className="admin-badge">V</div>
          <span>VentureLens</span>
          <span className="portal-badge-admin">SUPER ADMIN CONSOLE</span>
        </div>

        <div className="admin-topbar-actions">
          <span className="status-live">● Platform Operational</span>
          <button className="btn-logout" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="admin-content">
        {/* ================= BLOCK 1: PLATFORM HEALTH KPI STRIP ================= */}
        <section className="admin-kpi-grid">
          <div className="admin-kpi-card">
            <span className="kpi-label">Total Startups</span>
            <div className="kpi-number">{startups.length}</div>
            <span className="kpi-sub">Across 4 Verticals</span>
          </div>

          <div className="admin-kpi-card">
            <span className="kpi-label">Active Investors</span>
            <div className="kpi-number">{investors.length} Funds</div>
            <span className="kpi-sub">42 Deals Under Review</span>
          </div>

          <div className="admin-kpi-card">
            <span className="kpi-label">Pitch Decks Processed</span>
            <div className="kpi-number highlight-purple">128 Decks</div>
            <span className="kpi-sub">Avg AI Score: 82.4/100</span>
          </div>

          <div className="admin-kpi-card">
            <span className="kpi-label">AI Engine Status</span>
            <div className="kpi-number highlight-green">99.8% Uptime</div>
            <span className="kpi-sub">Vision &amp; Signal Extraction Online</span>
          </div>
        </section>

        {/* ================= BLOCK 2: NAVIGATION TABS ================= */}
        <div className="admin-tab-bar">
          <button
            className={`admin-tab-btn ${activeTab === "startups" ? "active" : ""}`}
            onClick={() => setActiveTab("startups")}
          >
            🏢 Manage Startups ({startups.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "investors" ? "active" : ""}`}
            onClick={() => setActiveTab("investors")}
          >
            💼 Manage Investors ({investors.length})
          </button>
          <button
            className={`admin-tab-btn ${activeTab === "ai-pipeline" ? "active" : ""}`}
            onClick={() => setActiveTab("ai-pipeline")}
          >
            ⚙ AI Scoring Pipeline
          </button>
        </div>

        {/* ================= BLOCK 3: TAB CONTENT ================= */}

        {/* --- STARTUPS TAB --- */}
        {activeTab === "startups" && (
          <section className="admin-panel-card">
            <div className="panel-header">
              <div>
                <h3>Registered Startups &amp; AI Scores</h3>
                <p>Verify founders, review extracted deck signals, or adjust compliance standing.</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Startup / Founder</th>
                    <th>Vertical &amp; Stage</th>
                    <th>AI Score</th>
                    <th>Registered Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {startups.map((s) => (
                    <tr key={s.id}>
                      <td>
                        <div className="meta-primary">
                          <strong>{s.name}</strong>
                          <span>Founder: {s.founder}</span>
                        </div>
                      </td>
                      <td>
                        <div className="meta-secondary">
                          <span className="stage-pill">{s.stage}</span>
                          <span className="sector-text">{s.sector}</span>
                        </div>
                      </td>
                      <td>
                        <div className="score-badge">
                          <strong>{s.aiScore}</strong> / 100
                        </div>
                      </td>
                      <td>{s.registeredDate}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            s.status === "Verified" ? "status-active" : "status-pending"
                          }`}
                        >
                          {s.status}
                        </span>
                      </td>
                      <td>
                        <div className="admin-actions-row">
                          <button
                            className="btn-action verify"
                            onClick={() => handleToggleStartupStatus(s.id)}
                          >
                            {s.status === "Verified" ? "Unverify" : "Verify"}
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => handleDeleteStartup(s.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* --- INVESTORS TAB --- */}
        {activeTab === "investors" && (
          <section className="admin-panel-card">
            <div className="panel-header">
              <div>
                <h3>Registered Funds &amp; Angel Investors</h3>
                <p>Manage verified firm accounts, due diligence permissions, and pipeline activity.</p>
              </div>
            </div>

            <div className="table-wrapper">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Firm Name / Lead Partner</th>
                    <th>Investment Thesis Focus</th>
                    <th>Deals Tracked</th>
                    <th>Join Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {investors.map((inv) => (
                    <tr key={inv.id}>
                      <td>
                        <div className="meta-primary">
                          <strong>{inv.firmName}</strong>
                          <span>Partner: {inv.partner}</span>
                        </div>
                      </td>
                      <td>
                        <span className="thesis-text">{inv.thesis}</span>
                      </td>
                      <td>
                        <strong>{inv.dealsTracked} Deals</strong>
                      </td>
                      <td>{inv.joinedDate}</td>
                      <td>
                        <span
                          className={`status-pill ${
                            inv.status === "Active" ? "status-active" : "status-pending"
                          }`}
                        >
                          {inv.status}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-action verify"
                          onClick={() => handleToggleInvestorStatus(inv.id)}
                        >
                          {inv.status === "Active" ? "Suspend" : "Approve"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* --- AI PIPELINE MONITOR TAB --- */}
        {activeTab === "ai-pipeline" && (
          <section className="admin-panel-card">
            <div className="panel-header">
              <div>
                <h3>AI Model Due Diligence Calibration</h3>
                <p>Weight configurations across the six diligence vectors and real-time processing logs.</p>
              </div>
              <button
                className="btn-recalibrate"
                onClick={() => alert("Model factor re-calibration initiated across all active startups.")}
              >
                ↻ Re-run Global Weights
              </button>
            </div>

            <div className="pipeline-grid">
              <div className="pipeline-config-card">
                <h4>Active Scoring Weights</h4>
                <div className="weight-item">
                  <span>Market TAM / SAM Growth</span>
                  <strong>25%</strong>
                </div>
                <div className="weight-item">
                  <span>Team Pedigree &amp; Track Record</span>
                  <strong>25%</strong>
                </div>
                <div className="weight-item">
                  <span>Product Defensibility / IP Moat</span>
                  <strong>20%</strong>
                </div>
                <div className="weight-item">
                  <span>Financial Health &amp; Gross Margins</span>
                  <strong>15%</strong>
                </div>
                <div className="weight-item">
                  <span>Traction &amp; Retention (NDR)</span>
                  <strong>15%</strong>
                </div>
              </div>

              <div className="pipeline-logs-card">
                <h4>Recent Diligence Processing Logs</h4>
                <ul className="log-list">
                  <li>
                    <span className="log-time">[20:10:45]</span>
                    <span className="log-msg">Synthetix Health: PDF parsed (22 slides). Score computed: 88.</span>
                  </li>
                  <li>
                    <span className="log-time">[19:42:12]</span>
                    <span className="log-msg">CloudShield Sec: Financial model verified. Unit margin: 75%.</span>
                  </li>
                  <li>
                    <span className="log-time">[18:15:02]</span>
                    <span className="log-msg">Meridian Robotics: Series A deck re-analyzed. No critical risks flagged.</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}