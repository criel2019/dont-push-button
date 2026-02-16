const { useState, useEffect, useRef, useCallback } = React;

// ============================================================
// DON'T PRESS THE BUTTON — FULL EDITION (21 Endings)
// 오퍼레이터 "나비" (자칭 천재 내비게이터)
// HIGH-QUALITY VISUAL EDITION
// ============================================================

const SAVE_KEY = "dpb_collected_v2";
const IDLE_LIMIT = 180;
const BANNER_DELAY = 18000;
const HOVER_THRESHOLD = 8;
const RAPID_CLICK_THRESHOLD = 15;
const RAPID_CLICK_WINDOW = 3000;
const DOOR_KNOCK_THRESHOLD = 5;

// ── 무료 이미지 URL (Unsplash CDN — free to use) ──
const IMG = {
  nightSky: "https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=80",
  woodDesk: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=800&q=75",
  wall: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=200&q=30",
};

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

function pickRandom(arr, lastRef) {
  if (!arr || arr.length === 0) return null;
  if (arr.length <= 1) return arr[0];
  let pick;
  do { pick = arr[Math.floor(Math.random() * arr.length)]; } while (pick === lastRef?.current && arr.length > 1);
  if (lastRef) lastRef.current = pick;
  return pick;
}

// ============================================================
// SVG 나비 캐릭터 (풀바디 치비 애니메 스타일)
// ============================================================
function NaviCharacter({ emotion = "idle", frame = 0, sleeping = false, catEars = false, gone = false }) {
  const bob = Math.sin(frame * 0.25) * 3;
  const breathe = Math.sin(frame * 0.15) * 1.5;
  const blink = frame % 18 === 0;
  const emo = sleeping ? "sleep" : emotion;

  // 눈 모양
  const eyes = {
    idle:    { ly:"M36,62 Q40,56 44,62", ry:"M56,62 Q60,56 64,62", fill:"#5a3050", hl:true },
    excited: { ly:"M34,60 L40,54 L46,60", ry:"M54,60 L60,54 L66,60", fill:"#ff7eb3", hl:true },
    pouty:   { ly:"M36,60 Q40,64 44,60", ry:"M56,60 Q60,64 64,60", fill:"#5a3050", hl:false },
    shocked: { ly:null, ry:null, fill:"#5a3050", hl:true, circle:true, r:7 },
    smug:    { ly:"M36,62 Q40,58 44,62", ry:"M56,60 L64,58", fill:"#5a3050", hl:true },
    cry:     { ly:null, ry:null, fill:"#5a3050", hl:true, circle:true, r:6, tears:true },
    sleep:   { ly:"M35,62 L45,62", ry:"M55,62 L65,62", fill:"#5a3050", hl:false },
  };
  const mouth = {
    idle:    "M42,74 Q50,78 58,74",
    excited: "M42,72 Q50,80 58,72",
    pouty:   "M44,76 Q50,73 56,76",
    shocked: "M44,72 Q50,78 56,72",
    smug:    "M43,74 Q48,77 56,73",
    cry:     "M43,76 Q50,72 57,76",
    sleep:   "M44,74 L56,74",
  };

  const e = eyes[emo] || eyes.idle;
  const m = mouth[emo] || mouth.idle;

  return (
    <svg viewBox="0 0 100 160" width="110" height="175"
      style={{ filter:"drop-shadow(0 8px 24px rgba(100,50,80,0.2))",
        opacity:gone?0:1, transition:"opacity 2s, transform 1s",
        transform:`translateY(${gone?30:bob}px)` }}>

      {/* ── 머리카락 뒷면 ── */}
      <ellipse cx="50" cy="55" rx="38" ry="42" fill="url(#hairGrad)"/>
      <path d="M16,65 Q12,90 20,120 L30,100 Q20,80 22,65 Z" fill="url(#hairGrad)" opacity="0.9"/>
      <path d="M84,65 Q88,90 80,120 L70,100 Q80,80 78,65 Z" fill="url(#hairGrad)" opacity="0.9"/>

      {/* ── 얼굴 ── */}
      <ellipse cx="50" cy={58+breathe*0.3} rx="30" ry="32" fill="#ffecd2"/>
      <ellipse cx="50" cy={58+breathe*0.3} rx="30" ry="32" fill="url(#faceShade)" opacity="0.15"/>

      {/* ── 볼 터치 ── */}
      <ellipse cx="32" cy="70" rx="6" ry="3.5" fill="#ffb4b4" opacity={emo==="excited"||emo==="cry"?0.6:0.3}/>
      <ellipse cx="68" cy="70" rx="6" ry="3.5" fill="#ffb4b4" opacity={emo==="excited"||emo==="cry"?0.6:0.3}/>

      {/* ── 눈 ── */}
      {blink && emo !== "sleep" ? (
        <>
          <line x1="35" y1="62" x2="45" y2="62" stroke="#5a3050" strokeWidth="2" strokeLinecap="round"/>
          <line x1="55" y1="62" x2="65" y2="62" stroke="#5a3050" strokeWidth="2" strokeLinecap="round"/>
        </>
      ) : e.circle ? (
        <>
          <circle cx="40" cy="61" r={e.r} fill="white" stroke="#5a3050" strokeWidth="1.5"/>
          <circle cx="40" cy="61" r={e.r*0.45} fill={e.fill}/>
          <circle cx="42" cy="59" r="2" fill="white" opacity="0.9"/>
          <circle cx="60" cy="61" r={e.r} fill="white" stroke="#5a3050" strokeWidth="1.5"/>
          <circle cx="60" cy="61" r={e.r*0.45} fill={e.fill}/>
          <circle cx="62" cy="59" r="2" fill="white" opacity="0.9"/>
          {e.tears && <>
            <path d="M36,68 Q34,78 36,85" fill="none" stroke="#88ccff" strokeWidth="2" opacity="0.6">
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="1s" repeatCount="indefinite"/>
            </path>
            <path d="M64,68 Q66,78 64,85" fill="none" stroke="#88ccff" strokeWidth="2" opacity="0.6">
              <animate attributeName="opacity" values="0.2;0.6;0.2" dur="1s" repeatCount="indefinite"/>
            </path>
          </>}
        </>
      ) : (
        <>
          {/* 왼쪽 눈 */}
          <ellipse cx="40" cy="61" rx="7" ry="8" fill="white"/>
          <path d={e.ly} fill="none" stroke={e.fill} strokeWidth="2.5" strokeLinecap="round"/>
          {e.hl && <circle cx="42" cy="59" r="2" fill="white" opacity="0.8"/>}
          {/* 오른쪽 눈 */}
          <ellipse cx="60" cy="61" rx="7" ry="8" fill="white"/>
          <path d={e.ry} fill="none" stroke={e.fill} strokeWidth="2.5" strokeLinecap="round"/>
          {e.hl && <circle cx="62" cy="59" r="2" fill="white" opacity="0.8"/>}
        </>
      )}

      {/* ── 입 ── */}
      <path d={m} fill="none" stroke={emo==="cry"?"#cc8888":"#e8889a"} strokeWidth="1.8" strokeLinecap="round"/>

      {/* ── 앞머리 ── */}
      <path d="M18,48 Q24,22 50,20 Q76,22 82,48 L78,52 Q72,30 50,28 Q28,30 22,52 Z" fill="url(#hairGrad)"/>
      <path d="M30,48 Q34,34 42,30 L38,50 Z" fill="url(#hairGrad)" opacity="0.7"/>
      <path d="M58,30 Q66,34 70,48 L62,50 Z" fill="url(#hairGrad)" opacity="0.7"/>

      {/* ── 머리 하이라이트 ── */}
      <path d="M32,36 Q38,30 44,34" fill="none" stroke="#ffcce0" strokeWidth="1.5" opacity="0.5" strokeLinecap="round"/>

      {/* ── 리본 ── */}
      <g transform="translate(50,22)">
        <path d="M0,0 L-10,-6 L-4,0 L-10,6 Z" fill="#e8573d"/>
        <path d="M0,0 L10,-6 L4,0 L10,6 Z" fill="#e8573d"/>
        <circle cx="0" cy="0" r="3" fill="#ff8a80"/>
        <path d="M-10,-6 L-4,0 L-10,6" fill="none" stroke="#c0392b" strokeWidth="0.5" opacity="0.3"/>
      </g>

      {/* ── 고양이 귀 ── */}
      {catEars && <>
        <path d="M22,30 L18,8 L36,26 Z" fill="#ffa4c4" stroke="#ff8fab" strokeWidth="1"/>
        <path d="M25,25 L22,14 L32,24 Z" fill="#ffcce0"/>
        <path d="M78,30 L82,8 L64,26 Z" fill="#ffa4c4" stroke="#ff8fab" strokeWidth="1"/>
        <path d="M75,25 L78,14 L68,24 Z" fill="#ffcce0"/>
      </>}

      {/* ── 몸통 ── */}
      <g transform={`translate(0,${breathe*0.5})`}>
        <path d="M32,88 Q30,92 30,100 L30,130 Q30,138 38,138 L62,138 Q70,138 70,130 L70,100 Q70,92 68,88 Q60,84 50,84 Q40,84 32,88 Z"
          fill="url(#bodyGrad)"/>
        <path d="M36,88 L50,96 L64,88" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.4"/>
        <rect x="46" y="96" width="8" height="10" rx="2" fill="#ffd54f" opacity="0.7"/>
        {/* 소매 */}
        <path d="M30,94 Q22,100 20,112 Q22,114 26,112 Q28,104 32,98 Z" fill="url(#bodyGrad)"/>
        <path d="M70,94 Q78,100 80,112 Q78,114 74,112 Q72,104 68,98 Z" fill="url(#bodyGrad)"/>
        {/* 손 */}
        <circle cx="21" cy="113" r="5" fill="#ffecd2"/>
        <circle cx="79" cy="113" r="5" fill="#ffecd2"/>
      </g>

      {/* ── 감정 이펙트 ── */}
      {emo==="excited" && <>
        <text x="82" y="44" fontSize="10" opacity="0.8">✨</text>
        <text x="10" y="50" fontSize="8" opacity="0.6">✦</text>
      </>}
      {emo==="shocked" && <text x="72" y="38" fontSize="12" opacity="0.8">❗</text>}
      {emo==="pouty" && <text x="76" y="78" fontSize="9" opacity="0.7">💢</text>}
      {emo==="smug" && <text x="8" y="44" fontSize="9" opacity="0.6">♪</text>}
      {sleeping && <text x="70" y="40" fontSize="14" opacity="0.7" style={{animation:"zzz 2s ease infinite"}}>💤</text>}

      {/* ── Gradients ── */}
      <defs>
        <linearGradient id="hairGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffb4d9"/>
          <stop offset="50%" stopColor="#ff8fab"/>
          <stop offset="100%" stopColor="#d4a4ff"/>
        </linearGradient>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#7c4dff"/>
          <stop offset="100%" stopColor="#536dfe"/>
        </linearGradient>
        <radialGradient id="faceShade" cx="0.5" cy="1" r="0.8">
          <stop offset="0%" stopColor="#d4a088"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
    </svg>
  );
}

