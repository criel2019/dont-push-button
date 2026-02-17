const { useState, useEffect, useRef, useCallback } = React;

// ============================================================
// DON'T PRESS THE BUTTON — FULL EDITION (21 Endings)
// 오퍼레이터 "나비" (자칭 천재 내비게이터)
// PREMIUM VISUAL EDITION v2
// ============================================================

const SAVE_KEY = "dpb_collected_v2";
const IDLE_LIMIT = 180;
const BANNER_DELAY = 18000;
const HOVER_THRESHOLD = 8;
const RAPID_CLICK_THRESHOLD = 15;
const RAPID_CLICK_WINDOW = 3000;
const DOOR_KNOCK_THRESHOLD = 5;

// ── 엔딩 데이터 (21개) ──
const ENDINGS = {
  1:  { name:"무례함",     phase:"간보기", emoji:"💀", eventText:"어? 날 지우게?", eventEmo:"shocked",
        btn:"삭제 확인", btnColor:"#e8573d", over1:"야! 감히 날 삭제해? 건방져!", over2:"(강제 종료)" },
  2:  { name:"마시멜로",   phase:"간보기", emoji:"🍡", eventText:"1분 버티기 시작! 참아봐~", eventEmo:"smug",
        btn:"포기", btnColor:"#e88b3d", over1:"땡! 1분도 못 참냐?", over2:"평생 마시멜로 1개만 먹어라~" },
  3:  { name:"청개구리",   phase:"간보기", emoji:"🐸", eventText:"누르지 마. 진짜 누르지 마.", eventEmo:"idle",
        btn:"누르지 마", btnColor:"#2e9e5a", over1:"하지 말라면 더 하고 싶지?", over2:"딱 초딩 심보네~" },
  4:  { name:"기습",       phase:"간보기", emoji:"😲", eventText:"...엇?! 언, 언제 돌아온 거야?!", eventEmo:"shocked",
        btn:"지금이다!", btnColor:"#e88b3d", over1:"앗! 비겁하게 안 볼 때 누르냐?", over2:"쫄보 녀석~" },
  5:  { name:"낚시",       phase:"장난",   emoji:"🎣", eventText:"★ 100만원 당첨!! ★", eventEmo:"excited",
        btn:"수령", btnColor:"#ffc107", over1:"이걸 믿냐? 능지 처참~", over2:"ㅋㅋㅋ" },
  6:  { name:"자본주의",   phase:"장난",   emoji:"💳", eventText:"✦ PREMIUM 멤버십 해제 완료 ✦", eventEmo:"smug",
        btn:"결제", btnColor:"#9c27b0", over1:"어머, 500원도 없네?", over2:"알바 좀 해~" },
  7:  { name:"블루스크린", phase:"장난",   emoji:"💻", eventText:"시스템 오류 발생...", eventEmo:"shocked",
        btn:"복구", btnColor:"#1565c0", over1:"속았지? ㅋㅋㅋ", over2:"똥컴 바꿀 때 안 됐냐?" },
  8:  { name:"피지컬",     phase:"장난",   emoji:"🏃", eventText:"버튼이 도망쳤다?!", eventEmo:"excited",
        btn:"잡아봐", btnColor:"#e8573d", over1:"헐... 이걸 굳이 쫓아와서 누르네?", over2:"게임 폐인 인증~" },
  9:  { name:"식탐",       phase:"욕망",   emoji:"🍰", eventText:"맛있겠다... 먹고 싶지?", eventEmo:"idle",
        btn:"먹기", btnColor:"#e8a05d", over1:"너도 먹고 싶었어? 돼지~", over2:"살이나 빼~" },
  10: { name:"떡락",       phase:"욕망",   emoji:"📉", eventText:"지금이야! 인생 역전!", eventEmo:"excited",
        btn:"풀매수 (Buy)", btnColor:"#e8573d", over1:"와... 역사상 최고점에 물리네?", over2:"인간 지표야? 덕분에 난 탈출했어~ 꺼억~" },
  11: { name:"오타쿠",     phase:"욕망",   emoji:"😾", eventText:"냥~♡", eventEmo:"excited",
        btn:"쓰다듬기", btnColor:"#ff8fab", over1:"우웩, 이런 취향?", over2:"기분 나빠. 저리 가!" },
  12: { name:"경찰서",     phase:"욕망",   emoji:"🚔", eventText:"번호 줄까~?", eventEmo:"smug",
        btn:"Call", btnColor:"#43a047", over1:"네 경찰이죠?", over2:"여기 스토커 있어요!" },
  13: { name:"쫄보",       phase:"위기",   emoji:"😱", eventText:"3... 2... 1...", eventEmo:"shocked",
        btn:"긴급 정지", btnColor:"#e8573d", over1:"푸하하! 쫄았어?", over2:"그냥 숫자 세는 건데~ 겁쟁이~" },
  14: { name:"뉴스 속보",  phase:"위기",   emoji:"☢️", eventText:"[속보] 핵전쟁 발발!", eventEmo:"shocked",
        btn:"발사", btnColor:"#b71c1c", over1:"어... 뉴스 진짜였네?", over2:"(같이 사망)" },
  15: { name:"사이코패스", phase:"위기",   emoji:"😈", eventText:"이거 누르면 나 죽어 ㅠㅠ", eventEmo:"cry",
        btn:"확인", btnColor:"#424242", over1:"와... 우는데 누르냐?", over2:"너 사이코패스지?" },
  16: { name:"수면",       phase:"히든",   emoji:"😴", eventText:"Zzz... Zzz...", eventEmo:"idle",
        btn:"깨우기", btnColor:"#5c6bc0", over1:"으아악!! 깜짝이야!", over2:"잠 좀 자자 인간아!" },
  17: { name:"무한 루프",  phase:"히든",   emoji:"🔄", eventText:"처음으로 돌아갈래?", eventEmo:"idle",
        btn:"Reset", btnColor:"#78909c", over1:"", over2:"" },
  18: { name:"현실 만남",  phase:"히든",   emoji:"🚪", eventText:"누구야...?", eventEmo:"shocked",
        btn:"Enter", btnColor:"#8d6e63", over1:"아... 진짜 눌러버렸네?", over2:"안녕?" },
  19: { name:"교대",       phase:"히든",   emoji:"🔀", eventText:"관리자 권한 넘길래?", eventEmo:"smug",
        btn:"수락", btnColor:"#6a1b9a", over1:"자, 이제 네 차례야.", over2:"(플레이어 빨려 들어감)" },
  20: { name:"암전",       phase:"진 엔딩", emoji:"🌑", eventText:"재미없어. 나 갈래.", eventEmo:"pouty",
        btn:"비활성화", btnColor:"#424242", over1:"", over2:"(영원한 고립)" },
  21: { name:"크레딧",     phase:"특전",   emoji:"🎬", eventText:"", eventEmo:"excited",
        btn:"Credit", btnColor:"#ffd700", over1:"플레이 해주셔서 감사합니다!", over2:"" },
};

const NAVI_IDLE = [
  { t:"뭐 해~ 빨리 이것저것 만져봐~", e:"idle" },
  { t:"이 방에 비밀이 많거든~ 알려줄 생각 없지만!", e:"smug" },
  { t:"버튼은 누르면 안 돼! ...아마?", e:"pouty" },
  { t:"아 심심해~ 뭐 좀 재밌는 거 해봐!", e:"pouty" },
  { t:"여기저기 클릭해봐. 뭔가 있을지도?", e:"idle" },
  { t:"후후, 네가 뭘 할지 다 보고 있다~", e:"smug" },
  { t:"건드리면 안 되는 거 건드리면 어떡하려고~?", e:"smug" },
  { t:"나는 천재 내비게이터 나비! 힌트는 안 줘~", e:"excited" },
  { t:"왼쪽에 문이 있네... 어? 아무 말도 안 했어!", e:"shocked" },
  { t:"저 시계 만지지 마... 라고 하면 만질 거지?", e:"pouty" },
  { t:"TV 좀 켜줘. 아 아니야, 그냥 그래봤어.", e:"idle" },
  { t:"저 지갑 안에 뭐가 있을까~?", e:"smug" },
];

const NAVI_DISCOVER = [
  { t:"?! 잠깐, 거기 어떻게 찾은 거야?!", e:"shocked" },
  { t:"오호~ 뭔가 찾은 거야? 나도 몰랐던 건데~", e:"excited" },
  { t:"헐... 거기 만지면 안 되는... 아, 뭐 상관없지!", e:"shocked" },
];

// ── 스테이지 시스템 상수 ──
const STAGE_COUNT = 5;
const STAGE_DURATIONS = [0, 60, 90, 120, 90, 180];
const STAGE_NAMES = ["", "간보기", "장난", "욕망", "위기", "히든"];
const STAGE_SUBTITLES = ["", "Prelim", "Prank", "Desire", "Crisis", "Hidden"];
const STAGE_COLORS = ["", "#e88b3d", "#e8573d", "#e84393", "#c62828", "#5c6bc0"];

const STAGE_OBJECT_SCHEDULE = {
  1: [
    { at: 5, objects: [2] },
    { at: 15, objects: [1] },
    { at: 30, objects: [3] },
    { at: 45, objects: [4] },
  ],
  2: [
    { at: 5, objects: [5] },
    { at: 25, objects: [6] },
    { at: 50, objects: [7] },
    { at: 70, objects: [8] },
  ],
  3: [
    { at: 10, objects: [9] },
    { at: 40, objects: [10] },
    { at: 70, objects: [11] },
    { at: 95, objects: [12] },
  ],
  4: [
    { at: 10, objects: [13] },
    { at: 40, objects: [14] },
    { at: 70, objects: [15] },
  ],
  5: [
    { at: 20, objects: [16] },
    { at: 60, objects: [17] },
    { at: 120, objects: [18] },
    { at: 150, objects: [19] },
  ],
};

const WARNING_STEPS = { 15: 3 };

const STAGE_DIALOGUE = {
  1: [
    { at: 0, t: "첫 번째 시험이야! 60초 동안 참아봐~", e: "excited" },
    { at: 10, t: "뭔가 만지고 싶지? 참아야 해!", e: "smug" },
    { at: 25, t: "오~ 새로운 게 나타났지? 궁금하지?", e: "smug" },
    { at: 40, t: "반 넘게 왔어! 조금만 더!", e: "excited" },
    { at: 50, t: "10초 남았다! 버텨!!", e: "shocked" },
    { at: 55, t: "5초! 4! 3!", e: "shocked" },
    { at: 58, t: "2! 1!", e: "excited" },
  ],
  2: [
    { at: 0, t: "두 번째! 이번엔 좀 어려울걸~?", e: "smug" },
    { at: 15, t: "오~ 뭔가 반짝이는 게 보이지?", e: "excited" },
    { at: 35, t: "돈이 보이면 참기 힘들지~?", e: "smug" },
    { at: 55, t: "절반 넘었어! 근데 더 어려워질 거야~", e: "smug" },
    { at: 75, t: "거의 다야! 이것만 참으면 돼!", e: "excited" },
    { at: 80, t: "10초! 버텨!!", e: "shocked" },
    { at: 85, t: "5! 4! 3!", e: "shocked" },
    { at: 88, t: "2! 1!", e: "excited" },
  ],
  3: [
    { at: 0, t: "세 번째~ 욕망의 방이야! 후후~", e: "smug" },
    { at: 20, t: "맛있는 거, 귀여운 거... 참을 수 있어?", e: "smug" },
    { at: 50, t: "절반이야! 그런데... 더 올 거야~", e: "pouty" },
    { at: 80, t: "대단한데? 여기까지 오다니!", e: "excited" },
    { at: 100, t: "20초 남았어! 참아!!", e: "shocked" },
    { at: 110, t: "10초! 거의 다야!!", e: "shocked" },
    { at: 115, t: "5! 4! 3!", e: "excited" },
    { at: 118, t: "2! 1!", e: "excited" },
  ],
  4: [
    { at: 0, t: "네 번째... 위기의 방이야. 살벌하지?", e: "shocked" },
    { at: 15, t: "여기선 진짜 조심해야 해...", e: "pouty" },
    { at: 40, t: "으악, 무서운 것들이 나타나고 있어!", e: "shocked" },
    { at: 60, t: "30초만 더!! 할 수 있어!", e: "excited" },
    { at: 75, t: "15초! 제발 참아!!", e: "shocked" },
    { at: 80, t: "10초!! 버텨!!!", e: "shocked" },
    { at: 85, t: "5! 4! 3!", e: "excited" },
    { at: 88, t: "2! 1!", e: "excited" },
  ],
  5: [
    { at: 0, t: "마지막 방... 히든 스테이지야. 3분!", e: "shocked" },
    { at: 30, t: "여기엔 정말 교묘한 트랩이 있어...", e: "pouty" },
    { at: 60, t: "1분 지났어! 아직 2분 남았지만...", e: "smug" },
    { at: 100, t: "와... 진짜 대단해. 여기까지 오다니!", e: "excited" },
    { at: 130, t: "50초 남았어! 거의 다 왔어!", e: "excited" },
    { at: 150, t: "30초!! 마지막 힘을 내!", e: "shocked" },
    { at: 170, t: "10초! 이것만 넘기면 올 클리어!!!", e: "shocked" },
    { at: 175, t: "5! 4! 3!", e: "excited" },
    { at: 178, t: "2! 1!", e: "excited" },
  ],
};

function pickRandom(arr, lastRef) {
  if (!arr || arr.length === 0) return null;
  if (arr.length <= 1) return arr[0];
  let pick;
  do { pick = arr[Math.floor(Math.random() * arr.length)]; } while (pick === lastRef?.current && arr.length > 1);
  if (lastRef) lastRef.current = pick;
  return pick;
}

// ============================================================
// 나비 캐릭터 (스프라이트 시트 기반)
// ============================================================
const NAVI_SPRITES = {
  idle:    "nabi/sprites/idle.webp",
  excited: "nabi/sprites/excited.webp",
  pouty:   "nabi/sprites/pouty.webp",
  shocked: "nabi/sprites/shocked.webp",
  smug:    "nabi/sprites/smug.webp",
  cry:     "nabi/sprites/cry.webp",
  catears: "nabi/sprites/catears.webp",
};
const NAVI_SPRITE_COLS = 6;
const NAVI_SPRITE_ROWS = 4;
const NAVI_SPRITE_FRAMES = 24;
const NAVI_FRAME_W = 160;
const NAVI_FRAME_H = 256;

function preloadNaviSprite(emotion) {
  const img = new Image();
  img.src = NAVI_SPRITES[emotion];
  return img;
}

// Preload idle immediately
preloadNaviSprite("idle");

function NaviCharacter({ emotion = "idle", frame = 0, sleeping = false, catEars = false, gone = false, size = 140 }) {
  const bob = Math.sin(frame * 0.25) * 3;
  const sheet = catEars ? "catears" : (sleeping ? "idle" : emotion);
  const spriteFrame = frame % NAVI_SPRITE_FRAMES;
  const col = spriteFrame % NAVI_SPRITE_COLS;
  const row = Math.floor(spriteFrame / NAVI_SPRITE_COLS);

  const w = size;
  const h = size * (NAVI_FRAME_H / NAVI_FRAME_W);
  const sheetW = NAVI_SPRITE_COLS * w;
  const sheetH = NAVI_SPRITE_ROWS * h;

  return (
    <div style={{
      position: "relative",
      width: w,
      height: h,
      backgroundImage: `url(${NAVI_SPRITES[sheet]})`,
      backgroundPosition: `-${col * w}px -${row * h}px`,
      backgroundSize: `${sheetW}px ${sheetH}px`,
      backgroundRepeat: "no-repeat",
      filter: sleeping
        ? "drop-shadow(0 10px 30px rgba(100,50,80,0.25)) brightness(0.6) saturate(0.4)"
        : "drop-shadow(0 10px 30px rgba(100,50,80,0.25))",
      opacity: gone ? 0 : 1,
      transition: "opacity 2s, transform 1s, filter 0.5s",
      transform: `translateY(${gone ? 30 : bob}px)`,
    }}>
      {sleeping && (
        <div style={{
          position: "absolute", top: -4, right: -8,
          fontSize: size * 0.11, opacity: 0.7,
          animation: "zzz 2s ease infinite",
        }}>💤</div>
      )}
    </div>
  );
}

