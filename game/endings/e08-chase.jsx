// E08: 피지컬 — 버튼 드래그 → 도망가는 버튼 추격전
function E08Chase({ active, onComplete, onDismiss, say }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [caught, setCaught] = useState(false);
  const [started, setStarted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [trail, setTrail] = useState([]);
  const [spokeChase, setSpokeChase] = useState(false);
  const [spokeNearMiss, setSpokeNearMiss] = useState(false);
  const [spokeSlow, setSpokeSlow] = useState(false);
  const [spokeTired, setSpokeTired] = useState(false);
  const containerRef = useRef(null);
  const mouseRef = useRef({ x: 50, y: 50 });
  const posRef = useRef({ x: 50, y: 50 });
  const animRef = useRef(null);
  const nearMissRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setCaught(false); setStarted(false); setElapsed(0);
      setTrail([]); setSpokeChase(false); setSpokeNearMiss(false);
      setSpokeSlow(false); setSpokeTired(false);
      posRef.current = { x: 50, y: 50 };
      setPos({ x: 50, y: 50 });
      nearMissRef.current = false;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      return;
    }

    // Initial dialogue
    say("야!! 그거 비싼 건데!!", "excited");

    // After 1s: button appears and starts running
    const t1 = setTimeout(() => {
      say("아!! 떨어졌잖아!! ...어? 도망간다.", "shocked");
    }, 1000);

    const t2 = setTimeout(() => {
      setStarted(true);
      say("잡아!! 빨리!! 뭐하는 거야 느려터졌네!!", "excited");
      setSpokeChase(true);
    }, 2500);

    return () => {
      clearTimeout(t1); clearTimeout(t2);
    };
  }, [active]);

  // Elapsed timer
  useEffect(() => {
    if (!active || !started || caught) return;
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [active, started, caught]);

  // Dialogue triggers based on elapsed time
  useEffect(() => {
    if (!active || !started || caught) return;
    if (elapsed >= 10 && !spokeSlow) {
      setSpokeSlow(true);
      say("너 운동 안 하지? 티 나거든.", "pouty");
    }
    if (elapsed >= 15 && !spokeTired) {
      setSpokeTired(true);
      say("봐봐 지쳤잖아. 지금 가. 빨리.", "smug");
    }
  }, [active, started, caught, elapsed, spokeSlow, spokeTired]);

  // Button movement animation loop
  useEffect(() => {
    if (!active || !started || caught) return;

    const tick = () => {
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const bx = posRef.current.x;
      const by = posRef.current.y;

      const dx = bx - mx;
      const dy = by - my;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Determine speed based on elapsed time
      let speed = 3.5;
      let fleeRadius = 22;
      if (elapsed >= 20) {
        // Stopped
        speed = 0;
      } else if (elapsed >= 15) {
        // Very slow - tired
        speed = 0.8;
        fleeRadius = 12;
      } else if (elapsed >= 10) {
        // Slower
        speed = 2.0;
        fleeRadius = 16;
      }

      // Near miss detection
      if (distance < 10 && distance > 3 && !nearMissRef.current && elapsed < 20) {
        nearMissRef.current = true;
        if (!spokeNearMiss) {
          setSpokeNearMiss(true);
          say("오오 거의\u2014아 놓쳤네. 역시 너답다.", "smug");
        }
        setTimeout(() => { nearMissRef.current = false; }, 3000);
      }

      let newX = bx;
      let newY = by;

      if (distance < fleeRadius && speed > 0) {
        const angle = Math.atan2(dy, dx);
        // Add some randomness to movement
        const jitter = (Math.random() - 0.5) * 0.8;
        newX = bx + Math.cos(angle + jitter) * speed;
        newY = by + Math.sin(angle + jitter) * speed;
      } else if (speed > 0 && elapsed < 15) {
        // Wander slightly when not being chased
        newX = bx + (Math.random() - 0.5) * 0.5;
        newY = by + (Math.random() - 0.5) * 0.5;
      }

      // Bounce off edges
      newX = clamp(newX, 6, 94);
      newY = clamp(newY, 8, 92);

      // Bounce: if at edge, nudge towards center
      if (newX <= 6 || newX >= 94) {
        newX = clamp(bx + (50 - bx) * 0.1, 6, 94);
      }
      if (newY <= 8 || newY >= 92) {
        newY = clamp(by + (50 - by) * 0.1, 8, 92);
      }

      posRef.current = { x: newX, y: newY };
      setPos({ x: newX, y: newY });

      // Add to trail
      setTrail(prev => {
        const next = [...prev, { x: newX, y: newY, id: Date.now() }];
        return next.slice(-15);
      });

      animRef.current = requestAnimationFrame(tick);
    };

    animRef.current = requestAnimationFrame(tick);
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, [active, started, caught, elapsed, spokeNearMiss]);

  // Mouse tracking
  const handleMouseMove = useCallback((e) => {
    if (!started || caught || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseRef.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    };
  }, [started, caught]);

  const handleCatch = useCallback((e) => {
    e.stopPropagation();
    if (caught) return;
    setCaught(true);
    say("잡았다!", "excited");
    if (animRef.current) cancelAnimationFrame(animRef.current);
  }, [caught, say, onComplete]);

  if (!active) return null;

  const isTired = elapsed >= 15;
  const isStopped = elapsed >= 20;
  const buttonSize = isTired ? 36 : 40;

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "absolute", inset: 0, zIndex: 350,
        cursor: "crosshair",
        background: "rgba(0,0,0,0.05)"
      }}
    >
      {/* Dotted line from cursor to button */}
      {started && !caught && (
        <svg style={{
          position: "absolute", inset: 0, width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 351
        }}>
          <line
            x1={`${mouseRef.current.x}%`} y1={`${mouseRef.current.y}%`}
            x2={`${pos.x}%`} y2={`${pos.y}%`}
            stroke="rgba(232,87,61,0.25)"
            strokeWidth="1.5"
            strokeDasharray="6,4"
          />
        </svg>
      )}

      {/* Trail dots */}
      {started && !caught && trail.map((t, i) => (
        <div key={t.id} style={{
          position: "absolute",
          left: `${t.x}%`, top: `${t.y}%`,
          width: 4, height: 4,
          borderRadius: "50%",
          background: `rgba(232,87,61,${(i / trail.length) * 0.3})`,
          transform: "translate(-50%,-50%)",
          pointerEvents: "none",
          transition: "opacity 0.3s"
        }} />
      ))}

      {/* The running button */}
      {started && (
        <div
          onClick={handleCatch}
          style={{
            position: "absolute",
            left: `${pos.x}%`, top: `${pos.y}%`,
            transform: `translate(-50%,-50%) ${isTired && !isStopped ? "rotate(" + Math.sin(Date.now() * 0.01) * 15 + "deg)" : ""}`,
            width: buttonSize, height: buttonSize,
            borderRadius: "50%",
            background: caught
              ? "radial-gradient(circle at 36% 28%, #4caf50, #388e3c)"
              : "radial-gradient(circle at 36% 28%, #e8573d, #c0392b)",
            boxShadow: caught
              ? "0 4px 16px rgba(76,175,80,0.4)"
              : `0 6px 20px rgba(232,87,61,0.4)`,
            cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: caught ? 14 : 16,
            color: "#fff", fontWeight: 800,
            zIndex: 360,
            transition: isStopped ? "left 0.5s ease, top 0.5s ease" : "none",
            animation: isStopped && !caught
              ? "gentleBob 1.5s ease infinite"
              : isTired && !caught
                ? "shake 0.3s ease infinite"
                : !caught ? "none" : "popIn 0.3s ease"
          }}
        >
          {caught ? "!" : "!"}
        </div>
      )}

      {/* Caught: MiniNuclearButton at bottom center */}
      {caught && (
        <div style={{
          position: "absolute",
          bottom: "15%", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 362,
          animation: "fadeIn 0.5s ease"
        }}>
          <MiniNuclearButton label="잡았다!" onPress={onComplete} />
        </div>
      )}

      {/* Instructions */}
      {started && !caught && elapsed < 5 && (
        <div style={{
          position: "absolute", bottom: 40, left: "50%",
          transform: "translateX(-50%)",
          fontSize: 12, color: "#e8573d", fontWeight: 700,
          letterSpacing: 2, animation: "pulse 1.5s ease infinite",
          pointerEvents: "none"
        }}>
          빨간 버튼을 클릭하세요!
        </div>
      )}

      {/* Skip button */}
      <SkipButton active={active && !caught} delay={8} onSkip={onDismiss} />

      {/* Tired indicator */}
      {isTired && !caught && (
        <div style={{
          position: "absolute",
          left: `${pos.x + 3}%`, top: `${pos.y - 6}%`,
          transform: "translate(-50%,-100%)",
          fontSize: 10, color: "#888",
          animation: "zzz 2s ease infinite",
          pointerEvents: "none", zIndex: 361
        }}>
          {isStopped ? "..." : "z"}
        </div>
      )}
    </div>
  );
}
