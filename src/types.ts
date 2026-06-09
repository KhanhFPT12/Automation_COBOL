export type ActivePage = 'home' | 'converter' | 'data-mapping' | 'auth-guide' | 'login' | 'register';

export interface UserSession {
  email: string | null;
  name: string | null;
  isLoggedIn: boolean;
}

export interface CodeConversionState {
  sourceCode: string;
  convertedCode: string;
  explanation: string;
  isConverting: boolean;
  progressStep: string;
  fileType: 'COBOL' | 'RPG' | 'Assembly';
  targetType: 'Java 17 (Spring Boot)' | 'Nodejs Express (TS)' | 'Python FastAPI';
  stats: {
    linesOfLegacy: number;
    linesOfModern: number;
    approximateSavedOpexPercentage: number;
  } | null;
}

export interface TypeMappingRow {
  cobol: string;
  java: string;
  strategy: string;
}

export interface ErrorCodeRow {
  status: number;
  code: string;
  description: string;
}