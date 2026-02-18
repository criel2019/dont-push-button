// E14: 뉴스 속보 — TV 클릭 → 뉴스 + 채널 전환
function E14News({ active, onComplete, say, doShake }) {
  const [channel, setChannel] = useState(0);

  useEffect(() => {
    if (!active) { setChannel(0); return; }
    doShake();
    say("[속보] 핵전쟁 발발!", "shocked");
  }, [active]);

  if (!active) return null;

  const channels = [
    { name:"NEWS 24", content:"☢️ 핵미사일 발사!", sub:"전 세계 비상사태 선포", color:"#c62828" },
    { name:"NAVI TV", content:"🎮 게임 대회 중계", sub:"참가자 모집 중", color:"#1565c0" },
    { name:"FOOD CH", content:"🍰 오늘의 레시피", sub:"3단 케이크 만들기", color:"#ff8f00" },
  ];
  const ch = channels[channel % channels.length];

  return (
    <div style={{ position:"absolute",inset:0,zIndex:400,
      background:"linear-gradient(180deg,#1a1a2e,#16213e)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      animation:"fadeIn 0.3s ease" }}>
      <div style={{ background:ch.color,padding:"10px 40px",borderRadius:6,marginBottom:20,
        boxShadow:`0 6px 24px ${ch.color}88` }}>
        <span style={{ color:"#fff",fontSize:18,fontWeight:800,letterSpacing:8 }}>{ch.name}</span>
      </div>
      <div style={{ color:"#fff",fontSize:28,fontWeight:800,marginBottom:8,letterSpacing:3 }}>{ch.content}</div>
      <div style={{ color:"#ff8a80",fontSize:14,marginBottom:28 }}>{ch.sub}</div>
      <div style={{ display:"flex",gap:8,marginTop:16 }}>
        {channels.map((c,i) => (
          <div key={i} onClick={() => setChannel(i)}
            style={{ padding:"8px 16px",background:i===channel%channels.length?"rgba(255,255,255,0.2)":"rgba(255,255,255,0.05)",
              borderRadius:8,cursor:"pointer",fontSize:11,color:"#fff",fontWeight:600,
              border:`1px solid ${i===channel%channels.length?"rgba(255,255,255,0.3)":"rgba(255,255,255,0.1)"}` }}>
            CH.{i+1}
          </div>
        ))}
      </div>
      <div style={{ position:"absolute",bottom:28,width:"100%",overflow:"hidden" }}>
        <div style={{ color:"#ffeb3b",fontSize:12,whiteSpace:"nowrap",animation:"ticker 10s linear infinite" }}>
          [긴급] 각국 핵미사일 발사 준비 완료 — 시민 대피 권고 — 버튼을 누르면 대응 미사일 발사 — 반복 —
        </div>
      </div>
      <div style={{ position:"absolute",bottom:50,left:"50%",transform:"translateX(-50%)" }}>
        <div style={{ color:"#ff5252",fontSize:12,animation:"pulse 1s ease infinite" }}>🔴 LIVE</div>
      </div>
    </div>
  );
}
