// E08: 피지컬 — 버튼 드래그 → 도망가는 버튼 추격전
function E08Chase({ active, onComplete, say }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [caught, setCaught] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!active) { setCaught(false); setPos({ x: 50, y: 50 }); return; }
    say("버튼이 도망쳤다?!", "excited");
  }, [active]);

  const handleMouseMove = useCallback((e) => {
    if (caught || !active) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = pos.x - mx, dy = pos.y - my;
    if (Math.sqrt(dx*dx + dy*dy) < 18) {
      const angle = Math.atan2(dy, dx);
      setPos({
        x: clamp(pos.x + Math.cos(angle)*28, 8, 92),
        y: clamp(pos.y + Math.sin(angle)*28, 12, 88)
      });
    }
  }, [pos, caught, active]);

  if (!active) return null;

  return (
    <div ref={containerRef} onMouseMove={handleMouseMove}
      style={{ position:"absolute",inset:0,zIndex:350,cursor:"crosshair" }}>
      <div onClick={() => { setCaught(true); onComplete?.(); }}
        style={{ position:"absolute",left:`${pos.x}%`,top:`${pos.y}%`,transform:"translate(-50%,-50%)",
          width:64,height:64,borderRadius:"50%",
          background:"radial-gradient(circle at 36% 28%,#e8573dff,#e8573d 50%,#c0392baa)",
          boxShadow:"0 8px 24px #e8573d44",cursor:"pointer",transition:"left 0.15s, top 0.15s",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:11,color:"#fff",fontWeight:800,letterSpacing:1,
          animation:"shake 0.12s ease infinite" }}>
        {caught ? "!" : "잡아봐"}
      </div>
    </div>
  );
}
