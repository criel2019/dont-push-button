// ============================================================
// ui.jsx — 공유 UI 컴포넌트
// ============================================================
const { useState, useEffect, useRef, useCallback } = React;

// ── 타자기 효과 ──
function TypeWriter({ text, speed = 28 }) {
  const [disp, setDisp] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisp(""); setDone(false); let i = 0;
    const iv = setInterval(() => {
      i++; if (i <= text.length) setDisp(text.slice(0, i));
      else { clearInterval(iv); setDone(true); }
    }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return React.createElement("span", null, disp,
    !done && React.createElement("span", { className: "cursor-blink" }, "\u258C"));
}

// ── 호버 래퍼 ──
function RoomObj({ children, onClick, style, hoverGlow, title, disabled }) {
  const [hv, setHv] = useState(false);
  return (
    <div title={title} onClick={disabled ? undefined : onClick}
      onMouseEnter={() => { if (!disabled) setHv(true); }} onMouseLeave={() => setHv(false)}
      style={{ cursor: disabled ? "default" : "pointer", transition: "all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: !disabled && hv ? "scale(1.08) translateY(-4px)" : "scale(1)",
        filter: !disabled && hv && hoverGlow ? `drop-shadow(0 4px 16px ${hoverGlow})` : "none",
        opacity: disabled ? 0.5 : 1,
        ...style }}>
      {children}
    </div>
  );
}

// ── 메인 핵 버튼 ──
function NuclearButton({ label, subtitle, onPress, onHover, onDrag, disabled, accent, cakeMode, cakeSelect }) {
  const [hv, setHv] = useState(false);
  const [pr, setPr] = useState(false);
  const b = accent || "#e8573d";
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8,
      opacity:disabled?0.15:1,pointerEvents:disabled?"none":"auto",transition:"opacity 0.5s" }}>
      <div style={{ position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",
        width:200,height:40,borderRadius:"50%",
        background:`radial-gradient(ellipse,${b}18,transparent 70%)`,
        animation:"glowPulse 3s ease infinite" }}/>
      <div style={{ width:160,height:160,borderRadius:"50%",position:"relative",
        background:`conic-gradient(from 0deg,${b}22,${b}08,${b}22,${b}08,${b}22)`,
        boxShadow:`0 12px 48px ${b}25, inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)`,
        display:"flex",alignItems:"center",justifyContent:"center",
        animation: hv && !pr ? "glowPulse 1.5s ease infinite" : "none" }}>
        <div style={{ position:"absolute",inset:6,borderRadius:"50%",
          border:`2px dashed ${b}25`,animation:"spin 20s linear infinite" }}/>
        <div style={{ position:"absolute",inset:2,borderRadius:"50%",
          border:`1px solid ${b}15` }}/>
        <div style={{ width:128,height:128,borderRadius:"50%",
          background:"linear-gradient(160deg,#fafafa,#e8e4e0,#d8d4d0)",
          boxShadow:`inset 0 4px 12px rgba(0,0,0,0.08), 0 6px 24px ${b}18`,
          display:"flex",alignItems:"center",justifyContent:"center" }}>
          {cakeMode ? (
            <div onClick={onPress} style={{ width:96,height:96,borderRadius:"50%",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,
              animation:"float 1.5s ease infinite",filter:"drop-shadow(0 6px 12px rgba(0,0,0,0.2))" }}>
              🎂
            </div>
          ) : (
            <button
              onMouseEnter={() => { setHv(true); onHover?.(true); }}
              onMouseLeave={() => { setHv(false); setPr(false); onHover?.(false); }}
              onMouseDown={(e) => { setPr(true); onDrag?.(e); }}
              onMouseUp={() => setPr(false)}
              onClick={(e) => { e.stopPropagation(); onPress?.(); }}
              style={{ width:96,height:96,borderRadius:"50%",border:"none",cursor:"pointer",outline:"none",
                background: pr
                  ? `radial-gradient(circle at 50% 60%,${b},${b}cc)`
                  : `radial-gradient(circle at 36% 28%,${b}ff,${b} 50%,${b}aa 100%)`,
                boxShadow: pr
                  ? `0 2px 8px ${b}44, inset 0 4px 12px rgba(0,0,0,0.25)`
                  : `0 8px 32px ${b}35, 0 3px 8px rgba(0,0,0,0.1), inset 0 -4px 8px ${b}22`,
                transform: pr ? "translateY(4px) scale(0.9)" : hv ? "scale(1.08)" : "scale(1)",
                transition:"all 0.12s ease", position:"relative" }}>
              <div style={{ position:"absolute",top:"12%",left:"18%",width:"32%",height:"20%",
                borderRadius:"50%",background:"rgba(255,255,255,0.5)",filter:"blur(4px)" }}/>
              <div style={{ position:"absolute",top:"20%",left:"26%",width:"14%",height:"10%",
                borderRadius:"50%",background:"rgba(255,255,255,0.7)",filter:"blur(2px)" }}/>
            </button>
          )}
        </div>
      </div>
      <div style={{ fontFamily:"'Noto Sans KR',monospace",fontSize:13,fontWeight:800,letterSpacing:4,
        color:b,textShadow:`0 2px 8px ${b}22`,transition:"color 0.3s",marginTop:4 }}>
        {cakeSelect ? "🎂 여기에 올려!" : label}
      </div>
      {!cakeSelect && !cakeMode && (
        <div style={{ fontSize:8,color:"#c0b8b066",letterSpacing:2 }}>{subtitle || "▲ DON'T PRESS ▲"}</div>
      )}
    </div>
  );
}

