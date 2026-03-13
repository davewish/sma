/**
 * Unified Dashboard Layout with Sidebar
 */

import { Header } from "./Header";
import "@/styles/unified-layout.css";

interface UnifiedLayoutProps {
  children: React.ReactNode;
  currentSection: "dashboard" | "create-post";
  onNavigateToSection: (section: "dashboard" | "create-post") => void;
  onLogout: () => void;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
  children,
  currentSection,
  onNavigateToSection,
  onLogout,
}) => {
  return (
    <div className="unified-layout">
      <Header />

      <div className="layout-container">
        {/* Sidebar Navigation */}
        <aside className="sidebar">
          <nav className="sidebar-nav">
            <div className="nav-section">
              <h3 className="nav-title">Main</h3>
              <ul className="nav-list">
                <li>
                  <button
                    className={`nav-item ${
                      currentSection === "dashboard" ? "active" : ""
                    }`}
                    onClick={() => onNavigateToSection("dashboard")}
                  >
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">Dashboard</span>
                  </button>
                </li>
                <li>
                  <button
                    className={`nav-item ${
                      currentSection === "create-post" ? "active" : ""
                    }`}
                    onClick={() => onNavigateToSection("create-post")}
                  >
                    <span className="nav-icon">➕</span>
                    <span className="nav-label">Create Post</span>
                  </button>
                </li>
              </ul>
            </div>

            <div className="nav-section nav-section-bottom">
              <button className="nav-item nav-logout" onClick={onLogout}>
                <span className="nav-icon">🚪</span>
                <span className="nav-label">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="main-content-area">{children}</main>
      </div>
    </div>
  );
};
