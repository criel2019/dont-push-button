// ============================================================
// screens.jsx — 타이틀/엔딩/크레딧 화면
// ============================================================

function TitleScreen({ onStart, collected, frame }) {
  const [introStep, setIntroStep] = useState(0);
  useEffect(() => {
    setIntroStep(0);
    const ts = [setTimeout(()=>setIntroStep(1),400), setTimeout(()=>setIntroStep(2),1200),
      setTimeout(()=>setIntroStep(3),2000), setTimeout(()=>setIntroStep(4),2800)];
    return () => ts.forEach(clearTimeout);
  }, []);

  return (
    <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",
      background:"radial-gradient(ellipse at 50% 40%,#faf5f0,#f0e8f5 60%,#e8e0f0)",
      cursor:"pointer",position:"relative",overflow:"hidden" }}
      onClick={onStart}>
      <div style={{ position:"absolute",top:"10%",left:"8%",width:280,height:280,borderRadius:"50%",
        background:"radial-gradient(circle,#e8573d06,transparent 70%)" }}/>
      <div style={{ position:"absolute",bottom:"15%",right:"10%",width:200,height:200,borderRadius:"50%",
        background:"radial-gradient(circle,#a33de806,transparent 70%)" }}/>
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        width:500,height:500,borderRadius:"50%",
        background:"radial-gradient(circle,#e8573d04,transparent 60%)" }}/>
      {introStep>=1 && (
        <div style={{ fontSize:20,color:"#e8573d",fontWeight:800,letterSpacing:12,
          animation:"fadeInUp 0.7s ease",textTransform:"uppercase" }}>
          DON'T PRESS
        </div>
      )}
      {introStep>=2 && (
        <div style={{ fontSize:56,color:"#e8573d",fontWeight:800,letterSpacing:14,marginTop:4,
          animation:"popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)",
          textShadow:"0 4px 30px #e8573d22" }}>
          THE BUTTON
        </div>
      )}
      {introStep>=3 && (
        <div style={{ fontSize:14,color:"#e8573d44",marginTop:20,letterSpacing:8,
          animation:"fadeInUp 0.6s ease",fontStyle:"italic" }}>
          ...or should you?
        </div>
      )}
      {introStep>=4 && <>
        <div style={{ fontSize:13,color:"#c0b8b0",marginTop:40,animation:"pulse 2.5s ease infinite",
          letterSpacing:3 }}>
          ▶ 클릭하여 시작
        </div>
        {collected.length > 0 && (
          <div style={{ fontSize:12,color:"#a33de8",marginTop:18,animation:"fadeIn 0.8s ease",
            letterSpacing:2 }}>
            ✦ {collected.length}/{TOTAL_ENDINGS} 엔딩 수집됨
          </div>
        )}
        <div style={{ position:"absolute",bottom:"6%",right:"10%",opacity:0.12,animation:"fadeIn 2s ease" }}>
          <NaviCharacter emotion="confident" frame={frame} size={120}/>
        </div>
      </>}
    </div>
  );
}

