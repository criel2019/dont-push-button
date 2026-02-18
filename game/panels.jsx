// ============================================================
// panels.jsx — 설정/프로필/컬렉션 패널
// ============================================================

function SettingsPanel({ open, onClose, onKillMode, onReset, killModeOn, killModeEnabled, resetEnabled }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"#fff",borderRadius:24,padding:"32px 40px",
        minWidth:300,boxShadow:"0 24px 80px rgba(0,0,0,0.25)",animation:"popIn 0.3s ease" }}>
        <div style={{ fontSize:17,fontWeight:800,color:"#333",marginBottom:24,letterSpacing:3 }}>⚙️ 설정</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,
          padding:"12px 16px",background:"#fafafa",borderRadius:14,border:"1px solid #f0f0f0",
          opacity:killModeEnabled?1:0.4,transition:"opacity 0.3s" }}>
          <span style={{ fontSize:14,color:killModeEnabled?"#333":"#999" }}>Kill Mode</span>
          <div onClick={killModeEnabled?onKillMode:undefined} style={{ width:52,height:28,borderRadius:14,
            background:killModeOn?"#e8573d":"#ddd",cursor:killModeEnabled?"pointer":"default",position:"relative",transition:"background 0.3s",
            boxShadow:killModeOn?"0 2px 10px #e8573d44":"none" }}>
            <div style={{ position:"absolute",top:4,left:killModeOn?27:4,width:20,height:20,borderRadius:10,
              background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}/>
          </div>
        </div>
        <div onClick={resetEnabled?onReset:undefined} style={{ padding:"12px 16px",background:"#fafafa",borderRadius:14,
          cursor:resetEnabled?"pointer":"default",
          fontSize:14,color:resetEnabled?"#78909c":"#ccc",textAlign:"center",marginBottom:14,border:"1px solid #f0f0f0",
          transition:"background 0.2s, opacity 0.3s",opacity:resetEnabled?1:0.5 }}
          onMouseEnter={e=>{if(resetEnabled)e.target.style.background="#f0f0f0";}}
          onMouseLeave={e=>{e.target.style.background="#fafafa";}}>
          🔄 초기화
        </div>
        <div onClick={onClose} style={{ padding:"10px",textAlign:"center",fontSize:13,color:"#bbb",cursor:"pointer" }}>닫기</div>
      </div>
    </div>
  );
}

function ProfileMenu({ open, onClose, onTransfer, transferEnabled }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute",top:56,right:16,zIndex:600,background:"#fff",borderRadius:18,
      padding:"18px 24px",boxShadow:"0 16px 56px rgba(0,0,0,0.18)",animation:"fadeInUp 0.2s ease",minWidth:200 }}>
      <div style={{ fontSize:12,color:"#bbb",marginBottom:8 }}>플레이어 프로필</div>
      <div style={{ fontSize:14,fontWeight:600,color:"#333",marginBottom:16 }}>👤 Guest</div>
      <div onClick={transferEnabled?onTransfer:undefined} style={{ fontSize:13,
        color:transferEnabled?"#6a1b9a":"#bbb",
        cursor:transferEnabled?"pointer":"default",
        padding:"10px 14px",
        background:transferEnabled?"#f3e5f5":"#f5f5f5",
        borderRadius:12,textAlign:"center",fontWeight:600,
        transition:"background 0.2s, opacity 0.3s",
        opacity:transferEnabled?1:0.5 }}
        onMouseEnter={e=>{if(transferEnabled)e.target.style.background="#e1bee7";}}
        onMouseLeave={e=>{e.target.style.background=transferEnabled?"#f3e5f5":"#f5f5f5";}}>
        🔀 권한 양도
      </div>
      <div onClick={onClose} style={{ fontSize:12,color:"#ccc",cursor:"pointer",textAlign:"center",marginTop:12 }}>닫기</div>
    </div>
  );
}

function CollectionPanel({ open, onClose, collected }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:700,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"linear-gradient(180deg,#fefcfa,#f8f4ef)",borderRadius:28,padding:"32px",
        width:"92%",maxWidth:520,maxHeight:"85vh",overflow:"auto",boxShadow:"0 28px 90px rgba(0,0,0,0.3)",animation:"popIn 0.3s ease" }}>
        <div style={{ textAlign:"center",marginBottom:24 }}>
          <div style={{ fontSize:20,fontWeight:800,color:"#333",letterSpacing:4 }}>엔딩 컬렉션</div>
          <div style={{ fontSize:13,color:"#aaa",marginTop:8 }}>{collected.length} / {TOTAL_ENDINGS}</div>
          <div style={{ width:"100%",height:7,background:"#eee",borderRadius:4,marginTop:12,overflow:"hidden" }}>
            <div style={{ width:`${(collected.length/TOTAL_ENDINGS)*100}%`,height:"100%",
              background:"linear-gradient(90deg,#ffa4c4,#a33de8,#536dfe)",borderRadius:4,transition:"width 0.5s" }}/>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10 }}>
          {Array.from({length:TOTAL_ENDINGS},(_,i)=>i+1).map(id => {
            const ed = ENDINGS[id];
            const unlocked = collected.includes(id);
            return (
              <div key={id} style={{ padding:"12px 8px",
                background:unlocked?"#fff":"#f4f0ea",borderRadius:14,textAlign:"center",
                border:`2px solid ${unlocked?(PHASE_COLORS[ed.phase]||"#aaa")+"55":"#e8e2da"}`,
                opacity:unlocked?1:0.4,transition:"all 0.3s",
                boxShadow:unlocked?`0 4px 18px ${(PHASE_COLORS[ed.phase]||"#aaa")}18`:"none",
                transform:unlocked?"scale(1)":"scale(0.95)" }}>
                <div style={{ fontSize:24,marginBottom:4 }}>{unlocked ? ed.emoji : "🔒"}</div>
                <div style={{ fontSize:10,fontWeight:700,color:unlocked?"#333":"#ccc" }}>
                  {unlocked ? ed.name : "???"}
                </div>
                <div style={{ fontSize:7,color:PHASE_COLORS[ed.phase]||"#aaa",fontWeight:600,marginTop:3,
                  letterSpacing:1 }}>{ed.phase}</div>
              </div>
            );
          })}
        </div>
        <div onClick={onClose} style={{ textAlign:"center",marginTop:24,fontSize:13,color:"#bbb",cursor:"pointer" }}>닫기</div>
      </div>
    </div>
  );
}

