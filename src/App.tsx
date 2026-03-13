import { useState } from "react";
import { AuthProvider } from "@/context";
import { useAuth } from "@/hooks";
import { LandingPage, LoginPage, DashboardPage } from "@/pages";
import "@/styles/global.css";

type Page = "landing" | "login" | "dashboard";

function AppContent() {
  const [currentPage, setCurrentPage] = useState<Page>("landing");
  const { user } = useAuth();

  // If user is authenticated, show dashboard
  if (user) {
    return (
      <DashboardPage
        onNavigateToLanding={() => {
          setCurrentPage("landing");
        }}
      />
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
