// E09: 식탐 — 케이크 클릭 → 버튼 위에 올리기
function E09Food({ active, onComplete, say }) {
  useEffect(() => {
    if (!active) return;
    say("맛있겠다... 먹고 싶지?", "teasing");
  }, [active]);

  if (!active) return null;
  return null;
}
