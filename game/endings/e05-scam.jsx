// E05: 낚시 — 경품 배너 클릭 → 팝업 증식
function E05Scam({ active, onComplete, say, doShake }) {
  const [popups, setPopups] = useState([]);

  useEffect(() => {
    if (!active) { setPopups([]); return; }
    say("★ 100만원 당첨!! ★", "excited");
    doShake();
    // 팝업 증식
    let count = 0;
    const iv = setInterval(() => {
      count++;
      setPopups(prev => [...prev, {
        id: count,
        x: 10 + Math.random() * 70,
        y: 10 + Math.random() * 70,
        text: pickRandom(["축하합니다!", "당첨!!", "100만원!", "수령하세요!", "이벤트!!", "클릭!"]),
      }]);
      if (count >= 8) clearInterval(iv);
    }, 400);
    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:400,pointerEvents:"none" }}>
      {popups.map(p => (
        <div key={p.id} style={{
          position:"absolute",left:`${p.x}%`,top:`${p.y}%`,
          background:"linear-gradient(135deg,#ffd700,#ff8f00)",
          border:"2px solid #ff6f00",borderRadius:16,
          padding:"12px 20px",textAlign:"center",
          animation:"popIn 0.3s cubic-bezier(0.34,1.56,0.64,1)",
          boxShadow:"0 8px 24px rgba(255,152,0,0.3)",
          pointerEvents:"none"
        }}>
          <div style={{ fontSize:14,fontWeight:800,color:"#fff" }}>{p.text}</div>
        </div>
      ))}
    </div>
  );
}
