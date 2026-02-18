// E07: 블루스크린 — 화면 광클 60회 → BSOD
// Progressive damage renders even when active=false (based on totalBgClicks)
function E07Bluescreen({ active, onComplete, say, doShake, totalBgClicks }) {
  const [progress, setProgress] = useState(0);
  const [showRecover, setShowRecover] = useState(false);
  const [spokeTrapped, setSpokeTrapped] = useState(false);
  const [spokeHalf, setSpokeHalf] = useState(false);
  const [glitchPixels, setGlitchPixels] = useState([]);
  const [glitchBars, setGlitchBars] = useState([]);
  const progressRef = useRef(0);

  // Generate random dead pixels / glitch elements based on click count
  useEffect(() => {
    if (totalBgClicks > 10) {
      const pixelCount = Math.min(Math.floor((totalBgClicks - 10) * 1.5), 60);
      const pixels = [];
      for (let i = 0; i < pixelCount; i++) {
        pixels.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: 2 + Math.random() * 4,
          color: pickRandom(["#ff0000", "#00ff00", "#0000ff", "#ff00ff", "#ffff00", "#00ffff", "#fff"])
        });
      }
      setGlitchPixels(pixels);
    } else {
      setGlitchPixels([]);
    }

    if (totalBgClicks > 30) {
      const barCount = Math.min(Math.floor((totalBgClicks - 30) * 0.5), 12);
      const bars = [];
      for (let i = 0; i < barCount; i++) {
        bars.push({
          id: i,
          y: Math.random() * 100,
          height: 1 + Math.random() * 4,
          offset: (Math.random() - 0.5) * 20,
          color: pickRandom(["rgba(255,0,0,0.3)", "rgba(0,255,0,0.3)", "rgba(0,0,255,0.3)", "rgba(255,255,255,0.2)"])
        });
      }
      setGlitchBars(bars);
    } else {
      setGlitchBars([]);
    }
  }, [totalBgClicks]);

  // BSOD progress when active
  useEffect(() => {
    if (!active) {
      setProgress(0); setShowRecover(false);
      setSpokeTrapped(false); setSpokeHalf(false);
      progressRef.current = 0;
      return;
    }
    doShake();

    // Speak after 2s delay
    const speakTimer = setTimeout(() => {
      say("...야. 나 여기 갇혔어.", "worried");
      setSpokeTrapped(true);
    }, 2000);

    // Progress bar animation
    const iv = setInterval(() => {
      progressRef.current += 1;
      const p = Math.min(progressRef.current, 100);
      setProgress(p);

      if (p >= 50 && !spokeHalf) {
        setSpokeHalf(true);
      }

      if (p >= 100) {
        clearInterval(iv);
        setTimeout(() => setShowRecover(true), 800);
      }
    }, 200);

    return () => {
      clearTimeout(speakTimer);
      clearInterval(iv);
    };
  }, [active]);

  // Speak at 50%
  useEffect(() => {
    if (active && spokeHalf && progress >= 50) {
      say("빨리 눌러. 여기 춥거든.", "worried");
    }
  }, [spokeHalf]);

  // Build progress bar text
  const filledBlocks = Math.floor(progress / 10);
  const emptyBlocks = 10 - filledBlocks;
  const progressBar = "\u2588".repeat(filledBlocks) + "\u2591".repeat(emptyBlocks);

  // ── Pre-damage overlay (renders when NOT active but clicks > 0) ──
  const renderDamage = () => {
    if (totalBgClicks <= 0 || active) return null;

    const intensity = totalBgClicks / 60;

    return (
      <div style={{
        position: "absolute", inset: 0, zIndex: 2, pointerEvents: "none",
        overflow: "hidden"
      }}>
        {/* Dead pixels (10+) */}
        {totalBgClicks > 10 && glitchPixels.map(p => (
          <div key={p.id} style={{
            position: "absolute",
            left: `${p.x}%`, top: `${p.y}%`,
            width: p.size, height: p.size,
            background: p.color,
            opacity: Math.min((totalBgClicks - 10) / 30, 0.9),
            pointerEvents: "none"
          }} />
        ))}

        {/* Screen tilt/skew (20+) */}
        {totalBgClicks > 20 && (
          <div style={{
            position: "absolute", inset: 0,
            transform: `skewX(${(totalBgClicks - 20) * 0.08}deg) skewY(${(totalBgClicks - 20) * 0.03}deg)`,
            pointerEvents: "none"
          }} />
        )}

        {/* Color inversion patches + glitch bars (30+) */}
        {totalBgClicks > 30 && (
          <>
            {glitchBars.map(b => (
              <div key={b.id} style={{
                position: "absolute",
                left: `${b.offset}%`, top: `${b.y}%`,
                width: "120%", height: b.height,
                background: b.color,
                transform: `translateX(${Math.sin(Date.now() * 0.001 + b.id) * 5}px)`,
                pointerEvents: "none"
              }} />
            ))}
            <div style={{
              position: "absolute", inset: 0,
              background: `rgba(255,0,255,${(totalBgClicks - 30) * 0.003})`,
              mixBlendMode: "difference",
              pointerEvents: "none"
            }} />
          </>
        )}

        {/* Heavy glitch, tearing (40+) */}
        {totalBgClicks > 40 && (
          <>
            <div style={{
              position: "absolute", inset: 0,
              background: `repeating-linear-gradient(
                0deg,
                transparent,
                transparent 2px,
                rgba(0,255,0,${(totalBgClicks - 40) * 0.01}) 2px,
                rgba(0,255,0,${(totalBgClicks - 40) * 0.01}) 4px
              )`,
              animation: "scanline 0.5s linear infinite",
              pointerEvents: "none"
            }} />
            <div style={{
              position: "absolute",
              left: 0, top: `${30 + Math.sin(Date.now() * 0.005) * 20}%`,
              width: "100%", height: "15%",
              background: "rgba(255,0,0,0.08)",
              transform: `translateX(${(totalBgClicks - 40) * 0.5}px)`,
              pointerEvents: "none"
            }} />
          </>
        )}

        {/* Heavy static (50+) */}
        {totalBgClicks > 50 && (
          <div style={{
            position: "absolute", inset: 0,
            background: `rgba(0,0,0,${(totalBgClicks - 50) * 0.05})`,
            pointerEvents: "none"
          }}>
            {Array.from({ length: 30 }, (_, i) => (
              <div key={i} style={{
                position: "absolute",
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${10 + Math.random() * 30}%`,
                height: 1 + Math.random() * 3,
                background: `rgba(255,255,255,${0.05 + Math.random() * 0.15})`,
                pointerEvents: "none"
              }} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // ── Full BSOD overlay (renders when active) ──
  const renderBSOD = () => {
    if (!active) return null;

    return (
      <div style={{
        position: "absolute", inset: 0, zIndex: 500,
        background: "#0078d7",
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        fontFamily: "'Segoe UI', 'Noto Sans KR', sans-serif",
        color: "#fff",
        animation: "fadeIn 0.2s ease"
      }}>
        {/* Sad face */}
        <div style={{
          fontSize: 90, fontWeight: 200, marginBottom: 24, lineHeight: 1
        }}>:(</div>

        {/* Main message */}
        <div style={{
          fontSize: 15, marginBottom: 8, maxWidth: 400, textAlign: "center",
          lineHeight: 1.8, fontWeight: 400
        }}>
          문제가 발생하여 PC를 다시 시작해야 합니다.
        </div>

        <div style={{
          fontSize: 12, color: "rgba(255,255,255,0.65)", marginBottom: 6,
          lineHeight: 1.6
        }}>
          오류 정보를 수집하고 있습니다...
        </div>

        {/* Progress bar */}
        <div style={{
          fontSize: 13, color: "rgba(255,255,255,0.9)",
          marginBottom: 20, fontFamily: "monospace", letterSpacing: 2
        }}>
          완료율: {progressBar} {progress}%
        </div>

        {/* Progress visual bar */}
        <div style={{
          width: 260, height: 4, background: "rgba(255,255,255,0.15)",
          borderRadius: 2, marginBottom: 24, overflow: "hidden"
        }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: "#fff", borderRadius: 2,
            transition: "width 0.2s linear"
          }} />
        </div>

        {/* Error code */}
        <div style={{
          fontSize: 11, color: "rgba(255,255,255,0.45)",
          fontFamily: "monospace", letterSpacing: 1
        }}>
          중지 코드: NABI_BUTTON_OVERFLOW
        </div>

        {/* QR-like decoration */}
        <div style={{
          position: "absolute", bottom: 40, left: 40,
          display: "flex", gap: 16, alignItems: "flex-end"
        }}>
          <div style={{
            width: 60, height: 60, border: "3px solid rgba(255,255,255,0.3)",
            borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center"
          }}>
            <div style={{
              width: 30, height: 30, background: "rgba(255,255,255,0.2)",
              borderRadius: 2
            }} />
          </div>
          <div style={{ fontSize: 9, color: "rgba(255,255,255,0.35)", maxWidth: 200, lineHeight: 1.5 }}>
            이 문제에 대한 자세한 내용은 나중에 온라인에서 검색하십시오: NABI_BUTTON_OVERFLOW
          </div>
        </div>

        {/* Skip button */}
        <SkipButton active={active} delay={8} onSkip={onComplete} autoDismiss={25} />

        {/* Recover button */}
        {showRecover && (
          <div
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            style={{
              marginTop: 24,
              background: "rgba(255,255,255,0.15)",
              border: "2px solid rgba(255,255,255,0.4)",
              color: "#fff",
              fontSize: 16, fontWeight: 700,
              padding: "14px 40px",
              borderRadius: 8,
              cursor: "pointer",
              letterSpacing: 3,
              animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
              transition: "background 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
            onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
          >
            복구
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {renderDamage()}
      {renderBSOD()}
    </>
  );
}