// ============================================================
// Canvas 파티클 시스템 (먼지 + 빛 입자)
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

    // 파티클 생성
    particles.current = Array.from({ length: 35 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 2.5 + 0.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: -Math.random() * 0.4 - 0.1,
      alpha: Math.random() * 0.4 + 0.1,
      glow: Math.random() > 0.7,
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
          ctx.fillStyle = `rgba(255,210,160,${p.alpha * 0.8})`;
          ctx.shadowColor = "rgba(255,180,120,0.4)";
          ctx.shadowBlur = 8;
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
      style={{ cursor:"pointer", transition:"all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        transform: hv ? "scale(1.1) translateY(-2px)" : "scale(1)",
        filter: hv && hoverGlow ? `drop-shadow(0 0 10px ${hoverGlow})` : "none",
        ...style }}>
      {children}
    </div>
  );
}

// ── 3D 핵 버튼 ──
function NuclearButton({ label, onPress, onHover, onDrag, disabled, accent, cakeMode, cakeSelect }) {
  const [hv, setHv] = useState(false);
  const [pr, setPr] = useState(false);
  const b = accent || "#e8573d";
  return (
    <div style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:6,
      opacity:disabled?0.15:1,pointerEvents:disabled?"none":"auto",transition:"opacity 0.5s" }}>
      {/* 외부 링 */}
      <div style={{ width:120,height:120,borderRadius:"50%",position:"relative",
        background:`conic-gradient(from 0deg,${b}22,${b}08,${b}22,${b}08,${b}22)`,
        boxShadow:`0 8px 32px ${b}20, inset 0 2px 4px rgba(255,255,255,0.2), inset 0 -2px 4px rgba(0,0,0,0.1)`,
        display:"flex",alignItems:"center",justifyContent:"center" }}>
        {/* 점선 링 */}
        <div style={{ position:"absolute",inset:5,borderRadius:"50%",
          border:`2px dashed ${b}20`,animation:"spin 25s linear infinite" }}/>
        {/* 내부 베이스 */}
        <div style={{ width:96,height:96,borderRadius:"50%",
          background:"linear-gradient(160deg,#f8f8f8,#e8e4e0)",
          boxShadow:`inset 0 3px 8px rgba(0,0,0,0.06), 0 4px 16px ${b}15`,
          display:"flex",alignItems:"center",justifyContent:"center" }}>

          {cakeMode ? (
            <div onClick={onPress} style={{ width:72,height:72,borderRadius:"50%",cursor:"pointer",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:36,
              animation:"float 1.5s ease infinite",filter:"drop-shadow(0 4px 8px rgba(0,0,0,0.15))" }}>
              🎂
            </div>
          ) : (
            <button
              onMouseEnter={() => { setHv(true); onHover?.(true); }}
              onMouseLeave={() => { setHv(false); setPr(false); onHover?.(false); }}
              onMouseDown={(e) => { setPr(true); onDrag?.(e); }}
              onMouseUp={() => setPr(false)}
              onClick={(e) => { e.stopPropagation(); onPress?.(); }}
              style={{ width:72,height:72,borderRadius:"50%",border:"none",cursor:"pointer",outline:"none",
                background: pr
                  ? `radial-gradient(circle at 50% 60%,${b},${b}cc)`
                  : `radial-gradient(circle at 36% 28%,${b}ff,${b} 50%,${b}aa 100%)`,
                boxShadow: pr
                  ? `0 1px 4px ${b}44, inset 0 3px 8px rgba(0,0,0,0.2)`
                  : `0 6px 20px ${b}30, 0 2px 6px rgba(0,0,0,0.08), inset 0 -3px 6px ${b}22`,
                transform: pr ? "translateY(3px) scale(0.92)" : hv ? "scale(1.06)" : "scale(1)",
                transition:"all 0.1s ease", position:"relative" }}>
              {/* 하이라이트 */}
              <div style={{ position:"absolute",top:"14%",left:"20%",width:"30%",height:"18%",
                borderRadius:"50%",background:"rgba(255,255,255,0.45)",filter:"blur(3px)" }}/>
              <div style={{ position:"absolute",top:"22%",left:"28%",width:"12%",height:"8%",
                borderRadius:"50%",background:"rgba(255,255,255,0.6)",filter:"blur(1px)" }}/>
            </button>
          )}
        </div>
      </div>

      {/* 라벨 */}
      <div style={{ fontFamily:"'Noto Sans KR',monospace",fontSize:11,fontWeight:800,letterSpacing:3,
        color:b,textShadow:`0 1px 4px ${b}22`,transition:"color 0.3s" }}>
        {cakeSelect ? "🎂 여기에 올려!" : label}
      </div>
      {!cakeSelect && !cakeMode && (
        <div style={{ fontSize:7,color:"#c0b8b088",letterSpacing:1 }}>▲ DON'T PRESS ▲</div>
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
      <div style={{ fontSize:90,marginBottom:24,fontWeight:200 }}>:(</div>
      <div style={{ fontSize:15,marginBottom:8,maxWidth:400,textAlign:"center",lineHeight:1.6 }}>
        PC에 문제가 발생하여 다시 시작해야 합니다.
      </div>
      <div style={{ fontSize:11,color:"#ffffffaa",marginBottom:20 }}>오류 코드: DONT_PRESS_0x80070002</div>
      <div style={{ width:200,height:3,background:"#ffffff22",borderRadius:2 }}>
        <div style={{ width:"30%",height:"100%",background:"#fff",borderRadius:2,animation:"bsodProgress 2.5s ease forwards" }}/>
      </div>
      <div style={{ fontSize:10,color:"#ffffff55",marginTop:8 }}>0% 완료</div>
    </div>
  );
}

function NewsOverlay({ active }) {
  if (!active) return null;
  return (
    <div style={{ position:"absolute",inset:0,zIndex:400,background:"linear-gradient(180deg,#1a1a2e,#16213e)",
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",animation:"fadeIn 0.3s ease" }}>
      <div style={{ background:"#c62828",padding:"8px 32px",borderRadius:4,marginBottom:16,
        boxShadow:"0 4px 20px rgba(198,40,40,0.4)" }}>
        <span style={{ color:"#fff",fontSize:16,fontWeight:800,letterSpacing:6 }}>속 보</span>
      </div>
      <div style={{ color:"#fff",fontSize:24,fontWeight:800,marginBottom:6,letterSpacing:2 }}>☢️ 핵전쟁 발발</div>
      <div style={{ color:"#ff8a80",fontSize:13,marginBottom:24 }}>전 세계 비상사태 선포</div>
      <div style={{ width:"80%",height:2,background:"#ffffff11",marginBottom:8 }}/>
      <div style={{ color:"#ff5252",fontSize:11,animation:"pulse 1s ease infinite" }}>🔴 LIVE</div>
      <div style={{ position:"absolute",bottom:24,width:"100%",overflow:"hidden" }}>
        <div style={{ color:"#ffeb3b",fontSize:11,whiteSpace:"nowrap",animation:"ticker 10s linear infinite" }}>
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
      <div style={{ color:"#8b949e",fontSize:10,letterSpacing:3,marginBottom:4 }}>KOSPI · MEME COIN</div>
      <div style={{ color:"#3fb950",fontSize:52,fontWeight:800,textShadow:"0 0 40px #3fb95033" }}>+847.3%</div>
      <div style={{ color:"#3fb95088",fontSize:13,marginBottom:16 }}>▲ TO THE MOON 🚀</div>
      <svg viewBox="0 0 240 80" style={{ width:220,height:72 }}>
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
      <div style={{ color:"#f8514966",fontSize:9,marginTop:12 }}>※ 투자는 본인 책임입니다</div>
    </div>
  );
}

function TimerDisplay({ seconds }) {
  return (
    <div style={{ position:"absolute",top:"45%",left:"50%",transform:"translate(-50%,-50%)",zIndex:350,textAlign:"center" }}>
      <div style={{ fontSize:72,fontWeight:800,color:seconds<=10?"#e8573d":"#e88b3d",
        textShadow:`0 4px 30px ${seconds<=10?"#e8573d33":"#e88b3d22"}`,
        animation:seconds<=10?"pulse 0.5s ease infinite":"none",letterSpacing:4 }}>
        {String(Math.floor(seconds/60)).padStart(2,"0")}:{String(seconds%60).padStart(2,"0")}
      </div>
      <div style={{ fontSize:9,color:"#b0a09088",letterSpacing:3,marginTop:4 }}>MARSHMALLOW CHALLENGE</div>
    </div>
  );
}

function CountdownDisplay({ count }) {
  return (
    <div key={count} style={{ position:"absolute",top:"38%",left:"50%",transform:"translate(-50%,-50%)",zIndex:350,
      fontSize:100,fontWeight:800,color:"#e8573d",animation:"popIn 0.4s cubic-bezier(0.34,1.56,0.64,1)",
      textShadow:"0 8px 40px #e8573d44" }}>
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
          width:56,height:56,borderRadius:"50%",
          background:"radial-gradient(circle at 36% 28%,#e8573dff,#e8573d 50%,#c0392baa)",
          boxShadow:"0 6px 20px #e8573d44",cursor:"pointer",transition:"left 0.15s, top 0.15s",
          display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:10,color:"#fff",fontWeight:800,letterSpacing:1,
          animation:"shake 0.12s ease infinite" }}>
        {caught ? "!" : "잡아봐"}
      </div>
    </div>
  );
}

function PrizeBanner({ visible, onClick }) {
  if (!visible) return null;
  return (
    <div onClick={onClick} style={{ position:"absolute",top:"22%",left:"50%",transform:"translateX(-50%)",
      zIndex:450,background:"linear-gradient(135deg,#ffd700,#ff8f00)",border:"3px solid #ff6f00",
      borderRadius:20,padding:"20px 36px",textAlign:"center",cursor:"pointer",
      animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)",
      boxShadow:"0 12px 48px rgba(255,152,0,0.4), inset 0 1px 0 rgba(255,255,255,0.3)" }}>
      <div style={{ fontSize:9,color:"#fff",letterSpacing:4,marginBottom:6,opacity:0.8 }}>★ CONGRATULATIONS ★</div>
      <div style={{ fontSize:26,fontWeight:800,color:"#fff",textShadow:"0 2px 8px rgba(0,0,0,0.2)" }}>
        💰 100만원 당첨!! 💰
      </div>
      <div style={{ fontSize:11,color:"#ffffffcc",marginTop:6 }}>▼ 지금 바로 수령하세요 ▼</div>
      <div style={{ marginTop:8,fontSize:7,color:"#ffffff33" }}>광고 아님 (진짜임) (진짜로)</div>
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
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.35)",backdropFilter:"blur(4px)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"#fff",borderRadius:20,padding:"28px 36px",
        minWidth:280,boxShadow:"0 20px 60px rgba(0,0,0,0.2)",animation:"popIn 0.3s ease" }}>
        <div style={{ fontSize:15,fontWeight:800,color:"#333",marginBottom:20,letterSpacing:2 }}>⚙️ 설정</div>
        <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16,
          padding:"10px 14px",background:"#fafafa",borderRadius:12,border:"1px solid #f0f0f0" }}>
          <span style={{ fontSize:13,color:"#333" }}>Kill Mode</span>
          <div onClick={onKillMode} style={{ width:48,height:26,borderRadius:13,
            background:killModeOn?"#e8573d":"#ddd",cursor:"pointer",position:"relative",transition:"background 0.3s",
            boxShadow:killModeOn?"0 2px 8px #e8573d44":"none" }}>
            <div style={{ position:"absolute",top:3,left:killModeOn?25:3,width:20,height:20,borderRadius:10,
              background:"#fff",boxShadow:"0 1px 4px rgba(0,0,0,0.2)",transition:"left 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}/>
          </div>
        </div>
        <div onClick={onReset} style={{ padding:"10px 14px",background:"#fafafa",borderRadius:12,cursor:"pointer",
          fontSize:13,color:"#78909c",textAlign:"center",marginBottom:12,border:"1px solid #f0f0f0",
          transition:"background 0.2s" }}
          onMouseEnter={e=>e.target.style.background="#f0f0f0"}
          onMouseLeave={e=>e.target.style.background="#fafafa"}>
          🔄 초기화
        </div>
        <div onClick={onClose} style={{ padding:"8px",textAlign:"center",fontSize:12,color:"#bbb",cursor:"pointer" }}>닫기</div>
      </div>
    </div>
  );
}

