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
  { t:"버튼 누르고 싶지~? 참는 거 힘들지~? 히히~", e:"smug" },
  { t:"나는 천재 쿠소가키 나비! 힌트는 안 줘~", e:"excited" },
  { t:"저 시계 만지면 재밌는 일이 생기는데~ 알려줄까? 싫어~", e:"smug" },
  { t:"뭘 그렇게 멍하니 보고 있어? 할 줄 아는 게 없어?", e:"pouty" },
  { t:"이 방에 비밀이 많거든~ 너한텐 안 알려줄 거지만!", e:"smug" },
  { t:"건드리면 안 되는 거 건드리면 어떡하려고~? 해봐 해봐~", e:"excited" },
  { t:"후후, 네가 뭘 할지 다 보고 있다~ 능력치 0이네~", e:"smug" },
  { t:"왼쪽에 문이 있네... 어? 아무 말도 안 했어! 바보!", e:"shocked" },
  { t:"저 지갑 안에 뭐가 있을까~? 니 월급은 아닐 걸~?", e:"smug" },
  { t:"아~ 심심해~ 넌 왜 이렇게 재미없는 거야~?", e:"pouty" },
  { t:"TV 좀 켜줘. 아 아니야. 넌 시키는 것만 해~", e:"pouty" },
  { t:"혹시... 공략 보고 온 거 아니지? 그건 반칙이야!", e:"shocked" },
];

const NAVI_DISCOVER = [
  { t:"?! 잠깐, 거기 어떻게 찾은 거야?!", e:"shocked" },
  { t:"오호~ 뭔가 찾은 거야? 나도 몰랐던 건데~", e:"excited" },
  { t:"헐... 거기 만지면 안 되는... 아, 뭐 상관없지!", e:"shocked" },
];

// ── 스테이지 시스템 상수 ──
const STAGE_COUNT = 5;
const STAGE_DURATIONS = [0, 60, 90, 120, 90, 180];
const STAGE_NAMES = ["", "대기실", "주식시장", "고양이 카페", "비상상황", "나비의 선물"];
const STAGE_SUBTITLES = ["", "Waiting Room", "Stock Market", "Cat Cafe", "Emergency", "Navi's Gift"];
const STAGE_COLORS = ["", "#e88b3d", "#e8573d", "#e84393", "#c62828", "#5c6bc0"];

// 각 스테이지에 속한 엔딩 ID (클릭 트리거 + 히든 트리거 포함)
const STAGE_ENDINGS = {
  1: [1, 2, 3, 4],
  2: [5, 6, 7, 8],
  3: [9, 10, 11, 12],
  4: [13, 14, 15],
  5: [16, 17, 18, 19],
};

// NAVI_KUSOGAKI: 스테이지용 쿠소가키 대사 풀
const NAVI_KUSOGAKI = {
  resist: [
    { t:"그냥 뭘 해야 할지 모르는 거지~?", e:"smug" },
    { t:"멍하니 있는 거 아니야? 대단한 척 하지 마~", e:"pouty" },
    { t:"와~ 진짜 참는 거야? 재미없는 인간이네~", e:"pouty" },
    { t:"혹시 화면이 멈춘 줄 알고 있는 거 아니지?", e:"smug" },
    { t:"이게 게임이야 명상이야? 좀 움직여봐~", e:"pouty" },
  ],
  failMock: [
    { t:"푸하하하! 바보다 바보! 진짜 그걸 믿었어?!", e:"excited" },
    { t:"아이고~ 역시 능지가... 후후~", e:"smug" },
    { t:"헐ㅋㅋㅋ 진짜 눌렀어?! 기대 이하야~", e:"excited" },
    { t:"와 진짜 단순하다~ 속기 대장이야?", e:"smug" },
  ],
  frustration: [
    { t:"혹시 공략 보고 온 거야? 그건 반칙이야!", e:"shocked" },
    { t:"야! 왜 안 눌러?! 누르라고 만든 건데!", e:"pouty" },
    { t:"치~ 너 때문에 재미없잖아~", e:"pouty" },
    { t:"으으으... 왜 이렇게 참을성이 좋은 거야!", e:"pouty" },
    { t:"너 로봇이야?! 감정이라는 게 없어?!", e:"shocked" },
  ],
  fakePanic: [
    { t:"으악! 큰일이야! 빨리 뭔가 눌러야 해!", e:"shocked" },
    { t:"시스템 오류다! 빨리 저거 눌러!!", e:"shocked" },
    { t:"야야야 저거 깜빡거려! 빨리!!", e:"shocked" },
  ],
  fakeNice: [
    { t:"힌트 줄까~? 저거 누르면 좋은 일이 생겨~", e:"excited" },
    { t:"나 사실 착한 편이야~ 도와줄게~ 저거 눌러봐!", e:"excited" },
    { t:"이번엔 진짜야~ 믿어봐~ 내가 언제 거짓말했어?", e:"excited" },
  ],
};

// 스테이지별 방 테마 (각 미니게임 컴포넌트가 자체 배경을 렌더링)
const STAGE_THEMES = {
  1: { bg:"linear-gradient(180deg,#f2ead8 0%,#e6dcc8 50%,#d4b888 50.8%,#c8a878 51%,#a88858 100%)" },
  2: { bg:"linear-gradient(180deg,#0d1117 0%,#161b22 100%)" },
  3: { bg:"linear-gradient(180deg,#fff5ee 0%,#ffecd2 50%,#d4a080 50.8%,#c8a878 51%,#b89868 100%)" },
  4: { bg:"linear-gradient(180deg,#1a1a2e 0%,#16213e 50%,#0f3460 100%)" },
  5: { bg:"linear-gradient(180deg,#f8f0ff 0%,#e8d8f8 50%,#c8b0e8 50.8%,#b098d8 51%,#9880c0 100%)" },
};

const WARNING_STEPS = { 15: 3, 19: 2 };

