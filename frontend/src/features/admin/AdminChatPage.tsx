import { useState, useEffect, useRef, type ChangeEvent, useCallback, useMemo } from "react";
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
  Phone,
  Video,
  Info,
  Clock,
  UserCircle
} from "lucide-react";
import { apiFetch } from "../../services/apiClient";

// --- Types ---

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

// --- Helper Functions ---

const formatTime = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

const formatFullDate = (isoString: string) => {
  if (!isoString) return "";
  const date = new Date(isoString);
  return date.toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
};

const formatFileSize = (bytes: number) => {
  if (!bytes) return "0 KB";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
};

// --- Subcomponents ---

const ChatSidebar = ({
  conversations,
  searchQuery,
  setSearchQuery,
  loading,
  selectedEmail,
  setSelectedEmail,
  loadConversations
}: any) => {
  const filteredConversations = conversations.filter((c: ConversationItem) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return c.fullName.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <div className="w-80 border-r border-slate-200/80 flex flex-col shrink-0 bg-slate-50/50">
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
          filteredConversations.map((c: ConversationItem) => {
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
                <div className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl font-bold text-white text-sm shadow-xs ${isSelected ? 'bg-gradient-to-tr from-[#0061FF] via-[#3B82F6] to-[#6366F1]' : 'bg-slate-300'}`}>
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
  );
};

const ChatHeader = ({ selectedConv, loadMessages }: any) => {
  return (
    <div className="px-6 py-3.5 border-b border-slate-200/80 flex items-center justify-between shrink-0 bg-white">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-tr from-[#0061FF] to-[#6366F1] font-bold text-white text-sm shadow-xs">
          {(selectedConv.fullName || selectedConv.email).charAt(0).toUpperCase()}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h4 className="font-extrabold text-slate-900 text-sm">{selectedConv.fullName}</h4>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
              Active Session
            </span>
          </div>
          <p className="text-xs text-slate-400 font-medium">{selectedConv.email}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
          <Phone className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
          <Video className="h-4 w-4" />
        </button>
        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition">
          <Info className="h-4 w-4" />
        </button>
        <div className="w-px h-6 bg-slate-200 mx-1"></div>
        <button
          onClick={loadMessages}
          className="flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-[#0061FF] bg-slate-100 hover:bg-sky-50 px-3 py-1.5 rounded-xl transition cursor-pointer"
        >
          <RefreshCw className="h-3.5 w-3.5" />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
};

const MessageBubble = ({ m, isAdmin, setPreviewImage }: any) => {
  return (
    <div className={`flex flex-col w-full ${isAdmin ? "items-end" : "items-start"} mb-4`}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
          {isAdmin ? (
            <><UserCircle className="h-3 w-3" /> Admin Support</>
          ) : (
            <>{m.senderName || m.userEmail}</>
          )}
        </span>
        <span className="text-[10px] text-slate-300">•</span>
        <span className="text-[10px] text-slate-400 flex items-center gap-1"><Clock className="h-3 w-3" /> {formatTime(m.createdAt)}</span>
      </div>

      <div
        className={`max-w-[75%] rounded-2xl px-4 py-3 text-xs shadow-sm space-y-2 relative group ${
          isAdmin
            ? "bg-gradient-to-r from-[#0061FF] to-[#2563EB] text-white rounded-tr-xs"
            : "bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs"
        }`}
      >
        {m.message && <p className="leading-relaxed whitespace-pre-wrap">{m.message}</p>}

        {m.attachments && m.attachments.length > 0 && (
          <div className="space-y-2 pt-1">
            {m.attachments.map((att: ChatAttachment, idx: number) => (
              <div key={idx} className="rounded-xl overflow-hidden relative">
                {att.fileType === "image" ? (
                  <div className="relative group/img overflow-hidden rounded-xl border border-black/10">
                    <img
                      src={att.url}
                      alt={att.fileName}
                      onClick={() => setPreviewImage(att.url)}
                      className="max-h-64 max-w-full rounded-xl object-cover cursor-pointer hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <ExternalLink className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <a
                    href={att.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`flex items-center gap-3 p-3 rounded-xl border transition group/doc ${
                      isAdmin
                        ? "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        : "bg-slate-50 border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${isAdmin ? 'bg-white/20' : 'bg-white shadow-xs'}`}>
                      <FileText className="h-5 w-5 shrink-0" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-xs truncate group-hover/doc:underline">{att.fileName}</p>
                      <p className="text-[10px] opacity-75 mt-0.5">{formatFileSize(att.fileSize)}</p>
                    </div>
                    <Download className={`h-4 w-4 shrink-0 ${isAdmin ? 'opacity-80' : 'text-slate-400'}`} />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Page Component ---

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

  // References to fix auto-scrolling issues
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const lastMessageIdRef = useRef<string | null>(null);

  // Load conversations
  const loadConversations = async () => {
    try {
      const d = await apiFetch<{ success: boolean; conversations: ConversationItem[] }>("/api/chat/conversations");
      if (d.success) {
        setConversations(d.conversations || []);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const selectedConv = useMemo(() => conversations.find((c) => c.email === selectedEmail), [conversations, selectedEmail]);

  // Scroll logic that checks if we are already at the bottom to prevent yanking
  const scrollToBottomIfNear = useCallback((force = false) => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const isNearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 150;
    
    if (force || isNearBottom) {
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  // Load messages
  const loadMessages = async (isInitialLoad = false) => {
    if (!selectedEmail) return;
    try {
      const d = await apiFetch<{ success: boolean; messages: ChatMsg[] }>("/api/chat/messages/" + encodeURIComponent(selectedEmail));
      if (d.success) {
        const nextMessages = d.messages || [];
        
        // Smart scroll check: only scroll if the latest message ID changed
        const latestId = nextMessages.length > 0 ? nextMessages[nextMessages.length - 1]._id : null;
        const hasNewMessage = latestId !== lastMessageIdRef.current;
        lastMessageIdRef.current = latestId;

        setMessages(nextMessages);

        // Allow DOM to update before calculating scroll
        setTimeout(() => {
          if (isInitialLoad || hasNewMessage) {
            scrollToBottomIfNear(isInitialLoad);
          }
        }, 50);

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
    loadMessages(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmail]);

  useEffect(() => {
    const t = setInterval(() => loadMessages(false), 3000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedEmail]);


  // Handle File Upload
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
        // Scroll to bottom when adding attachment to see the new footer size
        setTimeout(() => scrollToBottomIfNear(true), 100);
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

  // Send message
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
        await loadMessages(true); // Force scroll to bottom on own send
        loadConversations();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-7.5rem)] bg-white rounded-3xl border border-slate-200/90 shadow-lg overflow-hidden font-sans">
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileSelect}
        className="hidden"
        accept="image/*,.pdf,.txt,.cob,.cbl,.zip,.doc,.docx"
      />

      <ChatSidebar
        conversations={conversations}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        loading={loading}
        selectedEmail={selectedEmail}
        setSelectedEmail={setSelectedEmail}
        loadConversations={loadConversations}
      />

      {/* Right Main Chat Window */}
      <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
        {selectedConv ? (
          <>
            <ChatHeader selectedConv={selectedConv} loadMessages={() => loadMessages(true)} />

            {/* Messages Body */}
            <div 
              ref={messagesContainerRef}
              className="flex-1 overflow-y-auto p-6 bg-slate-50/40 custom-scrollbar scroll-smooth"
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="bg-white p-6 rounded-full shadow-sm mb-4">
                    <MessageSquare className="h-12 w-12 text-slate-200" />
                  </div>
                  <p className="text-sm font-bold text-slate-600">No messages in this ticket yet.</p>
                  <p className="text-xs text-slate-400 mt-2 max-w-sm text-center">
                    Send a message below to start the conversation with the user. All messages are securely logged.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col">
                  {/* Optional Date Separator could go here */}
                  <div className="flex justify-center mb-6">
                    <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-[10px] font-bold text-slate-400 shadow-sm">
                      {formatFullDate(messages[0]?.createdAt)}
                    </span>
                  </div>

                  {messages.map((m) => {
                    const isAdmin = m.senderRole === "ADMIN";
                    return (
                      <MessageBubble 
                        key={m._id} 
                        m={m} 
                        isAdmin={isAdmin} 
                        setPreviewImage={setPreviewImage} 
                      />
                    );
                  })}
                </div>
              )}
              <div ref={bottomRef} className="h-1 w-full" />
            </div>

            {/* Message Input Footer */}
            <div className="p-4 border-t border-slate-200/80 bg-white shrink-0 shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.05)] relative z-10">
              {pendingAttachments.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-3 mb-1">
                  {pendingAttachments.map((att, idx) => (
                    <div
                      key={idx}
                      className="relative flex items-center gap-2 px-3 py-2 rounded-xl bg-sky-50 border border-sky-200 text-sky-900 text-xs font-semibold shadow-sm animate-in fade-in zoom-in-95 duration-200"
                    >
                      <div className="p-1 rounded-md bg-white shadow-xs">
                        {att.fileType === "image" ? (
                          <ImageIcon className="h-3.5 w-3.5 text-sky-600" />
                        ) : (
                          <FileText className="h-3.5 w-3.5 text-sky-600" />
                        )}
                      </div>
                      <span className="max-w-[150px] truncate">{att.fileName}</span>
                      <button
                        onClick={() => removePendingAttachment(idx)}
                        className="text-sky-400 hover:text-rose-600 hover:bg-rose-50 p-1 rounded-md transition-colors cursor-pointer ml-1"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex items-end gap-2 bg-slate-50/80 p-1.5 rounded-2xl border border-slate-200/90 focus-within:border-sky-300 focus-within:bg-white focus-within:shadow-md transition-all duration-300">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingFile}
                  title="Attach file or screenshot"
                  className="p-3 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-[#0061FF] transition cursor-pointer disabled:opacity-50 shrink-0 self-end"
                >
                  {uploadingFile ? (
                    <Loader2 className="h-5 w-5 animate-spin text-[#0061FF]" />
                  ) : (
                    <Paperclip className="h-5 w-5" />
                  )}
                </button>

                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      send();
                    }
                  }}
                  placeholder="Type a support response (Shift+Enter for new line)..."
                  className="flex-1 bg-transparent px-3 py-3 text-sm font-medium focus:outline-none resize-none min-h-[44px] max-h-32 custom-scrollbar"
                  rows={1}
                  style={{
                    height: 'auto'
                  }}
                />

                <button
                  type="button"
                  onClick={send}
                  disabled={sending || (!input.trim() && pendingAttachments.length === 0)}
                  className="p-3 rounded-xl bg-gradient-to-r from-[#0061FF] to-[#2563EB] text-white hover:shadow-lg hover:shadow-blue-500/30 transition flex items-center justify-center cursor-pointer disabled:opacity-50 disabled:shadow-none shrink-0 self-end"
                >
                  {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 bg-slate-50/30">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-blue-100 rounded-full blur-xl opacity-50 animate-pulse"></div>
              <MessageSquare className="h-16 w-16 text-slate-300 relative z-10" />
            </div>
            <p className="text-lg font-bold text-slate-800">No Conversation Selected</p>
            <p className="text-sm text-slate-500 mt-2 max-w-sm text-center leading-relaxed">
              Select an active support conversation on the left sidebar to view message history and start responding to user inquiries.
            </p>
          </div>
        )}
      </div>

      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-5xl max-h-[90vh] overflow-hidden rounded-2xl bg-black/50 shadow-2xl animate-in zoom-in-95 duration-300">
            <img src={previewImage} alt="Preview" className="w-full h-full object-contain max-h-[85vh]" />
            <button
              onClick={(e) => { e.stopPropagation(); setPreviewImage(null); }}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition cursor-pointer backdrop-blur-sm"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="absolute bottom-4 left-4 right-4 flex justify-center">
              <a 
                href={previewImage} 
                target="_blank" 
                rel="noreferrer"
                className="px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white text-xs font-bold flex items-center gap-2 transition"
                onClick={e => e.stopPropagation()}
              >
                <ExternalLink className="h-4 w-4" /> Open Original Image
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
