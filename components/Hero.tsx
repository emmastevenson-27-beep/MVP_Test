export default function Hero() {
  return (
    <div className="hero">
      <div className="brand-lockup">
        <div className="logo-mark">
          <svg viewBox="-6 0 112 100" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="orb" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#EAF7F8" />
                <stop offset="100%" stopColor="#8FCBD4" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="46" fill="none" stroke="#fff" strokeWidth="4" />
            <circle cx="50" cy="50" r="40" fill="url(#orb)" />
            <path d="M-2 50 C 24 45, 76 55, 102 48" stroke="#fff" strokeWidth="5" fill="none" strokeLinecap="round" />
          </svg>
        </div>
        <p className="brand-word">Restore</p>
      </div>
      <p className="tagline">Let your body design your day</p>
    </div>
  );
}
