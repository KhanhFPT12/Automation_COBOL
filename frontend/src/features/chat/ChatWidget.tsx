import { useState, useEffect, useRef, type ChangeEvent } from "react";
import { MessageCircle, X, Send, Paperclip, Loader2, FileText, ExternalLink } from "lucide-react";
import { useAppStore } from "../../store";
import { apiFetch } from "../../services/apiClient";

interface ChatAttachment {
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}

interface ChatMsg {
  _id: string;
  userEmail: string;
  senderEmail: string;
  senderRole: string;
  senderName: string;
  message: string;
  attachments?: ChatAttachment[];
  createdAt: string;
  isRead: boolean;
}

export function ChatWidget() {
  const { session } = useAppStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [unread, setUnread] = useState(0);
  const [sending, setSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const userEmail = session.email || "";

  const loadMessages = async () => {
    if (!userEmail) return;
    try {
      const d = await apiFetch<{ success: boolean; messages: ChatMsg[]; unreadCount?: number }>("/api/chat/messages/" + encodeURIComponent(userEmail));
      if (d.success) {
        const msgs = d.messages || [];
        setMessages(msgs);
        if (!open) {
          const derivedUnread = msgs.filter(
            (msg) =>
              String(msg.senderEmail || "").toLowerCase() !== userEmail.toLowerCase() &&
              msg.isRead !== true,
          ).length;
          setUnread(derivedUnread);
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadMessages();
    const timer = setInterval(loadMessages, 3000);
    return () => clearInterval(timer);
  }, [userEmail, open]);

  const toggleChat = async () => {
    const willOpen = !open;
    setOpen(willOpen);
    if (willOpen && userEmail) {
      setUnread(0);
      try {
        await apiFetch("/api/chat/read/" + encodeURIComponent(userEmail), { method: "PATCH" });
      } catch {}
    }
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingAttachments]);

  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds 15MB.");
      return;
    }

    setUploadingFile(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/chat/upload", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: formData,
      });

      const d = await res.json();
      if (d.success && d.attachment) {
        setPendingAttachments((prev) => [...prev, d.attachment]);
      } else {
        alert(d.message || "Upload failed");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload file.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePendingAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const send = async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || !userEmail || sending) return;
    setSending(true);
    try {
      await apiFetch("/api/chat/send", {
        method: "POST",
        body: JSON.stringify({ userEmail, message: input.trim(), attachments: pendingAttachments }),
      });
      setInput("");
      setPendingAttachments([]);
      loadMessages();
    } catch {} finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.txt,.cob,.cbl,.zip,.doc,.docx"
      />

      {/* Floating Chat Button */}
      <button
        onClick={() => void toggleChat()}
        className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-gradient-to-tr from-[#0061FF] to-[#6366F1] hover:shadow-xl text-white shadow-lg flex items-center justify-center transition-transform hover:scale-105 cursor-pointer"
      >
        <MessageCircle className="h-6 w-6" />
        {unread > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-xs">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {/* Chat Window */}
      {open && (
        <div className="fixed bottom-24 right-6 z-50 w-88 h-[440px] bg-white rounded-3xl shadow-2xl border border-slate-200/90 flex flex-col overflow-hidden font-sans">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-[#0061FF] via-[#2563EB] to-[#6366F1] text-white shrink-0 shadow-xs">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-extrabold text-sm tracking-tight">ALSM Support Desk</span>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/80 hover:text-white cursor-pointer p-1">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-3 bg-slate-50/50">
            {messages.map((m) => {
              const isAdmin = m.senderRole === "ADMIN";
              return (
                <div key={m._id} className={`flex flex-col ${isAdmin ? "items-start" : "items-end"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-2xs space-y-1.5 ${
                      isAdmin
                        ? "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                        : "bg-gradient-to-r from-[#0061FF] to-[#2563EB] text-white rounded-tr-xs"
                    }`}
                  >
                    {isAdmin && <p className="text-[10px] font-bold text-[#0061FF] mb-0.5">Admin Support</p>}
                    {m.message && <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>}

                    {/* Attachments */}
                    {m.attachments && m.attachments.length > 0 && (
                      <div className="space-y-1.5 pt-1">
                        {m.attachments.map((att, idx) => (
                          <div key={idx} className="rounded-xl overflow-hidden">
                            {att.fileType === "image" ? (
                              <img
                                src={att.url}
                                alt={att.fileName}
                                onClick={() => setPreviewImage(att.url)}
                                className="max-h-40 max-w-full rounded-xl object-cover cursor-pointer hover:opacity-90 transition border border-black/10"
                              />
                            ) : (
                              <a
                                href={att.url}
                                target="_blank"
                                rel="noreferrer"
                                className={`flex items-center gap-2 p-2 rounded-xl border text-[11px] font-semibold transition ${
                                  isAdmin
                                    ? "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                                    : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                }`}
                              >
                                <FileText className="h-4 w-4 shrink-0" />
                                <span className="truncate flex-1">{att.fileName}</span>
                                <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-80" />
                              </a>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          {/* Pending Attachments */}
          {pendingAttachments.length > 0 && (
            <div className="px-3 py-1.5 bg-slate-100 border-t border-slate-200 flex items-center gap-1.5 overflow-x-auto">
              {pendingAttachments.map((att, idx) => (
                <div key={idx} className="flex items-center gap-1 bg-white px-2 py-1 rounded-lg text-[10px] font-bold text-sky-900 border border-slate-200">
                  <span className="max-w-[100px] truncate">{att.fileName}</span>
                  <button onClick={() => removePendingAttachment(idx)} className="text-slate-400 hover:text-rose-600">
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Input Footer */}
          <div className="flex items-center gap-1.5 px-3 py-2.5 border-t border-slate-200/90 bg-white shrink-0">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadingFile}
              title="Attach image or error file"
              className="p-2 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:text-[#0061FF] transition cursor-pointer"
            >
              {uploadingFile ? <Loader2 className="h-4 w-4 animate-spin text-[#0061FF]" /> : <Paperclip className="h-4 w-4" />}
            </button>

            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") send(); }}
              placeholder="Type your message or attach a file..."
              className="flex-1 px-3 py-2 text-xs bg-slate-50 rounded-xl border border-slate-200 focus:bg-white focus:outline-none focus:border-[#0061FF] font-medium"
            />

            <button
              onClick={send}
              disabled={sending || (!input.trim() && pendingAttachments.length === 0)}
              className="p-2 rounded-xl bg-gradient-to-r from-[#0061FF] to-[#2563EB] text-white hover:shadow-md transition cursor-pointer disabled:opacity-50"
            >
              {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </button>
          </div>
        </div>
      )}

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-black">
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
