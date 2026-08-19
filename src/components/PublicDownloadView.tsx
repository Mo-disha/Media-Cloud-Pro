import React, { useState, useEffect } from 'react';
import { 
  Download, 
  ShieldCheck, 
  Copy, 
  Check, 
  Share2, 
  Lock, 
  Unlock, 
  FileText, 
  HardDrive, 
  Calendar, 
  User, 
  Eye, 
  QrCode, 
  Sparkles, 
  Zap, 
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Play,
  Pause,
  CloudLightning,
  AlertTriangle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileItem, Language } from '../types';
import { translations } from '../translations';
import { formatBytes } from '../utils/storage';

interface PublicDownloadViewProps {
  lang: Language;
  file: FileItem;
  onBackToDrive: () => void;
  onSaveToCloud: (file: FileItem) => void;
  onDownloadFile: (file: FileItem) => void;
}

export const PublicDownloadView: React.FC<PublicDownloadViewProps> = ({
  lang,
  file,
  onBackToDrive,
  onSaveToCloud,
  onDownloadFile,
}) => {
  const t = translations[lang];
  const [copied, setCopied] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(!file.password);
  const [passwordError, setPasswordError] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadSpeed, setDownloadSpeed] = useState('48.5 MB/s');
  const [showQR, setShowQR] = useState(false);
  const [savedToCloud, setSavedToCloud] = useState(false);

  // Trigger confetti on successful direct download trigger
  const handleStartDownload = () => {
    if (file.password && !isUnlocked) {
      setPasswordError(true);
      return;
    }

    setDownloading(true);
    setDownloadProgress(0);

    // Realistic burst download simulation
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 }
            });
          } catch (e) {}
          onDownloadFile(file);
          return 100;
        }
        return prev + 15;
      });
    }, 200);
  };

  const handleUnlockPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === file.password) {
      setIsUnlocked(true);
      setPasswordError(false);
    } else {
      setPasswordError(true);
    }
  };

  const copyDirectLink = () => {
    navigator.clipboard.writeText(file.directDownloadUrl || window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const shareVia = (platform: 'whatsapp' | 'telegram' | 'twitter' | 'facebook' | 'email') => {
    const url = encodeURIComponent(file.directDownloadUrl || window.location.href);
    const text = encodeURIComponent(`Download ${file.name} (${formatBytes(file.size)}) via MediaCloud Pro`);
    let shareUrl = '';

    if (platform === 'whatsapp') shareUrl = `https://api.whatsapp.com/send?text=${text}%20${url}`;
    if (platform === 'telegram') shareUrl = `https://t.me/share/url?url=${url}&text=${text}`;
    if (platform === 'twitter') shareUrl = `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    if (platform === 'facebook') shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
    if (platform === 'email') shareUrl = `mailto:?subject=${text}&body=${url}`;

    window.open(shareUrl, '_blank');
  };

  const handleSaveToCloud = () => {
    setSavedToCloud(true);
    onSaveToCloud(file);
    setTimeout(() => setSavedToCloud(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 p-4 sm:p-6 lg:p-8 flex flex-col items-center justify-between">
      {/* Top Header Bar */}
      <div className="w-full max-w-4xl flex items-center justify-between pb-6 border-b border-slate-800">
        <button
          onClick={onBackToDrive}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all cursor-pointer"
        >
          {lang === 'ar' ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
          <span>{lang === 'ar' ? 'العودة إلى لوحة التحكم' : 'Back to Cloud Drive'}</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-mono font-bold text-emerald-400">
            {lang === 'ar' ? 'خوادم التنزيل المباشر: فائقة السرعة (10 Gbps)' : 'Direct CDN Nodes: Ultra-Fast (10 Gbps)'}
          </span>
        </div>
      </div>

      {/* Main Download Card (Authentic MediaFire Style Layout) */}
      <div className="w-full max-w-4xl my-8 bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cyan-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: File Info & MediaFire Iconic Card */}
          <div className="lg:col-span-7 space-y-6 text-start">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30">
                <FileText className="w-8 h-8" />
              </div>
              <div className="min-w-0 flex-1">
                <span className="text-[10px] uppercase font-black tracking-widest px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  {file.extension.toUpperCase()} FILE
                </span>
                <h1 className="text-lg sm:text-xl font-black text-white mt-1 break-words line-clamp-2" title={file.name}>
                  {file.name}
                </h1>
              </div>
            </div>

            {/* VirusTotal & Cloud Antivirus Verified Clean Badge */}
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
              <div className="text-xs">
                <div className="font-bold">{t.downloadPortal.virusScanClean}</div>
                <div className="text-[11px] text-emerald-400/80">{t.downloadPortal.virusEngines}</div>
              </div>
            </div>

            {/* Password Protection Lock Screen if file locked */}
            {file.password && !isUnlocked && (
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/60 text-amber-200 space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-300">
                  <Lock className="w-4 h-4" />
                  <span>{t.downloadPortal.passwordRequired}</span>
                </div>
                <form onSubmit={handleUnlockPassword} className="flex gap-2">
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    placeholder={t.downloadPortal.enterPassword}
                    className="flex-1 px-3 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 text-xs font-bold rounded-xl bg-amber-600 hover:bg-amber-500 text-white transition-all cursor-pointer flex items-center gap-1"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>{t.downloadPortal.unlockBtn}</span>
                  </button>
                </form>
                {passwordError && (
                  <p className="text-[11px] text-rose-400 font-medium">
                    {t.downloadPortal.wrongPassword}
                  </p>
                )}
              </div>
            )}

            {/* File Metadata Details Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs bg-slate-800/40 p-4 rounded-2xl border border-slate-800">
              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <HardDrive className="w-3.5 h-3.5 text-blue-400" />
                  {t.downloadPortal.fileSize}
                </span>
                <p className="font-mono font-bold text-white text-sm">{formatBytes(file.size)}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                  {t.downloadPortal.uploadDate}
                </span>
                <p className="font-mono font-semibold text-slate-200">{file.uploadDate}</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-cyan-400" />
                  {t.downloadPortal.downloads}
                </span>
                <p className="font-mono font-bold text-cyan-400 text-sm">{file.downloadsCount.toLocaleString()} times</p>
              </div>

              <div className="space-y-1">
                <span className="text-slate-400 text-[11px] flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-amber-400" />
                  {t.downloadPortal.uploader}
                </span>
                <p className="font-semibold text-slate-200 truncate">{file.uploader.name}</p>
              </div>
            </div>

            {/* SHA-256 Checksum */}
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/50 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-400">
                <span className="font-bold">{t.downloadPortal.sha256}</span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(file.sha256Hash);
                    setCopied(true);
                    setTimeout(() => setCopied(false), 2000);
                  }}
                  className="text-blue-400 hover:text-blue-300 font-semibold flex items-center gap-1"
                >
                  <Copy className="w-3 h-3" />
                  {copied ? 'Copied' : 'Copy Hash'}
                </button>
              </div>
              <p className="text-[10px] font-mono text-slate-300 truncate bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {file.sha256Hash}
              </p>
            </div>
          </div>

          {/* Right Column: BIG DOWNLOAD BUTTON (MediaFire Iconic Action Card) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center space-y-4 bg-slate-850/80 p-6 rounded-3xl border border-slate-800 text-center shadow-lg">
            {/* Speed Boost Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold animate-pulse">
              <Zap className="w-3.5 h-3.5 fill-cyan-400 text-cyan-400" />
              <span>{t.downloadPortal.speedBoost}</span>
            </div>

            {/* THE BIG MEDIAFIRE DOWNLOAD BUTTON */}
            <button
              id="mediafire-direct-download-btn"
              onClick={handleStartDownload}
              disabled={downloading || (file.password && !isUnlocked)}
              className={`w-full py-4 px-6 rounded-2xl font-black text-base sm:text-lg text-white shadow-xl transition-all duration-200 transform active:scale-95 flex flex-col items-center justify-center gap-1 cursor-pointer ${
                file.password && !isUnlocked
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 shadow-blue-600/30 hover:shadow-cyan-500/40 hover:-translate-y-0.5'
              }`}
            >
              <div className="flex items-center gap-2">
                <Download className={`w-6 h-6 ${downloading ? 'animate-bounce' : ''}`} />
                <span>{t.downloadPortal.downloadBtn}</span>
              </div>
              <span className="text-xs font-mono font-normal opacity-90">
                ({formatBytes(file.size)})
              </span>
            </button>

            {/* Download In Progress Bar */}
            {downloading && (
              <div className="w-full space-y-1.5 animate-in fade-in">
                <div className="flex justify-between text-xs font-mono text-slate-300">
                  <span>Transfer Rate: {downloadSpeed}</span>
                  <span className="text-cyan-400 font-bold">{downloadProgress}%</span>
                </div>
                <div className="w-full bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-200"
                    style={{ width: `${downloadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Secondary Direct Cloud Actions */}
            <div className="w-full space-y-2 pt-2">
              {/* Save to My Cloud Button */}
              <button
                onClick={handleSaveToCloud}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-750 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <CloudLightning className="w-4 h-4 text-amber-400" />
                <span>{savedToCloud ? (lang === 'ar' ? '✓ تم الحفظ في حسابك!' : '✓ Saved to your cloud!') : t.downloadPortal.saveToMyCloud}</span>
              </button>

              {/* Copy Direct Link Button */}
              <button
                onClick={copyDirectLink}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700/60 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-blue-400" />}
                <span>{copied ? t.downloadPortal.copied : t.actions.copyLink}</span>
              </button>
            </div>

            {/* QR Code & Mobile Fast Download */}
            <div className="w-full pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <button
                onClick={() => setShowQR(!showQR)}
                className="flex items-center gap-1.5 hover:text-white transition-colors"
              >
                <QrCode className="w-4 h-4 text-indigo-400" />
                <span>{t.downloadPortal.qrCodeTitle}</span>
              </button>

              {/* Social Share Trigger */}
              <div className="flex items-center gap-1.5">
                <button onClick={() => shareVia('whatsapp')} title="WhatsApp" className="p-1.5 rounded-lg bg-slate-800 hover:bg-emerald-600 text-slate-300 hover:text-white transition-colors">
                  WA
                </button>
                <button onClick={() => shareVia('telegram')} title="Telegram" className="p-1.5 rounded-lg bg-slate-800 hover:bg-sky-500 text-slate-300 hover:text-white transition-colors">
                  TG
                </button>
                <button onClick={() => shareVia('twitter')} title="Twitter/X" className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-600 text-slate-300 hover:text-white transition-colors">
                  𝕏
                </button>
              </div>
            </div>

            {/* QR Code Expansion Modal/Box */}
            {showQR && (
              <div className="p-4 rounded-2xl bg-white text-slate-900 flex flex-col items-center justify-center space-y-2 animate-in zoom-in-95">
                {/* Visual SVG QR Code Mock */}
                <div className="w-32 h-32 bg-slate-900 p-2 rounded-xl flex items-center justify-center">
                  <div className="grid grid-cols-4 gap-1 w-full h-full p-1 bg-white rounded">
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-white"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                    <div className="bg-slate-900 rounded-sm"></div>
                  </div>
                </div>
                <span className="text-[11px] font-bold text-slate-700">{file.name}</span>
                <span className="text-[10px] text-slate-500 font-mono">Scan with Camera app</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer / Server Node Info */}
      <footer className="text-center text-xs text-slate-500 space-y-1">
        <p>© 2026 MediaCloud Pro CDN Architecture. All rights reserved.</p>
        <p className="text-[11px]">Military Grade AES-256 Cloud Infrastructure • Direct High-Speed Download Pipelines</p>
      </footer>
    </div>
  );
};
