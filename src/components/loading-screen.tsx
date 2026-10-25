export function LoadingScreen() {
  return (
    <main
      className="flex min-h-screen items-center justify-center overflow-hidden bg-background px-6 text-foreground"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-5 text-center">
        <svg
          className="h-48 w-60 max-w-full"
          viewBox="0 0 240 190"
          fill="none"
          role="img"
          aria-label="Future Foods NVC3 logo floating among green leaves"
          xmlns="http://www.w3.org/2000/svg"
        >
          <style>{`
            @keyframes logo-float {
              0%, 100% { transform: translateY(0) rotate(-2deg); }
              50% { transform: translateY(-7px) rotate(2deg); }
            }
            @keyframes orbit {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            @keyframes leaf-sway {
              0%, 100% { transform: rotate(-7deg); }
              50% { transform: rotate(8deg); }
            }
            @keyframes sparkle {
              0%, 100% { opacity: .35; transform: scale(.7); }
              50% { opacity: 1; transform: scale(1.15); }
            }
            .brand-logo { transform-origin: 120px 88px; animation: logo-float 2.5s ease-in-out infinite; }
            .orbit { transform-origin: 120px 88px; animation: orbit 12s linear infinite; }
            .leaf-left { transform-origin: 51px 105px; animation: leaf-sway 2.8s ease-in-out infinite; }
            .leaf-right { transform-origin: 189px 103px; animation: leaf-sway 3s ease-in-out .4s infinite reverse; }
            .sparkle { transform-box: fill-box; transform-origin: center; animation: sparkle 1.8s ease-in-out infinite; }
            @media (prefers-reduced-motion: reduce) {
              .brand-logo, .orbit, .leaf-left, .leaf-right, .sparkle { animation: none; }
            }
          `}</style>
          <defs>
            <linearGradient id="leaf-gradient" x1="0" y1="0" x2="1" y2="1">
              <stop stopColor="#A9C56E" />
              <stop offset="1" stopColor="#567A45" />
            </linearGradient>
          </defs>

          <ellipse cx="120" cy="159" rx="62" ry="12" fill="currentColor" opacity=".06" />
          <ellipse cx="120" cy="88" rx="79" ry="62" stroke="#8BAE54" strokeOpacity=".18" strokeWidth="1.5" strokeDasharray="3 6" />

          <g className="brand-logo">
            <circle cx="120" cy="88" r="55" fill="white" />
            <circle cx="120" cy="88" r="55" stroke="#8BAE54" strokeOpacity=".38" strokeWidth="2" />
            <image
              href="/ff_icon.png"
              x="69"
              y="37"
              width="102"
              height="102"
              preserveAspectRatio="xMidYMid meet"
            />
          </g>

          <g className="leaf-left">
            <path d="M50 121c-2-17 4-29 18-36 2 16-3 28-18 36Z" fill="url(#leaf-gradient)" />
            <path d="M50 121c4-12 9-21 17-31" stroke="white" strokeOpacity=".65" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M42 134c-1-12-7-20-19-23 0 12 6 20 19 23Z" fill="#B5CB7A" />
            <path d="m42 134-16-19" stroke="white" strokeOpacity=".65" strokeWidth="1.3" strokeLinecap="round" />
          </g>
          <g className="leaf-right">
            <path d="M190 119c2-17-4-29-18-36-2 16 3 28 18 36Z" fill="url(#leaf-gradient)" />
            <path d="M190 119c-4-12-9-21-17-31" stroke="white" strokeOpacity=".65" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M198 133c1-12 7-20 19-23 0 12-6 20-19 23Z" fill="#B5CB7A" />
            <path d="m198 133 16-19" stroke="white" strokeOpacity=".65" strokeWidth="1.3" strokeLinecap="round" />
          </g>

          <g className="orbit">
            <circle cx="120" cy="25" r="3.5" fill="#7E9F4B" />
            <circle cx="194" cy="91" r="3" fill="#B5CB7A" />
            <circle cx="47" cy="105" r="2.5" fill="#567A45" />
          </g>
          <path className="sparkle" d="m185 37 3 7 7 3-7 3-3 7-3-7-7-3 7-3 3-7Z" fill="#A8BE67" />
          <path className="sparkle" d="m60 45 2 5 5 2-5 2-2 5-2-5-5-2 5-2 2-5Z" fill="#7E9F4B" style={{ animationDelay: "0.8s" }} />
        </svg>

        <div className="space-y-2">
          <p className="text-base font-medium">Getting things ready</p>
          <p className="text-sm text-muted-foreground">Please wait a moment...</p>
        </div>
        <span className="sr-only">Please wait while the app loads.</span>
      </div>
    </main>
  )
}
