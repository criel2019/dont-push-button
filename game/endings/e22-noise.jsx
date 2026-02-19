// E22: 시끄러워 — 마이크 감지, 어느 스테이지에서든 랜덤 발동
function E22Noise({ active, onComplete, onDismiss, say, doShake }) {
  const [gauge, setGauge] = useState(0);
  const [showButton, setShowButton] = useState(false);
  const [sabotageText, setSabotageText] = useState("");
  const [sabotageKey, setSabotageKey] = useState(0);
  const [funnyFace, setFunnyFace] = useState(false);
  const [waveBars, setWaveBars] = useState([]);
  const elapsedRef = useRef(0);
  const spokenRef = useRef(new Set());
  const gaugeRef = useRef(0);
  const completedRef = useRef(false);

  // Generate sound wave visualization bars
  useEffect(() => {
    if (!active) return;
    const bars = [];
    for (let i = 0; i < 24; i++) {
      bars.push({
        id: i,
        baseHeight: 10 + Math.random() * 20,
        speed: 0.3 + Math.random() * 0.7,
        phase: Math.random() * Math.PI * 2
      });
    }
    setWaveBars(bars);
  }, [active]);

  // Reset on deactivate
  useEffect(() => {
    if (!active) {
      setGauge(0);
      setShowButton(false);
      setSabotageText("");
      setFunnyFace(false);
      elapsedRef.current = 0;
      spokenRef.current = new Set();
      gaugeRef.current = 0;
      completedRef.current = false;
      return;
    }

    // Initial
    say("\uC26C\u2026 \uC870\uC6A9\uD788. \uC9C4\uC9DC \uBF50\uAC00 \uC788\uC5B4.", "shush");
    doShake();

    // Main timer: gauge fill + sabotage events
    const iv = setInterval(() => {
      elapsedRef.current += 1;
      const t = elapsedRef.current;
      const spoken = spokenRef.current;

      // Auto-fill gauge over ~30s (fallback for no mic)
      if (gaugeRef.current < 100) {
        gaugeRef.current = Math.min(gaugeRef.current + 3.3, 100);
        setGauge(gaugeRef.current);
      }

      // Sabotage events
      if (t >= 5 && !spoken.has(5)) {
        spoken.add(5);
        say("\uC655!!", "excited");
        doShake();
        setSabotageText("\uC655!!");
        setSabotageKey(p => p + 1);
        setTimeout(() => setSabotageText(""), 1500);
      }

      if (t >= 10 && !spoken.has(10)) {
        spoken.add(10);
        setFunnyFace(true);
        setTimeout(() => setFunnyFace(false), 3000);
      }

      if (t >= 15 && !spoken.has(15)) {
        spoken.add(15);
        say("\uC6C3\uC9C0 \uB9C8... \uC6C3\uC9C0 \uB9C8...", "smug");
        setSabotageText("\uD479\uD479\uD479\uD479");
        setSabotageKey(p => p + 1);
        setTimeout(() => setSabotageText(""), 2000);
      }

      if (t >= 20 && !spoken.has(20)) {
        spoken.add(20);
        say("\uC57C!! \uC2DC\uB044\uB7FD\uB2E4\uACE0!! ...\uC544.", "angry");
        doShake();
        setSabotageText("\uC2DC\uB044\uB7FD\uB2E4\uACE0!!!");
        setSabotageKey(p => p + 1);
        setTimeout(() => setSabotageText(""), 2000);
      }

      if (t >= 25 && !spoken.has(25)) {
        spoken.add(25);
        say("\uBBF8\uC548 \uBBF8\uC548, \uC785\uC774 \uBA3C\uC800 \uC6C0\uC9C1\uC600\uC5B4~", "teasing");
      }

      // 80% gauge dialogue
      if (gaugeRef.current >= 80 && !spoken.has(80)) {
        spoken.add(80);
        say("\uC544... \uC548 \uB418\uACA0\uB2E4. \uB10C \uC6D0\uB798 \uC2DC\uB044\uB7EC\uC6B4 \uC0AC\uB78C\uC774\uC57C.", "pouty");
      }

      // 100% gauge
      if (gaugeRef.current >= 100 && !spoken.has(100)) {
        spoken.add(100);
        say("\uB410\uC5B4. \uADF8\uB0E5 \uB20C\uB7EC. \uB2E5\uCE58\uC9C0\uB97C \uBABB \uD558\uB2C8\uAE4C.", "pouty");
        setShowButton(true);
        clearInterval(iv);
      }
    }, 1000);

    return () => clearInterval(iv);
  }, [active]);

  const handleQuiet = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  if (!active) return null;

  // Gauge color
  const gaugeColor = gauge < 40
    ? "#4caf50"
    : gauge < 70
      ? "#ffc107"
      : "#f44336";

  const gaugeGlow = gauge < 40
    ? "rgba(76,175,80,0.3)"
    : gauge < 70
      ? "rgba(255,193,7,0.3)"
      : "rgba(244,67,54,0.4)";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 450,
      overflow: "hidden"
    }}>
      {/* Dark overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)"
      }} />

      {/* Radial pulse effect */}
      <div style={{
        position: "absolute", inset: 0,
        background: `radial-gradient(ellipse at 50% 50%, ${gaugeGlow}, transparent 60%)`,
        animation: "pulse 1.5s ease infinite",
        pointerEvents: "none"
      }} />

      {/* Sound wave visualization around meter */}
      <div style={{
        position: "absolute",
        top: "50%", left: "50%",
        transform: "translate(-50%, -50%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: 3,
        zIndex: 2
      }}>
        {/* Left wave bars */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginRight: 20 }}>
          {waveBars.slice(0, 12).map((b, i) => {
            const h = b.baseHeight + Math.sin(Date.now() * 0.003 * b.speed + b.phase) * 15 * (gauge / 100);
            return (
              <div key={b.id} style={{
                width: 3, height: Math.max(4, h),
                background: gaugeColor,
                borderRadius: 2,
                opacity: 0.4 + (gauge / 100) * 0.5,
                transition: "height 0.1s, background 0.5s"
              }} />
            );
          })}
        </div>

        {/* Central volume meter */}
        <div style={{
          width: 60, height: 240,
          background: "rgba(0,0,0,0.6)",
          border: `2px solid ${gaugeColor}44`,
          borderRadius: 12,
          position: "relative",
          overflow: "hidden",
          boxShadow: `0 0 30px ${gaugeGlow}, inset 0 0 20px rgba(0,0,0,0.5)`,
          transition: "border-color 0.5s, box-shadow 0.5s"
        }}>
          {/* Gauge fill */}
          <div style={{
            position: "absolute",
            bottom: 0, left: 0, right: 0,
            height: `${gauge}%`,
            background: `linear-gradient(180deg, ${gaugeColor}, ${gaugeColor}88)`,
            borderRadius: "0 0 10px 10px",
            transition: "height 0.3s ease, background 0.5s",
            boxShadow: `0 -4px 20px ${gaugeGlow}`
          }} />

          {/* Gauge markers */}
          {[20, 40, 60, 80].map(mark => (
            <div key={mark} style={{
              position: "absolute",
              bottom: `${mark}%`, left: 0, right: 0,
              height: 1,
              background: "rgba(255,255,255,0.1)"
            }} />
          ))}

          {/* Percentage text */}
          <div style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 16, fontWeight: 800,
            color: "#fff",
            textShadow: "0 2px 8px rgba(0,0,0,0.5)",
            letterSpacing: 1
          }}>
            {Math.floor(gauge)}%
          </div>
        </div>

        {/* Right wave bars */}
        <div style={{ display: "flex", alignItems: "center", gap: 2, marginLeft: 20 }}>
          {waveBars.slice(12).map((b, i) => {
            const h = b.baseHeight + Math.sin(Date.now() * 0.003 * b.speed + b.phase) * 15 * (gauge / 100);
            return (
              <div key={b.id} style={{
                width: 3, height: Math.max(4, h),
                background: gaugeColor,
                borderRadius: 2,
                opacity: 0.4 + (gauge / 100) * 0.5,
                transition: "height 0.1s, background 0.5s"
              }} />
            );
          })}
        </div>
      </div>

      {/* Speaker icon */}
      <div style={{
        position: "absolute",
        top: "20%", left: "50%",
        transform: "translateX(-50%)",
        fontSize: 48,
        opacity: 0.6 + (gauge / 100) * 0.4,
        animation: gauge > 60 ? "shake 0.15s ease infinite" : "none",
        zIndex: 3
      }}>
        {"\uD83D\uDD0A"}
      </div>

      {/* Label */}
      <div style={{
        position: "absolute",
        top: "28%", left: "50%",
        transform: "translateX(-50%)",
        fontSize: 11, fontWeight: 700,
        color: gaugeColor,
        letterSpacing: 4,
        textTransform: "uppercase",
        opacity: 0.8,
        zIndex: 3
      }}>
        NOISE LEVEL
      </div>

      {/* Sabotage floating text */}
      {sabotageText && (
        <div key={sabotageKey} style={{
          position: "absolute",
          top: "38%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 36, fontWeight: 900,
          color: "#ff5722",
          textShadow: "0 4px 20px rgba(255,87,34,0.5)",
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          zIndex: 10,
          letterSpacing: 4
        }}>
          {sabotageText}
        </div>
      )}

      {/* Funny face display */}
      {funnyFace && (
        <div style={{
          position: "absolute",
          top: "38%", left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: 64,
          animation: "popIn 0.3s ease, shake 0.2s ease infinite",
          zIndex: 10
        }}>
          {"\uD83E\uDD2A"}
        </div>
      )}

      {/* Sound rings */}
      {gauge > 30 && [1, 2, 3].map(i => (
        <div key={i} style={{
          position: "absolute",
          top: "50%", left: "50%",
          width: 100 + i * 80, height: 100 + i * 80,
          borderRadius: "50%",
          border: `1.5px solid ${gaugeColor}${Math.floor(60 / i).toString(16)}`,
          transform: "translate(-50%, -50%)",
          animation: `pulse ${1 + i * 0.5}s ease infinite`,
          pointerEvents: "none",
          zIndex: 1
        }} />
      ))}

      {/* Skip button */}
      <SkipButton active={active && !showButton} delay={10} onSkip={onDismiss} />

      {/* Quiet button */}
      {showButton && (
        <div style={{
          position: "absolute",
          bottom: "15%", left: "50%",
          transform: "translateX(-50%)",
          zIndex: 20,
          animation: "popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)"
        }}>
          <MiniNuclearButton label="조용!!" onPress={handleQuiet} />
        </div>
      )}
    </div>
  );
}

