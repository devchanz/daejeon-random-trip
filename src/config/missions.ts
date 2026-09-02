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
  '오늘 만난 사람에게 대전 자랑 한마디 해보기',
  '이 코스에서 제일 마음에 든 순간 사진 한 장 남기기',
  '평소라면 안 시켰을 메뉴 하나 도전해보기',
  '마지막 스팟에서 소원 하나 빌어보기',
  '오늘 코스 중 다음에 또 오고 싶은 곳 하나 정해보기',
];
