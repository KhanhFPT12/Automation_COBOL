export type ActivePage =
  | 'home'
  | 'converter'
  | 'data-mapping'
  | 'auth-guide'
  | 'architecture-overview'
  | 'modernization-flows'
  | 'ai-prompt-engineering'
  | 'login'
  | 'register'
  | 'product-experience'
  | 'book-meeting'
  | 'my-meetings'
  | 'admin-dashboard'
  | 'admin-users'
  | 'admin-user-detail'
  | 'admin-meetings'
  | 'admin-conversions'
  | 'admin-reports'
  | 'admin-settings'
  | 'meeting-detail'
  | 'change-password'
  | 'profile'
  | 'admin-chat';

export interface UserSession {
  email: string | null;
  name: string | null;
  isLoggedIn: boolean;
  token: string | null;
  accountType: 'INDIVIDUAL' | 'ENTERPRISE' | null;
  role: 'USER' | 'ENTERPRISE_ADMIN' | 'ADMIN' | null;
}

// ─── Meeting ────────────────────────────────────────────────────────
export type MeetingStatus = 'Pending' | 'Approved' | 'Rejected' | 'Cancelled' | 'Completed';
export type MeetingDuration = 30 | 60 | 90;

export interface Meeting {
  _id: string;
  user: string | { _id: string; fullName?: string; email?: string; companyName?: string; businessEmail?: string };
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  topic: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  timeZone: string;
  duration: MeetingDuration;
  status: MeetingStatus;
  rejectionReason: string;
  meetingLink: string;
  googleEventId: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookMeetingPayload {
  fullName: string;
  companyName?: string;
  email: string;
  phone: string;
  topic: string;
  description?: string;
  preferredDate: string;
  preferredTime: string;
  timeZone: string;
  duration: MeetingDuration;
}

// ─── Notification ───────────────────────────────────────────────────
export type NotificationType =
  | 'meeting_approved'
  | 'meeting_rejected'
  | 'meeting_cancelled'
  | 'meeting_reminder'
  | 'meeting_completed';

export interface AppNotification {
  _id: string;
  type: NotificationType;
  title: string;
  message: string;
  meeting: string | null;
  isRead: boolean;
  createdAt: string;
}

// ─── Admin: users ────────────────────────────────────────────────────
export interface AdminUser {
  _id: string;
  fullName?: string;
  email?: string;
  companyName?: string;
  businessEmail?: string;
  phone: string;
  accountType: 'INDIVIDUAL' | 'ENTERPRISE';
  role: 'USER' | 'ENTERPRISE_ADMIN' | 'ADMIN';
  isEmailVerified: boolean;
  isActive: boolean;
  convertCount: number;
  credits: number | null;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversionLogEntry {
  _id: string;
  user: { _id: string; fullName?: string; email?: string; companyName?: string; businessEmail?: string } | null;
  fileType: 'bms' | 'dspf';
  screenCount: number;
  success: boolean;
  errorMessage: string;
  createdAt: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalMeetings: number;
  pendingMeetings: number;
  approvedMeetings: number;
  rejectedMeetings: number;
  cancelledMeetings: number;
  completedMeetings: number;
  totalConversions: number;
}

export interface DashboardCharts {
  meetingsPerDay: { date: string; count: number }[];
  conversionsPerDay: { date: string; count: number }[];
}

export interface ActivityItem {
  type: 'user_registered' | 'meeting_update' | 'conversion';
  message: string;
  timestamp: string;
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