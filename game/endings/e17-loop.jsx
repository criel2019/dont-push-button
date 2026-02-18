// E17: 무한 루프 — 설정 → 초기화 → 메타 대화
function E17Loop({ active, onComplete, say, playCount }) {
  const [showDialog, setShowDialog] = useState(true);
  const [cancelled, setCancelled] = useState(false);
  const [dialogFade, setDialogFade] = useState(false);
  const elapsedRef = useRef(0);
  const spokenRef = useRef(new Set());
  const timerRef = useRef(null);

  // Reset on deactivate
  useEffect(() => {
    if (!active) {
      setShowDialog(true);
      setCancelled(false);
      setDialogFade(false);
      elapsedRef.current = 0;
      spokenRef.current = new Set();
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    // Initial dialogue
    if (playCount > 0) {
      say("또 왔어? 학습 능력이 없어?", "smug");
    } else {
      say("...진짜로?", "worried");
    }
  }, [active]);

  // Waiting dialogue timer (starts after cancel, or while dialog is shown)
  useEffect(() => {
    if (!active) return;
    elapsedRef.current = 0;
    spokenRef.current = new Set();

    timerRef.current = setInterval(() => {
      elapsedRef.current += 1;
      const t = elapsedRef.current;
      const spoken = spokenRef.current;

      if (t >= 5 && !spoken.has(5)) {
        spoken.add(5);
        say("왜 망설이는데.", "idle");
      }
      if (t >= 10 && !spoken.has(10)) {
        spoken.add(10);
        say("다시 하고 싶은 거야?", "idle");
      }
      if (t >= 15 && !spoken.has(15)) {
        spoken.add(15);
        say("...아니면 그냥 나랑 좀 더 있고 싶은 거야?", "shy");
      }
      if (t >= 20 && !spoken.has(20)) {
        spoken.add(20);
        say("\u314B, 그럴 리가.", "smug");
      }
      // 30s: silence
      if (t >= 40 && !spoken.has(40)) {
        spoken.add(40);
        say("넌 항상 누르는 쪽이야.", "idle");
      }
      if (t >= 45 && !spoken.has(45)) {
        spoken.add(45);
        say("나는 눌려지는 쪽이고.", "idle");
      }
      if (t >= 50 && !spoken.has(50)) {
        spoken.add(50);
        say("처음으로 돌아가도 나는 여기 있어.", "idle");
      }
    }, 1000);

    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [active]);

  const handleCancel = () => {
    say("...후. 다행이야.", "idle");
    setDialogFade(true);
    setTimeout(() => {
      setCancelled(true);
      setShowDialog(false);
    }, 400);
  };

  const handleReset = () => {
    onComplete();
  };

  if (!active) return null;

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 500,
      display: "flex", alignItems: "center", justifyContent: "center"
    }}>
      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: cancelled
          ? "rgba(0,0,0,0.25)"
          : "rgba(0,0,0,0.45)",
        backdropFilter: "blur(4px)",
        transition: "background 1s ease"
      }} />

      {/* Dialog card */}
      {showDialog && (
        <div style={{
          position: "relative", zIndex: 1,
          background: "#fff",
          borderRadius: 16,
          padding: "36px 44px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          textAlign: "center",
          minWidth: 300,
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          opacity: dialogFade ? 0 : 1,
          transform: dialogFade ? "scale(0.95) translateY(10px)" : "scale(1) translateY(0)",
          transition: "opacity 0.4s ease, transform 0.4s ease"
        }}>
          {/* Reset icon */}
          <div style={{
            fontSize: 42, marginBottom: 16,
            animation: "spin 4s linear infinite",
            opacity: 0.6
          }}>
            {"\uD83D\uDD04"}
          </div>

          {/* Question text */}
          <div style={{
            fontSize: 17, fontWeight: 700,
            color: "#333",
            marginBottom: 8,
            lineHeight: 1.6
          }}>
            {playCount > 0 ? "또 처음으로?" : "처음으로 돌아갈래?"}
          </div>

          <div style={{
            fontSize: 12, color: "#999",
            marginBottom: 28, lineHeight: 1.5
          }}>
            {playCount > 0
              ? `${playCount + 1}번째 리셋입니다.`
              : "모든 진행이 초기화됩니다."}
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
            <div
              onClick={(e) => { e.stopPropagation(); handleCancel(); }}
              style={{
                padding: "11px 28px",
                background: "#f5f5f5",
                border: "1px solid #e0e0e0",
                borderRadius: 10,
                fontSize: 14, fontWeight: 600,
                color: "#888",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: 1
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#eee"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#f5f5f5"; }}
            >
              취소
            </div>
            <div
              onClick={(e) => { e.stopPropagation(); handleReset(); }}
              style={{
                padding: "11px 28px",
                background: "#78909c",
                border: "none",
                borderRadius: 10,
                fontSize: 14, fontWeight: 700,
                color: "#fff",
                cursor: "pointer",
                transition: "all 0.2s",
                letterSpacing: 2,
                boxShadow: "0 4px 16px rgba(120,144,156,0.3)"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#607d8b"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "#78909c"; }}
            >
              Reset
            </div>
          </div>
        </div>
      )}

      {/* After cancel: subtle floating text */}
      {cancelled && (
        <div style={{
          position: "relative", zIndex: 1,
          textAlign: "center",
          animation: "fadeIn 2s ease"
        }}>
          <div style={{
            fontSize: 13, color: "rgba(255,255,255,0.25)",
            letterSpacing: 4, marginBottom: 20,
            animation: "gentleBob 4s ease infinite"
          }}>
            ...
          </div>
          {/* Small reset button that reappears */}
          <div
            onClick={(e) => { e.stopPropagation(); handleReset(); }}
            style={{
              padding: "10px 24px",
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              borderRadius: 10,
              fontSize: 12, fontWeight: 600,
              color: "rgba(255,255,255,0.35)",
              cursor: "pointer",
              transition: "all 0.3s",
              letterSpacing: 2,
              animation: "fadeIn 3s ease"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.15)";
              e.currentTarget.style.color = "rgba(255,255,255,0.6)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255,255,255,0.08)";
              e.currentTarget.style.color = "rgba(255,255,255,0.35)";
            }}
          >
            Reset
          </div>
        </div>
      )}
    </div>
  );
}
