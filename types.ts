export enum Classification {
  SAFE = 'Safe',
  SUSPICIOUS = 'Suspicious',
  PHISHING = 'Phishing',
}

export interface AnalysisResult {
  id: string;
  content: string;
  classification: Classification;
  reason: string;
  timestamp: string;
}

export type Translations = {
  appName: string;
  login: string;
  signup: string;
  logout: string;
  emailAddress: string;
  password: string;
  confirmPassword: string;
  dontHaveAccount: string;
  alreadyHaveAccount: string;
  getStarted: string;
  createAccount: string;
  mainHeader: string;
  mainSubheader: string;
  pasteEmail: string;
  pastePlaceholder: string;
  or: string;
  uploadFile: string;
  analyze: string;
  analyzing: string;
  analysisResult: string;
  verdict: string;
  reason: string;
  history: string;
  noHistory: string;
  error: string;
  errorDescription: string;
  fileReadError: string;
  [key: string]: string | { [key: string]: string };
};
