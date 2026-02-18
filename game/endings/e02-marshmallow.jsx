// E02: 마시멜로 — 시계 클릭 → 1분 타이머, 포기하면 엔딩
function E02Marshmallow({ active, onComplete, say, frame }) {
  const [timer, setTimer] = useState(60);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!active) { setRunning(false); setTimer(60); return; }
    setRunning(true);
    say("1분 버티기 시작! 참아봐~", "smug");
  }, [active]);

  useEffect(() => {
    if (!running) return;
    const iv = setInterval(() => {
      setTimer(p => {
        if (p <= 1) {
          clearInterval(iv);
          setRunning(false);
          say("헐... 진짜 1분 버텼어?! 대단한데?!", "shocked");
          return 60;
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [running]);

  if (!active) return null;

  return (
    <div style={{ position:"absolute",top:"42%",left:"50%",transform:"translate(-50%,-50%)",zIndex:350,textAlign:"center" }}>
      <div style={{ fontSize:84,fontWeight:800,color:timer<=10?"#e8573d":"#e88b3d",
        textShadow:`0 6px 40px ${timer<=10?"#e8573d33":"#e88b3d22"}`,
        animation:timer<=10?"pulse 0.5s ease infinite":"none",letterSpacing:6 }}>
        {String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}
      </div>
      <div style={{ fontSize:10,color:"#b0a09088",letterSpacing:4,marginTop:6 }}>MARSHMALLOW CHALLENGE</div>
      {timer <= 30 && (
        <div style={{ marginTop:20,fontSize:13,color:"#e88b3d",animation:"pulse 1s ease infinite" }}>
          참을 수 있어...?
        </div>
      )}
    </div>
  );
}
