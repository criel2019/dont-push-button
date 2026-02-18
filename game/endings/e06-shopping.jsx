// E06: 자본주의 — 지갑 클릭 → 프리미엄 쇼핑몰 UI
function E06Shopping({ active, onComplete, onDismiss, say }) {
  const [galleryIdx, setGalleryIdx] = useState(0);
  const [reviewIdx, setReviewIdx] = useState(0);
  const [couponCode, setCouponCode] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [stock, setStock] = useState(3);
  const [elapsed, setElapsed] = useState(0);
  const [idleDialogue1, setIdleDialogue1] = useState(false);
  const [idleDialogue2, setIdleDialogue2] = useState(false);
  const [gallerySpoke, setGallerySpoke] = useState(false);
  const [reviewSpoke, setReviewSpoke] = useState(false);

  const skins = [
    { name: "GOLD Edition", desc: "24K 순금 코팅", color: "linear-gradient(135deg, #ffd700, #b8860b)", emoji: "👑", price: "₩500" },
    { name: "DIAMOND Edition", desc: "다이아몬드 인크루스트", color: "linear-gradient(135deg, #b9f2ff, #7ec8e3)", emoji: "💎", price: "₩500" },
    { name: "RAINBOW Edition", desc: "무지개 홀로그램", color: "linear-gradient(135deg, #ff6b6b, #ffd93d, #6bcb77, #4d96ff, #9b59b6)", emoji: "🌈", price: "₩500" }
  ];

  const reviews = [
    { user: "나비팬01", stars: 5, text: "인생 버튼입니다. 매일 누르고 있어요." },
    { user: "익명구매자", stars: 5, text: "처음엔 의심했는데 퀄리티 미쳤습니다." },
    { user: "불만제로", stars: 5, text: "배송도 빠르고 나비가 귀여워요." },
    { user: "VIP회원", stars: 5, text: "3번째 재구매입니다. 가족 선물용." },
    { user: "리뷰왕", stars: 5, text: "이 가격에 이 퀄리티? 사기 아님??" }
  ];

  useEffect(() => {
    if (!active) {
      setGalleryIdx(0); setReviewIdx(0); setCouponCode("");
      setCouponApplied(false); setStock(3); setElapsed(0);
      setIdleDialogue1(false); setIdleDialogue2(false);
      setGallerySpoke(false); setReviewSpoke(false);
      return;
    }
    say("어서 오세요~ 오늘만 특별 할인이에요~ ...아 이거 좀 오글거린다.", "confident");
  }, [active]);

  // Elapsed timer
  useEffect(() => {
    if (!active) return;
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [active]);

  // Stock countdown at 12s
  useEffect(() => {
    if (!active) return;
    if (elapsed === 12 && stock > 2) setStock(2);
    if (elapsed === 18 && stock > 1) setStock(1);
  }, [active, elapsed, stock]);

  // Idle dialogues
  useEffect(() => {
    if (!active) return;
    if (elapsed >= 15 && !idleDialogue1) {
      setIdleDialogue1(true);
      say("한정 수량 3개... 2개... ...야, 살 거야 말 거야. 빨리 해.", "pouty");
    }
    if (elapsed >= 25 && !idleDialogue2) {
      setIdleDialogue2(true);
      say("...500원도 안 아까워?", "worried");
    }
  }, [active, elapsed, idleDialogue1, idleDialogue2]);

  // Coupon check
  useEffect(() => {
    if (!active) return;
    if (couponCode.toUpperCase() === "NABI" && !couponApplied) {
      setCouponApplied(true);
      say("...어 그걸 어떻게 알았어? 에이 1원밖에 안 돼.", "shocked");
    }
  }, [active, couponCode, couponApplied]);

  const handleGalleryNav = useCallback((dir) => {
    setGalleryIdx(prev => {
      const next = (prev + dir + skins.length) % skins.length;
      return next;
    });
    if (!gallerySpoke) {
      setGallerySpoke(true);
      say("이 스킨 어때. 멋있지? ...나한테 어울리니까 당연히 멋있는 거야.", "smug");
    }
  }, [gallerySpoke, say]);

  const handleReviewNav = useCallback(() => {
    setReviewIdx(prev => (prev + 1) % reviews.length);
    if (!reviewSpoke) {
      setReviewSpoke(true);
      say("리뷰도 좋잖아. 다 실제 후기야. 내가 쓴 거 아니야.", "confident");
    }
  }, [reviewSpoke, say]);

  if (!active) return null;

  const skin = skins[galleryIdx];
  const review = reviews[reviewIdx];
  const finalPrice = couponApplied ? "₩499" : "₩500";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      background: "#fafafa",
      display: "flex", flexDirection: "column", alignItems: "center",
      overflow: "hidden", animation: "fadeIn 0.3s ease"
    }}>
      {/* Header */}
      <div style={{
        width: "100%", padding: "14px 0", textAlign: "center",
        background: "#fff", borderBottom: "1px solid #eee",
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)"
      }}>
        <div style={{ fontSize: 10, color: "#9c27b0", letterSpacing: 6, fontWeight: 600 }}>PREMIUM SHOP</div>
        <div style={{ fontSize: 16, fontWeight: 800, color: "#222", marginTop: 2 }}>
          Don't Press the Button — Premium Edition
        </div>
      </div>

      {/* Main content - scrollable area */}
      <div style={{
        flex: 1, width: "100%", maxWidth: 360, padding: "16px 20px",
        display: "flex", flexDirection: "column", gap: 16, overflowY: "auto"
      }}>
        {/* Product gallery */}
        <div style={{
          background: "#fff", borderRadius: 16, overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f0e8f5"
        }}>
          {/* Product image */}
          <div style={{
            height: 140, background: skin.color,
            display: "flex", alignItems: "center", justifyContent: "center",
            position: "relative"
          }}>
            <div style={{ fontSize: 56 }}>{skin.emoji}</div>
            <div style={{
              position: "absolute", top: 10, right: 10,
              background: "#9c27b0", color: "#fff",
              fontSize: 9, fontWeight: 700, padding: "3px 10px",
              borderRadius: 20, letterSpacing: 1
            }}>HOT</div>

            {/* Gallery nav */}
            <div onClick={() => handleGalleryNav(-1)} style={{
              position: "absolute", left: 8, top: "50%", transform: "translateY(-50%)",
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(255,255,255,0.8)", display: "flex",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 12, fontWeight: 800, color: "#333"
            }}>&lt;</div>
            <div onClick={() => handleGalleryNav(1)} style={{
              position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)",
              width: 28, height: 28, borderRadius: "50%",
              background: "rgba(255,255,255,0.8)", display: "flex",
              alignItems: "center", justifyContent: "center",
              cursor: "pointer", fontSize: 12, fontWeight: 800, color: "#333"
            }}>&gt;</div>

            {/* Dots */}
            <div style={{
              position: "absolute", bottom: 8, left: "50%", transform: "translateX(-50%)",
              display: "flex", gap: 6
            }}>
              {skins.map((_, i) => (
                <div key={i} style={{
                  width: 6, height: 6, borderRadius: "50%",
                  background: i === galleryIdx ? "#fff" : "rgba(255,255,255,0.4)"
                }} />
              ))}
            </div>
          </div>

          {/* Product info */}
          <div style={{ padding: "14px 16px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#222" }}>{skin.name}</div>
            <div style={{ fontSize: 11, color: "#888", marginTop: 2 }}>{skin.desc}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <span style={{ fontSize: 18, fontWeight: 800, color: "#9c27b0" }}>{finalPrice}</span>
              {couponApplied && (
                <span style={{ fontSize: 11, color: "#bbb", textDecoration: "line-through" }}>₩500</span>
              )}
            </div>
          </div>
        </div>

        {/* Star ratings */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "14px 16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f0e8f5"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#222" }}>구매 후기</div>
            <div style={{ display: "flex", gap: 2 }}>
              {[1,2,3,4,5].map(s => (
                <span key={s} style={{ fontSize: 14, color: "#ffc107" }}>★</span>
              ))}
              <span style={{ fontSize: 11, color: "#888", marginLeft: 4 }}>5.0</span>
            </div>
          </div>

          {/* Review card */}
          <div onClick={handleReviewNav} style={{
            marginTop: 10, padding: "10px 12px",
            background: "#f9f5ff", borderRadius: 10, cursor: "pointer",
            border: "1px solid #f0e8f5", transition: "background 0.2s"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
              <div style={{
                width: 20, height: 20, borderRadius: "50%",
                background: "#e1bee7", display: "flex", alignItems: "center",
                justifyContent: "center", fontSize: 9, color: "#7b1fa2", fontWeight: 800
              }}>{review.user[0]}</div>
              <span style={{ fontSize: 10, fontWeight: 700, color: "#555" }}>{review.user}</span>
              <span style={{ fontSize: 9, color: "#ffc107" }}>{"★".repeat(review.stars)}</span>
            </div>
            <div style={{ fontSize: 11, color: "#444", lineHeight: 1.5 }}>{review.text}</div>
            <div style={{ fontSize: 9, color: "#bbb", marginTop: 6, textAlign: "right" }}>
              탭하여 다음 후기 &gt;
            </div>
          </div>
        </div>

        {/* Coupon */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "14px 16px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.06)", border: "1px solid #f0e8f5"
        }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: "#222", marginBottom: 8 }}>쿠폰 코드</div>
          <div style={{ display: "flex", gap: 8 }}>
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              placeholder="쿠폰 코드 입력"
              style={{
                flex: 1, padding: "8px 12px", borderRadius: 10,
                border: "1.5px solid #e0d4f0", fontSize: 12,
                outline: "none", fontFamily: "'Noto Sans KR', sans-serif",
                background: couponApplied ? "#f3e5f5" : "#fff",
                color: "#333"
              }}
            />
            <div style={{
              padding: "8px 14px", borderRadius: 10,
              background: couponApplied ? "#4caf50" : "#9c27b0",
              color: "#fff", fontSize: 11, fontWeight: 700,
              cursor: "pointer", display: "flex", alignItems: "center",
              whiteSpace: "nowrap"
            }}>
              {couponApplied ? "적용됨" : "적용"}
            </div>
          </div>
          {couponApplied && (
            <div style={{ fontSize: 10, color: "#4caf50", marginTop: 6 }}>
              NABI 쿠폰 적용 완료! (-₩1 할인)
            </div>
          )}
        </div>

        {/* Stock counter */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          padding: "10px 0"
        }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: stock <= 1 ? "#e53935" : "#ff9800",
            animation: "pulse 1.5s ease infinite"
          }} />
          <span style={{ fontSize: 12, fontWeight: 700, color: stock <= 1 ? "#e53935" : "#ff9800" }}>
            한정 수량 {stock}개 남음
          </span>
        </div>

        {/* Purchase button */}
        <MiniNuclearButton label="결제" onPress={onComplete} />

        <div style={{ fontSize: 8, color: "#ccc", textAlign: "center", paddingBottom: 12 }}>
          결제 시 환불 불가 · 가상 상품 · 부가세 포함
        </div>

        {/* Skip button */}
        <SkipButton active={active} delay={10} onSkip={onDismiss} autoDismiss={25} />
      </div>
    </div>
  );
}
