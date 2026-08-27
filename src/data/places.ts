import type { PlaceCandidate } from '../lib/random/types';

/**
 * Provisional Daejeon Place Candidates Dataset (163 records).
 *
 * CAUTION:
 * - This is a development provisional dataset (datasetStatus=provisional, decision=REVIEW).
 * - Final tourism verification is pending; operational hours and place details are provisional.
 * - Data values may be replaced or refined in future updates without changing the recommendation engine contract.
 */
export const PLACE_CANDIDATES = [
  {
    "id": "place-001",
    "name": "홀스타코 소제",
    "category": "식사",
    "zoneId": "soje",
    "durationMin": 50,
    "tags": [
      "food",
      "멕시칸"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/홀스타코"
    },
    "mapUrl": "https://map.naver.com/p/search/홀스타코",
    "description": "월요일 정기휴무 / 11:30~20:00 운영 / 매장이 작은 편이라 피크타임 만석 가능 / 전용주차 없음",
    "active": true
  },
  {
    "id": "place-002",
    "name": "비범",
    "category": "식사",
    "zoneId": "soje",
    "durationMin": 75,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/비범%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/비범%20대전",
    "description": "11:30~21:00 / 15:00~17:00 브레이크타임 / 14:00·20:00 라스트오더 / 주말 웨이팅 가능 / 전용주차 없음",
    "active": true
  },
  {
    "id": "place-003",
    "name": "온천집",
    "category": "식사",
    "zoneId": "soje",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "일식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/온천집%20소제동"
    },
    "mapUrl": "https://map.naver.com/p/search/온천집%20소제동",
    "description": "11:30~21:00 / 15:00~17:00 브레이크타임 / 14:00·20:00 라스트오더 / 인기 시간대 대기 가능 / 전용주차 없음",
    "active": true
  },
  {
    "id": "place-004",
    "name": "미도리카레",
    "category": "식사",
    "zoneId": "soje",
    "durationMin": 50,
    "tags": [
      "food",
      "walk",
      "카레"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/미도리카레"
    },
    "mapUrl": "https://map.naver.com/p/search/미도리카레",
    "description": "11:30 오픈 / 14:30~17:00 브레이크타임 / 플랫폼별 마감시간 표기가 달라 저녁 방문 전 당일 확인 권장",
    "active": true
  },
  {
    "id": "place-005",
    "name": "치앙마이방콕",
    "category": "식사",
    "zoneId": "soje",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "동남아"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/치앙마이방콕"
    },
    "mapUrl": "https://map.naver.com/p/search/치앙마이방콕",
    "description": "11:30~21:00 / 15:00~17:00 브레이크타임 / 재료 소진 및 웨이팅에 따라 주문 마감이 빨라질 수 있음",
    "active": true
  },
  {
    "id": "place-006",
    "name": "챔프스페이스 커피 로스터스",
    "category": "카페·디저트",
    "zoneId": "soje",
    "durationMin": 75,
    "tags": [
      "food",
      "스페셜티커피"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/챔프스페이스%20커피로스터스"
    },
    "mapUrl": "https://map.naver.com/p/search/챔프스페이스%20커피로스터스",
    "description": "11:00~21:00 / 주말 피크타임 혼잡 가능 / 별도 주차공간이 넉넉하지 않아 도보 방문 추천",
    "active": true
  },
  {
    "id": "place-007",
    "name": "풍류소제",
    "category": "카페·디저트",
    "zoneId": "soje",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "공간형카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/풍류소제"
    },
    "mapUrl": "https://map.naver.com/p/search/풍류소제",
    "description": "최근 요일별 영업시간 변동이 있어 방문 당일 지도에서 운영시간 확인 권장",
    "active": true
  },
  {
    "id": "place-008",
    "name": "소제루셀로",
    "category": "카페·디저트",
    "zoneId": "soje",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/소제루셀로"
    },
    "mapUrl": "https://map.naver.com/p/search/소제루셀로",
    "description": "플랫폼마다 마감시간 표기가 달라 늦은 시간 방문 시 당일 영업시간 확인 권장",
    "active": true
  },
  {
    "id": "place-009",
    "name": "여기소제",
    "category": "볼거리·문화·체험",
    "zoneId": "soje",
    "durationMin": 50,
    "tags": [
      "photo",
      "굿즈·관광안내"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/여기소제"
    },
    "mapUrl": "https://map.naver.com/p/search/여기소제",
    "description": "11:30~22:00 / 21:20 라스트오더 기준으로 안내됨 / 굿즈만 짧게 구경하는 것도 가능",
    "active": true
  },
  {
    "id": "place-010",
    "name": "소제예찬1927",
    "category": "볼거리·문화·체험",
    "zoneId": "soje",
    "durationMin": 75,
    "tags": [
      "photo",
      "역사·문화"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/소제예찬1927"
    },
    "mapUrl": "https://map.naver.com/p/search/소제예찬1927",
    "description": "운영일이 제한적인 편이며 최근 금~일 중심으로 운영되는 정보가 확인되어 방문 당일 영업 여부 확인 필수",
    "active": true
  },
  {
    "id": "place-011",
    "name": "소제동 철도관사촌 골목",
    "category": "볼거리·문화·체험",
    "zoneId": "soje",
    "durationMin": 45,
    "tags": [
      "walk",
      "역사·문화"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/소제동%20철도관사촌"
    },
    "mapUrl": "https://map.naver.com/p/search/소제동%20철도관사촌",
    "description": "실제 주거공간과 상업공간이 섞여 있으므로 사유지 출입은 피하고 골목 중심으로 관람 추천",
    "active": true
  },
  {
    "id": "place-012",
    "name": "대동천 소제동 구간",
    "category": "산책·야간",
    "zoneId": "soje",
    "durationMin": 30,
    "tags": [
      "walk",
      "photo",
      "하천·수변"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/대동천%20소제동"
    },
    "mapUrl": "https://map.naver.com/p/search/대동천%20소제동",
    "description": "별도 입장시간 없음 / 비나 눈이 많이 온 직후에는 하천변 상태 확인 후 이용 추천",
    "active": true
  },
  {
    "id": "place-013",
    "name": "대전전통나래관",
    "category": "볼거리·문화·체험",
    "zoneId": "soje",
    "durationMin": 50,
    "tags": [
      "photo",
      "액티비티"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%A0%84%ED%86%B5%EB%82%98%EB%9E%98%EA%B4%80"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%A0%84%ED%86%B5%EB%82%98%EB%9E%98%EA%B4%80",
    "description": "화~일 10:00~17:00 / 매주 월요일 휴관 / 입장료 무료 / 체험·교육 프로그램은 일정 및 사전신청 여부 확인 필요",
    "active": true
  },
  {
    "id": "place-014",
    "name": "소제중앙문화공원",
    "category": "산책·야간",
    "zoneId": "soje",
    "durationMin": 45,
    "tags": [
      "walk",
      "공원·녹지"
    ],
    "roles": [
      "anchor",
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%86%8C%EC%A0%9C%EC%A4%91%EC%95%99%EB%AC%B8%ED%99%94%EA%B3%B5%EC%9B%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%86%8C%EC%A0%9C%EC%A4%91%EC%95%99%EB%AC%B8%ED%99%94%EA%B3%B5%EC%9B%90",
    "description": "2026년 4월 신규 준공 / 별도 입장료 없음 / 향후 이종수도예관이 들어설 예정이나 현재는 미개관",
    "active": true
  },
  {
    "id": "place-015",
    "name": "송자고택",
    "category": "볼거리·문화·체험",
    "zoneId": "soje",
    "durationMin": 20,
    "tags": [
      "photo",
      "미술·전시"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%86%A1%EC%9E%90%EA%B3%A0%ED%83%9D%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%86%A1%EC%9E%90%EA%B3%A0%ED%83%9D%20%EB%8C%80%EC%A0%84",
    "description": "문화유산 관람 포인트로 보는 것을 추천 / 내부 상시 체험·관람 프로그램 여부는 방문 전 확인 필요",
    "active": true
  },
  {
    "id": "place-016",
    "name": "ARTSITE SOJE 아트사이트 소제",
    "category": "볼거리·문화·체험",
    "zoneId": "soje",
    "durationMin": 50,
    "tags": [
      "walk",
      "photo",
      "미술·전시"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%95%84%ED%8A%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EC%86%8C%EC%A0%9C"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%95%84%ED%8A%B8%EC%82%AC%EC%9D%B4%ED%8A%B8%20%EC%86%8C%EC%A0%9C",
    "description": "기획전·팝업 형태로 운영되는 콘텐츠가 있어 방문 당일 전시 및 운영 일정 확인 권장",
    "active": true
  },
  {
    "id": "place-017",
    "name": "가림소담",
    "category": "식사",
    "zoneId": "mannyeon",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B0%80%EB%A6%BC%EC%86%8C%EB%8B%B4%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B0%80%EB%A6%BC%EC%86%8C%EB%8B%B4%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "11:00~21:00 / 브레이크타임 15:00~17:00 중심 / 라스트오더 20:20 / 주말은 브레이크타임이 달라질 수 있어 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-018",
    "name": "BESPOKE",
    "category": "식사",
    "zoneId": "mannyeon",
    "durationMin": 105,
    "tags": [
      "food",
      "photo",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/BESPOKE%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/BESPOKE%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "월요일 휴무로 안내 / 화~토 11:30~23:00, 일요일은 비교적 일찍 마감하는 편 / 코스 이용 시 예약 추천",
    "active": true
  },
  {
    "id": "place-019",
    "name": "만보우노",
    "category": "식사",
    "zoneId": "mannyeon",
    "durationMin": 75,
    "tags": [
      "food",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%A7%8C%EB%B3%B4%EC%9A%B0%EB%85%B8%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%A7%8C%EB%B3%B4%EC%9A%B0%EB%85%B8%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "11:30~22:00 / 브레이크타임 14:30~17:30 / 일요일 휴무 안내가 확인됨 / 인기 시간에는 예약 추천",
    "active": true
  },
  {
    "id": "place-020",
    "name": "마천취",
    "category": "식사",
    "zoneId": "mannyeon",
    "durationMin": 55,
    "tags": [
      "food",
      "중식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%A7%88%EC%B2%9C%EC%B7%A8%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%A7%88%EC%B2%9C%EC%B7%A8%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "지도 기준 11:00~21:00 운영 / 영업시간 변동 가능성이 있어 늦은 저녁 방문 전 확인 추천",
    "active": true
  },
  {
    "id": "place-021",
    "name": "정일품 두손두부",
    "category": "식사",
    "zoneId": "mannyeon",
    "durationMin": 60,
    "tags": [
      "food",
      "한식·로컬식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%A0%95%EC%9D%BC%ED%92%88%20%EB%91%90%EC%86%90%EB%91%90%EB%B6%80%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%A0%95%EC%9D%BC%ED%92%88%20%EB%91%90%EC%86%90%EB%91%90%EB%B6%80%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "지도 기준 매일 11:00~21:00 / 점심시간에는 인근 직장인 수요로 혼잡할 수 있음",
    "active": true
  },
  {
    "id": "place-022",
    "name": "Caffe T",
    "category": "카페·디저트",
    "zoneId": "mannyeon",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/Caffe%20T%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/Caffe%20T%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "지도 기준 매일 10:00~22:00 / 식사 시간 이후에는 주변 식당 이용객이 함께 몰릴 수 있음",
    "active": true
  },
  {
    "id": "place-023",
    "name": "카페350",
    "category": "카페·디저트",
    "zoneId": "mannyeon",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%B9%B4%ED%8E%98350%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%B9%B4%ED%8E%98350%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "평일 10:00~22:00 중심 / 토·일 운영시간이 평일과 다르므로 주말 방문 시 확인 추천",
    "active": true
  },
  {
    "id": "place-024",
    "name": "카페1896",
    "category": "카페·디저트",
    "zoneId": "mannyeon",
    "durationMin": 75,
    "tags": [
      "food",
      "walk",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%B9%B4%ED%8E%981896%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%B9%B4%ED%8E%981896%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "최근 기준 매일 09:00~22:00 / 젤라또 종류는 당일 재고에 따라 달라질 수 있음",
    "active": true
  },
  {
    "id": "place-025",
    "name": "커피땅거미 본점",
    "category": "카페·디저트",
    "zoneId": "mannyeon",
    "durationMin": 50,
    "tags": [
      "food",
      "스페셜티커피"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EB%95%85%EA%B1%B0%EB%AF%B8%20%EB%B3%B8%EC%A0%90%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EB%95%85%EA%B1%B0%EB%AF%B8%20%EB%B3%B8%EC%A0%90%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "10:30~18:00 중심 / 수요일 휴무 안내 / 휴무가 유동적으로 바뀔 수 있어 방문 전 확인 추천",
    "active": true
  },
  {
    "id": "place-026",
    "name": "고요한아침이슬",
    "category": "카페·디저트",
    "zoneId": "mannyeon",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "티·전통카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B3%A0%EC%9A%94%ED%95%9C%EC%95%84%EC%B9%A8%EC%9D%B4%EC%8A%AC%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B3%A0%EC%9A%94%ED%95%9C%EC%95%84%EC%B9%A8%EC%9D%B4%EC%8A%AC%20%EB%8C%80%EC%A0%84%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "2026년 현재 영업 사업체로 확인되지만 최신 영업시간 공개 정보가 제한적이므로 방문 전 전화·지도 확인 권장",
    "active": true
  },
  {
    "id": "place-027",
    "name": "대전시립미술관",
    "category": "볼거리·문화·체험",
    "zoneId": "mannyeon",
    "durationMin": 90,
    "tags": [
      "photo",
      "미술·전시"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%8B%9C%EB%A6%BD%EB%AF%B8%EC%88%A0%EA%B4%80"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%8B%9C%EB%A6%BD%EB%AF%B8%EC%88%A0%EA%B4%80",
    "description": "3~10월 10:00~19:00 / 매주 월요일 휴관 / 전시 교체기간에는 일부 전시실이 휴관할 수 있어 현재전시 확인 추천",
    "active": true
  },
  {
    "id": "place-028",
    "name": "이응노미술관",
    "category": "볼거리·문화·체험",
    "zoneId": "mannyeon",
    "durationMin": 75,
    "tags": [
      "photo",
      "미술·전시"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9D%B4%EC%9D%91%EB%85%B8%EB%AF%B8%EC%88%A0%EA%B4%80"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9D%B4%EC%9D%91%EB%85%B8%EB%AF%B8%EC%88%A0%EA%B4%80",
    "description": "3~10월 10:00~19:00 / 월요일 휴관 / 전시 교체기간에는 전시 관람이 제한될 수 있음",
    "active": true
  },
  {
    "id": "place-029",
    "name": "대전예술의전당",
    "category": "볼거리·문화·체험",
    "zoneId": "mannyeon",
    "durationMin": 135,
    "tags": [
      "anything",
      "공연·관람"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%98%88%EC%88%A0%EC%9D%98%EC%A0%84%EB%8B%B9"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%98%88%EC%88%A0%EC%9D%98%EC%A0%84%EB%8B%B9",
    "description": "상설 관람지가 아니라 공연 일정형 장소 / 당일 공연·잔여석·입장시간 확인 필수",
    "active": true
  },
  {
    "id": "place-030",
    "name": "대전곤충생태관",
    "category": "볼거리·문화·체험",
    "zoneId": "mannyeon",
    "durationMin": 50,
    "tags": [
      "photo",
      "액티비티"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EA%B3%A4%EC%B6%A9%EC%83%9D%ED%83%9C%EA%B4%80"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EA%B3%A4%EC%B6%A9%EC%83%9D%ED%83%9C%EA%B4%80",
    "description": "화~일 10:00~17:00 / 무료 / 월요일 휴관 / 별도 체험은 프로그램별 예약·재료비 여부 확인 필요",
    "active": true
  },
  {
    "id": "place-031",
    "name": "천연기념물센터",
    "category": "볼거리·문화·체험",
    "zoneId": "mannyeon",
    "durationMin": 75,
    "tags": [
      "photo",
      "미술·전시"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%B2%9C%EC%97%B0%EA%B8%B0%EB%85%90%EB%AC%BC%EC%84%BC%ED%84%B0%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%B2%9C%EC%97%B0%EA%B8%B0%EB%85%90%EB%AC%BC%EC%84%BC%ED%84%B0%20%EB%8C%80%EC%A0%84",
    "description": "3~10월 09:30~17:30 / 월요일·설·추석 휴관 / 무료 / 입장마감 17:00",
    "active": true
  },
  {
    "id": "place-032",
    "name": "한밭수목원 동원",
    "category": "산책·야간",
    "zoneId": "mannyeon",
    "durationMin": 90,
    "tags": [
      "walk",
      "photo",
      "공원·녹지"
    ],
    "roles": [
      "anchor",
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%95%9C%EB%B0%AD%EC%88%98%EB%AA%A9%EC%9B%90%20%EB%8F%99%EC%9B%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%95%9C%EB%B0%AD%EC%88%98%EB%AA%A9%EC%9B%90%20%EB%8F%99%EC%9B%90",
    "description": "4~10월 05:00~21:00 / 입장마감 20:00 / 매주 월요일 휴원 / 입장 무료",
    "active": true
  },
  {
    "id": "place-033",
    "name": "한밭수목원 서원",
    "category": "산책·야간",
    "zoneId": "mannyeon",
    "durationMin": 90,
    "tags": [
      "walk",
      "공원·녹지"
    ],
    "roles": [
      "anchor",
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%95%9C%EB%B0%AD%EC%88%98%EB%AA%A9%EC%9B%90%20%EC%84%9C%EC%9B%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%95%9C%EB%B0%AD%EC%88%98%EB%AA%A9%EC%9B%90%20%EC%84%9C%EC%9B%90",
    "description": "4~10월 05:00~21:00 / 입장마감 20:00 / 매주 화요일 휴원 / 동원과 휴원일이 다르니 주의",
    "active": true
  },
  {
    "id": "place-034",
    "name": "대전엑스포 시민광장",
    "category": "산책·야간",
    "zoneId": "mannyeon",
    "durationMin": 45,
    "tags": [
      "walk",
      "photo",
      "하천·수변"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%97%91%EC%8A%A4%ED%8F%AC%20%EC%8B%9C%EB%AF%BC%EA%B4%91%EC%9E%A5"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%97%91%EC%8A%A4%ED%8F%AC%20%EC%8B%9C%EB%AF%BC%EA%B4%91%EC%9E%A5",
    "description": "광장 자체는 상시 이용 가능 / 계절별 행사·축제·스케이트장 설치 시 일부 공간 이용이 제한될 수 있음",
    "active": true
  },
  {
    "id": "place-035",
    "name": "둔산대공원",
    "category": "산책·야간",
    "zoneId": "mannyeon",
    "durationMin": 65,
    "tags": [
      "walk",
      "photo",
      "공원·녹지"
    ],
    "roles": [
      "anchor",
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%91%94%EC%82%B0%EB%8C%80%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%91%94%EC%82%B0%EB%8C%80%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84",
    "description": "공원은 상시 이용 가능하지만 내부 개별 시설은 각각 휴관일과 운영시간이 다름",
    "active": true
  },
  {
    "id": "place-036",
    "name": "갑천변 산책로 만년동 구간",
    "category": "산책·야간",
    "zoneId": "mannyeon",
    "durationMin": 45,
    "tags": [
      "walk",
      "photo",
      "하천·수변"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B0%91%EC%B2%9C%20%EC%82%B0%EC%B1%85%EB%A1%9C%20%EB%A7%8C%EB%85%84%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B0%91%EC%B2%9C%20%EC%82%B0%EC%B1%85%EB%A1%9C%20%EB%A7%8C%EB%85%84%EB%8F%99",
    "description": "별도 입장시간 없음 / 비가 많이 온 날이나 하천 수위가 높은 날은 하천변 진입 피하기 / 늦은 밤은 밝은 주동선 이용 추천",
    "active": true
  },
  {
    "id": "place-037",
    "name": "갑천수상스포츠체험장",
    "category": "볼거리·문화·체험",
    "zoneId": "mannyeon",
    "durationMin": 90,
    "tags": [
      "anything",
      "액티비티"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B0%91%EC%B2%9C%EC%88%98%EC%83%81%EC%8A%A4%ED%8F%AC%EC%B8%A0%EC%B2%B4%ED%97%98%EC%9E%A5"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B0%91%EC%B2%9C%EC%88%98%EC%83%81%EC%8A%A4%ED%8F%AC%EC%B8%A0%EC%B2%B4%ED%97%98%EC%9E%A5",
    "description": "2026년 8월 1일 재개장 / 현재 14:00~22:00 / 월요일·추석연휴·선거일 휴장 / 2026 운영기간은 11월 5일까지 예정",
    "active": true
  },
  {
    "id": "place-038",
    "name": "이응노미술관 아트숍",
    "category": "볼거리·문화·체험",
    "zoneId": "mannyeon",
    "durationMin": 20,
    "tags": [
      "photo",
      "굿즈·관광안내"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9D%B4%EC%9D%91%EB%85%B8%EB%AF%B8%EC%88%A0%EA%B4%80%20%EC%95%84%ED%8A%B8%EC%88%8D"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9D%B4%EC%9D%91%EB%85%B8%EB%AF%B8%EC%88%A0%EA%B4%80%20%EC%95%84%ED%8A%B8%EC%88%8D",
    "description": "3~10월 10:00~19:00 / 미술관과 동일하게 월요일 휴관 / 전시 교체기간에도 운영 여부가 달라질 수 있음",
    "active": true
  },
  {
    "id": "place-039",
    "name": "대전시립미술관 기념품점",
    "category": "볼거리·문화·체험",
    "zoneId": "mannyeon",
    "durationMin": 15,
    "tags": [
      "photo",
      "굿즈·관광안내"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%8B%9C%EB%A6%BD%EB%AF%B8%EC%88%A0%EA%B4%80%20%EA%B8%B0%EB%85%90%ED%92%88%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EC%8B%9C%EB%A6%BD%EB%AF%B8%EC%88%A0%EA%B4%80%20%EA%B8%B0%EB%85%90%ED%92%88%EC%A0%90",
    "description": "미술관 운영시간을 따름 / 월요일 휴관 / 특별전·전시 교체에 따라 판매 상품이나 운영이 달라질 수 있음",
    "active": true
  },
  {
    "id": "place-040",
    "name": "와타요업 갈마본점",
    "category": "식사",
    "zoneId": "galma",
    "durationMin": 55,
    "tags": [
      "food",
      "일식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%99%80%ED%83%80%EC%9A%94%EC%97%85%20%EA%B0%88%EB%A7%88%EB%B3%B8%EC%A0%90%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%99%80%ED%83%80%EC%9A%94%EC%97%85%20%EA%B0%88%EB%A7%88%EB%B3%B8%EC%A0%90%20%EB%8C%80%EC%A0%84",
    "description": "12:00~21:00 / 브레이크타임 14:30~17:30 / 인기 매장이라 웨이팅 가능성이 높고 테이블링 원격줄서기 활용 추천 / 별도 예약제는 운영하지 않음",
    "active": true
  },
  {
    "id": "place-041",
    "name": "킨토토",
    "category": "식사",
    "zoneId": "galma",
    "durationMin": 50,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%82%A8%ED%86%A0%ED%86%A0%20%EA%B0%88%EB%A7%88%EB%8F%99%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%82%A8%ED%86%A0%ED%86%A0%20%EA%B0%88%EB%A7%88%EB%8F%99%20%EB%8C%80%EC%A0%84",
    "description": "12:00~21:00 / 브레이크타임 15:00~17:00 / 라스트오더 14:30·20:30 안내 / 주차장 없음 / 재료 소진 시 조기마감 가능",
    "active": true
  },
  {
    "id": "place-042",
    "name": "가도누들",
    "category": "식사",
    "zoneId": "galma",
    "durationMin": 50,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B0%80%EB%8F%84%EB%88%84%EB%93%A4%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B0%80%EB%8F%84%EB%88%84%EB%93%A4%20%EB%8C%80%EC%A0%84",
    "description": "11:30~20:30 / 브레이크타임 15:00~17:00 / 라스트오더 20:00 / 건물 뒤편 소규모 주차장 있으나 자리 제한적",
    "active": true
  },
  {
    "id": "place-043",
    "name": "타코갱",
    "category": "식사",
    "zoneId": "galma",
    "durationMin": 55,
    "tags": [
      "food",
      "멕시칸"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%83%80%EC%BD%94%EA%B0%B1%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%83%80%EC%BD%94%EA%B0%B1%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "12:00~23:00 / 브레이크타임 15:00~17:00 / 라스트오더 21:40 안내 / 매장 앞 주차공간이 매우 협소해 도보 방문 추천",
    "active": true
  },
  {
    "id": "place-044",
    "name": "갈마살롱",
    "category": "식사",
    "zoneId": "galma",
    "durationMin": 75,
    "tags": [
      "food",
      "브런치"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B0%88%EB%A7%88%EC%82%B4%EB%A1%B1%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B0%88%EB%A7%88%EC%82%B4%EB%A1%B1%20%EB%8C%80%EC%A0%84",
    "description": "11:30~21:30 / 평일 브레이크타임 15:00~17:00 / 주말은 브레이크타임 없이 운영되는 경우 있음 / 전용주차장 없음",
    "active": true
  },
  {
    "id": "place-045",
    "name": "애프터글로우",
    "category": "식사",
    "zoneId": "galma",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%95%A0%ED%94%84%ED%84%B0%EA%B8%80%EB%A1%9C%EC%9A%B0%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%95%A0%ED%94%84%ED%84%B0%EA%B8%80%EB%A1%9C%EC%9A%B0%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "월요일 휴무 안내 / 11:30부터 저녁까지 운영 / 요일에 따라 브레이크타임이 달라질 수 있음 / 전용주차장 없음",
    "active": true
  },
  {
    "id": "place-046",
    "name": "밥한톨",
    "category": "식사",
    "zoneId": "galma",
    "durationMin": 55,
    "tags": [
      "food",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%B0%A5%ED%95%9C%ED%86%A8%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%B0%A5%ED%95%9C%ED%86%A8%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "11:30~21:00 / 브레이크타임 15:00~17:00 안내 / 좌석이 많지 않아 피크타임 웨이팅 가능 / 별도 주차장 없음",
    "active": true
  },
  {
    "id": "place-047",
    "name": "하치카페",
    "category": "카페·디저트",
    "zoneId": "galma",
    "durationMin": 75,
    "tags": [
      "food",
      "walk",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%95%98%EC%B9%98%EC%B9%B4%ED%8E%98%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%95%98%EC%B9%98%EC%B9%B4%ED%8E%98%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "매일 12:00~21:30 안내 / 좌석이 넓지 않아 주말·저녁 시간대 혼잡할 수 있음 / 전용주차장 없음",
    "active": true
  },
  {
    "id": "place-048",
    "name": "빈이어",
    "category": "카페·디저트",
    "zoneId": "galma",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%B9%88%EC%9D%B4%EC%96%B4%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%B9%88%EC%9D%B4%EC%96%B4%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "11:00~22:00 안내 / 2층이라 입구를 지나치기 쉬움 / 주차불가 안내가 있어 대중교통·도보 방문 추천",
    "active": true
  },
  {
    "id": "place-049",
    "name": "더머스커피클럽",
    "category": "카페·디저트",
    "zoneId": "galma",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8D%94%EB%A8%B8%EC%8A%A4%EC%BB%A4%ED%94%BC%ED%81%B4%EB%9F%BD%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8D%94%EB%A8%B8%EC%8A%A4%EC%BB%A4%ED%94%BC%ED%81%B4%EB%9F%BD%20%EB%8C%80%EC%A0%84",
    "description": "12:00~22:00 중심 / 화요일 휴무로 안내되는 정보가 있어 방문 전 확인 추천 / 주차공간 협소",
    "active": true
  },
  {
    "id": "place-050",
    "name": "벤헤드바운스",
    "category": "카페·디저트",
    "zoneId": "galma",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%B2%A4%ED%97%A4%EB%93%9C%EB%B0%94%EC%9A%B4%EC%8A%A4%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%B2%A4%ED%97%A4%EB%93%9C%EB%B0%94%EC%9A%B4%EC%8A%A4%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "화~일 12:00~22:00 / 월요일 휴무 / 라스트오더 21:30 / 카이막은 재료 소진 가능성이 있어 공식 공지 확인 추천 / 주차불가",
    "active": true
  },
  {
    "id": "place-051",
    "name": "컨트란스",
    "category": "카페·디저트",
    "zoneId": "galma",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%BB%A8%ED%8A%B8%EB%9E%80%EC%8A%A4%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%BB%A8%ED%8A%B8%EB%9E%80%EC%8A%A4%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "매일 12:00~22:00 / 라스트오더 21:30 / 갈리단길 특성상 주차가 불편해 도보 방문 추천",
    "active": true
  },
  {
    "id": "place-052",
    "name": "곳간집",
    "category": "카페·디저트",
    "zoneId": "galma",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B3%B3%EA%B0%84%EC%A7%91%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B3%B3%EA%B0%84%EC%A7%91%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "금·토·일·월 12:00~18:00 중심 / 화~목 휴무 / 일부 인기 디저트는 100% 예약제로 운영돼 즉흥방문에는 제약이 큼 / 주차불가",
    "active": true
  },
  {
    "id": "place-053",
    "name": "갈마문화공원",
    "category": "산책·야간",
    "zoneId": "galma",
    "durationMin": 45,
    "tags": [
      "walk",
      "공원·녹지"
    ],
    "roles": [
      "anchor",
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B0%88%EB%A7%88%EB%AC%B8%ED%99%94%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B0%88%EB%A7%88%EB%AC%B8%ED%99%94%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84",
    "description": "공원은 자유롭게 이용 가능 / 야외 공간이므로 폭염·우천 시 이용시간 조절 추천 / 야간에는 주요 산책 동선 이용 권장",
    "active": true
  },
  {
    "id": "place-054",
    "name": "월평도서관",
    "category": "볼거리·문화·체험",
    "zoneId": "galma",
    "durationMin": 65,
    "tags": [
      "photo",
      "미술·전시"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9B%94%ED%8F%89%EB%8F%84%EC%84%9C%EA%B4%80%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9B%94%ED%8F%89%EB%8F%84%EC%84%9C%EA%B4%80%20%EB%8C%80%EC%A0%84",
    "description": "매주 금요일 휴관 / 도서정보실 평일 09:00~22:00·주말 09:00~18:00 / 미디어창작실 등 일부 시설은 대전시민 대상 사전예약 필요",
    "active": true
  },
  {
    "id": "place-055",
    "name": "삼요소",
    "category": "볼거리·문화·체험",
    "zoneId": "galma",
    "durationMin": 65,
    "tags": [
      "photo",
      "서점·문화공간"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%82%BC%EC%9A%94%EC%86%8C%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%82%BC%EC%9A%94%EC%86%8C%20%EB%8C%80%EC%A0%84%20%EA%B0%88%EB%A7%88%EB%8F%99",
    "description": "무인 운영 중심으로 네이버 사전예약 후 입장하는 방식 / 이용시간·입장료·예약 가능 여부는 방문 당일 예약페이지 확인 필수",
    "active": true
  },
  {
    "id": "place-056",
    "name": "갈리단길 골목",
    "category": "산책·야간",
    "zoneId": "galma",
    "durationMin": 45,
    "tags": [
      "walk",
      "골목산책"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B0%88%EB%A6%AC%EB%8B%A8%EA%B8%B8%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B0%88%EB%A6%AC%EB%8B%A8%EA%B8%B8%20%EB%8C%80%EC%A0%84",
    "description": "별도 운영시간 없음 / 개별 매장 휴무·브레이크타임이 각각 다름 / 골목이 좁고 주차가 어려워 차량보다 도보 이동 추천",
    "active": true
  },
  {
    "id": "place-057",
    "name": "희락반점",
    "category": "식사",
    "zoneId": "seonhwa",
    "durationMin": 55,
    "tags": [
      "food",
      "중식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%9D%AC%EB%9D%BD%EB%B0%98%EC%A0%90%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%9D%AC%EB%9D%BD%EB%B0%98%EC%A0%90%20%EB%8C%80%EC%A0%84",
    "description": "11:00~21:00 / 브레이크타임 14:30~16:30 / 매달 1·3번째 일요일 휴무 안내 / 점심시간 웨이팅 가능 / 매장 뒤 전용주차장 있음",
    "active": true
  },
  {
    "id": "place-058",
    "name": "요우란",
    "category": "식사",
    "zoneId": "seonhwa",
    "durationMin": 55,
    "tags": [
      "food",
      "일식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9A%94%EC%9A%B0%EB%9E%80%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9A%94%EC%9A%B0%EB%9E%80%20%EB%8C%80%EC%A0%84",
    "description": "평일 11:30~20:30 / 브레이크타임 14:30~17:30 / 라스트오더 14:00·20:00 / 주말 운영시간 일부 상이 / 인기 매장이라 웨이팅·테이블링 확인 추천 / 노키즈존",
    "active": true
  },
  {
    "id": "place-059",
    "name": "캘리캘리",
    "category": "식사",
    "zoneId": "seonhwa",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%BA%98%EB%A6%AC%EC%BA%98%EB%A6%AC%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%BA%98%EB%A6%AC%EC%BA%98%EB%A6%AC%20%EB%8C%80%EC%A0%84",
    "description": "11:00~20:50 / 브레이크타임 14:50~17:00 / 라스트오더 14:00·20:00 / 주말 피크타임 웨이팅 가능",
    "active": true
  },
  {
    "id": "place-060",
    "name": "온기솥밥",
    "category": "식사",
    "zoneId": "seonhwa",
    "durationMin": 55,
    "tags": [
      "food",
      "photo",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%98%A8%EA%B8%B0%EC%86%A5%EB%B0%A5%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%98%A8%EA%B8%B0%EC%86%A5%EB%B0%A5%20%EB%8C%80%EC%A0%84",
    "description": "11:00~22:00 / 브레이크타임 15:00~17:00 / 식사 피크타임 혼잡 가능 / 휴무 변동은 당일 지도 확인 추천",
    "active": true
  },
  {
    "id": "place-061",
    "name": "해마의방",
    "category": "식사",
    "zoneId": "seonhwa",
    "durationMin": 55,
    "tags": [
      "food",
      "photo",
      "기타 식사"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%95%B4%EB%A7%88%EC%9D%98%EB%B0%A9%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%95%B4%EB%A7%88%EC%9D%98%EB%B0%A9%20%EB%8C%80%EC%A0%84",
    "description": "최근 영업정보가 요일별로 달라질 수 있어 방문 당일 네이버지도 운영시간 확인 추천 / 피크타임 좌석 대기 가능",
    "active": true
  },
  {
    "id": "place-062",
    "name": "누리손만두",
    "category": "식사",
    "zoneId": "seonhwa",
    "durationMin": 50,
    "tags": [
      "food",
      "기타 식사"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%88%84%EB%A6%AC%EC%86%90%EB%A7%8C%EB%91%90%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%88%84%EB%A6%AC%EC%86%90%EB%A7%8C%EB%91%90%20%EB%8C%80%EC%A0%84",
    "description": "예약 가능 매장으로 안내되며 인기 시간대 대기 가능 / 최신 영업시간은 방문 당일 지도 확인 추천",
    "active": true
  },
  {
    "id": "place-063",
    "name": "알로하녹",
    "category": "카페·디저트",
    "zoneId": "seonhwa",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "티·전통카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%95%8C%EB%A1%9C%ED%95%98%EB%85%B9%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%95%8C%EB%A1%9C%ED%95%98%EB%85%B9%20%EB%8C%80%EC%A0%84",
    "description": "매일 11:00~21:00 / 야외 좌석 있음 / 주말에는 이용객이 많을 수 있음 / 인근 공영주차장 이용 추천",
    "active": true
  },
  {
    "id": "place-064",
    "name": "한밭카페",
    "category": "카페·디저트",
    "zoneId": "seonhwa",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%95%9C%EB%B0%AD%EC%B9%B4%ED%8E%98%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%95%9C%EB%B0%AD%EC%B9%B4%ED%8E%98%20%EB%8C%80%EC%A0%84",
    "description": "평일 10:30~21:30 / 주말은 19:00 전후 마감 안내 / 3층이지만 엘리베이터 없이 계단 이용 / 전용주차장 없음",
    "active": true
  },
  {
    "id": "place-065",
    "name": "산호초",
    "category": "카페·디저트",
    "zoneId": "seonhwa",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "티·전통카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%82%B0%ED%98%B8%EC%B4%88%20%EC%B9%B4%ED%8E%98%20%EB%8C%80%EC%A0%84%20%EC%84%A0%ED%99%94%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%82%B0%ED%98%B8%EC%B4%88%20%EC%B9%B4%ED%8E%98%20%EB%8C%80%EC%A0%84%20%EC%84%A0%ED%99%94%EB%8F%99",
    "description": "화~일 12:00~22:00 중심 / 라스트오더 21:00 / 월요일 휴무로 최근 안내 / 2층 매장이라 입구를 지나치지 않도록 주의",
    "active": true
  },
  {
    "id": "place-066",
    "name": "포우드",
    "category": "카페·디저트",
    "zoneId": "seonhwa",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%8F%AC%EC%9A%B0%EB%93%9C%20%EB%8C%80%EC%A0%84%20%EC%84%A0%ED%99%94%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%8F%AC%EC%9A%B0%EB%93%9C%20%EB%8C%80%EC%A0%84%20%EC%84%A0%ED%99%94%EB%8F%99",
    "description": "10:00~21:00 / 라스트오더 20:30 / 일부 요일 휴무가 있어 방문 전 지도 확인 추천 / 인기 케이크는 품절 가능",
    "active": true
  },
  {
    "id": "place-067",
    "name": "달미테",
    "category": "카페·디저트",
    "zoneId": "seonhwa",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8B%AC%EB%AF%B8%ED%85%8C%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8B%AC%EB%AF%B8%ED%85%8C%20%EB%8C%80%EC%A0%84",
    "description": "11:00~23:00 / 매주 수요일 휴무 안내 / 매장 앞 공영주차장 이용 가능 / 영업정보 변동 시 당일 지도 확인 추천",
    "active": true
  },
  {
    "id": "place-068",
    "name": "넌테이블 대전점",
    "category": "카페·디저트",
    "zoneId": "seonhwa",
    "durationMin": 50,
    "tags": [
      "food",
      "photo",
      "티·전통카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%84%8C%ED%85%8C%EC%9D%B4%EB%B8%94%20%EB%8C%80%EC%A0%84%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%84%8C%ED%85%8C%EC%9D%B4%EB%B8%94%20%EB%8C%80%EC%A0%84%EC%A0%90",
    "description": "08:30~18:00 중심으로 운영 / 다른 카페보다 마감이 빠른 편이라 오후 늦은 방문은 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-069",
    "name": "대전근현대사전시관",
    "category": "볼거리·문화·체험",
    "zoneId": "seonhwa",
    "durationMin": 50,
    "tags": [
      "photo",
      "미술·전시"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EA%B7%BC%ED%98%84%EB%8C%80%EC%82%AC%EC%A0%84%EC%8B%9C%EA%B4%80"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EA%B7%BC%ED%98%84%EB%8C%80%EC%82%AC%EC%A0%84%EC%8B%9C%EA%B4%80",
    "description": "전시 운영시간·휴관일은 기획전 및 시설 운영에 따라 달라질 수 있어 방문 당일 공식 안내 확인 추천 / 무료 관람 중심",
    "active": true
  },
  {
    "id": "place-070",
    "name": "3·8민주의거기념관",
    "category": "볼거리·문화·체험",
    "zoneId": "seonhwa",
    "durationMin": 50,
    "tags": [
      "photo",
      "미술·전시"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/3.8%EB%AF%BC%EC%A3%BC%EC%9D%98%EA%B1%B0%EA%B8%B0%EB%85%90%EA%B4%80%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/3.8%EB%AF%BC%EC%A3%BC%EC%9D%98%EA%B1%B0%EA%B8%B0%EB%85%90%EA%B4%80%20%EB%8C%80%EC%A0%84",
    "description": "2026년부터 민간위탁 운영으로 전환됨 / 특별 휴관일이 있을 수 있어 당일 운영 여부 확인 추천",
    "active": true
  },
  {
    "id": "place-071",
    "name": "선리단길",
    "category": "산책·야간",
    "zoneId": "seonhwa",
    "durationMin": 45,
    "tags": [
      "walk",
      "photo",
      "골목산책"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%84%A0%EB%A6%AC%EB%8B%A8%EA%B8%B8%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%84%A0%EB%A6%AC%EB%8B%A8%EA%B8%B8%20%EB%8C%80%EC%A0%84",
    "description": "거리 자체는 상시 이용 가능 / 개별 카페·식당의 휴무·브레이크타임이 각각 다름 / 골목 주차가 불편해 도보 이동 추천",
    "active": true
  },
  {
    "id": "place-072",
    "name": "예술과 낭만의 거리",
    "category": "산책·야간",
    "zoneId": "seonhwa",
    "durationMin": 45,
    "tags": [
      "walk",
      "photo",
      "자연·트레킹"
    ],
    "roles": [
      "anchor",
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%98%88%EC%88%A0%EA%B3%BC%20%EB%82%AD%EB%A7%8C%EC%9D%98%20%EA%B1%B0%EB%A6%AC%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%98%88%EC%88%A0%EA%B3%BC%20%EB%82%AD%EB%A7%8C%EC%9D%98%20%EA%B1%B0%EB%A6%AC%20%EB%8C%80%EC%A0%84",
    "description": "별도 운영시간 없음 / 실제 생활 골목과 상업공간이 섞여 있으므로 늦은 밤에는 큰길 위주 이동 추천",
    "active": true
  },
  {
    "id": "place-073",
    "name": "리코제이 레스토랑",
    "category": "식사",
    "zoneId": "doryong",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/리코제이%20레스토랑%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/리코제이%20레스토랑%20대전",
    "description": "매일 11:30~21:00 / 브레이크타임 15:00~17:30 / 라스트오더 20:00 / 주말·기념일에는 예약 추천",
    "active": true
  },
  {
    "id": "place-074",
    "name": "오씨칼국수 도룡점",
    "category": "식사",
    "zoneId": "doryong",
    "durationMin": 70,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/오씨칼국수%20도룡점"
    },
    "mapUrl": "https://map.naver.com/p/search/오씨칼국수%20도룡점",
    "description": "11:00~21:00 / 월요일 휴무 / 평일 브레이크타임 15:00~16:30 / 라스트오더 20:20 / 피크타임 웨이팅 가능",
    "active": true
  },
  {
    "id": "place-075",
    "name": "카리코",
    "category": "식사",
    "zoneId": "doryong",
    "durationMin": 50,
    "tags": [
      "food",
      "카레"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/카리코%20도룡동"
    },
    "mapUrl": "https://map.naver.com/p/search/카리코%20도룡동",
    "description": "매일 11:00~20:30 / 브레이크타임 15:00~17:00 중심 / 라스트오더 14:30·20:00 / 테이블링 원격줄서기 가능",
    "active": true
  },
  {
    "id": "place-076",
    "name": "105소호",
    "category": "식사",
    "zoneId": "doryong",
    "durationMin": 55,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/105소호%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/105소호%20대전",
    "description": "11:00~21:00 / 평일·주말 브레이크타임이 다르게 안내되는 경우 있어 당일 확인 추천 / 라스트오더 20:00 중심",
    "active": true
  },
  {
    "id": "place-077",
    "name": "트웰브 오",
    "category": "식사",
    "zoneId": "doryong",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "브런치"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/트웰브%20오%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/트웰브%20오%20대전",
    "description": "월·화 휴무 / 수~토 11:00~22:00 / 일 11:00~21:00 / 브레이크타임 15:00~17:00 / 7세 미만 입장 제한 / 예약 추천",
    "active": true
  },
  {
    "id": "place-078",
    "name": "The 빛나",
    "category": "식사",
    "zoneId": "doryong",
    "durationMin": 75,
    "tags": [
      "food",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/The%20빛나%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/The%20빛나%20대전",
    "description": "매일 11:00~21:00 / 브레이크타임은 15:00 또는 15:30 시작으로 플랫폼별 표기 차이가 있어 당일 확인 권장 / 예약 가능",
    "active": true
  },
  {
    "id": "place-079",
    "name": "김형제고기의철학 대전엑스포점",
    "category": "식사",
    "zoneId": "doryong",
    "durationMin": 75,
    "tags": [
      "food",
      "고기·구이"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/김형제고기의철학%20대전엑스포점"
    },
    "mapUrl": "https://map.naver.com/p/search/김형제고기의철학%20대전엑스포점",
    "description": "최근 플랫폼에는 17:00~22:00 중심으로 안내 / 주말 점심 운영 정보가 일부 채널과 달라 당일 확인 권장 / 피크타임 예약 추천",
    "active": true
  },
  {
    "id": "place-080",
    "name": "수린 대전",
    "category": "식사",
    "zoneId": "doryong",
    "durationMin": 105,
    "tags": [
      "food",
      "photo",
      "기타 식사"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/수린%20대전%20도룡동"
    },
    "mapUrl": "https://map.naver.com/p/search/수린%20대전%20도룡동",
    "description": "11:30~21:30 / 브레이크타임 14:30~17:00 / 런치·디너 코스 중심으로 가격대 높음 / 예약형 매장이라 즉흥여행에는 다소 제약 있음",
    "active": true
  },
  {
    "id": "place-081",
    "name": "성심당 DCC점",
    "category": "카페·디저트",
    "zoneId": "doryong",
    "durationMin": 45,
    "tags": [
      "food",
      "베이커리"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/성심당%20DCC점"
    },
    "mapUrl": "https://map.naver.com/p/search/성심당%20DCC점",
    "description": "매일 08:00~22:00 / 주말·행사일에는 대기줄이 길어질 수 있고 인기 제품은 품절 가능",
    "active": true
  },
  {
    "id": "place-082",
    "name": "쁘띠정동문화사",
    "category": "카페·디저트",
    "zoneId": "doryong",
    "durationMin": 20,
    "tags": [
      "food",
      "베이커리"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/쁘띠정동문화사%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/쁘띠정동문화사%20대전",
    "description": "테이크아웃 중심 / 월·화 휴무 / 수~금 12:00~17:00·토 11:00~17:00·일 11:00~16:00 중심 / 재료 소진 시 조기마감 가능해 오픈 시간대 방문 추천",
    "active": true
  },
  {
    "id": "place-083",
    "name": "코너스톤H",
    "category": "카페·디저트",
    "zoneId": "doryong",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "스페셜티커피"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/코너스톤H%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/코너스톤H%20대전",
    "description": "월~토 10:30~22:00 / 일요일 휴무 / 전용주차장이 없어 차량 방문보다 주변 주차 후 도보 이동 추천 / 음료 가격대가 높은 편",
    "active": true
  },
  {
    "id": "place-084",
    "name": "인터뷰커피라운지",
    "category": "카페·디저트",
    "zoneId": "doryong",
    "durationMin": 90,
    "tags": [
      "food",
      "photo",
      "공간형카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/인터뷰커피라운지%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/인터뷰커피라운지%20대전",
    "description": "최근 11:30~24:00 운영으로 안내 / 일부 채널의 오픈시간 표기가 달라 오전 방문은 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-085",
    "name": "카페 가비원",
    "category": "카페·디저트",
    "zoneId": "doryong",
    "durationMin": 50,
    "tags": [
      "food",
      "스페셜티커피"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/카페%20가비원%20도룡동"
    },
    "mapUrl": "https://map.naver.com/p/search/카페%20가비원%20도룡동",
    "description": "매일 09:00~20:00 / 매장이 아담해 좌석이 많지 않음 / 반려동물 동반 가능 여부는 이용 조건을 방문 전 확인 추천",
    "active": true
  },
  {
    "id": "place-086",
    "name": "브알라 대전도룡점",
    "category": "카페·디저트",
    "zoneId": "doryong",
    "durationMin": 50,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/브알라%20대전도룡점"
    },
    "mapUrl": "https://map.naver.com/p/search/브알라%20대전도룡점",
    "description": "매일 10:00~22:00 안내 / 주말에는 좌석 혼잡 가능 / 하우스디어반 지하주차장 이용 가능",
    "active": true
  },
  {
    "id": "place-087",
    "name": "오너커피",
    "category": "카페·디저트",
    "zoneId": "doryong",
    "durationMin": 75,
    "tags": [
      "food",
      "카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/오너커피%20대전%20도룡동"
    },
    "mapUrl": "https://map.naver.com/p/search/오너커피%20대전%20도룡동",
    "description": "평일 10:30~22:00 / 주말 11:00~21:00 중심 / 건물 규모가 커 처음 방문하면 매장 위치를 찾는 데 시간이 걸릴 수 있음",
    "active": true
  },
  {
    "id": "place-088",
    "name": "스타벅스 대전엑스포스카이점",
    "category": "카페·디저트",
    "zoneId": "doryong",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/스타벅스%20대전엑스포스카이점"
    },
    "mapUrl": "https://map.naver.com/p/search/스타벅스%20대전엑스포스카이점",
    "description": "매일 08:00~22:00 / 일반 백화점 엘리베이터가 아니라 엑스포타워 전용 동선 이용 / 일몰·야경 시간 창가 좌석 경쟁이 심한 편",
    "active": true
  },
  {
    "id": "place-089",
    "name": "한빛탑",
    "category": "볼거리·문화·체험",
    "zoneId": "doryong",
    "durationMin": 40,
    "tags": [
      "photo",
      "문화공간"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/한빛탑%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/한빛탑%20대전",
    "description": "09:30~17:40 / 매주 월요일·1월 1일·설·추석 당일 휴관 / 무료 / 운영시간 변동 공지 확인 권장",
    "active": true
  },
  {
    "id": "place-090",
    "name": "꿈돌이하우스 2호점",
    "category": "볼거리·문화·체험",
    "zoneId": "doryong",
    "durationMin": 45,
    "tags": [
      "photo",
      "굿즈·관광안내"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/꿈돌이하우스%202호점"
    },
    "mapUrl": "https://map.naver.com/p/search/꿈돌이하우스%202호점",
    "description": "4~11월 10:00~21:30 / 12~3월 10:00~17:30 / 매주 월요일 휴무 / 인기 굿즈는 재고 변동 가능",
    "active": true
  },
  {
    "id": "place-091",
    "name": "엑스포과학공원 물빛광장·음악분수",
    "category": "산책·야간",
    "zoneId": "doryong",
    "durationMin": 50,
    "tags": [
      "walk",
      "공원·녹지"
    ],
    "roles": [
      "anchor",
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/엑스포과학공원%20물빛광장"
    },
    "mapUrl": "https://map.naver.com/p/search/엑스포과학공원%20물빛광장",
    "description": "음악분수 15:00~21:00 사이 1시간 간격 운영 / 월요일·공휴일 미운영 / 기상·행사에 따라 변경 가능 / 현재 한빛탑 미디어파사드는 별도 재개 공지 전까지 미운영",
    "active": true
  },
  {
    "id": "place-092",
    "name": "엑스포다리",
    "category": "산책·야간",
    "zoneId": "doryong",
    "durationMin": 30,
    "tags": [
      "walk",
      "photo",
      "야경·전망"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/엑스포다리%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/엑스포다리%20대전",
    "description": "상시 보행 가능 / 경관조명은 일몰~23:00 운영 / 우천·강풍 시 야간 산책 주의",
    "active": true
  },
  {
    "id": "place-093",
    "name": "대전 엑스포 아쿠아리움",
    "category": "볼거리·문화·체험",
    "zoneId": "doryong",
    "durationMin": 105,
    "tags": [
      "anything",
      "액티비티"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/대전%20엑스포%20아쿠아리움"
    },
    "mapUrl": "https://map.naver.com/p/search/대전%20엑스포%20아쿠아리움",
    "description": "10:30~19:00 / 입장마감 18:00 / 대인 32,000원·소인 및 65세 이상 27,000원 기준 / 유료 콘텐츠라 예산 고려 필요",
    "active": true
  },
  {
    "id": "place-094",
    "name": "신세계넥스페리움",
    "category": "볼거리·문화·체험",
    "zoneId": "doryong",
    "durationMin": 135,
    "tags": [
      "photo",
      "액티비티"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/신세계넥스페리움%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/신세계넥스페리움%20대전",
    "description": "회차형·유료 프로그램 중심 / 백화점 휴점일 및 당일 회차·잔여석 확인 필요 / 충분한 체류시간 확보 추천",
    "active": true
  },
  {
    "id": "place-095",
    "name": "스몹 대전",
    "category": "볼거리·문화·체험",
    "zoneId": "doryong",
    "durationMin": 120,
    "tags": [
      "anything",
      "액티비티"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/스몹%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/스몹%20대전",
    "description": "유료 / 시설별 신장·복장 등 이용 조건이 있을 수 있어 방문 전 확인 필요 / 주말에는 대기 가능 / 백화점 휴점일 확인",
    "active": true
  },
  {
    "id": "place-096",
    "name": "신세계갤러리 대전",
    "category": "볼거리·문화·체험",
    "zoneId": "doryong",
    "durationMin": 45,
    "tags": [
      "photo",
      "굿즈·관광안내"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/신세계갤러리%20대전"
    },
    "mapUrl": "https://map.naver.com/p/search/신세계갤러리%20대전",
    "description": "월~목 10:30~20:00 / 금~일 10:30~20:30 / 전시별 일정·관람료가 달라 현재 전시 확인 필수 / 백화점 휴점일 확인",
    "active": true
  },
  {
    "id": "place-097",
    "name": "꿀잼도시 대전홍보관",
    "category": "볼거리·문화·체험",
    "zoneId": "doryong",
    "durationMin": 30,
    "tags": [
      "photo",
      "굿즈·관광안내"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/꿀잼도시%20대전홍보관"
    },
    "mapUrl": "https://map.naver.com/p/search/꿀잼도시%20대전홍보관",
    "description": "주중 10:30~20:00 / 주말·공휴일 10:30~20:30 / 백화점 휴장일 휴점 / 굿즈 재고는 시기별 변동 가능",
    "active": true
  },
  {
    "id": "place-098",
    "name": "대전신세계 Art&Science 하늘공원",
    "category": "산책·야간",
    "zoneId": "doryong",
    "durationMin": 30,
    "tags": [
      "walk",
      "photo",
      "야경·전망"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/대전신세계%20하늘공원"
    },
    "mapUrl": "https://map.naver.com/p/search/대전신세계%20하늘공원",
    "description": "10:30부터 백화점 폐점 30분 전까지 운영 / 기상 악화 등 위험요소가 있을 경우 개방하지 않을 수 있음 / 백화점 휴점일 확인",
    "active": true
  },
  {
    "id": "place-099",
    "name": "진로집",
    "category": "식사",
    "zoneId": "daeheung",
    "durationMin": 55,
    "tags": [
      "food",
      "한식·로컬식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%A7%84%EB%A1%9C%EC%A7%91%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%A7%84%EB%A1%9C%EC%A7%91%20%EB%8C%80%EC%A0%84",
    "description": "11:30~22:00 / 브레이크타임 15:00~16:30 / 매주 화요일 휴무 / 평일 점심에도 웨이팅이 생길 수 있음 / 주차불가",
    "active": true
  },
  {
    "id": "place-100",
    "name": "대전갈비집",
    "category": "식사",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "고기·구이"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EA%B0%88%EB%B9%84%EC%A7%91"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%EA%B0%88%EB%B9%84%EC%A7%91",
    "description": "11:00~22:00 / 라스트오더 21:00 / 연중무휴 / 전용 주차 가능 / 골목 안쪽에 있어 처음 방문하면 입구를 지나치기 쉬움",
    "active": true
  },
  {
    "id": "place-101",
    "name": "월산본가",
    "category": "식사",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "고기·구이"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9B%94%EC%82%B0%EB%B3%B8%EA%B0%80%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9B%94%EC%82%B0%EB%B3%B8%EA%B0%80%20%EB%8C%80%EC%A0%84",
    "description": "매일 11:30~21:30 / 주차 가능 / 점심·주말에는 대기 가능 / 식사 공간이 1·2층으로 나뉘어 있음",
    "active": true
  },
  {
    "id": "place-102",
    "name": "덤블링",
    "category": "식사",
    "zoneId": "daeheung",
    "durationMin": 55,
    "tags": [
      "food",
      "한식·로컬식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8D%A4%EB%B8%94%EB%A7%81%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8D%A4%EB%B8%94%EB%A7%81%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99",
    "description": "매일 11:30~22:00 / 브레이크타임 15:00~17:00 / 매장이 넓지 않아 피크타임 웨이팅 가능 / 주차 가능 안내",
    "active": true
  },
  {
    "id": "place-103",
    "name": "도어블",
    "category": "식사",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "중식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8F%84%EC%96%B4%EB%B8%94%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8F%84%EC%96%B4%EB%B8%94%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99",
    "description": "월~토 11:30~21:00 / 일요일 휴무 / 예약 가능 / 주차불가 / 저녁이나 단체 방문은 사전예약 추천",
    "active": true
  },
  {
    "id": "place-104",
    "name": "내집",
    "category": "식사",
    "zoneId": "daeheung",
    "durationMin": 55,
    "tags": [
      "food",
      "photo",
      "한식·로컬식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%82%B4%EC%A7%91%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%82%B4%EC%A7%91%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99",
    "description": "월~토 11:00~21:30 / 브레이크타임 15:00~17:00 / 일요일 휴무 / 저녁에는 술자리 손님이 많아 다소 시끄러울 수 있음",
    "active": true
  },
  {
    "id": "place-105",
    "name": "옥천뼈구이농민뜨끈이 본점",
    "category": "식사",
    "zoneId": "daeheung",
    "durationMin": 55,
    "tags": [
      "food",
      "고기·구이"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%98%A5%EC%B2%9C%EB%BC%88%EA%B5%AC%EC%9D%B4%EB%86%8D%EB%AF%BC%EB%9C%A8%EB%81%88%EC%9D%B4%20%EB%B3%B8%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%98%A5%EC%B2%9C%EB%BC%88%EA%B5%AC%EC%9D%B4%EB%86%8D%EB%AF%BC%EB%9C%A8%EB%81%88%EC%9D%B4%20%EB%B3%B8%EC%A0%90",
    "description": "월~토 11:00~20:00 안내 / 일요일 운영 여부는 방문 전 확인 추천 / 뼈구이 양이 많은 편이라 2인 이상 방문에 특히 적합",
    "active": true
  },
  {
    "id": "place-106",
    "name": "땡큐베리머치",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%95%A1%ED%81%90%EB%B2%A0%EB%A6%AC%EB%A8%B8%EC%B9%98%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%95%A1%ED%81%90%EB%B2%A0%EB%A6%AC%EB%A8%B8%EC%B9%98%20%EB%8C%80%EC%A0%84",
    "description": "케이크 종류가 많지만 인기 제품은 늦은 시간 품절될 수 있음 / 포장 수요도 많은 편 / 방문 당일 최신 영업시간 확인 추천",
    "active": true
  },
  {
    "id": "place-107",
    "name": "커닝",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%BB%A4%EB%8B%9D%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%BB%A4%EB%8B%9D%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99",
    "description": "매일 11:00~24:00 / 테이블링 원격줄서기 가능 / 주말과 저녁 시간에는 대기 가능",
    "active": true
  },
  {
    "id": "place-108",
    "name": "콜드버터 베이크샵",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 30,
    "tags": [
      "food",
      "베이커리"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%BD%9C%EB%93%9C%EB%B2%84%ED%84%B0%20%EB%B2%A0%EC%9D%B4%ED%81%AC%EC%83%B5"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%BD%9C%EB%93%9C%EB%B2%84%ED%84%B0%20%EB%B2%A0%EC%9D%B4%ED%81%AC%EC%83%B5",
    "description": "매일 12:00~19:00 / 주차불가 / 인기 크림 소금빵은 오후에 소진될 수 있어 빵 종류를 많이 보려면 이른 방문 추천",
    "active": true
  },
  {
    "id": "place-109",
    "name": "처치앤댄스홀",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%B2%98%EC%B9%98%EC%95%A4%EB%8C%84%EC%8A%A4%ED%99%80%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%B2%98%EC%B9%98%EC%95%A4%EB%8C%84%EC%8A%A4%ED%99%80%20%EB%8C%80%EC%A0%84",
    "description": "월요일 휴무 / 화~목 11:30~20:00 / 금~일 11:30~22:00 / 공연·행사일에는 일반 카페 이용 방식이 달라질 수 있어 SNS 일정 확인 추천",
    "active": true
  },
  {
    "id": "place-110",
    "name": "하이드아웃",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%95%98%EC%9D%B4%EB%93%9C%EC%95%84%EC%9B%83%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%95%98%EC%9D%B4%EB%93%9C%EC%95%84%EC%9B%83%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99",
    "description": "매일 11:30~22:00 / 주차불가 / 인기 케이크는 품절될 수 있음 / 좌석 혼잡 시 대기 가능",
    "active": true
  },
  {
    "id": "place-111",
    "name": "소슬",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%86%8C%EC%8A%AC%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%86%8C%EC%8A%AC%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99",
    "description": "매일 11:00~22:00 / 주차불가 / 노키즈존 안내 / 반려동물 동반 가능 조건은 방문 전 확인 추천",
    "active": true
  },
  {
    "id": "place-112",
    "name": "대흥동커피",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%ED%9D%A5%EB%8F%99%EC%BB%A4%ED%94%BC%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%ED%9D%A5%EB%8F%99%EC%BB%A4%ED%94%BC%20%EB%8C%80%EC%A0%84",
    "description": "매일 12:30~23:00 / 비교적 늦게까지 운영 / 주차 가능 안내가 있으나 원도심 특성상 공간이 제한적일 수 있음",
    "active": true
  },
  {
    "id": "place-113",
    "name": "커피맨션문장",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EB%A7%A8%EC%85%98%EB%AC%B8%EC%9E%A5%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EB%A7%A8%EC%85%98%EB%AC%B8%EC%9E%A5%20%EB%8C%80%EC%A0%84",
    "description": "월~토 11:00~21:00 / 일요일 12:00~18:00 / 요일별 마감시간 차이 주의 / 주차 가능 안내",
    "active": true
  },
  {
    "id": "place-114",
    "name": "100시트",
    "category": "카페·디저트",
    "zoneId": "daeheung",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/100%EC%8B%9C%ED%8A%B8%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/100%EC%8B%9C%ED%8A%B8%20%EB%8C%80%EC%A0%84%20%EB%8C%80%ED%9D%A5%EB%8F%99",
    "description": "매일 12:00~21:00 / 수플레 메뉴는 조리시간이 걸릴 수 있어 일정이 촉박한 즉흥여행에서는 여유시간 확보 추천",
    "active": true
  },
  {
    "id": "place-115",
    "name": "대흥동 문화예술의 거리",
    "category": "볼거리·문화·체험",
    "zoneId": "daeheung",
    "durationMin": 65,
    "tags": [
      "walk",
      "photo",
      "액티비티"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%ED%9D%A5%EB%8F%99%20%EB%AC%B8%ED%99%94%EC%98%88%EC%88%A0%EC%9D%98%EA%B1%B0%EB%A6%AC"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%ED%9D%A5%EB%8F%99%20%EB%AC%B8%ED%99%94%EC%98%88%EC%88%A0%EC%9D%98%EA%B1%B0%EB%A6%AC",
    "description": "거리 자체는 상시 이용 가능 / 갤러리·공방·소극장별 운영시간과 휴무가 모두 다르므로 특정 공간 방문 시 개별 확인 필요",
    "active": true
  },
  {
    "id": "place-116",
    "name": "대흥동성당",
    "category": "볼거리·문화·체험",
    "zoneId": "daeheung",
    "durationMin": 30,
    "tags": [
      "photo",
      "공간·건축"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%ED%9D%A5%EB%8F%99%EC%84%B1%EB%8B%B9%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%ED%9D%A5%EB%8F%99%EC%84%B1%EB%8B%B9%20%EB%8C%80%EC%A0%84",
    "description": "실제 종교시설이므로 미사·행사 중에는 내부 관광을 자제하고 조용히 관람 / 내부 개방 여부는 현장 상황에 따라 달라질 수 있음",
    "active": true
  },
  {
    "id": "place-117",
    "name": "이공갤러리",
    "category": "볼거리·문화·체험",
    "zoneId": "daeheung",
    "durationMin": 30,
    "tags": [
      "photo",
      "미술·전시"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9D%B4%EA%B3%B5%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9D%B4%EA%B3%B5%EA%B0%A4%EB%9F%AC%EB%A6%AC%20%EB%8C%80%EC%A0%84",
    "description": "전시 교체기간이나 전시가 없는 기간에는 관람 콘텐츠가 없을 수 있어 방문 당일 현재 전시와 운영시간 확인 필수",
    "active": true
  },
  {
    "id": "place-118",
    "name": "대흥동 소극장 거리",
    "category": "볼거리·문화·체험",
    "zoneId": "daeheung",
    "durationMin": 105,
    "tags": [
      "anything",
      "공연·관람"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%ED%9D%A5%EB%8F%99%20%EC%86%8C%EA%B7%B9%EC%9E%A5"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%ED%9D%A5%EB%8F%99%20%EC%86%8C%EA%B7%B9%EC%9E%A5",
    "description": "상설 관광지가 아니라 공연 일정형 콘텐츠 / 당일 공연 유무·예매·잔여석을 반드시 확인해야 하므로 완전 즉흥 코스에서는 후보형으로 활용 추천",
    "active": true
  },
  {
    "id": "place-119",
    "name": "버기즈 어은점",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 50,
    "tags": [
      "food",
      "기타 식사"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%B2%84%EA%B8%B0%EC%A6%88%20%EC%96%B4%EC%9D%80%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%B2%84%EA%B8%B0%EC%A6%88%20%EC%96%B4%EC%9D%80%EC%A0%90",
    "description": "매일 11:10~20:30 / 라스트오더 19:50 / 점심시간 웨이팅 가능 / 매장 앞 주차공간이 매우 적어 도보 방문 추천",
    "active": true
  },
  {
    "id": "place-120",
    "name": "잇마이타이 어은점",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 55,
    "tags": [
      "food",
      "카레"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9E%87%EB%A7%88%EC%9D%B4%ED%83%80%EC%9D%B4%20%EC%96%B4%EC%9D%80%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9E%87%EB%A7%88%EC%9D%B4%ED%83%80%EC%9D%B4%20%EC%96%B4%EC%9D%80%EC%A0%90",
    "description": "11:00~21:00 / 브레이크타임 15:00~17:00 / 라스트오더 14:30·20:30 / 늦은 시간 재료 소진 가능 / 최신 휴무일 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-121",
    "name": "반마이",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 55,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%B0%98%EB%A7%88%EC%9D%B4%20%EB%8C%80%EC%A0%84%20%EC%96%B4%EC%9D%80%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%B0%98%EB%A7%88%EC%9D%B4%20%EB%8C%80%EC%A0%84%20%EC%96%B4%EC%9D%80%EB%8F%99",
    "description": "매일 11:00~21:00 / 브레이크타임 15:30~17:00 / 점심시간 대기 가능 / 주차불가 / 캐치테이블 운영 여부 확인 추천",
    "active": true
  },
  {
    "id": "place-122",
    "name": "제면소의하루 어은점",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 50,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%A0%9C%EB%A9%B4%EC%86%8C%EC%9D%98%ED%95%98%EB%A3%A8%20%EC%96%B4%EC%9D%80%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%A0%9C%EB%A9%B4%EC%86%8C%EC%9D%98%ED%95%98%EB%A3%A8%20%EC%96%B4%EC%9D%80%EC%A0%90",
    "description": "11:00~20:30 / 브레이크타임 14:00~16:30 / 라스트오더 20:00 / 주차공간이 거의 없어 도보 방문 추천",
    "active": true
  },
  {
    "id": "place-123",
    "name": "알로호모라",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 105,
    "tags": [
      "food",
      "photo",
      "기타 식사"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%95%8C%EB%A1%9C%ED%98%B8%EB%AA%A8%EB%9D%BC%20%EC%96%B4%EC%9D%80%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%95%8C%EB%A1%9C%ED%98%B8%EB%AA%A8%EB%9D%BC%20%EC%96%B4%EC%9D%80%EB%8F%99",
    "description": "예약이 필요한 경우가 많고 일반 식당보다 체험 요소가 강함 / 운영일·예약시간·이용방식이 변동될 수 있어 반드시 사전 확인 추천",
    "active": true
  },
  {
    "id": "place-124",
    "name": "딤섬관",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "중식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%94%A4%EC%84%AC%EA%B4%80%20%EB%8C%80%EC%A0%84%20%EA%B6%81%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%94%A4%EC%84%AC%EA%B4%80%20%EB%8C%80%EC%A0%84%20%EA%B6%81%EB%8F%99",
    "description": "인기 시간대 웨이팅 가능 / 캐치테이블 줄서기 활용 가능 / 일부 메뉴 조기 소진 가능 / 최신 영업시간 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-125",
    "name": "테테",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "일식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%85%8C%ED%85%8C%20%EA%B6%81%EB%8F%99%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%85%8C%ED%85%8C%20%EA%B6%81%EB%8F%99%20%EB%8C%80%EC%A0%84",
    "description": "인기 매장이라 오픈 직후부터 대기가 생길 수 있음 / 휴무일이 있으므로 방문 당일 지도 확인 추천",
    "active": true
  },
  {
    "id": "place-126",
    "name": "마인네하우스",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 50,
    "tags": [
      "food",
      "기타 식사"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%A7%88%EC%9D%B8%EB%84%A4%ED%95%98%EC%9A%B0%EC%8A%A4%20%EA%B6%81%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%A7%88%EC%9D%B8%EB%84%A4%ED%95%98%EC%9A%B0%EC%8A%A4%20%EA%B6%81%EB%8F%99",
    "description": "대학가 식당 특성상 점심·저녁 피크타임 대기 가능 / 주차보다는 대중교통·도보 방문 추천 / 최신 휴무일 당일 확인",
    "active": true
  },
  {
    "id": "place-127",
    "name": "리코타코",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 55,
    "tags": [
      "food",
      "멕시칸"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%A6%AC%EC%BD%94%ED%83%80%EC%BD%94%20%EA%B6%81%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%A6%AC%EC%BD%94%ED%83%80%EC%BD%94%20%EA%B6%81%EB%8F%99",
    "description": "점심·저녁 시간에는 대학생 방문이 많아 대기 가능 / 골목 주차가 어려워 도보 이용 추천 / 최신 영업시간 확인",
    "active": true
  },
  {
    "id": "place-128",
    "name": "최진엽샤브샤브 충남대",
    "category": "식사",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "기타 식사"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%B5%9C%EC%A7%84%EC%97%BD%EC%83%A4%EB%B8%8C%EC%83%A4%EB%B8%8C%20%EC%B6%A9%EB%82%A8%EB%8C%80"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%B5%9C%EC%A7%84%EC%97%BD%EC%83%A4%EB%B8%8C%EC%83%A4%EB%B8%8C%20%EC%B6%A9%EB%82%A8%EB%8C%80",
    "description": "식사시간에는 학생 손님이 많아 혼잡할 수 있음 / 셀프바 운영 방식·가격은 변동 가능해 현장 확인 추천",
    "active": true
  },
  {
    "id": "place-129",
    "name": "파티세리 소신",
    "category": "카페·디저트",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "베이커리"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%8C%8C%ED%8B%B0%EC%84%B8%EB%A6%AC%20%EC%86%8C%EC%8B%A0%20%EA%B6%81%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%8C%8C%ED%8B%B0%EC%84%B8%EB%A6%AC%20%EC%86%8C%EC%8B%A0%20%EA%B6%81%EB%8F%99",
    "description": "매일 11:30~21:50 / 시즌에 따라 디저트 라인업 변경 / 인기 꿈돌이·시즌 디저트는 오후에 품절될 수 있어 이른 방문 추천",
    "active": true
  },
  {
    "id": "place-130",
    "name": "덴하그 충남대",
    "category": "카페·디저트",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8D%B4%ED%95%98%EA%B7%B8%20%EC%B6%A9%EB%82%A8%EB%8C%80"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8D%B4%ED%95%98%EA%B7%B8%20%EC%B6%A9%EB%82%A8%EB%8C%80",
    "description": "조각케이크 종류와 디자인이 수시로 달라짐 / 인기 케이크 품절 가능 / 최신 영업시간은 방문 당일 지도 확인 추천",
    "active": true
  },
  {
    "id": "place-131",
    "name": "에이트",
    "category": "카페·디저트",
    "zoneId": "eoeun-gung",
    "durationMin": 90,
    "tags": [
      "food",
      "photo",
      "베이커리"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%97%90%EC%9D%B4%ED%8A%B8%20%EA%B6%81%EB%8F%99%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%97%90%EC%9D%B4%ED%8A%B8%20%EA%B6%81%EB%8F%99%20%EB%8C%80%EC%A0%84",
    "description": "대형카페라 주말·공휴일 이용객이 많음 / 베이커리는 늦은 오후 종류가 줄어들 수 있음 / 운영시간 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-132",
    "name": "커피인터뷰 충남대점",
    "category": "카페·디저트",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "공간형카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EC%9D%B8%ED%84%B0%EB%B7%B0%20%EC%B6%A9%EB%82%A8%EB%8C%80"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EC%9D%B8%ED%84%B0%EB%B7%B0%20%EC%B6%A9%EB%82%A8%EB%8C%80",
    "description": "야외 좌석은 날씨 영향이 큼 / 주말에는 방문객이 많아 자리 확보가 어려울 수 있음 / 전용 주차공간 있음",
    "active": true
  },
  {
    "id": "place-133",
    "name": "리틀타운커피스탠드",
    "category": "카페·디저트",
    "zoneId": "eoeun-gung",
    "durationMin": 50,
    "tags": [
      "food",
      "photo",
      "스페셜티커피"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%A6%AC%ED%8B%80%ED%83%80%EC%9A%B4%EC%BB%A4%ED%94%BC%EC%8A%A4%ED%83%A0%EB%93%9C"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%A6%AC%ED%8B%80%ED%83%80%EC%9A%B4%EC%BB%A4%ED%94%BC%EC%8A%A4%ED%83%A0%EB%93%9C",
    "description": "매일 11:00~21:00 / 라스트오더 20:30 / 매장이 작은 편이라 피크타임 자리 부족 가능 / 테이크아웃 활용 추천",
    "active": true
  },
  {
    "id": "place-134",
    "name": "카페프로필 유성직영점",
    "category": "카페·디저트",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%B9%B4%ED%8E%98%ED%94%84%EB%A1%9C%ED%95%84%20%EC%9C%A0%EC%84%B1%EC%A7%81%EC%98%81%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%B9%B4%ED%8E%98%ED%94%84%EB%A1%9C%ED%95%84%20%EC%9C%A0%EC%84%B1%EC%A7%81%EC%98%81%EC%A0%90",
    "description": "매일 11:00~24:00 / 라스트오더 23:30 / 저녁 이후 대학생 이용객이 많을 수 있음",
    "active": true
  },
  {
    "id": "place-135",
    "name": "글로리데이즈",
    "category": "카페·디저트",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "walk",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B8%80%EB%A1%9C%EB%A6%AC%EB%8D%B0%EC%9D%B4%EC%A6%88%20%EA%B6%81%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B8%80%EB%A1%9C%EB%A6%AC%EB%8D%B0%EC%9D%B4%EC%A6%88%20%EA%B6%81%EB%8F%99",
    "description": "주말 오후에는 좌석이 거의 차는 경우가 있음 / 골목 주차가 어려워 도보 방문 추천 / 최신 운영시간 확인",
    "active": true
  },
  {
    "id": "place-136",
    "name": "바리스타빈",
    "category": "카페·디저트",
    "zoneId": "eoeun-gung",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%B0%94%EB%A6%AC%EC%8A%A4%ED%83%80%EB%B9%88%20%EA%B6%81%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%B0%94%EB%A6%AC%EC%8A%A4%ED%83%80%EB%B9%88%20%EA%B6%81%EB%8F%99",
    "description": "야외공간은 계절·날씨 영향이 큼 / 운영시간 및 휴무일은 방문 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-137",
    "name": "유림공원",
    "category": "산책·야간",
    "zoneId": "eoeun-gung",
    "durationMin": 65,
    "tags": [
      "walk",
      "하천·수변"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9C%A0%EB%A6%BC%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9C%A0%EB%A6%BC%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84",
    "description": "이용료 무료 / 상시 개방 / 계절별 행사·국화축제 기간에는 방문객이 매우 많을 수 있음 / 야간 산책 가능",
    "active": true
  },
  {
    "id": "place-138",
    "name": "KAIST 본원 캠퍼스",
    "category": "볼거리·문화·체험",
    "zoneId": "eoeun-gung",
    "durationMin": 65,
    "tags": [
      "anything",
      "과학·교육"
    ],
    "roles": [
      "anchor",
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/KAIST%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/KAIST%20%EB%8C%80%EC%A0%84",
    "description": "대학 연구·교육 공간이므로 연구동 내부 무단 출입은 피하고 공개된 캠퍼스 산책 동선 중심 이용 추천 / 행사·시험기간에는 일부 시설 이용 제한 가능",
    "active": true
  },
  {
    "id": "place-139",
    "name": "충남대학교 캠퍼스",
    "category": "산책·야간",
    "zoneId": "eoeun-gung",
    "durationMin": 65,
    "tags": [
      "walk",
      "공원·녹지"
    ],
    "roles": [
      "anchor",
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%B6%A9%EB%82%A8%EB%8C%80%ED%95%99%EA%B5%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%B6%A9%EB%82%A8%EB%8C%80%ED%95%99%EA%B5%90",
    "description": "교육시설이므로 강의동 내부보다는 야외 캠퍼스 중심 산책 추천 / 학사 일정·학교 행사에 따라 일부 구간 통제 가능",
    "active": true
  },
  {
    "id": "place-140",
    "name": "궁동 로데오거리",
    "category": "산책·야간",
    "zoneId": "eoeun-gung",
    "durationMin": 45,
    "tags": [
      "walk",
      "골목산책"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B6%81%EB%8F%99%20%EB%A1%9C%EB%8D%B0%EC%98%A4%EA%B1%B0%EB%A6%AC"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B6%81%EB%8F%99%20%EB%A1%9C%EB%8D%B0%EC%98%A4%EA%B1%B0%EB%A6%AC",
    "description": "거리 자체는 상시 이용 가능 / 낮보다는 오후~저녁에 상권이 활발함 / 주말 밤에는 다소 붐빌 수 있고 주차가 매우 어려워 도보 추천",
    "active": true
  },
  {
    "id": "place-141",
    "name": "대전 스타트업파크 어궁동 일대",
    "category": "볼거리·문화·체험",
    "zoneId": "eoeun-gung",
    "durationMin": 30,
    "tags": [
      "photo",
      "공간·건축"
    ],
    "roles": [
      "discovery"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%20%EC%8A%A4%ED%83%80%ED%8A%B8%EC%97%85%ED%8C%8C%ED%81%AC"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%8C%80%EC%A0%84%20%EC%8A%A4%ED%83%80%ED%8A%B8%EC%97%85%ED%8C%8C%ED%81%AC",
    "description": "일반 관광시설보다는 창업기업·업무공간 성격이 강해 내부 상시 관람 목적보다는 거리 산책·행사 개최 시 방문 콘텐츠로 추천 / 행사 일정 별도 확인",
    "active": true
  },
  {
    "id": "place-142",
    "name": "무라텐",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 55,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%AC%B4%EB%9D%BC%ED%85%90%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%AC%B4%EB%9D%BC%ED%85%90%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "월요일 휴무 / 화~일 11:30~21:00 / 인기 시간대 대기 가능 / 주차 가능하지만 공간이 넉넉하지 않을 수 있음",
    "active": true
  },
  {
    "id": "place-143",
    "name": "오모리 생바지락 손칼국수",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 55,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%98%A4%EB%AA%A8%EB%A6%AC%20%EC%83%9D%EB%B0%94%EC%A7%80%EB%9D%BD%20%EC%86%90%EC%B9%BC%EA%B5%AD%EC%88%98"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%98%A4%EB%AA%A8%EB%A6%AC%20%EC%83%9D%EB%B0%94%EC%A7%80%EB%9D%BD%20%EC%86%90%EC%B9%BC%EA%B5%AD%EC%88%98",
    "description": "식사시간에는 가족 단위 방문객이 많아 대기 가능 / 최신 브레이크타임과 휴무는 방문 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-144",
    "name": "밥하기싫은날 후루룩손칼국수",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 55,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%B0%A5%ED%95%98%EA%B8%B0%EC%8B%AB%EC%9D%80%EB%82%A0%20%ED%9B%84%EB%A3%A8%EB%A3%A9%EC%86%90%EC%B9%BC%EA%B5%AD%EC%88%98"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%B0%A5%ED%95%98%EA%B8%B0%EC%8B%AB%EC%9D%80%EB%82%A0%20%ED%9B%84%EB%A3%A8%EB%A3%A9%EC%86%90%EC%B9%BC%EA%B5%AD%EC%88%98",
    "description": "점심·저녁 피크타임에는 대기가 생길 정도로 방문객이 많은 편 / 브레이크타임과 휴무는 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-145",
    "name": "겐로쿠우동 노은점",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 50,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B2%90%EB%A1%9C%EC%BF%A0%EC%9A%B0%EB%8F%99%20%EB%85%B8%EC%9D%80%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B2%90%EB%A1%9C%EC%BF%A0%EC%9A%B0%EB%8F%99%20%EB%85%B8%EC%9D%80%EC%A0%90",
    "description": "식사시간 웨이팅 가능 / 브레이크타임 있음 / 골목 상권이라 차량보다 도보 방문이 편리",
    "active": true
  },
  {
    "id": "place-146",
    "name": "진쇼우이",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 55,
    "tags": [
      "food",
      "중식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%A7%84%EC%87%BC%EC%9A%B0%EC%9D%B4%20%EB%8C%80%EC%A0%84%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%A7%84%EC%87%BC%EC%9A%B0%EC%9D%B4%20%EB%8C%80%EC%A0%84%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "정기휴무가 있는 매장으로 방문 당일 영업 여부 확인 추천 / 식사시간에는 혼잡 가능 / 주차 가능",
    "active": true
  },
  {
    "id": "place-147",
    "name": "킨토토 반석점",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 50,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%82%A8%ED%86%A0%ED%86%A0%20%EB%B0%98%EC%84%9D%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%82%A8%ED%86%A0%ED%86%A0%20%EB%B0%98%EC%84%9D%EC%A0%90",
    "description": "11:30~20:30 / 브레이크타임 15:00~17:00 / 라스트오더 14:30·20:00 / 재료 소진 시 조기마감 가능",
    "active": true
  },
  {
    "id": "place-148",
    "name": "피제리아하피",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "양식"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%94%BC%EC%A0%9C%EB%A6%AC%EC%95%84%ED%95%98%ED%94%BC%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%94%BC%EC%A0%9C%EB%A6%AC%EC%95%84%ED%95%98%ED%94%BC%20%EB%8C%80%EC%A0%84",
    "description": "화덕피자가 대표 메뉴 / 예약 가능 / 인기 시간대에는 좌석 대기 가능 / 최신 휴무 및 브레이크타임 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-149",
    "name": "권가제면소 대전반석점",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 50,
    "tags": [
      "food",
      "국수·면"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B6%8C%EA%B0%80%EC%A0%9C%EB%A9%B4%EC%86%8C%20%EB%8C%80%EC%A0%84%EB%B0%98%EC%84%9D%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B6%8C%EA%B0%80%EC%A0%9C%EB%A9%B4%EC%86%8C%20%EB%8C%80%EC%A0%84%EB%B0%98%EC%84%9D%EC%A0%90",
    "description": "좌석이 비교적 많고 가족 방문에도 적합 / 인기 시간에는 주문 대기 가능 / 최신 영업시간 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-150",
    "name": "고반식당 대전반석점",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "고기·구이"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B3%A0%EB%B0%98%EC%8B%9D%EB%8B%B9%20%EB%8C%80%EC%A0%84%EB%B0%98%EC%84%9D%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B3%A0%EB%B0%98%EC%8B%9D%EB%8B%B9%20%EB%8C%80%EC%A0%84%EB%B0%98%EC%84%9D%EC%A0%90",
    "description": "평일 17:00~22:30 / 주말 12:00~22:30 중심 / 식사시간 예약 추천 / 매장 앞 주차공간 제한적",
    "active": true
  },
  {
    "id": "place-151",
    "name": "운탄 본점",
    "category": "식사",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "고기·구이"
    ],
    "roles": [
      "meal"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9A%B4%ED%83%84%20%EB%B3%B8%EC%A0%90%20%EB%8C%80%EC%A0%84%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9A%B4%ED%83%84%20%EB%B3%B8%EC%A0%90%20%EB%8C%80%EC%A0%84%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "저녁 중심 식당이라 낮 여행 코스보다는 저녁 후보로 적합 / 고기 굽는 시간이 있어 일정에 여유 필요 / 최신 영업시간 확인 추천",
    "active": true
  },
  {
    "id": "place-152",
    "name": "커피인터뷰 반석점",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 90,
    "tags": [
      "food",
      "photo",
      "공간형카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EC%9D%B8%ED%84%B0%EB%B7%B0%20%EB%B0%98%EC%84%9D%EC%A0%90"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%BB%A4%ED%94%BC%EC%9D%B8%ED%84%B0%EB%B7%B0%20%EB%B0%98%EC%84%9D%EC%A0%90",
    "description": "주말에는 이용객이 많아 테라스·인기 좌석 경쟁 가능 / 차량 방문이 상대적으로 편한 곳",
    "active": true
  },
  {
    "id": "place-153",
    "name": "일하기 싫은 날, 다방",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%9D%BC%ED%95%98%EA%B8%B0%20%EC%8B%AB%EC%9D%80%20%EB%82%A0%20%EB%8B%A4%EB%B0%A9%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%9D%BC%ED%95%98%EA%B8%B0%20%EC%8B%AB%EC%9D%80%20%EB%82%A0%20%EB%8B%A4%EB%B0%A9%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "소규모 개인 카페로 좌석 상황에 따라 혼잡 가능 / 운영시간과 휴무가 변동될 수 있어 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-154",
    "name": "올드팟",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 50,
    "tags": [
      "food",
      "photo",
      "공간형카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%98%AC%EB%93%9C%ED%8C%9F%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%98%AC%EB%93%9C%ED%8C%9F%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "소규모 매장이라 좌석이 많지 않을 수 있음 / 최신 영업시간·휴무는 방문 당일 확인 추천",
    "active": true
  },
  {
    "id": "place-155",
    "name": "라다크",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "walk",
      "photo",
      "공간형카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%9D%BC%EB%8B%A4%ED%81%AC%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%9D%BC%EB%8B%A4%ED%81%AC%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "테라스 이용은 날씨 영향을 많이 받음 / 여름 낮·우천 시 실내 이용 추천 / 최신 휴무일 확인",
    "active": true
  },
  {
    "id": "place-156",
    "name": "순분정",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%88%9C%EB%B6%84%EC%A0%95%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%88%9C%EB%B6%84%EC%A0%95%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "파운드케이크 등 디저트는 당일 재고에 따라 종류가 달라질 수 있음 / 인기 제품 품절 가능",
    "active": true
  },
  {
    "id": "place-157",
    "name": "로라네방앗간",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "베이커리"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%A1%9C%EB%9D%BC%EB%84%A4%EB%B0%A9%EC%95%97%EA%B0%84%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%A1%9C%EB%9D%BC%EB%84%A4%EB%B0%A9%EC%95%97%EA%B0%84%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "주말 오후에는 가족·데이트 방문객으로 혼잡할 수 있음 / 인기 베이커리는 늦은 오후 품절 가능",
    "active": true
  },
  {
    "id": "place-158",
    "name": "소로소로",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%86%8C%EB%A1%9C%EC%86%8C%EB%A1%9C%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%86%8C%EB%A1%9C%EC%86%8C%EB%A1%9C%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "10:00~22:00 중심 / 매장이 크지 않아 피크타임에는 자리 부족 가능 / 수제 디저트는 품절 가능",
    "active": true
  },
  {
    "id": "place-159",
    "name": "가치읻다",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "디저트카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EA%B0%80%EC%B9%98%EC%9D%BB%EB%8B%A4%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EA%B0%80%EC%B9%98%EC%9D%BB%EB%8B%A4%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "요일별 운영시간이 다르고 정기휴무가 있어 방문 전 확인 필수 / 일부 요일은 18:00에 일찍 마감",
    "active": true
  },
  {
    "id": "place-160",
    "name": "모드니",
    "category": "카페·디저트",
    "zoneId": "banseok",
    "durationMin": 75,
    "tags": [
      "food",
      "photo",
      "공간형카페"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%AA%A8%EB%93%9C%EB%8B%88%20%EB%B0%98%EC%84%9D%EB%8F%99"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%AA%A8%EB%93%9C%EB%8B%88%20%EB%B0%98%EC%84%9D%EB%8F%99",
    "description": "현재 공개된 최신 영업시간 정보가 제한적이라 방문 전 네이버지도 확인 추천 / 차량 이동이 더 편리한 위치",
    "active": true
  },
  {
    "id": "place-161",
    "name": "반석천 산책로",
    "category": "산책·야간",
    "zoneId": "banseok",
    "durationMin": 45,
    "tags": [
      "walk",
      "photo",
      "하천·수변"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EB%B0%98%EC%84%9D%EC%B2%9C%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EB%B0%98%EC%84%9D%EC%B2%9C%20%EB%8C%80%EC%A0%84",
    "description": "상시 이용 가능 / 비가 많이 온 날이나 하천 수위가 높은 날에는 하천변 진입 주의 / 2026년 수국·배롱나무 등 식재 정비 진행",
    "active": true
  },
  {
    "id": "place-162",
    "name": "양지말공원",
    "category": "산책·야간",
    "zoneId": "banseok",
    "durationMin": 20,
    "tags": [
      "walk",
      "공원·녹지"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%EC%96%91%EC%A7%80%EB%A7%90%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%EC%96%91%EC%A7%80%EB%A7%90%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84",
    "description": "관광지라기보다는 근린공원 성격이 강해 단독 목적지보다는 식사·카페 사이 짧은 휴식용으로 추천",
    "active": true
  },
  {
    "id": "place-163",
    "name": "회병골공원",
    "category": "산책·야간",
    "zoneId": "banseok",
    "durationMin": 30,
    "tags": [
      "walk",
      "공원·녹지"
    ],
    "roles": [
      "stay-extender"
    ],
    "mapLinks": {
      "naver": "https://map.naver.com/p/search/%ED%9A%8C%EB%B3%91%EA%B3%A8%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84"
    },
    "mapUrl": "https://map.naver.com/p/search/%ED%9A%8C%EB%B3%91%EA%B3%A8%EA%B3%B5%EC%9B%90%20%EB%8C%80%EC%A0%84",
    "description": "별도 관광시설은 거의 없어 단독 목적지로는 추천도가 낮고 주변 식당·카페와 묶어 방문하는 방식이 적합",
    "active": true
  }
] as const satisfies readonly PlaceCandidate[];
