// E10: 떡락 — 주식 트레이딩 시뮬레이션
function E10Stock({ active, onComplete, say, frame }) {
  const [elapsed, setElapsed] = useState(0);
  const [balance, setBalance] = useState(1000000);
  const [holdings, setHoldings] = useState(0);
  const [avgBuyPrice, setAvgBuyPrice] = useState(0);
  const [priceHistory, setPriceHistory] = useState([]);
  const [flashColor, setFlashColor] = useState(null);
  const [timedSaid, setTimedSaid] = useState({});
  const prevPriceRef = useRef(0);

  useEffect(() => {
    if (!active) {
      setElapsed(0);
      setBalance(1000000);
      setHoldings(0);
      setAvgBuyPrice(0);
      setPriceHistory([]);
      setFlashColor(null);
      setTimedSaid({});
      prevPriceRef.current = 0;
      return;
    }
    say("이거 봐! 떡상 중이잖아! 빨리빨리!!", "excited");
    const iv = setInterval(() => setElapsed(p => p + 1), 1000);
    return () => clearInterval(iv);
  }, [active]);

  // Price simulation
  const getPrice = (t) => {
    if (t <= 0) return 10000;
    // Rising phase
    if (t < 8) return Math.floor(10000 + t * 1200 + Math.sin(t * 0.8) * 500);
    // Volatile phase
    if (t < 18) {
      const base = 19600 + Math.sin(t * 1.2) * 4000 + Math.cos(t * 0.7) * 2000;
      return Math.floor(Math.max(5000, base + (Math.sin(t * 3) * 1500)));
    }
    // Crash phase
    const crashT = t - 18;
    const base = 15000 - crashT * 1800 + Math.sin(t * 2) * 800;
    return Math.floor(Math.max(800, base));
  };

  const currentPrice = getPrice(elapsed);

  // Update price history
  useEffect(() => {
    if (!active) return;
    setPriceHistory(prev => {
      const next = [...prev, currentPrice];
      if (next.length > 30) next.shift();
      return next;
    });

    // Flash effect on price change
    if (prevPriceRef.current > 0) {
      if (currentPrice > prevPriceRef.current) {
        setFlashColor("#3fb950");
        setTimeout(() => setFlashColor(null), 300);
      } else if (currentPrice < prevPriceRef.current) {
        setFlashColor("#e8573d");
        setTimeout(() => setFlashColor(null), 300);
      }
    }
    prevPriceRef.current = currentPrice;
  }, [elapsed, active]);

  // Timed dialogues
  useEffect(() => {
    if (!active) return;
    if (elapsed === 15 && !timedSaid[15]) {
      say("...", "bored");
      setTimedSaid(p => ({ ...p, 15: true }));
    }
    if (elapsed === 20 && !timedSaid[20]) {
      say("...재밌어?", "bored");
      setTimedSaid(p => ({ ...p, 20: true }));
    }
    if (elapsed === 25 && !timedSaid[25]) {
      say("아... 뭐 그래. 누르든 말든 알아서 해.", "bored");
      setTimedSaid(p => ({ ...p, 25: true }));
    }
  }, [elapsed, active]);

  if (!active) return null;

  const totalValue = holdings * currentPrice;
  const totalInvested = holdings * avgBuyPrice;
  const pnl = totalValue - totalInvested;
  const pnlPct = totalInvested > 0 ? ((pnl / totalInvested) * 100).toFixed(1) : "0.0";
  const isProfit = pnl > 0;
  const isLoss = pnl < 0;

  const buyUnit = Math.max(1, Math.floor(balance / currentPrice));

  const handleBuy = (e) => {
    e.stopPropagation();
    if (balance < currentPrice) return;
    const qty = 1;
    const cost = qty * currentPrice;
    if (cost > balance) return;
    const newHoldings = holdings + qty;
    const newAvg = (holdings * avgBuyPrice + cost) / newHoldings;
    setBalance(prev => prev - cost);
    setHoldings(newHoldings);
    setAvgBuyPrice(newAvg);
    say("오, 됐어?! 더 사!!", "excited");
  };

  const handleSell = (e) => {
    e.stopPropagation();
    if (holdings <= 0) return;
    const revenue = currentPrice;
    setBalance(prev => prev + revenue);
    setHoldings(prev => prev - 1);
    if (currentPrice > avgBuyPrice) {
      say("왜 팔아?! 아까워!! 아 답답해!!", "angry");
    } else {
      say("응, 그럴 줄 알았어.", "smug");
    }
  };

  // Chart rendering
  const chartH = 60;
  const chartW = 220;
  const prices = priceHistory.length > 1 ? priceHistory : [10000, 10000];
  const maxP = Math.max(...prices);
  const minP = Math.min(...prices);
  const range = maxP - minP || 1;

  const points = prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * chartW;
    const y = chartH - ((p - minP) / range) * (chartH - 8) - 4;
    return `${x},${y}`;
  }).join(" ");

  const fillPath = `M0,${chartH} ` + prices.map((p, i) => {
    const x = (i / (prices.length - 1)) * chartW;
    const y = chartH - ((p - minP) / range) * (chartH - 8) - 4;
    return `L${x},${y}`;
  }).join(" ") + ` L${chartW},${chartH} Z`;

  const lastPrice = prices[prices.length - 1];
  const firstPrice = prices[0];
  const chartColor = lastPrice >= firstPrice ? "#3fb950" : "#e8573d";

  const btnColor = ENDINGS[10]?.btnColor || "#e8573d";

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      background: "linear-gradient(170deg, #06090f 0%, #0a1020 50%, #0c1428 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease"
    }}>
      {/* Grid background */}
      <div style={{
        position: "absolute", inset: 0, opacity: 0.015,
        backgroundImage: "linear-gradient(rgba(63,185,80,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(63,185,80,0.5) 1px, transparent 1px)",
        backgroundSize: "80px 80px", pointerEvents: "none"
      }} />

      {/* Flash overlay */}
      {flashColor && (
        <div style={{
          position: "absolute", inset: 0, pointerEvents: "none",
          background: flashColor === "#3fb950" ? "rgba(63,185,80,0.06)" : "rgba(232,87,61,0.06)",
          transition: "background 0.3s"
        }} />
      )}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center", width: 280 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
          <div style={{
            width: 5, height: 5, borderRadius: "50%",
            background: "#3fb950", boxShadow: "0 0 6px #3fb95088"
          }} />
          <span style={{
            color: "#3a4a5a", fontSize: 10, letterSpacing: 4,
            fontFamily: "monospace", fontWeight: 600
          }}>
            KOSPI · MEME · NAVI
          </span>
        </div>

        {/* Coin name */}
        <div style={{
          fontSize: 14, fontWeight: 800, color: "#5a6a7a",
          letterSpacing: 3, marginBottom: 4
        }}>
          나비코인 (NABI)
        </div>

        {/* Current price */}
        <div style={{ marginBottom: 4 }}>
          <span style={{
            color: currentPrice >= 10000 ? "#3fb950" : "#e8573d",
            fontSize: 42, fontWeight: 800,
            fontFamily: "'SF Mono', monospace",
            textShadow: `0 0 40px ${currentPrice >= 10000 ? "rgba(63,185,80,0.15)" : "rgba(232,87,61,0.15)"}`
          }}>
            ₩{currentPrice.toLocaleString()}
          </span>
        </div>

        {/* Price change */}
        <div style={{
          color: currentPrice >= 10000 ? "#3fb95088" : "#e8573d88",
          fontSize: 12, marginBottom: 12, fontFamily: "monospace"
        }}>
          {currentPrice >= 10000 ? "+" : ""}{((currentPrice - 10000) / 100).toFixed(1)}%
        </div>

        {/* Chart */}
        <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: chartW, height: chartH, marginBottom: 16 }}>
          <defs>
            <linearGradient id="stockFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={`${chartColor}22`} />
              <stop offset="100%" stopColor={`${chartColor}00`} />
            </linearGradient>
          </defs>
          {[15, 30, 45].map(y => (
            <line key={y} x1="0" y1={y} x2={chartW} y2={y}
              stroke="rgba(63,185,80,0.05)" strokeWidth="0.5" />
          ))}
          <path d={fillPath} fill="url(#stockFill)" />
          <polyline points={points} fill="none" stroke={chartColor}
            strokeWidth="1.5" strokeLinecap="round" />
          {prices.length > 0 && (() => {
            const lx = chartW;
            const ly = chartH - ((prices[prices.length - 1] - minP) / range) * (chartH - 8) - 4;
            return (
              <circle cx={lx} cy={ly} r="3" fill={chartColor}>
                <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite" />
              </circle>
            );
          })()}
        </svg>

        {/* Balance & Holdings */}
        <div style={{
          display: "flex", gap: 16, marginBottom: 12, width: "100%"
        }}>
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.03)",
            borderRadius: 10, padding: "10px 12px",
            border: "1px solid rgba(255,255,255,0.06)"
          }}>
            <div style={{ fontSize: 9, color: "#4a5a6a", letterSpacing: 2, marginBottom: 4 }}>잔고</div>
            <div style={{ fontSize: 13, color: "#8a9aaa", fontWeight: 700, fontFamily: "monospace" }}>
              ₩{balance.toLocaleString()}
            </div>
          </div>
          <div style={{
            flex: 1, background: "rgba(255,255,255,0.03)",
            borderRadius: 10, padding: "10px 12px",
            border: "1px solid rgba(255,255,255,0.06)"
          }}>
            <div style={{ fontSize: 9, color: "#4a5a6a", letterSpacing: 2, marginBottom: 4 }}>보유</div>
            <div style={{ fontSize: 13, color: "#8a9aaa", fontWeight: 700, fontFamily: "monospace" }}>
              {holdings} NABI
            </div>
          </div>
        </div>

        {/* P&L */}
        {holdings > 0 && (
          <div style={{
            width: "100%", background: isProfit ? "rgba(63,185,80,0.06)" : isLoss ? "rgba(232,87,61,0.06)" : "rgba(255,255,255,0.03)",
            borderRadius: 10, padding: "8px 12px", marginBottom: 12,
            border: `1px solid ${isProfit ? "rgba(63,185,80,0.15)" : isLoss ? "rgba(232,87,61,0.15)" : "rgba(255,255,255,0.06)"}`,
            textAlign: "center"
          }}>
            <span style={{ fontSize: 9, color: "#4a5a6a", letterSpacing: 2 }}>평가손익 </span>
            <span style={{
              fontSize: 14, fontWeight: 800, fontFamily: "monospace",
              color: isProfit ? "#3fb950" : isLoss ? "#e8573d" : "#8a9aaa"
            }}>
              {isProfit ? "+" : ""}{pnl.toLocaleString()}원 ({isProfit ? "+" : ""}{pnlPct}%)
            </span>
          </div>
        )}

        {/* Buy / Sell buttons */}
        <div style={{ display: "flex", gap: 10, width: "100%", marginBottom: 16 }}>
          <div
            onClick={handleBuy}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              background: balance >= currentPrice ? "rgba(63,185,80,0.15)" : "rgba(63,185,80,0.05)",
              border: "1px solid rgba(63,185,80,0.2)",
              color: balance >= currentPrice ? "#3fb950" : "#3fb95044",
              fontSize: 14, fontWeight: 800, textAlign: "center",
              cursor: balance >= currentPrice ? "pointer" : "not-allowed",
              letterSpacing: 2, transition: "all 0.15s"
            }}
            onMouseEnter={(e) => { if (balance >= currentPrice) e.currentTarget.style.background = "rgba(63,185,80,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = balance >= currentPrice ? "rgba(63,185,80,0.15)" : "rgba(63,185,80,0.05)"; }}
          >
            매수
          </div>
          <div
            onClick={handleSell}
            style={{
              flex: 1, padding: "10px 0", borderRadius: 10,
              background: holdings > 0 ? "rgba(232,87,61,0.15)" : "rgba(232,87,61,0.05)",
              border: "1px solid rgba(232,87,61,0.2)",
              color: holdings > 0 ? "#e8573d" : "#e8573d44",
              fontSize: 14, fontWeight: 800, textAlign: "center",
              cursor: holdings > 0 ? "pointer" : "not-allowed",
              letterSpacing: 2, transition: "all 0.15s"
            }}
            onMouseEnter={(e) => { if (holdings > 0) e.currentTarget.style.background = "rgba(232,87,61,0.25)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = holdings > 0 ? "rgba(232,87,61,0.15)" : "rgba(232,87,61,0.05)"; }}
          >
            매도
          </div>
        </div>

        {/* ALL IN button */}
        <div
          onClick={(e) => { e.stopPropagation(); onComplete(); }}
          style={{
            width: "100%", padding: "14px 0", borderRadius: 12,
            background: btnColor,
            color: "#fff", fontSize: 16, fontWeight: 800,
            textAlign: "center", cursor: "pointer",
            letterSpacing: 4,
            boxShadow: `0 8px 32px ${btnColor}44, 0 0 40px ${btnColor}22`,
            animation: "glowPulse 1.5s ease infinite",
            border: "1px solid rgba(255,255,255,0.1)"
          }}
        >
          풀매수 (ALL IN)
        </div>

        {/* Disclaimer */}
        <div style={{
          color: "#1a2233", fontSize: 8, marginTop: 10,
          fontFamily: "monospace", letterSpacing: 1
        }}>
          투자는 본인 책임입니다
        </div>
      </div>
    </div>
  );
}
