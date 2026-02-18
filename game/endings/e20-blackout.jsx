// E20: 암전 — 모든 스테이지 통과 후 무행동 시 발동 (진 엔딩)
function E20Blackout({ active, onComplete, onDismiss, say, naviGone }) {
  const [darkness, setDarkness] = useState(0);
  const [phase, setPhase] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [floatingTexts, setFloatingTexts] = useState([]);
  const elapsedRef = useRef(0);
  const spokenRef = useRef(new Set());

  // Reset on deactivate
  useEffect(() => {
    if (!active) {
      setDarkness(0);
      setPhase(0);
      setShowButton(false);
      setFloatingTexts([]);
      elapsedRef.current = 0;
      spokenRef.current = new Set();
      return;
    }

    // Start the sequence
    say("...재미없어.", "pouty");

    const iv = setInterval(() => {
      elapsedRef.current += 1;
      const t = elapsedRef.current;
      const spoken = spokenRef.current;

      // ── Progressive darkness ──
      if (t <= 25) {
        setDarkness(t * 0.012); // 0 → 0.3
      } else if (t <= 45) {
        setDarkness(0.3 + (t - 25) * 0.02); // 0.3 → 0.7
      } else if (t <= 58) {
        setDarkness(0.7 + (t - 45) * 0.018); // 0.7 → 0.93
      } else if (t <= 68) {
        setDarkness(Math.min(0.93 + (t - 58) * 0.007, 1.0));
      }

      // ══════════════════════════════════════
      // Phase 1: 시큰둥 + 도발 (0-12s)
      // ══════════════════════════════════════
      if (t === 5 && !spoken.has(5)) {
        spoken.add(5);
        say("진짜 안 누를 거야? 끝까지?", "pouty");
      }
      if (t === 10 && !spoken.has(10)) {
        spoken.add(10);
        say("대단하다 대단해~ 진짜 대단해~", "smug");
      }

      // ══════════════════════════════════════
      // Phase 2: 떡밥 투척 (16-28s)
      // ══════════════════════════════════════
      if (t === 16 && !spoken.has(16)) {
        spoken.add(16);
        say("근데 있잖아, 궁금한 거 없어?", "teasing");
      }
      if (t === 22 && !spoken.has(22)) {
        spoken.add(22);
        say("버튼 뒤에 뭐가 있는지.", "teasing");
      }
      if (t === 27 && !spoken.has(27)) {
        spoken.add(27);
        say("알려줄까?", "smug");
      }

      // ══════════════════════════════════════
      // Phase 3: 첫 번째 뒤집기 — "아무것도 없어" (32-40s)
      // ══════════════════════════════════════
      if (t === 33 && !spoken.has(33)) {
        spoken.add(33);
        say("...아무것도 없어.", "idle");
      }
      if (t === 37 && !spoken.has(37)) {
        spoken.add(37);
        say("ㅋㅋㅋㅋㅋㅋㅋㅋ", "excited");
      }
      if (t === 41 && !spoken.has(41)) {
        spoken.add(41);
        say("니가 10분 동안 참은 거, 아~무 의미 없었어.", "smug");
      }

      // ══════════════════════════════════════
      // Phase 4: 두 번째 뒤집기 — "...라고 하면?" (46-56s)
      // ══════════════════════════════════════
      if (t === 47 && !spoken.has(47)) {
        spoken.add(47);
        say("...라고 하면 믿을 줄 알았지?", "teasing");
      }
      if (t === 52 && !spoken.has(52)) {
        spoken.add(52);
        say("사실 있긴 있거든~? 근데 안 알려줘~", "confident");
      }
      if (t === 57 && !spoken.has(57)) {
        spoken.add(57);
        say("궁금하면 눌렀어야지~", "smug");
      }

      // ══════════════════════════════════════
      // Phase 5: 나비 퇴장 (62s)
      // ══════════════════════════════════════
      if (t === 62 && !spoken.has(62)) {
        spoken.add(62);
        say("아 배고파. 나 간다~", "confident");
      }
      if (t === 66 && !spoken.has(66)) {
        spoken.add(66);
        setPhase(1); // CRT off
      }

      // ══════════════════════════════════════
      // Phase 6: 완전 암전 (70s)
      // ══════════════════════════════════════
      if (t === 70 && !spoken.has(70)) {
        spoken.add(70);
        setDarkness(1.0);
        setPhase(2);
      }

      // ══════════════════════════════════════
      // Phase 7: 어둠 속 텍스트 연출 (76-86s)
      // ══════════════════════════════════════
      if (t === 76 && !spoken.has(76)) {
        spoken.add(76);
        setFloatingTexts(["버튼을 누르지 않았습니다."]);
      }
      if (t === 82 && !spoken.has(82)) {
        spoken.add(82);
        setFloatingTexts(p => [...p, "...그래서 뭐가 달라졌을까요?"]);
      }
      if (t === 88 && !spoken.has(88)) {
        spoken.add(88);
        setFloatingTexts(p => [...p, "다음엔 눌러보세요. 아마도."]);
      }

      // Phase 8: 버튼 등장 (94s)
      if (t === 94 && !spoken.has(94)) {
        spoken.add(94);
        setShowButton(true);
        clearInterval(iv);
      }
    }, 1000);

    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexDirection: "column"
    }}>
      {/* Progressive darkness overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: `rgba(0,0,0,${darkness})`,
        transition: "background 1.5s ease",
        pointerEvents: "none"
      }} />

      {/* Extra darkness layer for full black */}
      {phase >= 2 && (
        <div style={{
          position: "absolute", inset: 0,
          background: "#000",
          animation: "fadeIn 2s ease forwards",
          pointerEvents: "none"
        }} />
      )}

      {/* Floating texts in darkness */}
      {floatingTexts.length > 0 && (
        <div style={{
          position: "relative", zIndex: 10,
          textAlign: "center",
          pointerEvents: "none",
          display: "flex", flexDirection: "column",
          gap: 20, marginBottom: showButton ? 48 : 0
        }}>
          {floatingTexts.map((text, i) => (
            <div key={i} style={{
              fontSize: i === 2 ? 13 : 15,
              fontWeight: 300,
              letterSpacing: i === 2 ? 2 : 4,
              color: i === 2 ? "rgba(232,87,61,0.5)" : "rgba(120,120,130,0.5)",
              animation: "e20TextFade 3s ease forwards",
              lineHeight: 1.8
            }}>
              {text}
            </div>
          ))}
        </div>
      )}

      {/* MiniNuclearButton */}
      {showButton && (
        <div style={{
          position: "relative", zIndex: 10,
          animation: "e20TextFade 3s ease"
        }}>
          <MiniNuclearButton label="확인" onPress={onComplete} />
        </div>
      )}

      {/* E20은 진 엔딩 — 건너뛰기 없음 */}

      <style>{`
        @keyframes e20TextFade {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
      `}</style>
    </div>
  );
}
