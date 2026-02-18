// E03: 청개구리 — 버튼 위에 마우스 반복 호버 10회 → 거대 버튼
// 트리거: main.jsx의 handleButtonHover에서 hoverCount >= 10 시 triggerEnding(3)
// main.jsx가 frogHuge 스케일 + 기존 버튼 확대 처리
// 이 컴포넌트는 오버레이 거대 버튼 + 대사 연출 담당

function E03Frog({ active, hoverCount, onComplete, say }) {
  const [showButton, setShowButton] = useState(false);
  const [btnHover, setBtnHover] = useState(false);

  useEffect(() => {
    if (!active) { setShowButton(false); return; }

    say("...아 몰라. 누르든 말든 좋을 대로 해.", "pouty");

    // 약간의 딜레이 후 거대 버튼 등장
    const t = setTimeout(() => setShowButton(true), 800);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      pointerEvents: "none"
    }}>
      {/* 거대 버튼 오버레이 — 화면 하단 절반 차지 */}
      {showButton && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: "50%", display: "flex", alignItems: "center",
          justifyContent: "center", pointerEvents: "auto",
          animation: "fadeIn 0.3s ease"
        }}>
          {/* 거대 빨간 버튼 */}
          <div
            onClick={onComplete}
            onMouseEnter={() => setBtnHover(true)}
            onMouseLeave={() => setBtnHover(false)}
            style={{
              width: 280, height: 280, borderRadius: "50%",
              background: btnHover
                ? "radial-gradient(circle at 36% 28%, #ff4433, #e8573d 50%, #c9402a 100%)"
                : "radial-gradient(circle at 36% 28%, #ff6b5a, #e8573d 50%, #c9402a 100%)",
              boxShadow: btnHover
                ? "0 0 80px #e8573d88, 0 0 160px #e8573d44, 0 16px 64px rgba(0,0,0,0.3), inset 0 -6px 12px #c9402a44"
                : "0 0 60px #e8573d55, 0 0 120px #e8573d22, 0 12px 48px rgba(0,0,0,0.25), inset 0 -4px 8px #c9402a33",
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexDirection: "column",
              transform: btnHover ? "scale(1.08)" : "scale(1)",
              transition: "transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.3s",
              animation: "frogPulse 2s ease infinite",
              position: "relative"
            }}
          >
            {/* 하이라이트 */}
            <div style={{
              position: "absolute", top: "12%", left: "18%",
              width: "32%", height: "20%", borderRadius: "50%",
              background: "rgba(255,255,255,0.45)", filter: "blur(6px)"
            }} />
            <div style={{
              position: "absolute", top: "20%", left: "26%",
              width: "14%", height: "10%", borderRadius: "50%",
              background: "rgba(255,255,255,0.6)", filter: "blur(3px)"
            }} />

            {/* 텍스트 */}
            <div style={{
              fontSize: 28, fontWeight: 800, color: "#fff",
              textShadow: "0 2px 8px rgba(0,0,0,0.3)",
              letterSpacing: 4, fontFamily: "'Noto Sans KR', sans-serif",
              position: "relative", zIndex: 1
            }}>
              누르지 마
            </div>
            <div style={{
              fontSize: 11, color: "rgba(255,255,255,0.6)",
              marginTop: 6, letterSpacing: 2,
              position: "relative", zIndex: 1
            }}>
              DON'T PRESS
            </div>
          </div>

          {/* 글로우 링 */}
          <div style={{
            position: "absolute", width: 320, height: 320,
            borderRadius: "50%", border: "2px dashed #e8573d33",
            animation: "spin 15s linear infinite",
            pointerEvents: "none"
          }} />

          {/* 외부 글로우 */}
          <div style={{
            position: "absolute", width: 360, height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, #e8573d11, transparent 70%)",
            animation: "frogPulse 2s ease infinite",
            pointerEvents: "none"
          }} />
        </div>
      )}

      {/* Skip button */}
      <SkipButton active={active} delay={10} onSkip={onComplete} autoDismiss={25} />

      {/* 커스텀 애니메이션 */}
      <style>{`
        @keyframes frogPulse {
          0%, 100% { box-shadow: 0 0 60px #e8573d44, 0 0 120px #e8573d22; }
          50% { box-shadow: 0 0 100px #e8573d66, 0 0 200px #e8573d33; }
        }
      `}</style>
    </div>
  );
}
