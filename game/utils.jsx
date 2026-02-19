// ============================================================
// utils.jsx — 유틸리티 함수
// ============================================================

function pickRandom(arr, lastRef) {
  if (!arr || arr.length === 0) return null;
  if (arr.length <= 1) return arr[0];
  let pick;
  do { pick = arr[Math.floor(Math.random() * arr.length)]; } while (pick === lastRef?.current && arr.length > 1);
  if (lastRef) lastRef.current = pick;
  return pick;
}

function clamp(val, min, max) { return Math.max(min, Math.min(max, val)); }
function lerp(a, b, t) { return a + (b - a) * t; }
function dist(x1, y1, x2, y2) { return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2); }

function loadCollected() {
  try {
    const s = localStorage.getItem(SAVE_KEY);
    if (!s) {
      // v2 마이그레이션
      const v2 = localStorage.getItem("dpb_collected_v2");
      if (v2) {
        const arr = JSON.parse(v2);
        localStorage.setItem(SAVE_KEY, JSON.stringify(arr));
        return arr;
      }
      return [];
    }
    return JSON.parse(s);
  } catch { return []; }
}

function saveCollected(arr) {
  localStorage.setItem(SAVE_KEY, JSON.stringify(arr));
}

function preloadNaviSprite(emotion) {
  const img = new Image();
  img.src = NAVI_SPRITES[emotion];
  return img;
}

// Preload idle immediately
preloadNaviSprite("idle");

// ── 반응형 훅 (모바일 대응) ──
const DESIGN_HEIGHT = 600;

function useResponsive() {
  const [state, setState] = useState(() => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const shortSide = Math.min(w, h);
    const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && shortSide < 500;
    const scale = Math.min(1, h / DESIGN_HEIGHT);
    return { isMobile, scale: isMobile ? scale : 1, isPortrait: h > w };
  });

  useEffect(() => {
    const update = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const shortSide = Math.min(w, h);
      const isMobile = ('ontouchstart' in window || navigator.maxTouchPoints > 0) && shortSide < 500;
      const scale = Math.min(1, h / DESIGN_HEIGHT);
      setState({ isMobile, scale: isMobile ? scale : 1, isPortrait: h > w });
    };
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", () => setTimeout(update, 200));
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return state;
}

function useLongPress(callback, ms = 600) {
  const timerRef = useRef(null);
  const callbackRef = useRef(callback);
  callbackRef.current = callback;
  const touchStartPos = useRef(null);
  const firedRef = useRef(false);

  const clear = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const onTouchStart = useCallback((e) => {
    firedRef.current = false;
    const touch = e.touches[0];
    touchStartPos.current = { x: touch.clientX, y: touch.clientY };
    clear();
    timerRef.current = setTimeout(() => {
      const t = touchStartPos.current;
      if (t) callbackRef.current(t.x, t.y);
      firedRef.current = true;
      timerRef.current = null;
    }, ms);
  }, [ms, clear]);

  const onTouchMove = useCallback((e) => {
    if (!timerRef.current) return;
    const touch = e.touches[0];
    const start = touchStartPos.current;
    if (start && dist(touch.clientX, touch.clientY, start.x, start.y) > 10) {
      clear();
    }
  }, [clear]);

  const onTouchEnd = useCallback((e) => {
    clear();
    if (firedRef.current) {
      e.preventDefault(); // 합성 click 이벤트 차단 — 메뉴 즉시 닫힘 방지
      firedRef.current = false;
    }
  }, [clear]);

  useEffect(() => () => clear(), [clear]);

  return { onTouchStart, onTouchEnd, onTouchMove };
}
