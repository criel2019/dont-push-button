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
