// E11: 오타쿠 — 고양이 귀 씌우기 (CRT 위 🐱 클릭)
function E11Otaku({ active, onComplete, say }) {
  const [affection, setAffection] = useState(0);

  useEffect(() => {
    if (!active) { setAffection(0); return; }
    say("냥~♡", "shy");
    // 호감도 자동 상승
    const iv = setInterval(() => {
      setAffection(p => {
        if (p >= 100) { clearInterval(iv); return 100; }
        return p + 5;
      });
    }, 200);
    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",top:"10%",left:"50%",transform:"translateX(-50%)",zIndex:350,textAlign:"center" }}>
      <div style={{ fontSize:14,color:"#ff8fab",fontWeight:800,letterSpacing:2,marginBottom:8 }}>
        💕 호감도
      </div>
      <div style={{ width:200,height:8,background:"rgba(255,143,171,0.15)",borderRadius:4,overflow:"hidden" }}>
        <div style={{ width:`${affection}%`,height:"100%",
          background:"linear-gradient(90deg,#ff8fab,#e84393)",
          borderRadius:4,transition:"width 0.2s" }}/>
      </div>
      <div style={{ fontSize:11,color:"#ff8fab88",marginTop:4 }}>{affection}%</div>
    </div>
  );
}
