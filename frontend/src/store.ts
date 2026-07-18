import type {
  ActivePage,
  AppNotification,
  BookMeetingPayload,
  CodeConversionState,
  Meeting,
  UserSession,
} from './types';
import { create } from "zustand";
import { authApi } from './services/authApi';
import { meetingApi } from './services/meetingApi';
import { notificationApi } from './services/notificationApi';

interface AppStore {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;

  session: UserSession;
  isAuthLoading: boolean;
  authError: string | null;
  loginUser: (email: string, password: string) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
  initAuth: () => Promise<void>;

  conversion: CodeConversionState;
  setSourceCode: (code: string) => void;
  setFileType: (type: "COBOL" | "RPG" | "Assembly") => void;
  setTargetType: (
    type: "Java 17 (Spring Boot)" | "Nodejs Express (TS)" | "Python FastAPI",
  ) => void;
  runConversion: () => Promise<void>;
  resetConversion: () => void;

  // ─── Meetings (user-side) ──────────────────────────────────────
  myMeetings: Meeting[];
  isMeetingsLoading: boolean;
  isBookingMeeting: boolean;
  bookMeetingError: string | null;
  bookMeetingSuccess: string | null;
  fetchMyMeetings: () => Promise<void>;
  bookMeeting: (payload: BookMeetingPayload) => Promise<boolean>;
  cancelMeeting: (id: string) => Promise<void>;
  clearBookMeetingStatus: () => void;

  // ─── Notifications ──────────────────────────────────────────────
  notifications: AppNotification[];
  unreadNotificationCount: number;
  fetchNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // ─── Admin: which user is open in Admin > User Management > Detail ────
  adminSelectedUserId: string | null;
  setAdminSelectedUserId: (id: string | null) => void;
}

export const SAMPLES = {
  COBOL: {
    customerRecord: `01  WS-CUSTOMER-RECORD.
    05  WS-CUST-ID          PIC 9(08).
    05  WS-CUST-NAME        PIC X(30).
    05  WS-CUST-BALANCE     PIC S9(13)V99 COMP-3.
    05  WS-CUST-STATUS      PIC X(01).
        88  CUST-ACTIVE     VALUE 'A'.
        88  CUST-INACTIVE   VALUE 'I'.`,
    invoiceItem: `01  WS-INVOICE-DETAILS.
    05  WS-INV-NUMBER       PIC 9(10).
    05  WS-QTY              PIC 9(05).
    05  WS-UNIT-PRICE       PIC S9(07)V99 COMP-3.
    05  WS-TAX-RATE         PIC S9(03)V999 COMP-3.
    05  WS-DISCOUNT-AMT     PIC S9(05)V99 COMP-3.`,
    employeeDetails: `01  WS-EMPLOYEE-DATA.
    05  WS-EMP-ID           PIC 9(06).
    05  WS-FIRST-NAME       PIC X(15).
    05  WS-LAST-NAME        PIC X(20).
    05  WS-DEPT-ID          PIC 9(04).
    05  WS-SALARY           PIC S9(09)V99 COMP-3.
    05  WS-HIRE-DATE        PIC 9(08).`,
  },
  RPG: {
    customerRecord: `dcl-f CUSTOMER disk(*ext) usage(*update) rename(CUSTREC:CUST);
dcl-s searchId char(10);
dcl-s custName varchar(50);
dcl-s balance  packed(15:2);
dcl-s status   char(1);

chain searchId CUSTOMER;
if %found(CUSTOMER);
  custName = CUST.NAME;
  balance = CUST.BAL;
  status = CUST.STATUS;
endif;`,
    invoiceItem: `dcl-s invoiceNum packed(10:0);
dcl-s quantity int(5);
dcl-s unitPrice packed(9:2);
dcl-s totalDue packed(15:2);

totalDue = quantity * unitPrice;`,
    employeeDetails: `dcl-s empId packed(6:0);
dcl-s hourlyRate packed(5:2);
dcl-s hoursWorked packed(4:1);
dcl-s grossPay packed(7:2);

grossPay = hourlyRate * hoursWorked;`,
  },
  Assembly: {
    customerRecord: `CUSTREC  CSECT
         USING *,15
         L     4,CUSTID
         C     4,MAXCUST
         BH    CUSTERR
         LA    5,CUSTTAB
         AR    5,4
         MVC   CUSTNAME,0(5)
         CLI   CUSTSTAT,C'A'
         BE    ACTIVE
         BR    14`,
    invoiceItem: `QTY      DC    F'120'
PRICE    DC    PL4'1950'        COMP-3 DECIMAL 19.50
TAX      DC    PL3'125'         COMP-3 DECIMAL 1.25%`,
    employeeDetails: `SALLOOP  S     2,2
         L     3,TEMP
         A     3,SALARY
         ST    3,TOTAL
         BR    14`,
  },
};

