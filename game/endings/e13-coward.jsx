// E13: 쫄보 — 안전커버 클릭 or 카운트다운
function E13Coward({ active, onComplete, say, doShake }) {
  const [count, setCount] = useState(3);

  useEffect(() => {
    if (!active) { setCount(3); return; }
    doShake();
    say("3... 2... 1...", "shocked");
  }, [active]);

  useEffect(() => {
    if (!active || count <= 0) return;
    const t = setTimeout(() => setCount(p => p - 1), 1000);
    return () => clearTimeout(t);
  }, [active, count]);

  useEffect(() => {
    if (active && count === 0) {
      say("...뭐야, 아무 일도 안 일어나잖아? ㅋㅋ", "smug");
    }
  }, [count, active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",top:"36%",left:"50%",transform:"translate(-50%,-50%)",zIndex:350,textAlign:"center" }}>
      <div key={count} style={{
        fontSize:120,fontWeight:800,color:"#e8573d",
        animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
        textShadow:"0 10px 50px #e8573d44"
      }}>
        {count > 0 ? count : "💥"}
      </div>
      {count === 0 && (
        <div style={{ fontSize:13,color:"#ffd700",marginTop:10 }}>아무 일도 안 일어남!</div>
      )}
    </div>
  );
}
