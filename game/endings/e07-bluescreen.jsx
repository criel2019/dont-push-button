// E07: 블루스크린 — 화면 광클 15회 → BSOD
function E07Bluescreen({ active, onComplete, say, doShake }) {
  const [showBSOD, setShowBSOD] = useState(false);

  useEffect(() => {
    if (!active) { setShowBSOD(false); return; }
    setShowBSOD(true);
    doShake();
    say("시스템 오류 발생...", "shocked");
    const t = setTimeout(() => setShowBSOD(false), 2500);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;

  return (
    <>
      {showBSOD && (
        <div style={{ position:"absolute",inset:0,zIndex:500,background:"#0078d7",display:"flex",flexDirection:"column",
          alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif",color:"#fff",animation:"fadeIn 0.2s ease" }}>
          <div style={{ fontSize:100,marginBottom:28,fontWeight:200 }}>:(</div>
          <div style={{ fontSize:16,marginBottom:10,maxWidth:420,textAlign:"center",lineHeight:1.7 }}>
            PC에 문제가 발생하여 다시 시작해야 합니다.
          </div>
          <div style={{ fontSize:12,color:"#ffffffaa",marginBottom:24 }}>오류 코드: DONT_PRESS_0x80070002</div>
          <div style={{ width:220,height:4,background:"#ffffff22",borderRadius:2 }}>
            <div style={{ width:"30%",height:"100%",background:"#fff",borderRadius:2,animation:"bsodProgress 2.5s ease forwards" }}/>
          </div>
          <div style={{ fontSize:11,color:"#ffffff55",marginTop:10 }}>0% 완료</div>
        </div>
      )}
    </>
  );
}
