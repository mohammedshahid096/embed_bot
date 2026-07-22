import "./AuthLoader.css";

export default function AuthLoader() {
  return (
    <div className="auth-loader-wrapper">
      {/* Animated gradient background blobs */}
      <div className="auth-loader-blobs">
        <div className="auth-loader-blob auth-loader-blob--1" />
        <div className="auth-loader-blob auth-loader-blob--2" />
        <div className="auth-loader-blob auth-loader-blob--3" />
      </div>

      {/* Subtle grid overlay */}
      <div className="auth-loader-grid" />

      {/* Center content */}
      <div className="auth-loader-content">
        {/* Orbiting rings */}
        <div className="auth-loader-rings">
          <div className="auth-loader-ring auth-loader-ring--outer" />
          <div className="auth-loader-ring auth-loader-ring--middle" />
          <div className="auth-loader-ring auth-loader-ring--inner" />

          {/* Center logo / icon */}
          <div className="auth-loader-logo">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              className="auth-loader-icon"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="auth-loader-text">
          <h2 className="auth-loader-title">Setting things up</h2>
          <div className="auth-loader-dots">
            <span className="auth-loader-dot" />
            <span className="auth-loader-dot" />
            <span className="auth-loader-dot" />
          </div>
        </div>
      </div>
    </div>
  );
}