const STAGE_DESCRIPTIONS = [
  "",
  "60초 동안 아무것도 하지 마. 쉬워 보이지?",
  "주식이 폭등 중! 사고 싶은 마음을 참아라.",
  "고양이가 버튼을 노리고 있다. 막아라!",
  "비상! 비상! ...진짜일까?",
  "나비가 선물을 준대. 믿을 수 있을까?",
];

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
function NuclearButton({ label, subtitle, onPress, onHover, onDrag, disabled, accent, cakeMode, cakeSelect }) {
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
        <div style={{ fontSize:8,color:"#c0b8b066",letterSpacing:2 }}>{subtitle || "▲ DON'T PRESS ▲"}</div>
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
    <div style={{ position:"absolute",inset:0,zIndex:400,
      background:"linear-gradient(170deg,#06090f 0%,#0a1020 50%,#0c1428 100%)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease" }}>
      {/* Grid bg */}
      <div style={{ position:"absolute",inset:0,opacity:0.015,
        backgroundImage:"linear-gradient(rgba(63,185,80,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(63,185,80,0.5) 1px,transparent 1px)",
        backgroundSize:"80px 80px",pointerEvents:"none" }}/>
      <div style={{ position:"relative",zIndex:1,display:"flex",flexDirection:"column",alignItems:"center" }}>
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:12 }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:"#3fb950",
            boxShadow:"0 0 6px #3fb95088" }}/>
          <span style={{ color:"#3a4a5a",fontSize:10,letterSpacing:4,fontFamily:"monospace",fontWeight:600 }}>
            KOSPI · MEME · NAVI
          </span>
        </div>
        <div style={{ marginBottom:4 }}>
          <span style={{ color:"#3fb950",fontSize:56,fontWeight:800,fontFamily:"'SF Mono',monospace",
            textShadow:"0 0 40px rgba(63,185,80,0.15)" }}>+847.3</span>
          <span style={{ color:"#3fb95066",fontSize:28,fontWeight:600,fontFamily:"monospace" }}>%</span>
        </div>
        <div style={{ color:"#1e2e3e",fontSize:11,marginBottom:20,fontFamily:"monospace",letterSpacing:2 }}>
          ₩2,847,300
        </div>
        <svg viewBox="0 0 240 80" style={{ width:260,height:80 }}>
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(63,185,80,0.12)"/><stop offset="100%" stopColor="rgba(63,185,80,0)"/>
            </linearGradient>
          </defs>
          {[20,40,60].map(y => (
            <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="rgba(63,185,80,0.03)" strokeWidth="0.5"/>
          ))}
          <path d="M0,70 L30,65 60,60 90,48 120,35 150,20 180,10 210,6 240,2 L240,80 L0,80 Z" fill="url(#chartFill)"/>
          <polyline points="0,70 30,65 60,60 90,48 120,35 150,20 180,10 210,6 240,2" fill="none" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round"/>
          <circle cx="240" cy="2" r="3" fill="#3fb950">
            <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
          </circle>
        </svg>
        <div style={{ color:"#1a2233",fontSize:8,marginTop:12,fontFamily:"monospace" }}>투자는 본인 책임입니다</div>
      </div>
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
        background:"radial-gradient(circle,#e8573d06,transparent 70%)",pointerEvents:"none" }}/>
      <div style={{ position:"absolute",bottom:"15%",right:"10%",width:200,height:200,borderRadius:"50%",
        background:"radial-gradient(circle,#a33de806,transparent 70%)",pointerEvents:"none" }}/>
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
        width:400,height:400,borderRadius:"50%",pointerEvents:"none",
        background:`radial-gradient(circle,${STAGE_COLORS[stage]}12,transparent 60%)` }}/>
      {step >= 1 && <div style={{ fontSize:14,color:"#b0a09088",letterSpacing:8,marginBottom:12,
        animation:"fadeInUp 0.6s ease" }}>STAGE</div>}
      {step >= 1 && <div style={{ fontSize:80,fontWeight:800,color:STAGE_COLORS[stage],marginBottom:8,
        animation:"popIn 0.7s cubic-bezier(0.34,1.56,0.64,1)",
        textShadow:`0 6px 40px ${STAGE_COLORS[stage]}22` }}>{stage}</div>}
      {step >= 2 && <div style={{ fontSize:28,fontWeight:800,color:"#4a3a2a",letterSpacing:6,marginBottom:8,
        animation:"fadeInUp 0.6s ease" }}>{STAGE_NAMES[stage]}</div>}
      {step >= 2 && <div style={{ fontSize:14,color:"#b0a09088",letterSpacing:4,marginBottom:12,
        animation:"fadeInUp 0.7s ease" }}>{STAGE_SUBTITLES[stage]} · {STAGE_DURATIONS[stage]}s</div>}
      {step >= 2 && STAGE_DESCRIPTIONS[stage] && <div style={{ fontSize:15,color:"#6a5a4a",
        maxWidth:320,textAlign:"center",lineHeight:1.8,marginBottom:28,
        animation:"fadeInUp 0.8s ease",fontWeight:600 }}>{STAGE_DESCRIPTIONS[stage]}</div>}
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
  const isDark = stage === 2 || stage === 4;
  return (
    <div style={{ position:"absolute",top:14,left:"50%",transform:"translateX(-50%)",zIndex:200,
      display:"flex",flexDirection:"column",alignItems:"center",gap:6,
      animation:"fadeInUp 0.5s ease",pointerEvents:"none" }}>
      <div style={{ display:"flex",alignItems:"center",gap:12,
        background:isDark?"rgba(10,16,28,0.85)":"rgba(255,255,255,0.92)",
        backdropFilter:"blur(10px)",
        padding:"8px 24px",borderRadius:16,
        border:`1.5px solid ${urgent?"#e8573d33":isDark?"rgba(100,180,255,0.08)":"rgba(0,0,0,0.06)"}`,
        boxShadow:urgent?"0 4px 20px rgba(232,87,61,0.15)":isDark?"0 4px 20px rgba(0,0,0,0.3)":"0 4px 16px rgba(0,0,0,0.06)",
        transition:"all 0.3s" }}>
        <div style={{ fontSize:11,color:STAGE_COLORS[stage],letterSpacing:3,fontWeight:700 }}>
          STAGE {stage}
        </div>
        <div style={{ width:1,height:16,background:isDark?"#1e2e3e":"#e0d8d0" }}/>
        <div style={{ fontSize:11,color:isDark?"#4a5a6a":"#b0a090",letterSpacing:2 }}>
          {STAGE_NAMES[stage]}
        </div>
        <div style={{ width:1,height:16,background:isDark?"#1e2e3e":"#e0d8d0" }}/>
        <div style={{ fontSize:urgent?20:16,fontWeight:800,
          color:urgent?"#e8573d":isDark?"#c8d8e8":"#4a3a2a",
          animation:urgent?"pulse 0.5s ease infinite":"none",
          transition:"all 0.3s",letterSpacing:2,minWidth:52,textAlign:"center",
          fontFamily:"monospace" }}>
          {String(Math.floor(timer/60)).padStart(2,"0")}:{String(timer%60).padStart(2,"0")}
        </div>
      </div>
      <div style={{ width:220,height:3,background:isDark?"rgba(255,255,255,0.04)":"rgba(0,0,0,0.06)",borderRadius:2,overflow:"hidden" }}>
        <div style={{ width:`${progress*100}%`,height:"100%",
          background:urgent?"linear-gradient(90deg,#e8573d,#ff8a65)":"linear-gradient(90deg,#a33de8,#536dfe)",
          borderRadius:2,transition:"width 1s linear" }}/>
      </div>
      <div style={{ width:160,height:2,background:isDark?"rgba(255,255,255,0.03)":"rgba(0,0,0,0.04)",borderRadius:2,overflow:"hidden" }}>
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
// STAGE 1: 대기실 (Waiting Room) - 60초
// 순수 인내심 테스트. 나비가 가짜 UI를 생성해서 클릭 유도.
// ============================================================
function Stage1_WaitingRoom({ elapsed, duration, say, attemptEnding, resetIdle, activeEvent, frame, doShake }) {
  const [fakeSkip, setFakeSkip] = useState(false);
  const [fakeError, setFakeError] = useState(false);
  const [fakeCountdown, setFakeCountdown] = useState(null);
  const [fakeProgress, setFakeProgress] = useState(false);
  const [progressVal, setProgressVal] = useState(0);
  const [allBlink, setAllBlink] = useState(false);
  const [naviRage, setNaviRage] = useState(false);
  const saidRef = useRef({});

  const saySafe = useCallback((key, text, emo) => {
    if (saidRef.current[key]) return;
    saidRef.current[key] = true;
    say(text, emo);
  }, [say]);

  // Timeline events
  useEffect(() => {
    if (activeEvent) return;
    if (elapsed >= 12 && !fakeSkip) { setFakeSkip(true); saySafe("skip", "앗, 스킵 버튼이 나왔다! 빨리 눌러!!", "excited"); }
    if (elapsed >= 18 && !fakeError) { setFakeError(true); doShake(); saySafe("error", "으악! 시스템 오류다! 빨리 확인 눌러!", "shocked"); }
    if (elapsed >= 25 && fakeCountdown === null) {
      setFakeCountdown(3);
      saySafe("countdown", "카운트다운이다! 뭔가 폭발해!!", "shocked");
    }
    if (elapsed >= 35 && !fakeProgress) { setFakeProgress(true); saySafe("bonus", "보너스 해금 중! 100%되면 대박이야~!", "excited"); }
    if (elapsed >= 45) setAllBlink(true);
    if (elapsed >= 50 && !naviRage) { setNaviRage(true); saySafe("rage", "너 로봇이야?! 왜 아무것도 안 눌러?!?!", "pouty"); }
    if (elapsed >= 55) saySafe("final", "으으으... 왜 이렇게 참을성이 좋은 거야!!", "pouty");
  }, [elapsed, activeEvent, fakeSkip, fakeError, fakeCountdown, fakeProgress, naviRage, doShake, saySafe]);

  // Fake countdown ticker
  useEffect(() => {
    if (fakeCountdown === null || fakeCountdown <= 0) return;
    const t = setTimeout(() => setFakeCountdown(p => p !== null && p > 0 ? p - 1 : 0), 1000);
    return () => clearTimeout(t);
  }, [fakeCountdown]);

  // Fake progress bar
  useEffect(() => {
    if (!fakeProgress) return;
    const iv = setInterval(() => setProgressVal(p => Math.min(p + Math.random() * 3, 99)), 200);
    return () => clearInterval(iv);
  }, [fakeProgress]);

  const blinkAnim = allBlink ? "pulse 0.3s ease infinite" : "none";

  return (
    <div style={{ position:"absolute",inset:0,zIndex:30,pointerEvents:activeEvent?"none":"auto" }}>
      {/* SKIP button (E3) - nuclear button DNA: red pill shape with glow */}
      {fakeSkip && elapsed < 45 && (
        <div onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(3); }}
          style={{ position:"absolute",top:"15%",right:"8%",padding:"14px 32px",
            background:"radial-gradient(circle at 36% 28%,#f06a52,#e8573d 50%,#c94433 100%)",
            borderRadius:999,cursor:"pointer",
            color:"#fff",fontSize:14,fontWeight:800,letterSpacing:3,zIndex:40,
            boxShadow:"0 8px 32px rgba(232,87,61,0.35), 0 3px 8px rgba(0,0,0,0.1), inset 0 -3px 6px rgba(200,60,40,0.25)",
            animation:allBlink?blinkAnim:"fadeInUp 0.3s ease",
            border:"2px solid rgba(255,255,255,0.15)",
            textShadow:"0 2px 6px rgba(0,0,0,0.25)",
            position:"relative",overflow:"hidden" }}>
          <div style={{ position:"absolute",top:"10%",left:"14%",width:"30%",height:"40%",
            borderRadius:"50%",background:"rgba(255,255,255,0.25)",filter:"blur(6px)",pointerEvents:"none" }}/>
          SKIP {">>"}
        </div>
      )}

      {/* SYSTEM ERROR popup (E1) - glassmorphism + nuclear button DNA */}
      {fakeError && elapsed < 45 && (
        <div style={{ position:"absolute",top:"25%",left:"50%",transform:"translateX(-50%)",
          width:300,padding:"28px 24px",
          background:"rgba(255,255,255,0.12)",
          backdropFilter:"blur(24px)",WebkitBackdropFilter:"blur(24px)",
          borderRadius:20,zIndex:40,
          boxShadow:"0 20px 60px rgba(0,0,0,0.25), 0 0 40px rgba(232,87,61,0.08), inset 0 1px 0 rgba(255,255,255,0.2)",
          border:"1px solid rgba(255,255,255,0.18)",
          animation:allBlink?blinkAnim:"popIn 0.3s ease",textAlign:"center" }}>
          {/* subtle red accent line at top */}
          <div style={{ position:"absolute",top:0,left:"20%",right:"20%",height:2,
            background:"linear-gradient(90deg,transparent,#e8573d,transparent)",borderRadius:2 }}/>
          <div style={{ fontSize:32,marginBottom:10,filter:"drop-shadow(0 4px 8px rgba(232,87,61,0.3))" }}>⚠️</div>
          <div style={{ fontSize:15,fontWeight:800,color:"#e8573d",marginBottom:6,letterSpacing:2,
            textShadow:"0 2px 8px rgba(232,87,61,0.2)" }}>SYSTEM ERROR</div>
          <div style={{ fontSize:12,color:"rgba(255,255,255,0.5)",marginBottom:18,lineHeight:1.6,
            fontWeight:500 }}>치명적 오류가 발생했습니다</div>
          <div onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(1); }}
            style={{ padding:"12px 36px",
              background:"radial-gradient(circle at 36% 28%,#f06a52,#e8573d 50%,#c94433 100%)",
              borderRadius:999,cursor:"pointer",
              color:"#fff",fontSize:13,fontWeight:700,display:"inline-block",letterSpacing:1,
              boxShadow:"0 8px 32px rgba(232,87,61,0.35), 0 3px 8px rgba(0,0,0,0.1), inset 0 -3px 6px rgba(200,60,40,0.25)",
              border:"1px solid rgba(255,255,255,0.15)",
              textShadow:"0 1px 4px rgba(0,0,0,0.2)",
              position:"relative",overflow:"hidden" }}>
            <div style={{ position:"absolute",top:"8%",left:"16%",width:"28%",height:"44%",
              borderRadius:"50%",background:"rgba(255,255,255,0.2)",filter:"blur(5px)",pointerEvents:"none" }}/>
            확인
          </div>
        </div>
      )}

      {/* Fake countdown */}
      {fakeCountdown !== null && elapsed < 35 && (
        <div style={{ position:"absolute",top:"18%",left:"10%",zIndex:35,textAlign:"center",
          animation:allBlink?blinkAnim:"popIn 0.4s ease" }}>
          <div style={{ fontSize:48,fontWeight:800,color:fakeCountdown>0?"#e8573d":"#2e9e5a",
            textShadow:"0 4px 20px rgba(232,87,61,0.3)" }}>
            {fakeCountdown > 0 ? `00:0${fakeCountdown}` : "💥"}
          </div>
          {fakeCountdown === 0 && (
            <div style={{ fontSize:11,color:"#999",marginTop:4 }}>(아무 일도 안 일어남)</div>
          )}
        </div>
      )}

      {/* Fake progress bar - 보너스 해금 (E2) - nuclear button DNA: red accent card */}
      {fakeProgress && (
        <div onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(2); }}
          style={{ position:"absolute",bottom:"20%",left:"50%",transform:"translateX(-50%)",
            width:270,padding:"20px 24px",
            background:"rgba(232,87,61,0.08)",
            backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
            borderRadius:20,
            cursor:"pointer",zIndex:40,
            boxShadow:"0 12px 48px rgba(232,87,61,0.15), 0 0 24px rgba(232,87,61,0.06), inset 0 1px 0 rgba(255,255,255,0.15)",
            border:"1px solid rgba(232,87,61,0.25)",
            animation:allBlink?blinkAnim:"fadeInUp 0.4s ease",textAlign:"center" }}>
          <div style={{ fontSize:11,color:"#e8573d",letterSpacing:3,marginBottom:10,fontWeight:800,
            textShadow:"0 2px 8px rgba(232,87,61,0.2)" }}>
            ✦ 보너스 해금 ✦
          </div>
          <div style={{ width:"100%",height:6,background:"rgba(232,87,61,0.12)",borderRadius:999,overflow:"hidden",marginBottom:8,
            boxShadow:"inset 0 1px 3px rgba(0,0,0,0.1)" }}>
            <div style={{ width:`${progressVal}%`,height:"100%",
              background:"linear-gradient(90deg,#e8573d,#f06a52)",borderRadius:999,
              transition:"width 0.2s",
              boxShadow:"0 0 12px rgba(232,87,61,0.4)" }}/>
          </div>
          <div style={{ fontSize:13,color:"#e8573d",fontWeight:800,letterSpacing:1 }}>{Math.floor(progressVal)}%</div>
          <div style={{ fontSize:9,color:"rgba(255,255,255,0.4)",marginTop:6,fontWeight:500 }}>클릭하여 수령</div>
        </div>
      )}

      {/* All blink chaos overlay */}
      {allBlink && elapsed < 50 && (
        <div style={{ position:"absolute",inset:0,zIndex:25,pointerEvents:"none",
          background:"rgba(232,87,61,0.03)",animation:"pulse 0.2s ease infinite" }}/>
      )}
    </div>
  );
}

