// E05: 낚시 — 경품 배너 클릭 → 스팸 팝업 증식
function E05Scam({ active, onComplete, onDismiss, say, doShake }) {
  const [popups, setPopups] = useState([]);
  const [xClicks, setXClicks] = useState(0);
  const [showCollect, setShowCollect] = useState(false);
  const popupIdRef = useRef(0);

  const scamTexts = [
    "축하합니다!", "당첨!!", "100만원!!", "수령하세요!",
    "경품 이벤트!!", "무료 체험!", "한정 수량!", "클릭!!"
  ];

  useEffect(() => {
    if (!active) {
      setPopups([]);
      setXClicks(0);
      setShowCollect(false);
      popupIdRef.current = 0;
      return;
    }
    // Initial banner
    popupIdRef.current = 1;
    setPopups([{
      id: 1,
      x: 50, y: 50,
      rot: 0,
      text: "\uD83C\uDF89 축하합니다!! 100만원 당첨!! \uD83C\uDF89",
      big: true
    }]);
    say("오, 100만원이래. 대박 아니야? 아닌가?", "excited");
  }, [active]);

  const spawnPopups = useCallback((count) => {
    const newPopups = [];
    for (let i = 0; i < count; i++) {
      popupIdRef.current += 1;
      newPopups.push({
        id: popupIdRef.current,
        x: 8 + Math.random() * 78,
        y: 8 + Math.random() * 78,
        rot: (Math.random() - 0.5) * 16,
        text: pickRandom(scamTexts),
        big: false
      });
    }
    setPopups(prev => [...prev, ...newPopups]);
  }, []);

  const handleXClick = useCallback((e, popupId) => {
    e.stopPropagation();
    doShake();
    setXClicks(prev => {
      const n = prev + 1;

      if (n === 1) {
        say("왜 꺼? 100만원이라잖아. 한번 믿어보지 그래.", "pouty");
        spawnPopups(2);
      } else if (n === 2) {
        say("야!! 나 끼었어!! ...이것도 니 탓이야.", "shocked");
        spawnPopups(3);
      } else if (n === 3) {
        say("닫아도 닫아도 끝이 없잖아!!", "angry");
        spawnPopups(4);
      } else if (n === 4) {
        say("음... 수령 누르면 없어지려나? 나는 모르겠는데~", "smug");
        spawnPopups(5);
      } else if (n >= 5) {
        say("에이 몰라, 그냥 수령 눌러!", "excited");
        spawnPopups(6);
        setTimeout(() => setShowCollect(true), 600);
      }

      return n;
    });
  }, [say, doShake, spawnPopups]);

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      background: "rgba(0,0,0,0.3)",
      animation: "fadeIn 0.3s ease"
    }}>
      {/* Popups */}
      {popups.map(p => (
        <div key={p.id} style={{
          position: "absolute",
          left: `${p.x}%`, top: `${p.y}%`,
          transform: `translate(-50%,-50%) rotate(${p.rot}deg)`,
          background: "linear-gradient(135deg, #ffd700, #ff8f00)",
          border: "3px solid #ff6f00",
          borderRadius: 16,
          padding: p.big ? "20px 32px" : "14px 22px",
          textAlign: "center",
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow: "0 8px 32px rgba(255,152,0,0.4), 0 2px 8px rgba(0,0,0,0.2)",
          zIndex: 401 + p.id,
          minWidth: p.big ? 240 : 120
        }}>
          {/* Confetti decoration */}
          <div style={{
            position: "absolute", top: -6, left: 8,
            fontSize: 12, animation: "float 2s ease infinite"
          }}>🎊</div>
          <div style={{
            position: "absolute", top: -4, right: 10,
            fontSize: 10, animation: "float 1.8s ease infinite 0.3s"
          }}>🎉</div>

          {/* X button */}
          {!showCollect && (
            <div
              onClick={(e) => handleXClick(e, p.id)}
              style={{
                position: "absolute", top: -8, right: -8,
                width: 20, height: 20, borderRadius: "50%",
                background: "#c0392b", color: "#fff",
                fontSize: 10, fontWeight: 800,
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", border: "2px solid #fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                zIndex: 999, lineHeight: 1
              }}
            >✕</div>
          )}

          <div style={{
            fontSize: p.big ? 16 : 13,
            fontWeight: 800,
            color: "#fff",
            textShadow: "0 1px 3px rgba(0,0,0,0.3)",
            letterSpacing: 1
          }}>
            {p.text}
          </div>

          {p.big && (
            <div style={{
              fontSize: 10, color: "#fff8", marginTop: 6
            }}>
              ※ 수수료 없음 ※ 즉시 지급
            </div>
          )}
        </div>
      ))}

      {/* Skip button */}
      <SkipButton active={active} delay={8} onSkip={onDismiss} autoDismiss={25} />

      {/* Collect button - appears after 5 X clicks */}
      {showCollect && (
        <div style={{
          position: "absolute",
          left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          zIndex: 9999
        }}>
          <MiniNuclearButton label="수령" onPress={onComplete} />
        </div>
      )}
    </div>
  );
}
