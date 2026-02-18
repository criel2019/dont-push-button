// E06: 자본주의 — 지갑 클릭 → 쇼핑몰 UI
function E06Shopping({ active, onComplete, say }) {
  const [showShop, setShowShop] = useState(false);

  useEffect(() => {
    if (!active) { setShowShop(false); return; }
    setShowShop(true);
    say("✦ PREMIUM 멤버십 해제 완료 ✦", "smug");
  }, [active]);

  if (!active || !showShop) return null;

  const items = [
    { name:"VIP 패스", price:"₩9,900", emoji:"👑" },
    { name:"프리미엄 스킨", price:"₩4,900", emoji:"✨" },
    { name:"무적 모드", price:"₩19,900", emoji:"🛡️" },
    { name:"힌트 팩", price:"₩2,900", emoji:"💡" },
  ];

  return (
    <div style={{ position:"absolute",inset:0,zIndex:400,
      background:"linear-gradient(180deg,#1a0a2e,#2a1040)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
      animation:"fadeIn 0.3s ease" }}>
      <div style={{ fontSize:11,color:"#9c27b0",letterSpacing:6,marginBottom:8 }}>✦ PREMIUM SHOP ✦</div>
      <div style={{ fontSize:24,fontWeight:800,color:"#fff",marginBottom:24 }}>멤버십 스토어</div>
      <div style={{ display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,maxWidth:320 }}>
        {items.map((item,i) => (
          <div key={i} style={{ background:"rgba(255,255,255,0.06)",borderRadius:16,padding:"16px 12px",
            textAlign:"center",border:"1px solid rgba(156,39,176,0.2)",cursor:"pointer" }}>
            <div style={{ fontSize:28,marginBottom:8 }}>{item.emoji}</div>
            <div style={{ fontSize:12,color:"#fff",fontWeight:700 }}>{item.name}</div>
            <div style={{ fontSize:11,color:"#ce93d8",marginTop:4 }}>{item.price}</div>
          </div>
        ))}
      </div>
      <div style={{ fontSize:9,color:"#ffffff33",marginTop:16 }}>결제 시 환불 불가</div>
    </div>
  );
}
