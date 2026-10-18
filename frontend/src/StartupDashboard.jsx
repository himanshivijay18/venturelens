
import React, { useState, useEffect } from "react";
import "./StartupDashboard.css";

const API_URL = "http://localhost:8085";

export default function StartupDashboard({ onLogout, startupData }) {
  const [profileData, setProfileData] = useState({
    founderName: "",
    email: "",
    name: "",
    stage: "",
    sector: "",
    targetRaise: "",
    committed: "",
    profileCompletion: 0,
  });

  const [businessMetrics, setBusinessMetrics] = useState({
    arr: "",
    monthlyBurn: "",
    runwayMonths: "",
    activeCustomers: "",
  });

  const [aiScore, setAiScore] = useState({
    overall: 0,
    market: 0,
    team: 0,
    product: 0,
    financials: 0,
    riskLevel: "Not evaluated",
    riskBullet1: "AI evaluation is not available yet.",
    riskBullet2: "Upload and analyze your pitch deck to evaluate your startup.",
  });

  const [pitchDecks, setPitchDecks] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoadingDecks, setIsLoadingDecks] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const [editFormData, setEditFormData] = useState({
    founderName: "",
    email: "",
    name: "",
    stage: "",
    sector: "",
    targetRaise: "",
    committed: "",
    arr: "",
    monthlyBurn: "",
    runwayMonths: "",
    activeCustomers: "",
  });

  // Populate dashboard using startup data returned by login.
  useEffect(() => {
    if (!startupData) return;

    const profile = {
      founderName: startupData.founderName || "",
      email: startupData.email || "",
      name: startupData.companyName || "",
      stage: startupData.fundingStage || "",
      sector: startupData.category || "",
      targetRaise: startupData.targetMoney ?? "",
      committed: startupData.committed ?? "",
      profileCompletion: 0,
    };

    const metrics = {
      arr: startupData.yearlyRevenue ?? "",
      monthlyBurn: startupData.monthlyExpenses ?? "",
      runwayMonths: startupData.runwayMonths ?? "",
      activeCustomers: startupData.activeCustomers ?? "",
    };

    setProfileData(profile);
    setBusinessMetrics(metrics);

    setAiScore((previous) => ({
      ...previous,
      overall: startupData.aiScore ?? 0,
      riskLevel: startupData.riskLevel || "Not evaluated",
    }));

    setEditFormData({
      founderName: profile.founderName,
      email: profile.email,
      name: profile.name,
      stage: profile.stage,
      sector: profile.sector,
      targetRaise: profile.targetRaise,
      committed: profile.committed,
      arr: metrics.arr,
      monthlyBurn: metrics.monthlyBurn,
      runwayMonths: metrics.runwayMonths,
      activeCustomers: metrics.activeCustomers,
    });
  }, [startupData]);

  // Load pitch decks saved for this startup.
  useEffect(() => {
    if (!startupData?.id) {
      setPitchDecks([]);
      return;
    }

    const loadPitchDecks = async () => {
      setIsLoadingDecks(true);

      try {
        const response = await fetch(
          `${API_URL}/startup/${startupData.id}/pitch-decks`
        );

        if (!response.ok) {
          throw new Error("Unable to load pitch decks.");
        }

        const decks = await response.json();
        setPitchDecks(decks);
      } catch (error) {
        console.error("Pitch deck loading error:", error);
      } finally {
        setIsLoadingDecks(false);
      }
    };

    loadPitchDecks();
  }, [startupData?.id]);

  // Open edit modal.
  const handleOpenEditModal = () => {
    setEditFormData({
      founderName: profileData.founderName,
      email: profileData.email,
      name: profileData.name,
      stage: profileData.stage,
      sector: profileData.sector,
      targetRaise: profileData.targetRaise,
      committed: profileData.committed,
      arr: businessMetrics.arr,
      monthlyBurn: businessMetrics.monthlyBurn,
      runwayMonths: businessMetrics.runwayMonths,
      activeCustomers: businessMetrics.activeCustomers,
    });

    setIsEditModalOpen(true);
  };

  // Handle form input changes.
  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save updated details to Spring Boot and MySQL.
  const handleSaveProfile = async (e) => {
    e.preventDefault();

    if (!startupData?.id) {
      alert("Startup ID not found. Please log in again.");
      return;
    }

    const updatedData = {
      founderName: editFormData.founderName,
      companyName: editFormData.name,
      fundingStage: editFormData.stage,
      category: editFormData.sector,
      targetMoney: editFormData.targetRaise,
      yearlyRevenue: editFormData.arr,
      monthlyExpenses: editFormData.monthlyBurn,
    };

    try {
      setIsSaving(true);

      const response = await fetch(
        `${API_URL}/startup/update/${startupData.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update startup profile.");
      }

      const savedStartup = await response.json();

      const updatedProfile = {
        founderName: savedStartup.founderName || "",
        email: savedStartup.email || "",
        name: savedStartup.companyName || "",
        stage: savedStartup.fundingStage || "",
        sector: savedStartup.category || "",
        targetRaise: savedStartup.targetMoney ?? "",
        committed: profileData.committed,
        profileCompletion: profileData.profileCompletion,
      };

      const updatedMetrics = {
        arr: savedStartup.yearlyRevenue ?? "",
        monthlyBurn: savedStartup.monthlyExpenses ?? "",
        runwayMonths: businessMetrics.runwayMonths,
        activeCustomers: businessMetrics.activeCustomers,
      };

      setProfileData(updatedProfile);
      setBusinessMetrics(updatedMetrics);

      setEditFormData({
        founderName: updatedProfile.founderName,
        email: updatedProfile.email,
        name: updatedProfile.name,
        stage: updatedProfile.stage,
        sector: updatedProfile.sector,
        targetRaise: updatedProfile.targetRaise,
        committed: updatedProfile.committed,
        arr: updatedMetrics.arr,
        monthlyBurn: updatedMetrics.monthlyBurn,
        runwayMonths: updatedMetrics.runwayMonths,
        activeCustomers: updatedMetrics.activeCustomers,
      });

      setIsEditModalOpen(false);
      alert("Startup profile updated successfully!");
    } catch (error) {
      console.error("Profile update error:", error);
      alert(error.message || "Unable to update startup profile.");
    } finally {
      setIsSaving(false);
    }
  };

  // Upload a real PDF to Spring Boot.
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Only PDF files are allowed.");
      e.target.value = "";
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Please select a valid PDF file.");
      e.target.value = "";
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      alert("File size must not exceed 50 MB.");
      e.target.value = "";
      return;
    }

    if (!startupData?.id) {
      alert("Startup ID not found. Please log in again.");
      e.target.value = "";
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(
        `${API_URL}/startup/${startupData.id}/pitch-decks`,
        {
          method: "POST",
          body: formData,
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to upload pitch deck.");
      }

      setPitchDecks((previous) => {
        const alreadyExists = previous.some(
          (deck) => deck.id === result.id
        );

        return alreadyExists ? previous : [result, ...previous];
      });

      alert("Pitch deck uploaded successfully!");
    } catch (error) {
      console.error("Pitch deck upload error:", error);
      alert(error.message || "Unable to upload pitch deck.");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  // Avatar initials.
  const getInitials = (name) => {
    if (!name || !name.trim()) return "ST";

    const parts = name.trim().split(/\s+/);

    if (parts.length > 1) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }

    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="dashboard-layout">
      <header className="dash-topbar">
        <div className="dash-brand">
          <div className="dash-logo">V</div>
          <span>VentureLens</span>
          <span className="portal-tag">FOUNDER PORTAL</span>
        </div>

        <div className="dash-top-actions">
          <span className="status-indicator">● System Online</span>
          <button className="dash-btn-logout" onClick={onLogout}>
            Sign Out
          </button>
        </div>
      </header>

      <main className="dash-content">
        {/* STARTUP PROFILE */}
        <section className="profile-banner full-card">
          <div className="profile-main">
            <div className="profile-avatar">
              {getInitials(profileData.name)}
            </div>

            <div className="profile-info">
              <div className="profile-title-row">
                <h2>{profileData.name || "Your Startup"}</h2>
                <span className="badge-stage">
                  {profileData.stage || "Stage not specified"}
                </span>
                <span className="badge-sector">
                  {profileData.sector || "Industry not specified"}
                </span>
              </div>

              <p>Founder: {profileData.founderName || "Not provided"}</p>
              <p>Email: {profileData.email || "Not provided"}</p>

              <p className="profile-subtext">
                Target Raise:{" "}
                <strong>{profileData.targetRaise || "Not provided"}</strong>
                {" · "}
                Committed:{" "}
                <strong>{profileData.committed || "Not provided"}</strong>
              </p>
            </div>
          </div>

          <div className="profile-banner-right">
            <div className="profile-progress-box">
              <div className="progress-text-row">
                <span>Profile Completeness</span>
                <strong>{profileData.profileCompletion}%</strong>
              </div>

              <div className="progress-bar-track">
                <div
                  className="progress-bar-fill"
                  style={{ width: `${profileData.profileCompletion}%` }}
                ></div>
              </div>
            </div>

            <button
              className="btn-edit-profile"
              onClick={handleOpenEditModal}
            >
              ✎ Edit Profile
            </button>
          </div>
        </section>

        {/* BUSINESS METRICS */}
        <section className="kpi-row">
          <div className="kpi-card">
            <span className="kpi-label">Annual Revenue</span>
            <div className="kpi-number">
              {businessMetrics.arr || "Not provided"}
            </div>
            <span className="kpi-sub">Yearly revenue</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Monthly Expenses</span>
            <div className="kpi-number">
              {businessMetrics.monthlyBurn || "Not provided"}
            </div>
            <span className="kpi-sub">Reported monthly expenses</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Cash Runway</span>
            <div className="kpi-number highlight-green">
              {businessMetrics.runwayMonths || "Not provided"}
            </div>
            <span className="kpi-sub">Runway in months</span>
          </div>

          <div className="kpi-card">
            <span className="kpi-label">Active Enterprise Clients</span>
            <div className="kpi-number">
              {businessMetrics.activeCustomers || "Not provided"}
            </div>
            <span className="kpi-sub">Active client count</span>
          </div>
        </section>

        {/* AI SCORECARD */}
        <section className="full-card ai-score-panel">
          <div className="panel-header">
            <div>
              <h3>AI Investment Scorecard</h3>
              <p>Startup investment evaluation from your saved data.</p>
            </div>
            <span className="risk-badge">{aiScore.riskLevel}</span>
          </div>

          <div className="scorecard-body-grid">
            <div className="score-hero-container">
              <div className="score-ring">
                <strong>{aiScore.overall}</strong>
                <span>/ 100</span>
              </div>

              <div className="score-explanation">
                <h4>Overall Evaluation</h4>
                <p>Current saved startup evaluation score.</p>
              </div>

              <div className="risk-notes">
                <span className="risk-notes-label">
                  AI DILIGENCE REASONING:
                </span>
                <ul>
                  <li>{aiScore.riskBullet1}</li>
                  <li>{aiScore.riskBullet2}</li>
                </ul>
              </div>
            </div>

            <div className="factor-grid">
              {[
                ["Market Opportunity (TAM/SAM)", aiScore.market],
                ["Team Execution & Pedigree", aiScore.team],
                ["Product IP & Defensibility", aiScore.product],
                ["Financial Model & Unit Economics", aiScore.financials],
              ].map(([label, score]) => (
                <div className="factor-item" key={label}>
                  <div className="factor-header">
                    <span>{label}</span>
                    <strong>{score}%</strong>
                  </div>

                  <div className="factor-track">
                    <div
                      className="factor-fill"
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PITCH DECK */}
        <section className="full-card deck-panel">
          <div className="panel-header">
            <div>
              <h3>Pitch Deck AI Intelligence &amp; Upload</h3>
              <p>Upload your startup pitch deck in PDF format.</p>
            </div>
          </div>

          <div className="upload-dropzone">
            <input
              type="file"
              id="pitchDeckFile"
              accept=".pdf,application/pdf"
              onChange={handleFileUpload}
              disabled={isUploading}
            />

            <label htmlFor="pitchDeckFile" className="dropzone-content">
              <div className="dropzone-icon">📑</div>
              <strong>
                {isUploading ? "Uploading PDF..." : "Select your pitch deck"}
              </strong>
              <span>PDF only · Maximum size 50 MB</span>
              <span className="btn-browse">
                {isUploading ? "Uploading..." : "Browse Files"}
              </span>
            </label>
          </div>

          {isLoadingDecks && (
            <p className="uploading-state">Loading saved pitch decks...</p>
          )}

          {!isLoadingDecks && pitchDecks.length > 0 && (
            <div className="current-deck-box">
              <div className="deck-file-info">
                <div className="deck-icon">PDF</div>
                <div>
                  <strong>Uploaded Pitch Decks</strong>
                  <span>
                    {pitchDecks.length} saved PDF
                    {pitchDecks.length !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>

              <div>
                {pitchDecks.map((deck) => (
                  <div className="deck-file-info" key={deck.id}>
                    <div className="deck-icon">PDF</div>

                    <div>
                      <strong>{deck.fileName}</strong>
                      <span>
                        Uploaded:{" "}
                        {deck.uploadDate
                          ? new Date(deck.uploadDate).toLocaleString()
                          : "Date unavailable"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!isLoadingDecks && pitchDecks.length === 0 && (
            <p>No pitch decks uploaded yet.</p>
          )}
        </section>
      </main>

      {/* EDIT PROFILE MODAL */}
      {isEditModalOpen && (
        <div
          className="modal-backdrop"
          onClick={() => {
            if (!isSaving) setIsEditModalOpen(false);
          }}
        >
          <div
            className="modal-card edit-profile-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-header">
              <div>
                <h2>Edit Startup Profile &amp; Metrics</h2>
                <p>Update your saved company and financial details.</p>
              </div>

              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsEditModalOpen(false)}
                disabled={isSaving}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="edit-profile-form">
              <div className="form-section-title">
                Company &amp; Round Information
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Founder Name</label>
                  <input
                    type="text"
                    name="founderName"
                    value={editFormData.founderName}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    readOnly
                  />
                </div>

                <div className="form-group">
                  <label>Company / Startup Name</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Funding Stage</label>
                  <select
                    name="stage"
                    value={editFormData.stage}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Select stage</option>
                    <option value="Pre-Seed">Pre-Seed</option>
                    <option value="Seed">Seed</option>
                    <option value="Series A">Series A</option>
                    <option value="Series B">Series B</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Sector / Industry</label>
                  <input
                    type="text"
                    name="sector"
                    value={editFormData.sector}
                    onChange={handleEditChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Target Raise Amount</label>
                  <input
                    type="number"
                    name="targetRaise"
                    value={editFormData.targetRaise}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="form-section-title">
                Business &amp; Financial KPIs
              </div>

              <div className="form-grid-2col">
                <div className="form-group">
                  <label>Annual Revenue</label>
                  <input
                    type="number"
                    name="arr"
                    value={editFormData.arr}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Monthly Expenses</label>
                  <input
                    type="number"
                    name="monthlyBurn"
                    value={editFormData.monthlyBurn}
                    onChange={handleEditChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-close-secondary"
                  onClick={() => setIsEditModalOpen(false)}
                  disabled={isSaving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="btn-save-modal"
                  disabled={isSaving}
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
