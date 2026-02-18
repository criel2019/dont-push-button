// E18: 현실 만남 — 문 반복 노크 10회 → 문 열림 → 빛
function E18Door({ active, onComplete, onDismiss, say, doorOpen }) {
  const [phase, setPhase] = useState(0);
  const [showEnter, setShowEnter] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [lightIntensity, setLightIntensity] = useState(0);
  const [particles, setParticles] = useState([]);
  const completedRef = useRef(false);

  // Generate floating particles in the light
  useEffect(() => {
    if (!active) return;
    const pts = [];
    for (let i = 0; i < 30; i++) {
      pts.push({
        id: i,
        x: 35 + Math.random() * 30,
        y: Math.random() * 100,
        size: 1 + Math.random() * 3,
        speed: 0.3 + Math.random() * 0.8,
        drift: (Math.random() - 0.5) * 0.3,
        opacity: 0.2 + Math.random() * 0.5,
        delay: Math.random() * 5
      });
    }
    setParticles(pts);
  }, [active]);

  // Reset on deactivate
  useEffect(() => {
    if (!active) {
      setPhase(0);
      setShowEnter(false);
      setLeaving(false);
      setLightIntensity(0);
      completedRef.current = false;
      return;
    }

    // Phase 0: Door opens, blinding light
    say("...", "shocked");

    // Gradually increase light
    let lightVal = 0;
    const lightIv = setInterval(() => {
      lightVal += 0.02;
      if (lightVal >= 1) { clearInterval(lightIv); lightVal = 1; }
      setLightIntensity(lightVal);
    }, 50);

    // Phase 1: "나는 못 가."
    const t1 = setTimeout(() => {
      setPhase(1);
      say("\uB098\uB294 \uBABB \uAC00.", "idle");
    }, 3000);

    // Phase 2: "여기 밖으로는... 안 돼."
    const t2 = setTimeout(() => {
      setPhase(2);
      say("\uC5EC\uAE30 \uBC16\uC73C\uB85C\uB294... \uC548 \uB3FC.", "worried");
    }, 6000);

    // Phase 3: "네가 가." + show Enter button
    const t3 = setTimeout(() => {
      setPhase(3);
      say("\uB124\uAC00 \uAC00.", "idle");
    }, 9000);

    const t4 = setTimeout(() => {
      setShowEnter(true);
    }, 10500);

    return () => {
      clearInterval(lightIv);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [active]);

  const handleEnter = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    setLeaving(true);
    say("...가는 거야?", "worried");

    setTimeout(() => {
      say("잘 가.", "idle");
    }, 3000);

    setTimeout(() => {
      onComplete();
    }, 5000);
  };

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      overflow: "hidden"
    }}>
      {/* Darkened surroundings (silhouette effect) */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${0.6 - lightIntensity * 0.1})`,
        transition: "background 0.5s"
      }} />

      {/* Door frame - center of screen */}
      <div style={{
        position: "absolute",
        top: "5%", left: "50%",
        transform: "translateX(-50%)",
        width: 200, height: "90%",
        zIndex: 2
      }}>
        {/* Door frame border */}
        <div style={{
          position: "absolute", inset: -8,
          border: "8px solid #1a1008",
          borderRadius: 4,
          boxShadow: "0 0 40px rgba(0,0,0,0.5), inset 0 0 30px rgba(0,0,0,0.3)",
          zIndex: 1
        }} />

        {/* Light from door opening */}
        <div style={{
          position: "absolute", inset: 0,
          background: `rgba(255,248,230,${lightIntensity * 0.95})`,
          boxShadow: `0 0 ${80 + lightIntensity * 120}px rgba(255,240,200,${lightIntensity * 0.6}),
                       0 0 ${200 + lightIntensity * 200}px rgba(255,230,180,${lightIntensity * 0.3})`,
          transition: "all 0.3s"
        }} />

        {/* God rays */}
        {lightIntensity > 0.3 && (
          <>
            {[
              { angle: -25, width: 120, left: "30%", opacity: 0.08 },
              { angle: -10, width: 80, left: "45%", opacity: 0.12 },
              { angle: 5, width: 100, left: "55%", opacity: 0.1 },
              { angle: 20, width: 140, left: "65%", opacity: 0.06 },
              { angle: -35, width: 60, left: "20%", opacity: 0.05 },
              { angle: 30, width: 90, left: "75%", opacity: 0.07 },
            ].map((ray, i) => (
              <div key={i} style={{
                position: "absolute",
                top: 0, left: ray.left,
                width: ray.width,
                height: "250%",
                background: `linear-gradient(180deg, rgba(255,240,200,${ray.opacity * lightIntensity}), transparent 70%)`,
                transform: `rotate(${ray.angle}deg)`,
                transformOrigin: "top center",
                pointerEvents: "none",
                animation: `pulse ${3 + i * 0.5}s ease infinite`
              }} />
            ))}
          </>
        )}
      </div>

      {/* Floating particles in light */}
      {particles.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`,
          top: `${(p.y + (Date.now() * 0.001 * p.speed + p.delay) * 5) % 120 - 10}%`,
          width: p.size, height: p.size,
          borderRadius: "50%",
          background: `rgba(255,240,200,${p.opacity * lightIntensity})`,
          boxShadow: p.size > 2 ? `0 0 ${p.size * 2}px rgba(255,230,180,${p.opacity * 0.5 * lightIntensity})` : "none",
          pointerEvents: "none",
          animation: `float ${3 + p.delay}s ease infinite`
        }} />
      ))}

      {/* Wide ambient light glow */}
      <div style={{
        position: "absolute",
        top: "10%", left: "50%",
        transform: "translateX(-50%)",
        width: "80%", height: "80%",
        background: `radial-gradient(ellipse at 50% 30%, rgba(255,240,200,${lightIntensity * 0.15}), transparent 70%)`,
        pointerEvents: "none",
        zIndex: 1
      }} />

      {/* Enter button */}
      {showEnter && !leaving && (
        <div style={{
          position: "absolute",
          bottom: "18%", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          animation: "fadeInUp 0.8s ease"
        }}>
          <div
            onClick={(e) => { e.stopPropagation(); handleEnter(); }}
            style={{
              padding: "16px 48px",
              background: "rgba(255,255,255,0.95)",
              color: "#8d6e63",
              fontSize: 18, fontWeight: 800,
              borderRadius: 14,
              cursor: "pointer",
              letterSpacing: 6,
              border: "none",
              boxShadow: `0 0 30px rgba(255,240,200,0.6), 0 8px 32px rgba(255,230,180,0.4)`,
              animation: "glowPulse 2s ease infinite",
              transition: "all 0.3s"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = "0 0 50px rgba(255,240,200,0.8), 0 12px 40px rgba(255,230,180,0.6)";
              e.currentTarget.style.transform = "scale(1.05)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = "0 0 30px rgba(255,240,200,0.6), 0 8px 32px rgba(255,230,180,0.4)";
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            Enter
          </div>
        </div>
      )}

      {/* Leaving: screen goes white */}
      {leaving && (
        <div style={{
          position: "absolute", inset: 0, zIndex: 20,
          background: "#fff",
          opacity: 0,
          animation: "doorWhiteout 5s ease forwards"
        }} />
      )}

      {/* Skip button */}
      <SkipButton active={active} delay={10} onSkip={onDismiss} autoDismiss={25} />

      <style>{`
        @keyframes doorWhiteout {
          0% { opacity: 0; }
          40% { opacity: 0.3; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
