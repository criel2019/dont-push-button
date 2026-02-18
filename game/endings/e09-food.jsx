// E09: 식탐 — 파일 탐색기 + 케이크 클릭 먹기 진행
function E09Food({ active, onComplete, say }) {
  const [phase, setPhase] = useState(0); // 0=explorer, 1=cake visible, 2-5=eating stages
  const [cakeStage, setCakeStage] = useState(0); // 0=full, 1=3/4, 2=half, 3=crumbs
  const [showFinish, setShowFinish] = useState(false);
  const [clickedFiles, setClickedFiles] = useState({});

  useEffect(() => {
    if (!active) {
      setPhase(0);
      setCakeStage(0);
      setShowFinish(false);
      setClickedFiles({});
      return;
    }
    say("...맛있겠다. 아 아니 그냥 그렇다고.", "teasing");
  }, [active]);

  if (!active) return null;

  const handleFileClick = (file) => {
    if (clickedFiles[file]) return;
    setClickedFiles(prev => ({ ...prev, [file]: true }));
    switch (file) {
      case "readme":
        say("그거 읽을 시간에 다른 거 해.", "bored");
        break;
      case "music":
        say("아, 이 노래. ...아무것도 아니야 꺼.", "shy");
        break;
      case "photo":
        say("그건 왜 열어!!! 삭제해!!!", "shocked");
        break;
      case "secret":
        say("비번? 가르쳐줄 것 같아?", "smug");
        break;
      case "cake":
        setPhase(1);
        say("...맛있겠다. 아 아니 그냥 그렇다고.", "teasing");
        break;
    }
  };

  const handleCakeClick = () => {
    if (phase < 1 || cakeStage >= 4) return;
    const next = cakeStage + 1;
    setCakeStage(next);
    switch (next) {
      case 1:
        say("야! 나는?! ...아니 먹고 싶어서가 아니라 예의상!", "angry");
        break;
      case 2:
        say("혼자 다 먹을 거야 진짜? 하, 대단하다.", "pouty");
        break;
      case 3:
        say("...한 입만. 한 입이면 돼. ...주기 싫으면 됐어.", "shy");
        break;
      case 4:
        say("먹어. 다 먹으라고. 맛있게 드세요~", "smug");
        setShowFinish(true);
        break;
    }
  };

  const cakeEmojis = ["🎂", "🍰", "🧁", "🍪", ""];
  const cakeLabels = ["케이크 (온전)", "3/4 남음", "반쪽", "부스러기..."];

  const files = [
    { key: "readme", icon: "📄", name: "README.txt", size: "2KB" },
    { key: "music", icon: "🎵", name: "Music.mp3", size: "4.2MB" },
    { key: "photo", icon: "📷", name: "Photo.png", size: "1.8MB" },
    { key: "secret", icon: "🔒", name: "secret.zip", size: "???" },
    { key: "cake", icon: "🎂", name: "Cake.jpg", size: "824KB", highlight: true },
  ];

  const btnColor = ENDINGS[9]?.btnColor || "#e8a05d";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease"
    }}>
      {/* File Explorer Window */}
      <div style={{
        width: 340, background: "#f0f0f0", borderRadius: 10, overflow: "hidden",
        boxShadow: "0 20px 60px rgba(0,0,0,0.5), 0 2px 8px rgba(0,0,0,0.2)",
        animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        border: "1px solid rgba(0,0,0,0.1)"
      }}>
        {/* Title bar */}
        <div style={{
          background: "linear-gradient(180deg, #e8e0d8, #d8d0c8)",
          padding: "8px 12px", display: "flex", alignItems: "center", gap: 8,
          borderBottom: "1px solid #c0b8b0"
        }}>
          <div style={{ display: "flex", gap: 5 }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ff5f57", border: "1px solid #e0443e" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ffbd2e", border: "1px solid #dea123" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#28c940", border: "1px solid #1aab29" }} />
          </div>
          <div style={{ fontSize: 11, color: "#5a5550", fontWeight: 700, letterSpacing: 1, flex: 1, textAlign: "center" }}>
            탐색기 - 나비의 폴더
          </div>
        </div>

        {/* Address bar */}
        <div style={{
          background: "#fff", margin: "6px 8px", padding: "4px 10px",
          borderRadius: 4, fontSize: 10, color: "#888",
          border: "1px solid #ddd"
        }}>
          📁 C:\Users\Navi\Desktop\비밀폴더
        </div>

        {/* File list */}
        <div style={{ padding: "4px 8px 8px" }}>
          {files.map((f) => (
            <div key={f.key}
              onClick={(e) => { e.stopPropagation(); handleFileClick(f.key); }}
              style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "8px 10px", borderRadius: 6, cursor: "pointer",
                marginBottom: 2,
                background: f.highlight
                  ? (phase >= 1 ? "rgba(255,200,100,0.15)" : "rgba(255,220,100,0.35)")
                  : clickedFiles[f.key] ? "rgba(0,0,0,0.03)" : "transparent",
                border: f.highlight ? "1px solid rgba(255,180,60,0.4)" : "1px solid transparent",
                transition: "all 0.15s",
                opacity: clickedFiles[f.key] && f.key !== "cake" ? 0.5 : 1
              }}
              onMouseEnter={(e) => { if (!clickedFiles[f.key] || f.key === "cake") e.currentTarget.style.background = f.highlight ? "rgba(255,200,100,0.5)" : "rgba(0,0,0,0.06)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = f.highlight ? (phase >= 1 ? "rgba(255,200,100,0.15)" : "rgba(255,220,100,0.35)") : clickedFiles[f.key] ? "rgba(0,0,0,0.03)" : "transparent"; }}
            >
              <span style={{ fontSize: 20 }}>{f.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: "#333" }}>{f.name}</div>
              </div>
              <div style={{ fontSize: 9, color: "#aaa" }}>{f.size}</div>
              {f.highlight && phase < 1 && (
                <div style={{
                  fontSize: 8, color: "#e8a05d", fontWeight: 800,
                  animation: "pulse 1.5s ease infinite", letterSpacing: 1
                }}>OPEN</div>
              )}
            </div>
          ))}
        </div>

        {/* Status bar */}
        <div style={{
          background: "#e8e0d8", padding: "4px 12px",
          fontSize: 9, color: "#888", borderTop: "1px solid #d0c8c0",
          display: "flex", justifyContent: "space-between"
        }}>
          <span>5개 항목</span>
          <span>나비의 폴더</span>
        </div>
      </div>

      {/* Cake display - when cake is selected */}
      {phase >= 1 && cakeStage < 4 && (
        <div style={{
          position: "absolute", bottom: "15%", left: "50%", transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
          animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <div
            onClick={(e) => { e.stopPropagation(); handleCakeClick(); }}
            style={{
              fontSize: cakeStage === 0 ? 80 : cakeStage === 1 ? 70 : cakeStage === 2 ? 56 : 40,
              cursor: "pointer",
              animation: "float 2s ease infinite",
              filter: "drop-shadow(0 8px 20px rgba(0,0,0,0.3))",
              transition: "font-size 0.3s ease",
              userSelect: "none"
            }}
          >
            {cakeEmojis[cakeStage]}
          </div>
          {cakeStage < 4 && (
            <div style={{
              fontSize: 11, color: "#fff", fontWeight: 600, letterSpacing: 1,
              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
              opacity: 0.8
            }}>
              {cakeLabels[cakeStage]} — 클릭해서 먹기
            </div>
          )}
        </div>
      )}

      {/* Finish button */}
      {showFinish && (
        <div style={{
          position: "absolute", bottom: "8%", left: "50%", transform: "translateX(-50%)",
          animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <div
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            style={{
              background: btnColor,
              color: "#fff", fontSize: 16, fontWeight: 800,
              padding: "14px 40px", borderRadius: 14,
              cursor: "pointer", border: "none",
              boxShadow: `0 8px 32px ${btnColor}66, 0 2px 8px rgba(0,0,0,0.2)`,
              letterSpacing: 3,
              animation: "glowPulse 1.5s ease infinite"
            }}
          >
            🍽️ 다 먹기
          </div>
        </div>
      )}

      {/* Skip button */}
      <SkipButton active={active} delay={10} onSkip={onComplete} autoDismiss={25} />
    </div>
  );
}
