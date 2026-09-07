export const BASE_URL_TEST = 'http://15.165.100.80/api';
export const BASE_URL_PROD = 'http://13.209.1.181/api';

// 접속 서버는 이 파일에서만 결정한다.
// 화면/유틸에서 BASE_URL_TEST 를 직접 참조하면 프로덕션 빌드가 테스트 서버로
// 붙는 사고가 난다 — 약관 웹뷰가 실제로 그랬다.
// QA 용 릴리즈 빌드(TestFlight 등)로 테스트 서버를 봐야 할 때만 true 로 바꾸고,
// 스토어 배포 전에는 반드시 __DEV__ 로 되돌린다.
export const USE_TEST_SERVER = __DEV__;

export const BASE_URL = USE_TEST_SERVER ? BASE_URL_TEST : BASE_URL_PROD;