function EndingScreen({ endingData, activeEvent, collected, frame, onRetry }) {
  if (!endingData) return null;
  return (
    <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",
      background:endingData.phase==="진 엔딩"
        ?"linear-gradient(180deg,#0a0a0a,#000)"
        :"linear-gradient(170deg,#fefcfa,#f8f0f5,#f0e8f8)",
      animation:"fadeIn 0.6s ease" }}>
      <div style={{ position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",
        width:300,height:300,borderRadius:"50%",
        background:`radial-gradient(circle,${endingData.btnColor||"#e8573d"}08,transparent 60%)` }}/>
      <div style={{ fontSize:72,marginBottom:20,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
        {endingData.emoji}
      </div>
      <div style={{ fontSize:11,color:endingData.phase==="진 엔딩"?"#444":"#b0a090",letterSpacing:5,marginBottom:8,
        textTransform:"uppercase" }}>
        {endingData.phase} · ENDING #{activeEvent}
      </div>
      <div style={{ fontSize:30,fontWeight:800,
        color:endingData.phase==="진 엔딩"?"#ddd":endingData.btnColor||"#333",
        marginBottom:24,animation:"fadeInUp 0.5s ease",letterSpacing:4 }}>
        {endingData.name}
      </div>
      <div style={{ marginBottom:16,animation:"fadeInUp 0.6s ease" }}>
        <NaviCharacter emotion={activeEvent===15?"idle":(endingData.eventEmo||"idle")} frame={frame} size={130}/>
      </div>
      <div style={{ maxWidth:360,textAlign:"center",animation:"fadeInUp 0.7s ease" }}>
        {endingData.over1 && (
          <div style={{ fontSize:18,color:endingData.phase==="진 엔딩"?"#888":"#4a3a2a",
            lineHeight:1.9,marginBottom:8 }}>
            "{endingData.over1}"
          </div>
        )}
        {endingData.over2 && (
          <div style={{ fontSize:13,color:endingData.phase==="진 엔딩"?"#444":"#b0a090",lineHeight:1.7 }}>
            {endingData.over2}
          </div>
        )}
      </div>
      <div style={{ marginTop:28,fontSize:12,color:"#a33de8",animation:"fadeIn 1s ease",letterSpacing:2 }}>
        ✦ {collected.length}/{TOTAL_ENDINGS} 엔딩 수집됨
      </div>
      <button onClick={onRetry} style={{ marginTop:24,padding:"14px 40px",
        background:endingData.btnColor||"#e8573d",border:"none",borderRadius:14,
        color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",letterSpacing:4,
        boxShadow:`0 8px 32px ${endingData.btnColor||"#e8573d"}33`,animation:"fadeInUp 0.8s ease",
        transition:"transform 0.2s" }}
        onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
        onMouseLeave={e=>e.target.style.transform="scale(1)"}>
        RETRY
      </button>
    </div>
  );
}

function CreditsScreen({ onBack }) {
  const [scroll, setScroll] = useState(0);
  useEffect(() => { const iv = setInterval(() => setScroll(p => p + 0.4), 30); return () => clearInterval(iv); }, []);
  const lines = [
    { t:"", s:0 },{ t:"", s:0 },{ t:"", s:0 },{ t:"", s:0 },
    { t:"DON'T PRESS THE BUTTON", s:2 },
    { t:"— FULL EDITION —", s:1 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"기획 · 디자인 · 개발", s:0 },{ t:"제작팀 일동", s:1 },
    { t:"", s:0 },{ t:"오퍼레이터", s:0 },{ t:"나비 (자칭 천재 내비게이터)", s:1 },
    { t:"", s:0 },{ t:"엔딩 시나리오", s:0 },{ t:"22개의 기발한 결말", s:1 },
    { t:"", s:0 },{ t:"플레이어", s:0 },{ t:"당신 (버튼 앞에서 고민한 사람)", s:1 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"Special Thanks", s:1 },{ t:"끝까지 모든 엔딩을 찾아주신 당신에게", s:0 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"\"누르지 마\" 라고 했잖아요.", s:3 },
    { t:"", s:0 },
    { t:"...그래도 눌러줘서 고마워요.", s:3 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"🎮 Fin 🎮", s:2 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"플레이 해주셔서 감사합니다!", s:1 },
  ];
  return (
    <div style={{ position:"absolute",inset:0,zIndex:800,background:"linear-gradient(180deg,#0a0a12,#12121f)",overflow:"hidden" }}>
      <div style={{ position:"relative",width:"100%",height:"100%",overflow:"hidden" }}>
        <div style={{ position:"absolute",left:0,right:0,top:`${100-scroll}%`,textAlign:"center",padding:"0 20px" }}>
          {lines.map((l,i) => (
            <div key={i} style={{ color:l.s===2?"#e8573d":l.s===3?"#ffa4c4":l.s===1?"#fff":"#999",
              fontSize:l.s===2?28:l.s===1?17:14,fontWeight:l.s>=1?700:400,
              marginBottom:l.t===""?24:12,letterSpacing:l.s===2?8:3 }}>
              {l.t || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
      <div onClick={onBack} style={{ position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",
        fontSize:13,color:"#444",cursor:"pointer",zIndex:2,padding:"10px 20px",borderRadius:10,
        border:"1px solid #333",transition:"color 0.2s" }}
        onMouseEnter={e=>e.target.style.color="#888"}
        onMouseLeave={e=>e.target.style.color="#444"}>
        돌아가기
      </div>
    </div>
  );
}
