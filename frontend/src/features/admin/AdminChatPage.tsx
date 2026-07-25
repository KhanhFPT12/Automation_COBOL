import { useState, useEffect, useRef } from "react";
import { Loader2, Send } from "lucide-react";
import { apiFetch } from "../../services/apiClient";

interface ChatMsg {
  _id: string;
  userEmail: string;
  senderEmail: string;
  senderRole: string;
  senderName: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

interface ChatUser {
  _id: string;
  fullName?: string;
  email?: string;
  businessEmail?: string;
}

export function AdminChatPage() {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [selected, setSelected] = useState<ChatUser | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [unreadByUser, setUnreadByUser] = useState<Record<string, number>>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const loadUsers = async () => {
    try {
      const d = await apiFetch<{ success: boolean; users: ChatUser[] }>("/api/admin/users?limit=100");
      if (d.success) setUsers(d.users || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { loadUsers(); }, []);

  // Use persisted read state so badges remain correct across refreshes/devices.
  useEffect(() => {
    const checkUnread = async () => {
      try {
        const d = await apiFetch<{ success: boolean; unreadByUser: Record<string, number> }>("/api/chat/unread");
        if (d.success) setUnreadByUser(d.unreadByUser || {});
      } catch {}
    };
    const t = setInterval(checkUnread, 3000);
    checkUnread();
    return () => clearInterval(t);
  }, []);

  const openConversation = async (user: ChatUser, email: string) => {
    setSelected(user);
    setUnreadByUser((prev) => ({ ...prev, [email]: 0 }));
    try {
      await apiFetch("/api/chat/read/" + encodeURIComponent(email), { method: "PATCH" });
      window.dispatchEvent(new Event("chat:read"));
    } catch {}
  };

  const loadMessages = async () => {
    if (!selected) return;
    const email = (selected as any).email || (selected as any).businessEmail;
    try {
      const d = await apiFetch<{ success: boolean; messages: ChatMsg[] }>("/api/chat/messages/" + email);
      if (d.success) {
        const nextMessages = d.messages || [];
        setMessages(nextMessages);
        if (nextMessages.some((msg) => msg.senderRole === "USER" && !msg.isRead)) {
          await apiFetch("/api/chat/read/" + encodeURIComponent(email), { method: "PATCH" });
          setUnreadByUser((prev) => ({ ...prev, [email]: 0 }));
          window.dispatchEvent(new Event("chat:read"));
        }
      }
    } catch {}
  };
  useEffect(() => { loadMessages(); }, [selected]);
  useEffect(() => {
    const t = setInterval(loadMessages, 2000);
    return () => clearInterval(t);
  }, [selected]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !selected) return;
    const email = (selected as any).email || (selected as any).businessEmail;
    try {
      await apiFetch("/api/chat/send", {
        method: "POST",
        body: JSON.stringify({ userEmail: email, message: input.trim() }),
      });
      setInput("");
      loadMessages();
    } catch {}
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="w-64 border-r border-slate-200 flex flex-col shrink-0">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">Support Chat</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
            </div>
          ) : (
            users.map((u) => {
                const uEmail = (u as any).email || (u as any).businessEmail || "";
                const count = unreadByUser[uEmail] || 0;
                return (
              <button
                key={u._id}
                onClick={() => void openConversation(u, uEmail)}
                className={`w-full text-left px-4 py-3 hover:bg-slate-50 transition border-b border-slate-50 flex items-center justify-between ${
                  selected?._id === u._id ? "bg-sky-50 border-l-2 border-l-sky-600" : ""
                }`}
              >
                <div>
                  <p className="text-sm font-semibold text-slate-800">{u.fullName || u.email}</p>
                  <p className="text-xs text-slate-400">{u.email}</p>
                </div>
                {count > 0 && (
                  <span className="h-5 min-w-5 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {count > 99 ? "99+" : count}
                  </span>
                )}
              </button>
            )})
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {selected ? (
          <>
            <div className="px-4 py-3 border-b border-slate-200 shrink-0">
              <p className="font-bold text-sm text-slate-900">
                {(selected as any).fullName || (selected as any).email}
              </p>
              <p className="text-xs text-slate-400">{(selected as any).email}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((m) => (
                <div
                  key={m._id}
                  className={`flex ${m.senderRole === "ADMIN" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[75%] rounded-xl px-3 py-2 text-xs ${
                      m.senderRole === "ADMIN" ? "bg-sky-600 text-white" : "bg-slate-100 text-slate-800"
                    }`}
                  >
                    <p className="text-[10px] font-bold mb-0.5 opacity-70">{m.senderName}</p>
                    <p>{m.message}</p>
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>
            <div className="flex items-center gap-2 px-4 py-3 border-t border-slate-200 shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") send(); }}
                placeholder="Type a reply..."
                className="flex-1 px-3 py-2 text-sm bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"
              />
              <button
                onClick={send}
                className="p-2 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition cursor-pointer"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400 text-sm">
            Select a user to start chatting
          </div>
        )}
      </div>
    </div>
  );
}