// 마이크 모니터링 훅 (main.jsx에서 사용)
function useMicMonitor(enabled, onNoiseTrigger) {
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const noiseStartRef = useRef(null);
  const intervalRef = useRef(null);
  const triggerRef = useRef(onNoiseTrigger);
  triggerRef.current = onNoiseTrigger;

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        const ctx = new AudioContext();
        if (ctx.state === "suspended") await ctx.resume();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        audioRef.current = { stream, ctx };
        analyserRef.current = analyser;
        console.log("[E22 Mic] 마이크 연결 성공, 모니터링 시작");

        intervalRef.current = setInterval(() => {
          if (cancelled || !analyserRef.current) return;
          const data = new Uint8Array(analyserRef.current.fftSize);
          analyserRef.current.getByteTimeDomainData(data);
          let sum = 0;
          for (let i = 0; i < data.length; i++) {
            const v = (data[i] - 128) / 128;
            sum += v * v;
          }
          const rms = Math.sqrt(sum / data.length);
          const vol = Math.min(rms * 100, 100);

          if (vol > MIC_NOISE_THRESHOLD) {
            if (!noiseStartRef.current) noiseStartRef.current = Date.now();
            else if (Date.now() - noiseStartRef.current > MIC_NOISE_DURATION) {
              console.log("[E22 Mic] 트리거! vol:", vol.toFixed(1));
              triggerRef.current?.();
              noiseStartRef.current = null;
              clearInterval(intervalRef.current);
            }
          } else {
            noiseStartRef.current = null;
          }
        }, 100);
      } catch (err) {
        console.warn("[E22 Mic] 마이크 접근 실패:", err);
      }
    };

    startMic();

    return () => {
      cancelled = true;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (audioRef.current) {
        audioRef.current.stream.getTracks().forEach(t => t.stop());
        audioRef.current.ctx.close();
      }
      analyserRef.current = null;
    };
  }, [enabled]);
}
