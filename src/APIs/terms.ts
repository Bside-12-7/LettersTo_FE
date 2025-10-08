import {axiosInstance} from '@utils/http';

export interface TermsInfo {
  termsId: number;
  termsType: 'TERMS_OF_SERVICE' | 'PRIVACY' | 'MARKETING';
  termsVersionNumber: number;
  termsVersionContent: string;
  publishedAt: string;
}

export async function getTerms() {
  return await axiosInstance.get<TermsInfo[]>('/terms/json');
}
