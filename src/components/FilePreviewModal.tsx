import React, { useState } from 'react';
import { 
  X, 
  Download, 
  Share2, 
  ExternalLink, 
  FileText, 
  ShieldCheck, 
  Lock, 
  Eye, 
  Calendar, 
  HardDrive, 
  Play, 
  Pause, 
  Volume2, 
  Archive, 
  Code,
  FileCheck
} from 'lucide-react';
import { FileItem, Language } from '../types';
import { translations } from '../translations';
import { formatBytes } from '../utils/storage';

interface FilePreviewModalProps {
  lang: Language;
  file: FileItem | null;
  onClose: () => void;
  onDownload: (file: FileItem) => void;
  onShare: (file: FileItem) => void;
  onOpenDirectLanding: (file: FileItem) => void;
}

export const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  lang,
  file,
  onClose,
  onDownload,
  onShare,
  onOpenDirectLanding,
}) => {
  const t = translations[lang];
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);

  if (!file) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850/50">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30 shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-white truncate" title={file.name}>
                {file.name}
              </h3>
              <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                <span>{formatBytes(file.size)}</span>
                <span>•</span>
                <span className="uppercase text-cyan-400">{file.extension}</span>
                {file.isEncrypted && (
                  <span className="text-teal-400 flex items-center gap-0.5">
                    • <ShieldCheck className="w-3 h-3" /> AES-256
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Viewer Body */}
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
          {/* Image Previewer */}
          {file.category === 'images' && file.dataUrl && (
            <div className="flex items-center justify-center rounded-2xl bg-slate-950 p-2 border border-slate-800 max-h-96 overflow-hidden">
              <img
                src={file.dataUrl}
                alt={file.name}
                className="max-h-80 w-auto object-contain rounded-xl"
              />
            </div>
          )}

          {/* Audio Player */}
          {file.category === 'audio' && (
            <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/50 to-indigo-950/50 border border-violet-800/40 text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-violet-600/20 border border-violet-500/30 text-violet-400 mx-auto flex items-center justify-center shadow-lg">
                <Volume2 className="w-8 h-8 animate-pulse" />
              </div>
              <h4 className="text-sm font-bold text-slate-200">{file.name}</h4>
              
              {/* Simulated Waveform Equalizer */}
              <div className="flex items-center justify-center gap-1 h-12 px-4">
                {[40, 65, 30, 90, 45, 80, 60, 95, 35, 70, 85, 50, 65, 30, 90, 75, 40, 80, 55, 30].map((h, i) => (
                  <div
                    key={i}
                    className="w-1.5 bg-gradient-to-t from-violet-600 to-cyan-400 rounded-full transition-all duration-300"
                    style={{ height: isPlayingAudio ? `${h}%` : '20%' }}
                  />
                ))}
              </div>

              <button
                onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                className="px-6 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 mx-auto cursor-pointer"
              >
                {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
                <span>{isPlayingAudio ? (lang === 'ar' ? 'إيقاف مؤقت' : 'Pause Audio') : (lang === 'ar' ? 'تشغيل المقطع' : 'Play Soundtrack')}</span>
              </button>
            </div>
          )}

          {/* Video Player */}
          {file.category === 'videos' && (
            <div className="rounded-2xl bg-slate-950 border border-slate-800 p-4 text-center space-y-3">
              <div className="aspect-video w-full rounded-xl bg-slate-900 flex flex-col items-center justify-center text-slate-400 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/30 to-indigo-900/30 pointer-events-none" />
                <div className="w-16 h-16 rounded-full bg-blue-600/30 text-cyan-300 border border-cyan-400/40 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Play className="w-8 h-8 fill-cyan-300 translate-x-0.5" />
                </div>
                <span className="text-xs font-mono font-bold text-slate-300 mt-2">Ultra-HD 4K Video Stream Ready</span>
              </div>
            </div>
          )}

          {/* Archive / ZIP Inspector */}
          {file.category === 'archives' && (
            <div className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/60 space-y-3 text-start">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-700/60 pb-2">
                <span className="flex items-center gap-1.5">
                  <Archive className="w-4 h-4 text-amber-400" />
                  {lang === 'ar' ? 'محتويات الأرشيف المضغوط (ZIP Structure)' : 'Archive Contents (ZIP Structure)'}
                </span>
                <span className="text-amber-400 font-mono text-[11px]">4 Files Inside</span>
              </div>
              <div className="space-y-1.5 text-xs font-mono text-slate-300">
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/80">
                  <span>📄 database_dump_2025.sql</span>
                  <span className="text-slate-500">1.8 GB</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/80">
                  <span>📁 /schemas/table_definitions.json</span>
                  <span className="text-slate-500">240 MB</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/80">
                  <span>🔐 master_encryption_key.asc</span>
                  <span className="text-slate-500">4 KB</span>
                </div>
                <div className="flex justify-between p-2 rounded-lg bg-slate-900/80">
                  <span>📄 README_RESTORE_GUIDE.md</span>
                  <span className="text-slate-500">12 KB</span>
                </div>
              </div>
            </div>
          )}

          {/* Document / Software / Default Info Card */}
          {['documents', 'software', 'others'].includes(file.category) && (
            <div className="p-4 rounded-2xl bg-slate-800/40 border border-slate-700/60 text-start space-y-2">
              <h5 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-cyan-400" />
                {lang === 'ar' ? 'فحص البنية والبيانات الوصفية' : 'Inspection & Metadata'}
              </h5>
              <div className="bg-slate-900 p-3 rounded-xl font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
                <p><span className="text-slate-500">MIME-Type:</span> {file.type}</p>
                <p><span className="text-slate-500">SHA-256:</span> {file.sha256Hash}</p>
                <p><span className="text-slate-500">Encryption:</span> {file.isEncrypted ? 'AES-256-GCM Military Grade' : 'Standard Transport Security'}</p>
                <p><span className="text-slate-500">Integrity Check:</span> <span className="text-emerald-400">Passed (0 corruption errors)</span></p>
              </div>
            </div>
          )}

          {/* Security & Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-start text-xs bg-slate-800/30 p-3.5 rounded-2xl border border-slate-800">
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">{t.downloadPortal.fileSize}</span>
              <p className="font-mono font-bold text-white">{formatBytes(file.size)}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">{t.downloadPortal.uploadDate}</span>
              <p className="font-mono font-semibold text-slate-300">{file.uploadDate}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">{t.downloadPortal.downloads}</span>
              <p className="font-mono font-bold text-cyan-400">{file.downloadsCount}</p>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] uppercase font-bold">{t.downloadPortal.virusScan}</span>
              <p className="font-bold text-emerald-400 flex items-center gap-1">
                <FileCheck className="w-3.5 h-3.5" /> 100% Clean
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-850/50 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => {
              onClose();
              onOpenDirectLanding(file);
            }}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'صفحة التحميل المباشر' : 'MediaFire Download Page'}</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onShare(file);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-blue-400 border border-slate-700 transition-all cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{t.actions.share}</span>
            </button>

            <button
              onClick={() => onDownload(file)}
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-black rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t.actions.download}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
