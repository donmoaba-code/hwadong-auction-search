/**
 * 화동옥션 검색용 한글 ↔ 한자 변환
 * - 최장일치 사전 치환
 * - 숫자+원 → 數字+圓
 * - 짧은 한 글자는 경매 제목에서 자주 쓰는 뜻을 우선
 */
(function (global) {
  "use strict";

  // 한글 → 한자 (실행 시 길이순 정렬)
  const HANGUL_TO_HANJA = {
    // 기관
    구한국은행: "舊 韓國銀行",
    "구 한국은행": "舊 韓國銀行",
    대한제국: "大韓帝國",
    조선총독부: "朝鮮總督府",
    조선은행: "朝鮮銀行",
    한국은행: "韓國銀行",
    제일은행: "第一銀行",
    식산은행: "殖産銀行",
    일본은행: "日本銀行",

    // 통화·보패
    상평통보: "常平通寶",
    해동통보: "海東通寶",
    동국통보: "東國通寶",
    삼한통보: "三韓通寶",
    해동중보: "海東重寶",
    동국중보: "東國重寶",
    삼한중보: "三韓重寶",
    조선통보: "朝鮮通寶",
    백동화: "白銅貨",
    적동화: "赤銅貨",
    황동화: "黃銅貨",
    시주화: "試鑄貨",
    당백전: "當百錢",
    당오전: "當五錢",
    유번호: "有番號",
    무번호: "無番號",
    연결권: "連結券",
    절단권: "切斷券",
    독립문: "獨立門",
    십이지: "十二支",
    미사용: "未使用",
    박물관: "博物館",

    // 재료·형태
    백동: "白銅",
    적동: "赤銅",
    황동: "黃銅",
    별전: "別錢",
    패전: "牌錢",
    엽전: "葉錢",
    동전: "銅錢",
    주화: "鑄貨",
    지폐: "紙幣",
    은화: "銀貨",
    금화: "金貨",
    동화: "銅貨",
    철화: "鐵貨",
    금권: "金券",
    견양: "見樣",
    견본: "見本",
    시쇄: "試刷",
    압인: "壓印",
    원형: "圓形",
    원공: "圓孔",
    원곽: "圓郭",
    자석: "磁石",
    극미: "極美",
    진품: "眞品",
    가품: "假品",
    낙찰: "落札",
    경매: "競賣",
    가격: "價格",
    증서: "證書",
    발행: "發行",
    주조: "鑄造",
    제조: "製造",
    기념: "紀念",
    증정: "贈呈",
    보통: "普通",
    오목: "凹",
    볼록: "凸",

    // 금액·어음 (복합어를 단글자보다 먼저 매칭되도록 등록)
    지급어음: "支給於音",
    약속어음: "約束於音",
    소액권: "小額券",
    대액권: "大額券",
    액면가: "額面價",
    소액: "小額",
    대액: "大額",
    금액: "金額",
    액면: "額面",
    지급: "支給",
    어음: "於音",
    액: "額",

    // 금액 결합
    오백원: "五百圓",
    아홉백: "九百",
    구백: "九百",
    오백: "五百",
    일백: "一百",
    오십: "五十",
    천원: "千圓",
    십원: "十圓",
    백원: "百圓",
    오원: "五圓",
    일원: "一圓",
    이원: "二圓",
    삼원: "三圓",
    사원: "四圓",
    육원: "六圓",
    칠원: "七圓",
    팔원: "八圓",
    구원: "九圓",
    오전: "五錢",
    십전: "十錢",
    일전: "一錢",
    이전: "二錢",
    삼전: "三錢",
    사전: "四錢",
    팔분: "八分",
    육분: "六分",
    오분: "五分",
    사분: "四分",
    삼분: "三分",
    이분: "二分",
    일분: "一分",

    // 연호
    광서: "光緒",
    명치: "明治",
    대정: "大正",
    소화: "昭和",
    평성: "平成",
    영화: "令和",
    건양: "建陽",
    광무: "光武",
    융희: "隆熙",
    고종: "高宗",
    순종: "純宗",

    // 지역·조폐
    대동: "大東",
    호남: "湖南",
    영남: "嶺南",
    관서: "關西",
    관북: "關北",
    해동: "海東",
    동국: "東國",
    삼한: "三韓",
    총독: "總督",
    내각: "內閣",
    인쇄: "印刷",
    은행: "銀行",
    조선: "朝鮮",
    한국: "韓國",
    중국: "中國",
    제일: "第一",
    일본: "日本",
    식산: "殖産",

    // 십간
    갑: "甲",
    을: "乙",
    병: "丙",
    정: "丁",
    무: "戊",
    기: "己",
    경: "庚",
    임: "壬",
    계: "癸",

    // 십이지 (신·오는 新/五와 충돌 → 미등록)
    자: "子",
    축: "丑",
    인: "寅",
    묘: "卯",
    진: "辰",
    사: "巳",
    미: "美",
    유: "有",
    술: "戌",
    해: "亥",

    // 팔괘·방위
    건: "乾",
    곤: "坤",
    태: "兌",
    리: "離",
    손: "巽",
    감: "坎",
    간: "艮",
    동: "東",
    서: "西",
    남: "南",
    북: "北",

    // 위치·속성
    상: "上",
    중: "中",
    하: "下",
    좌: "左",
    우: "右",
    후: "厚",
    내: "內",
    외: "外",
    대: "大",
    소: "小",
    장: "長",
    단: "單",
    박: "薄",
    신: "新",
    구: "舊",
    부: "副",
    본: "本",
    말: "末",
    고: "高",
    저: "低",
    다: "多",
    강: "强",
    약: "弱",
    광: "廣",
    협: "狹",
    방: "方",
    각: "角",
    평: "平",
    쌍: "雙",

    // 수·단위
    일: "一",
    이: "二",
    삼: "三",
    사: "四",
    오: "五",
    육: "六",
    칠: "七",
    팔: "八",
    아홉: "九",
    십: "十",
    백: "百",
    천: "千",
    만: "萬",
    억: "億",
    조: "兆",
    원: "圓",
    환: "圜",
    전: "錢",
    푼: "分",
    리: "厘",
    문: "文",
    냥: "兩",
    관: "貫",
    매: "枚",
    점: "點",
    개: "改",
    배: "背",
    수: "壽",
    복: "福",
  };

  // 한 단어 → 여러 한자 후보
  const HANGUL_MULTI = {
    금권: ["金券", "金券"],
    십원: ["十圓", "10圓"],
    백원: ["百圓", "100圓"],
    오원: ["五圓", "5圓"],
    일원: ["一圓", "1圓"],
    오백원: ["五百圓", "500圓"],
    천원: ["千圓", "1000圓"],
    개: ["改", "個"],
    신: ["新", "辛", "申"],
    무: ["戊", "無"],
    정: ["丁", "正"],
    전: ["錢", "前"],
    미: ["美", "未"],
    단: ["單", "短"],
    후: ["厚", "後"],
    유: ["有", "酉"],
    견양: ["見樣", "見本"],
    환: ["圜", "換"],
    구: ["舊", "九"],
  };

  const HANJA_TO_HANGUL = {};
  Object.keys(HANGUL_TO_HANJA).forEach((ko) => {
    const hj = HANGUL_TO_HANJA[ko];
    if (!HANJA_TO_HANGUL[hj] || ko.length > HANJA_TO_HANGUL[hj].length) {
      HANJA_TO_HANGUL[hj] = ko;
    }
  });
  Object.assign(HANJA_TO_HANGUL, {
    金券: "금권",
    "10圓": "십원",
    "100圓": "백원",
    "5圓": "오원",
    "1圓": "일원",
    "500圓": "오백원",
    "1000圓": "천원",
    個: "개",
    無: "무",
    正: "정",
    前: "전",
    短: "단",
    後: "후",
    辛: "신",
    申: "신",
    未: "미",
    酉: "유",
    九: "구",
    午: "오",
  });

  const HAS_HANGUL = /[가-힣]/;
  const HAS_HANJA = /[\u3400-\u9FFF]/;

  function sortedKeys(dict) {
    return Object.keys(dict).sort((a, b) => b.length - a.length);
  }

  function replaceByDict(text, dict) {
    const keys = sortedKeys(dict);
    let i = 0;
    let out = "";
    let changed = false;
    while (i < text.length) {
      let hit = null;
      for (let k = 0; k < keys.length; k++) {
        const key = keys[k];
        if (text.startsWith(key, i)) {
          hit = key;
          break;
        }
      }
      if (hit) {
        out += dict[hit];
        i += hit.length;
        changed = true;
      } else {
        out += text[i];
        i += 1;
      }
    }
    return { text: out, changed };
  }

  function convertNumberWon(text) {
    const next = text.replace(/(\d+)\s*원/g, "$1圓");
    return { text: next, changed: next !== text };
  }

  function convertNumberWonReverse(text) {
    const next = text.replace(/(\d+)\s*圓/g, "$1원");
    return { text: next, changed: next !== text };
  }

  function addUnique(list, value) {
    const v = String(value || "").trim();
    if (!v) return;
    if (!list.includes(v)) list.push(v);
  }

  function expandSearchKeywords(input) {
    const raw = String(input || "").trim();
    if (!raw) return [];

    const out = [];
    addUnique(out, raw);

    if (HAS_HANGUL.test(raw)) {
      const a = replaceByDict(raw, HANGUL_TO_HANJA);
      if (a.changed) addUnique(out, a.text);

      const b = convertNumberWon(raw);
      if (b.changed) addUnique(out, b.text);

      const c = convertNumberWon(a.text);
      if (c.changed) addUnique(out, c.text);

      Object.keys(HANGUL_MULTI).forEach((ko) => {
        if (!raw.includes(ko)) return;
        // 한 글자 동의어는 검색어 전체가 그 글자일 때만 적용
        if (ko.length === 1 && raw !== ko) return;
        // 원문 전체가 사전 단어면 해당 단어 멀티만 적용 (부분 치환 노이즈 방지)
        if (HANGUL_TO_HANJA[raw] && ko !== raw) return;
        HANGUL_MULTI[ko].forEach((hj) => {
          addUnique(out, raw.split(ko).join(hj));
        });
      });
    }

    if (HAS_HANJA.test(raw)) {
      const a = replaceByDict(raw, HANJA_TO_HANGUL);
      if (a.changed) addUnique(out, a.text);

      const b = convertNumberWonReverse(raw);
      if (b.changed) addUnique(out, b.text);

      const c = convertNumberWonReverse(a.text);
      if (c.changed) addUnique(out, c.text);
    }

    return out;
  }

  function getConvertedKeywords(input) {
    const raw = String(input || "").trim();
    return expandSearchKeywords(raw).filter((k) => k !== raw);
  }

  global.HwadongHanja = {
    expandSearchKeywords,
    getConvertedKeywords,
    hasHangul: (s) => HAS_HANGUL.test(s || ""),
    hasHanja: (s) => HAS_HANJA.test(s || ""),
  };
})(typeof window !== "undefined" ? window : globalThis);