const DEFAULT_SOURCE = SAMPLES.COBOL.customerRecord;

const EMPTY_SESSION: UserSession = {
  email: null,
  name: null,
  isLoggedIn: false,
  token: null,
  accountType: null,
  role: null,
};

export const useAppStore = create<AppStore>((set, get) => ({
  activePage: "home",
  setActivePage: (page) => set({ activePage: page }),

  session: EMPTY_SESSION,
  isAuthLoading: false,
  authError: null,

  loginUser: async (email, password) => {
    set({ isAuthLoading: true, authError: null });
    try {
      const data = await authApi.login(email, password);
      const { token, user } = data;
      localStorage.setItem('alsm_token', token);
      set({
        session: {
          isLoggedIn: true,
          token,
          email: user.email || user.businessEmail || null,
          name: user.fullName || user.companyName || null,
          accountType: user.accountType,
          role: user.role,
        },
        activePage: 'home',
        isAuthLoading: false,
        authError: null,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      set({ authError: message, isAuthLoading: false });
    }
  },

  logout: () => {
    localStorage.removeItem('alsm_token');
    set({ session: EMPTY_SESSION, activePage: 'home' });
  },

  clearAuthError: () => set({ authError: null }),

  initAuth: async () => {
    const token = localStorage.getItem('alsm_token');
    if (!token) return;
    try {
      const data = await authApi.getMe();
      const { user } = data;
      set({
        session: {
          isLoggedIn: true,
          token,
          email: user.email || user.businessEmail || null,
          name: user.fullName || user.companyName || null,
          accountType: user.accountType,
          role: user.role,
        },
      });
    } catch {
      localStorage.removeItem('alsm_token');
      set({ session: EMPTY_SESSION });
    }
  },

  conversion: {
    sourceCode: DEFAULT_SOURCE,
    convertedCode: "",
    explanation: "",
    isConverting: false,
    progressStep: "",
    fileType: "COBOL",
    targetType: "Java 17 (Spring Boot)",
    stats: null,
  },
  setSourceCode: (code) =>
    set((state) => ({
      conversion: { ...state.conversion, sourceCode: code },
    })),
  setFileType: (type) =>
    set((state) => {
      const newSource = SAMPLES[type].customerRecord;
      return {
        conversion: {
          ...state.conversion,
          fileType: type,
          sourceCode: newSource,
          convertedCode: "",
          explanation: "",
          stats: null,
        },
      };
    }),
  setTargetType: (type) =>
    set((state) => ({
      conversion: { ...state.conversion, targetType: type },
    })),
  runConversion: async () => {
    const { sourceCode, fileType, targetType } = get().conversion;
    set((state) => ({
      conversion: {
        ...state.conversion,
        isConverting: true,
        progressStep: "Initializing parsing agent...",
      },
    }));

    const steps = [
      "Scanning PIC/Packed field variables...",
      "Mapping type equivalences and precision levels...",
      "Generating target abstractions and class declarations...",
      "Compiling Spring JPA/Native code structures...",
      "Finalizing enterprise refactoring validation...",
    ];

    for (let i = 0; i < steps.length; i++) {
      await new Promise((resolve) => setTimeout(resolve, 350));
      set((state) => ({
        conversion: { ...state.conversion, progressStep: steps[i] },
      }));
    }

    try {
      const response = await fetch("/api/convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sourceCode, fileType, targetType }),
      });

      if (!response.ok) {
        throw new Error("Server conversion failed");
      }

      const result = await response.json();
      set((state) => ({
        conversion: {
          ...state.conversion,
          convertedCode: result.convertedCode,
          explanation: result.explanation,
          stats: result.stats || {
            linesOfLegacy: sourceCode.split("\n").length,
            linesOfModern: result.convertedCode.split("\n").length,
            approximateSavedOpexPercentage: 65,
          },
          isConverting: false,
          progressStep: "",
        },
      }));
    } catch (err: unknown) {
      console.error(err);
      set((state) => ({

        conversion: {
          ...state.conversion,
          isConverting: false,
          progressStep: "",
        },
      }));
    }
  },
  resetConversion: () =>
    set((state) => ({
      conversion: {
        ...state.conversion,
        convertedCode: "",
        explanation: "",
        stats: null,
        isConverting: false,
        progressStep: "",
      },
    })),

  // ─── Meetings (user-side) ──────────────────────────────────────
  myMeetings: [],
  isMeetingsLoading: false,
  isBookingMeeting: false,
  bookMeetingError: null,
  bookMeetingSuccess: null,

  fetchMyMeetings: async () => {
    set({ isMeetingsLoading: true });
    try {
      const { meetings } = await meetingApi.getMine();
      set({ myMeetings: meetings, isMeetingsLoading: false });
    } catch (err: unknown) {
      console.error(err);
      set({ isMeetingsLoading: false });
    }
  },

  bookMeeting: async (payload) => {
    set({ isBookingMeeting: true, bookMeetingError: null, bookMeetingSuccess: null });
    try {
      const data = await meetingApi.create(payload);
      set((state) => ({
        myMeetings: [data.meeting, ...state.myMeetings],
        isBookingMeeting: false,
        bookMeetingSuccess: data.message,
      }));
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to book meeting';
      set({ isBookingMeeting: false, bookMeetingError: message });
      return false;
    }
  },

  cancelMeeting: async (id) => {
    try {
      const { meeting } = await meetingApi.cancel(id);
      set((state) => ({
        myMeetings: state.myMeetings.map((m) => (m._id === id ? meeting : m)),
      }));
    } catch (err: unknown) {
      console.error(err);
    }
  },

  clearBookMeetingStatus: () => set({ bookMeetingError: null, bookMeetingSuccess: null }),

  // ─── Notifications ──────────────────────────────────────────────
  notifications: [],
  unreadNotificationCount: 0,

  fetchNotifications: async () => {
    try {
      const { notifications, unreadCount } = await notificationApi.getMine();
      set({ notifications, unreadNotificationCount: unreadCount });
    } catch (err: unknown) {
      console.error(err);
    }
  },

  markNotificationRead: async (id) => {
    try {
      await notificationApi.markAsRead(id);
      set((state) => ({
        notifications: state.notifications.map((n) => (n._id === id ? { ...n, isRead: true } : n)),
        unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
      }));
    } catch (err: unknown) {
      console.error(err);
    }
  },

  markAllNotificationsRead: async () => {
    try {
      await notificationApi.markAllAsRead();
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadNotificationCount: 0,
      }));
    } catch (err: unknown) {
      console.error(err);
    }
  },

  // ─── Admin: which user is open in Admin > User Management > Detail ────
  adminSelectedUserId: null,
  setAdminSelectedUserId: (id) => set({ adminSelectedUserId: id }),
}));
