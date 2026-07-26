import { useState, useEffect, useRef, type ChangeEvent } from "react";
import {
  Loader2,
  Send,
  Paperclip,
  X,
  FileText,
  Image as ImageIcon,
  Download,
  Search,
  MessageSquare,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
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

interface ConversationItem {
  email: string;
  fullName: string;
  avatar?: string;
  lastMessage: string;
  lastSenderRole: string;
  lastAt: string;
  unreadCount: number;
}

export function AdminChatPage() {
  const [conversations, setConversations] = useState<ConversationItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<ChatAttachment[]>([]);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  // Load only users who have actual conversations
  const loadConversations = async () => {
    try {
      const d = await apiFetch<{ success: boolean; conversations: ConversationItem[] }>("/api/chat/conversations");
      if (d.success) {
        setConversations(d.conversations || []);
        // Auto-select first conversation if none selected
        if (!selectedEmail && d.conversations && d.conversations.length > 0) {
          setSelectedEmail(d.conversations[0].email);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
    const timer = setInterval(loadConversations, 5000);
    return () => clearInterval(timer);
  }, []);

  const selectedConv = conversations.find((c) => c.email === selectedEmail);

  // Load messages for selected user
  const loadMessages = async () => {
    if (!selectedEmail) return;
    try {
      const d = await apiFetch<{ success: boolean; messages: ChatMsg[] }>("/api/chat/messages/" + encodeURIComponent(selectedEmail));
      if (d.success) {
        const nextMessages = d.messages || [];
        setMessages(nextMessages);
        if (nextMessages.some((msg) => msg.senderRole === "USER" && !msg.isRead)) {
          await apiFetch("/api/chat/read/" + encodeURIComponent(selectedEmail), { method: "PATCH" });
          window.dispatchEvent(new Event("chat:read"));
          setConversations((prev) =>
            prev.map((c) => (c.email === selectedEmail ? { ...c, unreadCount: 0 } : c))
          );
        }
      }
    } catch {}
  };

  useEffect(() => {
    loadMessages();
  }, [selectedEmail]);

  useEffect(() => {
    const t = setInterval(loadMessages, 3000);
    return () => clearInterval(t);
  }, [selectedEmail]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, pendingAttachments]);

  // Handle File Select & Upload to Cloudinary
  const handleFileSelect = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    if (file.size > 15 * 1024 * 1024) {
      alert("File size exceeds maximum limit of 15MB.");
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
      alert("Failed to upload file to Cloudinary.");
    } finally {
      setUploadingFile(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePendingAttachment = (index: number) => {
    setPendingAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Send message with optional text & attachments
  const send = async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || !selectedEmail || sending) return;
    setSending(true);
    try {
      const payload = {
        userEmail: selectedEmail,
        message: input.trim(),
        attachments: pendingAttachments,
      };
      const d = await apiFetch<{ success: boolean }>("/api/chat/send", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      if (d.success) {
        setInput("");
        setPendingAttachments([]);
        await loadMessages();
        loadConversations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  const formatTime = (isoString: string) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatFileSize = (bytes: number) => {
    if (!bytes) return "0 KB";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden font-sans">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.txt,.cob,.cbl,.zip,.doc,.docx"
      />

      {/* Left Sidebar: Conversations List */}
      <div className="w-80 border-r border-slate-200/80 flex flex-col shrink-0 bg-slate-50/50">
        {/* Header & Search */}
        <div className="p-4 border-b border-slate-200/80 space-y-3 bg-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#0061FF] to-[#6366F1] text-white shadow-xs">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Support Desk</h3>
                <p className="text-[10px] text-slate-400 font-semibold">{conversations.length} Active Conversations</p>
              </div>
            </div>
            <button
              onClick={loadConversations}
              title="Refresh conversations"
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition cursor-pointer"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search user or email..."
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-100/80 rounded-xl border border-slate-200/70 focus:outline-none focus:ring-2 focus:ring-[#0061FF]/30 focus:border-[#0061FF] transition"
            />
          </div>
        </div>

        {/* Conversation List Body */}
        <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-400">
              <Loader2 className="h-6 w-6 animate-spin mb-2 text-[#0061FF]" />
              <p className="text-xs font-semibold">Loading support chats...</p>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="p-6 text-center text-slate-400">
              <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-30 text-slate-400" />
              <p className="text-xs font-bold text-slate-600">No chat messages found</p>
              <p className="text-[11px] text-slate-400 mt-1">
                {searchQuery ? "Try another search term" : "Only users who send support messages will appear here."}
              </p>
            </div>
          ) : (
            filteredConversations.map((c) => {
              const isSelected = selectedEmail === c.email;
              const initial = (c.fullName || c.email).charAt(0).toUpperCase();

              return (
                <button
                  key={c.email}
                  onClick={() => setSelectedEmail(c.email)}
                  className={`w-full text-left p-3.5 transition flex items-center gap-3 relative group cursor-pointer ${
                    isSelected
                      ? "bg-white shadow-xs border-l-4 border-l-[#0061FF]"
                      : "hover:bg-slate-100/70"
                  }`}
                >
                  <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0061FF] via-[#3B82F6] to-[#6366F1] font-bold text-white text-sm shadow-xs">
                    {initial}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-0.5">
                      <p className={`text-xs font-extrabold truncate ${isSelected ? "text-[#0061FF]" : "text-slate-800"}`}>
                        {c.fullName}
                      </p>
                      <span className="text-[10px] text-slate-400 shrink-0 font-medium">
                        {formatTime(c.lastAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 truncate font-medium">
                      {c.lastSenderRole === "ADMIN" ? "You: " : ""}{c.lastMessage || "No messages"}
                    </p>
                  </div>
                  {c.unreadCount > 0 && (
                    <span className="h-5 min-w-5 px-1.5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center shadow-xs">
                      {c.unreadCount > 99 ? "99+" : c.unreadCount}
                    </span>
                  )}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Right Main Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedConv ? (
          <>
            {/* Top Chat Header */}
            <div className="px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0061FF] to-[#6366F1] font-bold text-white text-sm shadow-xs">
                  {(selectedConv.fullName || selectedConv.email).charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-extrabold text-slate-900 text-sm">{selectedConv.fullName}</h4>
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
                      User Support Ticket
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-medium">{selectedConv.email}</p>
                </div>
              </div>
              <button
                onClick={loadMessages}
                className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0061FF] bg-slate-100 hover:bg-sky-50 px-3 py-1.5 rounded-xl transition cursor-pointer"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                <span>Refresh Messages</span>
              </button>
            </div>

            {/* Messages Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/40">
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <MessageSquare className="h-10 w-10 mb-2 opacity-20" />
                  <p className="text-xs font-semibold">No messages in this ticket yet.</p>
                </div>
              ) : (
                messages.map((m) => {
                  const isAdmin = m.senderRole === "ADMIN";
                  return (
                    <div
                      key={m._id}
                      className={`flex flex-col ${isAdmin ? "items-end" : "items-start"}`}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-slate-400">
                          {isAdmin ? "Admin Support" : m.senderName || m.userEmail}
                        </span>
                        <span className="text-[10px] text-slate-300">•</span>
                        <span className="text-[10px] text-slate-400">{formatTime(m.createdAt)}</span>
                      </div>

                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs shadow-2xs space-y-2 ${
                          isAdmin
                            ? "bg-gradient-to-r from-[#0061FF] to-[#2563EB] text-white rounded-tr-xs"
                            : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
                        }`}
                      >
                        {/* Text Content */}
                        {m.message && <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>}

                        {/* Attachments Display */}
                        {m.attachments && m.attachments.length > 0 && (
                          <div className="space-y-2 pt-1">
                            {m.attachments.map((att, idx) => (
                              <div key={idx} className="rounded-xl overflow-hidden">
                                {att.fileType === "image" ? (
                                  <div className="relative group">
                                    <img
                                      src={att.url}
                                      alt={att.fileName}
                                      onClick={() => setPreviewImage(att.url)}
                                      className="max-h-60 max-w-full rounded-xl object-cover cursor-pointer hover:opacity-90 transition border border-white/20"
                                    />
                                    <a
                                      href={att.url}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition"
                                      title="Open full image"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                    </a>
                                  </div>
                                ) : (
                                  <a
                                    href={att.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-3 p-2.5 rounded-xl border transition ${
                                      isAdmin
                                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100"
                                    }`}
                                  >
                                    <FileText className="h-5 w-5 shrink-0" />
                                    <div className="flex-1 min-w-0">
                                      <p className="font-bold text-xs truncate">{att.fileName}</p>
                                      <p className="text-[10px] opacity-75">{formatFileSize(att.fileSize)}</p>
                                    </div>
                                    <Download className="h-4 w-4 shrink-0 opacity-80" />
                                  </a>
                                )}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={bottomRef} />
            </div>

            {/* Message Input & Attachment Footer */}
            <div className="p-4 border-t border-slate-200/80 bg-white shrink-0 space-y-2">
              {/* Attachment Preview Strip */}
              {pendingAttachments.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {pendingAttachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold"
                    >
                      {att.fileType === "image" ? (
                        <ImageIcon className="h-3.5 w-3.5 text-sky-600" />
                      ) : (
                        <FileText className="h-3.5 w-3.5 text-sky-600" />
                      )}
                      <span className="max-w-[120px] truncate">{att.fileName}</span>
                      <button
                        onClick={() => removePendingAttachment(idx)}
                        className="text-sky-600 hover:text-rose-600 cursor-pointer ml-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2">
                {/* Upload Button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  title="Attach file or screenshot"
                  className="p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100 hover:text-[#0061FF] transition cursor-pointer disabled:opacity-50"
                >
                  {uploadingFile ? (
                    <Loader2 className="h-4 w-4 animate-spin text-[#0061FF]" />
                  ) : (
                    <Paperclip className="h-4 w-4" />
                  )}
                </button>

                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Type a support response (Attach image/document with paperclip)..."
                  className="flex-1 px-4 py-2.5 text-xs bg-slate-50/80 rounded-xl border border-slate-200/90 focus:bg-white focus:outline-none focus:border-[#0061FF] focus:ring-4 focus:ring-sky-100 font-medium transition"
                />

                <button
                  type="button"
                  onClick={send}
                  disabled={sending || (!input.trim() && pendingAttachments.length === 0)}
                  className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#0061FF] to-[#2563EB] text-white font-bold text-xs hover:shadow-md hover:shadow-blue-500/20 transition flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  <span>Send</span>
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8">
            <MessageSquare className="h-12 w-12 text-slate-300 mb-3" />
            <p className="text-sm font-bold text-slate-700">No Conversation Selected</p>
            <p className="text-xs text-slate-400 mt-1 max-w-sm text-center">
              Select an active support conversation on the left sidebar to start responding to user inquiries.
            </p>
          </div>
        )}
      </div>

      {/* Lightbox Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-black">
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain max-h-[85vh]" />
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