// ============================================================
// Canvas 파티클 시스템
// ============================================================
function ParticleOverlay() {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const anim = useRef(null);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d");
    const W = cv.width = cv.offsetWidth;
    const H = cv.height = cv.offsetHeight;

    particles.current = Array.from({ length: 40 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.35 + 0.08,
      glow: Math.random() > 0.65,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      particles.current.forEach(p => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.y < -10) { p.y = H + 10; p.x = Math.random() * W; }
        if (p.x < -10 || p.x > W + 10) p.x = Math.random() * W;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        if (p.glow) {
          ctx.fillStyle = `rgba(255,220,180,${p.alpha * 0.9})`;
          ctx.shadowColor = "rgba(255,200,140,0.5)";
          ctx.shadowBlur = 10;
        } else {
          ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      });
      anim.current = requestAnimationFrame(draw);
    };
    draw();
    return () => { if (anim.current) cancelAnimationFrame(anim.current); };
  }, []);

  return <canvas ref={canvasRef} style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none",width:"100%",height:"100%" }}/>;
}

// ============================================================
// UI 컴포넌트
// ============================================================
function TypeWriter({ text, speed = 28 }) {
  const [disp, setDisp] = useState("");
  const [done, setDone] = useState(false);
  useEffect(() => {
    setDisp(""); setDone(false); let i = 0;
    const iv = setInterval(() => { i++; if (i <= text.length) setDisp(text.slice(0, i)); else { clearInterval(iv); setDone(true); } }, speed);
    return () => clearInterval(iv);
  }, [text, speed]);
  return <span>{disp}{!done && <span className="cursor-blink">▌</span>}</span>;
}

function RoomObj({ children, onClick, style, hoverGlow, title }) {
  const [hv, setHv] = useState(false);
  return (
    <div title={title} onClick={onClick}
      onMouseEnter={()=>setHv(true)} onMouseLeave={()=>setHv(false)}
      style={{ cursor:"pointer", transition:"all 0.3s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hv ? "scale(1.08) translateY(-4px)" : "scale(1)",
        filter: hv && hoverGlow ? `drop-shadow(0 4px 16px ${hoverGlow})` : "none",
        ...style }}>
      {children}
    </div>
  );
}

// ── 메인 버튼 (더 크고 드라마틱) ──
function NuclearButton({ label, onPress, onHover, onDrag, disabled, accent, cakeMode, cakeSelect }) {
  const [hv, setHv] = useState(false);
  const [pr, setPr] = useState(false);
  const b = accent || "#e8573d";
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:8,
      opacity:disabled?0.15:1,pointerEvents:disabled?"none":"auto",transition:"opacity 0.5s" }}>
      {/* 바닥 글로우 */}
      <div style={{ position:"absolute",bottom:-20,left:"50%",transform:"translateX(-50%)",
        width:200,height:40,borderRadius:"50%",
        background:`radial-gradient(ellipse,${b}18,transparent 70%)`,
        animation:"glowPulse 3s ease infinite" }}/>
      {/* 외부 링 */}
      <div style={{ width:160,height:160,borderRadius:"50%",position:"relative",
        background:`conic-gradient(from 0deg,${b}22,${b}08,${b}22,${b}08,${b}22)`,
        boxShadow:`0 12px 48px ${b}25, inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)`,
        display:"flex",alignItems:"center",justifyContent:"center",
        animation: hv && !pr ? "glowPulse 1.5s ease infinite" : "none" }}>
        {/* 점선 링 */}
        <div style={{ position:"absolute",inset:6,borderRadius:"50%",
          border:`2px dashed ${b}25`,animation:"spin 20s linear infinite" }}/>
        {/* 위험 표시 외곽 */}
        <div style={{ position:"absolute",inset:2,borderRadius:"50%",
          border:`1px solid ${b}15` }}/>
        {/* 내부 베이스 */}
        <div style={{ width:128,height:128,borderRadius:"50%",
          background:"linear-gradient(160deg,#fafafa,#e8e4e0,#d8d4d0)",
          boxShadow:`inset 0 4px 12px rgba(0,0,0,0.08), 0 6px 24px ${b}18`,
          display:"flex",alignItems:"center",justifyContent:"center" }}>

          {cakeMode ? (
            <div onClick={onPress} style={{ width:96,height:96,borderRadius:"50%",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:48,
              animation:"float 1.5s ease infinite",filter:"drop-shadow(0 6px 12px rgba(0,0,0,0.2))" }}>
              🎂
            </div>
          ) : (
            <button
              onMouseEnter={() => { setHv(true); onHover?.(true); }}
              onMouseLeave={() => { setHv(false); setPr(false); onHover?.(false); }}
              onMouseDown={(e) => { setPr(true); onDrag?.(e); }}
              onMouseUp={() => setPr(false)}
              onClick={(e) => { e.stopPropagation(); onPress?.(); }}
              style={{ width:96,height:96,borderRadius:"50%",border:"none",cursor:"pointer",outline:"none",
                background: pr
                  ? `radial-gradient(circle at 50% 60%,${b},${b}cc)`
                  : `radial-gradient(circle at 36% 28%,${b}ff,${b} 50%,${b}aa 100%)`,
                boxShadow: pr
                  ? `0 2px 8px ${b}44, inset 0 4px 12px rgba(0,0,0,0.25)`
                  : `0 8px 32px ${b}35, 0 3px 8px rgba(0,0,0,0.1), inset 0 -4px 8px ${b}22`,
                transform: pr ? "translateY(4px) scale(0.9)" : hv ? "scale(1.08)" : "scale(1)",
                transition:"all 0.12s ease", position:"relative" }}>
              <div style={{ position:"absolute",top:"12%",left:"18%",width:"32%",height:"20%",
                borderRadius:"50%",background:"rgba(255,255,255,0.5)",filter:"blur(4px)" }}/>
              <div style={{ position:"absolute",top:"20%",left:"26%",width:"14%",height:"10%",
                borderRadius:"50%",background:"rgba(255,255,255,0.7)",filter:"blur(2px)" }}/>
            </button>
          )}
        </div>
      </div>

      {/* 라벨 */}
      <div style={{ fontFamily:"'Noto Sans KR',monospace",fontSize:13,fontWeight:800,letterSpacing:4,
        color:b,textShadow:`0 2px 8px ${b}22`,transition:"color 0.3s",marginTop:4 }}>
        {cakeSelect ? "🎂 여기에 올려!" : label}
      </div>
      {!cakeSelect && !cakeMode && (
        <div style={{ fontSize:8,color:"#c0b8b066",letterSpacing:2 }}>▲ DON'T PRESS ▲</div>
      )}
    </div>
  );
}

// ============================================================
// 오버레이 컴포넌트
// ============================================================
function BSODOverlay({ active }) {
  if (!active) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:500,background:"#0078d7",display:"flex",flexDirection:"column",
      alignItems:"center",justifyContent:"center",fontFamily:"'Segoe UI',sans-serif",color:"#fff",animation:"fadeIn 0.2s ease" }}>
      <div style={{ fontSize:100,marginBottom:28,fontWeight:200 }}>:(</div>
      <div style={{ fontSize:16,marginBottom:10,maxWidth:420,textAlign:"center",lineHeight:1.7 }}>
        PC에 문제가 발생하여 다시 시작해야 합니다.
      </div>
      <div style={{ fontSize:12,color:"#ffffffaa",marginBottom:24 }}>오류 코드: DONT_PRESS_0x80070002</div>
      <div style={{ width:220,height:4,background:"#ffffff22",borderRadius:2 }}>
        <div style={{ width:"30%",height:"100%",background:"#fff",borderRadius:2,animation:"bsodProgress 2.5s ease forwards" }}/>
      </div>
      <div style={{ fontSize:11,color:"#ffffff55",marginTop:10 }}>0% 완료</div>
    </div>
  );
}

function NewsOverlay({ active }) {
  if (!active) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:400,background:"linear-gradient(180deg,#1a1a2e,#16213e)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease" }}>
      <div style={{ background:"#c62828",padding:"10px 40px",borderRadius:6,marginBottom:20,
        boxShadow:"0 6px 24px rgba(198,40,40,0.5)" }}>
        <span style={{ color:"#fff",fontSize:18,fontWeight:800,letterSpacing:8 }}>속 보</span>
      </div>
      <div style={{ color:"#fff",fontSize:28,fontWeight:800,marginBottom:8,letterSpacing:3 }}>☢️ 핵전쟁 발발</div>
      <div style={{ color:"#ff8a80",fontSize:14,marginBottom:28 }}>전 세계 비상사태 선포</div>
      <div style={{ width:"80%",height:2,background:"#ffffff11",marginBottom:10 }}/>
      <div style={{ color:"#ff5252",fontSize:12,animation:"pulse 1s ease infinite" }}>🔴 LIVE</div>
      <div style={{ position:"absolute",bottom:28,width:"100%",overflow:"hidden" }}>
        <div style={{ color:"#ffeb3b",fontSize:12,whiteSpace:"nowrap",animation:"ticker 10s linear infinite" }}>
          [긴급] 각국 핵미사일 발사 준비 완료 — 시민 대피 권고 — 버튼을 누르면 대응 미사일 발사 — 반복 —
        </div>
      </div>
    </div>
  );
}

function StockOverlay({ active }) {
  if (!active) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:400,background:"linear-gradient(180deg,#0d1117,#161b22)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease" }}>
      <div style={{ color:"#8b949e",fontSize:11,letterSpacing:4,marginBottom:6 }}>KOSPI · MEME COIN</div>
      <div style={{ color:"#3fb950",fontSize:60,fontWeight:800,textShadow:"0 0 50px #3fb95033" }}>+847.3%</div>
      <div style={{ color:"#3fb95088",fontSize:14,marginBottom:20 }}>▲ TO THE MOON 🚀</div>
      <svg viewBox="0 0 240 80" style={{ width:260,height:80 }}>
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3fb95033"/><stop offset="100%" stopColor="#3fb95003"/>
          </linearGradient>
        </defs>
        <path d="M0,70 L30,65 60,60 90,48 120,35 150,20 180,10 210,6 240,2 L240,80 L0,80 Z" fill="url(#chartFill)"/>
        <polyline points="0,70 30,65 60,60 90,48 120,35 150,20 180,10 210,6 240,2" fill="none" stroke="#3fb950" strokeWidth="2.5"/>
        <circle cx="240" cy="2" r="4" fill="#3fb950" opacity="0.8">
          <animate attributeName="r" values="4;6;4" dur="1s" repeatCount="indefinite"/>
        </circle>
      </svg>
      <div style={{ color:"#f8514966",fontSize:10,marginTop:14 }}>※ 투자는 본인 책임입니다</div>
    </div>
  );
}

function TimerDisplay({ seconds }) {
  return (
    <div style={{ position:"absolute",top:"42%",left:"50%",transform:"translate(-50%,-50%)",zIndex:350,textAlign:"center" }}>
      <div style={{ fontSize:84,fontWeight:800,color:seconds<=10?"#e8573d":"#e88b3d",
        textShadow:`0 6px 40px ${seconds<=10?"#e8573d33":"#e88b3d22"}`,
        animation:seconds<=10?"pulse 0.5s ease infinite":"none",letterSpacing:6 }}>
        {String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}
      </div>
      <div style={{ fontSize:10,color:"#b0a09088",letterSpacing:4,marginTop:6 }}>MARSHMALLOW CHALLENGE</div>
    </div>
  );
}

function CountdownDisplay({ count }) {
  return (
    <div key={count} style={{ position:"absolute",top:"36%",left:"50%",transform:"translate(-50%,-50%)",zIndex:350,
      fontSize:120,fontWeight:800,color:"#e8573d",animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      textShadow:"0 10px 50px #e8573d44" }}>
      {count > 0 ? count : "💥"}
    </div>
  );
}

function RunawayButton({ onCatch }) {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [caught, setCaught] = useState(false);
  const containerRef = useRef(null);
  const handleMouseMove = useCallback((e) => {
    if (caught) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = ((e.clientX - rect.left) / rect.width) * 100;
    const my = ((e.clientY - rect.top) / rect.height) * 100;
    const dx = pos.x - mx, dy = pos.y - my;
    if (Math.sqrt(dx*dx + dy*dy) < 18) {
      const angle = Math.atan2(dy, dx);
      setPos({ x: Math.max(8,Math.min(92, pos.x + Math.cos(angle)*28)), y: Math.max(12,Math.min(88, pos.y + Math.sin(angle)*28)) });
    }
  }, [pos, caught]);
  return (
    <div ref={containerRef} onMouseMove={handleMouseMove}
      style={{ position:"absolute",inset:0,zIndex:350,cursor:"crosshair" }}>
      <div onClick={() => { setCaught(true); onCatch?.(); }}
        style={{ position:"absolute",left:`${pos.x}%`,top:`${pos.y}%`,transform:"translate(-50%,-50%)",
          width:64,height:64,borderRadius:"50%",
          background:"radial-gradient(circle at 36% 28%,#e8573dff,#e8573d 50%,#c0392baa)",
          boxShadow:"0 8px 24px #e8573d44",cursor:"pointer",transition:"left 0.15s, top 0.15s",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:11,color:"#fff",fontWeight:800,letterSpacing:1,
          animation:"shake 0.12s ease infinite" }}>
        {caught ? "!" : "잡아봐"}
      </div>
    </div>
  );
}

function PrizeBanner({ visible, onClick }) {
  if (!visible) return null;
  return (
    <div onClick={onClick} style={{ position:"absolute",top:"18%",left:"50%",transform:"translateX(-50%)",
      zIndex:450,background:"linear-gradient(135deg,#ffd700,#ff8f00)",border:"3px solid #ff6f00",
      borderRadius:24,padding:"24px 44px",textAlign:"center",cursor:"pointer",
      animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow:"0 16px 60px rgba(255,152,0,0.45), inset 0 2px 0 rgba(255,255,255,0.3)" }}>
      <div style={{ fontSize:10,color:"#fff",letterSpacing:5,marginBottom:8,opacity:0.8 }}>★ CONGRATULATIONS ★</div>
      <div style={{ fontSize:30,fontWeight:800,color:"#fff",textShadow:"0 3px 10px rgba(0,0,0,0.2)" }}>
        💰 100만원 당첨!! 💰
      </div>
      <div style={{ fontSize:12,color:"#ffffffcc",marginTop:8 }}>▼ 지금 바로 수령하세요 ▼</div>
      <div style={{ marginTop:10,fontSize:8,color:"#ffffff33" }}>광고 아님 (진짜임) (진짜로)</div>
    </div>
  );
}

// ============================================================
// 패널 컴포넌트
// ============================================================
function SettingsPanel({ open, onClose, onKillMode, onReset, killModeOn }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:600,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.4)",backdropFilter:"blur(6px)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"#fff",borderRadius:24,padding:"32px 40px",
        minWidth:300,boxShadow:"0 24px 80px rgba(0,0,0,0.25)",animation:"popIn 0.3s ease" }}>
        <div style={{ fontSize:17,fontWeight:800,color:"#333",marginBottom:24,letterSpacing:3 }}>⚙️ 설정</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18,
          padding:"12px 16px",background:"#fafafa",borderRadius:14,border:"1px solid #f0f0f0" }}>
          <span style={{ fontSize:14,color:"#333" }}>Kill Mode</span>
          <div onClick={onKillMode} style={{ width:52,height:28,borderRadius:14,
            background:killModeOn?"#e8573d":"#ddd",cursor:"pointer",position:"relative",transition:"background 0.3s",
            boxShadow:killModeOn?"0 2px 10px #e8573d44":"none" }}>
            <div style={{ position:"absolute",top:4,left:killModeOn?27:4,width:20,height:20,borderRadius:10,
              background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}/>
          </div>
        </div>
        <div onClick={onReset} style={{ padding:"12px 16px",background:"#fafafa",borderRadius:14,cursor:"pointer",
          fontSize:14,color:"#78909c",textAlign:"center",marginBottom:14,border:"1px solid #f0f0f0",
          transition:"background 0.2s" }}
          onMouseEnter={e=>e.target.style.background="#f0f0f0"}
          onMouseLeave={e=>e.target.style.background="#fafafa"}>
          🔄 초기화
        </div>
        <div onClick={onClose} style={{ padding:"10px",textAlign:"center",fontSize:13,color:"#bbb",cursor:"pointer" }}>닫기</div>
      </div>
    </div>
  );
}

