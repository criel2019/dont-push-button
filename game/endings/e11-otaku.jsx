// E11: 오타쿠 — 고양이 귀 나비 + 호감도 게이지 + 부위 클릭
function E11Otaku({ active, onComplete, say }) {
  const [affection, setAffection] = useState(0);
  const [showComplete, setShowComplete] = useState(false);
  const [lastZone, setLastZone] = useState(null);
  const [milestones, setMilestones] = useState({});
  const [heartBurst, setHeartBurst] = useState(false);
  const [shakeZone, setShakeZone] = useState(null);

  useEffect(() => {
    if (!active) {
      setAffection(0);
      setShowComplete(false);
      setLastZone(null);
      setMilestones({});
      setHeartBurst(false);
      setShakeZone(null);
      return;
    }
    say("냥~\u2661 ...뭐 보고 그래. 귀엽잖아.", "confident");
  }, [active]);

  // Milestone checks
  useEffect(() => {
    if (!active) return;
    if (affection >= 25 && !milestones[25]) {
      say("더 해줘. ...해주라는 게 아니라 해도 된다는 거야.", "pouty");
      setMilestones(p => ({ ...p, 25: true }));
    } else if (affection >= 50 && !milestones[50]) {
      say("주인... 아 아니. 아무것도 아니야.", "shy");
      setMilestones(p => ({ ...p, 50: true }));
    } else if (affection >= 75 && !milestones[75]) {
      say("그만해도 돼. ...그만하라는 게 아니라 그만해도 된다는 거야.", "smug");
      setMilestones(p => ({ ...p, 75: true }));
    } else if (affection >= 100 && !milestones[100]) {
      say("...한 번만. 쓰다듬어줄래?", "shy");
      setMilestones(p => ({ ...p, 100: true }));
      setShowComplete(true);
    }
  }, [affection, active, milestones]);

  if (!active) return null;

  const handleZoneClick = (zone, e) => {
    e.stopPropagation();
    setLastZone(zone);

    switch (zone) {
      case "head":
        setAffection(p => Math.min(100, p + 10));
        say("...그래 거기 좋아.", "shy");
        setHeartBurst(true);
        setTimeout(() => setHeartBurst(false), 600);
        break;
      case "cheek":
        setAffection(p => Math.min(100, p + 8));
        say("흐응...", "shy");
        setHeartBurst(true);
        setTimeout(() => setHeartBurst(false), 600);
        break;
      case "belly":
        setAffection(p => Math.min(100, p + 15));
        say("...이건 특별 허가야. 함부로 하지 마.", "shy");
        setHeartBurst(true);
        setTimeout(() => setHeartBurst(false), 600);
        break;
      case "tail":
        setAffection(p => Math.max(0, p - 20));
        say("꼬리 만지지 말라고 했지!! 몇 번을 말해!!", "angry");
        setShakeZone("tail");
        setTimeout(() => setShakeZone(null), 500);
        break;
    }
  };

  const btnColor = ENDINGS[11]?.btnColor || "#ff8fab";

  // Heart milestone markers
  const milestonePositions = [25, 50, 75, 100];

  return (
    <div style={{
      position: "absolute", inset: 0, zIndex: 400,
      background: "linear-gradient(180deg, #2e1a2e, #1a0e1a 40%, #150a18)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      animation: "fadeIn 0.3s ease"
    }}>
      {/* Pink ambient glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        background: "radial-gradient(ellipse at 50% 40%, rgba(255,143,171,0.08), transparent 70%)"
      }} />

      {/* Floating hearts background */}
      {heartBurst && (
        <>
          {[...Array(6)].map((_, i) => (
            <div key={i} style={{
              position: "absolute",
              left: `${35 + Math.random() * 30}%`,
              top: `${30 + Math.random() * 30}%`,
              fontSize: 14 + Math.random() * 10,
              animation: "float 1.5s ease forwards",
              opacity: 0.6,
              pointerEvents: "none",
              zIndex: 410
            }}>
              {pickRandom(["💕", "💗", "💖", "✨"])}
            </div>
          ))}
        </>
      )}

      <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", alignItems: "center" }}>
        {/* Affection label */}
        <div style={{
          fontSize: 13, color: "#ff8fab", fontWeight: 800,
          letterSpacing: 3, marginBottom: 8
        }}>
          호감도
        </div>

        {/* Affection bar */}
        <div style={{
          width: 220, height: 10, borderRadius: 5,
          background: "rgba(255,143,171,0.12)",
          overflow: "hidden", position: "relative", marginBottom: 4,
          border: "1px solid rgba(255,143,171,0.15)"
        }}>
          <div style={{
            width: `${affection}%`, height: "100%",
            background: "linear-gradient(90deg, #ff8fab, #e84393, #ff6b9d)",
            borderRadius: 5, transition: "width 0.3s ease",
            boxShadow: affection > 0 ? "0 0 12px rgba(232,67,147,0.4)" : "none"
          }} />
          {/* Milestone hearts on bar */}
          {milestonePositions.map(pos => (
            <div key={pos} style={{
              position: "absolute", top: -8, left: `${pos}%`, transform: "translateX(-50%)",
              fontSize: 10, opacity: affection >= pos ? 1 : 0.25,
              transition: "opacity 0.3s",
              filter: affection >= pos ? "none" : "grayscale(1)"
            }}>
              {affection >= pos ? "💗" : "🤍"}
            </div>
          ))}
        </div>

        {/* Percentage */}
        <div style={{
          fontSize: 11, color: "#ff8fab88", marginBottom: 20, fontFamily: "monospace"
        }}>
          {Math.min(100, affection)}%
        </div>

        {/* Cat Navi illustration */}
        <div style={{
          position: "relative", width: 200, height: 180,
          marginBottom: 16
        }}>
          {/* Cat face center */}
          <div style={{
            position: "absolute", left: "50%", top: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: 64,
            animation: "gentleBob 3s ease infinite"
          }}>
            😺
          </div>

          {/* Cat ears */}
          <div style={{
            position: "absolute", left: "32%", top: "12%",
            fontSize: 28, transform: "rotate(-20deg)",
            animation: "gentleBob 2.5s ease infinite 0.2s"
          }}>🎀</div>
          <div style={{
            position: "absolute", right: "32%", top: "12%",
            fontSize: 28, transform: "rotate(20deg)",
            animation: "gentleBob 2.5s ease infinite 0.5s"
          }}>🎀</div>

          {/* Clickable zone labels */}
          {/* Head */}
          <div onClick={(e) => handleZoneClick("head", e)}
            style={{
              position: "absolute", left: "50%", top: 0,
              transform: "translateX(-50%)",
              padding: "6px 16px", borderRadius: 20,
              background: lastZone === "head" ? "rgba(255,143,171,0.3)" : "rgba(255,143,171,0.12)",
              border: "1px solid rgba(255,143,171,0.3)",
              color: "#ff8fab", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1,
              transition: "all 0.2s",
              animation: lastZone === "head" ? "popIn 0.3s ease" : "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,143,171,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = lastZone === "head" ? "rgba(255,143,171,0.3)" : "rgba(255,143,171,0.12)"}
          >
            머리
          </div>

          {/* Cheek - left */}
          <div onClick={(e) => handleZoneClick("cheek", e)}
            style={{
              position: "absolute", left: 0, top: "50%",
              transform: "translateY(-50%)",
              padding: "6px 14px", borderRadius: 20,
              background: lastZone === "cheek" ? "rgba(255,143,171,0.3)" : "rgba(255,143,171,0.12)",
              border: "1px solid rgba(255,143,171,0.3)",
              color: "#ff8fab", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1,
              transition: "all 0.2s",
              animation: lastZone === "cheek" ? "popIn 0.3s ease" : "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,143,171,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = lastZone === "cheek" ? "rgba(255,143,171,0.3)" : "rgba(255,143,171,0.12)"}
          >
            볼
          </div>

          {/* Belly - bottom */}
          <div onClick={(e) => handleZoneClick("belly", e)}
            style={{
              position: "absolute", left: "50%", bottom: 0,
              transform: "translateX(-50%)",
              padding: "6px 14px", borderRadius: 20,
              background: lastZone === "belly" ? "rgba(255,143,171,0.3)" : "rgba(255,143,171,0.12)",
              border: "1px solid rgba(255,143,171,0.3)",
              color: "#ff8fab", fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1,
              transition: "all 0.2s",
              animation: lastZone === "belly" ? "popIn 0.3s ease" : "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,143,171,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = lastZone === "belly" ? "rgba(255,143,171,0.3)" : "rgba(255,143,171,0.12)"}
          >
            배
          </div>

          {/* Tail - right */}
          <div onClick={(e) => handleZoneClick("tail", e)}
            style={{
              position: "absolute", right: 0, top: "50%",
              transform: "translateY(-50%)",
              padding: "6px 14px", borderRadius: 20,
              background: lastZone === "tail" ? "rgba(232,87,61,0.25)" : "rgba(255,143,171,0.12)",
              border: `1px solid ${lastZone === "tail" ? "rgba(232,87,61,0.4)" : "rgba(255,143,171,0.3)"}`,
              color: lastZone === "tail" ? "#e8573d" : "#ff8fab",
              fontSize: 12, fontWeight: 700,
              cursor: "pointer", letterSpacing: 1,
              transition: "all 0.2s",
              animation: shakeZone === "tail" ? "shake 0.15s ease 3" : "none"
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,143,171,0.3)"}
            onMouseLeave={(e) => e.currentTarget.style.background = lastZone === "tail" ? "rgba(232,87,61,0.25)" : "rgba(255,143,171,0.12)"}
          >
            꼬리
          </div>
        </div>

        {/* Zone hints */}
        <div style={{
          fontSize: 10, color: "#ff8fab44", letterSpacing: 2, marginBottom: 16
        }}>
          터치할 곳을 선택하세요
        </div>

        {/* Skip button */}
        <SkipButton active={active && !showComplete} delay={12} onSkip={onComplete} autoDismiss={35} />

        {/* Complete button */}
        {showComplete && (
          <div
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            style={{
              padding: "14px 36px", borderRadius: 24,
              background: `linear-gradient(135deg, ${btnColor}, #e84393)`,
              color: "#fff", fontSize: 16, fontWeight: 800,
              cursor: "pointer", letterSpacing: 3,
              boxShadow: `0 8px 32px ${btnColor}55, 0 0 40px rgba(232,67,147,0.2)`,
              animation: "glowPulse 1.5s ease infinite, popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
              border: "1px solid rgba(255,255,255,0.2)",
              position: "relative", overflow: "hidden"
            }}
          >
            <span style={{ position: "relative", zIndex: 1 }}>쓰다듬기</span>
            <span style={{
              position: "absolute", left: -4, top: -2, fontSize: 14,
              animation: "float 1.2s ease infinite", opacity: 0.7
            }}>💕</span>
            <span style={{
              position: "absolute", right: -2, bottom: -2, fontSize: 12,
              animation: "float 1.5s ease infinite 0.3s", opacity: 0.6
            }}>✨</span>
          </div>
        )}
      </div>
    </div>
  );
}
