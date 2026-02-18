// E19: 교대 — 프로필 → 권한 양도 → 관리자 콘솔
function E19Transfer({ active, onComplete, say }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) { setPhase(0); return; }
    say("관리자 권한 넘길래?", "yandere");
    setPhase(1);
    const t1 = setTimeout(() => {
      setPhase(2);
      say("자, 이제 네 차례야.", "yandere");
    }, 2000);
    const t2 = setTimeout(() => setPhase(3), 4000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:350,
      display:"flex",alignItems:"center",justifyContent:"center" }}>
      {phase >= 2 && (
        <div style={{ background:"#0a0a1a",borderRadius:16,padding:"24px 32px",
          border:"1px solid #6a1b9a44",boxShadow:"0 16px 48px rgba(106,27,154,0.3)",
          animation:"popIn 0.3s ease",textAlign:"center",minWidth:280 }}>
          <div style={{ fontSize:11,color:"#6a1b9a",letterSpacing:4,marginBottom:12 }}>ADMIN CONSOLE</div>
          <div style={{ fontSize:14,color:"#fff",fontWeight:700,marginBottom:8 }}>권한 이전 중...</div>
          <div style={{ width:"100%",height:4,background:"#1a1a2e",borderRadius:2,overflow:"hidden" }}>
            <div style={{ width:phase>=3?"100%":"60%",height:"100%",
              background:"linear-gradient(90deg,#6a1b9a,#e040fb)",borderRadius:2,
              transition:"width 2s ease" }}/>
          </div>
          {phase >= 3 && (
            <div style={{ fontSize:12,color:"#e040fb",marginTop:12,animation:"pulse 1s ease infinite" }}>
              TRANSFER COMPLETE
            </div>
          )}
        </div>
      )}
    </div>
  );
}
