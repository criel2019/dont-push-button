// E10: 떡락 — 스마트폰 클릭 → 주식 트레이딩 UI
function E10Stock({ active, onComplete, say, frame }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!active) { setElapsed(0); return; }
    say("지금이야! 인생 역전!", "excited");
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;

  const getChange = (t) => {
    if (t < 5) return (100 + t * 20);
    return (200 + (t - 5) * 40 + Math.sin(t * 0.5) * 30);
  };
  const change = ((getChange(elapsed) - 100) / 100 * 100).toFixed(1);

  return (
    <div style={{ position:"absolute",inset:0,zIndex:400,
      background:"linear-gradient(170deg,#06090f 0%,#0a1020 50%,#0c1428 100%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease" }}>
      <div style={{ position:"absolute",inset:0,opacity:0.015,
        backgroundImage:"linear-gradient(rgba(63,185,80,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(63,185,80,0.5) 1px,transparent 1px)",
        backgroundSize:"80px 80px",pointerEvents:"none" }}/>
      <div style={{ position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:"#3fb950",boxShadow:"0 0 6px #3fb95088" }}/>
          <span style={{ color:"#3a4a5a",fontSize:10,letterSpacing:4,fontFamily:"monospace",fontWeight:600 }}>
            KOSPI · MEME · NAVI
          </span>
        </div>
        <div style={{ marginBottom:4 }}>
          <span style={{ color:"#3fb950",fontSize:56,fontWeight:800,fontFamily:"'SF Mono',monospace",
            textShadow:"0 0 40px rgba(63,185,80,0.15)" }}>+{change}</span>
          <span style={{ color:"#3fb95066",fontSize:28,fontWeight:600,fontFamily:"monospace" }}>%</span>
        </div>
        <div style={{ color:"#1e2e3e",fontSize:11,marginBottom:20,fontFamily:"monospace",letterSpacing:2 }}>
          ₩{Math.floor(getChange(elapsed) * 100).toLocaleString()}
        </div>
        <svg viewBox="0 0 240 80" style={{ width:260,height:80 }}>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(63,185,80,0.12)"/><stop offset="100%" stopColor="rgba(63,185,80,0)"/>
            </linearGradient>
          </defs>
          {[20,40,60].map(y => (
            <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="rgba(63,185,80,0.03)" strokeWidth="0.5"/>
          ))}
          <path d="M0,70 L30,65 60,60 90,48 120,35 150,20 180,10 210,6 240,2 L240,80 L0,80 Z" fill="url(#chartFill)"/>
          <polyline points="0,70 30,65 60,60 90,48 120,35 150,20 180,10 210,6 240,2" fill="none" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="240" cy="2" r="3" fill="#3fb950">
            <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <div style={{ color:"#1a2233",fontSize:8,marginTop:12,fontFamily:"monospace" }}>투자는 본인 책임입니다</div>
      </div>
    </div>
  );
}
