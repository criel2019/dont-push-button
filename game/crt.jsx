// ============================================================
// crt.jsx — CRT 모니터 + 나비 캐릭터
// ============================================================

function NaviCharacter({ emotion = "idle", frame = 0, sleeping = false, catEars = false, gone = false, size = 140 }) {
  const bob = Math.sin(frame * 0.25) * 3;
  const sheet = catEars ? "catears" : (sleeping ? "idle" : emotion);
  const spriteFrame = frame % NAVI_SPRITE_FRAMES;
  const col = spriteFrame % NAVI_SPRITE_COLS;
  const row = Math.floor(spriteFrame / NAVI_SPRITE_COLS);
  const w = size;
  const h = size * (NAVI_FRAME_H / NAVI_FRAME_W);
  const sheetW = NAVI_SPRITE_COLS * w;
  const sheetH = NAVI_SPRITE_ROWS * h;
  return (
    <div style={{
      position: "relative", width: w, height: h,
      backgroundImage: `url(${NAVI_SPRITES[sheet]})`,
      backgroundPosition: `-${col * w}px -${row * h}px`,
      backgroundSize: `${sheetW}px ${sheetH}px`,
      backgroundRepeat: "no-repeat",
      filter: sleeping
        ? "drop-shadow(0 10px 30px rgba(100,50,80,0.25)) brightness(0.6) saturate(0.4)"
        : "drop-shadow(0 10px 30px rgba(100,50,80,0.25))",
      opacity: gone ? 0 : 1,
      transition: "opacity 2s, transform 1s, filter 0.5s",
      transform: `translateY(${gone ? 30 : bob}px)`,
    }}>
      {sleeping && (
        <div style={{
          position: "absolute", top: -4, right: -8,
          fontSize: size * 0.11, opacity: 0.7,
          animation: "zzz 2s ease infinite",
        }}>💤</div>
      )}
    </div>
  );
}

// CRT 이동 위치 맵 (오브젝트 소개 시 나비가 이동)
const CRT_TARGETS = {
  home:            { left:"84%", top:"3%" },
  showBanner:      { left:"30%", top:"2%" },
  showWallet:      { left:"38%", top:"36%" },
  showCake:        { left:"45%", top:"34%" },
  showPhone:       { left:"62%", top:"34%" },
  showSOS:         { left:"54%", top:"1%" },
  showTV:          { left:"22%", top:"4%" },
  showSafetyCover: { left:"54%", top:"22%" },
};