function ProfileMenu({ open, onClose, onTransfer }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute",top:56,right:16,zIndex:600,background:"#fff",borderRadius:18,
      padding:"18px 24px",boxShadow:"0 16px 56px rgba(0,0,0,0.18)",animation:"fadeInUp 0.2s ease",minWidth:200 }}>
      <div style={{ fontSize:12,color:"#bbb",marginBottom:8 }}>플레이어 프로필</div>
      <div style={{ fontSize:14,fontWeight:600,color:"#333",marginBottom:16 }}>👤 Guest</div>
      <div onClick={onTransfer} style={{ fontSize:13,color:"#6a1b9a",cursor:"pointer",
        padding:"10px 14px",background:"#f3e5f5",borderRadius:12,textAlign:"center",fontWeight:600,
        transition:"background 0.2s" }}
        onMouseEnter={e=>e.target.style.background="#e1bee7"}
        onMouseLeave={e=>e.target.style.background="#f3e5f5"}>
        🔀 권한 양도
      </div>
      <div onClick={onClose} style={{ fontSize:12,color:"#ccc",cursor:"pointer",textAlign:"center",marginTop:12 }}>닫기</div>
    </div>
  );
}

function CollectionPanel({ open, onClose, collected }) {
  if (!open) return null;
  const phaseColors = { "간보기":"#e88b3d","장난":"#e8573d","욕망":"#e84393","위기":"#c62828","히든":"#5c6bc0","진 엔딩":"#212121","특전":"#ffd700" };
  return (
    <div style={{ position:"absolute",inset:0,zIndex:700,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(8px)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"linear-gradient(180deg,#fefcfa,#f8f4ef)",borderRadius:28,padding:"32px",
        width:"92%",maxWidth:480,maxHeight:"85vh",overflow:"auto",boxShadow:"0 28px 90px rgba(0,0,0,0.3)",animation:"popIn 0.3s ease" }}>
        <div style={{ textAlign:"center",marginBottom:24 }}>
          <div style={{ fontSize:20,fontWeight:800,color:"#333",letterSpacing:4 }}>엔딩 컬렉션</div>
          <div style={{ fontSize:13,color:"#aaa",marginTop:8 }}>{collected.length} / 21</div>
          <div style={{ width:"100%",height:7,background:"#eee",borderRadius:4,marginTop:12,overflow:"hidden" }}>
            <div style={{ width:`${(collected.length/21)*100}%`,height:"100%",
              background:"linear-gradient(90deg,#ffa4c4,#a33de8,#536dfe)",borderRadius:4,transition:"width 0.5s" }}/>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12 }}>
          {Array.from({length:21},(_,i)=>i+1).map(id => {
            const ed = ENDINGS[id];
            const unlocked = collected.includes(id);
            return (
              <div key={id} style={{ padding:"14px 10px",
                background:unlocked?"#fff":"#f4f0ea",borderRadius:16,textAlign:"center",
                border:`2px solid ${unlocked?phaseColors[ed.phase]+"55":"#e8e2da"}`,
                opacity:unlocked?1:0.4,transition:"all 0.3s",
                boxShadow:unlocked?`0 4px 18px ${phaseColors[ed.phase]}18`:"none",
                transform:unlocked?"scale(1)":"scale(0.95)" }}>
                <div style={{ fontSize:28,marginBottom:6 }}>{unlocked ? ed.emoji : "🔒"}</div>
                <div style={{ fontSize:11,fontWeight:700,color:unlocked?"#333":"#ccc" }}>
                  {unlocked ? ed.name : "???"}
                </div>
                <div style={{ fontSize:8,color:phaseColors[ed.phase]||"#aaa",fontWeight:600,marginTop:4,
                  letterSpacing:1 }}>{ed.phase}</div>
              </div>
            );
          })}
        </div>
        <div onClick={onClose} style={{ textAlign:"center",marginTop:24,fontSize:13,color:"#bbb",cursor:"pointer" }}>닫기</div>
      </div>
    </div>
  );
}

function CreditsScreen({ onBack }) {
  const [scroll, setScroll] = useState(0);
  useEffect(() => { const iv = setInterval(() => setScroll(p => p + 0.4), 30); return () => clearInterval(iv); }, []);
  const lines = [
    { t:"", s:0 },{ t:"", s:0 },{ t:"", s:0 },{ t:"", s:0 },
    { t:"DON'T PRESS THE BUTTON", s:2 },
    { t:"— FULL EDITION —", s:1 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"기획 · 디자인 · 개발", s:0 },{ t:"제작팀 일동", s:1 },
    { t:"", s:0 },{ t:"오퍼레이터", s:0 },{ t:"나비 (자칭 천재 내비게이터)", s:1 },
    { t:"", s:0 },{ t:"엔딩 시나리오", s:0 },{ t:"21개의 기발한 결말", s:1 },
    { t:"", s:0 },{ t:"플레이어", s:0 },{ t:"당신 (버튼 앞에서 고민한 사람)", s:1 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"Special Thanks", s:1 },{ t:"끝까지 모든 엔딩을 찾아주신 당신에게", s:0 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"\"누르지 마\" 라고 했잖아요.", s:3 },
    { t:"", s:0 },
    { t:"...그래도 눌러줘서 고마워요.", s:3 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"🎮 Fin 🎮", s:2 },
    { t:"", s:0 },{ t:"", s:0 },
    { t:"플레이 해주셔서 감사합니다!", s:1 },
  ];
  return (
    <div style={{ position:"absolute",inset:0,zIndex:800,background:"linear-gradient(180deg,#0a0a12,#12121f)",overflow:"hidden" }}>
      <div style={{ position:"relative",width:"100%",height:"100%",overflow:"hidden" }}>
        <div style={{ position:"absolute",left:0,right:0,top:`${100-scroll}%`,textAlign:"center",padding:"0 20px" }}>
          {lines.map((l,i) => (
            <div key={i} style={{ color:l.s===2?"#e8573d":l.s===3?"#ffa4c4":l.s===1?"#fff":"#999",
              fontSize:l.s===2?28:l.s===1?17:14,fontWeight:l.s>=1?700:400,
              marginBottom:l.t===""?24:12,letterSpacing:l.s===2?8:3 }}>
              {l.t || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
      <div onClick={onBack} style={{ position:"absolute",bottom:24,left:"50%",transform:"translateX(-50%)",
        fontSize:13,color:"#444",cursor:"pointer",zIndex:2,padding:"10px 20px",borderRadius:10,
        border:"1px solid #333",transition:"color 0.2s" }}
        onMouseEnter={e=>e.target.style.color="#888"}
        onMouseLeave={e=>e.target.style.color="#444"}>
        돌아가기
      </div>
    </div>
  );
}

function ContextMenu({ x, y, onDelete, onClose }) {
  return (
    <div style={{ position:"fixed",left:x,top:y,zIndex:900,background:"#fff",borderRadius:14,
      boxShadow:"0 10px 40px rgba(0,0,0,0.2)",padding:8,minWidth:160,animation:"popIn 0.15s ease" }}>
      <div style={{ padding:"10px 16px",fontSize:12,color:"#bbb",cursor:"default" }}>나비</div>
      <div style={{ height:1,background:"#f0f0f0",margin:"2px 10px" }}/>
      <div onClick={onDelete} style={{ padding:"12px 16px",fontSize:14,color:"#e8573d",cursor:"pointer",
        borderRadius:10,transition:"background 0.15s" }}
        onMouseEnter={e=>e.target.style.background="#fef0f0"}
        onMouseLeave={e=>e.target.style.background="transparent"}>
        🗑️ 삭제
      </div>
      <div onClick={onClose} style={{ padding:"12px 16px",fontSize:14,color:"#999",cursor:"pointer",
        borderRadius:10,transition:"background 0.15s" }}
        onMouseEnter={e=>e.target.style.background="#f8f8f8"}
        onMouseLeave={e=>e.target.style.background="transparent"}>
        취소
      </div>
    </div>
  );
}

// ============================================================
// 스테이지 UI 컴포넌트
// ============================================================
function ModeSelectScreen({ onSelectStage, onSelectFree, freeUnlocked, collected, frame }) {
  return (
    <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",
      background:"radial-gradient(ellipse at 50% 40%,#faf5f0,#f0e8f5 60%,#e8e0f0)",
      position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"10%",left:"8%",width:280,height:280,borderRadius:"50%",
        background:"radial-gradient(circle,#e8573d06,transparent 70%)" }}/>
      <div style={{ position:"absolute",bottom:"15%",right:"10%",width:200,height:200,borderRadius:"50%",
        background:"radial-gradient(circle,#a33de806,transparent 70%)" }}/>
      <div style={{ fontSize:14,color:"#e8573d88",letterSpacing:8,marginBottom:12,
        animation:"fadeInUp 0.5s ease" }}>SELECT MODE</div>
      <div style={{ fontSize:36,fontWeight:800,color:"#e8573d",letterSpacing:6,marginBottom:48,
        animation:"fadeInUp 0.6s ease" }}>모드 선택</div>
      <div onClick={onSelectStage} style={{ width:320,padding:"24px 32px",marginBottom:16,
        background:"linear-gradient(135deg,#fff,#fef8f4)",borderRadius:20,cursor:"pointer",
        border:"2px solid #e8573d33",
        boxShadow:"0 8px 32px rgba(232,87,61,0.08)",
        transition:"all 0.3s",animation:"fadeInUp 0.7s ease" }}
        onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="#e8573d88";}}
        onMouseLeave={e=>{e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="#e8573d33";}}>
        <div style={{ fontSize:20,fontWeight:800,color:"#e8573d",marginBottom:8,letterSpacing:4 }}>🎮 스테이지 모드</div>
        <div style={{ fontSize:13,color:"#999",lineHeight:1.6 }}>5단계 유혹 서바이벌<br/>제한 시간 동안 유혹을 참아라!</div>
      </div>
      <div onClick={freeUnlocked ? onSelectFree : undefined}
        style={{ width:320,padding:"24px 32px",
          background:freeUnlocked?"linear-gradient(135deg,#fff,#f4f0fe)":"linear-gradient(135deg,#f8f8f8,#f0f0f0)",
          borderRadius:20,cursor:freeUnlocked?"pointer":"not-allowed",
          border:`2px solid ${freeUnlocked?"#a33de833":"#ddd"}`,
          opacity:freeUnlocked?1:0.5,
          boxShadow:freeUnlocked?"0 8px 32px rgba(163,61,232,0.08)":"none",
          transition:"all 0.3s",animation:"fadeInUp 0.8s ease" }}
        onMouseEnter={e=>{if(freeUnlocked){e.currentTarget.style.transform="translateY(-4px)";e.currentTarget.style.borderColor="#a33de888";}}}
        onMouseLeave={e=>{if(freeUnlocked){e.currentTarget.style.transform="translateY(0)";e.currentTarget.style.borderColor="#a33de833";}}}>
        <div style={{ fontSize:20,fontWeight:800,color:freeUnlocked?"#a33de8":"#ccc",marginBottom:8,letterSpacing:4 }}>
          {freeUnlocked ? "🔓" : "🔒"} 자유 모드
        </div>
        <div style={{ fontSize:13,color:freeUnlocked?"#999":"#ccc",lineHeight:1.6 }}>
          {freeUnlocked ? "자유롭게 탐험 · 엔딩 수집" : "스테이지 1 클리어 시 해금"}
        </div>
      </div>
      {collected.length > 0 && (
        <div style={{ fontSize:12,color:"#a33de8",marginTop:24,animation:"fadeIn 0.8s ease",letterSpacing:2 }}>
          ✦ {collected.length}/21 엔딩 수집됨
        </div>
      )}
      <div style={{ position:"absolute",bottom:"6%",right:"10%",opacity:0.12,animation:"fadeIn 2s ease" }}>
        <NaviCharacter emotion="smug" frame={frame} size={120}/>
      </div>
    </div>
  );
}

function StageIntroScreen({ stage, onStart, frame }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    const ts = [setTimeout(()=>setStep(1),400), setTimeout(()=>setStep(2),1200), setTimeout(()=>setStep(3),2000)];
    return () => ts.forEach(clearTimeout);
  }, [stage]);
  return (
    <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",
      background:"radial-gradient(ellipse at 50% 40%,#faf5f0,#f0e8f5 60%,#e8e0f0)",
      position:"relative",overflow:"hidden" }}>
      <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        width:400,height:400,borderRadius:"50%",
        background:`radial-gradient(circle,${STAGE_COLORS[stage]}12,transparent 60%)` }}/>
      {step >= 1 && <div style={{ fontSize:14,color:"#b0a09088",letterSpacing:8,marginBottom:12,
        animation:"fadeInUp 0.6s ease" }}>STAGE</div>}
      {step >= 1 && <div style={{ fontSize:80,fontWeight:800,color:STAGE_COLORS[stage],marginBottom:8,
        animation:"popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)",
        textShadow:`0 6px 40px ${STAGE_COLORS[stage]}22` }}>{stage}</div>}
      {step >= 2 && <div style={{ fontSize:28,fontWeight:800,color:"#4a3a2a",letterSpacing:6,marginBottom:8,
        animation:"fadeInUp 0.6s ease" }}>{STAGE_NAMES[stage]}</div>}
      {step >= 2 && <div style={{ fontSize:14,color:"#b0a09088",letterSpacing:4,marginBottom:32,
        animation:"fadeInUp 0.7s ease" }}>{STAGE_SUBTITLES[stage]} · {STAGE_DURATIONS[stage]}s</div>}
      {step >= 3 && (
        <div onClick={onStart} style={{ padding:"14px 40px",background:STAGE_COLORS[stage],borderRadius:14,
          cursor:"pointer",animation:"fadeInUp 0.6s ease",
          boxShadow:`0 8px 32px ${STAGE_COLORS[stage]}33`,transition:"transform 0.2s" }}
          onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
          onMouseLeave={e=>e.target.style.transform="scale(1)"}>
          <span style={{ color:"#fff",fontSize:16,fontWeight:800,letterSpacing:4 }}>START</span>
        </div>
      )}
      <div style={{ position:"absolute",bottom:"8%",opacity:0.2 }}>
        <NaviCharacter emotion="excited" frame={frame} size={100}/>
      </div>
    </div>
  );
}

function StageHUD({ stage, timer, duration, temptation }) {
  const urgent = timer <= 10;
  const progress = (duration - timer) / duration;
  return (
    <div style={{ position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",zIndex:200,
      display:"flex",flexDirection:"column",alignItems:"center",gap:6,
      animation:"fadeInUp 0.5s ease",pointerEvents:"none" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,
        background:"rgba(255,255,255,0.92)",backdropFilter:"blur(10px)",
        padding:"8px 24px",borderRadius:16,
        border:`1.5px solid ${urgent?"#e8573d33":"rgba(0,0,0,0.06)"}`,
        boxShadow:urgent?"0 4px 20px rgba(232,87,61,0.15)":"0 4px 16px rgba(0,0,0,0.06)",
        transition:"all 0.3s" }}>
        <div style={{ fontSize:11,color:STAGE_COLORS[stage],letterSpacing:3,fontWeight:700 }}>
          STAGE {stage}
        </div>
        <div style={{ width:1,height:16,background:"#e0d8d0" }}/>
        <div style={{ fontSize:11,color:"#b0a090",letterSpacing:2 }}>
          {STAGE_NAMES[stage]}
        </div>
        <div style={{ width:1,height:16,background:"#e0d8d0" }}/>
        <div style={{ fontSize:urgent?20:16,fontWeight:800,
          color:urgent?"#e8573d":"#4a3a2a",
          animation:urgent?"pulse 0.5s ease infinite":"none",
          transition:"all 0.3s",letterSpacing:2,minWidth:52,textAlign:"center" }}>
          {String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}
        </div>
      </div>
      <div style={{ width:220,height:4,background:"rgba(0,0,0,0.06)",borderRadius:2,overflow:"hidden" }}>
        <div style={{ width:`${progress*100}%`,height:"100%",
          background:urgent?"linear-gradient(90deg,#e8573d,#ff8a65)":"linear-gradient(90deg,#a33de8,#536dfe)",
          borderRadius:2,transition:"width 1s linear" }}/>
      </div>
      <div style={{ width:160,height:3,background:"rgba(0,0,0,0.04)",borderRadius:2,overflow:"hidden" }}>
        <div style={{ width:`${Math.min(temptation,100)}%`,height:"100%",
          background:"linear-gradient(90deg,#ffa726,#e8573d)",borderRadius:2,
          transition:"width 0.5s ease" }}/>
      </div>
    </div>
  );
}

