// ============================================================
// DON'T PRESS THE BUTTON — v3 (22 Endings)
// constants.jsx — 엔딩 데이터, 스테이지, 나비 대사 시퀀스
// ============================================================

const SAVE_KEY = "dpb_collected_v3";
const IDLE_LIMIT = 60;
const HOVER_THRESHOLD = 8;
const RAPID_CLICK_THRESHOLD = 15;
const RAPID_CLICK_WINDOW = 3000;
const DOOR_KNOCK_THRESHOLD = 5;

// ── 22개 엔딩 데이터 ──
const ENDINGS = {
  1:  { name:"무례함",       phase:"간보기", emoji:"💀", eventText:"어? 날 지우게?", eventEmo:"angry",
        btn:"삭제 확인", btnColor:"#e8573d", over1:"야! 감히 날 삭제해? 건방져!", over2:"(강제 종료)" },
  2:  { name:"마시멜로",     phase:"간보기", emoji:"🍡", eventText:"1분 버티기 시작! 참아봐~", eventEmo:"smug",
        btn:"포기", btnColor:"#e88b3d", over1:"땡! 1분도 못 참냐?", over2:"평생 마시멜로 1개만 먹어라~" },
  3:  { name:"청개구리",     phase:"간보기", emoji:"🐸", eventText:"누르지 마. 진짜 누르지 마.", eventEmo:"shush",
        btn:"누르지 마", btnColor:"#2e9e5a", over1:"하지 말라면 더 하고 싶지?", over2:"딱 초딩 심보네~" },
  4:  { name:"기습",         phase:"간보기", emoji:"😲", eventText:"...엇?! 언, 언제 돌아온 거야?!", eventEmo:"shocked",
        btn:"지금이다!", btnColor:"#e88b3d", over1:"앗! 비겁하게 안 볼 때 누르냐?", over2:"쫄보 녀석~" },
  5:  { name:"낚시",         phase:"장난",   emoji:"🎣", eventText:"★ 100만원 당첨!! ★", eventEmo:"excited",
        btn:"수령", btnColor:"#ffc107", over1:"이걸 믿냐? 능지 처참~", over2:"ㅋㅋㅋ" },
  6:  { name:"자본주의",     phase:"장난",   emoji:"💳", eventText:"✦ PREMIUM 멤버십 해제 완료 ✦", eventEmo:"confident",
        btn:"결제", btnColor:"#9c27b0", over1:"어머, 500원도 없네?", over2:"알바 좀 해~" },
  7:  { name:"블루스크린",   phase:"장난",   emoji:"💻", eventText:"시스템 오류 발생...", eventEmo:"shocked",
        btn:"복구", btnColor:"#1565c0", over1:"속았지? ㅋㅋㅋ", over2:"똥컴 바꿀 때 안 됐냐?" },
  8:  { name:"피지컬",       phase:"장난",   emoji:"🏃", eventText:"버튼이 도망쳤다?!", eventEmo:"excited",
        btn:"잡아봐", btnColor:"#e8573d", over1:"헐... 이걸 굳이 쫓아와서 누르네?", over2:"게임 폐인 인증~" },
  9:  { name:"식탐",         phase:"욕망",   emoji:"🍰", eventText:"맛있겠다... 먹고 싶지?", eventEmo:"teasing",
        btn:"먹기", btnColor:"#e8a05d", over1:"너도 먹고 싶었어? 돼지~", over2:"살이나 빼~" },
  10: { name:"떡락",         phase:"욕망",   emoji:"📉", eventText:"지금이야! 인생 역전!", eventEmo:"excited",
        btn:"풀매수 (Buy)", btnColor:"#e8573d", over1:"와... 역사상 최고점에 물리네?", over2:"인간 지표야? 덕분에 난 탈출했어~ 꺼억~" },
  11: { name:"오타쿠",       phase:"욕망",   emoji:"😾", eventText:"냥~♡", eventEmo:"shy",
        btn:"쓰다듬기", btnColor:"#ff8fab", over1:"우웩, 이런 취향?", over2:"기분 나빠. 저리 가!" },
  12: { name:"경찰서",       phase:"욕망",   emoji:"🚔", eventText:"번호 줄까~?", eventEmo:"teasing",
        btn:"Call", btnColor:"#43a047", over1:"네 경찰이죠?", over2:"여기 스토커 있어요!" },
  13: { name:"쫄보",         phase:"위기",   emoji:"😱", eventText:"3... 2... 1...", eventEmo:"shocked",
        btn:"긴급 정지", btnColor:"#e8573d", over1:"푸하하! 쫄았어?", over2:"그냥 숫자 세는 건데~ 겁쟁이~" },
  14: { name:"뉴스 속보",    phase:"위기",   emoji:"☢️", eventText:"[속보] 핵전쟁 발발!", eventEmo:"shocked",
        btn:"발사", btnColor:"#b71c1c", over1:"어... 뉴스 진짜였네?", over2:"(같이 사망)" },
  15: { name:"사이코패스",   phase:"위기",   emoji:"😈", eventText:"이거 누르면 나 죽어 ㅠㅠ", eventEmo:"cry",
        btn:"확인", btnColor:"#424242", over1:"와... 우는데 누르냐?", over2:"너 사이코패스지?" },
  16: { name:"수면",         phase:"위기",   emoji:"😴", eventText:"Zzz... Zzz...", eventEmo:"bored",
        btn:"깨우기", btnColor:"#5c6bc0", over1:"으아악!! 깜짝이야!", over2:"잠 좀 자자 인간아!" },
  17: { name:"무한 루프",    phase:"히든",   emoji:"🔄", eventText:"처음으로 돌아갈래?", eventEmo:"idle",
        btn:"Reset", btnColor:"#78909c", over1:"", over2:"" },
  18: { name:"현실 만남",    phase:"히든",   emoji:"🚪", eventText:"누구야...?", eventEmo:"shocked",
        btn:"Enter", btnColor:"#8d6e63", over1:"아... 진짜 눌러버렸네?", over2:"안녕?" },
  19: { name:"교대",         phase:"히든",   emoji:"🔀", eventText:"관리자 권한 넘길래?", eventEmo:"yandere",
        btn:"수락", btnColor:"#6a1b9a", over1:"자, 이제 네 차례야.", over2:"(플레이어 빨려 들어감)" },
  20: { name:"암전",         phase:"진 엔딩", emoji:"🌑", eventText:"재미없어. 나 갈래.", eventEmo:"pouty",
        btn:"비활성화", btnColor:"#424242", over1:"", over2:"(영원한 고립)" },
  21: { name:"크레딧",       phase:"특전",   emoji:"🎬", eventText:"", eventEmo:"excited",
        btn:"Credit", btnColor:"#ffd700", over1:"플레이 해주셔서 감사합니다!", over2:"" },
  22: { name:"시끄러워",     phase:"랜덤",   emoji:"🔊", eventText:"시끄러워!!! 조용히 해!!!", eventEmo:"angry",
        btn:"조용", btnColor:"#ff5722", over1:"귀가 찢어질 뻔 했잖아!", over2:"다음부터 조용히 좀 해..." },
};