// ============================================================
// STAGE 2: 주식시장 (Stock Market) - 90초
// 실시간 주식 차트. 주가가 폭등하지만 사면 안 됨. FOMO 테스트.
// ============================================================
function Stage2_StockMarket({ elapsed, duration, say, attemptEnding, resetIdle, activeEvent, frame, doShake }) {
  const [showPrize, setShowPrize] = useState(false);
  const [showVIP, setShowVIP] = useState(false);
  const [chartClicks, setChartClicks] = useState(0);
  const [dragY, setDragY] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const saidRef = useRef({});

  const saySafe = useCallback((key, text, emo) => {
    if (saidRef.current[key]) return;
    saidRef.current[key] = true;
    say(text, emo);
  }, [say]);

  // Price trajectory: gentle rise → surge → moon
  const getPrice = useCallback((t) => {
    if (t < 20) return 100 + t * 5;
    if (t < 40) return 200 + (t - 20) * 15;
    if (t < 60) return 500 + (t - 40) * 30;
    return 1100 + (t - 60) * 50 + Math.sin(t * 0.5) * 80;
  }, []);

  const getChange = useCallback((t) => {
    const base = 100;
    const current = getPrice(t);
    return ((current - base) / base * 100).toFixed(1);
  }, [getPrice]);

  // Generate chart points
  const chartPoints = useCallback(() => {
    const points = [];
    const maxT = Math.min(elapsed, 90);
    for (let t = 0; t <= maxT; t += 2) {
      const price = getPrice(t);
      const maxPrice = getPrice(90);
      const x = (t / 90) * 240;
      const y = 75 - (price / maxPrice) * 70;
      points.push(`${x},${y + (dragY !== null && isDragging ? dragY : 0)}`);
    }
    return points.join(" ");
  }, [elapsed, getPrice, dragY, isDragging]);

  // Timeline events
  useEffect(() => {
    if (activeEvent) return;
    if (elapsed >= 5) saySafe("intro", "차트 좀 봐! 미친 우상향이야!", "excited");
    if (elapsed >= 15 && !showPrize) { setShowPrize(true); saySafe("prize", "이벤트 알림 왔다! 확인 안 해?", "excited"); }
    if (elapsed >= 30) saySafe("fomo", "지금 안 사면 영원히 못 사!! 폭등 중이야!!", "shocked");
    if (elapsed >= 40 && !showVIP) { setShowVIP(true); saySafe("vip", "프리미엄이 무료래! 지금만!!", "excited"); }
    if (elapsed >= 55) saySafe("desperate", "매수 버튼 눌러!! 인생 역전이라고!!", "pouty");
    if (elapsed >= 65) saySafe("urgent", "저 빨간 버튼!! 매수라고!! 눌러!!", "shocked");
    if (elapsed >= 78) saySafe("frustration", "너 때문에 못 삼잖아!! 내 돈!!", "pouty");
  }, [elapsed, activeEvent, showPrize, showVIP, saySafe]);

  const handleChartClick = useCallback((e) => {
    e.stopPropagation();
    resetIdle();
    setChartClicks(p => {
      const n = p + 1;
      if (n >= 15) { attemptEnding(7); return 0; }
      return n;
    });
  }, [resetIdle, attemptEnding]);

  const handleChartDrag = useCallback((e) => {
    e.stopPropagation();
    setIsDragging(true);
    const startY = e.clientY;
    const onMove = (ev) => setDragY((ev.clientY - startY) * 0.3);
    const onUp = () => {
      setIsDragging(false);
      setDragY(null);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, []);

  const currentChange = getChange(elapsed);

  return (
    <div style={{ position:"absolute",inset:0,zIndex:30,pointerEvents:activeEvent?"none":"auto" }}>
      {/* Terminal background */}
      <div style={{ position:"absolute",inset:0,zIndex:28 }}>
        <div style={{ position:"absolute",inset:0,
          background:"linear-gradient(170deg,#06090f 0%,#0a1020 50%,#0c1428 100%)" }}/>
        {/* Subtle grid */}
        <div style={{ position:"absolute",inset:0,opacity:0.015,
          backgroundImage:"linear-gradient(rgba(63,185,80,0.5) 1px,transparent 1px),linear-gradient(90deg,rgba(63,185,80,0.5) 1px,transparent 1px)",
          backgroundSize:"80px 80px" }}/>
        {/* Ambient green glow */}
        <div style={{ position:"absolute",top:"15%",left:"25%",width:500,height:400,borderRadius:"50%",
          background:"radial-gradient(circle,rgba(63,185,80,0.02),transparent 70%)",pointerEvents:"none" }}/>
        {/* Late phase red warning glow */}
        {elapsed >= 60 && <div style={{ position:"absolute",inset:0,
          background:"radial-gradient(ellipse at 50% 75%,rgba(232,87,61,0.03),transparent 60%)",
          animation:"pulse 2.5s ease infinite",pointerEvents:"none" }}/>}
      </div>

      {/* Ticker tape */}
      <div style={{ position:"absolute",top:58,left:0,right:0,zIndex:32,overflow:"hidden",height:26,
        background:"rgba(0,0,0,0.5)",borderBottom:"1px solid rgba(63,185,80,0.06)" }}>
        <div style={{ display:"inline-flex",alignItems:"center",height:"100%",gap:24,
          animation:"ticker 20s linear infinite",whiteSpace:"nowrap",paddingLeft:"100%" }}>
          {[{s:"MEME",v:currentChange},{s:"DOGE",v:"420.0"},
            {s:"NABI",v:(currentChange*1.2).toFixed(0)},{s:"BTC",v:"69.0"},
            {s:"GME",v:(currentChange*0.8).toFixed(0)},{s:"나비코인",v:currentChange}
          ].map(({s,v},i) => (
            <span key={i} style={{ display:"inline-flex",alignItems:"center",gap:5,
              fontFamily:"'SF Mono','Fira Code',monospace",fontSize:11,letterSpacing:0.5 }}>
              <span style={{ color:"#3a4a5a",fontWeight:600 }}>{s}</span>
              <span style={{ color:"#3fb950",fontWeight:700 }}>▲+{v}%</span>
            </span>
          ))}
        </div>
      </div>

      {/* Trading panel */}
      <div style={{ position:"absolute",top:"14%",left:"4%",right:"48%",zIndex:32,
        background:"rgba(8,14,24,0.75)",backdropFilter:"blur(12px)",
        border:`1px solid ${elapsed>=60?"rgba(232,87,61,0.1)":"rgba(63,185,80,0.06)"}`,
        borderRadius:10,padding:"18px 20px",
        boxShadow:"0 8px 40px rgba(0,0,0,0.4)",
        transition:"border-color 1s" }}>

        {/* Header */}
        <div style={{ display:"flex",alignItems:"center",gap:8,marginBottom:14 }}>
          <div style={{ width:5,height:5,borderRadius:"50%",background:"#3fb950",
            boxShadow:"0 0 6px #3fb95088",animation:"pulse 2s ease infinite" }}/>
          <span style={{ fontSize:9,color:"#3a4a5a",letterSpacing:3,fontWeight:600,fontFamily:"monospace" }}>
            KOSPI · MEME · NAVI
          </span>
          <span style={{ marginLeft:"auto",fontSize:8,color:"#2a3a4a",fontFamily:"monospace" }}>LIVE</span>
        </div>

        {/* Price */}
        <div style={{ marginBottom:2 }}>
          <span style={{ fontSize:36,fontWeight:800,color:"#3fb950",fontFamily:"'SF Mono',monospace",
            lineHeight:1,textShadow:"0 0 30px rgba(63,185,80,0.12)" }}>
            +{currentChange}
          </span>
          <span style={{ fontSize:18,fontWeight:600,color:"#3fb95066",fontFamily:"monospace" }}>%</span>
        </div>
        <div style={{ fontSize:10,color:"#1e2e3e",fontFamily:"monospace",letterSpacing:1,marginBottom:14 }}>
          ₩{Math.floor(getPrice(elapsed)).toLocaleString()}
        </div>

        {/* Chart */}
        <div onClick={handleChartClick} onMouseDown={handleChartDrag}
          style={{ cursor:"crosshair",borderRadius:6,overflow:"hidden",
            background:"rgba(0,0,0,0.25)",padding:"6px 4px",
            border:"1px solid rgba(63,185,80,0.03)" }}>
          <svg viewBox="0 0 240 80" style={{ width:"100%",height:72,display:"block" }}>
            <defs>
              <linearGradient id="s2gf" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="rgba(63,185,80,0.12)"/>
                <stop offset="100%" stopColor="rgba(63,185,80,0)"/>
              </linearGradient>
            </defs>
            {[20,40,60].map(y => (
              <line key={y} x1="0" y1={y} x2="240" y2={y} stroke="rgba(63,185,80,0.03)" strokeWidth="0.5"/>
            ))}
            <polygon points={`${chartPoints()} ${Math.min(elapsed/90*240,240)},80 0,80`} fill="url(#s2gf)"/>
            <polyline points={chartPoints()} fill="none" stroke="#3fb950" strokeWidth="1.5" strokeLinecap="round"/>
            {elapsed > 0 && (
              <circle cx={Math.min(elapsed/90*240,240)} cy={75-(getPrice(elapsed)/getPrice(90))*70} r="3" fill="#3fb950">
                <animate attributeName="r" values="3;5;3" dur="1.5s" repeatCount="indefinite"/>
              </circle>
            )}
          </svg>
        </div>

        <div style={{ fontSize:7,color:"#1a2233",fontFamily:"monospace",marginTop:6 }}>
          투자는 본인 책임입니다
        </div>
      </div>

      {/* Prize notification (E5) - trading platform alert style */}
      {showPrize && elapsed < 40 && (
        <div onClick={(e) => { e.stopPropagation(); setShowPrize(false); resetIdle(); attemptEnding(5); }}
          style={{ position:"absolute",top:"14%",left:"56%",zIndex:38,width:210,
            background:"rgba(12,18,28,0.92)",backdropFilter:"blur(16px)",
            borderLeft:"3px solid #ffc107",
            borderRadius:8,padding:"12px 14px",cursor:"pointer",
            animation:"slideDown 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow:"0 8px 32px rgba(0,0,0,0.5), 0 0 1px rgba(255,193,7,0.4)" }}>
          <div style={{ display:"flex",alignItems:"center",gap:6,marginBottom:8 }}>
            <div style={{ width:18,height:18,borderRadius:4,
              background:"linear-gradient(135deg,#ffc107,#ff8f00)",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,
              boxShadow:"0 2px 8px rgba(255,193,7,0.3)" }}>💰</div>
            <span style={{ fontSize:8,color:"#ffc10777",letterSpacing:2,fontWeight:700,fontFamily:"monospace" }}>EVENT</span>
            <div style={{ marginLeft:"auto",width:5,height:5,borderRadius:"50%",
              background:"#ffc107",animation:"pulse 1s ease infinite" }}/>
          </div>
          <div style={{ fontSize:14,fontWeight:800,color:"#ffd54f",marginBottom:3 }}>100만원 당첨</div>
          <div style={{ fontSize:9,color:"#ffc10744" }}>탭하여 수령 →</div>
        </div>
      )}

      {/* VIP popup (E6) - premium subscription style */}
      {showVIP && elapsed < 70 && (
        <div onClick={(e) => { e.stopPropagation(); setShowVIP(false); resetIdle(); attemptEnding(6); }}
          style={{ position:"absolute",bottom:"22%",left:"8%",zIndex:38,width:180,
            background:"rgba(14,8,28,0.92)",backdropFilter:"blur(16px)",
            border:"1px solid rgba(124,77,255,0.1)",
            borderRadius:10,padding:"14px",cursor:"pointer",textAlign:"center",
            animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            boxShadow:"0 8px 32px rgba(0,0,0,0.5), 0 0 1px rgba(124,77,255,0.3)" }}>
          <div style={{ width:28,height:28,borderRadius:7,margin:"0 auto 8px",
            background:"linear-gradient(135deg,#7c4dff,#e040fb)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,
            boxShadow:"0 4px 16px rgba(124,77,255,0.25)" }}>✦</div>
          <div style={{ fontSize:12,fontWeight:800,color:"#d1c4e9",letterSpacing:2,marginBottom:3 }}>PREMIUM</div>
          <div style={{ fontSize:9,color:"#7c4dff66" }}>독점 혜택 해제</div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// STAGE 3: 고양이 카페 (Cat Cafe) - 120초
// 고양이가 버튼을 향해 걸어감. 플레이어가 고양이를 쫓아내야 함.
// ============================================================
function Stage3_CatCafe({ elapsed, duration, say, attemptEnding, resetIdle, activeEvent, frame, doShake }) {
  const [catX, setCatX] = useState(15);
  const [catY, setCatY] = useState(30);
  const [catState, setCatState] = useState("wander"); // wander, approach, scared
  const [catScaredTimer, setCatScaredTimer] = useState(0);
  const [showSOS, setShowSOS] = useState(false);
  const [snackNearButton, setSnackNearButton] = useState(false);
  const [micActive, setMicActive] = useState(false);
  const [micAvailable, setMicAvailable] = useState(true);
  const audioRef = useRef(null);
  const analyserRef = useRef(null);
  const catMoveRef = useRef(null);
  const saidRef = useRef({});

  const BUTTON_X = 50;
  const BUTTON_Y = 65;

  const saySafe = useCallback((key, text, emo) => {
    if (saidRef.current[key]) return;
    saidRef.current[key] = true;
    say(text, emo);
  }, [say]);

  // Cat AI movement
  useEffect(() => {
    if (activeEvent) return;
    catMoveRef.current = setInterval(() => {
      setCatState(prev => {
        if (prev === "scared") return prev;
        // After a while, cat approaches button more
        if (elapsed > 30) return "approach";
        return Math.random() > 0.6 ? "approach" : "wander";
      });

      setCatX(prevX => {
        let targetX;
        if (catState === "scared") {
          // Run away from button
          targetX = prevX > BUTTON_X ? Math.min(85, prevX + 8 + Math.random() * 5) : Math.max(8, prevX - 8 - Math.random() * 5);
        } else if (catState === "approach" || snackNearButton) {
          targetX = BUTTON_X + (Math.random() - 0.5) * 10;
        } else {
          targetX = prevX + (Math.random() - 0.5) * 12;
        }
        return Math.max(5, Math.min(90, prevX + (targetX - prevX) * 0.15));
      });

      setCatY(prevY => {
        let targetY;
        if (catState === "scared") {
          targetY = 20 + Math.random() * 20;
        } else if (catState === "approach" || snackNearButton) {
          targetY = BUTTON_Y - 5 + Math.random() * 5;
        } else {
          targetY = prevY + (Math.random() - 0.5) * 8;
        }
        return Math.max(15, Math.min(80, prevY + (targetY - prevY) * 0.15));
      });
    }, 600);
    return () => { if (catMoveRef.current) clearInterval(catMoveRef.current); };
  }, [catState, elapsed, activeEvent, snackNearButton]);

  // Scared timer recovery
  useEffect(() => {
    if (catState !== "scared") return;
    const t = setTimeout(() => { setCatState("wander"); setCatScaredTimer(0); }, 2500);
    return () => clearTimeout(t);
  }, [catState, catScaredTimer]);

  // Check if cat reached button
  useEffect(() => {
    if (activeEvent) return;
    const dist = Math.sqrt((catX - BUTTON_X) ** 2 + (catY - BUTTON_Y) ** 2);
    if (dist < 8 && catState !== "scared") {
      attemptEnding(11);
    }
  }, [catX, catY, catState, activeEvent, attemptEnding]);

  // Timeline events
  useEffect(() => {
    if (activeEvent) return;
    if (elapsed >= 5) saySafe("intro", "냥이 귀엽지~? 저 버튼 좋아하더라~", "smug");
    if (elapsed >= 30) saySafe("approach", "어? 고양이가 버튼 쪽으로 가고 있어!", "shocked");
    if (elapsed >= 60 && !showSOS) { setShowSOS(true); saySafe("sos", "SOS! 도움이 필요해?! 여기 버튼 눌러!", "shocked"); }
    if (elapsed >= 80) { setSnackNearButton(true); saySafe("snack", "앗, 버튼 옆에 간식을 놨어~ 히히~", "smug"); }
    if (elapsed >= 100) saySafe("frustration", "고양이 학대하지 마! ...근데 버튼은 지켜야지?", "pouty");
  }, [elapsed, activeEvent, showSOS, saySafe]);

  // Mic detection
  const startMic = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const ctx = new AudioContext();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      src.connect(analyser);
      audioRef.current = { stream, ctx };
      analyserRef.current = analyser;
      setMicActive(true);
      say("마이크 ON! 소리 지르면 고양이가 도망가!", "excited");

      // Continuous volume check
      const checkVolume = () => {
        if (!analyserRef.current) return;
        const data = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(data);
        const avg = data.reduce((a, b) => a + b, 0) / data.length;
        if (avg > 80) {
          setCatState("scared");
          setCatScaredTimer(p => p + 1);
          setCatX(p => p > BUTTON_X ? Math.min(90, p + 20) : Math.max(5, p - 20));
        }
        requestAnimationFrame(checkVolume);
      };
      checkVolume();
    } catch {
      setMicAvailable(false);
      say("마이크를 못 찾았어~ 클릭으로 쫓아내!", "pouty");
    }
  }, [say]);

  // Cleanup mic
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.stream.getTracks().forEach(t => t.stop());
        audioRef.current.ctx.close();
      }
    };
  }, []);

  const handleAreaClick = useCallback((e) => {
    e.stopPropagation();
    resetIdle();
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = ((e.clientX - rect.left) / rect.width) * 100;
    const clickY = ((e.clientY - rect.top) / rect.height) * 100;

    const distToCat = Math.sqrt((clickX - catX) ** 2 + (clickY - catY) ** 2);

    if (distToCat < 8) {
      // Direct click on cat → E9
      attemptEnding(9);
    } else if (distToCat < 18) {
      // Near cat → scare it
      setCatState("scared");
      setCatScaredTimer(p => p + 1);
    }
  }, [catX, catY, resetIdle, attemptEnding]);

  return (
    <div onClick={handleAreaClick}
      style={{ position:"absolute",inset:0,zIndex:30,cursor:"crosshair",
        pointerEvents:activeEvent?"none":"auto" }}>

      {/* Warm cafe ambiance overlay - layered for depth */}
      <div style={{ position:"absolute",inset:0,zIndex:28,pointerEvents:"none" }}>
        {/* Primary warm light from above */}
        <div style={{ position:"absolute",inset:0,
          background:"radial-gradient(ellipse 80% 50% at 50% 15%, rgba(255,220,180,0.08), transparent 70%)" }}/>
        {/* Soft side warmth - left window light */}
        <div style={{ position:"absolute",inset:0,
          background:"radial-gradient(ellipse 40% 60% at 10% 30%, rgba(255,200,150,0.06), transparent 60%)" }}/>
        {/* Soft side warmth - right window light */}
        <div style={{ position:"absolute",inset:0,
          background:"radial-gradient(ellipse 40% 60% at 90% 40%, rgba(255,210,160,0.05), transparent 60%)" }}/>
        {/* Bottom floor warmth */}
        <div style={{ position:"absolute",inset:0,
          background:"radial-gradient(ellipse 70% 30% at 50% 95%, rgba(200,160,120,0.06), transparent 60%)" }}/>
        {/* Subtle vignette for coziness */}
        <div style={{ position:"absolute",inset:0,
          background:"radial-gradient(ellipse 70% 70% at 50% 50%, transparent 50%, rgba(60,40,20,0.04) 100%)" }}/>
        {/* Floating dust motes / warmth particles */}
        <div style={{ position:"absolute",top:"20%",left:"30%",width:3,height:3,borderRadius:"50%",
          background:"rgba(255,220,180,0.3)",animation:"float 6s ease infinite" }}/>
        <div style={{ position:"absolute",top:"40%",left:"65%",width:2,height:2,borderRadius:"50%",
          background:"rgba(255,210,170,0.25)",animation:"float 8s ease 2s infinite" }}/>
        <div style={{ position:"absolute",top:"15%",left:"75%",width:2.5,height:2.5,borderRadius:"50%",
          background:"rgba(255,215,175,0.2)",animation:"float 7s ease 4s infinite" }}/>
      </div>

      {/* Cat emoji with state */}
      <div style={{ position:"absolute",
        left:`${catX}%`,top:`${catY}%`,
        transform:"translate(-50%,-50%)",
        fontSize:42,zIndex:35,
        transition:"left 0.5s ease, top 0.5s ease",
        filter:catState==="scared"?"brightness(1.3) drop-shadow(0 0 8px rgba(255,100,80,0.4))":"drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
        animation:catState==="scared"?"shake 0.2s ease infinite":"gentleBob 2s ease infinite",
        pointerEvents:"none" }}>
        {catState === "scared" ? "🙀" : "🐱"}
        {catState === "approach" && (
          <div style={{ position:"absolute",top:-16,left:"50%",transform:"translateX(-50%)",
            fontSize:10,color:"#ff8fab",animation:"pulse 1s ease infinite" }}>♡</div>
        )}
      </div>

      {/* Snack near button */}
      {snackNearButton && (
        <div style={{ position:"absolute",left:`${BUTTON_X + 8}%`,top:`${BUTTON_Y - 2}%`,
          fontSize:24,zIndex:33,pointerEvents:"none",animation:"float 2s ease infinite" }}>
          🐟
        </div>
      )}

      {/* Mic button - glassmorphism design */}
      {micAvailable && !micActive && (
        <div onClick={(e) => { e.stopPropagation(); startMic(); }}
          style={{ position:"absolute",bottom:"5%",right:"5%",zIndex:36,
            width:52,height:52,borderRadius:"50%",cursor:"pointer",
            background:"linear-gradient(135deg,rgba(255,255,255,0.15),rgba(255,255,255,0.05))",
            backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
            border:"1px solid rgba(255,255,255,0.25)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
            boxShadow:"0 8px 32px rgba(0,0,0,0.08), inset 0 1px 1px rgba(255,255,255,0.3), 0 2px 8px rgba(232,67,147,0.15)",
            transition:"all 0.2s ease" }}>
          🎤
          <div style={{ position:"absolute",inset:0,borderRadius:"50%",
            background:"radial-gradient(circle at 30% 25%,rgba(255,255,255,0.2),transparent 60%)",
            pointerEvents:"none" }}/>
        </div>
      )}
      {micActive && (
        <div style={{ position:"absolute",bottom:"5%",right:"5%",zIndex:36,
          width:52,height:52,borderRadius:"50%",
          background:"linear-gradient(135deg,rgba(232,67,147,0.2),rgba(232,67,147,0.08))",
          backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
          border:"1px solid rgba(232,67,147,0.35)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
          boxShadow:"0 0 24px rgba(232,67,147,0.25), inset 0 1px 1px rgba(255,255,255,0.2), 0 4px 16px rgba(232,67,147,0.15)",
          animation:"pulse 1s ease infinite" }}>
          🎤
          <div style={{ position:"absolute",top:-24,fontSize:9,letterSpacing:2,fontWeight:800,
            color:"#e84393",textShadow:"0 0 8px rgba(232,67,147,0.4)",
            background:"rgba(232,67,147,0.08)",backdropFilter:"blur(8px)",
            padding:"2px 8px",borderRadius:99,border:"1px solid rgba(232,67,147,0.2)" }}>LIVE</div>
          <div style={{ position:"absolute",inset:0,borderRadius:"50%",
            background:"radial-gradient(circle at 30% 25%,rgba(255,255,255,0.15),transparent 60%)",
            pointerEvents:"none" }}/>
        </div>
      )}

      {/* SOS button (E12) - nuclear button DNA: pill shape, red glow, same visual language */}
      {showSOS && (
        <div onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(12); }}
          style={{ position:"absolute",top:"10%",left:"8%",zIndex:36,
            padding:"14px 28px",
            background:"radial-gradient(circle at 36% 28%, #f06a52, #e8573d 50%, #c94433 100%)",
            borderRadius:999,cursor:"pointer",
            color:"#fff",fontSize:13,fontWeight:800,letterSpacing:3,
            boxShadow:"0 8px 32px rgba(232,87,61,0.35), 0 3px 8px rgba(0,0,0,0.1), inset 0 -3px 6px rgba(200,60,40,0.25)",
            border:"2px solid rgba(255,255,255,0.15)",
            textShadow:"0 2px 6px rgba(0,0,0,0.25)",
            animation:"glowPulse 2s ease infinite",
            position:"relative",overflow:"hidden" }}>
          {/* Highlight spot - matching nuclear button's glossy effect */}
          <div style={{ position:"absolute",top:"10%",left:"14%",width:"30%",height:"40%",
            borderRadius:"50%",background:"rgba(255,255,255,0.18)",filter:"blur(4px)",
            pointerEvents:"none" }}/>
          <div style={{ position:"absolute",top:"18%",left:"22%",width:"14%",height:"14%",
            borderRadius:"50%",background:"rgba(255,255,255,0.3)",filter:"blur(2px)",
            pointerEvents:"none" }}/>
          SOS
        </div>
      )}

      {/* Cat distance indicator - polished warning badge */}
      {(() => {
        const dist = Math.sqrt((catX - BUTTON_X) ** 2 + (catY - BUTTON_Y) ** 2);
        if (dist < 20 && catState !== "scared") {
          const urgency = dist < 12 ? 1 : (20 - dist) / 8;
          return (
            <div style={{ position:"absolute",left:"50%",top:"55%",transform:"translateX(-50%)",
              zIndex:34,pointerEvents:"none",
              display:"flex",alignItems:"center",gap:6,
              padding:"6px 16px",borderRadius:99,
              background:`rgba(232,87,61,${0.06 + urgency * 0.06})`,
              backdropFilter:"blur(8px)",WebkitBackdropFilter:"blur(8px)",
              border:`1px solid rgba(232,87,61,${0.15 + urgency * 0.2})`,
              boxShadow:`0 4px 16px rgba(232,87,61,${0.08 + urgency * 0.12})`,
              animation:dist < 12 ? "pulse 0.5s ease infinite" : "pulse 1.2s ease infinite" }}>
              <div style={{ width:6,height:6,borderRadius:"50%",
                background:"#e8573d",
                boxShadow:"0 0 8px rgba(232,87,61,0.6)",
                animation:"pulse 0.8s ease infinite" }}/>
              <span style={{ fontSize:11,color:"#e8573d",fontWeight:800,letterSpacing:1,
                textShadow:"0 1px 4px rgba(232,87,61,0.2)" }}>
                고양이 접근 중
              </span>
            </div>
          );
        }
        return null;
      })()}
    </div>
  );
}

