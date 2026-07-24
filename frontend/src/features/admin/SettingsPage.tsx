import { useEffect, useState } from "react";
import {
  CalendarCheck2,
  Loader2,
  Unlink,
  ExternalLink,
  Landmark,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Trash2,
  Edit,
  Plus,
  X,
  ShieldCheck,
  Check,
  CreditCard,
  Settings,
} from "lucide-react";
import { adminApi } from "../../services/adminApi";

interface BankAccount {
  id: string;
  bin: string;
  accountNumber: string;
  accountName: string;
  isDefault: boolean;
  updatedAt: string;
}

interface AuditLog {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  createdAt: string;
  ipAddress: string;
}

interface AdminPlan {
  _id: string;
  name: string;
  slug: string;
  description: string;
  price_monthly: number | null;
  price_yearly: number | null;
  currency: string;
  limits: {
    max_projects: number | null;
    max_screens_per_month: number | null;
    max_storage_gb: number | null;
    max_team_members: number | null;
  };
  features: string[];
  is_active: boolean;
  display_order: number;
  badge_text: string;
  updatedAt: string;
}

const POPULAR_BANKS = [
  { name: "Vietcombank (VCB) - 970436", bin: "970436" },
  { name: "Techcombank (TCB) - 970407", bin: "970407" },
  { name: "MB Bank (MB) - 970422", bin: "970422" },
  { name: "VietinBank (CTG) - 970415", bin: "970415" },
  { name: "BIDV - 970418", bin: "970418" },
  { name: "ACB - 970416", bin: "970416" },
  { name: "TPBank - 970423", bin: "970423" },
  { name: "Sacombank - 970403", bin: "970403" },
  { name: "VPBank - 970432", bin: "970432" },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState<"bank" | "plans" | "calendar" | "audit">("bank");

  // Google Calendar States
  const [connected, setConnected] = useState(false);
  const [connectedEmail, setConnectedEmail] = useState<string | null>(null);
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [calendarBusy, setCalendarBusy] = useState(false);
  const [calendarError, setCalendarError] = useState("");

  // Bank Accounts list states
  const [accounts, setAccounts] = useState<BankAccount[]>([]);
  const [loadingBank, setLoadingBank] = useState(true);
  const [bankError, setBankError] = useState("");
  const [bankSuccess, setBankSuccess] = useState("");

  // Bank Account Form states (Add/Edit)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formBin, setFormBin] = useState("");
  const [formCustomBin, setFormCustomBin] = useState("");
  const [formIsCustomBin, setFormIsCustomBin] = useState(false);
  const [formAccountNumber, setFormAccountNumber] = useState("");
  const [formAccountName, setFormAccountName] = useState("");
  const [formIsDefault, setFormIsDefault] = useState(false);
  const [showFormAccountNumber, setShowFormAccountNumber] = useState(false);
  const [formSaving, setFormSaving] = useState(false);

  // Masking toggles for each bank account item
  const [visibleAccountIds, setVisibleAccountIds] = useState<Record<string, boolean>>({});

  // Audit Log states
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loadingLogs, setLoadingLogs] = useState(false);

  // Plans Config States
  const [plans, setPlans] = useState<AdminPlan[]>([]);
  const [loadingPlans, setLoadingPlans] = useState(true);
  const [isPlanFormOpen, setIsPlanFormOpen] = useState(false);
  const [editingPlanId, setEditingPlanId] = useState<string | null>(null);
  const [planName, setPlanName] = useState("");
  const [planDesc, setPlanDesc] = useState("");
  const [planPriceMonthly, setPlanPriceMonthly] = useState<number>(0);
  const [planPriceYearly, setPlanPriceYearly] = useState<number>(0);
  const [planLimitProjects, setPlanLimitProjects] = useState<string>("");
  const [planLimitScreens, setPlanLimitScreens] = useState<string>("");
  const [planLimitStorage, setPlanLimitStorage] = useState<string>("");
  const [planLimitTeam, setPlanLimitTeam] = useState<string>("");
  const [planFeatures, setPlanFeatures] = useState("");
  const [planBadge, setPlanBadge] = useState("");
  const [planOrder, setPlanOrder] = useState<number>(0);
  const [planIsActive, setPlanIsActive] = useState(true);
  const [planSaving, setPlanSaving] = useState(false);

  const showToastSuccess = (message: string) => {
    setBankSuccess(message);
    setTimeout(() => setBankSuccess(""), 3500);
  };

  const showToastError = (message: string) => {
    setBankError(message);
    setTimeout(() => setBankError(""), 4500);
  };

  const loadCalendarStatus = async () => {
    setLoadingCalendar(true);
    try {
      const data = await adminApi.getGoogleStatus();
      setConnected(data.connected);
      setConnectedEmail(data.connectedEmail);
    } catch (err: unknown) {
      setCalendarError(err instanceof Error ? err.message : "Failed to load Google Calendar status.");
    } finally {
      setLoadingCalendar(false);
    }
  };

  const loadBankSettings = async () => {
    setLoadingBank(true);
    try {
      const response = await adminApi.getBankAccounts();
      if (response.success) {
        setAccounts(response.data);
      }
    } catch (err: unknown) {
      showToastError(err instanceof Error ? err.message : "Failed to load bank accounts.");
    } finally {
      setLoadingBank(false);
    }
  };

  const loadPlans = async () => {
    setLoadingPlans(true);
    try {
      const response = await adminApi.getPlans();
      if (response.success) {
        setPlans(response.data);
      }
    } catch (err: unknown) {
      showToastError(err instanceof Error ? err.message : "Failed to load plans.");
    } finally {
      setLoadingPlans(false);
    }
  };

  const loadAuditLogs = async () => {
    setLoadingLogs(true);
    try {
      const response = await adminApi.getBankAccountAuditLogs();
      if (response.success) {
        setAuditLogs(response.data);
      }
    } catch (err: unknown) {
      console.error("Failed to load audit logs:", err);
    } finally {
      setLoadingLogs(false);
    }
  };

  useEffect(() => {
    void loadCalendarStatus();
    void loadBankSettings();
  }, []);

  useEffect(() => {
    if (activeTab === "audit") {
      void loadAuditLogs();
    } else if (activeTab === "plans") {
      void loadPlans();
    }
  }, [activeTab]);

  const connectCalendar = async () => {
    setCalendarBusy(true);
    setCalendarError("");
    try {
      const data = await adminApi.getGoogleConnectUrl();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setCalendarError(data.message || "Could not start Google connection.");
      }
    } catch (err: unknown) {
      setCalendarError(err instanceof Error ? err.message : "Could not start Google connection.");
    } finally {
      setCalendarBusy(false);
    }
  };

  const disconnectCalendar = async () => {
    if (!confirm("Disconnect Google Calendar? Approving meetings will no longer auto-create Meet links until reconnected.")) return;
    setCalendarBusy(true);
    try {
      await adminApi.disconnectGoogle();
      await loadCalendarStatus();
    } catch (err: unknown) {
      setCalendarError(err instanceof Error ? err.message : "Failed to disconnect.");
    } finally {
      setCalendarBusy(false);
    }
  };

  const openAddForm = () => {
    setEditingId(null);
    setFormBin("");
    setFormCustomBin("");
    setFormIsCustomBin(false);
    setFormAccountNumber("");
    setFormAccountName("");
    setFormIsDefault(false);
    setShowFormAccountNumber(false);
    setIsFormOpen(true);
  };

  const openEditForm = (account: BankAccount) => {
    setEditingId(account.id);
    const matchingBank = POPULAR_BANKS.find((b) => b.bin === account.bin);
    if (matchingBank) {
      setFormBin(account.bin);
      setFormIsCustomBin(false);
    } else {
      setFormBin("custom");
      setFormCustomBin(account.bin);
      setFormIsCustomBin(true);
    }
    setFormAccountNumber(account.accountNumber);
    setFormAccountName(account.accountName);
    setFormIsDefault(account.isDefault);
    setShowFormAccountNumber(false);
    setIsFormOpen(true);
  };

  const saveBankAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSaving(true);

    const targetBin = formIsCustomBin ? formCustomBin.trim() : formBin;
    if (!/^\d{6}$/.test(targetBin)) {
      showToastError("BIN ngân hàng phải có đúng 6 chữ số.");
      setFormSaving(false);
      return;
    }
    if (!/^\d{6,30}$/.test(formAccountNumber.trim())) {
      showToastError("Số tài khoản phải chứa từ 6 đến 30 chữ số.");
      setFormSaving(false);
      return;
    }
    if (!formAccountName.trim()) {
      showToastError("Tên chủ tài khoản là bắt buộc.");
      setFormSaving(false);
      return;
    }

    try {
      if (editingId) {
        // Edit flow
        const response = await adminApi.updateBankAccount(editingId, {
          bin: targetBin,
          accountNumber: formAccountNumber.trim(),
          accountName: formAccountName.trim().toUpperCase(),
        });
        if (response.success) {
          showToastSuccess("Đã cập nhật tài khoản ngân hàng thành công.");
          setIsFormOpen(false);
          await loadBankSettings();
        }
      } else {
        // Create flow
        const response = await adminApi.createBankAccount({
          bin: targetBin,
          accountNumber: formAccountNumber.trim(),
          accountName: formAccountName.trim().toUpperCase(),
          isDefault: formIsDefault,
        });
        if (response.success) {
          showToastSuccess("Đã thêm tài khoản ngân hàng mới thành công.");
          setIsFormOpen(false);
          await loadBankSettings();
        }
      }
    } catch (err: unknown) {
      showToastError(err instanceof Error ? err.message : "Không thể lưu thông tin tài khoản.");
    } finally {
      setFormSaving(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Bạn có chắc chắn muốn xóa tài khoản ngân hàng: ${name}?`)) return;
    try {
      const response = await adminApi.deleteBankAccount(id);
      if (response.success) {
        showToastSuccess("Đã xóa tài khoản ngân hàng.");
        await loadBankSettings();
      }
    } catch (err: unknown) {
      showToastError(err instanceof Error ? err.message : "Lỗi khi xóa tài khoản.");
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const response = await adminApi.setDefaultBankAccount(id);
      if (response.success) {
        showToastSuccess("Đã chuyển tài khoản nhận tiền mặc định.");
        await loadBankSettings();
      }
    } catch (err: unknown) {
      showToastError(err instanceof Error ? err.message : "Không thể đặt mặc định.");
    }
  };

  // Plan Edit Handlers
  const openEditPlanForm = (plan: AdminPlan) => {
    setEditingPlanId(plan._id);
    setPlanName(plan.name);
    setPlanDesc(plan.description);
    setPlanPriceMonthly(plan.price_monthly || 0);
    setPlanPriceYearly(plan.price_yearly || 0);
    setPlanLimitProjects(plan.limits.max_projects === null ? "" : String(plan.limits.max_projects));
    setPlanLimitScreens(plan.limits.max_screens_per_month === null ? "" : String(plan.limits.max_screens_per_month));
    setPlanLimitStorage(plan.limits.max_storage_gb === null ? "" : String(plan.limits.max_storage_gb));
    setPlanLimitTeam(plan.limits.max_team_members === null ? "" : String(plan.limits.max_team_members));
    setPlanFeatures(plan.features.join("\n"));
    setPlanBadge(plan.badge_text);
    setPlanOrder(plan.display_order);
    setPlanIsActive(plan.is_active);
    setIsPlanFormOpen(true);
  };

  const savePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPlanId) return;
    setPlanSaving(true);

    const parsedLimits = {
      maxProjects: planLimitProjects === "" ? null : Number(planLimitProjects),
      maxScreensPerMonth: planLimitScreens === "" ? null : Number(planLimitScreens),
      maxStorageGb: planLimitStorage === "" ? null : Number(planLimitStorage),
      maxTeamMembers: planLimitTeam === "" ? null : Number(planLimitTeam),
    };

    const featuresArray = planFeatures
      .split("\n")
      .map((f) => f.trim())
      .filter(Boolean);

    try {
      const response = await adminApi.updatePlan(editingPlanId, {
        name: planName,
        description: planDesc,
        priceMonthly: planPriceMonthly,
        priceYearly: planPriceYearly,
        limits: parsedLimits,
        features: featuresArray,
        isActive: planIsActive,
        badgeText: planBadge,
        displayOrder: planOrder,
      });

      if (response.success) {
        showToastSuccess("Đã cập nhật cấu hình gói cước thành công.");
        setIsPlanFormOpen(false);
        await loadPlans();
      }
    } catch (err: unknown) {
      showToastError(err instanceof Error ? err.message : "Lỗi khi lưu cấu hình gói.");
    } finally {
      setPlanSaving(false);
    }
  };

  const getBankDisplayName = (bin: string) => {
    const bank = POPULAR_BANKS.find((b) => b.bin === bin);
    return bank ? bank.name.split(" - ")[0] : `Mã BIN: ${bin}`;
  };

  const maskAccountNumber = (num: string) => {
    if (num.length <= 6) return num;
    return num.slice(0, 6) + "*".repeat(num.length - 6);
  };

  const formatMoney = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900">Cài đặt hệ thống</h1>
        <p className="text-slate-500 text-sm mt-1">Cấu hình chi tiết thanh toán và tích hợp mở rộng cho nền tảng.</p>
      </div>

      {/* Tabs navigation */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8" aria-label="Tabs">
          <button
            onClick={() => setActiveTab("bank")}
            className={`border-b-2 py-4 px-1 text-sm font-medium transition-all ${
              activeTab === "bank"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Tài khoản nhận tiền
          </button>
          <button
            onClick={() => setActiveTab("plans")}
            className={`border-b-2 py-4 px-1 text-sm font-medium transition-all ${
              activeTab === "plans"
                ? "border-sky-600 text-sky-600"
                : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
            }`}
          >
            Gói dịch vụ
          </button>
          <button
            onClick={() => setActiveTab("calendar")}
            className={`border-b-2 py-4 px-1 text-sm font-medium transition-all ${
              activeTab === "calendar"
                ? "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                : "border-sky-600 text-sky-600"
            }`}
          >
            Tích hợp Lịch
          </button>
          <button
            onClick={() => setActiveTab("audit")}
            className={`border-b-2 py-4 px-1 text-sm font-medium transition-all ${
              activeTab === "audit"
                ? "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-700"
                : "border-sky-600 text-sky-600"
            }`}
          >
            Nhật ký sửa đổi
          </button>
        </nav>
      </div>

      {/* Toasts (Floating style alert) */}
      {(bankSuccess || bankError) && (
        <div className="fixed bottom-5 right-5 z-70 animate-slideIn">
          {bankSuccess && (
            <div className="flex items-center gap-2 bg-emerald-600 text-white rounded-lg px-4 py-3 shadow-lg border border-emerald-500 text-sm font-semibold">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span>{bankSuccess}</span>
            </div>
          )}
          {bankError && (
            <div className="flex items-center gap-2 bg-rose-600 text-white rounded-lg px-4 py-3 shadow-lg border border-rose-500 text-sm font-semibold">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{bankError}</span>
            </div>
          )}
        </div>
      )}

      {/* Tab content 1: Bank Accounts */}
      {activeTab === "bank" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Danh sách tài khoản nhận tiền</h2>
              <p className="text-xs text-slate-500 mt-1">Cấu hình các tài khoản ngân hàng dùng để tạo mã chuyển khoản tự động.</p>
            </div>
            {!isFormOpen && (
              <button
                onClick={openAddForm}
                className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-3 py-2 rounded-lg transition"
              >
                <Plus className="h-4 w-4" /> Thêm tài khoản
              </button>
            )}
          </div>

          {loadingBank ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-8">
              <Loader2 className="h-5 w-5 animate-spin text-sky-600" /> Đang tải danh sách tài khoản...
            </div>
          ) : (
            <div className="grid gap-6 md:grid-cols-2">
              {accounts.map((account) => (
                <div
                  key={account.id}
                  className={`bg-white rounded-2xl border p-5 shadow-sm relative flex flex-col justify-between transition-all duration-300 ${
                    account.isDefault ? "border-emerald-500 ring-2 ring-emerald-50" : "border-slate-200"
                  }`}
                >
                  {account.isDefault && (
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 px-2.5 py-0.5 rounded-full">
                      <ShieldCheck className="h-3 w-3" /> Mặc định nhận tiền
                    </span>
                  )}

                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5">
                      <div className="h-9 w-9 rounded-lg bg-slate-50 flex items-center justify-center border border-slate-100 shrink-0">
                        <Landmark className="h-4 w-4 text-slate-600" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-800 text-sm">{getBankDisplayName(account.bin)}</h4>
                        <p className="text-[10px] text-slate-400">Mã BIN: {account.bin}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5 pt-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Số tài khoản:</span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-slate-900">
                            {visibleAccountIds[account.id] ? account.accountNumber : maskAccountNumber(account.accountNumber)}
                          </span>
                          <button
                            type="button"
                            onClick={() => setVisibleAccountIds((prev) => ({ ...prev, [account.id]: !prev[account.id] }))}
                            className="text-slate-400 hover:text-slate-600"
                            title={visibleAccountIds[account.id] ? "Ẩn" : "Hiện"}
                          >
                            {visibleAccountIds[account.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400 font-medium">Chủ tài khoản:</span>
                        <span className="font-bold text-slate-800">{account.accountName}</span>
                      </div>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 mt-4 pt-4 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditForm(account)}
                        className="text-slate-500 hover:text-slate-700 p-1.5 hover:bg-slate-50 rounded-lg transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      {!account.isDefault && (
                        <button
                          onClick={() => handleDelete(account.id, account.accountName)}
                          className="text-rose-500 hover:text-rose-700 p-1.5 hover:bg-rose-50 rounded-lg transition"
                          title="Xóa tài khoản"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    {!account.isDefault && (
                      <button
                        onClick={() => void handleSetDefault(account.id)}
                        className="text-xs font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg transition"
                      >
                        <Check className="h-3 w-3" /> Đặt mặc định
                      </button>
                    )}
                  </div>
                </div>
              ))}

              {accounts.length === 0 && (
                <div className="md:col-span-2 border border-dashed border-slate-300 rounded-2xl p-8 text-center text-slate-500">
                  Chưa cấu hình tài khoản ngân hàng nào. Vui lòng thêm tài khoản để bắt đầu.
                </div>
              )}
            </div>
          )}

          {/* Form to Create/Edit Bank Account */}
          {isFormOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
              <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
                <div className="flex items-start justify-between mb-4">
                  <h3 className="font-bold text-slate-900 text-lg">
                    {editingId ? "Cập nhật tài khoản" : "Thêm tài khoản nhận tiền mới"}
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={saveBankAccount} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Chọn Ngân hàng
                    </label>
                    <select
                      value={formIsCustomBin ? "custom" : formBin}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val === "custom") {
                          setFormIsCustomBin(true);
                          setFormBin("custom");
                        } else {
                          setFormIsCustomBin(false);
                          setFormBin(val);
                        }
                      }}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    >
                      <option value="">-- Chọn ngân hàng --</option>
                      {POPULAR_BANKS.map((b) => (
                        <option key={b.bin} value={b.bin}>
                          {b.name}
                        </option>
                      ))}
                      <option value="custom">Ngân hàng khác (Tự điền BIN)</option>
                    </select>
                  </div>

                  {formIsCustomBin && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Mã BIN ngân hàng (6 chữ số)
                      </label>
                      <input
                        type="text"
                        maxLength={6}
                        placeholder="Ví dụ: 970436"
                        value={formCustomBin}
                        onChange={(e) => setFormCustomBin(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Số tài khoản
                    </label>
                    <div className="relative">
                      <input
                        type={showFormAccountNumber ? "text" : "password"}
                        placeholder="Nhập số tài khoản ngân hàng"
                        value={formAccountNumber}
                        onChange={(e) => setFormAccountNumber(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-10 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                      />
                      <button
                        type="button"
                        onClick={() => setShowFormAccountNumber(!showFormAccountNumber)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                      >
                        {showFormAccountNumber ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Tên chủ tài khoản (Viết hoa không dấu)
                    </label>
                    <input
                      type="text"
                      placeholder="Ví dụ: NGUYEN VAN A"
                      value={formAccountName}
                      onChange={(e) => setFormAccountName(e.target.value.toUpperCase())}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none focus:ring-2 focus:ring-sky-500/20"
                    />
                  </div>

                  {!editingId && (
                    <div className="flex items-center gap-2 py-1">
                      <input
                        type="checkbox"
                        id="formIsDefault"
                        checked={formIsDefault}
                        onChange={(e) => setFormIsDefault(e.target.checked)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                      />
                      <label htmlFor="formIsDefault" className="text-xs text-slate-600 font-medium cursor-pointer">
                        Đặt tài khoản này làm mặc định nhận tiền
                      </label>
                    </div>
                  )}

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsFormOpen(false)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={formSaving}
                      className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                    >
                      {formSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      {editingId ? "Cập nhật" : "Thêm mới"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab content 2: Subscription Plans Config */}
      {activeTab === "plans" && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Cấu hình các gói dịch vụ & Giá</h2>
            <p className="text-xs text-slate-500 mt-1">Điều chỉnh giá cước, giới hạn kỹ thuật (Dự án, Số màn hình, Storage) và quyền lợi của từng gói.</p>
          </div>

          {loadingPlans ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-8">
              <Loader2 className="h-5 w-5 animate-spin text-sky-600" /> Đang tải danh sách gói dịch vụ...
            </div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-3">
              {plans.map((p) => (
                <div
                  key={p._id}
                  className={`bg-white rounded-2xl border p-6 shadow-sm flex flex-col justify-between transition hover:shadow-md ${
                    p.is_active ? "border-slate-200" : "border-slate-200 opacity-60 bg-slate-50/50"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <h3 className="font-bold text-slate-900 text-lg flex items-center gap-1.5">
                        <CreditCard className="h-4.5 w-4.5 text-sky-600" />
                        {p.name}
                      </h3>
                      <div className="flex items-center gap-1.5">
                        {p.badge_text && (
                          <span className="bg-sky-50 text-sky-700 border border-sky-100 text-[10px] font-bold px-2 py-0.5 rounded">
                            {p.badge_text}
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            p.is_active ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-slate-100 text-slate-500"
                          }`}
                        >
                          {p.is_active ? "Hoạt động" : "Tạm dừng"}
                        </span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs min-h-8 mb-4">{p.description}</p>

                    <div className="border-t border-b border-slate-100 py-3 mb-4 space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Giá theo tháng:</span>
                        <span className="font-bold text-slate-800">
                          {p.price_monthly === null || p.price_monthly === 0 ? "Miễn phí" : formatMoney(p.price_monthly)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Giá theo năm:</span>
                        <span className="font-bold text-slate-800">
                          {p.price_yearly === null || p.price_yearly === 0 ? "Miễn phí" : formatMoney(p.price_yearly)}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2 text-xs mb-4">
                      <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Thông số giới hạn:</h4>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dự án tối đa:</span>
                        <span className="font-semibold text-slate-800">
                          {p.limits.max_projects === null ? "Không giới hạn" : p.limits.max_projects}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Số màn hình / tháng:</span>
                        <span className="font-semibold text-slate-800">
                          {p.limits.max_screens_per_month === null ? "Không giới hạn" : p.limits.max_screens_per_month}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Dung lượng:</span>
                        <span className="font-semibold text-slate-800">
                          {p.limits.max_storage_gb === null ? "Không giới hạn" : `${p.limits.max_storage_gb} GB`}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs mb-4">
                      <h4 className="font-bold text-slate-700 uppercase text-[10px] tracking-wider">Tính năng:</h4>
                      <ul className="list-disc list-inside text-slate-600 pl-1 space-y-1">
                        {p.features.map((f, i) => (
                          <li key={i} className="truncate" title={f}>
                            {f}
                          </li>
                        ))}
                        {p.features.length === 0 && <li className="text-slate-400 italic">Không có chi tiết</li>}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => openEditPlanForm(p)}
                    className="w-full flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold py-2 rounded-lg transition mt-2"
                  >
                    <Settings className="h-3.5 w-3.5" /> Điều chỉnh cấu hình
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Edit Plan Modal */}
          {isPlanFormOpen && (
            <div className="fixed inset-0 z-60 flex items-center justify-center bg-slate-950/50 p-4" role="dialog" aria-modal="true">
              <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
                <div className="flex items-start justify-between mb-4 border-b border-slate-100 pb-3">
                  <h3 className="font-bold text-slate-900 text-lg">
                    Thiết lập gói dịch vụ: {planName}
                  </h3>
                  <button
                    onClick={() => setIsPlanFormOpen(false)}
                    className="p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-lg"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <form onSubmit={savePlan} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Tên gói cước
                      </label>
                      <input
                        type="text"
                        required
                        value={planName}
                        onChange={(e) => setPlanName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Nhãn nổi bật (Badge)
                      </label>
                      <input
                        type="text"
                        placeholder="Ví dụ: Dùng thử miễn phí"
                        value={planBadge}
                        onChange={(e) => setPlanBadge(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Mô tả ngắn
                    </label>
                    <input
                      type="text"
                      required
                      value={planDesc}
                      onChange={(e) => setPlanDesc(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Giá theo Tháng (VND)
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={planPriceMonthly}
                        onChange={(e) => setPlanPriceMonthly(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Giá theo Năm (VND)
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={planPriceYearly}
                        onChange={(e) => setPlanPriceYearly(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="border-t border-slate-100 pt-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-600 mb-3">Giới hạn tài nguyên (Để trống nếu không giới hạn)</h4>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Số lượng Dự án tối đa
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={planLimitProjects}
                          onChange={(e) => setPlanLimitProjects(e.target.value)}
                          placeholder="Không giới hạn"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Số Màn hình chuyển đổi / tháng
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={planLimitScreens}
                          onChange={(e) => setPlanLimitScreens(e.target.value)}
                          placeholder="Không giới hạn"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Dung lượng lưu trữ (GB)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={planLimitStorage}
                          onChange={(e) => setPlanLimitStorage(e.target.value)}
                          placeholder="Không giới hạn"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                          Thành viên nhóm tối đa
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={planLimitTeam}
                          onChange={(e) => setPlanLimitTeam(e.target.value)}
                          placeholder="Không giới hạn"
                          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                      Các quyền lợi & Tính năng (Mỗi dòng một tính năng)
                    </label>
                    <textarea
                      rows={3}
                      value={planFeatures}
                      onChange={(e) => setPlanFeatures(e.target.value)}
                      placeholder="Tính năng 1&#10;Tính năng 2"
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-sky-500 focus:outline-none"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2 items-center pt-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">
                        Thứ tự hiển thị (Bắt đầu từ 0)
                      </label>
                      <input
                        type="number"
                        min={0}
                        required
                        value={planOrder}
                        onChange={(e) => setPlanOrder(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none"
                      />
                    </div>
                    <div className="flex items-center gap-2 mt-4">
                      <input
                        type="checkbox"
                        id="planIsActive"
                        checked={planIsActive}
                        onChange={(e) => setPlanIsActive(e.target.checked)}
                        className="rounded border-slate-300 text-sky-600 focus:ring-sky-500 h-4 w-4"
                      />
                      <label htmlFor="planIsActive" className="text-xs text-slate-600 font-medium cursor-pointer">
                        Kích hoạt gói dịch vụ này
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setIsPlanFormOpen(false)}
                      className="rounded-lg border border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Hủy
                    </button>
                    <button
                      type="submit"
                      disabled={planSaving}
                      className="flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white text-xs font-semibold px-4 py-2 rounded-lg transition"
                    >
                      {planSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                      Lưu thay đổi
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab content 3: Google Calendar */}
      {activeTab === "calendar" && (
        <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-10 w-10 rounded-lg bg-sky-50 flex items-center justify-center">
              <CalendarCheck2 className="h-5 w-5 text-sky-600" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">Tích hợp Lịch Google Calendar</h3>
              <p className="text-xs text-slate-500">Tự động đồng bộ lịch và tạo phòng họp Google Meet khi duyệt cuộc họp.</p>
            </div>
          </div>

          {loadingCalendar ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-4">
              <Loader2 className="h-4 w-4 animate-spin text-sky-600" /> Đang kiểm tra trạng thái liên kết...
            </div>
          ) : connected ? (
            <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
              <div>
                <p className="text-sm font-semibold text-emerald-700">Đã kết nối</p>
                <p className="text-xs text-emerald-600">{connectedEmail}</p>
              </div>
              <button
                onClick={disconnectCalendar}
                disabled={calendarBusy}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-700 transition disabled:opacity-40"
              >
                <Unlink className="h-3.5 w-3.5" /> Hủy liên kết
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-4">
              <p className="text-sm text-slate-600 mb-3">Hiện chưa liên kết tài khoản Google Calendar. Việc duyệt các cuộc họp mới có thể bị giới hạn tính năng tạo link Meet.</p>
              <button
                onClick={connectCalendar}
                disabled={calendarBusy}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 disabled:bg-slate-200 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition"
              >
                {calendarBusy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ExternalLink className="h-4 w-4" />}
                Liên kết tài khoản Google
              </button>
            </div>
          )}

          {calendarError && (
            <p className="text-xs text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2 mt-4 flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {calendarError}
            </p>
          )}
        </section>
      )}

      {/* Tab content 4: Audit Logs */}
      {activeTab === "audit" && (
        <section className="space-y-4">
          <div>
            <h3 className="font-bold text-slate-800">Nhật ký thay đổi hệ thống nhận tiền & gói cước</h3>
            <p className="text-xs text-slate-500 mt-1">Lịch sử ghi lại mọi hành động liên quan đến việc cấu hình tài khoản nhận tiền và điều chỉnh gói dịch vụ.</p>
          </div>

          {loadingLogs ? (
            <div className="flex items-center gap-2 text-slate-400 text-sm py-8">
              <Loader2 className="h-5 w-5 animate-spin text-sky-600" /> Đang tải nhật ký...
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 uppercase tracking-wider text-slate-500 border-b border-slate-100">
                    <tr>
                      <th className="px-4 py-3 font-bold">Thời gian</th>
                      <th className="px-4 py-3 font-bold">Hành động</th>
                      <th className="px-4 py-3 font-bold">Nội dung chi tiết</th>
                      <th className="px-4 py-3 font-bold">Người thực hiện</th>
                      <th className="px-4 py-3 font-bold">IP Address</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70">
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500">
                          {new Date(log.createdAt).toLocaleString("vi-VN")}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 font-bold uppercase text-[9px] ${
                              log.action === "create"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                                : log.action === "delete"
                                ? "bg-rose-50 text-rose-700 border border-rose-100"
                                : log.action === "set_default"
                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                : log.action === "update_plan"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-blue-50 text-blue-700 border border-blue-100"
                            }`}
                          >
                            {log.action === "create"
                              ? "Thêm mới"
                              : log.action === "delete"
                              ? "Xóa"
                              : log.action === "set_default"
                              ? "Đặt mặc định"
                              : log.action === "update_plan"
                              ? "Gói cước"
                              : "Cập nhật"}
                          </span>
                        </td>
                        <td className="px-4 py-3 max-w-sm break-words font-medium text-slate-800">
                          {log.description}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-600">
                          {log.performedBy}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-slate-500 font-mono">
                          {log.ipAddress || "—"}
                        </td>
                      </tr>
                    ))}
                    {auditLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                          Chưa có hoạt động nào được ghi lại.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}
