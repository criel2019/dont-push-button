// E14: 뉴스 속보 — TV 채널 서핑 → 뉴스 에스컬레이션
function E14News({ active, onComplete, say, doShake }) {
  const [channel, setChannel] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [escalated, setEscalated] = useState(false);
  const [showStatic, setShowStatic] = useState(false);
  const [showLaunch, setShowLaunch] = useState(false);
  const [ch5Viewed, setCh5Viewed] = useState(false);
  const [ch5Time, setCh5Time] = useState(0);
  const [tickerOffset, setTickerOffset] = useState(0);
  const [missileY, setMissileY] = useState(100);
  const spokenRef = useRef({});

  // Reset
  useEffect(() => {
    if (!active) {
      setChannel(0);
      setElapsed(0);
      setEscalated(false);
      setShowStatic(false);
      setShowLaunch(false);
      setCh5Viewed(false);
      setCh5Time(0);
      setTickerOffset(0);
      setMissileY(100);
      spokenRef.current = {};
      return;
    }
  }, [active]);

  // Elapsed timer
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [active]);

  // Auto-escalation at 30s if still not escalated
  useEffect(() => {
    if (!active || escalated) return;
    const t = setTimeout(() => {
      if (!escalated) {
        setChannel(4);
        setCh5Viewed(true);
        setCh5Time(3);
      }
    }, 30000);
    return () => clearTimeout(t);
  }, [active, escalated]);

  // Track CH5 viewing time
  useEffect(() => {
    if (!active || channel !== 4 || escalated) return;
    setCh5Viewed(true);
    const iv = setInterval(() => setCh5Time(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [active, channel, escalated]);

  // Escalation trigger: CH5 viewed for 3s
  useEffect(() => {
    if (!active || escalated) return;
    if (ch5Time >= 3 && ch5Viewed) {
      setEscalated(true);
      say("\uC694\uACA9 \uC2E4\uD328. \uC0C1\uD669\uC774 \uC88B\uC9C0 \uC54A\uC2B5\uB2C8\uB2E4.", "worried");
      doShake();
    }
  }, [active, ch5Time, ch5Viewed, escalated]);

  // Post-escalation: show launch button after 5s
  useEffect(() => {
    if (!active || !escalated) return;
    const t1 = setTimeout(() => {
      say("\uC57C... \uC548 \uC3DF\uBA74 \uC9C4\uC9DC \uB05D\uC774\uC57C.", "worried");
    }, 5000);
    const t2 = setTimeout(() => {
      setShowLaunch(true);
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active, escalated]);

  // Ticker scroll animation
  useEffect(() => {
    if (!active || !escalated) return;
    const iv = setInterval(() => setTickerOffset(p => p - 1), 30);
    return () => clearInterval(iv);
  }, [active, escalated]);

  // Missile animation
  useEffect(() => {
    if (!active || !escalated) return;
    const iv = setInterval(() => setMissileY(p => p <= -20 ? 100 : p - 1.5), 50);
    return () => clearInterval(iv);
  }, [active, escalated]);

  // Channel switch static
  const switchChannel = (dir) => {
    setShowStatic(true);
    const next = ((channel + dir) + 5) % 5;
    setTimeout(() => {
      setChannel(next);
      setShowStatic(false);
    }, 200);
  };

  // Channel content definitions
  const normalChannels = [
    {
      id: "CH1", name: "\uC694\uB9AC",
      bg: "linear-gradient(180deg, #ff9800, #e65100)",
      emoji: "\uD83C\uDF73", label: "\uC624\uB298\uC758 \uC694\uB9AC",
      sub: "\uBC84\uD2BC \uC870\uB9BC \uB808\uC2DC\uD53C",
      dialogue: "\uC624\uB298\uC758 \uC694\uB9AC\uB294~ \uBC84\uD2BC \uC870\uB9BC! ...\uC544 \uC774\uAC74 \uC544\uB2C8\uB2E4.",
      emotion: "happy"
    },
    {
      id: "CH2", name: "\uB2E4\uD050",
      bg: "linear-gradient(180deg, #2e7d32, #1b5e20)",
      emoji: "\uD83E\uDD8B", label: "\uC790\uC5F0 \uB2E4\uD050\uBA58\uD130\uB9AC",
      sub: "\uB098\uBE44\uB098\uBE44\uBAA9 \uB098\uBE44\uACFC",
      dialogue: "\uB098\uBE44\uB098\uBE44\uBAA9 \uB098\uBE44\uACFC. \uC8FC \uC11C\uC2DD\uC9C0\uB294 CRT \uBAA8\uB2C8\uD130.",
      emotion: "confident"
    },
    {
      id: "CH3", name: "\uD648\uC1FC\uD551",
      bg: "linear-gradient(180deg, #e91e63, #880e4f)",
      emoji: "\uD83C\uDF73", label: "SUPER DEAL",
      sub: "\uC778\uC0DD\uC774 \uBC14\uB00C\uB294 \uD504\uB77C\uC774\uD32C",
      dialogue: "\uC774 \uD504\uB77C\uC774\uD32C \uD558\uB098\uBA74 \uC778\uC0DD\uC774 \uBC14\uB01D\uB2C8\uB2E4! ...\uC548 \uBC14\uB00C\uC5B4\uB3C4 \uB0B4 \uD0D3 \uC544\uB2D8.",
      emotion: "excited"
    },
    {
      id: "CH4", name: "\uC74C\uC545",
      bg: "linear-gradient(180deg, #7b1fa2, #4a148c)",
      emoji: "\uD83C\uDFB5", label: "MUSIC LIVE",
      sub: "\uB77C\uB77C\uB77C~\u266A",
      dialogue: "\uB77C\uB77C\uB77C~\u266A ...\uC654 \uADF8\uB807\uAC8C \uBD10. \uC798\uD558\uC796\uC544.",
      emotion: "happy"
    },
    {
      id: "CH5", name: "\uB274\uC2A4",
      bg: "linear-gradient(180deg, #1565c0, #0d47a1)",
      emoji: "\uD83D\uDCFA", label: "\uC18D\uBCF4",
      sub: "\uC815\uCCB4\uBD88\uBA85 \uBBF8\uC0AC\uC77C \uBC1C\uC0AC",
      dialogue: "\uC18D\uBCF4\uC785\uB2C8\uB2E4. \uC815\uCCB4\uBD88\uBA85 \uBBF8\uC0AC\uC77C\uC774 \uBC1C\uC0AC\uB410\uC2B5\uB2C8\uB2E4.",
      emotion: "idle"
    }
  ];

  const escalatedChannels = [
    {
      id: "CH1", name: "\uC694\uB9AC",
      bg: "linear-gradient(180deg, #b71c1c, #880e0e)",
      emoji: "\uD83C\uDF73", label: "\uC18D\uBCF4",
      sub: "\uB9C8\uC9C0\uB9C9 \uC694\uB9AC...",
      dialogue: "\uB9C8\uC9C0\uB9C9 \uC694\uB9AC... \uACC4\uB780\uD504\uB77C\uC774\uB77C\uB3C4...",
      emotion: "cry"
    },
    {
      id: "CH2", name: "\uB2E4\uD050",
      bg: "linear-gradient(180deg, #b71c1c, #880e0e)",
      emoji: "\uD83E\uDD8B", label: "\uC18D\uBCF4",
      sub: "\uAE34\uAE09 \uC18D\uBCF4",
      dialogue: "\uBAA8\uB4E0 \uCC44\uB110\uC774 \uC18D\uBCF4\uB85C \uC804\uD658\uB418\uC5C8\uC2B5\uB2C8\uB2E4.",
      emotion: "worried"
    },
    {
      id: "CH3", name: "\uD648\uC1FC\uD551",
      bg: "linear-gradient(180deg, #b71c1c, #880e0e)",
      emoji: "\uD83D\uDEA8", label: "\uC18D\uBCF4",
      sub: "\uAE34\uAE09 \uB300\uD53C \uC548\uB0B4",
      dialogue: "\uC0C1\uD488 \uD310\uB9E4\uB97C \uC911\uB2E8\uD569\uB2C8\uB2E4. \uB300\uD53C\uD558\uC138\uC694.",
      emotion: "worried"
    },
    {
      id: "CH4", name: "\uC74C\uC545",
      bg: "linear-gradient(180deg, #b71c1c, #880e0e)",
      emoji: "\uD83C\uDFB5", label: "\uC18D\uBCF4",
      sub: "\uB9C8\uC9C0\uB9C9 \uBC29\uC1A1",
      dialogue: "...\uB354 \uC774\uC0C1 \uBD80\uB97C \uB178\uB798\uAC00 \uC5C6\uC5B4.",
      emotion: "worried"
    },
    {
      id: "CH5", name: "\uB274\uC2A4",
      bg: "linear-gradient(180deg, #b71c1c, #880e0e)",
      emoji: "\uD83D\uDCFA", label: "\uC18D\uBCF4",
      sub: "\uC694\uACA9 \uC2E4\uD328 \u2014 \uCD5C\uD6C4\uC758 \uC218\uB2E8",
      dialogue: "\uC694\uACA9\uC5D0 \uC2E4\uD328\uD588\uC2B5\uB2C8\uB2E4. \uB300\uC751 \uBC1C\uC0AC\uAC00 \uD544\uC694\uD569\uB2C8\uB2E4.",
      emotion: "worried"
    }
  ];

  // Speak channel dialogue when switching
  useEffect(() => {
    if (!active) return;
    const chList = escalated ? escalatedChannels : normalChannels;
    const current = chList[channel];
    const key = (escalated ? "esc_" : "norm_") + channel;
    if (!spokenRef.current[key]) {
      spokenRef.current[key] = true;
      say(current.dialogue, current.emotion);
    }
  }, [active, channel, escalated]);

  if (!active) return null;

  const chList = escalated ? escalatedChannels : normalChannels;
  const ch = chList[channel];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      background: "#111",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease"
    }}>
      {/* TV Frame */}
      <div style={{
        position: "relative",
        width: 340, maxWidth: "90%",
        aspectRatio: "4/3",
        background: "#222",
        borderRadius: 16,
        border: "6px solid #333",
        boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 0 60px rgba(0,0,0,0.3)",
        overflow: "hidden"
      }}>
        {/* Static/snow overlay during channel switch */}
        {showStatic && (
          <div style={{
            position: "absolute", inset: 0, zIndex: 10,
            background: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
            opacity: 0.8
          }} />
        )}

        {/* Channel content */}
        <div style={{
          position: "absolute", inset: 0,
          background: ch.bg,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          transition: "background 0.3s"
        }}>
          {/* Channel number badge */}
          <div style={{
            position: "absolute", top: 10, left: 10,
            background: "rgba(0,0,0,0.6)",
            color: "#fff", fontSize: 11, fontWeight: 800,
            padding: "3px 10px", borderRadius: 4,
            letterSpacing: 2, zIndex: 5
          }}>
            {ch.id}
          </div>

          {/* LIVE indicator for news */}
          {(channel === 4 || escalated) && (
            <div style={{
              position: "absolute", top: 10, right: 10,
              display: "flex", alignItems: "center", gap: 4, zIndex: 5
            }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: "#f44336",
                animation: "pulse 1s ease infinite"
              }} />
              <span style={{ color: "#fff", fontSize: 10, fontWeight: 800 }}>LIVE</span>
            </div>
          )}

          {/* Channel emoji and label */}
          <div style={{ fontSize: 56, marginBottom: 8 }}>{ch.emoji}</div>
          <div style={{
            fontSize: 22, fontWeight: 900, color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.4)",
            letterSpacing: 2
          }}>
            {ch.label}
          </div>
          <div style={{
            fontSize: 12, color: "rgba(255,255,255,0.8)",
            marginTop: 6, letterSpacing: 1
          }}>
            {ch.sub}
          </div>

          {/* Escalation: missile animation */}
          {escalated && (
            <div style={{
              position: "absolute",
              right: 30,
              top: `${missileY}%`,
              fontSize: 28,
              transform: "rotate(-45deg)",
              transition: "top 0.05s linear"
            }}>
              {"\uD83D\uDE80"}
            </div>
          )}
        </div>

        {/* Breaking news ticker */}
        {escalated && (
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0,
            background: "rgba(200, 0, 0, 0.9)",
            padding: "6px 0",
            overflow: "hidden",
            zIndex: 6
          }}>
            <div style={{
              display: "flex", alignItems: "center"
            }}>
              <div style={{
                background: "#fff", color: "#c00",
                fontSize: 10, fontWeight: 900,
                padding: "2px 8px", marginLeft: 6,
                flexShrink: 0
              }}>
                {"\uC18D\uBCF4"}
              </div>
              <div style={{
                color: "#fff", fontSize: 11, fontWeight: 600,
                whiteSpace: "nowrap",
                marginLeft: tickerOffset % 600,
                letterSpacing: 1
              }}>
                [긴급] 요격 실패 — 대응 미사일 발사 필요 — 시민 대피 권고 — 모든 채널 뉴스 전환 — 버튼을 눌러 대응 발사 — 반복 —
              </div>
            </div>
          </div>
        )}

        {/* CRT scanline effect */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 8,
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)"
        }} />

        {/* Screen curvature effect */}
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 9,
          background: "radial-gradient(ellipse at 50% 50%, transparent 70%, rgba(0,0,0,0.25) 100%)"
        }} />
      </div>

      {/* Channel navigation */}
      <div style={{
        display: "flex", alignItems: "center", gap: 16,
        marginTop: 20
      }}>
        <div
          onClick={() => switchChannel(-1)}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#fff", fontSize: 18, fontWeight: 800,
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          {"\u25C0"}
        </div>

        {/* Channel dots */}
        <div style={{ display: "flex", gap: 8 }}>
          {chList.map((c, i) => (
            <div key={i}
              onClick={() => {
                setShowStatic(true);
                setTimeout(() => { setChannel(i); setShowStatic(false); }, 200);
              }}
              style={{
                padding: "6px 12px",
                background: i === channel ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.05)",
                borderRadius: 8, cursor: "pointer",
                fontSize: 10, color: "#fff", fontWeight: 700,
                border: `1px solid ${i === channel ? "rgba(255,255,255,0.3)" : "rgba(255,255,255,0.1)"}`,
                transition: "all 0.2s",
                letterSpacing: 1
              }}
            >
              {i + 1}
            </div>
          ))}
        </div>

        <div
          onClick={() => switchChannel(1)}
          style={{
            width: 40, height: 40, borderRadius: "50%",
            background: "rgba(255,255,255,0.1)",
            border: "1px solid rgba(255,255,255,0.2)",
            display: "flex", alignItems: "center", justifyContent: "center",
            cursor: "pointer", color: "#fff", fontSize: 18, fontWeight: 800,
            transition: "background 0.2s"
          }}
          onMouseEnter={e => e.currentTarget.style.background = "rgba(255,255,255,0.2)"}
          onMouseLeave={e => e.currentTarget.style.background = "rgba(255,255,255,0.1)"}
        >
          {"\u25B6"}
        </div>
      </div>

      {/* Skip button */}
      <SkipButton active={active} delay={40} onSkip={onComplete} />

      {/* Launch button */}
      {showLaunch && (
        <div style={{
          marginTop: 24,
          animation: "fadeIn 0.5s ease"
        }}>
          <div
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            style={{
              padding: "18px 48px",
              background: "radial-gradient(circle at 40% 30%, #f44336, #b71c1c)",
              color: "#fff",
              fontSize: 22,
              fontWeight: 900,
              borderRadius: 50,
              cursor: "pointer",
              letterSpacing: 6,
              border: "3px solid #ff5252",
              boxShadow: "0 0 30px rgba(244,67,54,0.5), 0 8px 32px rgba(0,0,0,0.4)",
              textShadow: "0 2px 4px rgba(0,0,0,0.5)",
              transition: "transform 0.15s, box-shadow 0.15s",
              userSelect: "none"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = "scale(1.08)";
              e.currentTarget.style.boxShadow = "0 0 50px rgba(244,67,54,0.7), 0 8px 32px rgba(0,0,0,0.4)";
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = "scale(1)";
              e.currentTarget.style.boxShadow = "0 0 30px rgba(244,67,54,0.5), 0 8px 32px rgba(0,0,0,0.4)";
            }}
          >
            {"\uBC1C\uC0AC"}
          </div>
          <div style={{
            textAlign: "center", marginTop: 6,
            fontSize: 9, color: "#666", letterSpacing: 3
          }}>
            LAUNCH
          </div>
        </div>
      )}
    </div>
  );
}
