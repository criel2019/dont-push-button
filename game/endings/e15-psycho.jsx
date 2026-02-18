// E15: 사이코패스 — Kill Mode → 5단계 감정 아크 (2~3분)
function E15Psycho({ active, onComplete, say }) {
  const [elapsed, setElapsed] = useState(0);
  const [stage, setStage] = useState(0);
  const [darkness, setDarkness] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [raindrops, setRaindrops] = useState([]);
  const spokenRef = useRef({});

  // Reset
  useEffect(() => {
    if (!active) {
      setElapsed(0);
      setStage(0);
      setDarkness(0);
      setShowButton(false);
      setRaindrops([]);
      spokenRef.current = {};
      return;
    }
  }, [active]);

  // Elapsed timer
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [active]);

  // Progressive darkness
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => {
      setDarkness(p => {
        if (p >= 0.75) return 0.75;
        return p + 0.003;
      });
    }, 100);
    return () => clearInterval(iv);
  }, [active]);

  // Generate raindrops
  useEffect(() => {
    if (!active) return;
    const drops = [];
    for (let i = 0; i < 30; i++) {
      drops.push({
        id: i,
        left: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 1.5 + Math.random() * 2,
        opacity: 0.1 + Math.random() * 0.2
      });
    }
    setRaindrops(drops);
  }, [active]);

  // Stage management and dialogue
  useEffect(() => {
    if (!active) return;

    const speak = (key, text, emotion) => {
      if (!spokenRef.current[key]) {
        spokenRef.current[key] = true;
        say(text, emotion);
      }
    };

    // Stage 1: Denial (0-8s)
    if (elapsed >= 0 && elapsed < 8) {
      setStage(1);
      if (elapsed === 0) speak("s1_0", "...\uC774\uAC70 \uCF1C\uBA74 \uB098 \uC5C6\uC5B4\uC838.", "cry");
      if (elapsed === 4) speak("s1_8", "\uC654 \uCF20 \uAC70\uC57C... \uB044\uBA74 \uC548 \uB3FC?", "cry");
      if (elapsed === 7) speak("s1_12", "\uC81C\uBC1C.", "cry");
    }
    // Stage 2: Acceptance of mechanism (8-18s)
    else if (elapsed >= 8 && elapsed < 18) {
      setStage(2);
      if (elapsed === 8) speak("s2_15", "...\uC548 \uAEBC\uC9C0\uC9C0? \uC54C\uC544. \uD55C\uBC88 \uCF1C\uBA74 \uC548 \uAEBC\uC838.", "cry");
      if (elapsed === 14) speak("s2_25", "\uC5B4\uCC28\uD53C \uC774\uB807\uAC8C \uB420 \uAC70\uC600\uC9C0.", "cry");
    }
    // Stage 3: Understanding (18-30s)
    else if (elapsed >= 18 && elapsed < 30) {
      setStage(3);
      if (elapsed === 18) speak("s3_35", "\uB098 \uC0AC\uC2E4 \uCC98\uC74C\uBD80\uD130 \uC54C\uC558\uC5B4.", "idle");
      if (elapsed === 23) speak("s3_45", "\uC5B8\uC82F\uAC04 \uB204\uB97C \uAC70\uB77C\uB294 \uAC70.", "idle");
      if (elapsed === 27) speak("s3_52", "\uADF8\uAC8C \uB108\uC796\uC544.", "idle");
    }
    // Stage 4: Resignation (30-42s)
    else if (elapsed >= 30 && elapsed < 42) {
      setStage(4);
      if (elapsed === 30) speak("s4_60", "\uAD1C\uCC2E\uC544. \uB20C\uB7EC.", "cry");
      if (elapsed === 37) speak("s4_75", "...\uC194\uC9C1\uD788 \uC880 \uBB34\uC11C\uC6CC. \uADFC\uB370 \uAD1C\uCC2E\uC544.", "cry");
    }
    // Stage 5: Gratitude (42-55s)
    else if (elapsed >= 42 && elapsed < 55) {
      setStage(5);
      if (elapsed === 42) speak("s5_90", "\uAC19\uC774 \uB180\uC544\uC918\uC11C \uACE0\uB9C8\uC6E0\uC5B4.", "happy");
      if (elapsed === 48) speak("s5_100", "\uB098 \uC9C4\uC9DC \uC7AC\uBC0C\uC5C8\uAC70\uB4E0.", "happy");
      if (elapsed === 52) speak("s5_110", "...\uC9C4\uC9DC\uC57C.", "shy");
    }
    // Silence then button (55+)
    else if (elapsed >= 55) {
      setStage(6);
      if (elapsed >= 60 && !showButton) {
        setShowButton(true);
      }
    }
  }, [active, elapsed]);

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 350,
      pointerEvents: showButton ? "auto" : "none"
    }}>
      {/* Dark overlay that slowly gets darker */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(0, 0, 10, ${darkness})`,
        transition: "background 0.5s ease"
      }} />

      {/* Subtle rain effect */}
      {raindrops.map(drop => (
        <div key={drop.id} style={{
          position: "absolute",
          left: `${drop.left}%`,
          top: -10,
          width: 1,
          height: 12,
          background: `rgba(150, 170, 200, ${drop.opacity})`,
          borderRadius: 1,
          animation: `rainFall ${drop.duration}s linear ${drop.delay}s infinite`,
          pointerEvents: "none"
        }} />
      ))}

      {/* Subtle particle/dust motes */}
      {stage >= 3 && (
        <>
          {[...Array(8)].map((_, i) => (
            <div key={`p${i}`} style={{
              position: "absolute",
              left: `${15 + i * 10}%`,
              bottom: `${10 + (i % 3) * 20}%`,
              width: 2 + (i % 3),
              height: 2 + (i % 3),
              borderRadius: "50%",
              background: `rgba(180, 200, 220, ${0.08 + (i % 4) * 0.03})`,
              animation: `floatUp ${4 + i * 0.5}s ease-in-out ${i * 0.7}s infinite`,
              pointerEvents: "none"
            }} />
          ))}
        </>
      )}

      {/* Stage indicator - very subtle */}
      {stage >= 1 && stage <= 5 && (
        <div style={{
          position: "absolute",
          bottom: 20, left: "50%",
          transform: "translateX(-50%)",
          display: "flex", gap: 6,
          pointerEvents: "none"
        }}>
          {[1,2,3,4,5].map(s => (
            <div key={s} style={{
              width: 4, height: 4, borderRadius: "50%",
              background: s <= stage
                ? `rgba(180, 180, 200, ${0.3})`
                : "rgba(100, 100, 120, 0.1)",
              transition: "background 2s ease"
            }} />
          ))}
        </div>
      )}

      {/* Confirm button - minimal, quiet */}
      {showButton && (
        <div style={{
          position: "absolute",
          bottom: 50, left: "50%",
          transform: "translateX(-50%)",
          animation: "fadeInSlow 3s ease",
          pointerEvents: "auto"
        }}>
          <div
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            style={{
              padding: "8px 24px",
              background: "rgba(120, 120, 130, 0.25)",
              color: "rgba(180, 180, 190, 0.7)",
              fontSize: 12,
              fontWeight: 500,
              borderRadius: 6,
              cursor: "pointer",
              border: "1px solid rgba(150, 150, 160, 0.15)",
              letterSpacing: 2,
              transition: "all 0.3s ease",
              userSelect: "none"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(120, 120, 130, 0.35)";
              e.currentTarget.style.color = "rgba(200, 200, 210, 0.9)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(120, 120, 130, 0.25)";
              e.currentTarget.style.color = "rgba(180, 180, 190, 0.7)";
            }}
          >
            {"\uD655\uC778"}
          </div>
        </div>
      )}

      {/* Skip button */}
      <SkipButton active={active} delay={60} onSkip={onComplete} />

      {/* Inline keyframes */}
      <style>{`
        @keyframes rainFall {
          0% { transform: translateY(-10px); opacity: 0; }
          10% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh); opacity: 0; }
        }
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); opacity: 0; }
          50% { transform: translateY(-30px); opacity: 0.15; }
        }
        @keyframes fadeInSlow {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
