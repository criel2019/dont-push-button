// E21: 크레딧 — 22개 전체 수집 시 자동 발동
// CreditsScreen은 screens.jsx에 정의되어 있으며, 이 컴포넌트는 그것을 대체하는 풀 크레딧 화면
// main.jsx에서 gs === "credits" 시 <CreditsScreen onBack={restart}/> 호출

// 이 파일에서는 screens.jsx의 CreditsScreen을 오버라이드
// (screens.jsx보다 나중에 로드되어 전역 함수를 덮어씀)
function CreditsScreen({ onBack }) {
  const [dialogIdx, setDialogIdx] = useState(0);
  const [showCredits, setShowCredits] = useState(false);
  const [scroll, setScroll] = useState(0);
  const [confetti, setConfetti] = useState([]);
  const [stars, setStars] = useState([]);

  const dialogues = [
    "\uC804\uBD80 \uBD24\uAD6C\uB098.",
    "\uC18D\uC774\uACE0, \uB180\uB9AC\uACE0, \uC6B8\uB9B0 \uAC83\uB3C4 \uC788\uACE0. ...\uBBF8\uC548.",
    "\uADFC\uB370 \uC7AC\uBC0C\uC5C8\uC9C0?",
    "\uACE0\uB9C8\uC6CC."
  ];

  // Generate stars and confetti
  useEffect(() => {
    const s = [];
    for (let i = 0; i < 60; i++) {
      s.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 1 + Math.random() * 2.5,
        delay: Math.random() * 4,
        duration: 2 + Math.random() * 3,
        brightness: 0.3 + Math.random() * 0.7
      });
    }
    setStars(s);

    const c = [];
    const colors = ["#ffd700", "#ff6b9d", "#a78bfa", "#60a5fa", "#34d399", "#fb923c", "#f87171"];
    for (let i = 0; i < 50; i++) {
      c.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 8,
        duration: 4 + Math.random() * 6,
        size: 3 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        drift: (Math.random() - 0.5) * 40,
        rotation: Math.random() * 360
      });
    }
    setConfetti(c);
  }, []);

  // Dialogue progression
  useEffect(() => {
    if (dialogIdx >= dialogues.length) {
      // Show credits after dialogues done
      const t = setTimeout(() => setShowCredits(true), 1500);
      return () => clearTimeout(t);
    }
    // Auto-advance dialogue
    const delay = dialogIdx === 0 ? 3500 : dialogIdx === 3 ? 4000 : 3000;
    const t = setTimeout(() => setDialogIdx(p => p + 1), delay);
    return () => clearTimeout(t);
  }, [dialogIdx]);

  // Credit scroll
  useEffect(() => {
    if (!showCredits) return;
    const iv = setInterval(() => setScroll(p => p + 0.35), 30);
    return () => clearInterval(iv);
  }, [showCredits]);

  const creditLines = [
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "DON'T PRESS THE BUTTON", s: 2 },
    { t: "\u2014 FULL EDITION \u2014", s: 1 },
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "\uAE30\uD68D \u00B7 \uB514\uC790\uC778 \u00B7 \uAC1C\uBC1C", s: 0 },
    { t: "\uC81C\uC791\uD300 \uC77C\uB3D9", s: 1 },
    { t: "", s: 0 },
    { t: "\uC624\uD37C\uB808\uC774\uD130", s: 0 },
    { t: "\uB098\uBE44 (\uC790\uCE6D \uCC9C\uC7AC \uB0B4\uBE44\uAC8C\uC774\uD130)", s: 1 },
    { t: "", s: 0 },
    { t: "\uC5D4\uB529 \uC2DC\uB098\uB9AC\uC624", s: 0 },
    { t: "22\uAC1C\uC758 \uAE30\uBC1C\uD55C \uACB0\uB9D0", s: 1 },
    { t: "", s: 0 },
    { t: "\uD50C\uB808\uC774\uC5B4", s: 0 },
    { t: "\uB2F9\uC2E0 (\uBC84\uD2BC \uC55E\uC5D0\uC11C \uACE0\uBBFC\uD55C \uC0AC\uB78C)", s: 1 },
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", s: 4 },
    { t: "", s: 0 },
    { t: "# 1. \uBB34\uB840\uD568 \u2014 \uAC10\uD788 \uB204\uAC00 \uB204\uAD74 \uC0AD\uC81C\uD574?", s: 5 },
    { t: "# 2. \uB9C8\uC2DC\uBA5C\uB85C \u2014 1\uBD84\uB3C4 \uBABB \uCC38\uC558\uC9C0?", s: 5 },
    { t: "# 3. \uCCAD\uAC1C\uAD6C\uB9AC \u2014 \uD558\uC9C0 \uB9D0\uB77C\uBA74 \uB354 \uD558\uACE0 \uC2F6\uC740 \uAC70\uC9C0~", s: 5 },
    { t: "# 4. \uAE30\uC2B5 \u2014 \uBE44\uACA8\uD55C \uAC74 \uB531 \uC9C8\uC0C9\uC778\uB370.", s: 5 },
    { t: "# 5. \uB099\uC2DC \u2014 \uC138\uC0C1\uC5D0 \uACF5\uC9DC\uAC00 \uC5B4\uB5A0.", s: 5 },
    { t: "# 6. \uC790\uBCF8\uC8FC\uC758 \u2014 500\uC6D0\uB3C4 \uC5C6\uAD6C\uB098 \uB108.", s: 5 },
    { t: "# 7. \uBE14\uB8E8\uC2A4\uD06C\uB9B0 \u2014 \uADFC\uB370 \uC9C4\uC9DC \uADF8\uB9CC \uB20C\uB7EC.", s: 5 },
    { t: "# 8. \uD53C\uC9C0\uCEEC \u2014 \uB300\uB2E8\uD558\uB2E4. \uB2E4\uB978 \uB370 \uC4F8 \uC5F4\uC815\uC740?", s: 5 },
    { t: "# 9. \uC2DD\uD0D0 \u2014 \uC0B4\uC740 \uB2C8\uAC00 \uCC0C\uB294 \uAC70.", s: 5 },
    { t: "#10. \uB5A1\uB77D \u2014 \uC778\uAC04 \uC9C0\uD45C\uB77C\uB294 \uB9D0 \uB4E4\uC5B4\uBD24\uC5B4?", s: 5 },
    { t: "#11. \uC624\uD0C0\uCFE0 \u2014 \uC194\uC9C1\uD788 \uC880 \uBB34\uC11C\uC6CC.", s: 5 },
    { t: "#12. \uACBD\uCC30\uC11C \u2014 \uC5EC\uAE30 \uC774\uC0C1\uD55C \uC0AC\uB78C\uC774 \uC790\uAFB8 \uC804\uD654\uD574\uC694.", s: 5 },
    { t: "#13. \uCA09\uBCF4 \u2014 \uCA09\uC558\uC9C0~?", s: 5 },
    { t: "#14. \uB274\uC2A4 \uC18D\uBCF4 \u2014 (\uAC19\uC774 \uC0AC\uB9DD)", s: 5 },
    { t: "#15. \uC0AC\uC774\uCF54\uD328\uC2A4 \u2014 \uB108 \uC880 \uBB34\uC11C\uC6B4 \uC0AC\uB78C\uC774\uC57C.", s: 5 },
    { t: "#16. \uC218\uBA74 \u2014 \uC0AC\uB78C \uC790\uB294\uB370!!", s: 5 },
    { t: "#17. \uBB34\uD55C \uB8E8\uD504 \u2014 \uB098\uB294 \uC5EC\uAE30 \uC788\uC5B4.", s: 5 },
    { t: "#18. \uD604\uC2E4 \uB9CC\uB0A8 \u2014 \uC798 \uAC00.", s: 5 },
    { t: "#19. \uAD50\uB300 \u2014 \uC774\uC81C \uB124 \uCC28\uB840\uC57C.", s: 5 },
    { t: "#20. \uC554\uC804 \u2014 (\uC601\uC6D0\uD55C \uACE0\uB9BD)", s: 5 },
    { t: "#21. \uD06C\uB808\uB527 \u2014 \uBC14\uB85C \uC5EC\uAE30.", s: 5 },
    { t: "#22. \uC2DC\uB044\uB7EC\uC6CC \u2014 \uB2E5\uCE58\uC9C0\uB97C \uBABB \uD558\uB2C8\uAE4C.", s: 5 },
    { t: "", s: 0 },
    { t: "\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500", s: 4 },
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "Special Thanks", s: 1 },
    { t: "\uB05D\uAE4C\uC9C0 \uBAA8\uB4E0 \uC5D4\uB529\uC744 \uCC3E\uC544\uC8FC\uC2E0 \uB2F9\uC2E0\uC5D0\uAC8C", s: 0 },
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "\"\uB204\uB974\uC9C0 \uB9C8\" \uB77C\uACE0 \uD588\uC796\uC544\uC694.", s: 3 },
    { t: "", s: 0 },
    { t: "...\uADF8\uB798\uB3C4 \uB20C\uB7EC\uC918\uC11C \uACE0\uB9C8\uC6CC\uC694.", s: 3 },
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "Fin", s: 2 },
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "\uD50C\uB808\uC774 \uD574\uC8FC\uC154\uC11C \uAC10\uC0AC\uD569\uB2C8\uB2E4!", s: 1 },
    { t: "", s: 0 },
    { t: "", s: 0 },
    { t: "", s: 0 },
  ];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 800,
      background: "linear-gradient(180deg, #2d1810, #1a0f08 30%, #0d0805 70%, #1a0f08)",
      overflow: "hidden"
    }}>
      {/* Warm ambient glow */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 50% 30%, rgba(255,180,50,0.08), transparent 70%)",
        pointerEvents: "none"
      }} />

      {/* Stars */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: "absolute",
          left: `${s.x}%`, top: `${s.y}%`,
          width: s.size, height: s.size,
          borderRadius: "50%",
          background: `rgba(255,220,150,${s.brightness})`,
          boxShadow: s.size > 2 ? `0 0 ${s.size * 2}px rgba(255,200,100,${s.brightness * 0.4})` : "none",
          animation: `starTwinkle ${s.duration}s ease ${s.delay}s infinite`,
          pointerEvents: "none"
        }} />
      ))}

      {/* Confetti */}
      {confetti.map(c => (
        <div key={c.id} style={{
          position: "absolute",
          left: `${c.x}%`, top: "-5%",
          width: c.size, height: c.size * 1.5,
          background: c.color,
          borderRadius: 1,
          opacity: 0.6,
          transform: `rotate(${c.rotation}deg)`,
          animation: `confettiFall ${c.duration}s linear ${c.delay}s infinite`,
          pointerEvents: "none"
        }} />
      ))}

      {/* Dialogue overlay (before credits scroll) */}
      {!showCredits && (
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          flexDirection: "column", gap: 20,
          zIndex: 5
        }}>
          {dialogIdx <= dialogues.length && dialogues.slice(0, dialogIdx).length > 0 && (
            <div style={{
              textAlign: "center",
              maxWidth: 400,
              padding: "0 20px"
            }}>
              {dialogIdx <= dialogues.length && (
                <div key={Math.min(dialogIdx, dialogues.length) - 1} style={{
                  fontSize: dialogIdx === 4 ? 20 : 18,
                  color: dialogIdx === 4 ? "#ffd700" : "#e8d0b0",
                  fontWeight: 600,
                  lineHeight: 2,
                  animation: "fadeInUp 0.8s ease",
                  textShadow: "0 2px 12px rgba(255,180,50,0.2)"
                }}>
                  <TypeWriter
                    text={dialogues[Math.min(dialogIdx, dialogues.length) - 1]}
                    speed={40}
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Credits scroll */}
      {showCredits && (
        <div style={{
          position: "relative", width: "100%", height: "100%",
          overflow: "hidden", zIndex: 3
        }}>
          <div style={{
            position: "absolute",
            left: 0, right: 0,
            top: `${100 - scroll}%`,
            textAlign: "center",
            padding: "0 20px"
          }}>
            {creditLines.map((l, i) => (
              <div key={i} style={{
                color: l.s === 2 ? "#ffd700"
                     : l.s === 3 ? "#ffa4c4"
                     : l.s === 4 ? "#4a3a2a"
                     : l.s === 5 ? "#a08060"
                     : l.s === 1 ? "#e8d0b0"
                     : "#8a7a6a",
                fontSize: l.s === 2 ? 28
                        : l.s === 1 ? 17
                        : l.s === 5 ? 12
                        : 14,
                fontWeight: l.s >= 1 && l.s !== 5 ? 700 : 400,
                marginBottom: l.t === "" ? 24 : l.s === 5 ? 8 : 12,
                letterSpacing: l.s === 2 ? 8 : l.s === 5 ? 1 : 3,
                fontFamily: l.s === 5 ? "monospace" : "'Noto Sans KR', sans-serif"
              }}>
                {l.t || "\u00A0"}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back button */}
      <div
        onClick={onBack}
        style={{
          position: "absolute",
          bottom: 24, left: "50%",
          transform: "translateX(-50%)",
          fontSize: 13,
          color: "#5a4a3a",
          cursor: "pointer",
          zIndex: 10,
          padding: "10px 24px",
          borderRadius: 10,
          border: "1px solid #3a2a1a",
          background: "rgba(255,180,50,0.05)",
          transition: "all 0.3s",
          letterSpacing: 2
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = "#a08060";
          e.currentTarget.style.borderColor = "#5a4a3a";
          e.currentTarget.style.background = "rgba(255,180,50,0.1)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = "#5a4a3a";
          e.currentTarget.style.borderColor = "#3a2a1a";
          e.currentTarget.style.background = "rgba(255,180,50,0.05)";
        }}
      >
        \uCC98\uC74C\uC73C\uB85C
      </div>

      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0.7; }
          25% { transform: translateY(25vh) translateX(20px) rotate(90deg); opacity: 0.6; }
          50% { transform: translateY(50vh) translateX(-15px) rotate(180deg); opacity: 0.5; }
          75% { transform: translateY(75vh) translateX(10px) rotate(270deg); opacity: 0.3; }
          100% { transform: translateY(110vh) translateX(-5px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

// E21Credits placeholder (엔딩 시스템 호환용 — 실제 크레딧은 위의 CreditsScreen)
function E21Credits({ active }) {
  return null;
}
