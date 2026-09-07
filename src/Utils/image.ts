import {BASE_URL_PROD, BASE_URL_TEST} from '../Constants/common';

// 파일 URL 의 서버는 http.ts 의 baseURL 규칙과 반드시 일치해야 한다.
// 업로드는 현재 접속 중인 서버로 이루어지므로, 여기서 서버가 갈리면
// 개발/QA 빌드에서 방금 올린 이미지를 못 찾는다.
export const getImageUrl = (image: string) => {
  const baseUrl = __DEV__ ? BASE_URL_TEST : BASE_URL_PROD;
  return baseUrl + `/files/${image}`;
};
