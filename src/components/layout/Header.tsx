/**
 * Header Layout Component
 */

export const Header: React.FC = () => {
  return (
    <header className="header">
      <nav className="navbar">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h1>My App</h1>
        </div>
      </nav>
    </header>
  );
};
