import { useState } from "react";
import { AuthProvider } from "@/context";
import { useAuth } from "@/hooks";
import { LandingPage, LoginPage, DashboardPage, CreatePostPage, ConnectedAccountsPage } from "@/pages";
import { UnifiedLayout } from "@/components/layout";
import "@/styles/global.css";

type Page = "landing" | "login" | "dashboard";
type DashboardSection = "dashboard" | "create-post" | "connected-accounts";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const [currentSection, setCurrentSection] =
    useState<DashboardSection>("dashboard");
  const { user, logout } = useAuth();

  // If user is authenticated, show unified dashboard interface
  if (user) {
    return (
      <UnifiedLayout
        currentSection={currentSection}
        onNavigateToSection={setCurrentSection}
        onLogout={() => {
          logout();
          setCurrentPage("landing");
        }}
      >
        {currentSection === "dashboard" ? (
          <DashboardPage />
        ) : currentSection === "create-post" ? (
          <CreatePostPage />
        ) : (
          <ConnectedAccountsPage />
        )}
      </UnifiedLayout>
    );
  }

  const handleNavigateToLogin = () => {
    console.log("Navigating to Login page");
    setCurrentPage("login");
  };

  const handleNavigateToLanding = () => {
    console.log("Navigating to Landing page");
    setCurrentPage("landing");
  };

  return (
    <>
      {currentPage === "landing" && (
        <LandingPage onNavigateToLogin={handleNavigateToLogin} />
      )}
      {currentPage === "login" && (
        <LoginPage onNavigateToLanding={handleNavigateToLanding} />
      )}
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