function WarningOverlay({ data, onConfirm, onResist }) {
  if (!data) return null;
  const { endingId, step, maxSteps } = data;
  const ed = ENDINGS[endingId];
  return (
    <div style={{ position:"absolute",inset:0,zIndex:800,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.5)",backdropFilter:"blur(6px)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"#fff",borderRadius:24,padding:"32px 40px",
        minWidth:320,maxWidth:400,boxShadow:"0 24px 80px rgba(0,0,0,0.3)",animation:"popIn 0.3s ease",
        textAlign:"center" }}>
        <div style={{ fontSize:48,marginBottom:16 }}>⚠️</div>
        <div style={{ fontSize:18,fontWeight:800,color:"#e8573d",marginBottom:8,letterSpacing:3 }}>
          {step === 1 ? "정말로?" : step === 2 ? "진짜로??" : "마지막 경고!!!"}
        </div>
        <div style={{ fontSize:14,color:"#666",marginBottom:8,lineHeight:1.7 }}>
          "{ed.eventText}"
        </div>
        {maxSteps > 1 && (
          <div style={{ fontSize:11,color:"#b0a090",marginBottom:16 }}>
            경고 {step}/{maxSteps}
          </div>
        )}
        <div style={{ fontSize:13,color:"#999",marginBottom:24 }}>
          이 유혹에 넘어갈 거야?
        </div>
        <div style={{ display:"flex",gap:12,justifyContent:"center" }}>
          <div onClick={onResist} style={{ flex:1,padding:"14px 20px",background:"#f0f0f0",borderRadius:14,
            cursor:"pointer",fontSize:15,fontWeight:700,color:"#666",transition:"background 0.2s" }}
            onMouseEnter={e=>e.target.style.background="#e8e8e8"}
            onMouseLeave={e=>e.target.style.background="#f0f0f0"}>
            😤 참기
          </div>
          <div onClick={onConfirm} style={{ flex:1,padding:"14px 20px",
            background:ed.btnColor||"#e8573d",borderRadius:14,
            cursor:"pointer",fontSize:15,fontWeight:700,color:"#fff",
            boxShadow:`0 4px 16px ${ed.btnColor||"#e8573d"}44`,
            transition:"transform 0.2s" }}
            onMouseEnter={e=>e.target.style.transform="scale(1.04)"}
            onMouseLeave={e=>e.target.style.transform="scale(1)"}>
            {ed.btn}
          </div>
        </div>
      </div>
    </div>
  );
}

function StageClearScreen({ stage, onNext, frame }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    const ts = [setTimeout(()=>setStep(1),400), setTimeout(()=>setStep(2),1200), setTimeout(()=>setStep(3),2000)];
    return () => ts.forEach(clearTimeout);
  }, [stage]);
  return (
    <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",
      background:"radial-gradient(ellipse at 50% 40%,#f0faf5,#e8f0f5 60%,#e0f0e8)",
      position:"relative",overflow:"hidden" }}>
      {step >= 1 && <div style={{ fontSize:60,marginBottom:16,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>🎉</div>}
      {step >= 1 && <div style={{ fontSize:14,color:"#2e9e5a88",letterSpacing:8,marginBottom:8,
        animation:"fadeInUp 0.5s ease" }}>STAGE CLEAR</div>}
      {step >= 2 && <div style={{ fontSize:36,fontWeight:800,color:"#2e9e5a",marginBottom:8,letterSpacing:6,
        animation:"fadeInUp 0.6s ease" }}>Stage {stage} 클리어!</div>}
      {step >= 2 && <div style={{ fontSize:16,color:"#666",marginBottom:32,
        animation:"fadeInUp 0.7s ease" }}>{STAGE_NAMES[stage]}의 유혹을 이겨냈다!</div>}
      {step >= 3 && (
        <div onClick={onNext} style={{ padding:"14px 40px",background:"#2e9e5a",borderRadius:14,
          cursor:"pointer",animation:"fadeInUp 0.6s ease",
          boxShadow:"0 8px 32px #2e9e5a33",transition:"transform 0.2s" }}
          onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
          onMouseLeave={e=>e.target.style.transform="scale(1)"}>
          <span style={{ color:"#fff",fontSize:16,fontWeight:800,letterSpacing:4 }}>
            {stage < STAGE_COUNT ? "NEXT STAGE" : "결과 보기"}
          </span>
        </div>
      )}
      <div style={{ position:"absolute",bottom:"8%",opacity:0.25 }}>
        <NaviCharacter emotion="excited" frame={frame} size={100}/>
      </div>
    </div>
  );
}

function AllClearScreen({ onBack, frame }) {
  const [step, setStep] = useState(0);
  useEffect(() => {
    setStep(0);
    const ts = [setTimeout(()=>setStep(1),400), setTimeout(()=>setStep(2),1500), setTimeout(()=>setStep(3),2500), setTimeout(()=>setStep(4),3500)];
    return () => ts.forEach(clearTimeout);
  }, []);
  return (
    <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
      justifyContent:"center",
      background:"radial-gradient(ellipse at 50% 40%,#fffaf0,#fff0e5 60%,#ffe8d8)",
      position:"relative",overflow:"hidden" }}>
      {step >= 1 && <div style={{ fontSize:80,marginBottom:16,animation:"popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)" }}>🏆</div>}
      {step >= 2 && <div style={{ fontSize:14,color:"#ffa72688",letterSpacing:8,marginBottom:8,
        animation:"fadeInUp 0.6s ease" }}>ALL STAGES CLEAR</div>}
      {step >= 2 && <div style={{ fontSize:36,fontWeight:800,color:"#e8573d",marginBottom:8,letterSpacing:6,
        animation:"fadeInUp 0.7s ease",textShadow:"0 4px 20px #e8573d22" }}>올 클리어!</div>}
      {step >= 3 && <div style={{ maxWidth:360,textAlign:"center",animation:"fadeInUp 0.8s ease" }}>
        <div style={{ fontSize:16,color:"#4a3a2a",lineHeight:1.8,marginBottom:8 }}>
          "대... 대단해!! 5단계를 전부 클리어하다니!"
        </div>
        <div style={{ fontSize:14,color:"#b0a090" }}>
          "너 정말 유혹에 강한 인간이야... 인정!"
        </div>
      </div>}
      {step >= 4 && <>
        <div style={{ marginTop:24,marginBottom:16 }}>
          <NaviCharacter emotion="excited" frame={frame} size={140}/>
        </div>
        <div onClick={onBack} style={{ padding:"14px 40px",background:"#e8573d",borderRadius:14,
          cursor:"pointer",animation:"fadeInUp 0.6s ease",
          boxShadow:"0 8px 32px #e8573d33",transition:"transform 0.2s" }}
          onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
          onMouseLeave={e=>e.target.style.transform="scale(1)"}>
          <span style={{ color:"#fff",fontSize:16,fontWeight:800,letterSpacing:4 }}>타이틀로</span>
        </div>
      </>}
    </div>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