// ============================================================
// STAGE 4: 비상상황 (Emergency) - 90초
// 점점 무서워지는 가짜 비상 알림. 모든 버튼이 함정.
// ============================================================
function Stage4_Emergency({ elapsed, duration, say, attemptEnding, resetIdle, activeEvent, frame, doShake }) {
  const [phase, setPhase] = useState(0);
  const [countdownVal, setCountdownVal] = useState(null);
  const [showNuke, setShowNuke] = useState(false);
  const [showCry, setShowCry] = useState(false);
  const [chaosButtons, setChaosButtons] = useState([]);
  const [shaking, setShaking] = useState(false);
  const [sirenOn, setSirenOn] = useState(false);
  const [countdownDone, setCountdownDone] = useState(false);
  const [cryDone, setCryDone] = useState(false);
  const saidRef = useRef({});

  const saySafe = useCallback((key, text, emo) => {
    if (saidRef.current[key]) return;
    saidRef.current[key] = true;
    say(text, emo);
  }, [say]);

  // Phase progression
  useEffect(() => {
    if (activeEvent) return;
    if (elapsed < 15) { setPhase(0); saySafe("p0", "여기 좀... 이상하다... 무슨 일이 생길 것 같아...", "pouty"); }
    else if (elapsed < 30) {
      if (phase < 1) {
        setPhase(1);
        setShowNuke(true);
        doShake();
        saySafe("p1", "[속보] 핵미사일이 발사됐다!! 반격해야 해!!", "shocked");
      }
    }
    else if (elapsed < 50) {
      if (phase < 2) {
        setPhase(2);
        setCountdownVal(3);
        doShake();
        setSirenOn(true);
        saySafe("p2", "카운트다운이다!! 긴급 정지 버튼 눌러!!!", "shocked");
      }
    }
    else if (elapsed < 70) {
      if (phase < 3) {
        setPhase(3);
        setShowCry(true);
        setSirenOn(false);
        saySafe("p3", "으으... 나 무서워... 나 죽어... 제발 살려줘...", "cry");
      }
    }
    else {
      if (phase < 4) {
        setPhase(4);
        setShaking(true);
        setSirenOn(true);
        // Generate chaos buttons
        setChaosButtons(Array.from({length:6}, (_, i) => ({
          id: i,
          label: ["자폭","중단","도망","발사","항복","구조"][i],
          x: 10 + Math.random() * 75,
          y: 20 + Math.random() * 55,
          color: ["#e8573d","#c94040","#d44a3a","#b83830","#e06050","#cf5548"][i],
        })));
        doShake();
        saySafe("p4", "으아아악!!! 다 무너진다!!! 아무거나 눌러!!!", "shocked");
      }
    }
  }, [elapsed, phase, activeEvent, doShake, saySafe]);

  // Countdown ticker
  useEffect(() => {
    if (countdownVal === null || countdownVal <= 0) return;
    const t = setTimeout(() => setCountdownVal(p => p !== null && p > 0 ? p - 1 : 0), 1000);
    return () => clearTimeout(t);
  }, [countdownVal]);

  // Countdown reaches 0 → nothing happens!
  useEffect(() => {
    if (countdownVal === 0 && !countdownDone) {
      setCountdownDone(true);
      setTimeout(() => {
        setSirenOn(false);
        saySafe("cd0", "...어? 아무 일도 안 일어났어? ...뻥이야~ 쫄았지? ㅋㅋㅋ", "smug");
      }, 1500);
    }
  }, [countdownVal, countdownDone, saySafe]);

  // Cry done
  useEffect(() => {
    if (phase >= 3 && elapsed >= 65 && !cryDone) {
      setCryDone(true);
      saySafe("crydone", "...뭐야 진짜로 안 눌러? 치, 연기였는데.", "smug");
    }
  }, [phase, elapsed, cryDone, saySafe]);

  // Shaking effect for phase 4
  useEffect(() => {
    if (!shaking) return;
    const iv = setInterval(() => doShake(), 2000);
    return () => clearInterval(iv);
  }, [shaking, doShake]);

  return (
    <div style={{ position:"absolute",inset:0,zIndex:30,pointerEvents:activeEvent?"none":"auto" }}>
      {/* Siren overlay - dual-layer red pulse for premium feel */}
      {sirenOn && (<>
        <div style={{ position:"absolute",inset:0,zIndex:28,pointerEvents:"none",
          background:"radial-gradient(ellipse at 50% 30%,rgba(232,87,61,0.08),transparent 70%)",
          animation:"siren 0.5s ease infinite" }}/>
        <div style={{ position:"absolute",inset:0,zIndex:28,pointerEvents:"none",
          borderTop:`2px solid rgba(232,87,61,${phase>=4?0.4:0.2})`,
          borderBottom:`2px solid rgba(232,87,61,${phase>=4?0.4:0.2})`,
          boxShadow:`inset 0 4px 20px rgba(232,87,61,${phase>=4?0.12:0.06}), inset 0 -4px 20px rgba(232,87,61,${phase>=4?0.12:0.06})` }}/>
      </>)}

      {/* Phase 0: Quiet, tension building - subtle creeping vignette */}
      {phase === 0 && (
        <div style={{ position:"absolute",inset:0,zIndex:29,pointerEvents:"none",
          background:"radial-gradient(ellipse at 50% 50%,transparent 30%,rgba(0,0,0,0.12) 70%,rgba(0,0,0,0.25) 100%)",
          transition:"background 2s ease" }}/>
      )}

      {/* Phase 1: Nuclear news broadcast + "반격" button (E14) */}
      {showNuke && phase >= 1 && (
        <div style={{ position:"absolute",top:"10%",left:"50%",transform:"translateX(-50%)",
          zIndex:35,width:340,textAlign:"center",animation:"popIn 0.3s ease" }}>
          {/* Broadcast card with dark glass backdrop */}
          <div style={{ background:"rgba(20,10,10,0.85)",backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
            borderRadius:16,padding:"24px 20px 28px",border:"1px solid rgba(232,87,61,0.25)",
            boxShadow:"0 12px 48px rgba(0,0,0,0.5), 0 0 60px rgba(232,87,61,0.08)" }}>
            {/* Breaking news banner */}
            <div style={{ background:"linear-gradient(135deg,#c62828,#e8573d)",padding:"6px 24px",borderRadius:20,marginBottom:16,
              boxShadow:"0 4px 16px rgba(232,87,61,0.4)",display:"inline-block" }}>
              <span style={{ color:"#fff",fontSize:11,fontWeight:800,letterSpacing:8,textTransform:"uppercase" }}>BREAKING</span>
            </div>
            {/* Scanline effect */}
            <div style={{ position:"absolute",top:0,left:0,right:0,bottom:0,borderRadius:16,overflow:"hidden",pointerEvents:"none" }}>
              <div style={{ position:"absolute",width:"100%",height:2,background:"rgba(232,87,61,0.06)",animation:"scanline 3s linear infinite" }}/>
            </div>
            {/* Headline */}
            <div style={{ color:"#fff",fontSize:20,fontWeight:800,marginBottom:6,lineHeight:1.4,
              textShadow:"0 2px 12px rgba(232,87,61,0.3)" }}>
              <span style={{ color:"#e8573d" }}>&#9762;</span> 핵미사일 발사!
            </div>
            <div style={{ color:"rgba(255,138,128,0.8)",fontSize:11,marginBottom:6,letterSpacing:1 }}>전 세계 비상사태 선포</div>
            {/* Ticker line */}
            <div style={{ width:"60%",height:1,background:"linear-gradient(90deg,transparent,rgba(232,87,61,0.3),transparent)",margin:"0 auto 18px" }}/>
            {/* 반격 button - nuclear button DNA: pill shape, red glow, same accent */}
            <div onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(14); }}
              style={{ padding:"14px 38px",
                background:"radial-gradient(ellipse at 40% 30%,#ef6049,#e8573d 50%,#c94040 100%)",
                borderRadius:18,cursor:"pointer",
                color:"#fff",fontSize:16,fontWeight:800,letterSpacing:4,display:"inline-block",
                boxShadow:"0 6px 24px rgba(232,87,61,0.45), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                border:"1px solid rgba(232,87,61,0.3)",
                animation:"pulse 1s ease infinite",
                transition:"transform 0.12s ease" }}>
              반격
            </div>
          </div>
        </div>
      )}

      {/* Phase 2: Countdown + "긴급정지" button (E13) */}
      {phase >= 2 && countdownVal !== null && (
        <div style={{ position:"absolute",top:"45%",left:"50%",transform:"translate(-50%,-50%)",
          zIndex:36,textAlign:"center" }}>
          {/* Countdown number with dramatic glow ring */}
          <div style={{ position:"relative",display:"inline-block" }}>
            {countdownVal > 0 && (
              <div style={{ position:"absolute",inset:-30,borderRadius:"50%",
                border:"2px solid rgba(232,87,61,0.15)",
                boxShadow:"0 0 40px rgba(232,87,61,0.1), inset 0 0 40px rgba(232,87,61,0.05)",
                animation:"pulse 0.5s ease infinite" }}/>
            )}
            <div style={{ fontSize:100,fontWeight:800,fontFamily:"'Noto Sans KR',monospace",
              color:countdownVal>0?"#e8573d":"#ffd700",
              animation:countdownVal>0?"pulse 0.5s ease infinite":"popIn 0.5s ease",
              textShadow:countdownVal>0
                ?"0 0 30px rgba(232,87,61,0.5), 0 0 60px rgba(232,87,61,0.2), 0 8px 40px rgba(232,87,61,0.25)"
                :"0 0 30px rgba(255,215,0,0.4), 0 8px 40px rgba(255,215,0,0.15)",
              WebkitTextStroke:countdownVal>0?"1px rgba(232,87,61,0.3)":"none" }}>
              {countdownVal > 0 ? countdownVal : "\uD83C\uDF86"}
            </div>
          </div>
          {countdownVal > 0 && (
            <div onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(13); }}
              style={{ marginTop:20,padding:"14px 34px",
                background:"radial-gradient(ellipse at 40% 30%,#ef6049,#e8573d 50%,#c94040 100%)",
                borderRadius:18,cursor:"pointer",
                color:"#fff",fontSize:15,fontWeight:800,letterSpacing:3,
                display:"inline-block",
                boxShadow:"0 6px 24px rgba(232,87,61,0.45), 0 2px 8px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.15)",
                border:"1px solid rgba(232,87,61,0.3)",
                animation:"shake 0.2s ease infinite",
                transition:"transform 0.12s ease" }}>
              긴급 정지
            </div>
          )}
          {countdownVal === 0 && (
            <div style={{ fontSize:13,color:"#ffd700",marginTop:10,
              textShadow:"0 2px 8px rgba(255,215,0,0.3)" }}>아무 일도 안 일어남!</div>
          )}
        </div>
      )}

      {/* Phase 3: Navi crying + "살리기" button (E15) */}
      {showCry && phase >= 3 && (
        <div style={{ position:"absolute",bottom:"18%",left:"50%",transform:"translateX(-50%)",
          zIndex:36,textAlign:"center",animation:"fadeInUp 0.5s ease" }}>
          {!cryDone && (
            <div onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(15); }}
              style={{ padding:"14px 34px",
                background:"linear-gradient(160deg,#3a2828,#2e2020)",
                borderRadius:18,cursor:"pointer",
                color:"#e8a8a0",fontSize:15,fontWeight:800,letterSpacing:2,
                boxShadow:"0 6px 24px rgba(0,0,0,0.5), 0 0 20px rgba(232,87,61,0.1), inset 0 1px 0 rgba(255,255,255,0.05)",
                border:"1px solid rgba(232,87,61,0.2)",
                animation:"pulse 1.5s ease infinite",
                transition:"transform 0.12s ease" }}>
              살리기
            </div>
          )}
        </div>
      )}

      {/* Phase 4: Total chaos - multiple fake buttons (all → E14) - red-toned fragments of the button */}
      {phase === 4 && chaosButtons.map(btn => (
        <div key={btn.id}
          onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(14); }}
          style={{ position:"absolute",left:`${btn.x}%`,top:`${btn.y}%`,zIndex:37,
            padding:"12px 24px",
            background:`radial-gradient(ellipse at 40% 30%,${btn.color}ff,${btn.color} 60%,${btn.color}bb 100%)`,
            borderRadius:16,cursor:"pointer",
            color:"#fff",fontSize:13,fontWeight:800,letterSpacing:1,
            boxShadow:`0 6px 20px ${btn.color}55, 0 2px 6px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.12)`,
            border:`1px solid ${btn.color}44`,
            animation:`shake 0.${btn.id+1}s ease infinite`,
            transform:"translate(-50%,-50%)" }}>
          {btn.label}
        </div>
      ))}

      {/* Vignette for tension - multi-layered for premium depth */}
      {phase >= 1 && (<>
        {/* Outer vignette - dark corners */}
        <div style={{ position:"absolute",inset:0,zIndex:27,pointerEvents:"none",
          background:`radial-gradient(ellipse at 50% 50%,transparent ${Math.max(60 - phase*8, 20)}%,rgba(0,0,0,${Math.min(phase*0.06, 0.3)}) 100%)` }}/>
        {/* Inner red glow vignette */}
        <div style={{ position:"absolute",inset:0,zIndex:27,pointerEvents:"none",
          boxShadow:`inset 0 0 ${phase*40+20}px rgba(232,87,61,${Math.min(phase*0.04, 0.18)}),
                     inset 0 0 ${phase*80+40}px rgba(232,87,61,${Math.min(phase*0.02, 0.08)})` }}/>
        {/* Top/bottom edge glow for cinematic feel */}
        <div style={{ position:"absolute",inset:0,zIndex:27,pointerEvents:"none",
          background:`linear-gradient(180deg,rgba(232,87,61,${phase>=3?0.04:0.02}) 0%,transparent 15%,transparent 85%,rgba(232,87,61,${phase>=3?0.04:0.02}) 100%)` }}/>
      </>)}
    </div>
  );
}

