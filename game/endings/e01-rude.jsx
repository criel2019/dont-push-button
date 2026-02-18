// E01: 무례함 — 우클릭 컨텍스트 메뉴에서 나비 삭제
// 트리거: CRT 모니터의 나비를 우클릭 → "삭제" 선택 → "삭제 확인" 클릭
// panels.jsx의 ContextMenu가 초기 인터렉션 처리 → active=true 시점은 삭제 확정 후

function E01Rude({ active, onComplete, say, doShake }) {
  const [phase, setPhase] = useState(0); // 0=init, 1=angry, 2=progress, 3=done
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!active) { setPhase(0); setProgress(0); return; }

    // Phase 0: 즉시 반응
    say("어? 날 지우게?", "shocked");
    doShake();

    // Phase 1: 2초 후 분노
    const t1 = setTimeout(() => {
      setPhase(1);
      say("감히 누가 누굴 삭제해? 나 없으면 이 게임 아무것도 아닌데?", "angry");
    }, 2000);

    // Phase 2: 3초 후 프로그레스 바 시작
    const t2 = setTimeout(() => {
      setPhase(2);
    }, 3000);

    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);

  // 프로그레스 바 애니메이션 (phase 2에서 3초간)
  useEffect(() => {
    if (phase !== 2) return;
    const start = Date.now();
    const duration = 3000;
    const iv = setInterval(() => {
      const elapsed = Date.now() - start;
      const pct = Math.min(elapsed / duration, 1);
      setProgress(pct);
      if (pct >= 1) {
        clearInterval(iv);
        setPhase(3);
      }
    }, 50);
    return () => clearInterval(iv);
  }, [phase]);

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)",
      animation: "fadeIn 0.3s ease"
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, padding: "32px 44px",
        minWidth: 340, maxWidth: 400, textAlign: "center",
        boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"
      }}>
        {/* 아이콘 */}
        <div style={{ fontSize: 48, marginBottom: 12 }}>
          {phase < 3 ? "🗑️" : "❌"}
        </div>

        {/* 제목 */}
        <div style={{
          fontSize: 16, fontWeight: 800, color: "#333",
          marginBottom: 6, letterSpacing: 1
        }}>
          {phase < 3 ? "삭제 중..." : "삭제 실패"}
        </div>

        {/* 설명 */}
        <div style={{ fontSize: 12, color: "#999", marginBottom: 20 }}>
          {phase < 2 && "\"나비\"를 시스템에서 제거하는 중..."}
          {phase === 2 && "파일 제거 중... 잠시만 기다려주세요."}
          {phase === 3 && "\"나비\"는 삭제할 수 없는 시스템 파일입니다."}
        </div>

        {/* 프로그레스 바 */}
        {phase >= 2 && (
          <div style={{
            width: "100%", height: 8, background: "#f0f0f0",
            borderRadius: 4, overflow: "hidden", marginBottom: 20
          }}>
            <div style={{
              width: `${progress * 100}%`, height: "100%",
              background: phase === 3
                ? "linear-gradient(90deg, #e8573d, #ff8a65)"
                : "linear-gradient(90deg, #e8573d, #e88b3d)",
              borderRadius: 4,
              transition: "width 0.05s linear"
            }} />
          </div>
        )}

        {/* 퍼센트 표시 */}
        {phase === 2 && (
          <div style={{ fontSize: 11, color: "#e88b3d", marginBottom: 16, fontWeight: 600 }}>
            {Math.floor(progress * 100)}%
          </div>
        )}

        {/* 가짜 로그 */}
        {phase === 2 && (
          <div style={{
            textAlign: "left", fontSize: 10, color: "#bbb",
            fontFamily: "monospace", lineHeight: 1.8, marginBottom: 16,
            maxHeight: 60, overflow: "hidden"
          }}>
            {progress > 0.1 && <div>removing navi.core...</div>}
            {progress > 0.3 && <div>deleting emotion_engine.dll...</div>}
            {progress > 0.5 && <div>purging sass_module.sys...</div>}
            {progress > 0.7 && <div>error: ACCESS_DENIED (0x80070005)</div>}
            {progress > 0.9 && <div>fatal: cannot remove protected entity</div>}
          </div>
        )}

        {/* 완료 후 확인 버튼 */}
        {phase === 3 && (
          <div onClick={onComplete} style={{
            display: "inline-block", padding: "12px 36px",
            background: "#e8573d", color: "#fff",
            borderRadius: 12, fontSize: 14, fontWeight: 700,
            cursor: "pointer", marginTop: 8,
            boxShadow: "0 4px 16px #e8573d44",
            transition: "transform 0.15s, box-shadow 0.15s"
          }}
          onMouseEnter={e => { e.target.style.transform = "scale(1.05)"; e.target.style.boxShadow = "0 6px 24px #e8573d66"; }}
          onMouseLeave={e => { e.target.style.transform = "scale(1)"; e.target.style.boxShadow = "0 4px 16px #e8573d44"; }}>
            확인
          </div>
        )}

        {/* Skip button */}
        <SkipButton active={active} delay={10} onSkip={onComplete} autoDismiss={25} />
      </div>
    </div>
  );
}
