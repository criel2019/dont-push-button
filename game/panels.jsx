// ============================================================
// panels.jsx — 설정/프로필/컬렉션 패널
// ============================================================

function SettingsPanel({ open, onClose, onKillMode, onReset, killModeOn }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"#fff",borderRadius:24,padding:"32px 40px",
        minWidth:300,boxShadow:"0 24px 80px rgba(0,0,0,0.25)",animation:"popIn 0.3s ease" }}>
        <div style={{ fontSize:17,fontWeight:800,color:"#333",marginBottom:24,letterSpacing:3 }}>⚙️ 설정</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,
          padding:"12px 16px",background:"#fafafa",borderRadius:14,border:"1px solid #f0f0f0" }}>
          <span style={{ fontSize:14,color:"#333" }}>Kill Mode</span>
          <div onClick={onKillMode} style={{ width:52,height:28,borderRadius:14,
            background:killModeOn?"#e8573d":"#ddd",cursor:"pointer",position:"relative",transition:"background 0.3s",
            boxShadow:killModeOn?"0 2px 10px #e8573d44":"none" }}>
            <div style={{ position:"absolute",top:4,left:killModeOn?27:4,width:20,height:20,borderRadius:10,
              background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}/>
          </div>
        </div>
        <div onClick={onReset} style={{ padding:"12px 16px",background:"#fafafa",borderRadius:14,cursor:"pointer",
          fontSize:14,color:"#78909c",textAlign:"center",marginBottom:14,border:"1px solid #f0f0f0",
          transition:"background 0.2s" }}
          onMouseEnter={e=>e.target.style.background="#f0f0f0"}
          onMouseLeave={e=>e.target.style.background="#fafafa"}>
          🔄 초기화
        </div>
        <div onClick={onClose} style={{ padding:"10px",textAlign:"center",fontSize:13,color:"#bbb",cursor:"pointer" }}>닫기</div>
      </div>
    </div>
  );
}

function ProfileMenu({ open, onClose, onTransfer }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute",top:56,right:16,zIndex:600,background:"#fff",borderRadius:18,
      padding:"18px 24px",boxShadow:"0 16px 56px rgba(0,0,0,0.18)",animation:"fadeInUp 0.2s ease",minWidth:200 }}>
      <div style={{ fontSize:12,color:"#bbb",marginBottom:8 }}>플레이어 프로필</div>
      <div style={{ fontSize:14,fontWeight:600,color:"#333",marginBottom:16 }}>👤 Guest</div>
      <div onClick={onTransfer} style={{ fontSize:13,color:"#6a1b9a",cursor:"pointer",
        padding:"10px 14px",background:"#f3e5f5",borderRadius:12,textAlign:"center",fontWeight:600,
        transition:"background 0.2s" }}
        onMouseEnter={e=>e.target.style.background="#e1bee7"}
        onMouseLeave={e=>e.target.style.background="#f3e5f5"}>
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

function ContextMenu({ x, y, onDelete, onClose }) {
  return (
    <div style={{ position:"fixed",left:x,top:y,zIndex:900,background:"#fff",borderRadius:14,
      boxShadow:"0 10px 40px rgba(0,0,0,0.2)",padding:8,minWidth:160,animation:"popIn 0.15s ease" }}>
      <div style={{ padding:"10px 16px",fontSize:12,color:"#bbb",cursor:"default" }}>나비</div>
      <div style={{ height:1,background:"#f0f0f0",margin:"2px 10px" }}/>
      <div onClick={onDelete} style={{ padding:"12px 16px",fontSize:14,color:"#e8573d",cursor:"pointer",
        borderRadius:10,transition:"background 0.15s" }}
        onMouseEnter={e=>e.target.style.background="#fef0f0"}
        onMouseLeave={e=>e.target.style.background="transparent"}>
        🗑️ 삭제
      </div>
      <div onClick={onClose} style={{ padding:"12px 16px",fontSize:14,color:"#999",cursor:"pointer",
        borderRadius:10,transition:"background 0.15s" }}
        onMouseEnter={e=>e.target.style.background="#f8f8f8"}
        onMouseLeave={e=>e.target.style.background="transparent"}>
        취소
      </div>
    </div>
  );
}
