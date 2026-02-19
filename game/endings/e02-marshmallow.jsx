// E02: 마시멜로 — 시계 클릭 → 1분 인내 테스트, 나비가 방해공작
function E02Marshmallow({ active, onComplete, onDismiss, say, doShake, frame }) {
  const [timer, setTimer] = useState(60);
  const [running, setRunning] = useState(false);
  const [showFakeAd, setShowFakeAd] = useState(false);
  const [blurred, setBlurred] = useState(false);
  const [wonky, setWonky] = useState(false);
  const [bonusAdded, setBonusAdded] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [nagged, setNagged] = useState(false);
  const timerRef = useRef(null);
  const sabotageRef = useRef({ s40: false, s30: false, s20: false, s10: false, s5: false });

  // 시작
  useEffect(() => {
    if (!active) {
      setRunning(false); setTimer(60); setShowFakeAd(false);
      setBlurred(false); setWonky(false); setBonusAdded(false);
      setCompleted(false); setNagged(false);
      sabotageRef.current = { s40: false, s30: false, s20: false, s10: false, s5: false };
      return;
    }
    setRunning(true);
    say("1분만 참아봐. 할 수 있지? ...아 너는 모르겠다.", "smug");
  }, [active]);

  // 타이머 엔진
  useEffect(() => {
    if (!running || completed) return;

    const tickSpeed = wonky ? (Math.random() > 0.5 ? 400 : 1800) : 1000;

    timerRef.current = setTimeout(() => {
      setTimer(prev => {
        const next = prev - 1;

        if (next <= 0) {
          setRunning(false);
          setCompleted(true);
          say("헐... 진짜 1분 버텼어?! 대단한데?!", "shocked");
          return 0;
        }
        return next;
      });
    }, tickSpeed);

    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [running, timer, wonky, completed]);

  // 방해 이벤트 트리거
  useEffect(() => {
    if (!running || completed) return;
    const s = sabotageRef.current;

    // 40초 남음: 가짜 광고 팝업
    if (timer <= 40 && !s.s40) {
      s.s40 = true;
      say("아 미안 손이 미끄러졌어~", "teasing");
      setShowFakeAd(true);
    }

    // 30초 남음: 화면 흔들기
    if (timer <= 30 && !s.s30) {
      s.s30 = true;
      doShake();
      say("지루하지~? 나도 지루해~", "bored");
    }

    // 20초 남음: 숫자 블러
    if (timer <= 20 && !s.s20) {
      s.s20 = true;
      setBlurred(true);
      say("몇 초 남았게? 비ㅡ밀ㅡ", "smug");
    }

    // 10초 남음: 타이머 속도 변칙
    if (timer <= 10 && !s.s10) {
      s.s10 = true;
      setWonky(true);
      say("어라? 시계가 왜 이래. 나는 모르는 일인데.", "teasing");
    }

    // 5초 남음: +30초 추가!
    if (timer <= 5 && !s.s5) {
      s.s5 = true;
      setBonusAdded(true);
      doShake();
      say("앗, 30초 추가요~ 미안 이건 진짜 실수야 아마도", "excited");
      setTimer(prev => prev + 30);
    }
  }, [timer, running, completed]);

  // 장시간 경과 후 포기 유도 (70초 이상 경과)
  useEffect(() => {
    if (!active || completed || nagged) return;
    const t = setTimeout(() => {
      setNagged(true);
      say("야, 포기는 부끄러운 거 아냐. 그냥 용기 있는 선택이야. 빨리 눌러.", "smug");
    }, 70000);
    return () => clearTimeout(t);
  }, [active, completed, nagged]);

  if (!active) return null;

  const minutes = String(Math.floor(timer / 60)).padStart(2, "0");
  const seconds = String(timer % 60).padStart(2, "0");
  const isUrgent = timer <= 10;

  return (
    <div style={{ position: "absolute", inset: 0, zIndex: 350, pointerEvents: "none" }}>
      {/* 타이머 디스플레이 */}
      <div style={{
        position: "absolute", top: "38%", left: "50%",
        transform: "translate(-50%, -50%)", textAlign: "center",
        zIndex: 360
      }}>
        <div style={{
          fontSize: 96, fontWeight: 800, letterSpacing: 8,
          color: isUrgent ? "#e8573d" : "#e88b3d",
          textShadow: `0 8px 48px ${isUrgent ? "#e8573d44" : "#e88b3d22"}`,
          animation: isUrgent ? "pulse 0.5s ease infinite" : "none",
          filter: blurred ? "blur(12px)" : "none",
          transition: "filter 0.5s, color 0.5s",
          fontFamily: "monospace"
        }}>
          {minutes}:{seconds}
        </div>

        <div style={{
          fontSize: 10, color: "#b0a09088", letterSpacing: 5, marginTop: 8,
          textTransform: "uppercase"
        }}>
          marshmallow challenge
        </div>

        {/* 상태 메시지 */}
        {timer <= 30 && timer > 10 && !completed && (
          <div style={{
            marginTop: 16, fontSize: 13, color: "#e88b3d",
            animation: "pulse 1.2s ease infinite"
          }}>
            참을 수 있어...?
          </div>
        )}

        {bonusAdded && timer > 10 && (
          <div style={{
            marginTop: 12, fontSize: 14, fontWeight: 700, color: "#e8573d",
            animation: "popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)"
          }}>
            +30초 추가!!
          </div>
        )}

        {completed && (
          <div style={{
            marginTop: 20, fontSize: 16, fontWeight: 700, color: "#2e9e5a",
            animation: "popIn 0.3s ease"
          }}>
            성공...?!
          </div>
        )}
      </div>

      {/* 가짜 광고 팝업 (40초 남았을 때) */}
      {showFakeAd && (
        <div style={{
          position: "absolute", top: "20%", left: "50%",
          transform: "translate(-50%, 0)",
          width: 280, background: "linear-gradient(135deg, #ff6f00, #ffa000)",
          borderRadius: 16, padding: "20px 24px", textAlign: "center",
          boxShadow: "0 12px 40px rgba(255,111,0,0.4)",
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          zIndex: 380, border: "3px solid #fff",
          pointerEvents: "auto"
        }}>
          <div style={{ fontSize: 10, color: "#fff8", marginBottom: 4 }}>ADVERTISEMENT</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#fff", marginBottom: 6 }}>
            FREE MARSHMALLOWS!!
          </div>
          <div style={{ fontSize: 12, color: "#fff", marginBottom: 12, lineHeight: 1.5 }}>
            지금 클릭하면 무료 마시멜로 100개!
          </div>
          <div onClick={() => setShowFakeAd(false)} style={{
            padding: "8px 20px", background: "#fff", color: "#ff6f00",
            borderRadius: 8, fontSize: 11, fontWeight: 700,
            cursor: "pointer", display: "inline-block"
          }}>
            닫기 (X)
          </div>
          <div style={{
            position: "absolute", top: -8, right: -8, width: 24, height: 24,
            background: "#fff", borderRadius: "50%", display: "flex",
            alignItems: "center", justifyContent: "center",
            fontSize: 14, color: "#ccc", cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
          }} onClick={() => setShowFakeAd(false)}>
            x
          </div>
        </div>
      )}

      {/* 타이머 변칙 시각 효과 */}
      {wonky && !completed && (
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 14, color: "#e8573d88",
          animation: "shake 0.3s ease infinite",
          zIndex: 355
        }}>
          ⚠ TIMER ERROR ⚠
        </div>
      )}

      {/* Skip button */}
      <SkipButton active={active} delay={12} onSkip={onDismiss} autoDismiss={25} />
    </div>
  );
}
