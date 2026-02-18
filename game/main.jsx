// ============================================================
// main.jsx — 메인 게임 컴포넌트
// 비가시적 스테이지 시스템 + 나비 대사 시퀀스 엔진
// ============================================================

function DontPressTheButton() {
  // ── 핵심 상태 ──
  const [gs, setGs] = useState("title"); // title | room | ending | credits
  const [activeEvent, setActiveEvent] = useState(null);
  const [collected, setCollected] = useState(loadCollected);
  const [frame, setFrame] = useState(0);
  const [nEmo, setNEmo] = useState("idle");
  const [nText, setNText] = useState("");
  const [nKey, setNKey] = useState(0);
  const [endingData, setEndingData] = useState(null);
  const [screenShake, setScreenShake] = useState(false);
  const [playCount, setPlayCount] = useState(() => {
    try { return parseInt(localStorage.getItem("dpb_plays") || "0"); } catch { return 0; }
  });

  // ── 비가시적 스테이지 시스템 (플레이어에게 안 보임) ──
  const [currentStage, setCurrentStage] = useState(1);
  const [stageElapsed, setStageElapsed] = useState(0);
  const [crtOff, setCrtOff] = useState(false);
  const [stageTransitioning, setStageTransitioning] = useState(false);

  // ── CRT 이동 시스템 (오브젝트 소개 시 나비가 이동) ──
  const [crtTarget, setCrtTarget] = useState(null); // null = 홈, "showBanner" 등
  const [crtMoving, setCrtMoving] = useState(false);
  const crtMovingRef = useRef(false);
  const crtMoveTimers = useRef([]);

  // ── 나비 스크립트 엔진 ──
  const [naviScriptIdx, setNaviScriptIdx] = useState(0);

  // ── 인터렉션 상태 ──
  const [hoverCount, setHoverCount] = useState(0);
  const [totalBgClicks, setTotalBgClicks] = useState(0);
  const [doorKnocks, setDoorKnocks] = useState(0);
  const [doorOpen, setDoorOpen] = useState(false);
  const [bannerVisible, setBannerVisible] = useState(false);
  const [idleTimer, setIdleTimer] = useState(0);
  const [catEars, setCatEars] = useState(false);
  const [cakeSelected, setCakeSelected] = useState(false);
  const [cakeOnButton, setCakeOnButton] = useState(false);
  const [naviSleeping, setNaviSleeping] = useState(false);
  const [naviGone, setNaviGone] = useState(false);
  const [wasHidden, setWasHidden] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [collectionOpen, setCollectionOpen] = useState(false);
  const [killMode, setKillMode] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);

  // ── 나비 스크립트 액션: 오브젝트 개별 가시성 ──
  const [walletVisible, setWalletVisible] = useState(false);
  const [cakeVisible, setCakeVisible] = useState(false);
  const [phoneVisible, setPhoneVisible] = useState(false);
  const [sosVisible, setSOSVisible] = useState(false);
  const [tvVisible, setTVVisible] = useState(false);
  const [safetyCoverVisible, setSafetyCoverVisible] = useState(false);

  // ── 엔딩 컴포넌트 활성 상태 ──
  const [showE05, setShowE05] = useState(false);
  const [showE06, setShowE06] = useState(false);
  const [showE07, setShowE07] = useState(false);
  const [showE08, setShowE08] = useState(false);
  const [showE10, setShowE10] = useState(false);
  const [showE11, setShowE11] = useState(false);
  const [showE12, setShowE12] = useState(false);
  const [showE13, setShowE13] = useState(false);
  const [showE14, setShowE14] = useState(false);
  const [showE15, setShowE15] = useState(false);
  const [showE16, setShowE16] = useState(false);
  const [showE19, setShowE19] = useState(false);
  const [showE20, setShowE20] = useState(false);
  const [showE22, setShowE22] = useState(false);

  const idleRef = useRef(0);

  // ── 기본 함수 ──
  const say = useCallback((text, emotion) => {
    setNEmo(emotion || "idle"); setNText(text); setNKey(p => p + 1);
  }, []);

  const doShake = useCallback(() => {
    setScreenShake(true); setTimeout(() => setScreenShake(false), 400);
  }, []);

  const resetIdle = useCallback(() => { idleRef.current = 0; setIdleTimer(0); }, []);

  // ── 프레임 카운터 ──
  useEffect(() => {
    const iv = setInterval(() => setFrame(p => p + 1), 350);
    return () => clearInterval(iv);
  }, []);

  // ── 스프라이트 프리로드 ──
  useEffect(() => {
    if (gs === "room") {
      ["excited","pouty","shocked","smug","cry","catears",
       "angry","teasing","shy","bored","shush","yandere",
       "worried","confident","happy","peace"].forEach(preloadNaviSprite);
    }
  }, [gs]);

  // ── 엔딩 활성화 체크 (스테이지 기반) ──
  const isEndingActive = useCallback((id) => {
    if (id === 22) return true; // E22는 항상 활성
    if (id === 20) return currentStage >= STAGE_COUNT; // E20은 S5 스크립트 끝에서 활성
    const stage = STAGES[currentStage];
    return stage?.endings?.includes(id) ?? false;
  }, [currentStage]);

  // ════════════════════════════════════════════════
  // 나비 주도 비가시적 스테이지 엔진
  // ════════════════════════════════════════════════

  // ── 스테이지 경과 시간 타이머 (엔딩 오버레이 중 일시정지) ──
  useEffect(() => {
    if (gs !== "room" || stageTransitioning || activeEvent) return;
    const iv = setInterval(() => {
      setStageElapsed(p => p + 1);
    }, 1000);
    return () => clearInterval(iv);
  }, [gs, stageTransitioning, activeEvent]);

  // ── 오브젝트 등장 액션 실행 ──
  const executeAction = useCallback((action) => {
    switch (action) {
      case "showBanner": setBannerVisible(true); break;
      case "showWallet": setWalletVisible(true); break;
      case "showCake": setCakeVisible(true); break;
      case "showPhone": setPhoneVisible(true); break;
      case "showSOS": setSOSVisible(true); break;
      case "showTV": setTVVisible(true); break;
      case "showSafetyCover": setSafetyCoverVisible(true); break;
    }
  }, []);

  // ── CRT 이동 시퀀스 (오브젝트 소개용) ──
  // 꺼짐 → 이동 → 켜짐 → 대사+오브젝트 등장 → 꺼짐 → 복귀 → 켜짐
  const doCRTMove = useCallback((targetAction, text, emotion, onDone) => {
    crtMovingRef.current = true;
    setCrtMoving(true);
    const timers = crtMoveTimers.current;
    timers.length = 0;

    // Phase 1: CRT 꺼짐
    setCrtOff(true);
    timers.push(setTimeout(() => {
      // Phase 2: 오브젝트 위치로 텔레포트 (CRT 꺼진 상태)
      setCrtTarget(targetAction);
      timers.push(setTimeout(() => {
        // Phase 3: CRT 켜짐 + 대사 + 오브젝트 등장
        setCrtOff(false);
        say(text, emotion);
        executeAction(targetAction);
        timers.push(setTimeout(() => {
          // Phase 4: CRT 꺼짐 (복귀 준비)
          setCrtOff(true);
          timers.push(setTimeout(() => {
            // Phase 5: 홈으로 텔레포트
            setCrtTarget(null);
            timers.push(setTimeout(() => {
              // Phase 6: CRT 켜짐 (홈 복귀 완료) — 대사 초기화
              setCrtOff(false);
              setNText(""); setNEmo("idle");
              setCrtMoving(false);
              crtMovingRef.current = false;
              onDone();
            }, 600));
          }, 400));
        }, 3500)); // 오브젝트 옆에서 대사 시간
      }, 600)); // 이동 대기
    }, 500)); // 꺼짐 애니메이션
  }, [say, executeAction]);

  // CRT 이동 타이머 정리 (방 나가기/엔딩 시)
  const cleanupCRTMove = useCallback(() => {
    crtMoveTimers.current.forEach(t => clearTimeout(t));
    crtMoveTimers.current.length = 0;
    setCrtMoving(false);
    crtMovingRef.current = false;
    setCrtTarget(null);
  }, []);

  // ── 나비 스크립트 시퀀스 엔진 (대사 주도 + 오브젝트 등장 + CRT 이동 + 전환) ──
  useEffect(() => {
    if (gs !== "room" || activeEvent || stageTransitioning || crtMoving) return;
    const seq = NAVI_STAGE_SEQUENCES[currentStage];
    if (!seq?.script) return;

    const entry = seq.script[naviScriptIdx];
    if (!entry) return; // 스크립트 소진 — 대기

    if (stageElapsed >= entry.t) {
      // 오브젝트 등장 액션 → CRT 이동 연출
      if (entry.action && entry.action !== "triggerE20") {
        doCRTMove(entry.action, entry.text, entry.e, () => {
          setNaviScriptIdx(p => p + 1);
        });
        return;
      }

      // E20 트리거 (CRT 이동 없음)
      if (entry.action === "triggerE20") {
        setNaviScriptIdx(p => p + 1); // 재트리거 방지
        triggerEnding(20);
        return;
      }

      // 일반 대사
      say(entry.text, entry.e);

      // 스테이지 전환
      if (entry.transition) {
        setNaviScriptIdx(p => p + 1);
        initiateStageTransition();
        return;
      }

      setNaviScriptIdx(p => p + 1);
    }
  }, [gs, stageElapsed, activeEvent, stageTransitioning, crtMoving, currentStage, naviScriptIdx]);

  const initiateStageTransition = useCallback(() => {
    if (currentStage >= STAGE_COUNT) return; // 마지막 스테이지면 전환 없음
    setStageTransitioning(true);

    // CRT 꺼짐 연출
    setTimeout(() => setCrtOff(true), 2000);

    // 스테이지 변경 + CRT 켜짐
    setTimeout(() => {
      setCurrentStage(p => p + 1);
      setStageElapsed(0);
      setNaviScriptIdx(0);
      setCrtOff(false);
      setStageTransitioning(false);
    }, 4000);
  }, [currentStage]);

  // ════════════════════════════════════════════════
  // 엔딩 시스템
  // ════════════════════════════════════════════════

  const recordEnding = useCallback((id) => {
    setCollected(prev => {
      if (prev.includes(id)) return prev;
      const next = [...prev, id];
      saveCollected(next);
      return next;
    });
  }, []);

  const triggerEnding = useCallback((id) => {
    if (gs !== "room" || activeEvent || crtMovingRef.current) return;
    if (id !== 1 && !isEndingActive(id)) return; // E01(삭제)은 항상 가능
    resetIdle();
    cleanupCRTMove(); // CRT 이동 중이었다면 정리
    setCrtOff(false);
    const ed = ENDINGS[id];
    if (!ed) return;
    setActiveEvent(id);

    // 엔딩별 특수 처리
    switch(id) {
      case 2: break; // 마시멜로 타이머는 E02 컴포넌트
      case 5: setShowE05(true); break;
      case 6: setShowE06(true); break;
      case 7: setShowE07(true); break;
      case 8: setShowE08(true); break;
      case 9: break;
      case 10: setShowE10(true); break;
      case 11: setCatEars(true); setShowE11(true); break;
      case 12: setShowE12(true); break;
      case 13: setShowE13(true); doShake(); break;
      case 14: setShowE14(true); doShake(); break;
      case 15: setNEmo("cry"); setShowE15(true); break;
      case 16: setNaviSleeping(true); setShowE16(true); break;
      case 18: setDoorOpen(true); break;
      case 19: setShowE19(true); break;
      case 20: setShowE20(true); setTimeout(() => setNaviGone(true), 3000); break;
      case 22: setShowE22(true); break;
    }

    // 오버레이 컴포넌트가 자체 say()를 호출하는 엔딩은 여기서 say 생략
    // (중복 호출 방지 — 해당 컴포넌트의 useEffect에서 처리)
    const overlayHandled = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,22];
    if (!overlayHandled.includes(id)) {
      say(ed.eventText, ed.eventEmo);
    }
  }, [gs, activeEvent, isEndingActive, resetIdle, cleanupCRTMove, say, doShake]);

  const pressEventButton = useCallback(() => {
    if (!activeEvent) return;
    const id = activeEvent;
    const ed = ENDINGS[id];
    recordEnding(id);

    // Reset all ending visuals
    setShowE05(false); setShowE06(false); setShowE07(false); setShowE08(false);
    setShowE10(false); setShowE11(false); setShowE12(false); setShowE13(false);
    setShowE14(false); setShowE15(false); setShowE16(false); setShowE19(false);
    setShowE20(false); setShowE22(false);

    if (id === 17) {
      setEndingData({ ...ed,
        over1: playCount > 0 ? "또 왔어? 학습 능력이 없어?" : "처음으로 돌아갈래?",
        over2: "(타이틀 복귀)"
      });
    } else if (id === 20) {
      setEndingData({ ...ed, over1:"(조명 꺼짐)", over2:"(영원한 고립)" });
    } else {
      setEndingData(ed);
    }
    doShake();
    setGs("ending");
  }, [activeEvent, recordEnding, playCount, doShake]);

  // ── 엔딩 dismiss (기록하지 않고 오버레이만 닫기) ──
  const dismissEnding = useCallback(() => {
    if (!activeEvent) return;
    setActiveEvent(null);
    // 모든 오버레이 플래그 리셋
    setShowE05(false); setShowE06(false); setShowE07(false); setShowE08(false);
    setShowE10(false); setShowE11(false); setShowE12(false); setShowE13(false);
    setShowE14(false); setShowE15(false); setShowE16(false); setShowE19(false);
    setShowE20(false); setShowE22(false);
    // 엔딩별 부작용 상태 리셋
    setNaviSleeping(false); setNaviGone(false); setDoorOpen(false);
    setCatEars(false); setCakeOnButton(false); setCakeSelected(false);
    setKillMode(false); setCrtOff(false); setWasHidden(false);
    // E03 재트리거를 위한 hoverCount 리셋 + E07 데미지 초기화
    setHoverCount(0);
    setTotalBgClicks(0);
    // 대사 초기화 + idle 리셋
    setNText(""); setNEmo("idle");
    idleRef.current = 0; setIdleTimer(0);
  }, [activeEvent]);

  // ── 30초 비활동 auto-dismiss (엔딩 오버레이 열린 상태에서) ──
  // E16(수면), E20(암전)은 비활동으로 트리거되므로 auto-dismiss 제외
  useEffect(() => {
    if (!activeEvent || gs !== "room") return;
    if (activeEvent === 16 || activeEvent === 20) return;
    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => dismissEnding(), 30000);
    };
    resetTimer();
    document.addEventListener("click", resetTimer);
    document.addEventListener("mousemove", resetTimer);
    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", resetTimer);
      document.removeEventListener("mousemove", resetTimer);
    };
  }, [activeEvent, gs, dismissEnding]);

  const pressMainButton = useCallback(() => {
    if (activeEvent) { pressEventButton(); return; }
    resetIdle();
    say("누르지 말라고 했잖아~! ...아직 아무 일도 안 일어났지만.", "pouty");
  }, [activeEvent, pressEventButton, say, resetIdle]);

  // ── 배너 자동 사라짐 (20초) ──
  useEffect(() => {
    if (!bannerVisible) return;
    const t = setTimeout(() => setBannerVisible(false), 20000);
    return () => clearTimeout(t);
  }, [bannerVisible]);

  // ── 방치 감지 (E16) ──
  useEffect(() => {
    if (gs !== "room" || activeEvent) return;
    if (!isEndingActive(16)) return;
    const iv = setInterval(() => {
      idleRef.current += 1;
      setIdleTimer(idleRef.current);
      if (idleRef.current >= IDLE_LIMIT && !activeEvent) {
        triggerEnding(16);
      }
    }, 1000);
    return () => clearInterval(iv);
  }, [gs, activeEvent, isEndingActive]);

  // ── 탭 이탈 (E04) ──
  useEffect(() => {
    if (gs !== "room") return;
    const handler = () => {
      if (document.hidden) { setWasHidden(true); }
      else if (wasHidden && !activeEvent && isEndingActive(4)) {
        triggerEnding(4);
      }
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, [gs, wasHidden, activeEvent, isEndingActive]);

  // ── E21 크레딧 체크 ──
  useEffect(() => {
    if (gs === "title") {
      // E21(크레딧) 자체를 제외한 나머지 21개(1-20 + 22) 모두 수집 시 크레딧 해금
      const needed = [...Array.from({length:20},(_,i)=>i+1), 22];
      if (needed.every(id => collected.includes(id)) && !collected.includes(21)) {
        recordEnding(21);
        setGs("credits");
      }
    }
  }, [gs, collected]);

  // ── E22 마이크 감지 (항상 활성) ──
  useMicMonitor(gs === "room" && !activeEvent, useCallback(() => {
    if (!activeEvent) triggerEnding(22);
  }, [activeEvent]));

  // ── 방 진입 초기화 ──
  useEffect(() => {
    if (gs !== "room") return;
    setActiveEvent(null); setHoverCount(0); setTotalBgClicks(0); setDoorKnocks(0);
    setBannerVisible(false); setCatEars(false); setDoorOpen(false);
    setKillMode(false); setNaviSleeping(false); setCakeSelected(false);
    setCakeOnButton(false); setDarkMode(false); setNaviGone(false);
    setWasHidden(false); setContextMenu(null); idleRef.current = 0;
    setStageElapsed(0); setNaviScriptIdx(0);
    setCrtOff(false); setStageTransitioning(false);
    cleanupCRTMove(); setCrtTarget(null);
    setWalletVisible(false); setCakeVisible(false); setPhoneVisible(false);
    setSOSVisible(false); setTVVisible(false); setSafetyCoverVisible(false);

    // 초기화 오버레이들
    setShowE05(false); setShowE06(false); setShowE07(false); setShowE08(false);
    setShowE10(false); setShowE11(false); setShowE12(false); setShowE13(false);
    setShowE14(false); setShowE15(false); setShowE16(false); setShowE19(false);
    setShowE20(false); setShowE22(false);
  }, [gs]);

  // ── 이벤트 핸들러 ──
  const handleBgClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (!isEndingActive(7)) return; // S2에서만 배경 클릭 카운트
    setTotalBgClicks(prev => {
      const n = prev + 1;
      if (n === 20) say("야, 그만 눌러. 귀찮아.", "pouty");
      if (n === 30) { say("아 진짜!! 나까지 깨지잖아!! 책임져!!", "angry"); doShake(); }
      if (n === 40) say("그ㅡ만ㅡ하ㅡ", "shocked");
      if (n === 50) { say("아잇!! 이 미ㅡ친ㅡ", "shocked"); doShake(); }
      if (n === 58) say("야... 진지하게 말하는데 이러다 진짜ㅡ", "worried");
      if (n >= BG_CLICK_THRESHOLD) { triggerEnding(7); return 0; }
      return n;
    });
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding, say, doShake]);

  const handleButtonHover = useCallback((isEnter) => {
    if (activeEvent) return; resetIdle();
    if (!isEnter || !isEndingActive(3)) return;
    setHoverCount(prev => {
      const n = prev + 1;
      switch(n) {
        case 1: case 2: break;
        case 3: say("뭐야, 누르게?", "pouty"); break;
        case 4: say("누르지 말라니까.", "pouty"); break;
        case 5: say("누ㅡ르ㅡ지ㅡ마.", "pouty"); break;
        case 6: say("됐지? 이제 관뒀지?", "smug"); break;
        case 7: say("안 돼. 볼 수도 없어. 끝.", "smug"); break;
        case 8: say("이 위에 올라탔으니까 이제 절대 못 눌러.", "smug"); break;
        case 9: say("됐지? 없어. 사라졌어. 집에 가.", "smug"); break;
        case 10:
          say("...앗.", "shocked");
          setTimeout(() => triggerEnding(3), 1500);
          break;
      }
      return n;
    });
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding, say]);

  const handleDoorKnock = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (!isEndingActive(18)) return;
    setDoorKnocks(prev => {
      const n = prev + 1;
      switch(n) {
        case 3: say("...뭐야.", "idle"); break;
        case 5: say("거기 누구 있어?", "worried"); break;
        case 7: say("야... 저거 뭔데.", "worried"); break;
        case 8: say("...", "shocked"); break;
        case 9: say("...", "worried"); break;
      }
      if (n >= DOOR_KNOCK_THRESHOLD) {
        triggerEnding(18); return 0;
      }
      return n;
    });
  }, [activeEvent, resetIdle, say, isEndingActive, triggerEnding]);

  const handleNaviContextMenu = useCallback((e) => {
    e.preventDefault(); if (activeEvent) return; resetIdle();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, [activeEvent, resetIdle]);

  // 네이티브 우클릭 이벤트 — React onContextMenu가 안 먹힐 경우 대비
  useEffect(() => {
    const handler = (e) => {
      if (gs !== "room" || activeEvent) return;
      e.preventDefault();
      resetIdle();
      setContextMenu({ x: e.clientX, y: e.clientY });
    };
    document.addEventListener("contextmenu", handler);
    return () => document.removeEventListener("contextmenu", handler);
  }, [gs, activeEvent, resetIdle]);

  const handleClockClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (isEndingActive(2)) triggerEnding(2);
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding]);

  const handleSOSClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (isEndingActive(12)) triggerEnding(12);
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding]);

  const handleTVClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (isEndingActive(14)) triggerEnding(14);
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding]);

  const handleWalletClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (isEndingActive(6)) triggerEnding(6);
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding]);

  const handleCakeClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (isEndingActive(9)) {
      setCakeSelected(true);
      say("케이크를 집었어! 이제 버튼을 눌러봐~", "excited");
    }
  }, [activeEvent, resetIdle, isEndingActive, say]);

  const handlePhoneClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (isEndingActive(10)) triggerEnding(10);
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding]);

  const handleBannerClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    setBannerVisible(false);
    if (isEndingActive(5)) triggerEnding(5);
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding]);

  const handleSafetyCoverClick = useCallback(() => {
    if (activeEvent) return; resetIdle();
    if (isEndingActive(13)) triggerEnding(13);
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding]);

  const handleCatEarClick = useCallback((e) => {
    e.stopPropagation();
    if (activeEvent) return; resetIdle();
    if (isEndingActive(11)) triggerEnding(11);
  }, [activeEvent, resetIdle, isEndingActive, triggerEnding]);

  // ── 현재 엔딩 정보 ──
  const currentEnding = activeEvent ? ENDINGS[activeEvent] : null;
  const buttonLabel = currentEnding ? currentEnding.btn : "누르지 마";
  const buttonColor = currentEnding ? currentEnding.btnColor : "#e8573d";

  // ── 재시작 ──
  const restart = useCallback(() => {
    const pc = playCount + 1; setPlayCount(pc);
    localStorage.setItem("dpb_plays", String(pc));
    setEndingData(null); setActiveEvent(null);
    setCurrentStage(1); setStageElapsed(0);
    setGs("title");
  }, [playCount]);

  // ════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════
  return (
    <div onClick={gs === "room" && !activeEvent ? handleBgClick : undefined}
      onContextMenu={gs === "room" ? handleNaviContextMenu : undefined}
      onMouseDown={gs === "room" ? resetIdle : undefined}
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
        @keyframes slideDown{from{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}
        @keyframes crtScan{0%{top:-20%}100%{top:120%}}
        @keyframes crtFlicker{0%,100%{opacity:0.02}50%{opacity:0.05}}
        @keyframes crtOffLine{0%{height:2px;opacity:1}100%{height:0px;opacity:0}}
        @keyframes crtPowerOn{0%{opacity:0;transform:scale(0.8,0.01)}50%{opacity:1;transform:scale(1,0.01)}100%{opacity:1;transform:scale(1,1)}}
        .cursor-blink{animation:pulse 0.6s step-end infinite;opacity:0.5}
        *{box-sizing:border-box;margin:0;padding:0;user-select:none;}
      `}</style>

      {/* ═══════════ TITLE ═══════════ */}
      {gs === "title" && (
        <TitleScreen
          onStart={() => setGs("room")}
          collected={collected}
          frame={frame}
        />
      )}

      {/* ═══════════ ROOM ═══════════ */}
      {gs === "room" && (
        <GameRoom
          onDoorKnock={handleDoorKnock}
          onClockClick={handleClockClick}
          onSOSClick={handleSOSClick}
          onTVClick={handleTVClick}
          onWalletClick={handleWalletClick}
          onCakeClick={handleCakeClick}
          onPhoneClick={handlePhoneClick}
          onBannerClick={handleBannerClick}
          onSafetyCoverClick={handleSafetyCoverClick}
          doorKnocks={doorKnocks}
          doorOpen={doorOpen}
          bannerVisible={bannerVisible}
          walletVisible={walletVisible}
          cakeVisible={cakeVisible}
          phoneVisible={phoneVisible}
          sosVisible={sosVisible}
          tvVisible={tvVisible}
          safetyCoverVisible={safetyCoverVisible}
          cakeSelected={cakeSelected}
          activeEvent={activeEvent}
          isEndingActive={isEndingActive}
          frame={frame}
          doorInteractive={isEndingActive(18)}
          clockInteractive={isEndingActive(2)}
          walletInteractive={isEndingActive(6)}
          cakeInteractive={isEndingActive(9)}
          phoneInteractive={isEndingActive(10)}
          sosInteractive={isEndingActive(12)}
          tvInteractive={isEndingActive(14)}
          safetyCoverInteractive={isEndingActive(13)}
          bannerInteractive={isEndingActive(5)}
        >
          {/* CRT 모니터 + 나비 */}
          <CRTMonitor
            nEmo={nEmo} frame={frame}
            naviSleeping={naviSleeping} catEars={catEars} naviGone={naviGone}
            nText={nText} nKey={nKey}
            onContextMenu={handleNaviContextMenu}
            onCatEarClick={isEndingActive(11) ? handleCatEarClick : null}
            crtOff={crtOff}
            crtTarget={crtTarget}
          />

          {/* 메인 버튼 — E03 호버 시각 변화 반영 */}
          {(() => {
            const frogPre = isEndingActive(3) && hoverCount >= 7 && hoverCount < 10 && !activeEvent;
            const frogHuge = activeEvent === 3;
            const frogLabel = (isEndingActive(3) && hoverCount >= 6 && !activeEvent) ? "누르지 마" : buttonLabel;
            return (
              <div style={{ position:"absolute",left:"50%",bottom:"39%",transform:`translateX(-50%) scale(${frogHuge?2.5:1})`,
                zIndex:50,transition:"transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                opacity:frogPre?0:1,pointerEvents:frogPre?"none":"auto" }}>
                <NuclearButton
                  label={frogLabel} accent={buttonColor}
                  onPress={cakeSelected
                    ? () => { setCakeSelected(false); setCakeOnButton(true); triggerEnding(9); }
                    : pressMainButton}
                  onHover={handleButtonHover}
                  onDrag={!activeEvent && !cakeSelected ? () => {
                    if (!activeEvent && isEndingActive(8)) triggerEnding(8);
                  } : undefined}
                  disabled={activeEvent === 20}
                  cakeMode={cakeOnButton}
                  cakeSelect={cakeSelected}
                />
              </div>
            );
          })()}

          {/* UI 컨트롤 */}
          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setSettingsOpen(true); }}
            style={{ position:"absolute",top:14,left:16,zIndex:100,width:42,height:42,borderRadius:12,
              background:"rgba(255,255,255,0.92)",backdropFilter:"blur(10px)",
              border:"1.5px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",
              fontSize:19,boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }} hoverGlow="#aaa">
            ⚙️
          </RoomObj>

          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setCollectionOpen(true); }}
            style={{ position:"absolute",top:14,left:66,zIndex:100,height:42,borderRadius:12,
              padding:"0 16px",
              background:"rgba(255,255,255,0.92)",backdropFilter:"blur(10px)",
              border:"1.5px solid rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",
              gap:6,fontSize:14,fontWeight:800,color:"#a33de8",
              boxShadow:"0 4px 16px rgba(0,0,0,0.06)" }}
            hoverGlow="#a33de8">
            <span style={{ fontSize:11,color:"#ccc" }}>🏆</span>
            {collected.length}/{TOTAL_ENDINGS}
          </RoomObj>

          <RoomObj onClick={(e) => { e.stopPropagation(); resetIdle(); setProfileOpen(!profileOpen); }}
            style={{ position:"absolute",top:14,right:16,zIndex:100,width:42,height:42,borderRadius:"50%",
              background:"linear-gradient(135deg,#e8d8f8,#d4c0f0)",border:"2.5px solid #c4b0e0",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
              boxShadow:"0 4px 16px rgba(0,0,0,0.08)" }} hoverGlow="#a33de8">
            👤
          </RoomObj>

          {/* 방치 경고 */}
          {idleTimer > 40 && idleTimer < IDLE_LIMIT && !activeEvent && (
            <div style={{ position:"absolute",bottom:48,left:"50%",transform:"translateX(-50%)",
              fontSize:12,color:"#b0a09055",animation:"pulse 2.5s ease infinite",letterSpacing:3 }}>
              (조용하다...)
            </div>
          )}

          {/* 수집 도트 */}
          <div style={{ position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)",
            display:"flex",gap:4,zIndex:40 }}>
            {Array.from({length:TOTAL_ENDINGS},(_,i)=>i+1).map(id => (
              <div key={id} style={{ width:6,height:6,borderRadius:"50%",
                background:collected.includes(id)?"#a33de8":"#d8d0c822",
                boxShadow:collected.includes(id)?"0 0 8px #a33de855":"none",
                transition:"all 0.4s" }}/>
            ))}
          </div>

          {/* ═══ 엔딩 오버레이 컴포넌트 ═══ */}
          <E01Rude active={activeEvent===1} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doShake={doShake}/>
          <E02Marshmallow active={activeEvent===2} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doShake={doShake} frame={frame}/>
          <E03Frog active={activeEvent===3} hoverCount={hoverCount} onComplete={pressEventButton} onDismiss={dismissEnding} say={say}/>
          <E04Surprise active={activeEvent===4} onComplete={pressEventButton} onDismiss={dismissEnding} say={say}/>
          <E05Scam active={showE05} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doShake={doShake}/>
          <E06Shopping active={showE06} onComplete={pressEventButton} onDismiss={dismissEnding} say={say}/>
          <E07Bluescreen active={showE07} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doShake={doShake} totalBgClicks={totalBgClicks}/>
          <E08Chase active={showE08} onComplete={() => { setShowE08(false); pressEventButton(); }} onDismiss={dismissEnding} say={say}/>
          <E09Food active={activeEvent===9} onComplete={pressEventButton} onDismiss={dismissEnding} say={say}/>
          <E10Stock active={showE10} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} frame={frame}/>
          <E11Otaku active={showE11} onComplete={pressEventButton} onDismiss={dismissEnding} say={say}/>
          <E12Police active={showE12} onComplete={pressEventButton} onDismiss={dismissEnding} say={say}/>
          <E13Coward active={showE13} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doShake={doShake}/>
          <E14News active={showE14} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doShake={doShake}/>
          <E15Psycho active={showE15} onComplete={pressEventButton} onDismiss={dismissEnding} say={say}/>
          <E16Sleep active={showE16} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doShake={doShake}/>
          <E17Loop active={activeEvent===17} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} playCount={playCount}/>
          <E18Door active={activeEvent===18} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doorOpen={doorOpen}/>
          <E19Transfer active={showE19} onComplete={pressEventButton} onDismiss={dismissEnding} say={say}/>
          <E20Blackout active={showE20} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} naviGone={naviGone}/>
          <E22Noise active={showE22} onComplete={pressEventButton} onDismiss={dismissEnding} say={say} doShake={doShake}/>

          {/* 패널 */}
          <SettingsPanel open={settingsOpen} onClose={()=>setSettingsOpen(false)}
            onKillMode={() => {
              if (!activeEvent && isEndingActive(15)) {
                setKillMode(true); setSettingsOpen(false); triggerEnding(15);
              }
            }}
            onReset={() => {
              if (!activeEvent && isEndingActive(17)) {
                setSettingsOpen(false); triggerEnding(17);
              }
            }} killModeOn={killMode}
            killModeEnabled={isEndingActive(15)}
            resetEnabled={isEndingActive(17)}/>
          <ProfileMenu open={profileOpen} onClose={()=>setProfileOpen(false)}
            onTransfer={() => {
              if (!activeEvent && isEndingActive(19)) {
                setProfileOpen(false); triggerEnding(19);
              }
            }}
            transferEnabled={isEndingActive(19)}/>
          <CollectionPanel open={collectionOpen} onClose={()=>setCollectionOpen(false)} collected={collected}/>

          {/* 우클릭 메뉴 */}
          {contextMenu && <>
            <div onClick={()=>setContextMenu(null)} style={{ position:"fixed",inset:0,zIndex:850 }}/>
            <ContextMenu x={contextMenu.x} y={contextMenu.y}
              say={say}
              onDelete={() => { setContextMenu(null); triggerEnding(1); }}
              onClose={()=>setContextMenu(null)}/>
          </>}

          {/* 스캔라인 */}
          <div style={{ position:"absolute",inset:0,pointerEvents:"none",zIndex:3,overflow:"hidden" }}>
            <div style={{ position:"absolute",left:0,width:"100%",height:"1px",
              background:"rgba(0,0,0,0.012)",animation:"scanline 8s linear infinite" }}/>
          </div>
        </GameRoom>
      )}

      {/* ═══════════ ENDING ═══════════ */}
      {gs === "ending" && endingData && (
        <EndingScreen
          endingData={endingData}
          activeEvent={activeEvent}
          collected={collected}
          frame={frame}
          onRetry={restart}
        />
      )}

      {/* ═══════════ CREDITS ═══════════ */}
      {gs === "credits" && <CreditsScreen onBack={restart}/>}
    </div>
  );
}