// ── 캔버스 파티클 ──
function ParticleOverlay() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const anim = useRef(null);
  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const W = cv.width = cv.offsetWidth;
    const H = cv.height = cv.offsetHeight;
    particles.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * W, y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3, dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.35 + 0.08, glow: Math.random() > 0.65,
    }));
    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.current.forEach(p => {
        p.x += p.dx; p.y += p.dy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10 || p.x > W + 10) p.x = Math.random() * W;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (p.glow) { ctx.fillStyle = `rgba(255,220,180,${p.alpha * 0.9})`; ctx.shadowColor = "rgba(255,200,140,0.5)"; ctx.shadowBlur = 10; }
        else { ctx.fillStyle = `rgba(255,255,255,${p.alpha})`; ctx.shadowBlur = 0; }
        ctx.fill(); ctx.shadowBlur = 0;
      });
      anim.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (anim.current) cancelAnimationFrame(anim.current); };
  }, []);
  return <canvas ref={canvasRef} style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none",width:"100%",height:"100%" }}/>;
}

// ── 모달 오버레이 ──
function ModalOverlay({ children, onClose }) {
  return (
    <div style={{ position:"absolute",inset:0,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)" }}/>
      <div style={{ position:"relative",zIndex:1 }}>{children}</div>
    </div>
  );
}

// ── 건너뛰기 버튼 (엔딩 오버레이용) ──
// delay: 버튼 표시까지 초, autoDismiss: 자동 해제까지 초 (기본 25)
function SkipButton({ active, delay, onSkip, autoDismiss = 25 }) {
  const [show, setShow] = useState(false);
  const [hv, setHv] = useState(false);
  const onSkipRef = useRef(onSkip);
  onSkipRef.current = onSkip;

  useEffect(() => {
    if (!active) { setShow(false); return; }
    const t = setTimeout(() => setShow(true), delay * 1000);
    return () => clearTimeout(t);
  }, [active, delay]);

  // 자동 해제 (안전망) — autoDismiss초 후 자동 건너뛰기
  useEffect(() => {
    if (!active || !autoDismiss) return;
    const t = setTimeout(() => onSkipRef.current(), autoDismiss * 1000);
    return () => clearTimeout(t);
  }, [active, autoDismiss]);

  if (!show) return null;
  return (
    <div style={{ position:"absolute",bottom:16,right:20,zIndex:9999,animation:"fadeIn 1s ease",pointerEvents:"auto" }}>
      <div onClick={(e) => { e.stopPropagation(); onSkip(); }}
        onMouseEnter={() => setHv(true)} onMouseLeave={() => setHv(false)}
        style={{ padding:"6px 18px",borderRadius:8,fontSize:11,fontWeight:600,letterSpacing:2,
          cursor:"pointer",userSelect:"none",transition:"all 0.3s",
          background:hv?"rgba(255,255,255,0.18)":"rgba(255,255,255,0.08)",
          color:hv?"rgba(255,255,255,0.8)":"rgba(255,255,255,0.35)",
          border:`1px solid ${hv?"rgba(255,255,255,0.25)":"rgba(255,255,255,0.1)"}` }}>
        건너뛰기 &raquo;
      </div>
    </div>
  );
}

// ── 글래스 패널 ──
function GlassPanel({ children, style }) {
  return (
    <div style={{
      background:"rgba(255,255,255,0.12)",
      backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
      borderRadius:20,
      boxShadow:"0 20px 60px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.2)",
      border:"1px solid rgba(255,255,255,0.18)",
      ...style
    }}>
      {children}
    </div>
  );
}
