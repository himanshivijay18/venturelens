import React, { useState } from "react";
import "./InvestorDashboard.css";

export default function InvestorDashboard({ onLogout }) {
  // 1. Investor Profile Details State
  const [investorProfile, setInvestorProfile] = useState({
    firmName: "Horizon Capital Partners",
    thesis: "Early Stage DeepTech, AI, & Enterprise SaaS · Fund III",
    stageFocus: "Seed to Series A",
    checkSize: "$500K - $2.5M",
    targetSectors: "AI, DeepTech, BioTech, Cybersecurity",
  });

  // 2. Startups Dataset
  const [startups, setStartups] = useState([
    {
      id: 1,
      name: "Meridian Robotics",
      sector: "Hardware / AI",
      stage: "Series A",
      targetRaise: "$3.5M",
      arr: "$342K",
      overallScore: 84,
      market: 86,
      team: 88,
      product: 82,
      financials: 79,
      risk: "LOW RISK",
      saved: true,
      requestedMeeting: false,
      notes: "Strong founder pedigree with 2 prior robotics exits. Expanding hardware margins.",
    },
    {
      id: 2,
      name: "Synthetix Health",
      sector: "BioTech / AI",
      stage: "Seed",
      targetRaise: "$1.8M",
      arr: "$120K",
      overallScore: 88,
      market: 92,
      team: 90,
      product: 87,
      financials: 83,
      risk: "LOW RISK",
      saved: false,
      requestedMeeting: false,
      notes: "Breakthrough clinical validation on oncology drug modeling. Proprietary data moat.",
    },
    {
      id: 3,
      name: "Apex Logistics",
      sector: "Supply Chain",
      stage: "Series A",
      targetRaise: "$4.0M",
      arr: "$780K",
      overallScore: 78,
      market: 80,
      team: 74,
      product: 79,
      financials: 79,
      risk: "MEDIUM RISK",
      saved: true,
      requestedMeeting: false,
      notes: "Strong enterprise volume, but high fuel price dependency and longer sales cycles.",
    },
    {
      id: 4,
      name: "CloudShield Sec",
      sector: "Cybersecurity",
      stage: "Seed",
      targetRaise: "$2.2M",
      arr: "$210K",
      overallScore: 81,
      market: 84,
      team: 85,
      product: 80,
      financials: 75,
      risk: "LOW RISK",
      saved: false,
      requestedMeeting: false,
      notes: "Ex-CrowdStrike engineering team. 140% Net Dollar Retention across pilot clients.",
    },
    {
      id: 5,
      name: "NeuralFlow AI",
      sector: "Enterprise AI",
      stage: "Seed",
      targetRaise: "$2.5M",
      arr: "$410K",
      overallScore: 91,
      market: 94,
      team: 93,
      product: 90,
      financials: 87,
      risk: "LOW RISK",
      saved: true,
      requestedMeeting: false,
      notes: "High recurring ARR growth with enterprise LLM orchestration pipeline.",
    },
  ]);

  // Filters & State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStage, setSelectedStage] = useState("ALL");
  const [selectedRisk, setSelectedRisk] = useState("ALL");

  // Modals State
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [meetingTargetStartup, setMeetingTargetStartup] = useState(null);
  const [meetingMessage, setMeetingMessage] = useState("");
  const [meetingSentSuccess, setMeetingSentSuccess] = useState(false);

  // Edit Investor Profile Modal State
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ ...investorProfile });

  // Open Edit Profile Modal
  const handleOpenEditModal = () => {
    setEditFormData({ ...investorProfile });
    setIsEditProfileOpen(true);
  };

  // Handle Input Changes
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Save Investor Profile Changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    setInvestorProfile({ ...editFormData });
    setIsEditProfileOpen(false);
  };

  // Toggle Save Deal
  const toggleSave = (id) => {
    setStartups((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, saved: !item.saved } : item
      )
    );
  };

  const openMeetingModal = (startup) => {
    setMeetingTargetStartup(startup);
    setMeetingMessage(
      `Hi ${startup.name} team, we reviewed your AI investment score on VentureLens and would love to schedule a 30-minute introductory call.`
    );
    setMeetingSentSuccess(false);
  };

  const handleSendMeetingRequest = (e) => {
    e.preventDefault();
    if (!meetingTargetStartup) return;

    setStartups((prev) =>
      prev.map((item) =>
        item.id === meetingTargetStartup.id
          ? { ...item, requestedMeeting: true }
          : item
      )
    );

    setMeetingSentSuccess(true);
    setTimeout(() => {
      setMeetingTargetStartup(null);
      setMeetingSentSuccess(false);
    }, 1800);
  };

  // Filter Logic
  const filteredStartups = startups.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.sector.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStage = selectedStage === "ALL" || s.stage === selectedStage;
    const matchesRisk = selectedRisk === "ALL" || s.risk === selectedRisk;
    return matchesSearch && matchesStage && matchesRisk;
  });

  const avgScore = (
    startups.reduce((acc, curr) => acc + curr.overallScore, 0) / startups.length
  ).toFixed(1);

  const savedCount = startups.filter((s) => s.saved).length;
  const meetingsCount = startups.filter((s) => s.requestedMeeting).length;

  const getInitials = (name) => {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="investor-layout">
      {/* Top Navbar */}
      <header className="investor-topbar">
        <div className="topbar-brand">
          <div className="brand-badge">V</div>
          <span>VentureLens</span>
          <span className="portal-badge">INVESTOR PORTAL</span>
        </div>

        <div className="topbar-actions">
          <span className="status-live">● Deal Pipeline Live</span>
          <button className="btn-logout" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="investor-content">
        {/* ================= BLOCK 1: HEADER & STATS ================= */}
        <section className="investor-header-card">
          <div className="investor-header-main">
            <div className="investor-profile-meta">
              <div className="investor-avatar">{getInitials(investorProfile.firmName)}</div>
              <div>
                <div className="investor-title-row">
                  <h2>{investorProfile.firmName}</h2>
                  <button className="btn-edit-investor-profile" onClick={handleOpenEditModal}>
                    ✎ Edit Profile
                  </button>
                </div>
                <p>{investorProfile.thesis}</p>
                <div className="investor-focus-tags">
                  <span>Focus: <strong>{investorProfile.stageFocus}</strong></span>
                  <span>Check Size: <strong>{investorProfile.checkSize}</strong></span>
                </div>
              </div>
            </div>
          </div>

          <div className="quick-stats-strip">
            <div className="quick-stat">
              <span className="stat-label">Startups Tracked</span>
              <strong className="stat-value">{startups.length}</strong>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Watchlist Avg Score</span>
              <strong className="stat-value highlight-purple">{avgScore}</strong>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Saved Deals</span>
              <strong className="stat-value">{savedCount}</strong>
            </div>
            <div className="quick-stat">
              <span className="stat-label">Meetings Requested</span>
              <strong className="stat-value highlight-green">{meetingsCount}</strong>
            </div>
          </div>
        </section>

        

        {/* ================= BLOCK 2: FILTER TOOLBAR ================= */}
        <section className="filter-toolbar">
          <div className="search-input-box">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search by startup name, sector, or keywords..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-dropdowns">
            <select
              value={selectedStage}
              onChange={(e) => setSelectedStage(e.target.value)}
            >
              <option value="ALL">All Stages</option>
              <option value="Seed">Seed</option>
              <option value="Series A">Series A</option>
            </select>

            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
            >
              <option value="ALL">All Risk Levels</option>
              <option value="LOW RISK">Low Risk Only</option>
              <option value="MEDIUM RISK">Medium Risk Only</option>
            </select>
          </div>
        </section>

        {/* ================= BLOCK 3: DEALS TABLE ================= */}
        <section className="deals-card">
          <div className="deals-card-header">
            <h3>Discovered Deals ({filteredStartups.length})</h3>
            <span className="table-subtitle">
              Ranked by AI investment intelligence and diligence verification.
            </span>
          </div>

          <div className="table-wrapper">
            <table className="deals-table">
              <thead>
                <tr>
                  <th>Startup / Sector</th>
                  <th>Stage & Ask</th>
                  <th>ARR</th>
                  <th>AI Score</th>
                  <th>Pillar Breakdown</th>
                  <th>Risk Call</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStartups.map((s) => (
                  <tr key={s.id}>
                    <td>
                      <div className="table-startup-meta">
                        <strong>{s.name}</strong>
                        <span>{s.sector}</span>
                      </div>
                    </td>
                    <td>
                      <div className="table-ask-meta">
                        <span className="stage-pill">{s.stage}</span>
                        <strong>Raising {s.targetRaise}</strong>
                      </div>
                    </td>
                    <td>
                      <strong>{s.arr}</strong>
                    </td>
                    <td>
                      <div className="score-pill">
                        <strong>{s.overallScore}</strong>
                        <span>/100</span>
                      </div>
                    </td>
                    <td>
                      <div className="mini-bars-group">
                        <div className="mini-bar-item">
                          <span>MKT {s.market}%</span>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{ width: `${s.market}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="mini-bar-item">
                          <span>TEAM {s.team}%</span>
                          <div className="bar-track">
                            <div
                              className="bar-fill"
                              style={{ width: `${s.team}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`risk-tag ${
                          s.risk === "LOW RISK" ? "risk-low" : "risk-med"
                        }`}
                      >
                        {s.risk}
                      </span>
                    </td>
                    <td>
                      <div className="action-button-group">
                        <button
                          className="btn-view-diligence"
                          onClick={() => setSelectedStartup(s)}
                        >
                          Report
                        </button>
                        <button
                          className={`btn-request-intro ${
                            s.requestedMeeting ? "requested" : ""
                          }`}
                          onClick={() => openMeetingModal(s)}
                          disabled={s.requestedMeeting}
                        >
                          {s.requestedMeeting ? "✓ Requested" : "Request Intro"}
                        </button>
                        <button
                          className={`btn-save ${s.saved ? "saved" : ""}`}
                          onClick={() => toggleSave(s.id)}
                          title="Save Deal"
                        >
                          {s.saved ? "★" : "☆"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      {/* ================= EDIT INVESTOR PROFILE MODAL ================= */}
      {isEditProfileOpen && (
        <div className="modal-backdrop" onClick={() => setIsEditProfileOpen(false)}>
          <div className="modal-card edit-investor-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Edit Investor Profile &amp; Thesis</h2>
                <p>Update your fund identity, stage focus, and investment parameters.</p>
              </div>
              <button className="btn-close-modal" onClick={() => setIsEditProfileOpen(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="investor-edit-form">
              <div className="form-group">
                <label>Fund / Firm Name</label>
                <input
                  type="text"
                  name="firmName"
                  value={editFormData.firmName}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Investment Thesis / Bio</label>
                <textarea
                  rows={3}
                  name="thesis"
                  value={editFormData.thesis}
                  onChange={handleEditChange}
                  required
                />
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Stage Focus</label>
                  <input
                    type="text"
                    name="stageFocus"
                    value={editFormData.stageFocus}
                    onChange={handleEditChange}
                    placeholder="e.g. Seed to Series A"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Typical Check Size</label>
                  <input
                    type="text"
                    name="checkSize"
                    value={editFormData.checkSize}
                    onChange={handleEditChange}
                    placeholder="e.g. $500K - $2.5M"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Target Sectors</label>
                <input
                  type="text"
                  name="targetSectors"
                  value={editFormData.targetSectors}
                  onChange={handleEditChange}
                  placeholder="e.g. AI, DeepTech, B2B SaaS"
                  required
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-close-secondary"
                  onClick={() => setIsEditProfileOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save-modal">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= DUE DILIGENCE MODAL ================= */}
      {selectedStartup && (
        <div className="modal-backdrop" onClick={() => setSelectedStartup(null)}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <div className="modal-title-row">
                  <h2>{selectedStartup.name}</h2>
                  <span className="stage-pill">{selectedStartup.stage}</span>
                </div>
                <p>{selectedStartup.sector} · Target: {selectedStartup.targetRaise}</p>
              </div>
              <button
                className="btn-close-modal"
                onClick={() => setSelectedStartup(null)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-score-banner">
                <div className="modal-circle-score">
                  <strong>{selectedStartup.overallScore}</strong>
                  <span>/ 100</span>
                </div>
                <div className="modal-score-text">
                  <h4>AI Diligence Verdict</h4>
                  <p>{selectedStartup.notes}</p>
                  <span
                    className={`risk-tag ${
                      selectedStartup.risk === "LOW RISK" ? "risk-low" : "risk-med"
                    }`}
                  >
                    {selectedStartup.risk}
                  </span>
                </div>
              </div>

              <div className="modal-pillars-grid">
                <div className="modal-pillar-card">
                  <span>Market TAM & Growth</span>
                  <strong>{selectedStartup.market}%</strong>
                </div>
                <div className="modal-pillar-card">
                  <span>Team & Founder Track</span>
                  <strong>{selectedStartup.team}%</strong>
                </div>
                <div className="modal-pillar-card">
                  <span>Product Defensibility</span>
                  <strong>{selectedStartup.product}%</strong>
                </div>
                <div className="modal-pillar-card">
                  <span>Financial Unit Economics</span>
                  <strong>{selectedStartup.financials}%</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-intro-modal"
                onClick={() => {
                  const target = selectedStartup;
                  setSelectedStartup(null);
                  openMeetingModal(target);
                }}
              >
                📅 Request Intro Meeting
              </button>
              <button
                className="btn-download"
                onClick={() => alert("Downloading Due Diligence One-Pager (PDF)...")}
              >
                Download PDF ↓
              </button>
              <button
                className="btn-close-secondary"
                onClick={() => setSelectedStartup(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= REQUEST INTRO MODAL ================= */}
      {meetingTargetStartup && (
        <div className="modal-backdrop" onClick={() => setMeetingTargetStartup(null)}>
          <div className="modal-card meeting-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>Request Intro with {meetingTargetStartup.name}</h2>
                <p>Send a direct introductory request to the founder's portal.</p>
              </div>
              <button
                className="btn-close-modal"
                onClick={() => setMeetingTargetStartup(null)}
              >
                ✕
              </button>
            </div>

            {meetingSentSuccess ? (
              <div className="meeting-success-state">
                <div className="success-icon">✓</div>
                <h3>Intro Request Sent!</h3>
                <p>The founders have been notified and will receive your diligence interest profile.</p>
              </div>
            ) : (
              <form onSubmit={handleSendMeetingRequest} className="meeting-form">
                <div className="form-group">
                  <label>Connecting Fund</label>
                  <input
                    type="text"
                    value={investorProfile.firmName}
                    disabled
                  />
                </div>

                <div className="form-group">
                  <label>Intro Note to Founder</label>
                  <textarea
                    rows={4}
                    value={meetingMessage}
                    onChange={(e) => setMeetingMessage(e.target.value)}
                    required
                  />
                </div>

                <div className="meeting-form-footer">
                  <button
                    type="button"
                    className="btn-close-secondary"
                    onClick={() => setMeetingTargetStartup(null)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-send-request">
                    Send Meeting Request →
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}