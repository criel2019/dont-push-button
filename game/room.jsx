// ============================================================
// room.jsx — 방 환경 + 스테이지별 오브젝트
// 배경: assets/room-bg.png 일러스트, 오버레이는 투명 클릭 영역
// ============================================================

function GameRoom({ onDoorKnock, onClockClick, onSOSClick, onTVClick, onWalletClick,
  onCakeClick, onPhoneClick, onBannerClick, onSafetyCoverClick,
  doorKnocks, doorOpen, bannerVisible,
  walletVisible, cakeVisible, phoneVisible, sosVisible, tvVisible, safetyCoverVisible,
  cakeSelected, activeEvent, isEndingActive, frame, children,
  doorInteractive, clockInteractive,
  walletInteractive, cakeInteractive, phoneInteractive,
  sosInteractive, tvInteractive, safetyCoverInteractive, bannerInteractive }) {

  // 나비가 언급할 때 개별적으로 등장하는 오브젝트
  const showBanner = bannerVisible;
  const showWallet = walletVisible;
  const showCake = cakeVisible;
  const showPhone = phoneVisible;
  const showSOS = sosVisible;
  const showTV = tvVisible;
  const showSafetyCover = safetyCoverVisible;

  return (
    <div style={{ width:"100%",height:"100%",position:"relative",overflow:"hidden" }}>
      {/* 양쪽 여백 배경색 (1100px 초과 화면) */}
      <div style={{ position:"absolute",inset:0,background:"#c8a878" }}/>

      {/* 중앙 고정 컨테이너 */}
      <div style={{ position:"relative",width:"100%",maxWidth:1100,height:"100%",margin:"0 auto",overflow:"visible" }}>

        {/* 배경 일러스트 */}
        <img src="assets/room-bg.png" alt=""
          style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",display:"block" }}/>

        <ParticleOverlay/>

        {/* ══ 문 (투명 클릭 오버레이) ══ */}
        <RoomObj disabled={!doorInteractive} onClick={(e) => { e.stopPropagation(); onDoorKnock?.(); }}
          style={{ position:"absolute",left:"2.5%",top:"5%",width:"11%",height:"63%",zIndex:10,
            background:doorOpen?"rgba(10,8,4,0.85)":"transparent",
            borderRadius:"4px 4px 0 0",
            transition:"background 0.6s" }}
          hoverGlow={doorOpen?undefined:"#8a6a4a"}>
          {doorKnocks > 0 && doorKnocks < DOOR_KNOCK_THRESHOLD && !doorOpen && (
            <div style={{ position:"absolute",top:-24,left:"50%",transform:"translateX(-50%)",
              fontSize:12,color:"#8a6a4a",fontWeight:700,animation:"popIn 0.2s ease",
              background:"rgba(255,255,255,0.9)",padding:"3px 10px",borderRadius:10,whiteSpace:"nowrap" }}>
              🤛 x{doorKnocks}
            </div>
          )}
        </RoomObj>

        {/* ══ 시계 (투명 오버레이 + SVG 시침/분침만) ══ */}
        <RoomObj disabled={!clockInteractive} onClick={(e) => { e.stopPropagation(); onClockClick?.(); }}
          style={{ position:"absolute",left:"62%",top:"15%",transform:"translateX(-50%)",zIndex:10,
            width:56,height:56,borderRadius:"50%",
            background:"transparent",
            display:"flex",alignItems:"center",justifyContent:"center" }}
          hoverGlow="#e88b3d">
          <svg viewBox="0 0 40 40" width="42" height="42">
            <line x1="20" y1="20" x2="20" y2="8" stroke="#4a3a2a" strokeWidth="2.2" strokeLinecap="round"
              transform={`rotate(${(frame*6)%360} 20 20)`}/>
            <line x1="20" y1="20" x2="20" y2="5" stroke="#e8573d" strokeWidth="1.2" strokeLinecap="round"
              transform={`rotate(${(frame*36)%360} 20 20)`}/>
            <circle cx="20" cy="20" r="2.5" fill="#4a3a2a"/>
            <circle cx="20" cy="20" r="1.2" fill="#e8573d"/>
          </svg>
        </RoomObj>

        {/* ══ 비상연락 SOS (S3+) ══ */}
        {showSOS && (
          <RoomObj disabled={!sosInteractive} onClick={(e) => { e.stopPropagation(); onSOSClick?.(); }}
            style={{ position:"absolute",left:"68%",top:"6%",zIndex:10,
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

        {/* ══ TV (S4+) ══ */}
        {showTV && (
          <RoomObj disabled={!tvInteractive} onClick={(e) => { e.stopPropagation(); onTVClick?.(); }}
            style={{ position:"absolute",left:"38%",top:"10%",zIndex:10,
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

        {/* ══ 배너 (S2+) — 중앙 float ══ */}
        {showBanner && (
          <div onClick={bannerInteractive ? (e) => { e.stopPropagation(); onBannerClick?.(); } : undefined}
            style={{ position:"absolute",top:"18%",left:"50%",transform:"translateX(-50%)",
              zIndex:55,background:"linear-gradient(135deg,#ffd700,#ff8f00)",border:"3px solid #ff6f00",
              borderRadius:24,padding:"24px 44px",textAlign:"center",
              cursor:bannerInteractive?"pointer":"default",
              opacity:bannerInteractive?1:0.5,transition:"opacity 0.5s",
              animation:bannerInteractive?"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1), interactiveHint 2s ease-in-out infinite":"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
              outline:bannerInteractive?"3px solid #ffd740":"none",
              outlineOffset:4,
              boxShadow:"0 16px 60px rgba(255,152,0,0.45), inset 0 2px 0 rgba(255,255,255,0.3)" }}>
            <div style={{ fontSize:10,color:"#fff",letterSpacing:5,marginBottom:8,opacity:0.8 }}>★ CONGRATULATIONS ★</div>
            <div style={{ fontSize:30,fontWeight:800,color:"#fff",textShadow:"0 3px 10px rgba(0,0,0,0.2)" }}>
              💰 100만원 당첨!! 💰
            </div>
            <div style={{ fontSize:12,color:"#ffffffcc",marginTop:8 }}>▼ 지금 바로 수령하세요 ▼</div>
            <div style={{ marginTop:10,fontSize:8,color:"#ffffff33" }}>광고 아님 (진짜임) (진짜로)</div>
          </div>
        )}

        {/* ══ 지갑 (S2+) — 책상 위 ══ */}
        {showWallet && (
          <RoomObj disabled={!walletInteractive} onClick={(e) => { e.stopPropagation(); onWalletClick?.(); }}
            style={{ position:"absolute",left:"52%",top:"51%",zIndex:20,
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

        {/* ══ 케이크 (S3+) — 책상 위 ══ */}
        {showCake && (
          <RoomObj disabled={!cakeInteractive} onClick={(e) => { e.stopPropagation(); onCakeClick?.(); }}
            style={{ position:"absolute",left:"59%",top:"48%",zIndex:20,
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

        {/* ══ 스마트폰 (S3+) — 책상 위 ══ */}
        {showPhone && (
          <RoomObj disabled={!phoneInteractive} onClick={(e) => { e.stopPropagation(); onPhoneClick?.(); }}
            style={{ position:"absolute",left:"76%",top:"49%",zIndex:22,
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

        {/* ══ 안전커버 (S4+) — 버튼 바로 위 ══ */}
        {showSafetyCover && (
          <div onClick={safetyCoverInteractive ? (e) => { e.stopPropagation(); onSafetyCoverClick?.(); } : undefined}
            style={{ position:"absolute",left:"67%",bottom:"calc(38% + 170px)",transform:"translateX(-50%)",zIndex:51,
              width:60,height:30,
              background:"linear-gradient(180deg,#ffd54f,#ffca28,#ffb300)",
              border:"3px solid #ff8f00",borderRadius:"8px 8px 0 0",
              cursor:safetyCoverInteractive?"pointer":"default",
              opacity:safetyCoverInteractive?1:0.5,
              display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:9,color:"#e65100",fontWeight:800,letterSpacing:1,
              boxShadow:"0 4px 14px rgba(255,152,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
              outline:safetyCoverInteractive?"3px solid #ffd740":"none",
              outlineOffset:4,
              animation:safetyCoverInteractive?"interactiveHint 2s ease-in-out infinite":"none",
              transition:"opacity 0.5s" }}>
            ⚠ COVER
          </div>
        )}

        {/* children: 메인 버튼, CRT, 오버레이 등 */}
        {children}
      </div>
    </div>
  );
}
