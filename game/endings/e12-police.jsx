// E12: 경찰서 — SOS 클릭 → 다이얼 패드 UI
function E12Police({ active, onComplete, say }) {
  const [dialed, setDialed] = useState("");
  const [showDialer, setShowDialer] = useState(false);

  useEffect(() => {
    if (!active) { setDialed(""); setShowDialer(false); return; }
    setShowDialer(true);
    say("번호 줄까~?", "teasing");
  }, [active]);

  if (!active || !showDialer) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:400,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.4)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"#1a1a2e",borderRadius:24,padding:"24px",
        width:240,boxShadow:"0 24px 60px rgba(0,0,0,0.5)",animation:"popIn 0.3s ease" }}>
        <div style={{ fontSize:11,color:"#43a04788",letterSpacing:4,textAlign:"center",marginBottom:8 }}>EMERGENCY CALL</div>
        <div style={{ fontSize:24,fontWeight:800,color:"#fff",textAlign:"center",
          marginBottom:16,letterSpacing:4,minHeight:36 }}>
          {dialed || "---"}
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8 }}>
          {["1","2","3","4","5","6","7","8","9","*","0","#"].map(key => (
            <div key={key} onClick={() => setDialed(p => p + key)}
              style={{ width:56,height:44,borderRadius:12,
                background:"rgba(255,255,255,0.06)",
                display:"flex",alignItems:"center",justifyContent:"center",
                fontSize:18,color:"#fff",fontWeight:700,cursor:"pointer",
                border:"1px solid rgba(255,255,255,0.08)",
                transition:"background 0.15s" }}
              onMouseEnter={e=>e.target.style.background="rgba(255,255,255,0.12)"}
              onMouseLeave={e=>e.target.style.background="rgba(255,255,255,0.06)"}>
              {key}
            </div>
          ))}
        </div>
        <div style={{ marginTop:12,textAlign:"center" }}>
          <div style={{ display:"inline-block",padding:"10px 24px",background:"#43a047",borderRadius:12,
            cursor:"pointer",color:"#fff",fontSize:14,fontWeight:800,letterSpacing:2 }}
            onClick={onComplete}>
            📞 Call
          </div>
        </div>
      </div>
    </div>
  );
}
