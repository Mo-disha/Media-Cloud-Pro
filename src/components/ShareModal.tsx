import React, { useState } from 'react';
import { 
  X, 
  Share2, 
  Copy, 
  Check, 
  Lock, 
  Clock, 
  ShieldCheck, 
  Globe, 
  QrCode, 
  ExternalLink,
  Code,
  Sparkles
} from 'lucide-react';
import { FileItem, Language } from '../types';
import { translations } from '../translations';
import { formatBytes } from '../utils/storage';

interface ShareModalProps {
  lang: Language;
  file: FileItem | null;
  onClose: () => void;
  onUpdateFile: (updatedFile: FileItem) => void;
  onOpenDirectLanding: (file: FileItem) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  lang,
  file,
  onClose,
  onUpdateFile,
  onOpenDirectLanding,
}) => {
  const t = translations[lang];
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmbed, setCopiedEmbed] = useState(false);
  const [password, setPassword] = useState(file?.password || '');
  const [isEncrypted, setIsEncrypted] = useState(file?.isEncrypted ?? false);
  const [expiresAt, setExpiresAt] = useState<string>(file?.expiresAt || 'none');
  const [savedSettings, setSavedSettings] = useState(false);

  if (!file) return null;

  const directUrl = file.directDownloadUrl || `https://download.mediacloud.net/direct/${file.shareCode}/${encodeURIComponent(file.name)}`;
  const embedCode = `<iframe src="${directUrl}" width="100%" height="200px" frameborder="0"></iframe>`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(directUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const handleCopyEmbed = () => {
    navigator.clipboard.writeText(embedCode);
    setCopiedEmbed(true);
    setTimeout(() => setCopiedEmbed(false), 2500);
  };

  const handleSaveSecuritySettings = () => {
    const updated: FileItem = {
      ...file,
      password: password.trim() || undefined,
      isEncrypted,
      expiresAt: expiresAt === 'none' ? null : expiresAt
    };
    onUpdateFile(updated);
    setSavedSettings(true);
    setTimeout(() => setSavedSettings(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.actions.share}</h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">{file.name}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {/* Direct Fast Link Box */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{t.downloadPortal.directDownload}</span>
              <span className="text-[10px] text-cyan-400 font-mono">10 Gbps Burst Active</span>
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={directUrl}
                className="flex-1 px-3.5 py-2.5 text-xs font-mono rounded-xl bg-slate-950 border border-slate-700 text-slate-200 focus:outline-none select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 cursor-pointer shrink-0"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? t.downloadPortal.copied : t.actions.copyLink}</span>
              </button>
            </div>
          </div>

          {/* MediaFire Direct Landing Page Quick Preview */}
          <div className="p-3.5 rounded-2xl bg-blue-950/30 border border-blue-800/50 flex items-center justify-between gap-3">
            <div>
              <h5 className="text-xs font-bold text-blue-300 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                {lang === 'ar' ? 'صفحة التحميل المباشر للجمهور' : 'Public MediaFire Download Portal'}
              </h5>
              <p className="text-[11px] text-slate-400">
                {lang === 'ar' ? 'تصميم عصري سريع مع فحص الفيروسات وزر تحميل مباشر' : 'Clean download portal with antivirus verification and QR code'}
              </p>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenDirectLanding(file);
              }}
              className="px-3 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white flex items-center gap-1 shrink-0 cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>{lang === 'ar' ? 'فتح' : 'Open'}</span>
            </button>
          </div>

          {/* Link Security & Expiration Settings */}
          <div className="space-y-4 pt-3 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              {lang === 'ar' ? 'إعدادات الأمان وحماية الرابط' : 'Link Security & Controls'}
            </h4>

            {/* Password Protection */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                {t.uploadModal.enablePassword}
              </label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={t.uploadModal.passwordPlaceholder}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-850 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Expiration Duration */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" />
                {t.uploadModal.expiryTime}
              </label>
              <select
                value={expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-850 border border-slate-700 text-slate-200 focus:outline-none cursor-pointer"
              >
                <option value="none">{t.uploadModal.noExpiry}</option>
                <option value="1_hour">{t.uploadModal.after1Hour}</option>
                <option value="24_hours">{t.uploadModal.after24Hours}</option>
                <option value="7_days">{t.uploadModal.after7Days}</option>
                <option value="30_days">{t.uploadModal.after30Days}</option>
                <option value="one_time">{t.uploadModal.oneTimeDownload}</option>
              </select>
            </div>

            {/* Embed Snippet Code */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold flex items-center gap-1">
                  <Code className="w-3.5 h-3.5 text-pink-400" />
                  {lang === 'ar' ? 'كود التضمين في المواقع (HTML Embed)' : 'HTML Embed Code'}
                </span>
                <button
                  onClick={handleCopyEmbed}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copiedEmbed ? 'Copied!' : 'Copy Code'}
                </button>
              </div>
              <input
                type="text"
                readOnly
                value={embedCode}
                className="w-full px-3 py-1.5 text-[11px] font-mono rounded-lg bg-slate-950 border border-slate-800 text-slate-400 select-all"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-850/50 flex items-center justify-between">
          <span className="text-xs font-semibold text-emerald-400">
            {savedSettings ? (lang === 'ar' ? '✓ تم تحديث إعدادات الرابط!' : '✓ Link settings updated!') : ''}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300"
            >
              {t.actions.close}
            </button>
            <button
              onClick={handleSaveSecuritySettings}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md transition-all cursor-pointer"
            >
              {t.actions.saveChanges}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
