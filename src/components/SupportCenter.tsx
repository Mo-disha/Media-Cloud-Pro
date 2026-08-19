import React, { useState } from 'react';
import { 
  Headphones, 
  Send, 
  Bot, 
  User, 
  Server, 
  PlusCircle, 
  Clock, 
  CheckCircle2, 
  Zap, 
  MessageSquare,
  AlertCircle,
  Activity
} from 'lucide-react';
import { Language, SupportTicket, ServerNodeStatus } from '../types';
import { translations } from '../translations';
import { INITIAL_TICKETS, INITIAL_SERVER_NODES } from '../utils/storage';

interface SupportCenterProps {
  lang: Language;
}

export const SupportCenter: React.FC<SupportCenterProps> = ({ lang }) => {
  const t = translations[lang];
  const [tickets, setTickets] = useState<SupportTicket[]>(INITIAL_TICKETS);
  const [activeTicket, setActiveTicket] = useState<SupportTicket>(INITIAL_TICKETS[0]);
  const [serverNodes, setServerNodes] = useState<ServerNodeStatus[]>(INITIAL_SERVER_NODES);
  const [chatInput, setChatInput] = useState('');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);

  // New Ticket Form State
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<SupportTicket['category']>('speed');
  const [priority, setPriority] = useState<SupportTicket['priority']>('high');
  const [message, setMessage] = useState('');

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMsg = {
      id: 'msg_' + Date.now(),
      sender: 'user' as const,
      senderName: 'Ammar Yaser',
      text: chatInput.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const updatedMessages = [...activeTicket.messages, userMsg];
    const updatedTicket = { ...activeTicket, messages: updatedMessages };

    setActiveTicket(updatedTicket);
    setTickets(prev => prev.map(t => t.id === updatedTicket.id ? updatedTicket : t));
    setChatInput('');

    // Instant AI Bot response
    setTimeout(() => {
      const botResponse = {
        id: 'msg_bot_' + Date.now(),
        sender: 'bot' as const,
        senderName: 'MediaCloud AI Specialist',
        text: lang === 'ar'
          ? 'شكراً لتواصلك! لقد قمنا بفحص السجلات وخوادم CDN الخاصة بك؛ جميع المسارات تعمل بأقصى سعة تحميل (10 Gbps) وشهادات الأمان مفعلة.'
          : 'Thank you for contacting MediaCloud 24/7 Support! Our automated diagnostics show your CDN pipelines are operating at peak efficiency with zero packet drop.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      const withBot = [...updatedMessages, botResponse];
      const botTicket = { ...updatedTicket, messages: withBot };
      setActiveTicket(botTicket);
      setTickets(prev => prev.map(t => t.id === botTicket.id ? botTicket : t));
    }, 1000);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    const newTicket: SupportTicket = {
      id: 'TICK-' + Math.floor(1000 + Math.random() * 9000),
      subject,
      category,
      priority,
      status: 'open',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      updatedAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      messages: [
        {
          id: 'msg_init',
          sender: 'user',
          senderName: 'Ammar Yaser',
          text: message,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        },
        {
          id: 'msg_init_bot',
          sender: 'bot',
          senderName: 'MediaCloud AI Dispatcher',
          text: lang === 'ar' 
            ? 'تم استلام تذكرتك بنجاح وتحويلها للمهندس المناوب في الخوادم السحابية. متوسط وقت الرد أقل من دقيقتين.'
            : 'Ticket created and routed to our on-duty Cloud Infrastructure Engineer. Average response time < 2 minutes.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]
    };

    setTickets([newTicket, ...tickets]);
    setActiveTicket(newTicket);
    setShowNewTicketModal(false);
    setSubject('');
    setMessage('');
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950/40 text-slate-100 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <Headphones className="w-6 h-6 text-green-400" />
            <span>{t.support.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.support.subtitle}</p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.support.createTicket}</span>
        </button>
      </div>

      {/* Global Server & CDN Nodes Monitor */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>{t.support.serverStatus}</span>
          </h3>
          <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
            {t.support.uptime}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {serverNodes.map((node) => (
            <div key={node.id} className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-750 flex items-center justify-between">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2 text-xs font-bold text-white">
                  <span>{node.flag}</span>
                  <span>{node.name}</span>
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                  <span>Load: {node.loadPercentage}%</span>
                  <span>•</span>
                  <span className="text-emerald-400 font-bold">{node.latencyMs}ms</span>
                </div>
              </div>
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50 animate-pulse" />
            </div>
          ))}
        </div>
      </div>

      {/* Live Chat & Tickets Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[520px]">
        {/* Ticket List Sidebar */}
        <div className="lg:col-span-4 p-4 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between overflow-hidden">
          <div className="space-y-3 overflow-y-auto">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ar' ? 'التذاكر النشطة' : 'Active Support Tickets'}
            </h4>
            <div className="space-y-2">
              {tickets.map((tkt) => (
                <div
                  key={tkt.id}
                  onClick={() => setActiveTicket(tkt)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer text-start ${
                    activeTicket.id === tkt.id
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-slate-800/50 border-slate-700/50 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span className="font-mono font-bold text-cyan-400">{tkt.id}</span>
                    <span className="capitalize">{tkt.category}</span>
                  </div>
                  <h5 className="text-xs font-bold truncate">{tkt.subject}</h5>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2">
                    <span className="capitalize text-emerald-400 font-semibold">{tkt.status}</span>
                    <span>{tkt.updatedAt}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live Interactive Chat Area */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 flex flex-col justify-between overflow-hidden shadow-xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-white">{activeTicket.subject}</h4>
                <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  24/7 AI Cloud Engineer & Human On-Duty
                </span>
              </div>
            </div>
            <span className="text-xs font-mono text-cyan-400 font-bold">{activeTicket.id}</span>
          </div>

          {/* Messages Container */}
          <div className="flex-1 my-4 space-y-3 overflow-y-auto pr-1">
            {activeTicket.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-2.5 ${isUser ? 'justify-end' : 'justify-start'}`}
                >
                  {!isUser && (
                    <div className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30 flex items-center justify-center text-xs shrink-0 mt-1">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}

                  <div
                    className={`max-w-md p-3.5 rounded-2xl text-xs space-y-1 ${
                      isUser
                        ? 'bg-blue-600 text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4 text-[10px] opacity-75">
                      <span className="font-bold">{msg.senderName}</span>
                      <span>{msg.timestamp}</span>
                    </div>
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>

                  {isUser && (
                    <div className="w-7 h-7 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center text-xs shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Chat Input Form */}
          <form onSubmit={handleSendMessage} className="pt-2 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder={lang === 'ar' ? 'اكتب رسالتك للمهندس الفني أو المساعد الذكي...' : 'Type your question for 24/7 technical team...'}
              className="flex-1 px-4 py-2.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'إرسال' : 'Send'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-lg p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">{t.support.createTicket}</h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300">{t.support.ticketSubject}</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Bandwidth acceleration request"
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-300">{t.support.ticketCategory}</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                  >
                    <option value="speed">Speed & CDN</option>
                    <option value="storage">Storage Quota</option>
                    <option value="billing">Billing & Upgrade</option>
                    <option value="security">Security & Encryption</option>
                    <option value="api">API & Webhooks</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-300">{t.support.ticketPriority}</label>
                  <select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as any)}
                    className="w-full mt-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-slate-200"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High (Urgent)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300">{t.support.ticketMessage}</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={t.support.ticketMessage}
                  className="w-full mt-1 px-3.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 text-slate-300"
                >
                  {t.actions.cancel}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer"
                >
                  {t.support.submitTicket}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
