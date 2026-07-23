import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { useAppStore } from "../../store";
import { apiFetch } from "../../services/apiClient";

interface ChatMsg {
  _id: string;
  userEmail: string;
  senderEmail: string;
  senderRole: string;
  senderName: string;
  message: string;
  createdAt: string;
}

export function ChatWidget() {
  const { session } = useAppStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(0);
  const lastCountRef = useRef(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userEmail = session.email || "";

  const loadMessages = async () => {
    if (!userEmail) return;
    try {
      const d = await apiFetch<{ success: boolean; messages: ChatMsg[] }>("/api/chat/messages/" + userEmail);
      if (d.success) {
        const msgs = d.messages || [];
        setMessages(msgs);
        if (!open && msgs.length > lastCountRef.current) {
          setUnread((u) => u + (msgs.length - lastCountRef.current));
        }
        lastCountRef.current = msgs.length;
      }
    } catch {}
  };

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, 2000);
    return () => clearInterval(timer);
  }, [userEmail, open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = async () => {
    if (!input.trim() || !userEmail) return;
    try {
      await apiFetch("/api/chat/send", {
        method: "POST",
        body: JSON.stringify({ userEmail, message: input.trim() }),
      });
      setInput("");
      loadMessages();
    } catch {}
  };

  return (
    <>
      <button
        onClick={() => { if (!open) { setUnread(0); lastCountRef.current = messages.length; } setOpen(!open); }}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-sky-600 hover:bg-sky-700 text-white shadow-lg flex items-center justify-center transition cursor-pointer"
      >
        <MessageCircle className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-80 h-96 bg-white rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 bg-sky-600 text-white shrink-0">
            <span className="font-bold text-sm">ALSM Support</span>
            <button onClick={() => setOpen(false)} className="cursor-pointer">
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.map((m) => (
              <div key={m._id} className={`flex ${m.senderRole === "ADMIN" ? "justify-start" : "justify-end"}`}>
                <div className={`max-w-[80%] rounded-xl px-3 py-2 text-xs ${m.senderRole === "ADMIN" ? "bg-slate-100 text-slate-800" : "bg-sky-600 text-white"}`}>
                  <p>{m.message}</p>
                </div>
              </div>
            ))}
            <div ref={bottomRef} />
          </div>

          <div className="flex items-center gap-2 px-3 py-2 border-t border-slate-200 shrink-0">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Type a message..."
              className="flex-1 px-3 py-1.5 text-xs bg-slate-50 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500"

            />
            <button onClick={send} className="p-1.5 rounded-lg bg-sky-600 text-white hover:bg-sky-700 transition cursor-pointer">
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
