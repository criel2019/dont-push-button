// E18: 현실 만남 — 문 반복 노크 5회
function E18Door({ active, onComplete, say }) {
  useEffect(() => {
    if (!active) return;
    say("누구야...?", "shocked");
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:300,pointerEvents:"none" }}>
      {/* 문이 열리는 빛 */}
      <div style={{ position:"absolute",left:0,top:0,width:"30%",height:"100%",
        background:"linear-gradient(90deg,rgba(255,240,200,0.2),transparent)",
        animation:"fadeIn 1s ease" }}/>
    </div>
  );
}
