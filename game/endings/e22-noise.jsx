// E22: 시끄러워 — 마이크 감지, 어느 스테이지에서든 랜덤 발동
function E22Noise({ active, onComplete, say, doShake }) {
  // 마이크 모니터링은 main.jsx에서 처리
  // 이 컴포넌트는 E22 트리거 시 연출만 담당

  useEffect(() => {
    if (!active) return;
    doShake();
    say("시끄러워!!! 조용히 해!!!", "angry");
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:450,pointerEvents:"none" }}>
      {/* 소음 시각 이펙트 */}
      <div style={{ position:"absolute",inset:0,
        background:"radial-gradient(ellipse at 50% 50%,rgba(255,87,34,0.15),transparent 60%)",
        animation:"pulse 0.3s ease infinite" }}/>
      {/* 음파 링 */}
      {[1,2,3].map(i => (
        <div key={i} style={{
          position:"absolute",top:"50%",left:"50%",
          width: 100 + i * 60, height: 100 + i * 60,
          borderRadius:"50%",
          border:`2px solid rgba(255,87,34,${0.3 / i})`,
          transform:"translate(-50%,-50%)",
          animation:`pulse ${0.5 + i * 0.3}s ease infinite`,
        }}/>
      ))}
      <div style={{ position:"absolute",top:"40%",left:"50%",transform:"translateX(-50%)",
        textAlign:"center" }}>
        <div style={{ fontSize:60,animation:"shake 0.1s ease infinite" }}>🔊</div>
        <div style={{ fontSize:16,color:"#ff5722",fontWeight:800,letterSpacing:4,marginTop:12,
          animation:"pulse 0.5s ease infinite" }}>
          TOO LOUD!
        </div>
      </div>
    </div>
  );
}

// 마이크 모니터링 훅 (main.jsx에서 사용)
function useMicMonitor(enabled, onNoiseTrigger) {
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const noiseStartRef = useRef(null);
  const animRef = useRef(null);

  useEffect(() => {
    if (!enabled) return;

    let cancelled = false;

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        if (cancelled) { stream.getTracks().forEach(t => t.stop()); return; }
        const ctx = new AudioContext();
        const src = ctx.createMediaStreamSource(stream);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 256;
        src.connect(analyser);
        audioRef.current = { stream, ctx };
        analyserRef.current = analyser;

        const checkVolume = () => {
          if (cancelled || !analyserRef.current) return;
          const data = new Uint8Array(analyserRef.current.frequencyBinCount);
          analyserRef.current.getByteFrequencyData(data);
          const avg = data.reduce((a, b) => a + b, 0) / data.length;

          if (avg > MIC_NOISE_THRESHOLD) {
            if (!noiseStartRef.current) noiseStartRef.current = Date.now();
            else if (Date.now() - noiseStartRef.current > MIC_NOISE_DURATION) {
              onNoiseTrigger?.();
              noiseStartRef.current = null;
              return;
            }
          } else {
            noiseStartRef.current = null;
          }
          animRef.current = requestAnimationFrame(checkVolume);
        };
        checkVolume();
      } catch {
        // 마이크 사용 불가 — 무시
      }
    };

    startMic();

    return () => {
      cancelled = true;
      if (animRef.current) cancelAnimationFrame(animRef.current);
      if (audioRef.current) {
        audioRef.current.stream.getTracks().forEach(t => t.stop());
        audioRef.current.ctx.close();
      }
      analyserRef.current = null;
    };
  }, [enabled, onNoiseTrigger]);
}
