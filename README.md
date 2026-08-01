# 화동경매 검색툴

실제 화동 상품명 목록과 한자 변환으로 최적 검색어를 고른 뒤, 화동옥션/화동양행 원본 검색을 새 창으로 엽니다.

## 사용

https://donmoaba-code.github.io/hwadong-auction-search/

1. 검색 대상(화동옥션 / 화동양행) 선택
2. 검색어 입력 (상품명 자동완성 지원)
3. **검색 (원본 새 창)** 클릭

목록에 더 많이 나오는 표기(예: `支給於音`, `1,000환`, `小額`)를 우선합니다.

## 구성

| 파일 | 설명 |
|------|------|
| `index.html` | 검색 UI (V26.08.02) |
| `hanja_convert.js` | 한글↔한자·금액 표기 변환 |
| `titles.json` | 중복 제거 상품명 목록 |
| `build_titles.py` | `Search_title.xlsx` → `titles.json` 변환 |

## 목록 갱신

```bash
python build_titles.py --xlsx "경로/Search_title.xlsx" --out titles.json
```
