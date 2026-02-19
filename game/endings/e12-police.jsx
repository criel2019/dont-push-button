// E12: 경찰서 — 다이얼 패드 전화번호 퍼즐
function E12Police({ active, onComplete, onDismiss, say }) {
  const [dialed, setDialed] = useState("");
  const [showDialer, setShowDialer] = useState(false);
  const [hintGiven, setHintGiven] = useState(false);
  const [showCall, setShowCall] = useState(false);
  const [callConnected, setCallConnected] = useState(false);
  const [pressedKey, setPressedKey] = useState(null);
  const [showSiren, setShowSiren] = useState(false);
  const [wrongFlash, setWrongFlash] = useState(false);
  const spokenRef = useRef({});

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
      setWrongFlash(false);
      spokenRef.current = {};
      return;
    }
    setShowDialer(true);
    say("번호 아는 데 있어? 없지? 알려줄까~", "teasing");
    // 10초 후 힌트
    const hintTimer = setTimeout(() => {
      setHintGiven(true);
      say("힌트 줄게~ 010-1234야~", "teasing");
    }, 10000);
    return () => clearTimeout(hintTimer);
  }, [active]);

  // 이스터에그 번호 + 정답 체크
  useEffect(() => {
    if (!active || !dialed) return;
    const spoken = spokenRef.current;

    // 이스터에그: 119, 112, 114
    if (dialed === "119") {
      say("불났어? 어디? 니 머리?", "smug");
      setTimeout(() => setDialed(""), 1000);
      return;
    }
    if (dialed === "112") {
      say("신고할 거야? 뭔 죄로? 게임했다고?", "pouty");
      setTimeout(() => setDialed(""), 1000);
      return;
    }
    if (dialed === "114") {
      say("나비님의 번호는~ 010~", "teasing");
      setHintGiven(true);
      setTimeout(() => setDialed(""), 1000);
      return;
    }

    // 이스터에그 입력 중이면 검증 스킵
    if (["119", "112", "114"].some(s => s.startsWith(dialed) && dialed.length < s.length)) return;

    // 정답 체크: 7자리 다 입력했을 때만 검증
    if (dialed.length === TARGET.length) {
      if (dialed === TARGET) {
        say("여보세요~? ...히히. 전화해줬네.", "happy");
        setShowCall(true);
      } else {
        say("땡~ 번호가 틀렸어.", "pouty");
        setWrongFlash(true);
        setTimeout(() => { setDialed(""); setWrongFlash(false); }, 800);
      }
      return;
    }

    // 중간 리액션 (한 번씩만)
    if (dialed.length === 3 && !spoken.s3) {
      spoken.s3 = true;
      say("오, 010? 좋아좋아~", "excited");
    }
  }, [dialed, active]);

  if (!active || !showDialer) return null;

  const handleKeyPress = (key) => {
    if (showCall || callConnected || wrongFlash) return;
    if (dialed.length >= 7) return;
    setPressedKey(key);
    setTimeout(() => setPressedKey(null), 150);
    setDialed(prev => prev + key);
  };

  const handleBackspace = () => {
    if (showCall || callConnected || wrongFlash) return;
    setDialed(prev => prev.slice(0, -1));
  };

  const handleCall = () => {
    say("통화 연결? 나랑? ...좋아.", "shy");
    setCallConnected(true);
    setShowSiren(true);
    setTimeout(() => onComplete(), 1500);
  };

  const btnColor = ENDINGS[12]?.btnColor || "#43a047";

  const formatNumber = (num) => {
    if (!num) return "";
    if (num.length <= 3) return num;
    return num.slice(0, 3) + "-" + num.slice(3);
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
        background: callConnected ? "rgba(0,0,0,0.6)" : "rgba(0,0,0,0.45)",
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
          fontSize: 28,
          fontWeight: 800, color: wrongFlash ? "#e8573d" : "#fff",
          textAlign: "center", marginBottom: 16,
          letterSpacing: 3, minHeight: 42,
          fontFamily: "'SF Mono', monospace",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "color 0.2s",
          animation: wrongFlash ? "shake 0.3s ease" : "none"
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

        {/* Call MiniNuclearButton — 다이얼 하단에 자연스럽게 배치 */}
        {showCall && !callConnected && (
          <div style={{ marginTop: 16, display: "flex", justifyContent: "center" }}>
            <MiniNuclearButton label="통화" onPress={handleCall} />
          </div>
        )}

        {/* Skip button */}
        <SkipButton active={active && !callConnected} delay={12} onSkip={onDismiss} />

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
