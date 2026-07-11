"use client";

import { useState, useEffect } from "react";
import { Search, MoreVertical, Paperclip, Send, Phone, Video, Smile, X, PhoneOff, Mic, Volume2, VolumeX, Trash2, ShieldAlert } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";

export default function WhatsappPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isRtl = locale === 'ar';
  
  // Input message state
  const [message, setMessage] = useState("");
  
  // Contacts search query state
  const [searchQuery, setSearchQuery] = useState("");
  
  // Active Chat State
  const [activeContactId, setActiveContactId] = useState(1);
  
  // Active Dialer Simulation States
  const [activeCallContact, setActiveCallContact] = useState<any>(null);
  const [callTime, setCallTime] = useState(0);

  // Active Chat Search / Dropdown States
  const [isChatSearching, setIsChatSearching] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [showChatMenu, setShowChatMenu] = useState(false);

  // Interactive WhatsApp Features States
  const [mutedContactIds, setMutedContactIds] = useState<number[]>([]);
  const [blockedContactIds, setBlockedContactIds] = useState<number[]>([]);
  const [toast, setToast] = useState<{message: string} | null>(null);

  // Chats Data (Stateful)
  const [contacts, setContacts] = useState([
    { id: 1, name: isRtl ? "أحمد علي" : "Ahmed Ali", lastMessage: isRtl ? "متى يمكننا الاجتماع؟" : "When can we meet?", time: "10:30 AM", unread: 2, online: true },
    { id: 2, name: isRtl ? "سارة خالد" : "Sara Khalid", lastMessage: isRtl ? "شكراً لك" : "Thank you", time: "09:15 AM", unread: 0, online: false },
    { id: 3, name: isRtl ? "محمد فهد" : "Mohammed Fahad", lastMessage: isRtl ? "تم استلام الدفعة" : "Payment received", time: isRtl ? "أمس" : "Yesterday", unread: 0, online: true },
  ]);

  // Messages log by Contact ID (Stateful)
  const [conversations, setConversations] = useState<{ [key: number]: any[] }>({
    1: [
      { id: 1, text: isRtl ? "مرحباً، كيف يمكنني مساعدتك اليوم؟" : "Hello, how can I help you today?", sender: "me", time: "10:00 AM" },
      { id: 2, text: isRtl ? "أريد الاستفسار عن خدماتكم" : "I want to inquire about your services", sender: "other", time: "10:05 AM" },
      { id: 3, text: isRtl ? "بالتأكيد، لدينا عدة باقات تناسب احتياجاتك." : "Sure, we have several packages that suit your needs.", sender: "me", time: "10:06 AM" },
      { id: 4, text: isRtl ? "هل يمكنك إرسال التفاصيل؟" : "Can you send the details?", sender: "other", time: "10:10 AM" },
      { id: 5, text: isRtl ? "بالطبع، سأرسل لك الملف الآن." : "Of course, I will send you the file now.", sender: "me", time: "10:11 AM" },
    ],
    2: [
      { id: 1, text: isRtl ? "أهلاً سارة، كيف تسير الأمور؟" : "Hi Sara, how are things going?", sender: "me", time: "09:00 AM" },
      { id: 2, text: isRtl ? "كل شيء ممتاز، شكراً لك" : "Everything is excellent, thank you", sender: "other", time: "09:15 AM" }
    ],
    3: [
      { id: 1, text: isRtl ? "هل تم تحويل الدفعة الثالثة؟" : "Was the third payment transferred?", sender: "me", time: "Yesterday" },
      { id: 2, text: isRtl ? "نعم، تم استلام الدفعة وسيتم إرسال الفاتورة." : "Yes, payment received and invoice will be sent.", sender: "other", time: "Yesterday" }
    ]
  });

  // Call timer effect
  useEffect(() => {
    let timer: any;
    if (activeCallContact) {
      setCallTime(0);
      timer = setInterval(() => {
        setCallTime(prev => prev + 1);
      }, 1000);
    } else {
      setCallTime(0);
    }
    return () => clearInterval(timer);
  }, [activeCallContact]);

  // Toast Helper
  const showToast = (message: string) => {
    setToast({ message });
    setTimeout(() => setToast(null), 3000);
  };

  // Filter Contacts
  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeContact = contacts.find(c => c.id === activeContactId) || contacts[0];
  const activeMessages = conversations[activeContactId] || [];

  // Filter displayed messages if active chat search is open
  const displayedMessages = chatSearchQuery.trim()
    ? activeMessages.filter(m => m.text.toLowerCase().includes(chatSearchQuery.toLowerCase()))
    : activeMessages;

  const handleSendMessage = () => {
    if (blockedContactIds.includes(activeContactId)) return;
    if (!message.trim()) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMessage = {
      id: Date.now(),
      text: message.trim(),
      sender: "me",
      time: currentTime
    };

    // Append to messages
    setConversations(prev => ({
      ...prev,
      [activeContactId]: [...(prev[activeContactId] || []), newMessage]
    }));

    // Update last message in contact item
    setContacts(prev => prev.map(c => 
      c.id === activeContactId ? { ...c, lastMessage: message.trim(), time: currentTime } : c
    ));

    const sentMessage = message.trim();
    setMessage("");

    // Simulate auto reply after 1.5s (only if not blocked!)
    setTimeout(() => {
      if (blockedContactIds.includes(activeContactId)) return;
      const replyTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const autoReply = {
        id: Date.now() + 1,
        text: isRtl 
          ? `أهلاً بك! تلقيت رسالتك: "${sentMessage}". سأتواصل معك قريباً.` 
          : `Hello! Received your message: "${sentMessage}". I will get back to you shortly.`,
        sender: "other",
        time: replyTime
      };

      setConversations(prev => ({
        ...prev,
        [activeContactId]: [...(prev[activeContactId] || []), autoReply]
      }));

      setContacts(prev => prev.map(c => 
        c.id === activeContactId ? { ...c, lastMessage: autoReply.text, time: replyTime } : c
      ));
    }, 1500);
  };

  // Chat Options handlers
  const handleClearChat = () => {
    setConversations(prev => ({
      ...prev,
      [activeContactId]: []
    }));
    setShowChatMenu(false);
    showToast(isRtl ? "تم مسح المحادثة بنجاح!" : "Chat cleared successfully!");
  };

  const handleToggleMute = () => {
    const isMuted = mutedContactIds.includes(activeContactId);
    if (isMuted) {
      setMutedContactIds(prev => prev.filter(id => id !== activeContactId));
      showToast(isRtl ? "تم إلغاء كتم التنبيهات" : "Chat unmuted");
    } else {
      setMutedContactIds(prev => [...prev, activeContactId]);
      showToast(isRtl ? "تم كتم التنبيهات" : "Chat muted");
    }
    setShowChatMenu(false);
  };

  const handleToggleBlock = () => {
    const isBlocked = blockedContactIds.includes(activeContactId);
    if (isBlocked) {
      setBlockedContactIds(prev => prev.filter(id => id !== activeContactId));
      showToast(isRtl ? "تم إلغاء حظر جهة الاتصال" : "Contact unblocked");
    } else {
      setBlockedContactIds(prev => [...prev, activeContactId]);
      showToast(isRtl ? "تم حظر جهة الاتصال" : "Contact blocked");
    }
    setShowChatMenu(false);
  };

  const formatTime = (sec: number) => {
    const minutes = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-white rounded-xl overflow-hidden border border-slate-200 shadow-sm relative">
      {/* Sidebar / Chat List */}
      <div className={`w-1/3 flex flex-col border-${isRtl ? 'l' : 'r'} border-slate-200 bg-slate-50`}>
        <div className="p-4 bg-white border-b border-slate-200 flex justify-between items-center">
          <h2 className="font-semibold text-lg">{t("whatsapp.chats") || "WhatsApp"}</h2>
          <button className="p-2 hover:bg-slate-100 rounded-full text-slate-500 cursor-pointer">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-3 bg-white border-b border-slate-200">
          <div className="relative">
            <Search className={`absolute ${isRtl ? 'right-3' : 'left-3'} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400`} />
            <input
              type="text"
              placeholder={t("whatsapp.chatSearchPlaceholder") || "Search or start new chat"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full bg-slate-100 rounded-lg py-2 ${isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'} text-sm focus:outline-none focus:ring-2 focus:ring-[var(--primary)] border-transparent`}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {filteredContacts.map((contact) => {
            const isMuted = mutedContactIds.includes(contact.id);
            const isBlocked = blockedContactIds.includes(contact.id);
            return (
              <div 
                key={contact.id} 
                onClick={() => {
                  setActiveContactId(contact.id);
                  setIsChatSearching(false);
                  setChatSearchQuery("");
                  // Reset unread count
                  setContacts(prev => prev.map(c => c.id === contact.id ? { ...c, unread: 0 } : c));
                }}
                className={`flex items-center gap-3 p-3 hover:bg-slate-100 cursor-pointer border-b border-slate-100 last:border-0 transition-colors ${
                  activeContactId === contact.id ? 'bg-slate-200/50' : ''
                }`}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg">
                    {contact.name.charAt(0)}
                  </div>
                  {contact.online && !isBlocked && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className={`flex-1 min-w-0 ${isRtl ? 'text-right' : 'text-left'}`}>
                  <div className="flex justify-between items-baseline mb-1">
                    <div className="flex items-center gap-1.5">
                      {isMuted && <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                      {isBlocked && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
                      <h3 className="font-semibold text-slate-800 truncate text-sm">{contact.name}</h3>
                    </div>
                    <span className="text-xs text-slate-400">{contact.time}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-xs text-slate-500 truncate pl-2">
                      {isBlocked ? (isRtl ? "[محظور]" : "[Blocked]") : contact.lastMessage}
                    </p>
                    {contact.unread > 0 && !isBlocked && (
                      <span className="bg-green-500 text-white text-[10px] rounded-full w-5 h-5 flex items-center justify-center font-bold flex-shrink-0">
                        {contact.unread}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-[#efeae2]">
        {/* Chat Header */}
        <div className="px-4 py-3 bg-white border-b border-slate-200 flex justify-between items-center z-10 relative">
          <div className="flex items-center gap-2 text-slate-500">
            <button 
              onClick={() => setActiveCallContact({ ...activeContact, type: 'video' })}
              className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <Video className="w-5 h-5" />
            </button>
            <button 
              onClick={() => setActiveCallContact({ ...activeContact, type: 'audio' })}
              className="p-2 hover:bg-slate-100 rounded-full cursor-pointer"
            >
              <Phone className="w-5 h-5" />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-1"></div>
            
            {/* Search toggler */}
            <button 
              onClick={() => {
                setIsChatSearching(!isChatSearching);
                setChatSearchQuery("");
              }}
              className={`p-2 rounded-full cursor-pointer transition-colors ${isChatSearching ? 'bg-slate-100 text-[var(--primary)]' : 'hover:bg-slate-100'}`}
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Chat Options toggler */}
            <div className="relative">
              <button 
                onClick={() => setShowChatMenu(!showChatMenu)}
                className={`p-2 rounded-full cursor-pointer transition-colors ${showChatMenu ? 'bg-slate-100' : 'hover:bg-slate-100'}`}
              >
                <MoreVertical className="w-5 h-5" />
              </button>
              
              {showChatMenu && (
                <div className={`absolute top-full mt-2 w-48 bg-white border border-slate-100 rounded-xl shadow-lg z-20 py-1 ${isRtl ? 'left-0' : 'right-0'}`}>
                  <button 
                    onClick={handleClearChat}
                    className="w-full text-right px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4 text-slate-400" />
                    {isRtl ? "مسح المحادثة" : "Clear Chat"}
                  </button>
                  <button 
                    onClick={handleToggleMute}
                    className="w-full text-right px-4 py-2.5 text-sm hover:bg-slate-50 text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <VolumeX className="w-4 h-4 text-slate-400" />
                    {mutedContactIds.includes(activeContactId) 
                      ? (isRtl ? "إلغاء كتم التنبيهات" : "Unmute Notifications")
                      : (isRtl ? "كتم التنبيهات" : "Mute Notifications")
                    }
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button 
                    onClick={handleToggleBlock}
                    className="w-full text-right px-4 py-2.5 text-sm hover:bg-red-50 text-red-600 flex items-center gap-2 cursor-pointer"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    {blockedContactIds.includes(activeContactId)
                      ? (isRtl ? "إلغاء حظر الرقم" : "Unblock Contact")
                      : (isRtl ? "حظر جهة الاتصال" : "Block Contact")
                    }
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isChatSearching ? (
              <div className="flex items-center gap-2 w-64 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <Search className="w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder={isRtl ? "بحث في الرسائل..." : "Search messages..."} 
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  className={`bg-transparent border-0 outline-none text-xs w-full ${isRtl ? 'text-right' : 'text-left'}`}
                  autoFocus
                />
                <button 
                  onClick={() => {
                    setIsChatSearching(false);
                    setChatSearchQuery("");
                  }} 
                  className="text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className={isRtl ? 'text-right' : 'text-left'}>
                  <h3 className="font-semibold text-slate-900 text-sm flex items-center gap-1.5 justify-end">
                    {mutedContactIds.includes(activeContact.id) && <VolumeX className="w-3.5 h-3.5 text-slate-400" />}
                    {blockedContactIds.includes(activeContact.id) && <ShieldAlert className="w-3.5 h-3.5 text-red-500" />}
                    {activeContact.name}
                  </h3>
                  <p className="text-[10px] text-slate-500">
                    {blockedContactIds.includes(activeContact.id) 
                      ? (isRtl ? "محظور" : "Blocked")
                      : activeContact.online ? (isRtl ? "نشط الآن" : "Online") : (isRtl ? "نشط منذ فترة" : "Offline")
                    }
                  </p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                  {activeContact.name.charAt(0)}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Messages list with Search notification */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {chatSearchQuery.trim() && (
            <div className="text-center">
              <span className="bg-slate-800 text-white text-xs py-1.5 px-4 rounded-xl shadow-sm">
                {isRtl 
                  ? `عثرنا على ${displayedMessages.length} رسالة مطابقة للبحث` 
                  : `Found ${displayedMessages.length} matching messages`
                }
              </span>
            </div>
          )}
          
          <div className="text-center my-4">
            <span className="bg-white/80 backdrop-blur-sm text-slate-500 text-xs py-1 px-3 rounded-lg shadow-sm">
              {isRtl ? "اليوم" : "Today"}
            </span>
          </div>
          
          {displayedMessages.map((msg) => {
            const isMe = msg.sender === "me";
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] rounded-lg p-3 shadow-sm ${isRtl ? 'text-right' : 'text-left'} ${
                  isMe ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-none' : 'bg-white text-slate-900 rounded-tl-none'
                }`}>
                  <p className="text-sm font-sans">{msg.text}</p>
                  <div className={`flex items-center justify-end mt-1 gap-1 text-[10px] text-slate-400`}>
                    {msg.time}
                    {isMe && (
                      <svg viewBox="0 0 16 15" width="16" height="15" className="text-blue-500">
                        <path fill="currentColor" d="M15.01 3.316l-.478-.372a.365.365 0 0 0-.51.063L8.666 9.879a.32.32 0 0 1-.484.033l-.358-.325a.319.319 0 0 0-.484.032l-.378.483a.418.418 0 0 0 .036.541l1.32 1.266c.143.14.361.125.484-.033l6.272-8.048a.366.366 0 0 0-.064-.512zm-4.1 0l-.478-.372a.365.365 0 0 0-.51.063L4.566 9.879a.32.32 0 0 1-.484.033L1.891 7.769a.366.366 0 0 0-.515.006l-.423.433a.364.364 0 0 0 .006.514l3.258 3.185c.143.14.361.125.484-.033l6.272-8.048a.365.365 0 0 0-.063-.51z"></path>
                      </svg>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Input / Block Banner Area */}
        {blockedContactIds.includes(activeContactId) ? (
          <div className="px-6 py-4 bg-red-50 border-t border-red-100 flex items-center justify-between text-red-800 text-sm font-semibold z-10">
            <span className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-red-600" />
              {isRtl 
                ? "لقد قمت بحظر جهة الاتصال هذه. لا يمكنك تبادل الرسائل."
                : "You blocked this contact. Messages cannot be exchanged."
              }
            </span>
            <button 
              onClick={handleToggleBlock}
              className="bg-red-600 text-white text-xs px-3.5 py-1.5 rounded-lg hover:bg-red-700 transition-colors cursor-pointer"
            >
              {isRtl ? "إلغاء الحظر" : "Unblock"}
            </button>
          </div>
        ) : (
          <div className="px-4 py-3 bg-white flex items-end gap-2 z-10">
            <button 
              onClick={handleSendMessage}
              className={`p-3 rounded-full flex items-center justify-center transition-colors cursor-pointer ${
                message.trim() 
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700' 
                  : 'bg-slate-100 text-slate-400'
              }`}
            >
              <Send className={`w-5 h-5 ${isRtl && message.trim() ? 'rotate-180' : ''}`} />
            </button>
            
            <div className="flex-1 bg-white border border-slate-200 rounded-lg overflow-hidden flex items-end min-h-[44px]">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={t("whatsapp.typeMessage") || "Type a message"}
                className="w-full max-h-32 p-3 outline-none resize-none overflow-y-auto text-sm text-right"
                rows={1}
              />
            </div>

            <button className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
              <Smile className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>

      {/* Dialer simulation modal for WhatsApp */}
      {activeCallContact && (
        <div className="absolute inset-0 bg-slate-950/95 z-50 flex items-center justify-center p-4">
          <div className="text-white max-w-sm w-full p-8 text-center space-y-8 animate-in zoom-in-95 duration-200">
            <div className="space-y-2">
              <div className="w-24 h-24 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto animate-pulse">
                {activeCallContact.type === 'video' ? (
                  <Video className="w-12 h-12" />
                ) : (
                  <Phone className="w-12 h-12 animate-bounce" />
                )}
              </div>
              <h3 className="text-2xl font-bold font-sans mt-4">{activeCallContact.name}</h3>
              <p className="text-slate-400 text-sm">
                {activeCallContact.type === 'video' 
                  ? (isRtl ? "مكالمة فيديو جارية..." : "Video Call On...") 
                  : (isRtl ? "اتصال صوتي جارٍ..." : "Voice Call On...")}
              </p>
            </div>

            <div className="text-3xl font-mono tracking-wider font-semibold text-emerald-400">
              {formatTime(callTime)}
            </div>

            <div className="flex justify-center gap-6 text-slate-400">
              <button className="w-12 h-12 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center transition-colors">
                <Mic className="w-5 h-5" />
              </button>
              <button className="w-12 h-12 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center transition-colors">
                <Volume2 className="w-5 h-5" />
              </button>
            </div>

            <button 
              onClick={() => setActiveCallContact(null)}
              className="w-14 h-14 bg-red-600 hover:bg-red-700 text-white rounded-full flex items-center justify-center mx-auto transition-colors shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <PhoneOff className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 bg-slate-950 text-white px-4 py-3 rounded-xl shadow-2xl z-55 flex items-center gap-2.5 animate-in slide-in-from-bottom duration-300">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-sm font-semibold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
