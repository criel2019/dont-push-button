// E13: 쫄보 — 안전커버 열림 → 사이렌 + 카운트다운 10초
function E13Coward({ active, onComplete, onDismiss, say, doShake }) {
  const [count, setCount] = useState(10);
  const [started, setStarted] = useState(false);
  const [flash, setFlash] = useState(false);
  const [whiteout, setWhiteout] = useState(false);
  const [calm, setCalm] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [sirenTick, setSirenTick] = useState(0);
  const completedRef = useRef(false);

  // Reset on deactivate
  useEffect(() => {
    if (!active) {
      setCount(10);
      setStarted(false);
      setFlash(false);
      setWhiteout(false);
      setCalm(false);
      setShowButton(false);
      setSirenTick(0);
      completedRef.current = false;
      return;
    }
    // Start sequence
    setStarted(true);
    say("야?! 왜 열어 그걸?! 건드리지 말라 했잖아!!", "shocked");
    doShake();
  }, [active]);

  // Siren alternating tick
  useEffect(() => {
    if (!active || !started || calm) return;
    const iv = setInterval(() => setSirenTick(p => p + 1), 500);
    return () => clearInterval(iv);
  }, [active, started, calm]);

  // Countdown timer
  useEffect(() => {
    if (!active || !started || count <= 0 || calm) return;
    const t = setTimeout(() => setCount(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [active, started, count, calm]);

  // Dialogue triggers at specific counts
  useEffect(() => {
    if (!active || !started) return;
    if (count === 8) {
      say("어떡해 어떡해 어떡해", "shocked");
    }
    if (count === 5) {
      say("멈춰!! 제발!! 나 아직 하고 싶은 거 많아!!", "cry");
    }
    if (count === 3) {
      say("끝이다... 다 끝났어...", "cry");
      setShowButton(true);
    }
    if (count === 2) {
      say("제발!! 저거!! 저거 눌러!!!", "cry");
    }
    if (count === 1) {
      setWhiteout(true);
    }
    if (count === 0) {
      // Brief pause then calm
      setTimeout(() => {
        setWhiteout(false);
        setCalm(true);
        // Auto-complete after 2s if button wasn't pressed
        setTimeout(() => {
          if (!completedRef.current) {
            completedRef.current = true;
            onComplete();
          }
        }, 2000);
      }, 800);
    }
  }, [count, active, started]);

  // Flash effect for high counts
  useEffect(() => {
    if (!active || !started || calm) return;
    if (count >= 9) {
      const iv = setInterval(() => setFlash(p => !p), 300);
      return () => clearInterval(iv);
    }
  }, [active, started, count, calm]);

  const handleEmergencyStop = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setCalm(true);
    setWhiteout(false);
    onComplete();
  };

  if (!active) return null;

  const sirenEven = sirenTick % 2 === 0;
  const pulseIntensity = calm ? 0 : Math.max(0.15, (10 - count) / 10 * 0.6);

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      overflow: "hidden"
    }}>
      {/* Red alarm overlay with pulsing */}
      {!calm && (
        <div style={{
          position: "absolute", inset: 0,
          background: flash
            ? `rgba(255, 20, 20, ${pulseIntensity + 0.1})`
            : `rgba(200, 0, 0, ${pulseIntensity})`,
          transition: "background 0.2s",
          animation: "sirenPulse 1s ease infinite"
        }} />
      )}

      {/* Calm overlay */}
      {calm && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0, 0, 0, 0.3)",
          animation: "fadeIn 0.5s ease"
        }} />
      )}

      {/* White flash */}
      {whiteout && (
        <div style={{
          position: "absolute", inset: 0,
          background: "#fff",
          zIndex: 10,
          animation: "fadeIn 0.15s ease"
        }} />
      )}

      {/* Siren corners - top left */}
      {!calm && (
        <>
          <div style={{
            position: "absolute", top: 16, left: 16,
            fontSize: 36, zIndex: 5,
            opacity: sirenEven ? 1 : 0.3,
            transition: "opacity 0.2s",
            filter: sirenEven ? "hue-rotate(0deg)" : "hue-rotate(220deg)"
          }}>
            {"\uD83D\uDEA8"}
          </div>
          {/* top right */}
          <div style={{
            position: "absolute", top: 16, right: 16,
            fontSize: 36, zIndex: 5,
            opacity: sirenEven ? 0.3 : 1,
            transition: "opacity 0.2s",
            filter: sirenEven ? "hue-rotate(220deg)" : "hue-rotate(0deg)"
          }}>
            {"\uD83D\uDEA8"}
          </div>
          {/* bottom left */}
          <div style={{
            position: "absolute", bottom: 16, left: 16,
            fontSize: 36, zIndex: 5,
            opacity: sirenEven ? 0.3 : 1,
            transition: "opacity 0.2s",
            filter: sirenEven ? "hue-rotate(220deg)" : "hue-rotate(0deg)"
          }}>
            {"\uD83D\uDEA8"}
          </div>
          {/* bottom right */}
          <div style={{
            position: "absolute", bottom: 16, right: 16,
            fontSize: 36, zIndex: 5,
            opacity: sirenEven ? 1 : 0.3,
            transition: "opacity 0.2s",
            filter: sirenEven ? "hue-rotate(0deg)" : "hue-rotate(220deg)"
          }}>
            {"\uD83D\uDEA8"}
          </div>
        </>
      )}

      {/* CRT spinning effect at count 8 */}
      {count <= 8 && count > 0 && !calm && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.05) 2px, rgba(0,0,0,0.05) 4px)",
          animation: count === 8 ? "crtSpin 0.3s ease" : "none"
        }} />
      )}

      {/* Large countdown number */}
      {!calm && count > 0 && (
        <div key={count} style={{
          position: "absolute",
          top: "36%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 6, textAlign: "center"
        }}>
          <div style={{
            fontSize: count <= 3 ? 160 : 130,
            fontWeight: 900,
            color: count <= 3 ? "#ff0000" : "#e8573d",
            textShadow: count <= 3
              ? "0 0 60px rgba(255,0,0,0.8), 0 0 120px rgba(255,0,0,0.4)"
              : "0 0 40px rgba(232,87,61,0.5), 0 10px 50px rgba(232,87,61,0.3)",
            animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            fontFamily: "'Noto Sans KR', sans-serif",
            lineHeight: 1
          }}>
            {count}
          </div>
        </div>
      )}

      {/* Count 0 - explosion then calm */}
      {count === 0 && !calm && (
        <div style={{
          position: "absolute",
          top: "36%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 6, textAlign: "center",
          fontSize: 100,
          animation: "popIn 0.3s ease"
        }}>
          {"\uD83D\uDCA5"}
        </div>
      )}

      {/* Calm state message */}
      {calm && (
        <div style={{
          position: "absolute",
          top: "36%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 6, textAlign: "center",
          animation: "fadeIn 0.8s ease"
        }}>
          <div style={{
            fontSize: 48, fontWeight: 800, color: "#aaa",
            marginBottom: 12
          }}>
            ...
          </div>
          <div style={{
            fontSize: 14, color: "#888"
          }}>
            (아무 일도 일어나지 않았다)
          </div>
        </div>
      )}

      {/* Emergency stop button */}
      {showButton && !completedRef.current && (
        <div style={{
          position: "absolute",
          bottom: 60, left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20
        }}>
          <MiniNuclearButton label="긴급 정지" onPress={handleEmergencyStop} />
        </div>
      )}

      {/* Inline keyframe styles */}
      {/* Skip button */}
      <SkipButton active={active} delay={10} onSkip={onDismiss} autoDismiss={25} />

      <style>{`
        @keyframes sirenPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }
        @keyframes emergencyFlash {
          0% { border-color: #ff5252; box-shadow: 0 0 20px rgba(255,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.2); }
          100% { border-color: #ffeb3b; box-shadow: 0 0 30px rgba(255,235,59,0.5), inset 0 1px 0 rgba(255,255,255,0.2); }
        }
        @keyframes crtSpin {
          0% { transform: perspective(400px) rotateY(0deg); }
          50% { transform: perspective(400px) rotateY(10deg); }
          100% { transform: perspective(400px) rotateY(0deg); }
        }
      `}</style>
    </div>
  );
}
