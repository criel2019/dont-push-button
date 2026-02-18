// E16: 수면 — 오래 방치 → 나비 잠들기 → 점진적 어두워짐
function E16Sleep({ active, onComplete, say }) {
  const [darkness, setDarkness] = useState(0);

  useEffect(() => {
    if (!active) { setDarkness(0); return; }
    say("Zzz... Zzz...", "bored");
    const iv = setInterval(() => {
      setDarkness(p => {
        if (p >= 0.8) { clearInterval(iv); return 0.8; }
        return p + 0.02;
      });
    }, 200);
    return () => clearInterval(iv);
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:300,pointerEvents:"none" }}>
      <div style={{ position:"absolute",inset:0,
        background:`rgba(0,0,20,${darkness})`,
        transition:"background 0.5s" }}/>
      {darkness > 0.3 && (
        <div style={{ position:"absolute",top:"30%",left:"50%",transform:"translateX(-50%)",
          textAlign:"center" }}>
          <div style={{ fontSize:48,animation:"zzz 2s ease infinite" }}>💤</div>
          <div style={{ fontSize:13,color:`rgba(200,200,255,${darkness})`,marginTop:12,letterSpacing:3 }}>
            (조용하다...)
          </div>
        </div>
      )}
    </div>
  );
}
