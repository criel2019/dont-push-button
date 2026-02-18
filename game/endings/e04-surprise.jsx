// E04: 기습 — 탭 이탈 후 복귀 → 나비가 놀고 있던 현장 목격
// 트리거: document.visibilitychange (main.jsx)
// active=true 시 인테리어 씬 + 클릭 가능한 아이템 + 최종 버튼

function E04Surprise({ active, onComplete, onDismiss, say }) {
  const [clickedItems, setClickedItems] = useState({ snack: false, drink: false, laundry: false });
  const [allClicked, setAllClicked] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [btnHover, setBtnHover] = useState(false);
  const inactivityRef = useRef(null);

  const clickedCount = (clickedItems.snack ? 1 : 0) + (clickedItems.drink ? 1 : 0) + (clickedItems.laundry ? 1 : 0);

  useEffect(() => {
    if (!active) {
      setClickedItems({ snack: false, drink: false, laundry: false });
      setAllClicked(false); setShowButton(false);
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      return;
    }

    // 즉시 반응
    say("읏!! 아 언제 온 거야 노크를 하라고!!", "shocked");
  }, [active]);

  // 모든 아이템 클릭 감지
  useEffect(() => {
    if (!active) return;
    if (clickedItems.snack && clickedItems.drink && clickedItems.laundry && !allClicked) {
      setAllClicked(true);
      say("저거? 아무것도 아니야. 그냥 장식이야.", "pouty");
    }
  }, [clickedItems, active, allClicked]);

  // 비활동 8초 후 버튼 표시 + 대사
  useEffect(() => {
    if (!active) return;
    const startInactivityTimer = () => {
      if (inactivityRef.current) clearTimeout(inactivityRef.current);
      inactivityRef.current = setTimeout(() => {
        say("아 그냥 궁금하면 눌러봐. 별 거 없으니까. 진짜로.", "smug");
        setShowButton(true);
      }, 8000);
    };

    // 초기 시작
    startInactivityTimer();

    return () => { if (inactivityRef.current) clearTimeout(inactivityRef.current); };
  }, [active]);

  // 아이템 클릭 시 비활동 타이머 리셋 + 버튼 표시 촉진
  useEffect(() => {
    if (!active) return;
    if (allClicked) {
      // 모든 아이템 클릭 후 3초 뒤 버튼 표시
      const t = setTimeout(() => setShowButton(true), 3000);
      return () => clearTimeout(t);
    }
  }, [allClicked, active]);

  const handleItemClick = useCallback((item) => {
    if (clickedItems[item]) return;
    setClickedItems(prev => ({ ...prev, [item]: true }));

    switch (item) {
      case "snack":
        say("그거 니 거 아니거든!! ...내 거거든.", "angry");
        break;
      case "drink":
        say("원래 있던 거야!! 내가 갖다 놓은 거 아니야!!", "pouty");
        break;
      case "laundry":
        say("보지 마 보지 마 보지 마!!", "shy");
        break;
    }
  }, [clickedItems, say]);

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      background: "rgba(0,0,10,0.65)", backdropFilter: "blur(4px)",
      animation: "fadeIn 0.4s ease"
    }}>
      {/* CRT 인테리어 프레임 */}
      <div style={{
        position: "absolute", top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        width: 420, height: 320,
        background: "linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        borderRadius: 20, overflow: "hidden",
        boxShadow: "0 0 60px rgba(15,52,96,0.4), inset 0 0 40px rgba(0,0,0,0.5)",
        border: "2px solid #2a2a4a"
      }}>
        {/* 스캔라인 효과 */}
        <div style={{
          position: "absolute", inset: 0,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.1) 2px, rgba(0,0,0,0.1) 4px)",
          pointerEvents: "none", zIndex: 10
        }} />

        {/* CRT 글로우 */}
        <div style={{
          position: "absolute", inset: 0,
          background: "radial-gradient(ellipse at center, rgba(100,150,255,0.06), transparent 70%)",
          pointerEvents: "none", zIndex: 5
        }} />

        {/* 방 바닥 */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, height: "40%",
          background: "linear-gradient(180deg, #1a1a2e00, #2a1a3e44)"
        }} />

        {/* 나비가 눕고 있던 흔적 — 쿠션 */}
        <div style={{
          position: "absolute", bottom: "25%", left: "50%",
          transform: "translateX(-50%)",
          width: 120, height: 40, borderRadius: "50%",
          background: "radial-gradient(ellipse, #4a3a6a, #2a1a4e)",
          opacity: 0.6
        }} />

        {/* 아이템들 */}
        {/* 팝콘 (왼쪽) */}
        {!clickedItems.snack && (
          <div
            onClick={() => handleItemClick("snack")}
            style={{
              position: "absolute", bottom: "30%", left: "15%",
              fontSize: 40, cursor: "pointer",
              transition: "transform 0.2s, filter 0.2s",
              filter: "drop-shadow(0 4px 12px rgba(255,200,50,0.4))",
              animation: "gentleBob 3s ease infinite",
              zIndex: 20
            }}
            onMouseEnter={e => { e.target.style.transform = "scale(1.2) rotate(-5deg)"; e.target.style.filter = "drop-shadow(0 6px 20px rgba(255,200,50,0.6))"; }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.filter = "drop-shadow(0 4px 12px rgba(255,200,50,0.4))"; }}
            title="팝콘"
          >
            🍿
          </div>
        )}
        {clickedItems.snack && (
          <div style={{
            position: "absolute", bottom: "30%", left: "15%",
            fontSize: 40, opacity: 0.15, pointerEvents: "none"
          }}>🍿</div>
        )}

        {/* 음료 (오른쪽) */}
        {!clickedItems.drink && (
          <div
            onClick={() => handleItemClick("drink")}
            style={{
              position: "absolute", bottom: "35%", right: "18%",
              fontSize: 40, cursor: "pointer",
              transition: "transform 0.2s, filter 0.2s",
              filter: "drop-shadow(0 4px 12px rgba(100,200,255,0.4))",
              animation: "gentleBob 3s ease infinite 0.5s",
              zIndex: 20
            }}
            onMouseEnter={e => { e.target.style.transform = "scale(1.2) rotate(5deg)"; e.target.style.filter = "drop-shadow(0 6px 20px rgba(100,200,255,0.6))"; }}
            onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.filter = "drop-shadow(0 4px 12px rgba(100,200,255,0.4))"; }}
            title="음료"
          >
            🥤
          </div>
        )}
        {clickedItems.drink && (
          <div style={{
            position: "absolute", bottom: "35%", right: "18%",
            fontSize: 40, opacity: 0.15, pointerEvents: "none"
          }}>🥤</div>
        )}

        {/* 빨래 (상단 중앙) */}
        {!clickedItems.laundry && (
          <div
            onClick={() => handleItemClick("laundry")}
            style={{
              position: "absolute", top: "18%", left: "50%",
              transform: "translateX(-50%)",
              fontSize: 40, cursor: "pointer",
              transition: "transform 0.2s, filter 0.2s",
              filter: "drop-shadow(0 4px 12px rgba(200,150,255,0.4))",
              animation: "gentleBob 3s ease infinite 1s",
              zIndex: 20
            }}
            onMouseEnter={e => { e.target.style.transform = "translateX(-50%) scale(1.2)"; e.target.style.filter = "drop-shadow(0 6px 20px rgba(200,150,255,0.6))"; }}
            onMouseLeave={e => { e.target.style.transform = "translateX(-50%) scale(1)"; e.target.style.filter = "drop-shadow(0 4px 12px rgba(200,150,255,0.4))"; }}
            title="빨래"
          >
            👕
          </div>
        )}
        {clickedItems.laundry && (
          <div style={{
            position: "absolute", top: "18%", left: "50%",
            transform: "translateX(-50%)",
            fontSize: 40, opacity: 0.15, pointerEvents: "none"
          }}>👕</div>
        )}

        {/* 나비 상태 텍스트 */}
        <div style={{
          position: "absolute", bottom: 12, left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10, color: "#8888cc", letterSpacing: 3,
          fontFamily: "monospace", zIndex: 15
        }}>
          {allClicked ? "...증거 인멸 실패" : `발견된 증거: ${clickedCount}/3`}
        </div>
      </div>

      {/* 제목 */}
      <div style={{
        position: "absolute", top: "8%", left: "50%",
        transform: "translateX(-50%)", textAlign: "center",
        zIndex: 410
      }}>
        <div style={{
          fontSize: 14, fontWeight: 700, color: "#e88b3d",
          letterSpacing: 4, textShadow: "0 2px 12px #e88b3d44"
        }}>
          현장 발각
        </div>
        <div style={{
          fontSize: 10, color: "#ffffff44", letterSpacing: 2, marginTop: 4
        }}>
          CAUGHT IN THE ACT
        </div>
      </div>

      {/* 지금이다! 버튼 */}
      {showButton && (
        <div style={{
          position: "absolute", bottom: "10%", left: "50%",
          transform: "translateX(-50%)", zIndex: 420,
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <MiniNuclearButton label="지금이다!" onPress={onComplete} />
        </div>
      )}

      {/* Skip button */}
      <SkipButton active={active} delay={10} onSkip={onDismiss} autoDismiss={25} />

      {/* 커스텀 애니메이션 */}
      <style>{`
        @keyframes surpriseFlash {
          0%, 100% { box-shadow: 0 6px 24px #e88b3d44; }
          25% { box-shadow: 0 6px 24px #e88b3d44, 0 0 30px #e88b3d66; }
          50% { box-shadow: 0 8px 32px #e88b3d66, 0 0 50px #e88b3d88; }
          75% { box-shadow: 0 6px 24px #e88b3d44, 0 0 30px #e88b3d66; }
        }
      `}</style>
    </div>
  );
}