function DontPressTheButton() {
  const [gs, setGs] = useState("title");
  const [activeEvent, setActiveEvent] = useState(null);
  const [collected, setCollected] = useState(() => {
    try { const s = localStorage.getItem(SAVE_KEY); return s ? JSON.parse(s) : []; } catch { return []; }
  });
  const [frame, setFrame] = useState(0);
  const [nEmo, setNEmo] = useState("idle");
  const [nText, setNText] = useState("");
  const [nKey, setNKey] = useState(0);
  const [endingData, setEndingData] = useState(null);
  const [hoverCount, setHoverCount] = useState(0);
  const [bgClicks, setBgClicks] = useState([]);
  const [doorKnocks, setDoorKnocks] = useState(0);
  const [idleTimer, setIdleTimer] = useState(0);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [showBSOD, setShowBSOD] = useState(false);
  const [showNews, setShowNews] = useState(false);
  const [showStock, setShowStock] = useState(false);
  const [showRunaway, setShowRunaway] = useState(false);
  const [marshmallowTimer, setMarshmallowTimer] = useState(60);
  const [marshmallowActive, setMarshmallowActive] = useState(false);
  const [countdownVal, setCountdownVal] = useState(null);
  const [catEars, setCatEars] = useState(false);
  const [doorOpen, setDoorOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [killMode, setKillMode] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [naviSleeping, setNaviSleeping] = useState(false);
  const [cakeSelected, setCakeSelected] = useState(false);
  const [cakeOnButton, setCakeOnButton] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [naviGone, setNaviGone] = useState(false);
  const [wasHidden, setWasHidden] = useState(false);
  const [naviYawn, setNaviYawn] = useState(false);
  const [introStep, setIntroStep] = useState(0);
  const [screenShake, setScreenShake] = useState(false);
  const [playCount, setPlayCount] = useState(() => {
    try { return parseInt(localStorage.getItem("dpb_plays") || "0"); } catch { return 0; }
  });

  // ── 스테이지 시스템 상태 ──
  const [gameMode, setGameMode] = useState(null);
  const [currentStage, setCurrentStage] = useState(1);
  const [stageTimer, setStageTimer] = useState(0);
  const [activeObjects, setActiveObjects] = useState([]);
  const [warningData, setWarningData] = useState(null);
  const [stageCleared, setStageCleared] = useState(() => {
    try { return parseInt(localStorage.getItem("dpb_stage_cleared") || "0"); } catch { return 0; }
  });
  const [temptationLevel, setTemptationLevel] = useState(0);
  const [objectGlows, setObjectGlows] = useState([]);

  const lastLine = useRef(null);
  const idleRef = useRef(0);
  const bannerTimerRef = useRef(null);
  const marshmallowRef = useRef(null);
  const naviIntervalRef = useRef(null);
  const stageDialogueRef = useRef(-1);

  const say = useCallback((text, emotion) => { setNEmo(emotion || "idle"); setNText(text); setNKey(p => p + 1); }, []);
  const doShake = useCallback(() => { setScreenShake(true); setTimeout(() => setScreenShake(false), 400); }, []);

  useEffect(() => { const iv = setInterval(() => setFrame(p => p + 1), 350); return () => clearInterval(iv); }, []);

  // ── 스프라이트 프리로드 (room 진입 시 나머지 시트) ──
  useEffect(() => {
    if (gs === "room") {
      ["excited","pouty","shocked","smug","cry","catears"].forEach(preloadNaviSprite);
    }
  }, [gs]);

  // ── 인트로 ──
  useEffect(() => {
    if (gs !== "title") return;
    setIntroStep(0);
    const ts = [setTimeout(()=>setIntroStep(1),400), setTimeout(()=>setIntroStep(2),1200),
      setTimeout(()=>setIntroStep(3),2000), setTimeout(()=>setIntroStep(4),2800)];
    return () => ts.forEach(clearTimeout);
  }, [gs]);

  // ── 엔딩21 체크 ──
  useEffect(() => {
    if (gs === "title" && collected.length >= 20) {
      if (Array.from({length:20},(_,i)=>i+1).every(id => collected.includes(id))) {
        setGs("credits"); recordEnding(21);
      }
    }
  }, [gs, collected]);

  // ── 방 진입 초기화 ──
  useEffect(() => {
    if (gs !== "room") return;
    setActiveEvent(null); setHoverCount(0); setBgClicks([]); setDoorKnocks(0); setIdleTimer(0);
    setBannerVisible(false); setShowBSOD(false); setShowNews(false); setShowStock(false);
    setShowRunaway(false); setMarshmallowActive(false); setMarshmallowTimer(60); setCountdownVal(null);
    setCatEars(false); setDoorOpen(false); setKillMode(false); setNaviSleeping(false);
    setCakeSelected(false); setCakeOnButton(false); setDarkMode(false); setNaviGone(false);
    setWasHidden(false); setNaviYawn(false); setContextMenu(null); idleRef.current = 0;
    setWarningData(null); setObjectGlows([]);
    if (gameMode === "stage") {
      setStageTimer(STAGE_DURATIONS[currentStage]);
      setActiveObjects([]);
      setTemptationLevel(0);
      stageDialogueRef.current = -1;
    } else {
      say("어서와~ 이 방에 비밀이 많거든! 근데 버튼은 누르면 안 돼~", "excited");
      bannerTimerRef.current = setTimeout(() => setBannerVisible(true), BANNER_DELAY);
    }
    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      if (marshmallowRef.current) clearInterval(marshmallowRef.current);
      if (naviIntervalRef.current) clearInterval(naviIntervalRef.current);
    };
  }, [gs, say, gameMode, currentStage]);

  // ── 나비 랜덤 대사 (자유 모드만) ──
  useEffect(() => {
    if (gs !== "room" || activeEvent || gameMode === "stage") return;
    naviIntervalRef.current = setInterval(() => {
      if (activeEvent || naviSleeping) return;
      const line = pickRandom(NAVI_IDLE, lastLine);
      if (line) say(line.t, line.e);
    }, 6000);
    return () => { if (naviIntervalRef.current) clearInterval(naviIntervalRef.current); };
  }, [gs, activeEvent, naviSleeping, say, gameMode]);

  // ── 방치 감지 (엔딩16) ──
  useEffect(() => {
    if (gs !== "room" || activeEvent) return;
    if (gameMode === "stage" && !activeObjects.includes(16)) return;
    const iv = setInterval(() => {
      idleRef.current += 1; setIdleTimer(idleRef.current);
      if (idleRef.current >= IDLE_LIMIT && !activeEvent) {
        if (gameMode === "stage") attemptEnding(16);
        else triggerEnding(16);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [gs, activeEvent, gameMode, activeObjects]);

  const resetIdle = useCallback(() => { idleRef.current = 0; setIdleTimer(0); }, []);

  // ── 창 숨김 (엔딩4) ──
  useEffect(() => {
    if (gs !== "room") return;
    const handler = () => {
      if (document.hidden) { setWasHidden(true); setNaviYawn(true); }
      else if (wasHidden && !activeEvent) {
        setNaviYawn(false);
        if (gameMode === "stage" && !activeObjects.includes(4)) return;
        if (gameMode === "stage") attemptEnding(4);
        else triggerEnding(4);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [gs, wasHidden, activeEvent, gameMode, activeObjects]);

  // ── 마시멜로 타이머 ──
  useEffect(() => {
    if (!marshmallowActive) return;
    marshmallowRef.current = setInterval(() => {
      setMarshmallowTimer(p => {
        if (p <= 1) { clearInterval(marshmallowRef.current); setMarshmallowActive(false);
          say("헐... 진짜 1분 버텼어?! 대단한데?!", "shocked"); setActiveEvent(null); return 60; }
        return p - 1;
      });
    }, 1000);
    return () => { if (marshmallowRef.current) clearInterval(marshmallowRef.current); };
  }, [marshmallowActive, say]);

  // ── 카운트다운 ──
  useEffect(() => {
    if (countdownVal === null || countdownVal <= 0) return;
    const t = setTimeout(() => setCountdownVal(p => p !== null ? p - 1 : null), 1000);
    return () => clearTimeout(t);
  }, [countdownVal]);

  // ── 엔딩20 체크 (자유 모드만) ──
  useEffect(() => {
    if (gs !== "room" || activeEvent || gameMode === "stage") return;
    const first19 = Array.from({length:19},(_,i)=>i+1);
    if (first19.every(id => collected.includes(id)) && !collected.includes(20)) {
      const t = setTimeout(() => {
        if (!activeEvent) {
          say("재미없어. 나 갈래.", "pouty");
          setTimeout(() => { setNaviGone(true);
            setTimeout(() => { setDarkMode(true); setActiveEvent(20); }, 2000);
          }, 2000);
        }
      }, 30000);
      return () => clearTimeout(t);
    }
  }, [gs, collected, activeEvent, say, gameMode]);

  // ── 스테이지 타이머 ──
  useEffect(() => {
    if (gs !== "room" || gameMode !== "stage" || warningData) return;
    const iv = setInterval(() => {
      setStageTimer(prev => {
        if (prev <= 1) {
          clearInterval(iv);
          const clearedStage = currentStage;
          setStageCleared(old => {
            const next = Math.max(old, clearedStage);
            localStorage.setItem("dpb_stage_cleared", String(next));
            return next;
          });
          if (clearedStage >= STAGE_COUNT) setGs("all_clear");
          else setGs("stage_clear");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(iv);
  }, [gs, gameMode, warningData, currentStage]);

  // ── 오브젝트 활성화 스케줄 ──
  useEffect(() => {
    if (gs !== "room" || gameMode !== "stage") return;
    const elapsed = STAGE_DURATIONS[currentStage] - stageTimer;
    const newActive = [];
    const newGlows = [];
    for (let s = 1; s < currentStage; s++) {
      const schedule = STAGE_OBJECT_SCHEDULE[s];
      if (schedule) schedule.forEach(item => newActive.push(...item.objects));
    }
    const schedule = STAGE_OBJECT_SCHEDULE[currentStage];
    if (schedule) {
      schedule.forEach(item => {
        if (elapsed >= item.at) {
          newActive.push(...item.objects);
          if (elapsed - item.at < 5) newGlows.push(...item.objects);
        }
      });
    }
    setActiveObjects(newActive);
    setObjectGlows(newGlows);
  }, [gs, gameMode, currentStage, stageTimer]);

  // ── 스테이지 대사 타임라인 ──
  useEffect(() => {
    if (gs !== "room" || gameMode !== "stage" || warningData) return;
    const elapsed = STAGE_DURATIONS[currentStage] - stageTimer;
    const dialogue = STAGE_DIALOGUE[currentStage];
    if (!dialogue) return;
    let latestIdx = -1;
    for (let i = 0; i < dialogue.length; i++) {
      if (dialogue[i].at <= elapsed) latestIdx = i;
    }
    if (latestIdx > stageDialogueRef.current) {
      stageDialogueRef.current = latestIdx;
      say(dialogue[latestIdx].t, dialogue[latestIdx].e);
    }
  }, [gs, gameMode, currentStage, stageTimer, warningData, say]);

  // ── 유혹 게이지 ──
  useEffect(() => {
    if (gs !== "room" || gameMode !== "stage") { setTemptationLevel(0); return; }
    const duration = STAGE_DURATIONS[currentStage];
    const elapsed = duration - stageTimer;
    const base = (elapsed / duration) * 50;
    const objectBonus = activeObjects.length * 3;
    setTemptationLevel(Math.min(base + objectBonus, 100));
  }, [gs, gameMode, currentStage, stageTimer, activeObjects]);

  // ── 스테이지 모드 배너 활성화 ──
  useEffect(() => {
    if (gs !== "room" || gameMode !== "stage") return;
    if (activeObjects.includes(5) && !bannerVisible) setBannerVisible(true);
  }, [gs, gameMode, activeObjects, bannerVisible]);

  const recordEnding = useCallback((id) => {
    setCollected(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  // ── 오브젝트 활성 체크 헬퍼 ──
  const isObjectActive = useCallback((endingId) => {
    if (gameMode !== "stage") return true;
    return activeObjects.includes(endingId);
  }, [gameMode, activeObjects]);

  // ── 오브젝트 글로우 스타일 헬퍼 ──
  const getObjectStyle = useCallback((endingId) => {
    if (gameMode !== "stage") return {};
    const active = activeObjects.includes(endingId);
    const glowing = objectGlows.includes(endingId);
    return {
      opacity: active ? 1 : 0.3,
      pointerEvents: active ? "auto" : "none",
      filter: glowing ? "drop-shadow(0 0 12px #ffd700) drop-shadow(0 0 24px #ffa50066)" : undefined,
      animation: glowing ? "objectGlow 1.5s ease infinite" : undefined,
    };
  }, [gameMode, activeObjects, objectGlows]);

  const triggerEnding = useCallback((id) => {
    if (activeEvent) return;
    resetIdle(); const ed = ENDINGS[id]; if (!ed) return;
    setActiveEvent(id);
    if (id !== 16 && id !== 4 && id !== 20) {
      const disc = pickRandom(NAVI_DISCOVER, lastLine);
      if (disc) say(disc.t, disc.e);
      setTimeout(() => say(ed.eventText, ed.eventEmo), 1500);
    } else { say(ed.eventText, ed.eventEmo); }
    switch(id) {
      case 2: setMarshmallowActive(true); setMarshmallowTimer(60); break;
      case 7: setShowBSOD(true); doShake(); setTimeout(() => setShowBSOD(false), 2500); break;
      case 8: setShowRunaway(true); break;
      case 10: setShowStock(true); break;
      case 11: setCatEars(true); break;
      case 13: setCountdownVal(3); doShake(); break;
      case 14: setShowNews(true); doShake(); break;
      case 15: setNEmo("cry"); break;
      case 16: setNaviSleeping(true); break;
      case 18: setDoorOpen(true); break;
    }
  }, [activeEvent, say, resetIdle, doShake]);

  // ── 스테이지 모드 경고 시스템 ──
  const attemptEnding = useCallback((id) => {
    if (activeEvent || warningData) return;
    if (!isObjectActive(id)) return;
    if (gameMode === "stage") {
      const maxSteps = WARNING_STEPS[id] || 1;
      setWarningData({ endingId: id, step: 1, maxSteps });
    } else {
      triggerEnding(id);
    }
  }, [activeEvent, warningData, gameMode, isObjectActive, triggerEnding]);

  const handleWarningConfirm = useCallback(() => {
    if (!warningData) return;
    const { endingId, step, maxSteps } = warningData;
    if (step < maxSteps) {
      setWarningData({ ...warningData, step: step + 1 });
    } else {
      const ed = ENDINGS[endingId];
      setWarningData(null);
      recordEnding(endingId);
      if (endingId === 17) {
        setEndingData({ ...ed, over1: playCount > 0 ? "또 왔어? 학습 능력이 없어?" : "처음으로 돌아갈래?", over2: "(타이틀 복귀)" });
      } else { setEndingData(ed); }
      doShake();
      setGs("ending");
    }
  }, [warningData, recordEnding, playCount, doShake]);

  const handleWarningResist = useCallback(() => {
    setWarningData(null);
    say("오! 참았어?! 대단한데~!", "shocked");
  }, [say]);

  const pressEventButton = useCallback(() => {
    if (!activeEvent) return;
    const id = activeEvent; const ed = ENDINGS[id];
    recordEnding(id);
    setShowBSOD(false); setShowNews(false); setShowStock(false); setShowRunaway(false);
    setMarshmallowActive(false); setCountdownVal(null);
    if (id === 17) {
      setEndingData({ ...ed, over1: playCount > 0 ? "또 왔어? 학습 능력이 없어?" : "처음으로 돌아갈래?", over2: "(타이틀 복귀)" });
    } else if (id === 20) {
      setEndingData({ ...ed, over1:"(조명 꺼짐)", over2:"(영원한 고립)" });
    } else { setEndingData(ed); }
    doShake();
    setGs("ending");
  }, [activeEvent, recordEnding, playCount, doShake]);

  const pressMainButton = useCallback(() => {
    if (activeEvent) { pressEventButton(); return; }
    resetIdle(); say("누르지 말라고 했잖아~! ...아직 아무 일도 안 일어났지만.", "pouty");
  }, [activeEvent, pressEventButton, say, resetIdle]);

  const handleBgClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    const now = Date.now();
    setBgClicks(prev => {
      const recent = [...prev.filter(t => now - t < RAPID_CLICK_WINDOW), now];
      if (recent.length >= RAPID_CLICK_THRESHOLD) {
        if (gameMode === "stage" && !activeObjects.includes(7)) return recent;
        if (gameMode === "stage") { attemptEnding(7); return []; }
        triggerEnding(7); return [];
      }
      return recent;
    });
  }, [activeEvent, resetIdle, triggerEnding, attemptEnding, gameMode, activeObjects]);

  const handleButtonHover = useCallback((isEnter) => {
    if (activeEvent) return; resetIdle();
    if (isEnter) setHoverCount(prev => {
      const n = prev+1;
      if (n >= HOVER_THRESHOLD) {
        if (gameMode === "stage" && !activeObjects.includes(3)) return n;
        if (gameMode === "stage") { attemptEnding(3); return 0; }
        triggerEnding(3); return 0;
      }
      return n;
    });
  }, [activeEvent, resetIdle, triggerEnding, attemptEnding, gameMode, activeObjects]);

  const handleDoorKnock = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (gameMode === "stage" && !activeObjects.includes(18)) return;
    setDoorKnocks(prev => {
      const n = prev+1;
      if (n === 1) say("똑똑...", "idle");
      else if (n === 3) say("누구세요~?", "idle");
      if (n >= DOOR_KNOCK_THRESHOLD) {
        if (gameMode === "stage") { attemptEnding(18); return 0; }
        triggerEnding(18); return 0;
      }
      return n;
    });
  }, [activeEvent, resetIdle, say, triggerEnding, attemptEnding, gameMode, activeObjects]);

  const handleNaviContextMenu = useCallback((e) => {
    e.preventDefault(); if (activeEvent) return; resetIdle();
    if (gameMode === "stage" && !activeObjects.includes(1)) return;
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, [activeEvent, resetIdle, gameMode, activeObjects]);

  const currentEnding = activeEvent ? ENDINGS[activeEvent] : null;
  const buttonLabel = currentEnding ? currentEnding.btn : "누르지 마";
  const buttonColor = currentEnding ? currentEnding.btnColor : "#e8573d";
  const freeUnlocked = stageCleared >= 1 || collected.length >= 1;

  const restart = useCallback(() => {
    const pc = playCount + 1; setPlayCount(pc);
    localStorage.setItem("dpb_plays", String(pc));
    setEndingData(null); setActiveEvent(null); setGameMode(null);
    setCurrentStage(1); setStageTimer(0); setActiveObjects([]);
    setWarningData(null); setTemptationLevel(0); setObjectGlows([]);
    stageDialogueRef.current = -1;
    setGs("title");
  }, [playCount]);

  const startStageMode = useCallback(() => {
    setGameMode("stage"); setCurrentStage(1); setGs("stage_intro");
  }, []);

  const startFreeMode = useCallback(() => {
    setGameMode("free"); setGs("room");
  }, []);

  const startNextStage = useCallback(() => {
    setCurrentStage(prev => prev + 1); setGs("stage_intro");
  }, []);

  const startStageRoom = useCallback(() => {
    setGs("room");
  }, []);

  // ════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════
  return (
    <div onClick={gs === "room" && !activeEvent ? handleBgClick : undefined}
      onMouseMove={gs === "room" ? resetIdle : undefined}
      style={{ width:"100vw",height:"100vh",overflow:"hidden",position:"relative",
        fontFamily:"'Noto Sans KR',sans-serif",
        background:darkMode?"#000":"#f5f2ee",transition:"background 1.5s",
        transform:screenShake?"translate(2px,-2px)":"none" }}>

      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap" rel="stylesheet"/>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.5)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shake{0%{transform:translateX(-2px)}25%{transform:translateX(2px)}50%{transform:translateX(-2px)}75%{transform:translateX(1px)}100%{transform:translateX(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes ticker{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
        @keyframes scanline{0%{top:-5%}100%{top:105%}}
        @keyframes zzz{0%{opacity:0;transform:translateY(0) scale(0.7)}50%{opacity:1;transform:translateY(-18px) scale(1)}100%{opacity:0;transform:translateY(-36px) scale(0.5)}}
        @keyframes siren{0%{background:#e8573d15}50%{background:#1565c015}100%{background:#e8573d15}}
        @keyframes darkFade{from{opacity:0}to{opacity:1}}
        @keyframes bsodProgress{from{width:0%}to{width:30%}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 24px rgba(232,87,61,0.15)}50%{box-shadow:0 0 48px rgba(232,87,61,0.35)}}
        @keyframes starTwinkle{0%,100%{opacity:0.2}50%{opacity:1}}
        @keyframes gentleBob{0%,100%{transform:translateY(0)}50%{transform:translateY(-3px)}}
        @keyframes titleGlow{0%,100%{text-shadow:0 0 20px #e8573d22}50%{text-shadow:0 0 40px #e8573d44,0 0 80px #e8573d11}}
        @keyframes buttonAura{0%,100%{box-shadow:0 0 30px #e8573d15,0 0 60px #e8573d08}50%{box-shadow:0 0 50px #e8573d25,0 0 100px #e8573d12}}
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes crtScan{0%{top:-20%}100%{top:120%}}
        @keyframes crtFlicker{0%,100%{opacity:0.02}50%{opacity:0.05}}
        @keyframes crtStatic{0%{background-position:0 0}100%{background-position:100% 100%}}
        @keyframes objectGlow{0%,100%{filter:drop-shadow(0 0 8px #ffd700) drop-shadow(0 0 16px #ffa50044)}50%{filter:drop-shadow(0 0 16px #ffd700) drop-shadow(0 0 32px #ffa50066)}}
        .cursor-blink{animation:pulse 0.6s step-end infinite;opacity:0.5}
        *{box-sizing:border-box;margin:0;padding:0;user-select:none;}
      `}</style>

      {/* ═══════════ TITLE ═══════════ */}
      {gs === "title" && (
        <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",
          background:"radial-gradient(ellipse at 50% 40%,#faf5f0,#f0e8f5 60%,#e8e0f0)",
          cursor:"pointer",position:"relative",overflow:"hidden" }}
          onClick={() => { resetIdle(); setGs("mode_select"); }}>

          {/* 배경 장식 원 */}
          <div style={{ position:"absolute",top:"10%",left:"8%",width:280,height:280,borderRadius:"50%",
            background:"radial-gradient(circle,#e8573d06,transparent 70%)" }}/>
          <div style={{ position:"absolute",bottom:"15%",right:"10%",width:200,height:200,borderRadius:"50%",
            background:"radial-gradient(circle,#a33de806,transparent 70%)" }}/>
          <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
            width:500,height:500,borderRadius:"50%",
            background:"radial-gradient(circle,#e8573d04,transparent 60%)" }}/>

          {/* 타이틀 텍스트 */}
          {introStep>=1 && (
            <div style={{ fontSize:20,color:"#e8573d",fontWeight:800,letterSpacing:12,
              animation:"fadeInUp 0.7s ease",textTransform:"uppercase" }}>
              DON'T PRESS
            </div>
          )}
          {introStep>=2 && (
            <div style={{ fontSize:56,color:"#e8573d",fontWeight:800,letterSpacing:14,marginTop:4,
              animation:"popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)",
              textShadow:"0 4px 30px #e8573d22" }}>
              THE BUTTON
            </div>
          )}
          {introStep>=3 && (
            <div style={{ fontSize:14,color:"#e8573d44",marginTop:20,letterSpacing:8,
              animation:"fadeInUp 0.6s ease",fontStyle:"italic" }}>
              ...or should you?
            </div>
          )}
          {introStep>=4 && <>
            <div style={{ fontSize:13,color:"#c0b8b0",marginTop:40,animation:"pulse 2.5s ease infinite",
              letterSpacing:3 }}>
              ▶ 클릭하여 시작
            </div>
            {collected.length > 0 && (
              <div style={{ fontSize:12,color:"#a33de8",marginTop:18,animation:"fadeIn 0.8s ease",
                letterSpacing:2 }}>
                ✦ {collected.length}/21 엔딩 수집됨
              </div>
            )}
            <div style={{ position:"absolute",bottom:"6%",right:"10%",opacity:0.12,animation:"fadeIn 2s ease" }}>
              <NaviCharacter emotion="smug" frame={frame} size={120}/>
            </div>
          </>}
        </div>
      )}

      {/* ═══════════ MODE SELECT ═══════════ */}
      {gs === "mode_select" && (
        <ModeSelectScreen
          onSelectStage={startStageMode}
          onSelectFree={startFreeMode}
          freeUnlocked={freeUnlocked}
          collected={collected}
          frame={frame}
        />
      )}

      {/* ═══════════ STAGE INTRO ═══════════ */}
      {gs === "stage_intro" && (
        <StageIntroScreen stage={currentStage} onStart={startStageRoom} frame={frame}/>
      )}

      {/* ═══════════ ROOM ═══════════ */}
      {gs === "room" && (
        <div style={{ width:"100%",height:"100%",position:"relative",overflow:"hidden" }}>

          {/* ══ 전체 배경 (화면 끝까지) ══ */}
          <div style={{ position:"absolute",inset:0,
            background:"linear-gradient(180deg,#ede5d5 0%,#e8dcc8 50%,#b09868 50.8%,#c8a878 51%,#b89868 65%,#a08050 100%)" }}/>

          {/* ══ 중앙 고정 컨테이너 ══ */}
          <div style={{ position:"relative",width:"100%",maxWidth:1100,height:"100%",margin:"0 auto",overflow:"visible" }}>

          {/* ══ 벽면 (0% - 50%) ══ */}
          <div style={{ position:"absolute",top:0,left:0,right:0,height:"50%",
            background:"linear-gradient(180deg,#f2ead8 0%,#ece3d2 40%,#e6dcc8 80%,#e2d8c4 100%)",overflow:"hidden",
            borderLeft:"4px solid #d8ccb4",borderRight:"4px solid #d8ccb4" }}>
            {/* Subtle damask/diamond wall pattern */}
            <div style={{ position:"absolute",inset:0,opacity:0.025,
              backgroundImage:`radial-gradient(ellipse at 50% 50%, #8a7060 1px, transparent 1px),
                radial-gradient(ellipse at 50% 50%, #8a7060 1px, transparent 1px)`,
              backgroundSize:"40px 40px",
              backgroundPosition:"0 0, 20px 20px" }}/>
            {/* Crown molding */}
            <div style={{ position:"absolute",top:0,left:0,right:0,height:10,
              background:"linear-gradient(180deg,#c8b898,#d8cbb8,#d0c0a8)",
              boxShadow:"0 3px 10px rgba(0,0,0,0.08)",
              borderBottom:"1px solid #c0a888" }}/>
            {/* 하단 웨인스코팅 - improved with panels */}
            <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"28%",
              background:"linear-gradient(180deg,#e0d6c0,#d8ccb4)",
              borderTop:"3px solid #c8b898" }}>
              {/* Wainscoting panel insets */}
              <div style={{ position:"absolute",inset:"8px 5%",display:"flex",gap:12 }}>
                {[...Array(8)].map((_,i) => (
                  <div key={i} style={{ flex:1,borderRadius:3,
                    border:"1.5px solid #d0c4ac",
                    boxShadow:"inset 1px 1px 3px rgba(0,0,0,0.04), inset -1px -1px 2px rgba(255,255,255,0.3)",
                    background:"linear-gradient(180deg,#e4dac6,#dcd0ba)" }}/>
                ))}
              </div>
            </div>
          </div>

          {/* ══ 베이스보드 (벽-바닥 경계, exactly at 50%) ══ */}
          <div style={{ position:"absolute",top:"50%",left:0,right:0,height:10,zIndex:8,
            background:"linear-gradient(180deg,#d4b888,#c0a070,#a88858)",
            boxShadow:"0 4px 16px rgba(0,0,0,0.2)",
            borderTop:"2px solid #e0c898",borderBottom:"2px solid #906838" }}/>

          {/* ══ 바닥 (50%+10px to 100%) - wood with perspective gradient ══ */}
          <div style={{ position:"absolute",top:"calc(50% + 10px)",left:0,right:0,bottom:0,overflow:"hidden" }}>
            {/* Main floor color - darker toward viewer creates depth */}
            <div style={{ position:"absolute",inset:0,
              background:"linear-gradient(180deg,#c8a878 0%,#b89868 25%,#a88858 55%,#987848 80%,#886838 100%)" }}/>
            {/* Plank lines */}
            <div style={{ position:"absolute",inset:0,opacity:0.07,
              backgroundImage:"repeating-linear-gradient(180deg,transparent,transparent 44px,#4a2810 44px,#4a2810 45px)" }}/>
            {/* Subtle grain */}
            <div style={{ position:"absolute",inset:0,opacity:0.03,
              backgroundImage:"repeating-linear-gradient(93deg,transparent,transparent 70px,#3a2010 70px,#3a2010 71px)" }}/>
            {/* Shadow near wall (ambient occlusion for depth) */}
            <div style={{ position:"absolute",top:0,left:0,right:0,height:25,
              background:"linear-gradient(180deg,rgba(0,0,0,0.08),transparent)" }}/>
          </div>

          {/* ══ 책상 - 3D 가구 (top surface + front face + legs) ══ */}
          {/* Desk shadow on floor */}
          <div style={{ position:"absolute",top:"78%",left:"13%",right:"13%",height:"4%",zIndex:9,
            background:"radial-gradient(ellipse at 50% 20%,rgba(0,0,0,0.12),transparent 80%)",
            pointerEvents:"none" }}/>
          {/* Desk top surface (thin lighter wood strip) */}
          <div style={{ position:"absolute",top:"60%",left:"12%",right:"12%",height:12,zIndex:12,
            background:"linear-gradient(180deg,#d4b888,#c8a878,#bfa070)",
            borderRadius:"3px 3px 0 0",
            boxShadow:"0 -2px 8px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.1)",
            borderTop:"2px solid #e0c898" }}/>
          {/* Desk front face (with drawers) */}
          <div style={{ position:"absolute",top:"calc(60% + 12px)",left:"12%",right:"12%",height:"16%",zIndex:12,
            background:"linear-gradient(180deg,#a88050 0%,#9a7040 30%,#8c6235 70%,#805830 100%)",
            overflow:"hidden",
            borderLeft:"4px solid #6a4a28",borderRight:"4px solid #6a4a28" }}>
            {/* Wood grain on front face */}
            <div style={{ position:"absolute",inset:0,opacity:0.08,
              backgroundImage:`repeating-linear-gradient(92deg,transparent,transparent 40px,#4a2810 40px,#4a2810 41px),
                repeating-linear-gradient(88deg,transparent,transparent 65px,#3a1808 65px,#3a1808 66px)`,
              backgroundSize:"60px 100%, 90px 100%" }}/>
            {/* Three drawers */}
            <div style={{ position:"absolute",inset:"8px 6%",display:"flex",gap:8 }}>
              {[0,1,2].map(i => (
                <div key={i} style={{ flex:1,borderRadius:4,
                  border:"2px solid #7a5a30",
                  background:"linear-gradient(180deg,#9a7848,#8a6838)",
                  boxShadow:"inset 1px 1px 3px rgba(0,0,0,0.08), inset -1px -1px 2px rgba(255,255,255,0.05)",
                  position:"relative" }}>
                  {/* Drawer handle */}
                  <div style={{ position:"absolute",top:"45%",left:"50%",transform:"translate(-50%,-50%)",
                    width:28,height:8,borderRadius:4,
                    background:"linear-gradient(180deg,#d4b080,#b89060)",border:"1px solid #a08050",
                    boxShadow:"0 1px 3px rgba(0,0,0,0.15)" }}/>
                </div>
              ))}
            </div>
          </div>
          {/* Desk legs */}
          <div style={{ position:"absolute",top:"calc(60% + 12px + 16%)",left:"14%",width:16,height:"8%",zIndex:11,
            background:"linear-gradient(90deg,#7a5a30,#8a6838,#7a5a30)",
            borderRadius:"0 0 3px 3px",
            boxShadow:"2px 0 4px rgba(0,0,0,0.1)" }}/>
          <div style={{ position:"absolute",top:"calc(60% + 12px + 16%)",right:"14%",width:16,height:"8%",zIndex:11,
            background:"linear-gradient(90deg,#7a5a30,#8a6838,#7a5a30)",
            borderRadius:"0 0 3px 3px",
            boxShadow:"-2px 0 4px rgba(0,0,0,0.1)" }}/>

          {/* ══ 달빛 ══ */}
          <div style={{ position:"absolute",left:"8%",top:0,width:400,height:"51%",
            background:"radial-gradient(ellipse at 40% 10%,rgba(200,210,255,0.06),transparent 60%)",
            pointerEvents:"none",zIndex:1 }}/>

          <ParticleOverlay/>

          {/* ════════════════════════════════════════ */}
          {/* ══ 벽면 오브젝트 (within 0-50% wall) ══ */}
          {/* ════════════════════════════════════════ */}

          {/* ── 문 (엔딩18) - FULL HEIGHT from ceiling to floor ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); handleDoorKnock(); }}
            style={{ position:"absolute",left:24,top:"1%",width:100,height:"49%",zIndex:10,...getObjectStyle(18),
              background:doorOpen?"linear-gradient(180deg,#1a1008,#0a0804)":"linear-gradient(178deg,#c49a68,#a87848,#926838)",
              border:"6px solid #7a5a3a",borderRadius:"4px 4px 0 0",
              boxShadow:doorOpen
                ?"inset 0 0 50px rgba(0,0,0,0.7)"
                :"0 8px 32px rgba(0,0,0,0.15), inset 0 2px 0 rgba(255,255,255,0.1)",
              transformOrigin:"left center",
              transform:doorOpen?"perspective(600px) rotateY(-65deg)":"none",
              transition:"transform 0.8s cubic-bezier(0.34,1.56,0.64,1), background 0.6s" }}
            hoverGlow="#8a6a4a">
            {!doorOpen && <>
              {/* Top panel */}
              <div style={{ position:"absolute",top:"3%",left:10,right:10,height:"28%",
                background:"linear-gradient(180deg,#b8905a,#a88050)",border:"2px solid #9a7040",borderRadius:4,
                boxShadow:"inset 0 1px 3px rgba(0,0,0,0.06)" }}/>
              {/* Bottom panel */}
              <div style={{ position:"absolute",top:"38%",left:10,right:10,height:"55%",
                background:"linear-gradient(180deg,#b8905a,#a88050)",border:"2px solid #9a7040",borderRadius:4,
                boxShadow:"inset 0 1px 3px rgba(0,0,0,0.06)" }}/>
              {/* Door handle */}
              <div style={{ position:"absolute",top:"48%",right:12,transform:"translateY(-50%)",
                width:10,height:28,background:"linear-gradient(180deg,#e0c060,#c0a030)",
                borderRadius:5,boxShadow:"0 2px 8px rgba(0,0,0,0.2)" }}/>
              {/* Keyhole */}
              <div style={{ position:"absolute",top:"54%",right:15,width:5,height:5,borderRadius:"50%",
                background:"#5a4a2a",boxShadow:"inset 0 1px 2px rgba(0,0,0,0.4)" }}/>
            </>}
            {doorKnocks > 0 && doorKnocks < DOOR_KNOCK_THRESHOLD && !doorOpen && (
              <div style={{ position:"absolute",top:-24,left:"50%",transform:"translateX(-50%)",
                fontSize:12,color:"#8a6a4a",fontWeight:700,animation:"popIn 0.2s ease",
                background:"rgba(255,255,255,0.9)",padding:"3px 10px",borderRadius:10,whiteSpace:"nowrap" }}>
                {"\uD83E\uDD1B"} x{doorKnocks}
              </div>
            )}
          </RoomObj>

          {/* ── 벽등 (장식, beside door) ── */}
          <div style={{ position:"absolute",left:138,top:"8%",zIndex:10,display:"flex",flexDirection:"column",alignItems:"center" }}>
            <div style={{ width:20,height:10,background:"linear-gradient(180deg,#d4b060,#b89040)",
              borderRadius:"10px 10px 0 0",border:"2px solid #a88030",borderBottom:"none" }}/>
            <div style={{ width:36,height:28,background:"radial-gradient(ellipse at 50% 0%,#ffd,#ffc,#ffe8a0)",
              borderRadius:"0 0 18px 18px",border:"2px solid #d4b060",borderTop:"none",
              boxShadow:"0 4px 20px rgba(255,220,100,0.2), 0 8px 40px rgba(255,200,60,0.08)" }}/>
            <div style={{ width:50,height:60,marginTop:-2,
              background:"radial-gradient(ellipse at 50% 0%,rgba(255,240,180,0.12),transparent 80%)",
              pointerEvents:"none" }}/>
          </div>

          {/* ── 창문 (high on wall) ── */}
          <div style={{ position:"absolute",left:"14%",top:"1%",width:230,height:180,zIndex:10 }}>
            {/* Curtain rod */}
            <div style={{ position:"absolute",top:-8,left:-20,right:-20,height:10,
              background:"linear-gradient(180deg,#d4a872,#b08050)",borderRadius:5,zIndex:2,
              boxShadow:"0 3px 8px rgba(0,0,0,0.12)" }}/>
            {/* Left curtain drape */}
            <div style={{ position:"absolute",left:-18,top:0,width:34,height:"108%",zIndex:2,
              background:"linear-gradient(90deg,#c49460,#b88848)",borderRadius:"0 0 8px 8px",
              boxShadow:"3px 0 10px rgba(0,0,0,0.08)" }}/>
            {/* Right curtain drape */}
            <div style={{ position:"absolute",right:-18,top:0,width:34,height:"108%",zIndex:2,
              background:"linear-gradient(270deg,#c49460,#b88848)",borderRadius:"0 0 8px 8px",
              boxShadow:"-3px 0 10px rgba(0,0,0,0.08)" }}/>
            {/* Window pane (night sky) */}
            <div style={{ position:"absolute",inset:0,
              background:"linear-gradient(180deg,#080618,#14103a,#0c0824)",
              border:"8px solid #c4a878",borderRadius:10,overflow:"hidden",
              boxShadow:"inset 0 0 50px rgba(0,0,0,0.5), 0 8px 30px rgba(0,0,0,0.15)" }}>
              {[{x:15,y:12,s:2.5},{x:50,y:8,s:2},{x:90,y:25,s:3},{x:150,y:6,s:2},{x:70,y:45,s:1.5},
                {x:28,y:55,s:2.5},{x:120,y:48,s:2.5},{x:180,y:60,s:2},{x:40,y:75,s:2},{x:85,y:80,s:1.5},
                {x:140,y:38,s:2},{x:200,y:22,s:2.5},{x:10,y:90,s:1.5},{x:190,y:75,s:2},{x:60,y:65,s:1.5},
                {x:170,y:85,s:1.8},{x:110,y:15,s:2},{x:220,y:50,s:1.5}
              ].map((s,i) => (
                <div key={i} style={{ position:"absolute",left:s.x,top:s.y,width:s.s,height:s.s,
                  borderRadius:"50%",background:"#fff",
                  animation:`starTwinkle ${2+Math.random()*3}s ease ${Math.random()*2}s infinite` }}/>
              ))}
              {/* Moon */}
              <div style={{ position:"absolute",right:22,top:18,width:36,height:36,borderRadius:"50%",
                background:"radial-gradient(circle at 55% 35%,#ffe,#ffd,#ffc)",
                boxShadow:"0 0 24px rgba(255,255,200,0.5), 0 0 60px rgba(255,255,200,0.15)" }}/>
              {/* Window cross bars */}
              <div style={{ position:"absolute",left:"50%",top:0,width:6,height:"100%",
                background:"#c4a878",transform:"translateX(-50%)",zIndex:1 }}/>
              <div style={{ position:"absolute",top:"50%",left:0,width:"100%",height:6,
                background:"#c4a878",transform:"translateY(-50%)",zIndex:1 }}/>
            </div>
          </div>

          {/* ── 액자 (장식, high on wall) ── */}
          <div style={{ position:"absolute",left:"42%",top:"4%",zIndex:10,
            width:68,height:86,borderRadius:4,
            background:"linear-gradient(180deg,#e8dcc8,#ddd0bc)",
            border:"6px solid #c4a878",boxShadow:"0 4px 16px rgba(0,0,0,0.1), inset 0 0 20px rgba(0,0,0,0.03)" }}>
            <div style={{ position:"absolute",inset:4,background:"linear-gradient(180deg,#d4c0a0,#c8b490)",borderRadius:2,
              display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}>
              {/* Simple landscape painting */}
              <div style={{ width:"100%",height:"100%",position:"relative" }}>
                <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"40%",
                  background:"linear-gradient(180deg,#7a9a60,#5a7a40)" }}/>
                <div style={{ position:"absolute",top:"15%",left:"25%",width:24,height:30,
                  background:"linear-gradient(180deg,#8a9aaa,#a0b0c0)",borderRadius:"40% 40% 0 0",opacity:0.5 }}/>
                <div style={{ position:"absolute",top:"5%",right:"20%",width:30,height:38,
                  background:"linear-gradient(180deg,#7a8a9a,#90a0b0)",borderRadius:"40% 40% 0 0",opacity:0.4 }}/>
              </div>
            </div>
          </div>

          {/* ── 시계 (엔딩2, middle of wall) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); attemptEnding(2); } }}
            style={{ position:"absolute",left:"54%",top:"22%",transform:"translateX(-50%)",zIndex:10,...getObjectStyle(2),
              width:76,height:76,borderRadius:"50%",
              background:"linear-gradient(145deg,#fff,#f8f4ef)",
              border:"5px solid #c4b49a",
              boxShadow:"0 6px 28px rgba(0,0,0,0.12), inset 0 2px 0 rgba(255,255,255,0.5)",
              display:"flex",alignItems:"center",justifyContent:"center" }}
            hoverGlow="#e88b3d">
            <svg viewBox="0 0 40 40" width="48" height="48">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#e0d8cc" strokeWidth="1"/>
              {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => (
                <line key={deg} x1="20" y1="3" x2="20" y2={deg%90===0?"7":"5.5"}
                  stroke={deg%90===0?"#7a6a5a":"#c0b0a0"} strokeWidth={deg%90===0?"1.8":"0.8"}
                  transform={`rotate(${deg} 20 20)`}/>
              ))}
              <line x1="20" y1="20" x2="20" y2="7" stroke="#4a3a2a" strokeWidth="2" strokeLinecap="round"
                transform={`rotate(${(frame*6)%360} 20 20)`}/>
              <line x1="20" y1="20" x2="20" y2="5" stroke="#e8573d" strokeWidth="1" strokeLinecap="round"
                transform={`rotate(${(frame*36)%360} 20 20)`}/>
              <circle cx="20" cy="20" r="2.5" fill="#4a3a2a"/>
              <circle cx="20" cy="20" r="1.2" fill="#e8573d"/>
            </svg>
          </RoomObj>

          {/* ── 비상연락 (엔딩12, wall-mounted intercom panel) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); attemptEnding(12); } }}
            style={{ position:"absolute",left:"64%",top:"5%",zIndex:10,...getObjectStyle(12),
              width:52,height:62,borderRadius:6,
              background:"linear-gradient(180deg,#e8e4e0,#d8d4d0,#ccc8c4)",
              border:"2px solid #b0aaa4",
              boxShadow:"0 4px 14px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.5)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4 }}
            hoverGlow="#ff9800">
            {/* Red indicator light */}
            <div style={{ width:8,height:8,borderRadius:"50%",
              background:"radial-gradient(circle,#ff4444,#cc0000)",
              boxShadow:"0 0 6px rgba(255,0,0,0.4), 0 0 12px rgba(255,0,0,0.15)",
              animation:"pulse 2s ease infinite" }}/>
            {/* Speaker grille */}
            <div style={{ width:32,height:18,borderRadius:3,
              background:"linear-gradient(180deg,#999,#888)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:2,padding:3 }}>
              {[...Array(4)].map((_,i) => (
                <div key={i} style={{ width:"100%",height:1,background:"#666",borderRadius:1 }}/>
              ))}
            </div>
            {/* SOS label */}
            <div style={{ fontSize:9,color:"#c62828",fontWeight:900,letterSpacing:2 }}>SOS</div>
          </RoomObj>

          {/* ── 선반/책장 (lower on wall, above wainscoting) ── */}
          <div style={{ position:"absolute",left:"62%",top:"28%",zIndex:10,width:170 }}>
            {/* 선반 위 물건들 */}
            <div style={{ display:"flex",alignItems:"flex-end",justifyContent:"center",gap:5,paddingBottom:4 }}>
              <div style={{ width:14,height:40,background:"linear-gradient(90deg,#c0392b,#e74c3c)",borderRadius:"2px 2px 0 0",
                boxShadow:"1px 0 2px rgba(0,0,0,0.1)" }}/>
              <div style={{ width:12,height:32,background:"linear-gradient(90deg,#2980b9,#3498db)",borderRadius:"2px 2px 0 0" }}/>
              <div style={{ width:16,height:46,background:"linear-gradient(90deg,#27ae60,#2ecc71)",borderRadius:"2px 2px 0 0" }}/>
              <div style={{ width:12,height:28,background:"linear-gradient(90deg,#f39c12,#f1c40f)",borderRadius:"2px 2px 0 0" }}/>
              <div style={{ width:24,height:24,borderRadius:"50%",background:"#e8dcc8",border:"2px solid #c8b898",
                display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>{"\uD83C\uDF31"}</div>
              <div style={{ width:14,height:36,background:"linear-gradient(90deg,#8e44ad,#9b59b6)",borderRadius:"2px 2px 0 0" }}/>
              <div style={{ width:12,height:24,background:"linear-gradient(90deg,#e67e22,#d35400)",borderRadius:"2px 2px 0 0" }}/>
            </div>
            {/* 선반 판 */}
            <div style={{ width:"100%",height:8,background:"linear-gradient(180deg,#b89060,#a07840)",
              borderRadius:2,boxShadow:"0 4px 12px rgba(0,0,0,0.12)",
              border:"1px solid #906830" }}/>
            {/* 선반 받침 */}
            <div style={{ display:"flex",justifyContent:"space-between",padding:"0 10px" }}>
              <div style={{ width:6,height:16,background:"linear-gradient(180deg,#a07840,#906830)" }}/>
              <div style={{ width:6,height:16,background:"linear-gradient(180deg,#a07840,#906830)" }}/>
            </div>
          </div>

          {/* ── TV (엔딩14, high on wall, mounted) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); attemptEnding(14); } }}
            style={{ position:"absolute",left:"35%",top:"18%",zIndex:10,...getObjectStyle(14),
              width:160,height:105,borderRadius:10,
              background:"linear-gradient(180deg,#3a3a3a,#2a2a2a,#222)",
              border:"5px solid #444",
              boxShadow:"0 10px 40px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
              display:"flex",alignItems:"center",justifyContent:"center",overflow:"hidden" }}
            hoverGlow="#666">
            <div style={{ width:"90%",height:"82%",
              background:"linear-gradient(180deg,#1a1a1a,#111,#0a0a0a)",
              borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ fontSize:13,color:"#333",letterSpacing:4,fontWeight:700 }}>OFF</div>
            </div>
            {/* Standby LED */}
            <div style={{ position:"absolute",bottom:5,right:8,width:5,height:5,borderRadius:"50%",
              background:"#e8573d22",boxShadow:"0 0 6px #e8573d22" }}/>
            {/* Wall mount bracket */}
            <div style={{ position:"absolute",bottom:-12,left:"50%",transform:"translateX(-50%)",
              width:32,height:12,background:"linear-gradient(180deg,#444,#333)",borderRadius:"0 0 5px 5px" }}/>
          </RoomObj>

          {/* ── 나비 캐릭터 (CRT 모니터 프레임) ── */}
          <div onContextMenu={handleNaviContextMenu}
            style={{ position:"absolute",right:16,top:"4%",zIndex:60 }}>
            {/* CRT Monitor outer frame */}
            <div style={{ width:150,padding:5,
              background:"linear-gradient(180deg,#4a4a4a,#333,#2a2a2a)",
              border:"3px solid #555",borderRadius:10,
              boxShadow:"0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.08)",
              position:"relative" }}>
              {/* Screen bezel */}
              <div style={{ width:"100%",height:216,borderRadius:6,overflow:"hidden",position:"relative",
                background:"linear-gradient(180deg,#102858,#1a3c78,#0e2450)",
                boxShadow:"inset 0 0 30px rgba(30,80,160,0.5), inset 0 2px 0 rgba(0,0,0,0.3)" }}>
                {/* Blue ambient glow */}
                <div style={{ position:"absolute",inset:0,
                  background:"radial-gradient(ellipse at 50% 60%,rgba(60,130,220,0.15),transparent 70%)",
                  pointerEvents:"none" }}/>
                {/* Character */}
                <div style={{ position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",zIndex:1 }}>
                  {!catEars && !activeEvent && (
                    <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); attemptEnding(11); } }}
                      style={{ position:"absolute",top:-6,left:"50%",transform:"translateX(-50%)",
                        fontSize:12,opacity:gameMode==="stage"&&!activeObjects.includes(11)?0:0.25,zIndex:2,
                        pointerEvents:gameMode==="stage"&&!activeObjects.includes(11)?"none":"auto" }} hoverGlow="#ff8fab">
                      {"\uD83D\uDC31"}
                    </RoomObj>
                  )}
                  <NaviCharacter emotion={nEmo} frame={frame} sleeping={naviSleeping} catEars={catEars} gone={naviGone} size={130}/>
                </div>
                {/* CRT Scanlines overlay */}
                <div style={{ position:"absolute",inset:0,zIndex:5,pointerEvents:"none",
                  backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 2px,rgba(0,0,0,0.12) 2px,rgba(0,0,0,0.12) 4px)",
                  backgroundSize:"100% 4px" }}/>
                {/* CRT moving scan bar */}
                <div style={{ position:"absolute",left:0,right:0,height:"15%",zIndex:6,pointerEvents:"none",
                  background:"linear-gradient(180deg,transparent,rgba(100,180,255,0.06),transparent)",
                  animation:"crtScan 3s linear infinite" }}/>
                {/* CRT static noise */}
                <div style={{ position:"absolute",inset:0,zIndex:4,pointerEvents:"none",opacity:0.03,
                  backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
                  animation:"crtFlicker 0.15s ease infinite" }}/>
                {/* Screen vignette */}
                <div style={{ position:"absolute",inset:0,zIndex:7,pointerEvents:"none",
                  boxShadow:"inset 0 0 40px rgba(0,0,0,0.5), inset 0 0 80px rgba(0,0,0,0.2)",
                  borderRadius:6 }}/>
                {/* Screen edge glow */}
                <div style={{ position:"absolute",inset:0,zIndex:8,pointerEvents:"none",
                  border:"1px solid rgba(100,180,255,0.08)",borderRadius:6 }}/>
              </div>
              {/* Monitor bottom strip */}
              <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",
                marginTop:5,padding:"0 8px" }}>
                <div style={{ fontSize:8,color:"#666",letterSpacing:2,fontWeight:700 }}>OPERATOR</div>
                <div style={{ display:"flex",alignItems:"center",gap:6 }}>
                  <div style={{ fontSize:8,color:"#555",letterSpacing:1 }}>NAVI</div>
                  {/* Power LED */}
                  <div style={{ width:5,height:5,borderRadius:"50%",
                    background:naviGone?"#555":"#3fb950",
                    boxShadow:naviGone?"none":"0 0 6px #3fb950" }}/>
                </div>
              </div>
            </div>
          </div>

          {/* ── 나비 말풍선 (below CRT monitor) ── */}
          {nText && !naviGone && (
            <div key={nKey} style={{ position:"absolute",right:16,top:"calc(4% + 258px)",zIndex:70,
              width:150,padding:"10px 14px",
              background:"rgba(10,20,40,0.92)",backdropFilter:"blur(8px)",
              border:"1px solid rgba(100,180,255,0.15)",
              borderRadius:"4px 4px 12px 12px",
              fontSize:13,lineHeight:1.8,color:"#c8dce8",fontWeight:400,
              boxShadow:"0 6px 24px rgba(0,0,0,0.2), inset 0 1px 0 rgba(100,180,255,0.05)",
              animation:"slideDown 0.3s ease",
              fontFamily:"'Noto Sans KR',monospace" }}>
              <TypeWriter key={nKey} text={nText}/>
            </div>
          )}

          <PrizeBanner visible={bannerVisible} onClick={(e) => { e.stopPropagation(); setBannerVisible(false); if (!activeEvent) attemptEnding(5); }}/>

          {/* ════════════════════════════════════════ */}
          {/* ══ 책상 위 오브젝트 (sitting ON desk surface at 60%) ══ */}
          {/* ════════════════════════════════════════ */}

          {/* ── 스탠드 조명 (desk lamp, base on desk surface) ── */}
          <div style={{ position:"absolute",left:"14%",bottom:"40%",zIndex:20,display:"flex",flexDirection:"column",alignItems:"center" }}>
            {/* Lamp shade */}
            <div style={{ width:44,height:34,background:"radial-gradient(ellipse at 50% 100%,#e8c878,#d4a850)",
              borderRadius:"22px 22px 0 0",border:"2px solid #c49840",borderBottom:"none",
              boxShadow:"0 -4px 24px rgba(255,220,100,0.2), 0 -10px 50px rgba(255,200,60,0.06)" }}/>
            {/* Light cone */}
            <div style={{ width:60,height:50,marginTop:-1,
              background:"radial-gradient(ellipse at 50% 0%,rgba(255,240,180,0.15),transparent 80%)",
              pointerEvents:"none" }}/>
            {/* Lamp stem */}
            <div style={{ width:6,height:36,marginTop:-48,background:"linear-gradient(180deg,#888,#666)" }}/>
            {/* Lamp base */}
            <div style={{ width:34,height:8,background:"linear-gradient(180deg,#777,#555)",borderRadius:4,
              boxShadow:"0 2px 6px rgba(0,0,0,0.15)" }}/>
          </div>

          {/* ── 지갑 (엔딩6, on desk) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); attemptEnding(6); } }}
            style={{ position:"absolute",left:"22%",bottom:"40%",zIndex:20,...getObjectStyle(6),
              width:80,height:50,borderRadius:8,
              background:"linear-gradient(150deg,#8d6e63,#6d4c41,#5d4037)",
              border:"2.5px solid #4e342e",
              boxShadow:"0 6px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)",
              display:"flex",alignItems:"center",justifyContent:"center" }}
            hoverGlow="#8d6e63">
            <div style={{ position:"absolute",top:0,left:0,right:0,height:"50%",
              background:"linear-gradient(180deg,#9d7e73,#8d6e63)",borderRadius:"8px 8px 0 0",
              borderBottom:"2px solid #4e342e" }}/>
            <div style={{ fontSize:28,zIndex:1 }}>{"\uD83D\uDCB3"}</div>
          </RoomObj>

          {/* ── 케이크 (엔딩9, redesigned as cake on plate) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent && isObjectActive(9)) { resetIdle(); if (gameMode==="stage") { attemptEnding(9); } else { setCakeSelected(true); say("케이크를 집었어! 이제 버튼에 올려봐~","excited"); } } }}
            style={{ position:"absolute",left:"34%",bottom:"40%",zIndex:20,...getObjectStyle(9),
              width:72,height:72,borderRadius:"50%",
              background:cakeSelected
                ?"linear-gradient(180deg,#fff3e0,#ffe0b2)"
                :"linear-gradient(180deg,#fff,#f5f0eb)",
              border:cakeSelected?"3px solid #ff9800":"2px solid #e8e0d8",
              boxShadow:cakeSelected
                ?"0 0 24px #ff980044, 0 6px 16px rgba(0,0,0,0.12)"
                :"0 4px 12px rgba(0,0,0,0.08)",
              display:"flex",alignItems:"center",justifyContent:"center",
              transition:"all 0.3s" }}
            hoverGlow="#ff9800">
            {/* Cake on plate - large emoji, no label */}
            <div style={{ fontSize:42,lineHeight:1,
              filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.15))" }}>{"\uD83C\uDF82"}</div>
          </RoomObj>

          {/* ═══ 중앙 메인 버튼 + 안전 커버 ═══ */}
          <div style={{ position:"absolute",left:"50%",bottom:"39%",transform:"translateX(-50%)",zIndex:50 }}>
            {!activeEvent && (
              <div onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); attemptEnding(13); } }}
                style={{ position:"absolute",top:-52,left:"50%",transform:"translateX(-50%)",
                  width:60,height:30,
                  background:"linear-gradient(180deg,#ffd54f,#ffca28,#ffb300)",
                  border:"3px solid #ff8f00",borderRadius:"8px 8px 0 0",cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,color:"#e65100",fontWeight:800,letterSpacing:1,zIndex:2,
                  boxShadow:"0 4px 14px rgba(255,152,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
                  ...getObjectStyle(13) }}>
                {"\u26A0"} COVER
              </div>
            )}
            <NuclearButton
              label={buttonLabel} accent={buttonColor}
              onPress={cakeSelected ? () => { setCakeSelected(false); setCakeOnButton(true); attemptEnding(9); } : pressMainButton}
              onHover={handleButtonHover}
              onDrag={!activeEvent && !cakeSelected ? () => { if (!activeEvent) { resetIdle(); attemptEnding(8); } } : undefined}
              disabled={activeEvent === 20}
              cakeMode={cakeOnButton}
              cakeSelect={cakeSelected}
            />
          </div>

          {/* ── 커피머그 (장식, on desk) ── */}
          <div style={{ position:"absolute",right:"32%",bottom:"40%",zIndex:18 }}>
            <div style={{ width:32,height:28,background:"linear-gradient(180deg,#fff,#f0e8e0)",
              borderRadius:"0 0 4px 4px",border:"2px solid #d8d0c8",position:"relative" }}>
              {/* Handle */}
              <div style={{ position:"absolute",right:-10,top:4,width:10,height:16,borderRadius:"0 6px 6px 0",
                border:"2px solid #d8d0c8",borderLeft:"none" }}/>
              {/* Coffee surface */}
              <div style={{ position:"absolute",top:2,left:4,right:4,height:4,
                background:"linear-gradient(180deg,#8b6914,#a07820)",borderRadius:2,opacity:0.6 }}/>
            </div>
          </div>

          {/* ── 스마트폰 (엔딩10, on desk, with CSS chart instead of emoji) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); attemptEnding(10); } }}
            style={{ position:"absolute",right:"24%",bottom:"40%",zIndex:20,...getObjectStyle(10),
              width:46,height:78,borderRadius:12,
              background:"linear-gradient(180deg,#333,#222,#1a1a1a)",
              border:"3px solid #444",
              boxShadow:"0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.05)",
              display:"flex",alignItems:"center",justifyContent:"center" }}
            hoverGlow="#4caf50">
            <div style={{ width:36,height:58,borderRadius:7,
              background:"linear-gradient(180deg,#1a237e,#0d47a1,#0d1117)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"flex-end",
              boxShadow:"inset 0 0 10px rgba(0,0,0,0.3)",padding:4,overflow:"hidden" }}>
              {/* Mini stock chart lines on screen */}
              <svg viewBox="0 0 28 30" width="28" height="30" style={{ opacity:0.7 }}>
                <polyline points="2,22 7,18 12,20 17,12 22,8 26,4" fill="none" stroke="#3fb950" strokeWidth="1.5"/>
                <line x1="2" y1="26" x2="26" y2="26" stroke="#ffffff22" strokeWidth="0.5"/>
                <line x1="2" y1="20" x2="26" y2="20" stroke="#ffffff11" strokeWidth="0.3"/>
                <line x1="2" y1="14" x2="26" y2="14" stroke="#ffffff11" strokeWidth="0.3"/>
              </svg>
              {/* Notification bar at top */}
              <div style={{ position:"absolute",top:6,left:6,right:6,display:"flex",justifyContent:"space-between" }}>
                <div style={{ width:8,height:2,borderRadius:1,background:"#ffffff33" }}/>
                <div style={{ width:12,height:2,borderRadius:1,background:"#ffffff22" }}/>
              </div>
            </div>
            {/* Home indicator */}
            <div style={{ position:"absolute",bottom:4,left:"50%",transform:"translateX(-50%)",
              width:10,height:3,borderRadius:2,background:"#444" }}/>
          </RoomObj>

          {/* ── 노트북 (on desk, screen extends above desk surface) ── */}
          <div style={{ position:"absolute",right:"14%",bottom:"40%",zIndex:20 }}>
            {/* Screen */}
            <div style={{ width:150,height:96,
              background:"linear-gradient(180deg,#e8e0d8,#d8d0c8)",
              borderRadius:"10px 10px 0 0",border:"4px solid #c0b8b0",
              boxShadow:"0 6px 24px rgba(0,0,0,0.1)",
              display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ width:132,height:76,
                background:"linear-gradient(180deg,#2a3a4a,#1a2a3a,#1a2030)",
                borderRadius:5,display:"flex",alignItems:"center",justifyContent:"center" }}>
                <div style={{ fontSize:12,color:"#4a6a8a",letterSpacing:3 }}>{"\u2328\uFE0F"} _</div>
              </div>
            </div>
            {/* Keyboard base */}
            <div style={{ width:162,height:12,marginLeft:-6,
              background:"linear-gradient(180deg,#d0c8c0,#c0b8b0)",
              borderRadius:"0 0 5px 5px",border:"3px solid #b0a8a0",borderTop:"none" }}/>
          </div>

          {/* ═══ UI 컨트롤 ═══ */}
          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setSettingsOpen(true); }}
            style={{ position:"absolute",top:14,left:16,zIndex:100,width:42,height:42,borderRadius:12,
              background:"rgba(255,255,255,0.92)",backdropFilter:"blur(10px)",
              border:"1.5px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:19,boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }} hoverGlow="#aaa">
            {"\u2699\uFE0F"}
          </RoomObj>

          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setCollectionOpen(true); }}
            style={{ position:"absolute",top:14,left:66,zIndex:100,height:42,borderRadius:12,
              padding:"0 16px",
              background:"rgba(255,255,255,0.92)",backdropFilter:"blur(10px)",
              border:"1.5px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",
              gap:6,fontSize:14,fontWeight:800,color:"#a33de8",
              boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}
            hoverGlow="#a33de8">
            <span style={{ fontSize:11,color:"#ccc" }}>{"\uD83C\uDFC6"}</span>
            {collected.length}/21
          </RoomObj>

          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setProfileOpen(!profileOpen); }}
            style={{ position:"absolute",top:14,right:16,zIndex:100,width:42,height:42,borderRadius:"50%",
              background:"linear-gradient(135deg,#e8d8f8,#d4c0f0)",border:"2.5px solid #c4b0e0",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
              boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }} hoverGlow="#a33de8">
            {"\uD83D\uDC64"}
          </RoomObj>

          {idleTimer > 120 && idleTimer < IDLE_LIMIT && !activeEvent && (
            <div style={{ position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",
              fontSize:12,color:"#b0a09055",animation:"pulse 2.5s ease infinite",letterSpacing:3 }}>
              ({"\uC870\uC6A9\uD558\uB2E4"}...)
            </div>
          )}

          <div style={{ position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",
            display:"flex",gap:5,zIndex:40 }}>
            {Array.from({length:21},(_,i)=>i+1).map(id => (
              <div key={id} style={{ width:7,height:7,borderRadius:"50%",
                background:collected.includes(id)?"#a33de8":"#d8d0c822",
                boxShadow:collected.includes(id)?"0 0 8px #a33de855":"none",
                transition:"all 0.4s" }}/>
            ))}
          </div>

          {/* ═══ 오버레이 ═══ */}
          </div>{/* end centered container */}

          <BSODOverlay active={showBSOD && activeEvent === 7}/>
          <NewsOverlay active={showNews && activeEvent === 14}/>
          <StockOverlay active={showStock && activeEvent === 10}/>
          {marshmallowActive && <TimerDisplay seconds={marshmallowTimer}/>}
          {countdownVal !== null && <CountdownDisplay count={countdownVal}/>}
          {showRunaway && activeEvent === 8 && <RunawayButton onCatch={() => { setShowRunaway(false); pressEventButton(); }}/>}

          {activeEvent === 15 && <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.1)",zIndex:300,pointerEvents:"none",animation:"pulse 1.2s ease infinite" }}/>}
          {activeEvent === 12 && <div style={{ position:"absolute",inset:0,zIndex:300,pointerEvents:"none",animation:"siren 0.5s ease infinite" }}/>}

          {darkMode && (
            <div style={{ position:"absolute",inset:0,zIndex:500,background:"#000",animation:"darkFade 4s ease forwards",
              display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column" }}>
              <div style={{ color:"#22222266",fontSize:14,marginBottom:28 }}>(조명이 꺼졌다)</div>
              <div onClick={pressEventButton} style={{ color:"#22222233",fontSize:12,cursor:"pointer",
                padding:"10px 20px",border:"1px solid #22222222",borderRadius:10 }}>...</div>
            </div>
          )}

          {(showNews || showStock) && activeEvent && !showRunaway && (
            <div style={{ position:"absolute",bottom:"12%",left:"50%",transform:"translateX(-50%)",zIndex:450 }}>
              <button onClick={(e) => { e.stopPropagation(); pressEventButton(); }}
                style={{ padding:"14px 36px",background:buttonColor,border:"none",borderRadius:14,
                  color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",letterSpacing:4,
                  boxShadow:`0 8px 32px ${buttonColor}44`,animation:"popIn 0.4s ease" }}>
                {buttonLabel}
              </button>
            </div>
          )}

          {!showBSOD && activeEvent === 7 && (
            <div style={{ position:"absolute",bottom:"12%",left:"50%",transform:"translateX(-50%)",zIndex:450 }}>
              <button onClick={(e) => { e.stopPropagation(); pressEventButton(); }}
                style={{ padding:"14px 36px",background:"#1565c0",border:"none",borderRadius:14,
                  color:"#fff",fontSize:16,fontWeight:800,cursor:"pointer",letterSpacing:4,
                  boxShadow:"0 8px 32px #1565c044",animation:"popIn 0.4s ease" }}>복구</button>
            </div>
          )}

          <SettingsPanel open={settingsOpen} onClose={()=>setSettingsOpen(false)}
            onKillMode={() => { if (!activeEvent && isObjectActive(15)) { setKillMode(true); setSettingsOpen(false); attemptEnding(15); } }}
            onReset={() => { if (!activeEvent && isObjectActive(17)) { setSettingsOpen(false); attemptEnding(17); } }} killModeOn={killMode}/>
          <ProfileMenu open={profileOpen} onClose={()=>setProfileOpen(false)}
            onTransfer={() => { if (!activeEvent && isObjectActive(19)) { setProfileOpen(false); attemptEnding(19); } }}/>
          <CollectionPanel open={collectionOpen} onClose={()=>setCollectionOpen(false)} collected={collected}/>

          {contextMenu && <>
            <div onClick={()=>setContextMenu(null)} style={{ position:"fixed",inset:0,zIndex:850 }}/>
            <ContextMenu x={contextMenu.x} y={contextMenu.y}
              onDelete={() => { setContextMenu(null); attemptEnding(1); }} onClose={()=>setContextMenu(null)}/>
          </>}

          {/* ═══ 스테이지 HUD ═══ */}
          {gameMode === "stage" && !warningData && (
            <StageHUD stage={currentStage} timer={stageTimer}
              duration={STAGE_DURATIONS[currentStage]} temptation={temptationLevel}/>
          )}

          {/* ═══ 경고 오버레이 ═══ */}
          <WarningOverlay data={warningData} onConfirm={handleWarningConfirm} onResist={handleWarningResist}/>

          <div style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:3,overflow:"hidden" }}>
            <div style={{ position:"absolute",left:0,width:"100%",height:"1px",
              background:"rgba(0,0,0,0.012)",animation:"scanline 8s linear infinite" }}/>
          </div>
        </div>
      )}

      {/* ═══════════ STAGE CLEAR ═══════════ */}
      {gs === "stage_clear" && (
        <StageClearScreen stage={currentStage} onNext={startNextStage} frame={frame}/>
      )}

      {/* ═══════════ ALL CLEAR ═══════════ */}
      {gs === "all_clear" && (
        <AllClearScreen onBack={restart} frame={frame}/>
      )}

      {/* ═══════════ ENDING ═══════════ */}
      {gs === "ending" && endingData && (
        <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",
          background:endingData.phase==="진 엔딩"
            ?"linear-gradient(180deg,#0a0a0a,#000)"
            :"linear-gradient(170deg,#fefcfa,#f8f0f5,#f0e8f8)",
          animation:"fadeIn 0.6s ease" }}>

          {/* 배경 글로우 */}
          <div style={{ position:"absolute",top:"30%",left:"50%",transform:"translate(-50%,-50%)",
            width:300,height:300,borderRadius:"50%",
            background:`radial-gradient(circle,${endingData.btnColor||"#e8573d"}08,transparent 60%)` }}/>

          <div style={{ fontSize:72,marginBottom:20,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
            {endingData.emoji}
          </div>
          <div style={{ fontSize:11,color:endingData.phase==="진 엔딩"?"#444":"#b0a090",letterSpacing:5,marginBottom:8,
            textTransform:"uppercase" }}>
            {endingData.phase} · ENDING #{activeEvent}
          </div>
          <div style={{ fontSize:30,fontWeight:800,
            color:endingData.phase==="진 엔딩"?"#ddd":endingData.btnColor||"#333",
            marginBottom:24,animation:"fadeInUp 0.5s ease",letterSpacing:4 }}>
            {endingData.name}
          </div>

          <div style={{ marginBottom:16,animation:"fadeInUp 0.6s ease" }}>
            <NaviCharacter emotion={activeEvent===15?"idle":(endingData.eventEmo||"idle")} frame={frame} size={130}/>
          </div>

          <div style={{ maxWidth:360,textAlign:"center",animation:"fadeInUp 0.7s ease" }}>
            {endingData.over1 && (
              <div style={{ fontSize:18,color:endingData.phase==="진 엔딩"?"#888":"#4a3a2a",
                lineHeight:1.9,marginBottom:8 }}>
                "{endingData.over1}"
              </div>
            )}
            {endingData.over2 && (
              <div style={{ fontSize:13,color:endingData.phase==="진 엔딩"?"#444":"#b0a090",
                lineHeight:1.7 }}>
                {endingData.over2}
              </div>
            )}
          </div>

          <div style={{ marginTop:28,fontSize:12,color:"#a33de8",animation:"fadeIn 1s ease",letterSpacing:2 }}>
            ✦ {collected.length}/21 엔딩 수집됨
          </div>

          <button onClick={restart} style={{ marginTop:24,padding:"14px 40px",
            background:endingData.btnColor||"#e8573d",border:"none",borderRadius:14,
            color:"#fff",fontSize:15,fontWeight:800,cursor:"pointer",letterSpacing:4,
            boxShadow:`0 8px 32px ${endingData.btnColor||"#e8573d"}33`,animation:"fadeInUp 0.8s ease",
            transition:"transform 0.2s" }}
            onMouseEnter={e=>e.target.style.transform="scale(1.06)"}
            onMouseLeave={e=>e.target.style.transform="scale(1)"}>
            RETRY
          </button>
        </div>
      )}

      {gs === "credits" && <CreditsScreen onBack={restart}/>}
    </div>
  );
}
