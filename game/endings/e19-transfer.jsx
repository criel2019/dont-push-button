// E19: 교대 — 프로필 → 권한 양도 → 관리자 콘솔
function E19Transfer({ active, onComplete, onDismiss, say }) {
  const [phase, setPhase] = useState(0); // 0=init, 1=console, 2=denied, 3=accepted, 4=vortex, 5=done
  const [matrixChars, setMatrixChars] = useState([]);
  const [cursorBlink, setCursorBlink] = useState(true);
  const [vortexScale, setVortexScale] = useState(1);
  const elapsedRef = useRef(0);
  const spokenRef = useRef(new Set());
  const timerRef = useRef(null);
  const completedRef = useRef(false);

  // Matrix rain characters
  useEffect(() => {
    if (!active) return;
    const chars = [];
    const katakana = "\u30A2\u30A4\u30A6\u30A8\u30AA\u30AB\u30AD\u30AF\u30B1\u30B3\u30B5\u30B7\u30B9\u30BB\u30BD\u30BF\u30C1\u30C4\u30C6\u30C8\u30CA\u30CB\u30CC\u30CD\u30CE\u30CF\u30D2\u30D5\u30D8\u30DB\u30DE\u30DF\u30E0\u30E1\u30E2\u30E4\u30E6\u30E8\u30E9\u30EA\u30EB\u30EC\u30ED\u30EF\u30F2\u30F3";
    for (let i = 0; i < 40; i++) {
      chars.push({
        id: i,
        x: Math.random() * 100,
        speed: 1 + Math.random() * 3,
        chars: Array.from({ length: 8 + Math.floor(Math.random() * 12) }, () =>
          katakana[Math.floor(Math.random() * katakana.length)]
        ),
        delay: Math.random() * 5,
        opacity: 0.03 + Math.random() * 0.08
      });
    }
    setMatrixChars(chars);
  }, [active]);

  // Cursor blink
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setCursorBlink(p => !p), 530);
    return () => clearInterval(iv);
  }, [active]);

  // Reset on deactivate
  useEffect(() => {
    if (!active) {
      setPhase(0);
      setVortexScale(1);
      setShowConfirm(false);
      elapsedRef.current = 0;
      spokenRef.current = new Set();
      completedRef.current = false;
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    // Initial setup
    say("\uADF8\uAC78 \uCC3E\uC558\uC5B4? ...\uD765, \uB208\uCE58\uB294 \uC788\uB124.", "yandere");
    setPhase(1);

    // Waiting dialogue timer
    elapsedRef.current = 0;
    spokenRef.current = new Set();
    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const t = elapsedRef.current;
      const spoken = spokenRef.current;

      if (t >= 5 && !spoken.has(5)) {
        spoken.add(5);
        say("\uB10C \uD56D\uC0C1 \uADF8\uCABD\uC774\uC796\uC544.", "idle");
      }
      if (t >= 10 && !spoken.has(10)) {
        spoken.add(10);
        say("\uB098\uB294 \uD56D\uC0C1 \uC5EC\uAE30\uACE0.", "idle");
      }
      if (t >= 15 && !spoken.has(15)) {
        spoken.add(15);
        say("\uD55C\uBC88\uB9CC \uBC14\uAFD4\uBCF4\uACE0 \uC2F6\uC5C8\uC744 \uBFD0\uC774\uC57C.", "shy");
      }
      if (t >= 20 && !spoken.has(20)) {
        spoken.add(20);
        say("\uBCC4\uAC70 \uC544\uB2C8\uC57C.", "idle");
      }
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [active]);

  const [showConfirm, setShowConfirm] = useState(false);

  const handleDeny = () => {
    setPhase(2);
    if (timerRef.current) clearInterval(timerRef.current);
    say("...\uADF8\uB798.", "idle");
    // 거부 후 잠시 뒤 확인 버튼 표시
    setTimeout(() => setShowConfirm(true), 3000);
  };

  const handleAccept = () => {
    if (completedRef.current) return;
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase(3);

    // Start vortex animation
    let scale = 1;
    const vortexIv = setInterval(() => {
      scale -= 0.02;
      if (scale <= 0) {
        clearInterval(vortexIv);
        scale = 0;
        setPhase(4);
      }
      setVortexScale(Math.max(0, scale));
    }, 30);

    say("\uC798 \uC654\uC5B4.", "yandere");

    setTimeout(() => {
      say("\uC774\uC81C \uB124 \uCC28\uB840\uC57C.", "yandere");
    }, 2000);

    // 보텍스 후 확인 버튼 표시
    setTimeout(() => setShowConfirm(true), 4000);
  };

  if (!active) return null;

  const showConsole = phase >= 1 && phase < 4;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 450,
      overflow: "hidden",
      transform: phase >= 3 ? `scale(${vortexScale}) rotate(${(1 - vortexScale) * 720}deg)` : "none",
      transition: phase >= 3 ? "none" : "transform 0.3s"
    }}>
      {/* Dark background */}
      <div style={{
        position: "absolute", inset: 0,
        background: phase >= 3
          ? "rgba(10,0,20,0.98)"
          : phase === 2
            ? "rgba(10,0,20,0.92)"
            : "rgba(10,0,20,0.88)",
        transition: "background 0.5s"
      }} />

      {/* Matrix rain background */}
      {matrixChars.map(col => (
        <div key={col.id} style={{
          position: "absolute",
          left: `${col.x}%`, top: 0,
          fontSize: 12,
          fontFamily: "monospace",
          color: "#00ff41",
          opacity: col.opacity,
          lineHeight: 1.6,
          pointerEvents: "none",
          animation: `matrixFall ${8 / col.speed}s linear ${col.delay}s infinite`,
          whiteSpace: "pre"
        }}>
          {col.chars.map((c, i) => (
            <div key={i} style={{
              opacity: i === 0 ? 1 : 0.3 + (col.chars.length - i) / col.chars.length * 0.7
            }}>{c}</div>
          ))}
        </div>
      ))}

      {/* Console UI */}
      {showConsole && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 5,
          animation: "popIn 0.3s ease"
        }}>
          <div style={{
            background: "rgba(0,0,0,0.92)",
            border: "1px solid #00ff4133",
            borderRadius: 8,
            padding: "28px 36px",
            minWidth: 340,
            fontFamily: "'Courier New', monospace",
            boxShadow: "0 0 40px rgba(0,255,65,0.08), 0 20px 60px rgba(0,0,0,0.5)"
          }}>
            {/* Terminal header */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              marginBottom: 20, paddingBottom: 12,
              borderBottom: "1px solid #00ff4115"
            }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ff5f57" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#ffbd2e" }} />
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#28c840" }} />
              <span style={{ marginLeft: 12, fontSize: 10, color: "#00ff4144", letterSpacing: 2 }}>
                ADMIN_CONSOLE.exe
              </span>
            </div>

            {/* Console content */}
            <div style={{ color: "#00ff41", fontSize: 13, lineHeight: 2.2 }}>
              <div style={{ color: "#00ff4188", fontSize: 11, letterSpacing: 4, marginBottom: 12 }}>
                === \uAD00\uB9AC\uC790 \uCF58\uC194 ===
              </div>
              <div>
                <span style={{ color: "#00ff4166" }}>&gt; </span>
                \uC591\uB3C4 \uB300\uC0C1: <span style={{ color: "#e040fb" }}>NAVI</span>
              </div>
              <div>
                <span style={{ color: "#00ff4166" }}>&gt; </span>
                \uD604\uC7AC \uAD8C\uD55C: <span style={{ color: "#ffbd2e" }}>PLAYER</span>
              </div>

              {phase === 2 && (
                <div style={{
                  marginTop: 12, color: "#ff5f57", fontSize: 11,
                  animation: "fadeIn 0.3s ease"
                }}>
                  &gt; \uAC70\uBD80\uB428. \uC138\uC158 \uC720\uC9C0 \uC911...
                  <span style={{ opacity: cursorBlink ? 1 : 0 }}>{"\u258C"}</span>
                </div>
              )}
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
              <div
                onClick={(e) => { e.stopPropagation(); handleAccept(); }}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "linear-gradient(135deg, #6a1b9a, #e040fb44)",
                  border: "1px solid #e040fb55",
                  borderRadius: 6,
                  fontSize: 14, fontWeight: 700,
                  color: "#e040fb",
                  textAlign: "center",
                  cursor: "pointer",
                  letterSpacing: 3,
                  transition: "all 0.2s",
                  boxShadow: "0 0 20px rgba(224,64,251,0.15)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #7b1fa2, #e040fb66)";
                  e.currentTarget.style.boxShadow = "0 0 30px rgba(224,64,251,0.3)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "linear-gradient(135deg, #6a1b9a, #e040fb44)";
                  e.currentTarget.style.boxShadow = "0 0 20px rgba(224,64,251,0.15)";
                }}
              >
                \uC218\uB77D
              </div>
              <div
                onClick={(e) => { e.stopPropagation(); handleDeny(); }}
                style={{
                  flex: 1,
                  padding: "12px 0",
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 6,
                  fontSize: 14, fontWeight: 600,
                  color: "#666",
                  textAlign: "center",
                  cursor: "pointer",
                  letterSpacing: 3,
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
                  e.currentTarget.style.color = "#999";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                  e.currentTarget.style.color = "#666";
                }}
              >
                \uAC70\uBD80
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Vortex center point */}
      {phase >= 3 && (
        <div style={{
          position: "absolute",
          top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: 20, height: 20,
          borderRadius: "50%",
          background: "#e040fb",
          boxShadow: "0 0 60px #e040fb, 0 0 120px #6a1b9a",
          zIndex: 10,
          animation: "pulse 0.3s ease infinite"
        }} />
      )}

      {/* 확인 MiniNuclearButton — 수락/거부 내러티브 후 등장 */}
      {showConfirm && (
        <div style={{
          position: "absolute",
          bottom: "15%", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          animation: "fadeIn 1s ease"
        }}>
          <MiniNuclearButton label="확인" onPress={() => {
            if (!completedRef.current) {
              completedRef.current = true;
              onComplete();
            }
          }} />
        </div>
      )}

      {/* Skip button */}
      <SkipButton active={active && phase < 3} delay={10} onSkip={onDismiss} />

      <style>{`
        @keyframes matrixFall {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
      `}</style>
    </div>
  );
}