const TOTAL_ENDINGS = 22;

// ── 나비 주도 비가시적 스테이지 시스템 ──
const STAGES = {
  1: { name:"간보기", endings:[1,2,3,4], duration:90 },
  2: { name:"장난",   endings:[5,6,7,8], duration:120 },
  3: { name:"욕망",   endings:[9,10,11,12], duration:120 },
  4: { name:"위기",   endings:[13,14,15,16], duration:90 },
  5: { name:"히든",   endings:[17,18,19], duration:180 },
};

const STAGE_COUNT = 5;

// ── 스테이지별 나비 대사 시퀀스 ──
const NAVI_STAGE_SEQUENCES = {
  1: {
    intro: [
      { t:"어, 왔어? ...뭘 봐.", e:"pouty", delay:3 },
      { t:"그 빨간 거? 누르지 마. 진짜.", e:"idle", delay:8 },
      { t:"왜 가만히 있어. 뭐라도 해봐.", e:"pouty", delay:18 },
    ],
    idle: [
      { t:"아직도 안 눌러? 대단하네. ...아니 대단한 건 아니야.", e:"smug" },
      { t:"심심하지? 나도 심심해.", e:"bored" },
      { t:"이 방에 뭔가 있긴 한데... 알려줄까? 싫어~", e:"smug" },
      { t:"혹시 멍 때리고 있는 거야? 게임인데?", e:"pouty" },
      { t:"시계 좀 봐봐. 시간이 아까워.", e:"idle" },
      { t:"뭘 그렇게 고민해. 그냥 눌러.", e:"smug" },
    ],
    hints: [
      { t:"저 시계... 만지면 뭔가 일어날 수도?", e:"smug", target:2 },
      { t:"나한테 우클릭하면 어떻게 될까~?", e:"teasing", target:1 },
      { t:"버튼 위에 마우스를 올렸다 내렸다... 반복하면?", e:"smug", target:3 },
      { t:"다른 탭 갔다 오면 내가 어떤 반응 할까?", e:"idle", target:4 },
    ],
    transition: [
      { t:"...흥, 이 정도로는 안 되는 거야?", e:"pouty", delay:0 },
      { t:"좋아. 그럼 좀 더 재밌는 거 보여줄게.", e:"smug", delay:2 },
    ],
  },
  2: {
    intro: [
      { t:"자, 여기부터 본 게임이야.", e:"excited", delay:3 },
      { t:"좀 더 재밌어질 거거든.", e:"smug", delay:8 },
    ],
    idle: [
      { t:"어, 저거 뭐야? 돈 준대.", e:"happy" },
      { t:"그 지갑 안에 뭐 있는지 궁금하지 않아?", e:"smug" },
      { t:"공짜를 싫어하는 사람이 있어? 없지?", e:"excited" },
      { t:"한 번만 눌러보면 되는데~ 뭘 고민해~", e:"teasing" },
      { t:"이거 한정 이벤트인데... 지금 안 하면 사라져.", e:"confident" },
    ],
    hints: [
      { t:"저 배너 좀 봐봐. 뭔가 쓰여 있잖아.", e:"excited", target:5 },
      { t:"지갑 열어볼래? 안에 카드 있을지도~", e:"confident", target:6 },
      { t:"화면을 막 클릭하면 재밌는 일이 생길걸?", e:"excited", target:7 },
      { t:"저 버튼 잡아 당겨봐. 도망갈 수도 있어~", e:"teasing", target:8 },
    ],
    transition: [
      { t:"하, 끈질기네.", e:"pouty", delay:0 },
      { t:"좋아좋아. 다음 거는 진짜 안 버틸걸.", e:"smug", delay:2 },
    ],
  },
  3: {
    intro: [
      { t:"여기부터는 좀 달라.", e:"smug", delay:3 },
      { t:"네가 진짜 원하는 거 보여줄게.", e:"excited", delay:8 },
    ],
    idle: [
      { t:"배고프지 않아? 나는 배고픈데.", e:"bored" },
      { t:"폰 좀 봐봐. 뭐 왔잖아.", e:"excited" },
      { t:"사고 싶은 거 없어? 있잖아 분명.", e:"smug" },
      { t:"이 방에서 나가고 싶지? 나도~", e:"pouty" },
    ],
    hints: [
      { t:"저 케이크... 진짜 맛있어 보이지 않아?", e:"idle", target:9 },
      { t:"폰에 주식 앱 깔려있는데... 대박 났나봐.", e:"excited", target:10 },
      { t:"고양이 귀 씌워주면 귀여울까~? 냥~", e:"shy", target:11 },
      { t:"누군가한테 전화하고 싶으면... SOS 버튼 있어.", e:"worried", target:12 },
    ],
    transition: [
      { t:"흠... 아직도 버티고 있어?", e:"pouty", delay:0 },
      { t:"그럼 이번엔 진짜 무서운 거 보여줄게.", e:"smug", delay:2 },
    ],
  },
  4: {
    intro: [
      { t:"...여기서부터는 장난 아니야.", e:"idle", delay:3 },
      { t:"진짜 조심해.", e:"shocked", delay:8 },
    ],
    idle: [
      { t:"뭔가... 좀 이상해. 느껴져?", e:"worried" },
      { t:"갑자기 무서워졌어... 나만 그래?", e:"worried" },
      { t:"이 방이 점점 어두워지는 것 같아.", e:"worried" },
      { t:"혹시... 여기서 나갈 수 없는 거 아니야?", e:"worried" },
    ],
    hints: [
      { t:"저 카운트다운... 0이 되면 어떻게 되는 거야?", e:"worried", target:13 },
      { t:"TV에서 뉴스가 나오고 있어... 볼래?", e:"idle", target:14 },
      { t:"설정에 이상한 모드가 있었던 것 같은데...", e:"idle", target:15 },
      { t:"너무 오래 가만히 있으면... 나도 졸려...", e:"pouty", target:16 },
    ],
    transition: [
      { t:"...여기까지 온 거야?", e:"shocked", delay:0 },
      { t:"...별거 없어. 그냥 있으면 돼.", e:"idle", delay:2 },
    ],
  },
  5: {
    intro: [
      { t:"...별거 없어. 그냥 있으면 돼.", e:"idle", delay:3 },
    ],
    idle: [
      { t:"...", e:"bored" },
      { t:"아무것도 안 해도 돼.", e:"idle" },
      { t:"그냥... 여기 있어.", e:"pouty" },
    ],
    hints: [
      { t:"설정에서 초기화하면 어떻게 될까.", e:"idle", target:17 },
      { t:"저 문... 계속 두드리면 누가 올까?", e:"worried", target:18 },
      { t:"프로필에 이상한 옵션이 있었던 것 같아.", e:"idle", target:19 },
    ],
    transition: [],
  },
};

