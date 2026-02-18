// E01: 무례함 — 우클릭 컨텍스트 메뉴에서 나비 삭제
// 트리거: CRT 모니터의 나비를 우클릭 → "삭제" 선택
// main.jsx에서 contextMenu 상태 + ContextMenu 컴포넌트로 처리
// 이 파일은 E01 고유 연출 담당

function E01Rude({ active, onComplete, say, doShake }) {
  useEffect(() => {
    if (!active) return;
    say("어? 날 지우게?", "shocked");
    doShake();
    const t = setTimeout(() => {
      say("야! 감히 날 삭제해? 건방져!", "angry");
    }, 1500);
    return () => clearTimeout(t);
  }, [active]);

  if (!active) return null;
  return null;
}
