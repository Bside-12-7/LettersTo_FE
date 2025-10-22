import {axiosInstance} from '@utils/http';

export interface TermsInfo {
  termsId: number;
  termsType: 'TERMS_OF_SERVICE' | 'PRIVACY' | 'MARKETING';
  termsVersionNumber: number;
  termsVersionContent: string;
  publishedAt: string;
}

export interface ConsentItem {
  termsType: 'TERMS_OF_SERVICE' | 'PRIVACY' | 'MARKETING';
  termsVersionNumber: number;
  agreed: boolean;
  requestedAt: string;
}

export interface RecordTermsReAgreementRequest {
  consents: ConsentItem[];
}

export interface RecordMarketingAgreementRequest {
  termsVersionNumber: number;
  agreed: boolean;
  requestedAt: string;
}

export async function getTerms() {
  return await axiosInstance.get<TermsInfo[]>('/terms/json');
}

export interface MemberTermsConsentResponse {
  TERMS_OF_SERVICE: boolean;
  PRIVACY: boolean;
  MARKETING: boolean;
}

export async function getMemberTermsConsent() {
  return await axiosInstance.get<MemberTermsConsentResponse>(
    '/member-terms-consent',
  );
}

export async function recordTermsReAgreement(
  request: RecordTermsReAgreementRequest,
) {
  return await axiosInstance.post(
    '/member-terms-consent/record-terms-re-agreement',
    request,
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );
}

export async function recordMarketingAgreement(
  request: RecordMarketingAgreementRequest,
) {
  return await axiosInstance.post(
    '/member-terms-consent/record-marketing-agreement',
    request,
  );
}
