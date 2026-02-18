// E12: 경찰서 — 다이얼 패드 전화번호 퍼즐
function E12Police({ active, onComplete, say }) {
  const [dialed, setDialed] = useState("");
  const [showDialer, setShowDialer] = useState(false);
  const [hintGiven, setHintGiven] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);
  const [showSiren, setShowSiren] = useState(false);

  const TARGET = "0101234";

  useEffect(() => {
    if (!active) {
      setDialed("");
      setShowDialer(false);
      setHintGiven(false);
      setShowCall(false);
      setCallConnected(false);
      setPressedKey(null);
      setShowSiren(false);
      return;
    }
    setShowDialer(true);
    say("번호 아는 데 있어? 없지? 알려줄까~", "teasing");
    // Auto-hint after 25s
    const hintTimer = setTimeout(() => {
      setHintGiven(true);
      say("힌트 줄게~ 010-1234야~", "teasing");
    }, 25000);
    return () => clearTimeout(hintTimer);
  }, [active]);

  // Check for special numbers and correct sequence
  const specialPrefixes = ["119", "112", "114"];
  const isSpecialPrefix = (d) => specialPrefixes.some(s => s.startsWith(d) && d.length <= s.length);

  useEffect(() => {
    if (!active || !dialed) return;

    // Special number checks — full match
    if (dialed === "119") {
      say("불났어? 어디? 니 머리?", "smug");
      setTimeout(() => setDialed(""), 1200);
      return;
    }
    if (dialed === "112") {
      say("신고할 거야? 뭔 죄로? 게임했다고?", "pouty");
      setTimeout(() => setDialed(""), 1200);
      return;
    }
    if (dialed === "114") {
      say("나비님의 번호는~ 010~", "teasing");
      setHintGiven(true);
      setTimeout(() => setDialed(""), 1200);
      return;
    }

    // If currently typing a special prefix, don't validate against TARGET yet
    if (isSpecialPrefix(dialed)) return;

    // Check correct sequence progress
    if (dialed.length <= TARGET.length) {
      const expected = TARGET.slice(0, dialed.length);
      if (dialed === expected) {
        // Correct so far
        if (dialed.length === TARGET.length) {
          // Full number entered!
          say("여보세요~? ...히히. 전화해줬네.", "happy");
          setShowCall(true);
        } else if (dialed.length >= 2) {
          say("맞아맞아! 오 의외로 머리 돌아가네.", "excited");
        }
      } else {
        // Wrong digit
        say("땡. 그것도 못 맞혀? 다시.", "pouty");
        // Remove last digit
        setTimeout(() => setDialed(prev => prev.slice(0, -1)), 500);
      }
    }
  }, [dialed, active]);

  if (!active || !showDialer) return null;

  const handleKeyPress = (key) => {
    if (showCall || callConnected) return;
    if (dialed.length >= 11) return; // max phone number length
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);
    setDialed(prev => prev + key);
  };

  const handleBackspace = () => {
    if (showCall || callConnected) return;
    setDialed(prev => prev.slice(0, -1));
  };

  const handleCall = (e) => {
    e.stopPropagation();
    say("통화 연결? 나랑? ...좋아.", "shy");
    setCallConnected(true);
    setShowSiren(true);
    setTimeout(() => onComplete(), 1500);
  };

  const btnColor = ENDINGS[12]?.btnColor || "#43a047";

  // Format dialed number for display
  const formatNumber = (num) => {
    if (!num) return "";
    if (num.length <= 3) return num;
    if (num.length <= 7) return num.slice(0, 3) + "-" + num.slice(3);
    return num.slice(0, 3) + "-" + num.slice(3, 7) + "-" + num.slice(7);
  };

  const keys = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease"
    }}>
      {/* Dark backdrop */}
      <div style={{
        position: "absolute", inset: 0,
        background: callConnected
          ? "rgba(0,0,0,0.6)"
          : "rgba(0,0,0,0.45)",
        transition: "background 0.5s"
      }} />

      {/* Siren effect */}
      {showSiren && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          animation: "siren 0.5s ease infinite",
          zIndex: 401
        }} />
      )}

      {/* Phone dialer */}
      <div style={{
        position: "relative", zIndex: 402,
        background: "#1a1a2e",
        borderRadius: 28, padding: "28px 24px 20px",
        width: 260,
        boxShadow: "0 24px 80px rgba(0,0,0,0.6), 0 0 1px rgba(255,255,255,0.1)",
        animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        border: "1px solid rgba(255,255,255,0.05)"
      }}>
        {/* Header */}
        <div style={{
          fontSize: 10, color: "#43a04755", letterSpacing: 5,
          textAlign: "center", marginBottom: 6, fontWeight: 600
        }}>
          EMERGENCY CALL
        </div>

        {/* Hint display */}
        {hintGiven && !showCall && (
          <div style={{
            fontSize: 9, color: "#43a04766", textAlign: "center",
            marginBottom: 4, letterSpacing: 2,
            animation: "pulse 2s ease infinite"
          }}>
            HINT: 010-1234
          </div>
        )}

        {/* Number display */}
        <div style={{
          fontSize: dialed.length > 7 ? 22 : 28,
          fontWeight: 800, color: "#fff",
          textAlign: "center", marginBottom: 16,
          letterSpacing: 3, minHeight: 42,
          fontFamily: "'SF Mono', monospace",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "font-size 0.2s"
        }}>
          {dialed ? formatNumber(dialed) : (
            <span style={{ color: "#ffffff22", fontSize: 20 }}>번호를 입력하세요</span>
          )}
        </div>

        {/* Dial pad */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: 8, marginBottom: 12
        }}>
          {keys.map(key => (
            <div key={key}
              onClick={(e) => { e.stopPropagation(); handleKeyPress(key); }}
              style={{
                width: 64, height: 50, borderRadius: 14,
                background: pressedKey === key
                  ? "rgba(255,255,255,0.18)"
                  : "rgba(255,255,255,0.06)",
                display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center",
                cursor: showCall ? "default" : "pointer",
                border: "1px solid rgba(255,255,255,0.08)",
                transition: "all 0.12s",
                transform: pressedKey === key ? "scale(0.92)" : "scale(1)"
              }}
              onMouseEnter={(e) => { if (!showCall) e.currentTarget.style.background = "rgba(255,255,255,0.12)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = pressedKey === key ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.06)"; }}
            >
              <span style={{
                fontSize: 20, color: "#fff", fontWeight: 700
              }}>{key}</span>
              {key !== "*" && key !== "#" && key !== "0" && (
                <span style={{
                  fontSize: 7, color: "#ffffff33", letterSpacing: 2, marginTop: 1
                }}>
                  {["", "ABC", "DEF", "GHI", "JKL", "MNO", "PQRS", "TUV", "WXYZ"][parseInt(key) - 1]}
                </span>
              )}
              {key === "0" && (
                <span style={{ fontSize: 7, color: "#ffffff33", letterSpacing: 1, marginTop: 1 }}>+</span>
              )}
            </div>
          ))}
        </div>

        {/* Bottom row: backspace and call */}
        <div style={{
          display: "flex", gap: 8, justifyContent: "center", alignItems: "center"
        }}>
          {/* Backspace */}
          {dialed.length > 0 && !showCall && (
            <div
              onClick={(e) => { e.stopPropagation(); handleBackspace(); }}
              style={{
                width: 56, height: 42, borderRadius: 12,
                background: "rgba(255,255,255,0.04)",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", fontSize: 16, color: "#ffffff66",
                border: "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.15s"
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.04)"}
            >
              ⌫
            </div>
          )}

          {/* Call button */}
          {showCall && !callConnected && (
            <div
              onClick={handleCall}
              style={{
                flex: 1, padding: "12px 28px", borderRadius: 14,
                background: btnColor,
                color: "#fff", fontSize: 16, fontWeight: 800,
                textAlign: "center", cursor: "pointer",
                letterSpacing: 3,
                boxShadow: `0 6px 24px ${btnColor}66`,
                animation: "glowPulse 1.5s ease infinite, popIn 0.3s ease",
                border: "1px solid rgba(255,255,255,0.15)"
              }}
            >
              Call
            </div>
          )}

          {/* Connected state */}
          {callConnected && (
            <div style={{
              flex: 1, padding: "12px 28px", borderRadius: 14,
              background: "rgba(67,160,71,0.2)",
              border: `1px solid ${btnColor}`,
              textAlign: "center", animation: "pulse 1s ease infinite"
            }}>
              <div style={{ fontSize: 12, color: btnColor, fontWeight: 800, letterSpacing: 3 }}>
                연결 중...
              </div>
              <div style={{ fontSize: 9, color: "#43a04766", marginTop: 2 }}>
                00:{callConnected ? "01" : "00"}
              </div>
            </div>
          )}
        </div>

        {/* Skip button */}
        <SkipButton active={active && !callConnected} delay={12} onSkip={onComplete} autoDismiss={35} />

        {/* Bottom decoration */}
        <div style={{
          width: 40, height: 4, borderRadius: 2,
          background: "rgba(255,255,255,0.08)",
          margin: "16px auto 0"
        }} />
      </div>
    </div>
  );
}
