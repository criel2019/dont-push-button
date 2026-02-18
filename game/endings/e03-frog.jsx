// E03: 청개구리 — 버튼 위에 마우스 반복 호버
// 트리거: main.jsx의 hoverCount >= HOVER_THRESHOLD
// 이 파일은 트리거 후 연출

function E03Frog({ active, onComplete, say }) {
  useEffect(() => {
    if (!active) return;
    say("누르지 마. 진짜 누르지 마.", "idle");
  }, [active]);

  if (!active) return null;
  return null;
}
