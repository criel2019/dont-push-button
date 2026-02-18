// ============================================================
// room.jsx — 방 환경 + 스테이지별 오브젝트
// ============================================================

function GameRoom({ onDoorKnock, onClockClick, onSOSClick, onTVClick, onWalletClick,
  onCakeClick, onPhoneClick, onBannerClick, onSafetyCoverClick,
  doorKnocks, doorOpen, bannerVisible,
  walletVisible, cakeVisible, phoneVisible, sosVisible, tvVisible, safetyCoverVisible,
  cakeSelected, activeEvent, isEndingActive, frame, children }) {

  // 기본 방 오브젝트 (항상 표시)
  const showDoor = true;
  const showWallLight = true;
  const showWindow = true;
  const showFrame = true;
  const showClock = true;
  const showBookshelf = true;
  const showLamp = true;

  // 나비가 언급할 때 개별적으로 등장하는 오브젝트
  const showBanner = bannerVisible;
  const showWallet = walletVisible;
  const showCake = cakeVisible;
  const showPhone = phoneVisible;
  const showSOS = sosVisible;
  const showTV = tvVisible;
  const showSafetyCover = safetyCoverVisible;
  const showNotebook = walletVisible; // 지갑과 함께 등장

  return (
    <div style={{ width:"100%",height:"100%",position:"relative",overflow:"hidden" }}>
      {/* 전체 배경 */}
      <div style={{ position:"absolute",inset:0,
        background:"linear-gradient(180deg,#ede5d5 0%,#e8dcc8 50%,#b09868 50.8%,#c8a878 51%,#b89868 65%,#a08050 100%)" }}/>

      {/* 중앙 고정 컨테이너 */}
      <div style={{ position:"relative",width:"100%",maxWidth:1100,height:"100%",margin:"0 auto",overflow:"visible" }}>

        {/* ══ 벽면 ══ */}
        <div style={{ position:"absolute",top:0,left:0,right:0,height:"50%",
          background:"linear-gradient(180deg,#f2ead8 0%,#ece3d2 40%,#e6dcc8 80%,#e2d8c4 100%)",overflow:"hidden",
          borderLeft:"4px solid #d8ccb4",borderRight:"4px solid #d8ccb4" }}>
          <div style={{ position:"absolute",inset:0,opacity:0.025,
            backgroundImage:`radial-gradient(ellipse at 50% 50%, #8a7060 1px, transparent 1px),
              radial-gradient(ellipse at 50% 50%, #8a7060 1px, transparent 1px)`,
            backgroundSize:"40px 40px",backgroundPosition:"0 0, 20px 20px" }}/>
          <div style={{ position:"absolute",top:0,left:0,right:0,height:10,
            background:"linear-gradient(180deg,#c8b898,#d8cbb8,#d0c0a8)",
            boxShadow:"0 3px 10px rgba(0,0,0,0.08)",borderBottom:"1px solid #c0a888" }}/>
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"28%",
            background:"linear-gradient(180deg,#e0d6c0,#d8ccb4)",borderTop:"3px solid #c8b898" }}>
            <div style={{ position:"absolute",inset:"8px 5%",display:"flex",gap:12 }}>
              {[...Array(8)].map((_,i) => (
                <div key={i} style={{ flex:1,borderRadius:3,border:"1.5px solid #d0c4ac",
                  boxShadow:"inset 1px 1px 3px rgba(0,0,0,0.04), inset -1px -1px 2px rgba(255,255,255,0.3)",
                  background:"linear-gradient(180deg,#e4dac6,#dcd0ba)" }}/>
              ))}
            </div>
          </div>
        </div>

        {/* 베이스보드 */}
        <div style={{ position:"absolute",top:"50%",left:0,right:0,height:10,zIndex:8,
          background:"linear-gradient(180deg,#d4b888,#c0a070,#a88858)",
          boxShadow:"0 4px 16px rgba(0,0,0,0.2)",
          borderTop:"2px solid #e0c898",borderBottom:"2px solid #906838" }}/>

        {/* 바닥 */}
        <div style={{ position:"absolute",top:"calc(50% + 10px)",left:0,right:0,bottom:0,overflow:"hidden" }}>
          <div style={{ position:"absolute",inset:0,
            background:"linear-gradient(180deg,#c8a878 0%,#b89868 25%,#a88858 55%,#987848 80%,#886838 100%)" }}/>
          <div style={{ position:"absolute",inset:0,opacity:0.07,
            backgroundImage:"repeating-linear-gradient(180deg,transparent,transparent 44px,#4a2810 44px,#4a2810 45px)" }}/>
          <div style={{ position:"absolute",inset:0,opacity:0.03,
            backgroundImage:"repeating-linear-gradient(93deg,transparent,transparent 70px,#3a2010 70px,#3a2010 71px)" }}/>
          <div style={{ position:"absolute",top:0,left:0,right:0,height:25,
            background:"linear-gradient(180deg,rgba(0,0,0,0.08),transparent)" }}/>
        </div>

        {/* 책상 그림자 */}
        <div style={{ position:"absolute",top:"78%",left:"13%",right:"13%",height:"4%",zIndex:9,
          background:"radial-gradient(ellipse at 50% 20%,rgba(0,0,0,0.12),transparent 80%)",pointerEvents:"none" }}/>
        {/* 책상 상판 */}
        <div style={{ position:"absolute",top:"60%",left:"12%",right:"12%",height:12,zIndex:12,
          background:"linear-gradient(180deg,#d4b888,#c8a878,#bfa070)",borderRadius:"3px 3px 0 0",
          boxShadow:"0 -2px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.1)",borderTop:"2px solid #e0c898" }}/>
        {/* 책상 앞면 */}
        <div style={{ position:"absolute",top:"calc(60% + 12px)",left:"12%",right:"12%",height:"16%",zIndex:12,
          background:"linear-gradient(180deg,#a88050 0%,#9a7040 30%,#8c6235 70%,#805830 100%)",
          overflow:"hidden",borderLeft:"4px solid #6a4a28",borderRight:"4px solid #6a4a28" }}>
          <div style={{ position:"absolute",inset:0,opacity:0.08,
            backgroundImage:`repeating-linear-gradient(92deg,transparent,transparent 40px,#4a2810 40px,#4a2810 41px),
              repeating-linear-gradient(88deg,transparent,transparent 65px,#3a1808 65px,#3a1808 66px)`,
            backgroundSize:"60px 100%, 90px 100%" }}/>
          <div style={{ position:"absolute",inset:"8px 6%",display:"flex",gap:8 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ flex:1,borderRadius:4,border:"2px solid #7a5a30",
                background:"linear-gradient(180deg,#9a7848,#8a6838)",
                boxShadow:"inset 1px 1px 3px rgba(0,0,0,0.08), inset -1px -1px 2px rgba(255,255,255,0.05)",
                position:"relative" }}>
                <div style={{ position:"absolute",top:"45%",left:"50%",transform:"translate(-50%,-50%)",
                  width:28,height:8,borderRadius:4,
                  background:"linear-gradient(180deg,#d4b080,#b89060)",border:"1px solid #a08050",
                  boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }}/>
              </div>
            ))}
          </div>
        </div>
        {/* 책상 다리 */}
        <div style={{ position:"absolute",top:"calc(60% + 12px + 16%)",left:"14%",width:16,height:"8%",zIndex:11,
          background:"linear-gradient(90deg,#7a5a30,#8a6838,#7a5a30)",borderRadius:"0 0 3px 3px",
          boxShadow:"2px 0 4px rgba(0,0,0,0.1)" }}/>
        <div style={{ position:"absolute",top:"calc(60% + 12px + 16%)",right:"14%",width:16,height:"8%",zIndex:11,
          background:"linear-gradient(90deg,#7a5a30,#8a6838,#7a5a30)",borderRadius:"0 0 3px 3px",
          boxShadow:"-2px 0 4px rgba(0,0,0,0.1)" }}/>

        {/* 달빛 */}
        <div style={{ position:"absolute",left:"8%",top:0,width:400,height:"51%",
          background:"radial-gradient(ellipse at 40% 10%,rgba(200,210,255,0.06),transparent 60%)",
          pointerEvents:"none",zIndex:1 }}/>

        <ParticleOverlay/>

        {/* ══ 문 (항상 표시) ══ */}
        {showDoor && (
          <RoomObj onClick={(e) => { e.stopPropagation(); onDoorKnock?.(); }}
            style={{ position:"absolute",left:24,top:"1%",width:100,height:"49%",zIndex:10,
              background:doorOpen?"linear-gradient(180deg,#1a1008,#0a0804)":"linear-gradient(178deg,#c49a68,#a87848,#926838)",
              border:"6px solid #7a5a3a",borderRadius:"4px 4px 0 0",
              boxShadow:doorOpen?"inset 0 0 50px rgba(0,0,0,0.7)":"0 8px 32px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.1)",
              transformOrigin:"left center",
              transform:doorOpen?"perspective(600px) rotateY(-65deg)":"none",
              transition:"transform 0.8s cubic-bezier(0.34,1.56,0.64,1), background 0.6s" }}
            hoverGlow="#8a6a4a">
            {!doorOpen && <>
              <div style={{ position:"absolute",top:"3%",left:10,right:10,height:"28%",
                background:"linear-gradient(180deg,#b8905a,#a88050)",border:"2px solid #9a7040",borderRadius:4,
                boxShadow:"inset 0 1px 3px rgba(0,0,0,0.06)" }}/>
              <div style={{ position:"absolute",top:"38%",left:10,right:10,height:"55%",
                background:"linear-gradient(180deg,#b8905a,#a88050)",border:"2px solid #9a7040",borderRadius:4,
                boxShadow:"inset 0 1px 3px rgba(0,0,0,0.06)" }}/>
              <div style={{ position:"absolute",top:"48%",right:12,transform:"translateY(-50%)",
                width:10,height:28,background:"linear-gradient(180deg,#e0c060,#c0a030)",
                borderRadius:5,boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}/>
              <div style={{ position:"absolute",top:"54%",right:15,width:5,height:5,borderRadius:"50%",
                background:"#5a4a2a",boxShadow:"inset 0 1px 2px rgba(0,0,0,0.4)" }}/>
            </>}
            {doorKnocks > 0 && doorKnocks < DOOR_KNOCK_THRESHOLD && !doorOpen && (
              <div style={{ position:"absolute",top:-24,left:"50%",transform:"translateX(-50%)",
                fontSize:12,color:"#8a6a4a",fontWeight:700,animation:"popIn 0.2s ease",
                background:"rgba(255,255,255,0.9)",padding:"3px 10px",borderRadius:10,whiteSpace:"nowrap" }}>
                🤛 x{doorKnocks}
              </div>
            )}
          </RoomObj>
        )}

        {/* 벽등 */}
        {showWallLight && (
          <div style={{ position:"absolute",left:138,top:"8%",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center" }}>
            <div style={{ width:20,height:10,background:"linear-gradient(180deg,#d4b060,#b89040)",
              borderRadius:"10px 10px 0 0",border:"2px solid #a88030",borderBottom:"none" }}/>
            <div style={{ width:36,height:28,background:"radial-gradient(ellipse at 50% 0%,#ffd,#ffc,#ffe8a0)",
              borderRadius:"0 0 18px 18px",border:"2px solid #d4b060",borderTop:"none",
              boxShadow:"0 4px 20px rgba(255,220,100,0.2), 0 8px 40px rgba(255,200,60,0.08)" }}/>
            <div style={{ width:50,height:60,marginTop:-2,
              background:"radial-gradient(ellipse at 50% 0%,rgba(255,240,180,0.12),transparent 80%)",
              pointerEvents:"none" }}/>
          </div>
        )}

        {/* 창문 */}
        {showWindow && (
          <div style={{ position:"absolute",left:"14%",top:"1%",width:230,height:180,zIndex:10 }}>
            <div style={{ position:"absolute",top:-8,left:-20,right:-20,height:10,
              background:"linear-gradient(180deg,#d4a872,#b08050)",borderRadius:5,zIndex:2,
              boxShadow:"0 3px 8px rgba(0,0,0,0.12)" }}/>
            <div style={{ position:"absolute",left:-18,top:0,width:34,height:"108%",zIndex:2,
              background:"linear-gradient(90deg,#c49460,#b88848)",borderRadius:"0 0 8px 8px",
              boxShadow:"3px 0 10px rgba(0,0,0,0.08)" }}/>
            <div style={{ position:"absolute",right:-18,top:0,width:34,height:"108%",zIndex:2,
              background:"linear-gradient(270deg,#c49460,#b88848)",borderRadius:"0 0 8px 8px",
              boxShadow:"-3px 0 10px rgba(0,0,0,0.08)" }}/>
            <div style={{ position:"absolute",inset:0,
              background:"linear-gradient(180deg,#080618,#14103a,#0c0824)",
              border:"8px solid #c4a878",borderRadius:10,overflow:"hidden",
              boxShadow:"inset 0 0 50px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.15)" }}>
              {[{x:15,y:12,s:2.5},{x:50,y:8,s:2},{x:90,y:25,s:3},{x:150,y:6,s:2},{x:70,y:45,s:1.5},
                {x:28,y:55,s:2.5},{x:120,y:48,s:2.5},{x:180,y:60,s:2},{x:40,y:75,s:2},{x:85,y:80,s:1.5},
                {x:140,y:38,s:2},{x:200,y:22,s:2.5},{x:10,y:90,s:1.5},{x:190,y:75,s:2},{x:60,y:65,s:1.5},
                {x:170,y:85,s:1.8},{x:110,y:15,s:2},{x:220,y:50,s:1.5}
              ].map((s,i) => (
                <div key={i} style={{ position:"absolute",left:s.x,top:s.y,width:s.s,height:s.s,
                  borderRadius:"50%",background:"#fff",
                  animation:`starTwinkle ${2+Math.random()*3}s ease ${Math.random()*2}s infinite` }}/>
              ))}
              <div style={{ position:"absolute",right:22,top:18,width:36,height:36,borderRadius:"50%",
                background:"radial-gradient(circle at 55% 35%,#ffe,#ffd,#ffc)",
                boxShadow:"0 0 24px rgba(255,255,200,0.5), 0 0 60px rgba(255,255,200,0.15)" }}/>
              <div style={{ position:"absolute",left:"50%",top:0,width:6,height:"100%",
                background:"#c4a878",transform:"translateX(-50%)",zIndex:1 }}/>
              <div style={{ position:"absolute",top:"50%",left:0,width:"100%",height:6,
                background:"#c4a878",transform:"translateY(-50%)",zIndex:1 }}/>
            </div>
          </div>
        )}

        {/* 액자 */}
        {showFrame && (
          <div style={{ position:"absolute",left:"42%",top:"4%",zIndex:10,
            width:68,height:86,borderRadius:4,
            background:"linear-gradient(180deg,#e8dcc8,#ddd0bc)",
            border:"6px solid #c4a878",boxShadow:"0 4px 16px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.03)" }}>
            <div style={{ position:"absolute",inset:4,background:"linear-gradient(180deg,#d4c0a0,#c8b490)",borderRadius:2,
              display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
              <div style={{ width:"100%",height:"100%",position:"relative" }}>
                <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"40%",
                  background:"linear-gradient(180deg,#7a9a60,#5a7a40)" }}/>
                <div style={{ position:"absolute",top:"15%",left:"25%",width:24,height:30,
                  background:"linear-gradient(180deg,#8a9aaa,#a0b0c0)",borderRadius:"40% 40% 0 0",opacity:0.5 }}/>
                <div style={{ position:"absolute",top:"5%",right:"20%",width:30,height:38,
                  background:"linear-gradient(180deg,#7a8a9a,#90a0b0)",borderRadius:"40% 40% 0 0",opacity:0.4 }}/>
              </div>
            </div>
          </div>
        )}

        {/* 시계 (S1+) */}
        {showClock && (
          <RoomObj onClick={(e) => { e.stopPropagation(); onClockClick?.(); }}
            style={{ position:"absolute",left:"54%",top:"22%",transform:"translateX(-50%)",zIndex:10,
              width:76,height:76,borderRadius:"50%",
              background:"linear-gradient(145deg,#fff,#f8f4ef)",
              border:"5px solid #c4b49a",
              boxShadow:"0 6px 28px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.5)",
              display:"flex",alignItems:"center",justifyContent:"center" }}
            hoverGlow="#e88b3d">
            <svg viewBox="0 0 40 40" width="48" height="48">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#e0d8cc" strokeWidth="1"/>
              {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => (
                <line key={deg} x1="20" y1="3" x2="20" y2={deg%90===0?"7":"5.5"}
                  stroke={deg%90===0?"#7a6a5a":"#c0b0a0"} strokeWidth={deg%90===0?"1.8":"0.8"}
                  transform={`rotate(${deg} 20 20)`}/>
              ))}
              <line x1="20" y1="20" x2="20" y2="7" stroke="#4a3a2a" strokeWidth="2" strokeLinecap="round"
                transform={`rotate(${(frame*6)%360} 20 20)`}/>
              <line x1="20" y1="20" x2="20" y2="5" stroke="#e8573d" strokeWidth="1" strokeLinecap="round"
                transform={`rotate(${(frame*36)%360} 20 20)`}/>
              <circle cx="20" cy="20" r="2.5" fill="#4a3a2a"/>
              <circle cx="20" cy="20" r="1.2" fill="#e8573d"/>
            </svg>
          </RoomObj>
        )}

        {/* 비상연락 SOS (S3+) */}
        {showSOS && (
          <RoomObj onClick={(e) => { e.stopPropagation(); onSOSClick?.(); }}
            style={{ position:"absolute",left:"64%",top:"5%",zIndex:10,
              width:52,height:62,borderRadius:6,
              background:"linear-gradient(180deg,#e8e4e0,#d8d4d0,#ccc8c4)",
              border:"2px solid #b0aaa4",
              boxShadow:"0 4px 14px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4 }}
            hoverGlow="#ff9800">
            <div style={{ width:8,height:8,borderRadius:"50%",
              background:"radial-gradient(circle,#ff4444,#cc0000)",
              boxShadow:"0 0 6px rgba(255,0,0,0.4), 0 0 12px rgba(255,0,0,0.15)",
              animation:"pulse 2s ease infinite" }}/>
            <div style={{ width:32,height:18,borderRadius:3,
              background:"linear-gradient(180deg,#999,#888)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:3 }}>
              {[...Array(4)].map((_,i) => (
                <div key={i} style={{ width:"100%",height:1,background:"#666",borderRadius:1 }}/>
              ))}
            </div>
            <div style={{ fontSize:9,color:"#c62828",fontWeight:900,letterSpacing:2 }}>SOS</div>
          </RoomObj>
        )}

        {/* 선반 */}
        {showBookshelf && (
          <div style={{ position:"absolute",left:"62%",top:"28%",zIndex:10,width:170 }}>
            <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"center",gap:5,paddingBottom:4 }}>
              <div style={{ width:14,height:40,background:"linear-gradient(90deg,#c0392b,#e74c3c)",borderRadius:"2px 2px 0 0",boxShadow:"1px 0 2px rgba(0,0,0,0.1)" }}/>
              <div style={{ width:12,height:32,background:"linear-gradient(90deg,#2980b9,#3498db)",borderRadius:"2px 2px 0 0" }}/>
              <div style={{ width:16,height:46,background:"linear-gradient(90deg,#27ae60,#2ecc71)",borderRadius:"2px 2px 0 0" }}/>
              <div style={{ width:12,height:28,background:"linear-gradient(90deg,#f39c12,#f1c40f)",borderRadius:"2px 2px 0 0" }}/>
              <div style={{ width:24,height:24,borderRadius:"50%",background:"#e8dcc8",border:"2px solid #c8b898",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>🌱</div>
              <div style={{ width:14,height:36,background:"linear-gradient(90deg,#8e44ad,#9b59b6)",borderRadius:"2px 2px 0 0" }}/>
              <div style={{ width:12,height:24,background:"linear-gradient(90deg,#e67e22,#d35400)",borderRadius:"2px 2px 0 0" }}/>
            </div>
            <div style={{ width:"100%",height:8,background:"linear-gradient(180deg,#b89060,#a07840)",
              borderRadius:2,boxShadow:"0 4px 12px rgba(0,0,0,0.12)",border:"1px solid #906830" }}/>
            <div style={{ display:"flex",justifyContent:"space-between",padding:"0 10px" }}>
              <div style={{ width:6,height:16,background:"linear-gradient(180deg,#a07840,#906830)" }}/>
              <div style={{ width:6,height:16,background:"linear-gradient(180deg,#a07840,#906830)" }}/>
            </div>
          </div>
        )}

        {/* TV (S4+) */}
        {showTV && (
          <RoomObj onClick={(e) => { e.stopPropagation(); onTVClick?.(); }}
            style={{ position:"absolute",left:"35%",top:"18%",zIndex:10,
              width:160,height:105,borderRadius:10,
              background:"linear-gradient(180deg,#3a3a3a,#2a2a2a,#222)",
              border:"5px solid #444",
              boxShadow:"0 10px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
              display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}
            hoverGlow="#666">
            <div style={{ width:"90%",height:"82%",
              background:"linear-gradient(180deg,#1a1a1a,#111,#0a0a0a)",
              borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ fontSize:13,color:"#333",letterSpacing:4,fontWeight:700 }}>OFF</div>
            </div>
            <div style={{ position:"absolute",bottom:5,right:8,width:5,height:5,borderRadius:"50%",
              background:"#e8573d22",boxShadow:"0 0 6px #e8573d22" }}/>
            <div style={{ position:"absolute",bottom:-12,left:"50%",transform:"translateX(-50%)",
              width:32,height:12,background:"linear-gradient(180deg,#444,#333)",borderRadius:"0 0 5px 5px" }}/>
          </RoomObj>
        )}

        {/* 스탠드 조명 */}
        {showLamp && (
          <div style={{ position:"absolute",left:"14%",bottom:"40%",zIndex:20,display:"flex",flexDirection:"column",alignItems:"center" }}>
            <div style={{ width:44,height:34,background:"radial-gradient(ellipse at 50% 100%,#e8c878,#d4a850)",
              borderRadius:"22px 22px 0 0",border:"2px solid #c49840",borderBottom:"none",
              boxShadow:"0 -4px 24px rgba(255,220,100,0.2), 0 -10px 50px rgba(255,200,60,0.06)" }}/>
            <div style={{ width:60,height:50,marginTop:-1,
              background:"radial-gradient(ellipse at 50% 0%,rgba(255,240,180,0.15),transparent 80%)",pointerEvents:"none" }}/>
            <div style={{ width:6,height:36,marginTop:-48,background:"linear-gradient(180deg,#888,#666)" }}/>
            <div style={{ width:34,height:8,background:"linear-gradient(180deg,#777,#555)",borderRadius:4,
              boxShadow:"0 2px 6px rgba(0,0,0,0.15)" }}/>
          </div>
        )}

        {/* 배너 (S2+) */}
        {showBanner && (
          <div onClick={(e) => { e.stopPropagation(); onBannerClick?.(); }}
            style={{ position:"absolute",top:"18%",left:"50%",transform:"translateX(-50%)",
              zIndex:450,background:"linear-gradient(135deg,#ffd700,#ff8f00)",border:"3px solid #ff6f00",
              borderRadius:24,padding:"24px 44px",textAlign:"center",cursor:"pointer",
              animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
              boxShadow:"0 16px 60px rgba(255,152,0,0.45), inset 0 2px 0 rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize:10,color:"#fff",letterSpacing:5,marginBottom:8,opacity:0.8 }}>★ CONGRATULATIONS ★</div>
            <div style={{ fontSize:30,fontWeight:800,color:"#fff",textShadow:"0 3px 10px rgba(0,0,0,0.2)" }}>
              💰 100만원 당첨!! 💰
            </div>
            <div style={{ fontSize:12,color:"#ffffffcc",marginTop:8 }}>▼ 지금 바로 수령하세요 ▼</div>
            <div style={{ marginTop:10,fontSize:8,color:"#ffffff33" }}>광고 아님 (진짜임) (진짜로)</div>
          </div>
        )}

        {/* 지갑 (S2+) */}
        {showWallet && (
          <RoomObj onClick={(e) => { e.stopPropagation(); onWalletClick?.(); }}
            style={{ position:"absolute",left:"22%",bottom:"40%",zIndex:20,
              width:80,height:50,borderRadius:8,
              background:"linear-gradient(150deg,#8d6e63,#6d4c41,#5d4037)",
              border:"2.5px solid #4e342e",
              boxShadow:"0 6px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
              display:"flex",alignItems:"center",justifyContent:"center" }}
            hoverGlow="#8d6e63">
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"50%",
              background:"linear-gradient(180deg,#9d7e73,#8d6e63)",borderRadius:"8px 8px 0 0",
              borderBottom:"2px solid #4e342e" }}/>
            <div style={{ fontSize:28,zIndex:1 }}>💳</div>
          </RoomObj>
        )}

        {/* 케이크 (S3+) */}
        {showCake && (
          <RoomObj onClick={(e) => { e.stopPropagation(); onCakeClick?.(); }}
            style={{ position:"absolute",left:"34%",bottom:"40%",zIndex:20,
              width:72,height:72,borderRadius:"50%",
              background:cakeSelected
                ?"linear-gradient(180deg,#fff3e0,#ffe0b2)"
                :"linear-gradient(180deg,#fff,#f5f0eb)",
              border:cakeSelected?"3px solid #ff9800":"2px solid #e8e0d8",
              boxShadow:cakeSelected
                ?"0 0 24px #ff980044, 0 6px 16px rgba(0,0,0,0.12)"
                :"0 4px 12px rgba(0,0,0,0.08)",
              display:"flex",alignItems:"center",justifyContent:"center",transition:"all 0.3s" }}
            hoverGlow="#ff9800">
            <div style={{ fontSize:42,lineHeight:1,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>🎂</div>
          </RoomObj>
        )}

        {/* 커피컵 */}
        <div style={{ position:"absolute",right:"32%",bottom:"40%",zIndex:18 }}>
          <div style={{ width:32,height:28,background:"linear-gradient(180deg,#fff,#f0e8e0)",
            borderRadius:"0 0 4px 4px",border:"2px solid #d8d0c8",position:"relative" }}>
            <div style={{ position:"absolute",right:-10,top:4,width:10,height:16,borderRadius:"0 6px 6px 0",
              border:"2px solid #d8d0c8",borderLeft:"none" }}/>
            <div style={{ position:"absolute",top:2,left:4,right:4,height:4,
              background:"linear-gradient(180deg,#8b6914,#a07820)",borderRadius:2,opacity:0.6 }}/>
          </div>
        </div>

        {/* 스마트폰 (S3+) */}
        {showPhone && (
          <RoomObj onClick={(e) => { e.stopPropagation(); onPhoneClick?.(); }}
            style={{ position:"absolute",right:"24%",bottom:"40%",zIndex:20,
              width:46,height:78,borderRadius:12,
              background:"linear-gradient(180deg,#333,#222,#1a1a1a)",
              border:"3px solid #444",
              boxShadow:"0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
              display:"flex",alignItems:"center",justifyContent:"center" }}
            hoverGlow="#4caf50">
            <div style={{ width:36,height:58,borderRadius:7,
              background:"linear-gradient(180deg,#1a237e,#0d47a1,#0d1117)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",
              boxShadow:"inset 0 0 10px rgba(0,0,0,0.3)",padding:4,overflow:"hidden" }}>
              <svg viewBox="0 0 28 30" width="28" height="30" style={{ opacity:0.7 }}>
                <polyline points="2,22 7,18 12,20 17,12 22,8 26,4" fill="none" stroke="#3fb950" strokeWidth="1.5"/>
                <line x1="2" y1="26" x2="26" y2="26" stroke="#ffffff22" strokeWidth="0.5"/>
              </svg>
              <div style={{ position:"absolute",top:6,left:6,right:6,display:"flex",justifyContent:"space-between" }}>
                <div style={{ width:8,height:2,borderRadius:1,background:"#ffffff33" }}/>
                <div style={{ width:12,height:2,borderRadius:1,background:"#ffffff22" }}/>
              </div>
            </div>
            <div style={{ position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",
              width:10,height:3,borderRadius:2,background:"#444" }}/>
          </RoomObj>
        )}

        {/* 안전커버 (S4+) */}
        {showSafetyCover && (
          <div onClick={(e) => { e.stopPropagation(); onSafetyCoverClick?.(); }}
            style={{ position:"absolute",left:"50%",bottom:"calc(39% + 170px)",transform:"translateX(-50%)",zIndex:51,
              width:60,height:30,
              background:"linear-gradient(180deg,#ffd54f,#ffca28,#ffb300)",
              border:"3px solid #ff8f00",borderRadius:"8px 8px 0 0",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:9,color:"#e65100",fontWeight:800,letterSpacing:1,
              boxShadow:"0 4px 14px rgba(255,152,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)" }}>
            ⚠ COVER
          </div>
        )}

        {/* 노트북 (S2+) */}
        {showNotebook && (
          <div style={{ position:"absolute",right:"14%",bottom:"40%",zIndex:20 }}>
            <div style={{ width:150,height:96,
              background:"linear-gradient(180deg,#e8e0d8,#d8d0c8)",
              borderRadius:"10px 10px 0 0",border:"4px solid #c0b8b0",
              boxShadow:"0 6px 24px rgba(0,0,0,0.1)",
              display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ width:132,height:76,
                background:"linear-gradient(180deg,#2a3a4a,#1a2a3a,#1a2030)",
                borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <div style={{ fontSize:12,color:"#4a6a8a",letterSpacing:3 }}>⌨️ _</div>
              </div>
            </div>
            <div style={{ width:162,height:12,marginLeft:-6,
              background:"linear-gradient(180deg,#d0c8c0,#c0b8b0)",
              borderRadius:"0 0 5px 5px",border:"3px solid #b0a8a0",borderTop:"none" }}/>
          </div>
        )}

        {/* children: 메인 버튼, CRT, 오버레이 등 */}
        {children}
      </div>
    </div>
  );
}