function CRTMonitor({ nEmo, frame, naviSleeping, catEars, naviGone, nText, nKey, onContextMenu, onCatEarClick, crtOff, crtTarget, mobileScale = 1, children }) {
  // 롱프레스로 모바일 우클릭 대체
  const longPressHandlers = useLongPress((touchX, touchY) => {
    if (onContextMenu) {
      onContextMenu({ preventDefault: () => {}, clientX: touchX, clientY: touchY });
    }
  }, 600);
  const [poweringOn, setPoweringOn] = useState(false);
  const [showContent, setShowContent] = useState(!crtOff);

  useEffect(() => {
    if (!crtOff && !showContent) {
      setPoweringOn(true);
      const t = setTimeout(() => { setShowContent(true); setPoweringOn(false); }, 800);
      return () => clearTimeout(t);
    }
    if (crtOff) {
      setShowContent(false);
      setPoweringOn(false);
    }
  }, [crtOff]);

  // 위치: 타겟이 있으면 해당 오브젝트 옆, 없으면 기본 위치 (우상단)
  const posStyle = crtTarget && CRT_TARGETS[crtTarget]
    ? CRT_TARGETS[crtTarget]
    : CRT_TARGETS.home;

  return (
    <div style={{ position:"absolute", ...posStyle, zIndex:60,
      transition: "left 0.5s ease, top 0.5s ease" }}>
      <div data-crt="true" onContextMenu={onContextMenu}
        {...longPressHandlers}
        style={{ width:150,padding:5,
          background:"linear-gradient(180deg,#4a4a4a,#333,#2a2a2a)",
          border:"3px solid #555",borderRadius:10,
          boxShadow:"0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
          position:"relative" }}>
        {/* Screen */}
        <div style={{ width:"100%",height:216,borderRadius:6,overflow:"hidden",position:"relative",
          background: crtOff ? "#0a0a0a" : "linear-gradient(180deg,#102858,#1a3c78,#0e2450)",
          boxShadow: crtOff ? "inset 0 0 30px rgba(0,0,0,0.8)" : "inset 0 0 30px rgba(30,80,160,0.5), inset 0 2px 0 rgba(0,0,0,0.3)",
          transition:"background 0.5s" }}>

          {/* CRT off line effect */}
          {crtOff && (
            <div style={{ position:"absolute",top:"50%",left:0,right:0,height:2,
              background:"rgba(100,180,255,0.3)",transform:"translateY(-50%)",
              animation:"crtOffLine 0.5s ease forwards" }}/>
          )}

          {/* Power-on effect */}
          {poweringOn && (
            <div style={{ position:"absolute",inset:0,
              background:"radial-gradient(ellipse at 50% 50%, rgba(100,180,255,0.4), transparent 60%)",
              animation:"crtPowerOn 0.8s ease forwards" }}/>
          )}

          {showContent && !crtOff && <>
            {/* Blue ambient glow */}
            <div style={{ position:"absolute",inset:0,
              background:"radial-gradient(ellipse at 50% 60%,rgba(60,130,220,0.15),transparent 70%)",
              pointerEvents:"none" }}/>
            {/* Character */}
            <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",zIndex:1 }}>
              {!catEars && onCatEarClick && (
                <RoomObj onClick={onCatEarClick}
                  style={{ position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",
                    fontSize:12,opacity:0.25,zIndex:2 }} hoverGlow="#ff8fab">
                  🐱
                </RoomObj>
              )}
              <NaviCharacter emotion={nEmo} frame={frame} sleeping={naviSleeping} catEars={catEars} gone={naviGone} size={130}/>
            </div>
            {/* Scanlines */}
            <div style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none",
              backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)",
              backgroundSize:"100% 4px" }}/>
            {/* Moving scan bar */}
            <div style={{ position:"absolute",left:0,right:0,height:"15%",zIndex:6,pointerEvents:"none",
              background:"linear-gradient(180deg,transparent,rgba(100,180,255,0.06),transparent)",
              animation:"crtScan 3s linear infinite" }}/>
            {/* Static noise */}
            <div style={{ position:"absolute",inset:0,zIndex:4,pointerEvents:"none",opacity:0.03,
              backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
              animation:"crtFlicker 0.15s ease infinite" }}/>
            {/* Vignette */}
            <div style={{ position:"absolute",inset:0,zIndex:7,pointerEvents:"none",
              boxShadow:"inset 0 0 40px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.2)",
              borderRadius:6 }}/>
            {/* Edge glow */}
            <div style={{ position:"absolute",inset:0,zIndex:8,pointerEvents:"none",
              border:"1px solid rgba(100,180,255,0.08)",borderRadius:6 }}/>
          </>}
        </div>
        {/* Monitor bottom */}
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
          marginTop:5,padding:"0 8px" }}>
          <div style={{ fontSize:8,color:"#666",letterSpacing:2,fontWeight:700 }}>OPERATOR</div>
          <div style={{ display:"flex",alignItems:"center",gap:6 }}>
            <div style={{ fontSize:8,color:"#555",letterSpacing:1 }}>NAVI</div>
            <div style={{ width:5,height:5,borderRadius:"50%",
              background:naviGone||crtOff?"#555":"#3fb950",
              boxShadow:naviGone||crtOff?"none":"0 0 6px #3fb950" }}/>
          </div>
        </div>
      </div>

      {/* Speech bubble below CRT */}
      {nText && !naviGone && !crtOff && (
        <div key={nKey} style={{ width:150,padding:"10px 14px",marginTop:2,
          background:"rgba(10,20,40,0.92)",backdropFilter:"blur(8px)",
          border:"1px solid rgba(100,180,255,0.15)",
          borderRadius:"4px 4px 12px 12px",
          fontSize:13,lineHeight:1.8,color:"#c8dce8",fontWeight:400,
          boxShadow:"0 6px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(100,180,255,0.05)",
          animation:"slideDown 0.3s ease",
          fontFamily:"'Noto Sans KR',monospace" }}>
          <TypeWriter key={nKey} text={nText}/>
        </div>
      )}
      {children}
    </div>
  );
}