function ProfileMenu({ open, onClose, onTransfer }) {
  if (!open) return null;
  return (
    <div style={{ position:"absolute",top:52,right:12,zIndex:600,background:"#fff",borderRadius:16,
      padding:"16px 20px",boxShadow:"0 12px 48px rgba(0,0,0,0.15)",animation:"fadeInUp 0.2s ease",minWidth:180 }}>
      <div style={{ fontSize:11,color:"#bbb",marginBottom:6 }}>플레이어 프로필</div>
      <div style={{ fontSize:13,fontWeight:600,color:"#333",marginBottom:14 }}>👤 Guest</div>
      <div onClick={onTransfer} style={{ fontSize:12,color:"#6a1b9a",cursor:"pointer",
        padding:"8px 12px",background:"#f3e5f5",borderRadius:10,textAlign:"center",fontWeight:600,
        transition:"background 0.2s" }}
        onMouseEnter={e=>e.target.style.background="#e1bee7"}
        onMouseLeave={e=>e.target.style.background="#f3e5f5"}>
        🔀 권한 양도
      </div>
      <div onClick={onClose} style={{ fontSize:11,color:"#ccc",cursor:"pointer",textAlign:"center",marginTop:10 }}>닫기</div>
    </div>
  );
}

function CollectionPanel({ open, onClose, collected }) {
  if (!open) return null;
  const phaseColors = { "간보기":"#e88b3d","장난":"#e8573d","욕망":"#e84393","위기":"#c62828","히든":"#5c6bc0","진 엔딩":"#212121","특전":"#ffd700" };
  return (
    <div style={{ position:"absolute",inset:0,zIndex:700,display:"flex",alignItems:"center",justifyContent:"center" }}>
      <div onClick={onClose} style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.45)",backdropFilter:"blur(6px)" }}/>
      <div style={{ position:"relative",zIndex:1,background:"linear-gradient(180deg,#fefcfa,#f8f4ef)",borderRadius:24,padding:"28px",
        width:"92%",maxWidth:440,maxHeight:"82vh",overflow:"auto",boxShadow:"0 24px 80px rgba(0,0,0,0.25)",animation:"popIn 0.3s ease" }}>
        <div style={{ textAlign:"center",marginBottom:20 }}>
          <div style={{ fontSize:18,fontWeight:800,color:"#333",letterSpacing:3 }}>엔딩 컬렉션</div>
          <div style={{ fontSize:12,color:"#aaa",marginTop:6 }}>{collected.length} / 21</div>
          <div style={{ width:"100%",height:6,background:"#eee",borderRadius:3,marginTop:10,overflow:"hidden" }}>
            <div style={{ width:`${(collected.length/21)*100}%`,height:"100%",
              background:"linear-gradient(90deg,#ffa4c4,#a33de8,#536dfe)",borderRadius:3,transition:"width 0.5s" }}/>
          </div>
        </div>
        <div style={{ display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10 }}>
          {Array.from({length:21},(_,i)=>i+1).map(id => {
            const ed = ENDINGS[id];
            const unlocked = collected.includes(id);
            return (
              <div key={id} style={{ padding:"12px 8px",
                background:unlocked?"#fff":"#f4f0ea",borderRadius:14,textAlign:"center",
                border:`2px solid ${unlocked?phaseColors[ed.phase]+"55":"#e8e2da"}`,
                opacity:unlocked?1:0.45,transition:"all 0.3s",
                boxShadow:unlocked?`0 4px 16px ${phaseColors[ed.phase]}15`:"none",
                transform:unlocked?"scale(1)":"scale(0.95)" }}>
                <div style={{ fontSize:24,marginBottom:4 }}>{unlocked ? ed.emoji : "🔒"}</div>
                <div style={{ fontSize:10,fontWeight:700,color:unlocked?"#333":"#ccc" }}>
                  {unlocked ? ed.name : "???"}
                </div>
                <div style={{ fontSize:7,color:phaseColors[ed.phase]||"#aaa",fontWeight:600,marginTop:3,
                  letterSpacing:1 }}>{ed.phase}</div>
              </div>
            );
          })}
        </div>
        <div onClick={onClose} style={{ textAlign:"center",marginTop:20,fontSize:12,color:"#bbb",cursor:"pointer" }}>닫기</div>
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
              fontSize:l.s===2?24:l.s===1?15:13,fontWeight:l.s>=1?700:400,
              marginBottom:l.t===""?20:10,letterSpacing:l.s===2?6:2 }}>
              {l.t || "\u00A0"}
            </div>
          ))}
        </div>
      </div>
      <div onClick={onBack} style={{ position:"absolute",bottom:20,left:"50%",transform:"translateX(-50%)",
        fontSize:12,color:"#444",cursor:"pointer",zIndex:2,padding:"8px 16px",borderRadius:8,
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
    <div style={{ position:"fixed",left:x,top:y,zIndex:900,background:"#fff",borderRadius:12,
      boxShadow:"0 8px 32px rgba(0,0,0,0.18)",padding:6,minWidth:150,animation:"popIn 0.15s ease" }}>
      <div style={{ padding:"8px 14px",fontSize:11,color:"#bbb",cursor:"default" }}>나비</div>
      <div style={{ height:1,background:"#f0f0f0",margin:"2px 8px" }}/>
      <div onClick={onDelete} style={{ padding:"10px 14px",fontSize:13,color:"#e8573d",cursor:"pointer",
        borderRadius:8,transition:"background 0.15s" }}
        onMouseEnter={e=>e.target.style.background="#fef0f0"}
        onMouseLeave={e=>e.target.style.background="transparent"}>
        🗑️ 삭제
      </div>
      <div onClick={onClose} style={{ padding:"10px 14px",fontSize:13,color:"#999",cursor:"pointer",
        borderRadius:8,transition:"background 0.15s" }}
        onMouseEnter={e=>e.target.style.background="#f8f8f8"}
        onMouseLeave={e=>e.target.style.background="transparent"}>
        취소
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

  const lastLine = useRef(null);
  const idleRef = useRef(0);
  const bannerTimerRef = useRef(null);
  const marshmallowRef = useRef(null);
  const naviIntervalRef = useRef(null);

  const say = useCallback((text, emotion) => { setNEmo(emotion || "idle"); setNText(text); setNKey(p => p + 1); }, []);

  const doShake = useCallback(() => { setScreenShake(true); setTimeout(() => setScreenShake(false), 400); }, []);

  useEffect(() => { const iv = setInterval(() => setFrame(p => p + 1), 350); return () => clearInterval(iv); }, []);

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
    say("어서와~ 이 방에 비밀이 많거든! 근데 버튼은 누르면 안 돼~", "excited");
    bannerTimerRef.current = setTimeout(() => setBannerVisible(true), BANNER_DELAY);
    return () => {
      if (bannerTimerRef.current) clearTimeout(bannerTimerRef.current);
      if (marshmallowRef.current) clearInterval(marshmallowRef.current);
      if (naviIntervalRef.current) clearInterval(naviIntervalRef.current);
    };
  }, [gs, say]);

  // ── 나비 랜덤 대사 ──
  useEffect(() => {
    if (gs !== "room" || activeEvent) return;
    naviIntervalRef.current = setInterval(() => {
      if (activeEvent || naviSleeping) return;
      const line = pickRandom(NAVI_IDLE, lastLine);
      if (line) say(line.t, line.e);
    }, 6000);
    return () => { if (naviIntervalRef.current) clearInterval(naviIntervalRef.current); };
  }, [gs, activeEvent, naviSleeping, say]);

  // ── 방치 감지 (엔딩16) ──
  useEffect(() => {
    if (gs !== "room" || activeEvent) return;
    const iv = setInterval(() => {
      idleRef.current += 1; setIdleTimer(idleRef.current);
      if (idleRef.current >= IDLE_LIMIT && !activeEvent) triggerEnding(16);
    }, 1000);
    return () => clearInterval(iv);
  }, [gs, activeEvent]);

  const resetIdle = useCallback(() => { idleRef.current = 0; setIdleTimer(0); }, []);

  // ── 창 숨김 (엔딩4) ──
  useEffect(() => {
    if (gs !== "room") return;
    const handler = () => {
      if (document.hidden) { setWasHidden(true); setNaviYawn(true); }
      else if (wasHidden && !activeEvent) { setNaviYawn(false); triggerEnding(4); }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [gs, wasHidden, activeEvent]);

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

  // ── 엔딩20 체크 ──
  useEffect(() => {
    if (gs !== "room" || activeEvent) return;
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
  }, [gs, collected, activeEvent, say]);

  const recordEnding = useCallback((id) => {
    setCollected(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      localStorage.setItem(SAVE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

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
      if (recent.length >= RAPID_CLICK_THRESHOLD) { triggerEnding(7); return []; }
      return recent;
    });
  }, [activeEvent, resetIdle, triggerEnding]);

  const handleButtonHover = useCallback((isEnter) => {
    if (activeEvent) return; resetIdle();
    if (isEnter) setHoverCount(prev => { const n = prev+1; if (n >= HOVER_THRESHOLD) { triggerEnding(3); return 0; } return n; });
  }, [activeEvent, resetIdle, triggerEnding]);

  const handleDoorKnock = useCallback(() => {
    if (activeEvent) return; resetIdle();
    setDoorKnocks(prev => {
      const n = prev+1;
      if (n === 1) say("똑똑...", "idle");
      else if (n === 3) say("누구세요~?", "idle");
      if (n >= DOOR_KNOCK_THRESHOLD) { triggerEnding(18); return 0; }
      return n;
    });
  }, [activeEvent, resetIdle, say, triggerEnding]);

  const handleNaviContextMenu = useCallback((e) => {
    e.preventDefault(); if (activeEvent) return; resetIdle();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, [activeEvent, resetIdle]);

  const currentEnding = activeEvent ? ENDINGS[activeEvent] : null;
  const buttonLabel = currentEnding ? currentEnding.btn : "누르지 마";
  const buttonColor = currentEnding ? currentEnding.btnColor : "#e8573d";

  const restart = useCallback(() => {
    const pc = playCount + 1; setPlayCount(pc);
    localStorage.setItem("dpb_plays", String(pc));
    setEndingData(null); setActiveEvent(null); setGs("title");
  }, [playCount]);

  return (
    <div onClick={gs === "room" && !activeEvent ? handleBgClick : undefined}
      onMouseMove={gs === "room" ? resetIdle : undefined}
      style={{ width:"100vw",height:"100vh",overflow:"hidden",position:"relative",
        fontFamily:"'Noto Sans KR',sans-serif",
        background:darkMode?"#000":"#f5f2ee",transition:"background 1.5s",
        transform:screenShake?"translate(2px,-2px)":"none" }}>

      {/* ── Google Fonts ── */}
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@400;700;800&display=swap" rel="stylesheet"/>

      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes fadeInUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}
        @keyframes popIn{from{opacity:0;transform:scale(0.6)}to{opacity:1;transform:scale(1)}}
        @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
        @keyframes shake{0%{transform:translateX(-2px)}25%{transform:translateX(2px)}50%{transform:translateX(-2px)}75%{transform:translateX(1px)}100%{transform:translateX(0)}}
        @keyframes float{0%,100%{transform:translateY(0)}50%{transform:translateY(-8px)}}
        @keyframes ticker{0%{transform:translateX(100%)}100%{transform:translateX(-100%)}}
        @keyframes scanline{0%{top:-5%}100%{top:105%}}
        @keyframes zzz{0%{opacity:0;transform:translateY(0) scale(0.7)}50%{opacity:1;transform:translateY(-14px) scale(1)}100%{opacity:0;transform:translateY(-28px) scale(0.5)}}
        @keyframes siren{0%{background:#e8573d15}50%{background:#1565c015}100%{background:#e8573d15}}
        @keyframes darkFade{from{opacity:0}to{opacity:1}}
        @keyframes bsodProgress{from{width:0%}to{width:30%}}
        @keyframes glowPulse{0%,100%{box-shadow:0 0 20px rgba(232,87,61,0.2)}50%{box-shadow:0 0 40px rgba(232,87,61,0.4)}}
        @keyframes starTwinkle{0%,100%{opacity:0.3}50%{opacity:1}}
        .cursor-blink{animation:pulse 0.6s step-end infinite;opacity:0.5}
        *{box-sizing:border-box;margin:0;padding:0;user-select:none;}
      `}</style>

      {/* ═══════════ TITLE ═══════════ */}
      {gs === "title" && (
        <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",background:"linear-gradient(170deg,#faf5f0,#f0e8f5)",cursor:"pointer",
          position:"relative",overflow:"hidden" }}
          onClick={() => { resetIdle(); setGs("room"); }}>
          {/* 배경 장식 */}
          <div style={{ position:"absolute",top:"15%",left:"10%",width:180,height:180,borderRadius:"50%",
            background:"radial-gradient(circle,#e8573d08,transparent 70%)" }}/>
          <div style={{ position:"absolute",bottom:"20%",right:"15%",width:120,height:120,borderRadius:"50%",
            background:"radial-gradient(circle,#a33de808,transparent 70%)" }}/>

          {introStep>=1 && <div style={{ fontSize:17,color:"#e8573d",fontWeight:800,letterSpacing:8,
            animation:"fadeInUp 0.6s ease" }}>DON'T PRESS</div>}
          {introStep>=2 && <div style={{ fontSize:42,color:"#e8573d",fontWeight:800,letterSpacing:10,marginTop:2,
            animation:"popIn 0.6s cubic-bezier(0.34,1.56,0.64,1)" }}>THE BUTTON</div>}
          {introStep>=3 && <div style={{ fontSize:12,color:"#e8573d55",marginTop:16,letterSpacing:6,
            animation:"fadeInUp 0.5s ease" }}>...or should you?</div>}
          {introStep>=4 && <>
            <div style={{ fontSize:11,color:"#c0b8b0",marginTop:32,animation:"pulse 2.5s ease infinite" }}>
              ▶ 클릭하여 시작
            </div>
            {collected.length > 0 && (
              <div style={{ fontSize:10,color:"#a33de8",marginTop:14,animation:"fadeIn 0.8s ease" }}>
                ✦ {collected.length}/21 엔딩 수집됨
              </div>
            )}
            {/* 나비 미리보기 */}
            <div style={{ position:"absolute",bottom:"8%",right:"12%",opacity:0.15,animation:"fadeIn 2s ease" }}>
              <NaviCharacter emotion="smug" frame={frame}/>
            </div>
          </>}
        </div>
      )}

      {/* ═══════════ ROOM ═══════════ */}
      {gs === "room" && (
        <div style={{ width:"100%",height:"100%",position:"relative",overflow:"hidden" }}>

          {/* ── 벽 (따뜻한 크림색 + 패턴) ── */}
          <div style={{ position:"absolute",top:0,left:0,right:0,height:"56%",
            background:"linear-gradient(180deg,#f0e8dc,#e8dfd0)",overflow:"hidden" }}>
            {/* 벽지 패턴 */}
            <div style={{ position:"absolute",inset:0,opacity:0.03,
              backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 30px,#8a7a6a 30px,#8a7a6a 31px),repeating-linear-gradient(90deg,transparent,transparent 30px,#8a7a6a 30px,#8a7a6a 31px)",
              backgroundSize:"31px 31px" }}/>
          </div>

          {/* ── 창문 (밤하늘) ── */}
          <div style={{ position:"absolute",left:"22%",top:"4%",width:140,height:110,
            background:"linear-gradient(180deg,#0f0c29,#302b63,#24243e)",
            border:"6px solid #c4a882",borderRadius:6,overflow:"hidden",
            boxShadow:"inset 0 0 30px rgba(0,0,0,0.3), 0 4px 20px rgba(0,0,0,0.1)" }}>
            {/* 별 */}
            {[{x:15,y:20,s:2},{x:45,y:12,s:1.5},{x:80,y:30,s:2},{x:110,y:8,s:1.5},{x:60,y:45,s:1},
              {x:25,y:55,s:1.5},{x:95,y:50,s:2},{x:120,y:65,s:1},{x:35,y:75,s:1.5},{x:75,y:80,s:1}
            ].map((s,i) => (
              <div key={i} style={{ position:"absolute",left:s.x,top:s.y,width:s.s,height:s.s,
                borderRadius:"50%",background:"#fff",
                animation:`starTwinkle ${2+Math.random()*3}s ease ${Math.random()*2}s infinite` }}/>
            ))}
            {/* 달 */}
            <div style={{ position:"absolute",right:12,top:10,width:20,height:20,borderRadius:"50%",
              background:"radial-gradient(circle at 60% 40%,#ffd,#ffa)",
              boxShadow:"0 0 12px rgba(255,255,200,0.4)" }}/>
            {/* 커튼 */}
            <div style={{ position:"absolute",left:-2,top:-2,width:22,height:"105%",
              background:"linear-gradient(90deg,#d4a872,#c4986288)",borderRadius:"0 4px 4px 0" }}/>
            <div style={{ position:"absolute",right:-2,top:-2,width:22,height:"105%",
              background:"linear-gradient(270deg,#d4a872,#c4986288)",borderRadius:"4px 0 0 4px" }}/>
            {/* 창틀 가운데 */}
            <div style={{ position:"absolute",left:"50%",top:0,width:4,height:"100%",background:"#c4a882",transform:"translateX(-50%)" }}/>
            <div style={{ position:"absolute",top:"50%",left:0,width:"100%",height:4,background:"#c4a882",transform:"translateY(-50%)" }}/>
          </div>

          {/* ── 창문에서 나오는 달빛 ── */}
          <div style={{ position:"absolute",left:"22%",top:"4%",width:200,height:300,
            background:"radial-gradient(ellipse at top,rgba(200,200,255,0.04),transparent 60%)",
            pointerEvents:"none",zIndex:1 }}/>

          {/* ── 책상 (나무 질감) ── */}
          <div style={{ position:"absolute",bottom:0,left:0,right:0,height:"44%",
            background:"linear-gradient(180deg,#b8956e,#a07850,#8a6840)",
            borderTop:"4px solid #7a5830",overflow:"hidden" }}>
            {/* 나무 결 */}
            <div style={{ position:"absolute",inset:0,opacity:0.06,
              backgroundImage:"repeating-linear-gradient(90deg,transparent,transparent 40px,#5a3820 40px,#5a3820 41px)",
              backgroundSize:"80px 100%" }}/>
            {/* 책상 엣지 하이라이트 */}
            <div style={{ position:"absolute",top:0,left:0,right:0,height:3,
              background:"linear-gradient(90deg,#d4b892,#c4a882,#d4b892)" }}/>
            {/* 서랍 */}
            <div style={{ position:"absolute",bottom:20,right:"10%",width:80,height:50,
              background:"linear-gradient(180deg,#a07850,#8a6840)",border:"2px solid #7a5830",borderRadius:4 }}>
              <div style={{ position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
                width:20,height:6,borderRadius:3,background:"#c4a882",border:"1px solid #a08060" }}/>
            </div>
          </div>

          {/* ── 파티클 ── */}
          <ParticleOverlay/>

          {/* ── 설정 ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setSettingsOpen(true); }}
            style={{ position:"absolute",top:12,left:12,zIndex:100,width:36,height:36,borderRadius:10,
              background:"rgba(255,255,255,0.85)",backdropFilter:"blur(8px)",
              border:"1px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:16,boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }} hoverGlow="#aaa">
            ⚙️
          </RoomObj>

          {/* ── 컬렉션 ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setCollectionOpen(true); }}
            style={{ position:"absolute",top:12,left:56,zIndex:100,width:36,height:36,borderRadius:10,
              background:"rgba(255,255,255,0.85)",backdropFilter:"blur(8px)",
              border:"1px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:12,fontWeight:800,color:"#a33de8",boxShadow:"0 2px 12px rgba(0,0,0,0.06)" }}
            hoverGlow="#a33de8">
            {collected.length}
          </RoomObj>

          {/* ── 프로필 ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setProfileOpen(!profileOpen); }}
            style={{ position:"absolute",top:12,right:12,zIndex:100,width:36,height:36,borderRadius:"50%",
              background:"linear-gradient(135deg,#e8d8f8,#d4c0f0)",border:"2px solid #c4b0e0",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,
              boxShadow:"0 3px 12px rgba(0,0,0,0.08)" }} hoverGlow="#a33de8">
            👤
          </RoomObj>

          {/* ── 문 (엔딩18) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); handleDoorKnock(); }}
            style={{ position:"absolute",left:"2%",top:"8%",width:72,height:140,
              background:doorOpen?"linear-gradient(180deg,#2a2018,#1a1008)":"linear-gradient(175deg,#c9a47a,#a88050)",
              border:"4px solid #8a6a4a",borderRadius:"6px 6px 0 0",
              boxShadow:doorOpen?"inset 0 0 30px rgba(0,0,0,0.5)":"0 6px 24px rgba(0,0,0,0.1)",
              transformOrigin:"left center",
              transform:doorOpen?"perspective(600px) rotateY(-65deg)":"none",
              transition:"transform 0.8s cubic-bezier(0.34,1.56,0.64,1), background 0.6s" }} hoverGlow="#8a6a4a">
            {!doorOpen && <>
              <div style={{ position:"absolute",top:14,left:6,right:6,height:48,background:"#b88a60",
                border:"2px solid #a07850",borderRadius:3 }}/>
              <div style={{ position:"absolute",bottom:14,left:6,right:6,height:48,background:"#b88a60",
                border:"2px solid #a07850",borderRadius:3 }}/>
              <div style={{ position:"absolute",top:"50%",right:8,transform:"translateY(-50%)",
                width:8,height:22,background:"linear-gradient(180deg,#d4b040,#b89020)",borderRadius:4 }}/>
            </>}
            {doorKnocks > 0 && doorKnocks < DOOR_KNOCK_THRESHOLD && !doorOpen && (
              <div style={{ position:"absolute",top:-18,left:"50%",transform:"translateX(-50%)",
                fontSize:9,color:"#8a6a4a88",animation:"popIn 0.2s ease" }}>🤛 ×{doorKnocks}</div>
            )}
          </RoomObj>

          {/* ── 시계 (엔딩2) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); triggerEnding(2); } }}
            style={{ position:"absolute",left:"50%",top:"2%",transform:"translateX(-50%)",
              width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#fff,#f8f4f0)",
              border:"3px solid #c4b8a8",boxShadow:"0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.5)",
              display:"flex",alignItems:"center",justifyContent:"center" }} hoverGlow="#e88b3d">
            <svg viewBox="0 0 40 40" width="36" height="36">
              <circle cx="20" cy="20" r="18" fill="none" stroke="#d4ccc0" strokeWidth="1"/>
              {[0,30,60,90,120,150,180,210,240,270,300,330].map(deg => (
                <line key={deg} x1="20" y1="4" x2="20" y2="6" stroke="#b0a090" strokeWidth="1"
                  transform={`rotate(${deg} 20 20)`}/>
              ))}
              <line x1="20" y1="20" x2="20" y2="8" stroke="#5a4a3a" strokeWidth="1.5" strokeLinecap="round"
                transform={`rotate(${(frame*6)%360} 20 20)`}/>
              <line x1="20" y1="20" x2="20" y2="10" stroke="#e8573d" strokeWidth="1" strokeLinecap="round"
                transform={`rotate(${(frame*36)%360} 20 20)`}/>
              <circle cx="20" cy="20" r="1.5" fill="#5a4a3a"/>
            </svg>
          </RoomObj>

          {/* ── 비상연락 (엔딩12) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); triggerEnding(12); } }}
            style={{ position:"absolute",right:"26%",top:"16%",width:46,height:56,
              background:"linear-gradient(180deg,#fff8e1,#fff3c4)",border:"2px solid #ffcc80",borderRadius:6,
              boxShadow:"0 3px 12px rgba(0,0,0,0.04)",display:"flex",flexDirection:"column",
              alignItems:"center",justifyContent:"center",gap:3 }} hoverGlow="#ff9800">
            <div style={{ fontSize:18 }}>📞</div>
            <div style={{ fontSize:6,color:"#e65100",fontWeight:700 }}>비상연락</div>
          </RoomObj>

          {/* ── TV (엔딩14) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); triggerEnding(14); } }}
            style={{ position:"absolute",right:"3%",top:"4%",width:108,height:76,
              background:"linear-gradient(180deg,#333,#222)",border:"4px solid #444",borderRadius:8,
              boxShadow:"0 6px 24px rgba(0,0,0,0.15)",display:"flex",alignItems:"center",
              justifyContent:"center",overflow:"hidden" }} hoverGlow="#666">
            <div style={{ width:"88%",height:"80%",background:"linear-gradient(180deg,#1a1a1a,#111)",
              borderRadius:3,display:"flex",alignItems:"center",justifyContent:"center" }}>
              <div style={{ fontSize:10,color:"#333",letterSpacing:2 }}>OFF</div>
            </div>
            <div style={{ position:"absolute",bottom:-10,left:"50%",transform:"translateX(-50%)",
              width:24,height:10,background:"linear-gradient(180deg,#444,#333)",borderRadius:"0 0 4px 4px" }}/>
            <div style={{ position:"absolute",bottom:4,right:6,width:4,height:4,borderRadius:"50%",background:"#e8573d33" }}/>
          </RoomObj>

          {/* ── 지갑 (엔딩6) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); triggerEnding(6); } }}
            style={{ position:"absolute",left:"12%",top:"60%",width:46,height:32,
              background:"linear-gradient(145deg,#8d6e63,#5d4037)",borderRadius:6,
              boxShadow:"0 3px 12px rgba(0,0,0,0.12)",display:"flex",alignItems:"center",
              justifyContent:"center" }} hoverGlow="#8d6e63">
            <div style={{ fontSize:18 }}>💳</div>
          </RoomObj>

          {/* ── 케이크 (엔딩9) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); setCakeSelected(true); say("케이크를 집었어! 이제 버튼에 올려봐~","excited"); } }}
            style={{ position:"absolute",left:"27%",top:"61%",width:42,height:42,
              background:cakeSelected?"#fff3e0":"rgba(255,255,255,0.9)",borderRadius:8,
              border:cakeSelected?"2px solid #ff9800":"1.5px solid rgba(0,0,0,0.06)",
              boxShadow:cakeSelected?"0 0 16px #ff980044":"0 3px 12px rgba(0,0,0,0.06)",
              display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
              transition:"all 0.3s" }} hoverGlow="#ff9800">
            <div style={{ fontSize:22 }}>🎂</div>
            <div style={{ fontSize:5,color:"#b0a090",marginTop:1 }}>Cake.jpg</div>
          </RoomObj>

          {/* ── 스마트폰 (엔딩10) ── */}
          <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); triggerEnding(10); } }}
            style={{ position:"absolute",right:"20%",top:"59%",width:30,height:52,
              background:"linear-gradient(180deg,#333,#1a1a1a)",borderRadius:8,
              border:"2px solid #444",boxShadow:"0 4px 16px rgba(0,0,0,0.15)",
              display:"flex",alignItems:"center",justifyContent:"center" }} hoverGlow="#4caf50">
            <div style={{ width:24,height:40,background:"linear-gradient(180deg,#1a237e,#0d1117)",borderRadius:4,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:11 }}>📱</div>
          </RoomObj>

          {/* ── 컴퓨터 ── */}
          <div style={{ position:"absolute",right:"4%",top:"53%",width:72,height:56,
            background:"linear-gradient(180deg,#e8e0d8,#d0c8c0)",borderRadius:6,
            border:"3px solid #c0b8b0",boxShadow:"0 4px 16px rgba(0,0,0,0.06)",
            display:"flex",alignItems:"center",justifyContent:"center" }}>
            <div style={{ width:60,height:40,background:"linear-gradient(180deg,#2a3a4a,#1a2a3a)",borderRadius:3,
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:9,color:"#4a6a8a" }}>🖥️</div>
            <div style={{ position:"absolute",bottom:-8,left:"50%",transform:"translateX(-50%)",
              width:22,height:8,background:"#c0b8b0",borderRadius:"0 0 4px 4px" }}/>
          </div>

          {/* ═══ 나비 캐릭터 ═══ */}
          <div onContextMenu={handleNaviContextMenu}
            style={{ position:"absolute",right:"5%",top:"28%",zIndex:60 }}>
            {/* 고양이 귀 트리거 */}
            {!catEars && !activeEvent && (
              <RoomObj onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); triggerEnding(11); } }}
                style={{ position:"absolute",top:-2,left:"50%",transform:"translateX(-50%)",
                  fontSize:8,opacity:0.25,zIndex:2 }} hoverGlow="#ff8fab">
                🐱
              </RoomObj>
            )}
            <NaviCharacter emotion={nEmo} frame={frame} sleeping={naviSleeping} catEars={catEars} gone={naviGone}/>
            <div style={{ textAlign:"center",fontSize:8,color:"#b0a09088",letterSpacing:2,marginTop:-4 }}>NAVI</div>
          </div>

          {/* ── 나비 말풍선 ── */}
          {nText && !naviGone && (
            <div key={nKey} style={{ position:"absolute",right:"3%",top:"18%",zIndex:70,
              maxWidth:200,padding:"10px 14px",background:"rgba(255,255,255,0.95)",backdropFilter:"blur(8px)",
              border:"1.5px solid rgba(0,0,0,0.06)",
              borderRadius:"14px 4px 14px 14px",fontSize:12,lineHeight:1.7,color:"#4a3a2a",
              boxShadow:"0 4px 20px rgba(0,0,0,0.06)",animation:"fadeInUp 0.3s ease" }}>
              <TypeWriter key={nKey} text={nText}/>
            </div>
          )}

          {/* ═══ 중앙 버튼 영역 ═══ */}
          <div style={{ position:"absolute",left:"50%",top:"66%",transform:"translate(-50%,-50%)",zIndex:50 }}>
            {/* 안전 커버 (엔딩13) */}
            {!activeEvent && (
              <div onClick={(e) => { e.stopPropagation(); if (!activeEvent) { resetIdle(); triggerEnding(13); } }}
                style={{ position:"absolute",top:-42,left:"50%",transform:"translateX(-50%)",
                  width:48,height:24,background:"linear-gradient(180deg,#ffd54f,#ffb300)",
                  border:"2px solid #ff8f00",borderRadius:"6px 6px 0 0",cursor:"pointer",
                  display:"flex",alignItems:"center",justifyContent:"center",fontSize:7,
                  color:"#e65100",fontWeight:800,letterSpacing:1,zIndex:2,
                  boxShadow:"0 3px 8px rgba(0,0,0,0.1)" }}>
                ⚠ COVER
              </div>
            )}
            <NuclearButton
              label={buttonLabel} accent={buttonColor}
              onPress={cakeSelected ? () => { setCakeSelected(false); setCakeOnButton(true); triggerEnding(9); } : pressMainButton}
              onHover={handleButtonHover}
              onDrag={!activeEvent && !cakeSelected ? () => { if (!activeEvent) { resetIdle(); triggerEnding(8); } } : undefined}
              disabled={activeEvent === 20}
              cakeMode={cakeOnButton}
              cakeSelect={cakeSelected}
            />
          </div>

          {/* ── 방치 경고 ── */}
          {idleTimer > 120 && idleTimer < IDLE_LIMIT && !activeEvent && (
            <div style={{ position:"absolute",bottom:44,left:"50%",transform:"translateX(-50%)",
              fontSize:9,color:"#b0a09066",animation:"pulse 2.5s ease infinite" }}>(조용하다...)</div>
          )}

          {/* ── 컬렉션 도트 ── */}
          <div style={{ position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
            display:"flex",gap:4,zIndex:40 }}>
            {Array.from({length:21},(_,i)=>i+1).map(id => (
              <div key={id} style={{ width:6,height:6,borderRadius:"50%",
                background:collected.includes(id)?"#a33de8":"#d8d0c822",
                boxShadow:collected.includes(id)?"0 0 6px #a33de844":"none",
                transition:"all 0.4s" }}/>
            ))}
          </div>

          {/* ═══ 오버레이 ═══ */}
          <BSODOverlay active={showBSOD && activeEvent === 7}/>
          <NewsOverlay active={showNews && activeEvent === 14}/>
          <StockOverlay active={showStock && activeEvent === 10}/>
          {marshmallowActive && <TimerDisplay seconds={marshmallowTimer}/>}
          {countdownVal !== null && <CountdownDisplay count={countdownVal}/>}
          {showRunaway && activeEvent === 8 && <RunawayButton onCatch={() => { setShowRunaway(false); pressEventButton(); }}/>}
          <PrizeBanner visible={bannerVisible} onClick={(e) => { e.stopPropagation(); setBannerVisible(false); if (!activeEvent) triggerEnding(5); }}/>

          {activeEvent === 15 && <div style={{ position:"absolute",inset:0,background:"rgba(0,0,0,0.08)",zIndex:300,pointerEvents:"none",animation:"pulse 1.2s ease infinite" }}/>}
          {activeEvent === 12 && <div style={{ position:"absolute",inset:0,zIndex:300,pointerEvents:"none",animation:"siren 0.5s ease infinite" }}/>}

          {darkMode && (
            <div style={{ position:"absolute",inset:0,zIndex:500,background:"#000",animation:"darkFade 4s ease forwards",
              display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column" }}>
              <div style={{ color:"#22222266",fontSize:13,marginBottom:24 }}>(조명이 꺼졌다)</div>
              <div onClick={pressEventButton} style={{ color:"#22222233",fontSize:11,cursor:"pointer",
                padding:"8px 16px",border:"1px solid #22222222",borderRadius:8 }}>...</div>
            </div>
          )}

          {(showNews || showStock) && activeEvent && !showRunaway && (
            <div style={{ position:"absolute",bottom:"14%",left:"50%",transform:"translateX(-50%)",zIndex:450 }}>
              <button onClick={(e) => { e.stopPropagation(); pressEventButton(); }}
                style={{ padding:"12px 32px",background:buttonColor,border:"none",borderRadius:12,
                  color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:3,
                  boxShadow:`0 6px 24px ${buttonColor}44`,animation:"popIn 0.4s ease" }}>
                {buttonLabel}
              </button>
            </div>
          )}

          {!showBSOD && activeEvent === 7 && (
            <div style={{ position:"absolute",bottom:"14%",left:"50%",transform:"translateX(-50%)",zIndex:450 }}>
              <button onClick={(e) => { e.stopPropagation(); pressEventButton(); }}
                style={{ padding:"12px 32px",background:"#1565c0",border:"none",borderRadius:12,
                  color:"#fff",fontSize:14,fontWeight:800,cursor:"pointer",letterSpacing:3,
                  boxShadow:"0 6px 24px #1565c044",animation:"popIn 0.4s ease" }}>복구</button>
            </div>
          )}

          <SettingsPanel open={settingsOpen} onClose={()=>setSettingsOpen(false)}
            onKillMode={() => { if (!activeEvent) { setKillMode(true); setSettingsOpen(false); triggerEnding(15); } }}
            onReset={() => { if (!activeEvent) { setSettingsOpen(false); triggerEnding(17); } }} killModeOn={killMode}/>
          <ProfileMenu open={profileOpen} onClose={()=>setProfileOpen(false)}
            onTransfer={() => { if (!activeEvent) { setProfileOpen(false); triggerEnding(19); } }}/>
          <CollectionPanel open={collectionOpen} onClose={()=>setCollectionOpen(false)} collected={collected}/>

          {contextMenu && <>
            <div onClick={()=>setContextMenu(null)} style={{ position:"fixed",inset:0,zIndex:850 }}/>
            <ContextMenu x={contextMenu.x} y={contextMenu.y}
              onDelete={() => { setContextMenu(null); triggerEnding(1); }} onClose={()=>setContextMenu(null)}/>
          </>}

          {/* 스캔라인 */}
          <div style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:3,overflow:"hidden" }}>
            <div style={{ position:"absolute",left:0,width:"100%",height:"1px",
              background:"rgba(0,0,0,0.015)",animation:"scanline 8s linear infinite" }}/></div>
        </div>
      )}

      {/* ═══════════ ENDING ═══════════ */}
      {gs === "ending" && endingData && (
        <div style={{ width:"100%",height:"100%",display:"flex",flexDirection:"column",alignItems:"center",
          justifyContent:"center",
          background:endingData.phase==="진 엔딩"?"linear-gradient(180deg,#0a0a0a,#000)":"linear-gradient(170deg,#fefcfa,#f8f0f5)",
          animation:"fadeIn 0.6s ease" }}>

          <div style={{ fontSize:64,marginBottom:16,animation:"popIn 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>
            {endingData.emoji}</div>
          <div style={{ fontSize:10,color:endingData.phase==="진 엔딩"?"#444":"#b0a090",letterSpacing:4,marginBottom:6 }}>
            {endingData.phase} · ENDING #{activeEvent}</div>
          <div style={{ fontSize:26,fontWeight:800,
            color:endingData.phase==="진 엔딩"?"#ddd":endingData.btnColor||"#333",
            marginBottom:20,animation:"fadeInUp 0.5s ease",letterSpacing:3 }}>
            {endingData.name}</div>

          <div style={{ marginBottom:12,animation:"fadeInUp 0.6s ease" }}>
            <NaviCharacter emotion={activeEvent===15?"idle":(endingData.eventEmo||"idle")} frame={frame}/></div>

          <div style={{ maxWidth:320,textAlign:"center",animation:"fadeInUp 0.7s ease" }}>
            {endingData.over1 && <div style={{ fontSize:16,color:endingData.phase==="진 엔딩"?"#888":"#4a3a2a",
              lineHeight:1.8,marginBottom:6 }}>"{endingData.over1}"</div>}
            {endingData.over2 && <div style={{ fontSize:12,color:endingData.phase==="진 엔딩"?"#444":"#b0a090",
              lineHeight:1.6 }}>{endingData.over2}</div>}
          </div>

          <div style={{ marginTop:24,fontSize:10,color:"#a33de8",animation:"fadeIn 1s ease" }}>
            ✦ {collected.length}/21 엔딩 수집됨</div>

          <button onClick={restart} style={{ marginTop:20,padding:"12px 32px",
            background:endingData.btnColor||"#e8573d",border:"none",borderRadius:12,
            color:"#fff",fontSize:13,fontWeight:800,cursor:"pointer",letterSpacing:3,
            boxShadow:`0 6px 24px ${endingData.btnColor||"#e8573d"}33`,animation:"fadeInUp 0.8s ease",
            transition:"transform 0.2s" }}
            onMouseEnter={e=>e.target.style.transform="scale(1.05)"}
            onMouseLeave={e=>e.target.style.transform="scale(1)"}>
            RETRY
          </button>
        </div>
      )}

      {gs === "credits" && <CreditsScreen onBack={restart}/>}
    </div>
  );
}
