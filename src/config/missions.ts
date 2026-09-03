/**
 * Bonus Quest mission pool (Result Quest redesign).
 *
 * Intentionally minimal: a small flat pool of playful, generic strings selected by
 * the Controlled Random engine through the same injected `random` source already
 * used for zone/template/candidate selection (seedable/testable, ADR-002). This is
 * NOT a new recommendation axis -- no preference/duration/category keying -- and
 * carries no operational or place-detail data (hours, break time, last order,
 * parking, waiting stay in PlaceCandidate.description / RouteStop.tips, Route Guide
 * only). No DB/API persistence. `RouteResult.mission` remains the sole rendering
 * contract: BonusQuest renders it, or nothing.
 */
export const BONUS_QUEST_MISSIONS: readonly string[] = [
  '마지막 스팟에서 소원 하나 빌기',
  '오늘의 최애 장소 사진 남기기',
  '처음 보는 골목 5분 걷기',
  '오늘의 최애 메뉴 하나 정하기',
  '평소 안 먹던 메뉴 주문해보기',
  '처음 먹는 음식 하나 도전하기',
  '오늘 가장 예쁜 간판 찾아보기',
  '마음에 든 풍경 10초 바라보기',
  '하늘 사진 한 장 찍기',
  '오늘의 여행 색 하나 정하기',
  '귀여운 것 하나 찾아 사진 찍기',
  '오늘의 순간 한 줄 메모하기',
  '작은 행운 하나 기록하기',
  '소소한 기념품 하나 사기',
  '대전다운 것 하나 찾아보기',
  '처음 본 가게 한 곳 들어가보기',
  '오늘의 여행 BGM 한 곡 고르기',
  '휴대폰 없이 5분 보내기',
  '풍경만 1분 바라보기',
  '오늘 가장 좋았던 냄새 기억하기',
  '다시 오고 싶은 곳 하나 고르기',
  '오늘의 여행 제목 지어보기',
  '웃긴 순간 하나 기억해두기',
  '나만의 포토스팟 하나 발견하기',
  '마음에 든 문구 사진 찍기',
  '사진 3장 이하만 찍기',
  '골목 하나 랜덤으로 걸어보기',
  '오늘 가장 예쁜 건물 고르기',
  '메뉴를 직감으로 골라보기',
  '처음 보는 디저트 먹어보기',
  '평소 안 찍던 구도로 찍어보기',
  '여행지에서 셀카 한 장 남기기',
  '오늘의 베스트컷 하나 뽑기',
  '오늘 하루를 한 단어로 표현하기',
];
