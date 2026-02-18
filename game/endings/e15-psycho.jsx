// E15: 사이코패스 — Kill Mode 토글 → 나비 울음 연출
function E15Psycho({ active, onComplete, say }) {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (!active) { setPhase(0); return; }
    say("이거 누르면 나 죽어 ㅠㅠ", "cry");
    setPhase(1);
    const t1 = setTimeout(() => {
      say("제발... 누르지 마... 진짜야...", "cry");
      setPhase(2);
    }, 3000);
    const t2 = setTimeout(() => {
      say("...정말 누를 거야? 나 진짜 울어...", "cry");
      setPhase(3);
    }, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:300,pointerEvents:"none" }}>
      {/* 어두운 분위기 */}
      <div style={{ position:"absolute",inset:0,
        background:"radial-gradient(ellipse at 50% 50%,transparent 30%,rgba(0,0,0,0.3) 100%)",
        animation:"pulse 1.2s ease infinite" }}/>
      {/* 눈물 이펙트 */}
      {phase >= 2 && (
        <div style={{ position:"absolute",top:"20%",left:"50%",transform:"translateX(-50%)",
          fontSize:40,animation:"float 2s ease infinite",opacity:0.3 }}>
          😢
        </div>
      )}
    </div>
  );
}
