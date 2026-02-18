// E20: 암전 — 모든 스테이지 통과 후 무행동 시 발동
function E20Blackout({ active, onComplete, say, naviGone }) {
  const [darkness, setDarkness] = useState(0);
  const [phase, setPhase] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const elapsedRef = useRef(0);
  const spokenRef = useRef(new Set());
  const completedRef = useRef(false);

  // Reset on deactivate
  useEffect(() => {
    if (!active) {
      setDarkness(0);
      setPhase(0);
      setShowButton(false);
      elapsedRef.current = 0;
      spokenRef.current = new Set();
      completedRef.current = false;
      return;
    }

    // Start the sequence
    say("...\uC7AC\uBBF8\uC5C6\uC5B4.", "pouty");

    const iv = setInterval(() => {
      elapsedRef.current += 1;
      const t = elapsedRef.current;
      const spoken = spokenRef.current;

      // Progressive darkness stages
      if (t <= 5) {
        setDarkness(t * 0.06); // 0 -> 0.3
      } else if (t <= 10) {
        setDarkness(0.3 + (t - 5) * 0.06); // 0.3 -> 0.6
      } else if (t <= 15) {
        setDarkness(0.6 + (t - 10) * 0.05); // 0.6 -> 0.85
      } else if (t <= 20) {
        setDarkness(0.85 + (t - 15) * 0.02); // 0.85 -> 0.95
      } else if (t <= 30) {
        setDarkness(Math.min(0.95 + (t - 20) * 0.005, 1.0)); // 0.95 -> 1.0
      }

      // Dialogue sequence
      // 5s: silence (already dark, no speech)
      if (t >= 10 && !spoken.has(10)) {
        spoken.add(10);
        say("\uBF08 \uD574\uB3C4 \uC548 \uB204\uB974\uB124.", "bored");
      }
      // 15s: silence, even darker
      if (t >= 20 && !spoken.has(20)) {
        spoken.add(20);
        say("\uB098 \uAC08\uB798.", "idle");
      }
      // 25s: CRT turns off (naviGone handled by main.jsx at 3s after trigger)
      if (t >= 25 && !spoken.has(25)) {
        spoken.add(25);
        setPhase(1); // CRT off phase
      }
      // 30s: Complete darkness
      if (t >= 30 && !spoken.has(30)) {
        spoken.add(30);
        setDarkness(1.0);
        setPhase(2);
      }
      // 35s: show button
      if (t >= 35 && !spoken.has(35)) {
        spoken.add(35);
        setShowButton(true);
        clearInterval(iv);
      }
    }, 1000);

    return () => clearInterval(iv);
  }, [active]);

  const handleClick = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column"
    }}>
      {/* Progressive darkness overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${darkness})`,
        transition: "background 1.5s ease",
        pointerEvents: "none"
      }} />

      {/* Extra darkness layer for full black */}
      {phase >= 2 && (
        <div style={{
          position: "absolute", inset: 0,
          background: "#000",
          animation: "fadeIn 2s ease forwards",
          pointerEvents: "none"
        }} />
      )}

      {/* The barely visible "..." button */}
      {showButton && (
        <div style={{
          position: "relative", zIndex: 10,
          animation: "fadeIn 3s ease"
        }}>
          <div
            onClick={(e) => { e.stopPropagation(); handleClick(); }}
            style={{
              padding: "12px 24px",
              background: "transparent",
              border: "1px solid rgba(34,34,34,0.15)",
              borderRadius: 10,
              fontSize: 13,
              color: "rgba(34,34,34,0.2)",
              cursor: "pointer",
              letterSpacing: 4,
              transition: "all 0.5s",
              userSelect: "none"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = "rgba(34,34,34,0.35)";
              e.currentTarget.style.borderColor = "rgba(34,34,34,0.25)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = "rgba(34,34,34,0.2)";
              e.currentTarget.style.borderColor = "rgba(34,34,34,0.15)";
            }}
          >
            ...
          </div>
        </div>
      )}
    </div>
  );
}
