/**
 * Loading Spinner Component
 */

export const Spinner: React.FC<{ size?: "sm" | "md" | "lg" }> = ({
  size = "md",
}) => {
  return (
    <div className={`spinner spinner--${size}`} role="status">
      <span className="sr-only">Loading...</span>
    </div>
  );
};