function ContextMenu({ x, y, onDelete, onClose, say }) {
  const [deleteHovers, setDeleteHovers] = useState(0);
  const [showConfirm, setShowConfirm] = useState(false);
  const hoverCountRef = useRef(0);

  useEffect(() => {
    // 메뉴 뜨자마자
    say("...그거 뭔데.", "idle");
  }, []);

  const handleDeleteEnter = useCallback(() => {
    hoverCountRef.current += 1;
    const n = hoverCountRef.current;
    setDeleteHovers(n);
    switch(n) {
      case 1: say("어— 잠깐잠깐잠깐", "shocked"); break;
      case 2: say("하, 진짜? 나를? 삭제를?", "smug"); break;
      case 3: say("야, 진짜 누르면 나 없어져. 알지?", "angry"); break;
      case 4: say("너 지금 되게 재밌지? 아, 재밌구나?", "pouty"); break;
    }
  }, [say]);

  const handleDeleteLeave = useCallback(() => {
    const n = hoverCountRef.current;
    if (n === 1) say("...흥, 그럴 줄 알았어.", "smug");
    else if (n === 2) say("장난이지? ...장난이라고 해.", "worried");
  }, [say]);

  const handleDeleteClick = useCallback(() => {
    setShowConfirm(true);
    say("너 진짜 누른 거야?", "shocked");
  }, [say]);

  if (showConfirm) {
    return (
      <div style={{ position:"fixed",inset:0,zIndex:950,display:"flex",alignItems:"center",justifyContent:"center",
        background:"rgba(0,0,0,0.3)",backdropFilter:"blur(4px)",animation:"fadeIn 0.2s ease" }}>
        <div style={{ background:"#fff",borderRadius:16,padding:"24px 32px",boxShadow:"0 16px 48px rgba(0,0,0,0.25)",
          textAlign:"center",animation:"popIn 0.2s ease",minWidth:260 }}>
          <div style={{ fontSize:14,fontWeight:700,color:"#333",marginBottom:6 }}>삭제 확인</div>
          <div style={{ fontSize:12,color:"#999",marginBottom:20 }}>"나비"를 영구적으로 삭제합니다.</div>
          <div style={{ display:"flex",gap:10,justifyContent:"center" }}>
            <div onClick={onClose} style={{ padding:"10px 20px",borderRadius:10,fontSize:13,color:"#999",
              cursor:"pointer",background:"#f5f5f5",fontWeight:600 }}>취소</div>
            <div onClick={onDelete} style={{ padding:"10px 20px",borderRadius:10,fontSize:13,color:"#fff",
              cursor:"pointer",background:"#e8573d",fontWeight:600,boxShadow:"0 4px 12px #e8573d44" }}>삭제 확인</div>
          </div>
        </div>
      </div>
    );
  }

  const greyItem = (label) => (
    <div style={{ padding:"8px 16px",fontSize:13,color:"#ccc",cursor:"default" }}>{label}</div>
  );

  return (
    <div style={{ position:"fixed",left:x,top:y,zIndex:900,background:"#fff",borderRadius:8,
      boxShadow:"0 2px 16px rgba(0,0,0,0.22)",padding:"4px 0",minWidth:200,animation:"fadeIn 0.1s ease",
      border:"1px solid #e0e0e0",fontFamily:"'Segoe UI','Noto Sans KR',sans-serif" }}>
      {greyItem("← 뒤로")}
      {greyItem("↻ 새로고침")}
      <div style={{ height:1,background:"#e8e8e8",margin:"4px 0" }}/>
      {greyItem("다른 이름으로 저장...")}
      {greyItem("인쇄...")}
      {greyItem("페이지 소스 보기")}
      <div style={{ height:1,background:"#e8e8e8",margin:"4px 0" }}/>
      <div onClick={handleDeleteClick}
        onMouseEnter={handleDeleteEnter}
        onMouseLeave={handleDeleteLeave}
        style={{ padding:"8px 16px",fontSize:13,color:"#e8573d",cursor:"pointer",fontWeight:600,
          background:deleteHovers>0?"#fef0f0":"transparent",transition:"background 0.15s" }}>
        🗑️ 삭제
      </div>
      <div style={{ height:1,background:"#e8e8e8",margin:"4px 0" }}/>
      <div onClick={onClose} style={{ padding:"8px 16px",fontSize:13,color:"#666",cursor:"pointer",
        transition:"background 0.15s" }}
        onMouseEnter={e=>e.target.style.background="#f5f5f5"}
        onMouseLeave={e=>e.target.style.background="transparent"}>
        취소
      </div>
    </div>
  );
}
