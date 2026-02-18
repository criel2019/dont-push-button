// E20: 암전 — 모든 스테이지 통과 후 무행동 시 발동
function E20Blackout({ active, onComplete, say, naviGone }) {
  const [darkness, setDarkness] = useState(0);

  useEffect(() => {
    if (!active) { setDarkness(0); return; }
    // 점진적 암전
    const iv = setInterval(() => {
      setDarkness(p => {
        if (p >= 1) { clearInterval(iv); return 1; }
        return p + 0.01;
      });
    }, 100);
    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:500,
      background:`rgba(0,0,0,${darkness})`,
      animation:"darkFade 4s ease forwards",
      display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column" }}>
      {darkness > 0.7 && (
        <>
          <div style={{ color:"#22222266",fontSize:14,marginBottom:28 }}>(조명이 꺼졌다)</div>
          <div onClick={onComplete} style={{ color:"#22222233",fontSize:12,cursor:"pointer",
            padding:"10px 20px",border:"1px solid #22222222",borderRadius:10 }}>...</div>
        </>
      )}
    </div>
  );
}