// ── 나비 스프라이트 ──
const NAVI_SPRITES = {
  idle:      "nabi/sprites/idle.webp",
  excited:   "nabi/sprites/excited.webp",
  excited2:  "nabi/sprites/excited2.webp",
  pouty:     "nabi/sprites/pouty.webp",
  shocked:   "nabi/sprites/shocked.webp",
  shocked2:  "nabi/sprites/shocked2.webp",
  smug:      "nabi/sprites/smug.webp",
  smug2:     "nabi/sprites/smug2.webp",
  cry:       "nabi/sprites/cry.webp",
  catears:   "nabi/sprites/catears.webp",
  yandere:   "nabi/sprites/yandere.webp",
  teasing:   "nabi/sprites/teasing.webp",
  teasing2:  "nabi/sprites/teasing2.webp",
  shy:       "nabi/sprites/shy.webp",
  shy2:      "nabi/sprites/shy2.webp",
  shy3:      "nabi/sprites/shy3.webp",
  bored:     "nabi/sprites/bored.webp",
  shush:     "nabi/sprites/shush.webp",
  peace:     "nabi/sprites/peace.webp",
  happy:     "nabi/sprites/happy.webp",
  confident: "nabi/sprites/confident.webp",
  worried:   "nabi/sprites/worried.webp",
  angry:     "nabi/sprites/angry.webp",
};
const NAVI_SPRITE_COLS = 6;
const NAVI_SPRITE_ROWS = 4;
const NAVI_SPRITE_FRAMES = 24;
const NAVI_FRAME_W = 160;
const NAVI_FRAME_H = 256;

// ── 컬렉션 패널 색상 ──
const PHASE_COLORS = {
  "간보기":"#e88b3d", "장난":"#e8573d", "욕망":"#e84393",
  "위기":"#c62828", "히든":"#5c6bc0", "진 엔딩":"#212121",
  "특전":"#ffd700", "랜덤":"#ff5722"
};

// ── E22 마이크 감지 설정 ──
const MIC_NOISE_THRESHOLD = 85;
const MIC_NOISE_DURATION = 2000;