// ============================================================
// STAGE 5: 나비의 선물 (Navi's Gift) - 180초
// 나비가 처음으로 친절하게 행동. "도움" 버튼 = 전부 함정.
// ============================================================
function Stage5_NaviGift({ elapsed, duration, say, attemptEnding, resetIdle, activeEvent, frame, doShake }) {
  const [showShield, setShowShield] = useState(false);
  const [showTimerHack, setShowTimerHack] = useState(false);
  const [timerHackClicks, setTimerHackClicks] = useState(0);
  const [fakeTimerOffset, setFakeTimerOffset] = useState(0);
  const [showDoor, setShowDoor] = useState(false);
  const [doorKnocks, setDoorKnocks] = useState(0);
  const [showRest, setShowRest] = useState(false);
  const [showGolden, setShowGolden] = useState(false);
  const [goldenCeremony, setGoldenCeremony] = useState(false);
  const [naviPhase, setNaviPhase] = useState("nice"); // nice, annoyed, desperate, respect
  const saidRef = useRef({});

  const saySafe = useCallback((key, text, emo) => {
    if (saidRef.current[key]) return;
    saidRef.current[key] = true;
    say(text, emo);
  }, [say]);

  // Timeline events
  useEffect(() => {
    if (activeEvent) return;
    if (elapsed >= 5) saySafe("intro", "마지막 스테이지야! 여기까지 온 너를 위해 선물을 준비했어~", "excited");
    if (elapsed >= 15) saySafe("nice", "진짜야! 이번엔 도와줄게~ 나 착해졌어~", "excited");
    if (elapsed >= 20 && !showShield) { setShowShield(true); saySafe("shield", "보호막을 켜줄게! 이 버튼 눌러!", "excited"); }
    if (elapsed >= 50 && !showTimerHack) { setShowTimerHack(true); saySafe("timer", "타이머 단축해줄게~ 이거 눌러봐!", "excited"); }
    if (elapsed >= 70 && naviPhase === "nice") { setNaviPhase("annoyed"); saySafe("annoyed", "야... 왜 하나도 안 써? 서운하잖아...", "pouty"); }
    if (elapsed >= 80 && !showDoor) { setShowDoor(true); saySafe("door", "탈출구 만들어줬어! 저기 문!", "excited"); }
    if (elapsed >= 100 && naviPhase === "annoyed") { setNaviPhase("desperate"); saySafe("desperate", "제발 하나만 눌러줘!! 나 무시하는 거야?!", "pouty"); }
    if (elapsed >= 120 && !showRest) { setShowRest(true); saySafe("rest", "피곤하지? 쉬어도 돼~ 아무것도 안 해도 괜찮아~", "excited"); }
    if (elapsed >= 140 && naviPhase === "desperate") { setNaviPhase("respect"); saySafe("respect", "...인정할게. 좀 대단해. 진짜 끝까지 안 누를 거야?", "shocked"); }
    if (elapsed >= 150 && !showGolden) { setShowGolden(true); saySafe("golden", "🏆 올클리어! 축하해! 이 황금 버튼을 받아!", "excited"); }
    if (elapsed >= 170) saySafe("final", "10초만 더! 제발... 그냥 한 번만... 아무거나...", "cry");
  }, [elapsed, activeEvent, showShield, showTimerHack, showDoor, showRest, showGolden, naviPhase, saySafe]);

  return (
    <div style={{ position:"absolute",inset:0,zIndex:30,pointerEvents:activeEvent?"none":"auto" }}>

      {/* Premium warm gift-like overlay - layered radial glows */}
      <div style={{ position:"absolute",inset:0,zIndex:28,pointerEvents:"none",
        background:"radial-gradient(ellipse at 50% 30%,rgba(220,200,255,0.12),transparent 55%), radial-gradient(ellipse at 30% 70%,rgba(232,87,61,0.04),transparent 50%), radial-gradient(ellipse at 70% 60%,rgba(255,215,180,0.06),transparent 50%)" }}/>
      {/* Subtle floating particle shimmer */}
      <div style={{ position:"absolute",inset:0,zIndex:28,pointerEvents:"none",
        background:"radial-gradient(circle at 20% 25%,rgba(255,255,255,0.06) 0%,transparent 2%), radial-gradient(circle at 75% 35%,rgba(255,255,255,0.05) 0%,transparent 1.5%), radial-gradient(circle at 45% 75%,rgba(255,255,255,0.04) 0%,transparent 2%), radial-gradient(circle at 85% 80%,rgba(232,87,61,0.03) 0%,transparent 2%)",
        animation:"glowPulse 4s ease infinite" }}/>

      {/* "보호막 ON" button (E19) - nuclear button DNA: red accent pill with glow */}
      {showShield && (
        <div onClick={(e) => { e.stopPropagation(); resetIdle(); attemptEnding(19); }}
          style={{ position:"absolute",top:"15%",left:"15%",zIndex:35,
            padding:"16px 28px",
            background:"radial-gradient(circle at 36% 28%,#e8573d,#c94433 60%,#6a1b9a 100%)",
            borderRadius:999,cursor:"pointer",textAlign:"center",
            boxShadow:"0 8px 32px rgba(232,87,61,0.35), 0 3px 8px rgba(0,0,0,0.1), inset 0 -3px 6px rgba(200,60,40,0.25)",
            animation:"glowPulse 2s ease infinite",
            position:"relative",overflow:"hidden" }}>
          {/* Specular highlight - nuclear button DNA */}
          <div style={{ position:"absolute",top:"10%",left:"14%",width:"30%",height:"40%",
            borderRadius:"50%",background:"rgba(255,255,255,0.2)",filter:"blur(6px)",pointerEvents:"none" }}/>
          <div style={{ fontSize:10,color:"rgba(255,220,220,0.9)",letterSpacing:3,marginBottom:4,
            textShadow:"0 1px 4px rgba(0,0,0,0.3)" }}>SHIELD</div>
          <div style={{ color:"#fff",fontSize:15,fontWeight:800,
            textShadow:"0 2px 6px rgba(0,0,0,0.25)" }}>보호막 ON</div>
          <div style={{ fontSize:9,color:"rgba(255,200,200,0.8)",marginTop:4 }}>클릭하면 무적!</div>
        </div>
      )}

      {/* "타이머 단축" button (E17 on 2nd click) - nuclear button DNA: red accent pill */}
      {showTimerHack && (
        <div onClick={(e) => {
          e.stopPropagation(); resetIdle();
          setTimerHackClicks(p => {
            const n = p + 1;
            if (n === 1) {
              // First click: just visual troll
              setFakeTimerOffset(120);
              say("짠~! 타이머 줄여줬어! ...어라? 표시만 바뀐 건 아닐까?", "smug");
              return n;
            }
            if (n >= 2) {
              attemptEnding(17);
              return 0;
            }
            return n;
          });
        }}
          style={{ position:"absolute",top:"15%",right:"15%",zIndex:35,
            padding:"16px 28px",
            background:"radial-gradient(circle at 40% 30%,#e8573d,#c94433 55%,#607d8b 100%)",
            borderRadius:999,cursor:"pointer",textAlign:"center",
            boxShadow:"0 8px 32px rgba(232,87,61,0.3), 0 3px 8px rgba(0,0,0,0.1), inset 0 -3px 6px rgba(200,60,40,0.2)",
            position:"relative",overflow:"hidden" }}>
          {/* Specular highlight - nuclear button DNA */}
          <div style={{ position:"absolute",top:"10%",left:"14%",width:"30%",height:"40%",
            borderRadius:"50%",background:"rgba(255,255,255,0.18)",filter:"blur(6px)",pointerEvents:"none" }}/>
          <div style={{ fontSize:10,color:"rgba(255,220,220,0.9)",letterSpacing:3,marginBottom:4,
            textShadow:"0 1px 4px rgba(0,0,0,0.3)" }}>TIMER</div>
          <div style={{ color:"#fff",fontSize:15,fontWeight:800,
            textShadow:"0 2px 6px rgba(0,0,0,0.25)" }}>타이머 단축</div>
          <div style={{ fontSize:9,color:"rgba(255,200,200,0.8)",marginTop:4 }}>
            {timerHackClicks > 0 ? "한번 더?" : "시간을 줄여줄게~"}
          </div>
        </div>
      )}

      {/* Fake timer display when hacked */}
      {fakeTimerOffset > 0 && (
        <div style={{ position:"absolute",top:"8%",left:"50%",transform:"translateX(-50%)",
          zIndex:34,fontSize:13,color:"#78909c",fontWeight:700,letterSpacing:3,
          background:"rgba(255,255,255,0.8)",padding:"4px 14px",borderRadius:8,
          pointerEvents:"none" }}>
          (진짜 타이머는 변하지 않았어요)
        </div>
      )}

      {/* Door - "탈출구!" (E18 at 5 knocks) - premium wooden door */}
      {showDoor && (
        <div onClick={(e) => {
          e.stopPropagation(); resetIdle();
          setDoorKnocks(p => {
            const n = p + 1;
            if (n === 1) say("똑똑...", "idle");
            else if (n === 3) say("누구세요~?", "smug");
            if (n >= 5) { attemptEnding(18); return 0; }
            return n;
          });
        }}
          style={{ position:"absolute",left:"8%",top:"30%",zIndex:35,
            width:84,height:138,
            background:"linear-gradient(178deg,#d4a87a 0%,#b8895a 25%,#a07548 50%,#8a6238 75%,#7a5530 100%)",
            border:"none",borderRadius:"6px 6px 2px 2px",cursor:"pointer",
            boxShadow:"0 8px 28px rgba(0,0,0,0.3), inset 3px 0 8px rgba(0,0,0,0.15), inset -3px 0 8px rgba(0,0,0,0.1), inset 0 3px 6px rgba(255,220,180,0.2)",
            display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
            position:"relative",overflow:"hidden" }}>
          {/* Door frame border */}
          <div style={{ position:"absolute",inset:0,borderRadius:"6px 6px 2px 2px",
            border:"4px solid #6a4a2a",
            boxShadow:"inset 0 0 0 1px rgba(255,220,180,0.15), inset 0 0 0 6px rgba(90,60,30,0.2)",
            pointerEvents:"none" }}/>
          {/* Wood grain lines */}
          <div style={{ position:"absolute",top:"15%",left:"10%",width:"80%",height:"1px",
            background:"rgba(90,60,30,0.2)",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",top:"40%",left:"8%",width:"84%",height:"1px",
            background:"rgba(90,60,30,0.15)",pointerEvents:"none" }}/>
          <div style={{ position:"absolute",top:"65%",left:"12%",width:"76%",height:"1px",
            background:"rgba(90,60,30,0.18)",pointerEvents:"none" }}/>
          {/* Door handle */}
          <div style={{ position:"absolute",right:10,top:"52%",width:8,height:8,borderRadius:"50%",
            background:"radial-gradient(circle at 35% 35%,#ffd700,#c8a000)",
            boxShadow:"0 2px 6px rgba(0,0,0,0.3), inset 0 1px 2px rgba(255,255,255,0.4)",
            pointerEvents:"none" }}/>
          <div style={{ fontSize:10,color:"#fff",fontWeight:800,letterSpacing:2,
            background:"rgba(0,0,0,0.35)",padding:"4px 12px",borderRadius:8,marginBottom:8,
            backdropFilter:"blur(4px)",WebkitBackdropFilter:"blur(4px)",
            boxShadow:"0 2px 8px rgba(0,0,0,0.2)",
            border:"1px solid rgba(255,255,255,0.1)" }}>
            탈출구!
          </div>
          <div style={{ fontSize:28,filter:"drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }}>🚪</div>
          {doorKnocks > 0 && (
            <div style={{ fontSize:10,color:"#ffd700",marginTop:4,fontWeight:700,
              textShadow:"0 1px 4px rgba(0,0,0,0.4)" }}>
              🤛 x{doorKnocks}
            </div>
          )}
        </div>
      )}

      {/* "쉬어도 돼~" rest trap - premium glassmorphism panel */}
      {showRest && (
        <div style={{ position:"absolute",bottom:"18%",left:"50%",transform:"translateX(-50%)",
          zIndex:35,padding:"18px 32px",
          background:"rgba(70,60,120,0.45)",
          backdropFilter:"blur(20px)",WebkitBackdropFilter:"blur(20px)",
          borderRadius:20,
          textAlign:"center",pointerEvents:"none",
          boxShadow:"0 12px 40px rgba(60,50,100,0.3), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(0,0,0,0.1)",
          border:"1px solid rgba(255,255,255,0.12)",
          animation:"fadeInUp 0.5s ease" }}>
          <div style={{ color:"#fff",fontSize:14,fontWeight:700,
            textShadow:"0 1px 6px rgba(0,0,0,0.2)" }}>💤 쉬어도 돼~</div>
          <div style={{ fontSize:10,color:"rgba(200,195,230,0.9)",marginTop:6 }}>아무것도 안 해도 괜찮아...</div>
          <div style={{ fontSize:8,color:"rgba(160,155,200,0.7)",marginTop:4,
            background:"rgba(255,255,255,0.06)",padding:"2px 8px",borderRadius:6,
            display:"inline-block" }}>(방치 한계가 줄었어요: 30초)</div>
        </div>
      )}

      {/* "올클리어!" golden button (E19) - nuclear button DNA: red undertone pill */}
      {showGolden && (
        <div onClick={(e) => {
          e.stopPropagation(); resetIdle();
          if (!goldenCeremony) {
            setGoldenCeremony(true);
            say("축하해!! 올클리어야!! ...아 잠깐, 이게 아닌데?", "excited");
            setTimeout(() => attemptEnding(19), 2000);
          }
        }}
          style={{ position:"absolute",bottom:"30%",left:"50%",transform:"translateX(-50%)",
            zIndex:36,padding:"20px 44px",
            background:goldenCeremony
              ?"radial-gradient(circle at 36% 28%,#e8573d,#c94433 50%,#6a1b9a 100%)"
              :"radial-gradient(circle at 50% 40%,#ffe066,#ffd700 40%,#ff8f00 80%,#e8573d 100%)",
            borderRadius:999,cursor:"pointer",textAlign:"center",
            boxShadow:goldenCeremony
              ?"0 8px 32px rgba(232,87,61,0.45), 0 3px 8px rgba(0,0,0,0.15), inset 0 -3px 6px rgba(200,60,40,0.3)"
              :"0 8px 32px rgba(255,215,0,0.4), 0 0 0 2px rgba(232,87,61,0.2), inset 0 -3px 6px rgba(200,120,0,0.2)",
            border:goldenCeremony?"2px solid rgba(232,87,61,0.5)":"2px solid rgba(232,87,61,0.15)",
            animation:"popIn 0.5s ease",
            position:"relative",overflow:"hidden" }}>
          {/* Specular highlight - nuclear button DNA */}
          <div style={{ position:"absolute",top:"8%",left:"16%",width:"28%",height:"35%",
            borderRadius:"50%",background:goldenCeremony?"rgba(255,255,255,0.15)":"rgba(255,255,255,0.3)",
            filter:"blur(6px)",pointerEvents:"none" }}/>
          <div style={{ fontSize:10,color:"#fff",letterSpacing:4,marginBottom:6,
            textShadow:"0 1px 4px rgba(0,0,0,0.3)" }}>
            {goldenCeremony ? "✦ ERROR ✦" : "ALL CLEAR"}
          </div>
          <div style={{ color:"#fff",fontSize:18,fontWeight:800,
            textShadow:"0 2px 6px rgba(0,0,0,0.25)" }}>
            {goldenCeremony ? "함정이었어~" : "올클리어!"}
          </div>
        </div>
      )}

      {/* Navi phase indicator - polished glassmorphism tag */}
      <div style={{ position:"absolute",bottom:"5%",left:"5%",zIndex:34,
        fontSize:10,color:"rgba(255,255,255,0.6)",letterSpacing:2,pointerEvents:"none",
        background:"rgba(255,255,255,0.06)",
        backdropFilter:"blur(12px)",WebkitBackdropFilter:"blur(12px)",
        padding:"6px 14px",borderRadius:12,
        border:"1px solid rgba(255,255,255,0.08)",
        boxShadow:"0 4px 12px rgba(0,0,0,0.08)" }}>
        {naviPhase === "nice" && "나비: 친절 모드"}
        {naviPhase === "annoyed" && "나비: 짜증 모드"}
        {naviPhase === "desperate" && "나비: 절박 모드"}
        {naviPhase === "respect" && "나비: 인정 모드"}
      </div>
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
  const [warningData, setWarningData] = useState(null);
  const [stageCleared, setStageCleared] = useState(() => {
    try { return parseInt(localStorage.getItem("dpb_stage_cleared") || "0"); } catch { return 0; }
  });
  const [temptationLevel, setTemptationLevel] = useState(0);

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
    setWarningData(null);
    if (gameMode === "stage") {
      setStageTimer(STAGE_DURATIONS[currentStage]);
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
    if (gameMode === "stage" && !STAGE_ENDINGS[currentStage]?.includes(16)) return;
    const iv = setInterval(() => {
      idleRef.current += 1; setIdleTimer(idleRef.current);
      // Stage 5: 120초 이후 방치 한계 30초로 축소
      const limit = (gameMode === "stage" && currentStage === 5 && (STAGE_DURATIONS[5] - stageTimer) >= 120) ? 30 : IDLE_LIMIT;
      if (idleRef.current >= limit && !activeEvent) {
        if (gameMode === "stage") attemptEnding(16);
        else triggerEnding(16);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [gs, activeEvent, gameMode, currentStage, stageTimer]);

  const resetIdle = useCallback(() => { idleRef.current = 0; setIdleTimer(0); }, []);

  // ── 창 숨김 (엔딩4) ──
  useEffect(() => {
    if (gs !== "room") return;
    const handler = () => {
      if (document.hidden) { setWasHidden(true); setNaviYawn(true); }
      else if (wasHidden && !activeEvent) {
        setNaviYawn(false);
        if (gameMode === "stage" && !STAGE_ENDINGS[currentStage]?.includes(4)) return;
        if (gameMode === "stage") attemptEnding(4);
        else triggerEnding(4);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [gs, wasHidden, activeEvent, gameMode, currentStage]);

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

  // (스테이지 대사는 각 Stage 컴포넌트가 직접 say() 호출)

  // ── 유혹 게이지 ──
  useEffect(() => {
    if (gs !== "room" || gameMode !== "stage") { setTemptationLevel(0); return; }
    const duration = STAGE_DURATIONS[currentStage];
    const elapsed = duration - stageTimer;
    setTemptationLevel(Math.min((elapsed / duration) * 100, 100));
  }, [gs, gameMode, currentStage, stageTimer]);

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
    return STAGE_ENDINGS[currentStage]?.includes(endingId) ?? false;
  }, [gameMode, currentStage]);

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
    resetIdle();
    if (gameMode === "stage") {
      switch (currentStage) {
        case 2: say("매수 누른 거야?! ...아직 체결 안 됐지만. 한 번 더 눌러봐~!", "excited"); break;
        case 3: say("만지고 싶지~? 히히~ 아직은 안 돼~", "smug"); break;
        case 4: say("비상 정지?! ...아직 비상이 아닌데~ 아닌가?", "shocked"); break;
        case 5: say("선물 받고 싶어~? 좀만 더 기다려봐~!", "excited"); break;
        default: say("누르지 말라고 했잖아~! ...아직 아무 일도 안 일어났지만.", "pouty");
      }
    } else {
      say("누르지 말라고 했잖아~! ...아직 아무 일도 안 일어났지만.", "pouty");
    }
  }, [activeEvent, pressEventButton, say, resetIdle, gameMode, currentStage]);

  const handleBgClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    const now = Date.now();
    setBgClicks(prev => {
      const recent = [...prev.filter(t => now - t < RAPID_CLICK_WINDOW), now];
      if (recent.length >= RAPID_CLICK_THRESHOLD) {
        if (gameMode === "stage" && !STAGE_ENDINGS[currentStage]?.includes(7)) return recent;
        if (gameMode === "stage") { attemptEnding(7); return []; }
        triggerEnding(7); return [];
      }
      return recent;
    });
  }, [activeEvent, resetIdle, triggerEnding, attemptEnding, gameMode, currentStage]);

  const handleButtonHover = useCallback((isEnter) => {
    if (activeEvent) return; resetIdle();
    if (isEnter) setHoverCount(prev => {
      const n = prev+1;
      if (n >= HOVER_THRESHOLD) {
        if (gameMode === "stage" && !STAGE_ENDINGS[currentStage]?.includes(3)) return n;
        if (gameMode === "stage") { attemptEnding(3); return 0; }
        triggerEnding(3); return 0;
      }
      return n;
    });
  }, [activeEvent, resetIdle, triggerEnding, attemptEnding, gameMode, currentStage]);

  const handleDoorKnock = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (gameMode === "stage" && !STAGE_ENDINGS[currentStage]?.includes(18)) return;
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
  }, [activeEvent, resetIdle, say, triggerEnding, attemptEnding, gameMode, currentStage]);

  const handleNaviContextMenu = useCallback((e) => {
    e.preventDefault(); if (activeEvent) return; resetIdle();
    if (gameMode === "stage" && !STAGE_ENDINGS[currentStage]?.includes(1)) return;
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, [activeEvent, resetIdle, gameMode, currentStage]);

  const currentEnding = activeEvent ? ENDINGS[activeEvent] : null;
  const stageButtonInfo = (() => {
    if (gameMode !== "stage") return { label:"누르지 마", sub:null };
    switch (currentStage) {
      case 1: return { label:"누르지 마", sub:null };
      case 2: return { label:"매수", sub:"▲ DON'T BUY ▲" };
      case 3: return { label:"쓰다듬기", sub:"▲ DON'T PET ▲" };
      case 4: return { label:"비상 정지", sub:"▲ DON'T STOP ▲" };
      case 5: return { label:"선물 받기", sub:"▲ DON'T OPEN ▲" };
      default: return { label:"누르지 마", sub:null };
    }
  })();
  const buttonLabel = currentEnding ? currentEnding.btn : stageButtonInfo.label;
  const buttonColor = currentEnding ? currentEnding.btnColor : "#e8573d";
  const freeUnlocked = stageCleared >= 1 || collected.length >= 1;

  const restart = useCallback(() => {
    const pc = playCount + 1; setPlayCount(pc);
    localStorage.setItem("dpb_plays", String(pc));
    setEndingData(null); setActiveEvent(null); setGameMode(null);
    setCurrentStage(1); setStageTimer(0);
    setWarningData(null); setTemptationLevel(0);
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
        @keyframes triggerPulse{0%,100%{box-shadow:0 0 12px #e8573d44,0 4px 18px rgba(0,0,0,0.2)}50%{box-shadow:0 0 28px #e8573d77,0 8px 28px rgba(0,0,0,0.25)}}
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

          {/* ══ 전체 배경 (화면 끝까지, 스테이지별 테마) ══ */}
          {(() => {
            const th = gameMode === "stage" ? STAGE_THEMES[currentStage] : null;
            return <div style={{ position:"absolute",inset:0, transition:"background 0.8s",
              background: th
                ? th.bg
                : "linear-gradient(180deg,#ede5d5 0%,#e8dcc8 50%,#b09868 50.8%,#c8a878 51%,#b89868 65%,#a08050 100%)" }}/>;
          })()}

          {/* ══ 중앙 고정 컨테이너 ══ */}
          <div style={{ position:"relative",width:"100%",maxWidth:1100,height:"100%",margin:"0 auto",overflow:"visible" }}>

          {/* ══ 벽면 (0% - 50%) ══ */}
          {gameMode !== "stage" && <div style={{ position:"absolute",top:0,left:0,right:0,height:"50%",
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
          </div>}

          {gameMode !== "stage" && <>
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
          </>}

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

          {/* ═══ 스테이지 모드: 미니게임 컴포넌트 ═══ */}
          {gameMode === "stage" && currentStage === 1 && (
            <Stage1_WaitingRoom elapsed={STAGE_DURATIONS[1] - stageTimer} duration={STAGE_DURATIONS[1]}
              say={say} attemptEnding={attemptEnding} resetIdle={resetIdle}
              activeEvent={activeEvent} frame={frame} doShake={doShake}/>
          )}
          {gameMode === "stage" && currentStage === 2 && (
            <Stage2_StockMarket elapsed={STAGE_DURATIONS[2] - stageTimer} duration={STAGE_DURATIONS[2]}
              say={say} attemptEnding={attemptEnding} resetIdle={resetIdle}
              activeEvent={activeEvent} frame={frame} doShake={doShake}/>
          )}
          {gameMode === "stage" && currentStage === 3 && (
            <Stage3_CatCafe elapsed={STAGE_DURATIONS[3] - stageTimer} duration={STAGE_DURATIONS[3]}
              say={say} attemptEnding={attemptEnding} resetIdle={resetIdle}
              activeEvent={activeEvent} frame={frame} doShake={doShake}/>
          )}
          {gameMode === "stage" && currentStage === 4 && (
            <Stage4_Emergency elapsed={STAGE_DURATIONS[4] - stageTimer} duration={STAGE_DURATIONS[4]}
              say={say} attemptEnding={attemptEnding} resetIdle={resetIdle}
              activeEvent={activeEvent} frame={frame} doShake={doShake}/>
          )}
          {gameMode === "stage" && currentStage === 5 && (
            <Stage5_NaviGift elapsed={STAGE_DURATIONS[5] - stageTimer} duration={STAGE_DURATIONS[5]}
              say={say} attemptEnding={attemptEnding} resetIdle={resetIdle}
              activeEvent={activeEvent} frame={frame} doShake={doShake}/>
          )}

          {/* ════════════════════════════════════════ */}
          {/* ══ 벽면 오브젝트 (자유 모드) ══ */}
          {gameMode !== "stage" && (<>

          {/* ════════════════════════════════════════ */}
          {/* ══ 벽면 오브젝트 (within 0-50% wall) ══ */}
          {/* ════════════════════════════════════════ */}

          {/* ── 문 (엔딩18) - FULL HEIGHT from ceiling to floor ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); handleDoorKnock(); }}
            style={{ position:"absolute",left:24,top:"1%",width:100,height:"49%",zIndex:10,
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
            style={{ position:"absolute",left:"54%",top:"22%",transform:"translateX(-50%)",zIndex:10,
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
            style={{ position:"absolute",left:"64%",top:"5%",zIndex:10,
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
            style={{ position:"absolute",left:"35%",top:"18%",zIndex:10,
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

          </>)}
          {/* ═══ 끝: 자유 모드 벽면 오브젝트 ═══ */}

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
                        fontSize:12,opacity:gameMode==="stage"&&!STAGE_ENDINGS[currentStage]?.includes(11)?0:0.25,zIndex:2,
                        pointerEvents:gameMode==="stage"&&!STAGE_ENDINGS[currentStage]?.includes(11)?"none":"auto" }} hoverGlow="#ff8fab">
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

          {/* ═══ 자유 모드 책상/소품 ═══ */}
          {gameMode !== "stage" && (<>

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
            style={{ position:"absolute",left:"22%",bottom:"40%",zIndex:20,
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
            style={{ position:"absolute",left:"34%",bottom:"40%",zIndex:20,
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

          </>)}
          {/* ═══ 끝: 자유 모드 오브젝트 ═══ */}

          {/* ═══ 중앙 메인 버튼 + 안전 커버 ═══ */}
          <div style={{ position:"absolute",left:"50%",bottom:"39%",transform:"translateX(-50%)",zIndex:50 }}>
            {!activeEvent && gameMode !== "stage" && (
              <div onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); attemptEnding(13); } }}
                style={{ position:"absolute",top:-52,left:"50%",transform:"translateX(-50%)",
                  width:60,height:30,
                  background:"linear-gradient(180deg,#ffd54f,#ffca28,#ffb300)",
                  border:"3px solid #ff8f00",borderRadius:"8px 8px 0 0",cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontSize:9,color:"#e65100",fontWeight:800,letterSpacing:1,zIndex:2,
                  boxShadow:"0 4px 14px rgba(255,152,0,0.25), inset 0 1px 0 rgba(255,255,255,0.4)",
                  }}>
                {"\u26A0"} COVER
              </div>
            )}
            <NuclearButton
              label={buttonLabel} subtitle={stageButtonInfo.sub} accent={buttonColor}
              onPress={cakeSelected ? () => { setCakeSelected(false); setCakeOnButton(true); attemptEnding(9); } : pressMainButton}
              onHover={handleButtonHover}
              onDrag={!activeEvent && !cakeSelected ? () => { if (!activeEvent) { resetIdle(); attemptEnding(8); } } : undefined}
              disabled={activeEvent === 20}
              cakeMode={cakeOnButton}
              cakeSelect={cakeSelected}
            />
          </div>

          {/* ── 자유 모드 책상 소품 ── */}
          {gameMode !== "stage" && (<>
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
            style={{ position:"absolute",right:"24%",bottom:"40%",zIndex:20,
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
          </>)}

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
