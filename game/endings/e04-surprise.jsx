// E04: 기습 — 탭 이탈 후 복귀
// 트리거: document.visibilitychange (main.jsx)

function E04Surprise({ active, onComplete, say }) {
  useEffect(() => {
    if (!active) return;
    say("...엇?! 언, 언제 돌아온 거야?!", "shocked");
  }, [active]);

  if (!active) return null;
  return null;
}
