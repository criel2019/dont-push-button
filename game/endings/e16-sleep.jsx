// E16: 수면 — 방치 → 나비 점진적 잠들기 → ASMR/릴랙싱
function E16Sleep({ active, onComplete, say, doShake }) {
  const [elapsed, setElapsed] = useState(0);
  const [darkness, setDarkness] = useState(0);
  const [showPillow, setShowPillow] = useState(false);
  const [showBlanket, setShowBlanket] = useState(false);
  const [sleeping, setSleeping] = useState(false);
  const [showWakeButton, setShowWakeButton] = useState(false);
  const [waking, setWaking] = useState(false);
  const [stars, setStars] = useState([]);
  const [zzzItems, setZzzItems] = useState([]);
  const spokenRef = useRef({});
  const completedRef = useRef(false);

  // Reset
  useEffect(() => {
    if (!active) {
      setElapsed(0);
      setDarkness(0);
      setShowPillow(false);
      setShowBlanket(false);
      setSleeping(false);
      setShowWakeButton(false);
      setWaking(false);
      setStars([]);
      setZzzItems([]);
      spokenRef.current = {};
      completedRef.current = false;
      return;
    }
    // Generate stars
    const s = [];
    for (let i = 0; i < 40; i++) {
      s.push({
        id: i,
        left: Math.random() * 100,
        top: Math.random() * 60,
        size: 1 + Math.random() * 2,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3
      });
    }
    setStars(s);
  }, [active]);

  // Elapsed timer
  useEffect(() => {
    if (!active || waking) return;
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [active, waking]);

  // Progressive darkness
  useEffect(() => {
    if (!active || waking) return;
    const targetDark = elapsed < 10 ? 0.05
      : elapsed < 20 ? 0.2
      : elapsed < 30 ? 0.4
      : elapsed < 40 ? 0.6
      : 0.7;
    setDarkness(targetDark);
  }, [active, elapsed, waking]);

  // Dialogue and visual triggers
  useEffect(() => {
    if (!active || waking) return;

    const speak = (key, text, emotion) => {
      if (!spokenRef.current[key]) {
        spokenRef.current[key] = true;
        say(text, emotion);
      }
    };

    if (elapsed === 0) speak("t0", "\uC544~\uC554... \uC544 \uD558\uD488 \uB098\uC624\uB124. \uB2C8 \uD0D3\uC774\uC57C. \uC7AC\uBBF8\uC5C6\uC5B4\uC11C.", "bored");
    if (elapsed === 10) speak("t10", "\uC878\uB824... \uC870\uAE08\uB9CC... \uB208 \uC880 \uBD99\uC77C\uAC8C...", "bored");
    if (elapsed === 20) {
      speak("t20", "5\uBD84\uB9CC... 5\uBD84\uB9CC\uC774\uC57C...", "bored");
      setShowPillow(true);
    }
    if (elapsed === 30) {
      speak("t30", "\uD6C4... \uB530\uB73B\uD574...", "shy");
      setShowBlanket(true);
    }
    if (elapsed === 35) speak("t35", "\uD06C... \uCFE8...", "bored");
    if (elapsed >= 40 && !sleeping) {
      setSleeping(true);
      setShowWakeButton(true);
    }
  }, [active, elapsed, waking, sleeping]);

  // Zzz animation items when sleeping
  useEffect(() => {
    if (!active || !sleeping || waking) return;
    const iv = setInterval(() => {
      setZzzItems(prev => {
        const now = Date.now();
        const filtered = prev.filter(z => now - z.created < 4000);
        return [...filtered, {
          id: now,
          created: now,
          left: 45 + Math.random() * 15,
          size: 14 + Math.random() * 12
        }];
      });
    }, 800);
    return () => clearInterval(iv);
  }, [active, sleeping, waking]);

  // Wake up handler
  const handleWake = () => {
    if (completedRef.current) return;
    setWaking(true);
    setSleeping(false);
    setDarkness(0.1);
    say("\uC73C\uC544\uC544\uC557!!!", "shocked");
    doShake();

    setTimeout(() => {
      say("\uC544 \uAE5C\uC9DD\uC774\uC57C!! \uC0AC\uB78C \uC790\uB294\uB370!!", "angry");
    }, 2000);

    setTimeout(() => {
      say("...\uC798\uAC04 \uB0B4\uAC00 \uC654 \uD63C\uB098\uACE0 \uC788\uB294 \uAC70\uC9C0.", "pouty");
    }, 5000);

    setTimeout(() => {
      if (!completedRef.current) {
        completedRef.current = true;
        onComplete();
      }
    }, 7000);
  };

  if (!active) return null;

  const nightBlue = sleeping ? "rgba(10, 15, 40," : "rgba(0, 0, 20,";
  const showStars = elapsed >= 35 || sleeping;
  const moonOpacity = sleeping ? 0.8 : elapsed >= 30 ? 0.3 : 0;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 350,
      pointerEvents: showWakeButton && !waking ? "auto" : "none",
      overflow: "hidden"
    }}>
      {/* Night sky overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `${nightBlue}${darkness})`,
        transition: "background 1s ease"
      }} />

      {/* Stars */}
      {showStars && stars.map(star => (
        <div key={star.id} style={{
          position: "absolute",
          left: `${star.left}%`,
          top: `${star.top}%`,
          width: star.size,
          height: star.size,
          borderRadius: "50%",
          background: "#fff",
          opacity: sleeping ? 0.6 : 0.2,
          animation: `twinkle ${star.duration}s ease-in-out ${star.delay}s infinite`,
          transition: "opacity 2s ease",
          pointerEvents: "none"
        }} />
      ))}

      {/* Moon */}
      {moonOpacity > 0 && (
        <div style={{
          position: "absolute",
          top: 30, right: 40,
          width: 50, height: 50,
          borderRadius: "50%",
          background: "radial-gradient(circle at 35% 35%, #fffde7, #fdd835)",
          boxShadow: "0 0 30px rgba(253,216,53,0.3), 0 0 60px rgba(253,216,53,0.1)",
          opacity: moonOpacity,
          transition: "opacity 2s ease",
          pointerEvents: "none"
        }} />
      )}

      {/* Pillow */}
      {showPillow && (
        <div style={{
          position: "absolute",
          bottom: "22%", left: "50%",
          transform: "translateX(-50%)",
          fontSize: 40,
          animation: "fadeIn 1s ease",
          pointerEvents: "none",
          opacity: waking ? 0.3 : 0.7,
          transition: "opacity 0.3s"
        }}>
          {"\uD83D\uDECF\uFE0F"}
        </div>
      )}

      {/* Blanket */}
      {showBlanket && (
        <div style={{
          position: "absolute",
          bottom: "15%", left: "50%",
          transform: "translateX(-50%)",
          fontSize: 14,
          color: `rgba(200, 200, 220, ${waking ? 0.2 : 0.4})`,
          letterSpacing: 3,
          animation: "fadeIn 1.5s ease",
          pointerEvents: "none",
          transition: "color 0.3s",
          fontFamily: "'Noto Sans KR', sans-serif"
        }}>
          {"\u2500".repeat(20)}
        </div>
      )}

      {/* Zzz floating animation */}
      {sleeping && !waking && zzzItems.map(z => (
        <div key={z.id} style={{
          position: "absolute",
          left: `${z.left}%`,
          bottom: "35%",
          fontSize: z.size,
          color: "rgba(150, 170, 220, 0.5)",
          fontWeight: 700,
          animation: "zzzFloat 4s ease-out forwards",
          pointerEvents: "none"
        }}>
          {"\uD83D\uDCA4"}
        </div>
      ))}

      {/* Sleeping text */}
      {sleeping && !waking && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          textAlign: "center",
          pointerEvents: "none"
        }}>
          <div style={{
            fontSize: 48,
            animation: "breathe 3s ease-in-out infinite",
            opacity: 0.4
          }}>
            {"\uD83D\uDCA4"}
          </div>
          <div style={{
            fontSize: 11,
            color: "rgba(180, 190, 220, 0.35)",
            marginTop: 8,
            letterSpacing: 4,
            fontFamily: "'Noto Sans KR', sans-serif"
          }}>
            (\uC870\uC6A9\uD558\uB2E4...)
          </div>
        </div>
      )}

      {/* Wake button */}
      {showWakeButton && !waking && (
        <div style={{
          position: "absolute",
          bottom: 50, left: "50%",
          transform: "translateX(-50%)",
          animation: "fadeIn 2s ease",
          pointerEvents: "auto"
        }}>
          <div
            onClick={(e) => { e.stopPropagation(); handleWake(); }}
            style={{
              padding: "10px 28px",
              background: "rgba(100, 140, 200, 0.2)",
              color: "rgba(160, 185, 230, 0.7)",
              fontSize: 13,
              fontWeight: 600,
              borderRadius: 20,
              cursor: "pointer",
              border: "1px solid rgba(120, 160, 220, 0.2)",
              letterSpacing: 3,
              transition: "all 0.3s ease",
              userSelect: "none",
              backdropFilter: "blur(4px)"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(100, 140, 200, 0.35)";
              e.currentTarget.style.color = "rgba(200, 215, 240, 0.9)";
              e.currentTarget.style.borderColor = "rgba(120, 160, 220, 0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(100, 140, 200, 0.2)";
              e.currentTarget.style.color = "rgba(160, 185, 230, 0.7)";
              e.currentTarget.style.borderColor = "rgba(120, 160, 220, 0.2)";
            }}
          >
            {"\uAE68\uC6B0\uAE30"}
          </div>
        </div>
      )}

      {/* Inline keyframes */}
      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.3); }
        }
        @keyframes zzzFloat {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          15% { opacity: 0.5; transform: translateY(-10px) scale(0.8); }
          80% { opacity: 0.3; }
          100% { transform: translateY(-120px) translateX(20px) scale(1.2); opacity: 0; }
        }
        @keyframes breathe {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.1); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}
