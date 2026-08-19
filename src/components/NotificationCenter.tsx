import React, { useState } from 'react';
import { 
  X, 
  Bell, 
  Mail, 
  Download, 
  ShieldCheck, 
  DatabaseBackup, 
  Check, 
  ExternalLink,
  Sparkles
} from 'lucide-react';
import { NotificationItem, Language } from '../types';

interface NotificationCenterProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  lang,
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
}) => {
  const [activeEmailPreview, setActiveEmailPreview] = useState<NotificationItem | null>(null);

  if (!isOpen) return null;

  const getNotifIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'download':
        return <Download className="w-4 h-4 text-cyan-400" />;
      case 'security':
        return <ShieldCheck className="w-4 h-4 text-amber-400" />;
      case 'system':
        return <DatabaseBackup className="w-4 h-4 text-emerald-400" />;
      default:
        return <Bell className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {lang === 'ar' ? 'مركز التنبيهات والإشعارات الذكية' : 'Smart Notification Center'}
              </h3>
              <p className="text-xs text-slate-400">Push notifications & Instant Email alerts</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between pb-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'ar' ? 'أحدث التنبيهات' : 'Recent Alerts'} ({notifications.length})
            </span>
            <button
              onClick={onMarkAllRead}
              className="text-xs text-blue-400 hover:text-blue-300 font-semibold"
            >
              {lang === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all as read'}
            </button>
          </div>

          <div className="space-y-2.5">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  n.isRead
                    ? 'bg-slate-850/40 border-slate-800 text-slate-300'
                    : 'bg-blue-950/30 border-blue-800/60 text-white shadow-sm'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0">
                  <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 shrink-0 mt-0.5">
                    {getNotifIcon(n.type)}
                  </div>
                  <div className="min-w-0 space-y-1">
                    <h4 className="text-xs font-bold truncate">
                      {lang === 'ar' ? n.titleAr : n.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      {lang === 'ar' ? n.messageAr : n.message}
                    </p>
                    <span className="text-[10px] text-slate-500 font-mono block">
                      {n.timestamp}
                    </span>
                  </div>
                </div>

                {/* Open Email Preview Modal */}
                <button
                  onClick={() => setActiveEmailPreview(n)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white shrink-0"
                  title="View Email Alert Format"
                >
                  <Mail className="w-4 h-4 text-cyan-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Email Alert Preview Simulation Box */}
          {activeEmailPreview && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-2">
                <span className="font-bold text-cyan-400 flex items-center gap-1.5">
                  <Mail className="w-4 h-4" />
                  {lang === 'ar' ? 'معاينة رسالة البريد الإلكتروني الفورية' : 'Instant Email Alert Preview'}
                </span>
                <button onClick={() => setActiveEmailPreview(null)} className="text-slate-500 hover:text-white">✕</button>
              </div>
              <div className="text-xs space-y-2 text-slate-300 font-sans">
                <div className="text-[11px] text-slate-400">
                  <p><span className="text-slate-500">From:</span> alerts@mediacloud.net</p>
                  <p><span className="text-slate-500">To:</span> ammar@mediacloud.net</p>
                  <p><span className="text-slate-500">Subject:</span> [Security & CDN Notification] {activeEmailPreview.title}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                  <h5 className="font-bold text-white text-xs">{activeEmailPreview.title}</h5>
                  <p className="text-[11px] text-slate-300">{activeEmailPreview.message}</p>
                  <p className="text-[10px] text-slate-500">Timestamp: {new Date().toUTCString()} • Server: Riyadh Node #1</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-850/50 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
          >
            {lang === 'ar' ? 'إغلاق' : 'Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
