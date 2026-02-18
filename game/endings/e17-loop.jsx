// E17: 무한 루프 — 설정 → 초기화 클릭 → 메타 대화
function E17Loop({ active, onComplete, say, playCount }) {
  useEffect(() => {
    if (!active) return;
    if (playCount > 0) {
      say("또 왔어? 학습 능력이 없어?", "smug");
    } else {
      say("처음으로 돌아갈래?", "idle");
    }
  }, [active]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",inset:0,zIndex:350,
      display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none" }}>
      <div style={{ textAlign:"center",animation:"fadeIn 0.5s ease" }}>
        <div style={{ fontSize:60,marginBottom:16,animation:"spin 3s linear infinite" }}>🔄</div>
        <div style={{ fontSize:14,color:"#78909c",letterSpacing:3 }}>
          RESETTING...
        </div>
      </div>
    </div>
  );
}
