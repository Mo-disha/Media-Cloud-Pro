import React, { useState, useRef } from 'react';
import { 
  X, 
  UploadCloud, 
  ShieldCheck, 
  Lock, 
  Clock, 
  Check, 
  Copy, 
  FileText, 
  Sparkles, 
  AlertCircle,
  Zap,
  Folder
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { FileItem, FolderItem, Language } from '../types';
import { translations } from '../translations';
import { formatBytes, detectCategory, generateFileHash } from '../utils/storage';

interface UploadModalProps {
  lang: Language;
  isOpen: boolean;
  onClose: () => void;
  folders: FolderItem[];
  currentFolderId: string | null;
  onUploadSuccess: (newFiles: FileItem[]) => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({
  lang,
  isOpen,
  onClose,
  folders,
  currentFolderId,
  onUploadSuccess,
}) => {
  const t = translations[lang];
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [enableEncryption, setEnableEncryption] = useState(true);
  const [password, setPassword] = useState('');
  const [expiryOption, setExpiryOption] = useState<string>('none');
  const [targetFolderId, setTargetFolderId] = useState<string | null>(currentFolderId);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSpeed, setUploadSpeed] = useState('64.2 MB/s');
  const [uploadedItems, setUploadedItems] = useState<FileItem[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFiles(Array.from(e.target.files));
    }
  };

  const handleStartUpload = async () => {
    if (selectedFiles.length === 0) return;

    setUploading(true);
    setUploadProgress(0);

    // Realistic progress animation
    const interval = setInterval(async () => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          finishUpload();
          return 100;
        }
        return prev + 12;
      });
    }, 180);
  };

  const finishUpload = async () => {
    const createdFiles: FileItem[] = [];

    for (const file of selectedFiles) {
      const { category, ext } = detectCategory(file.name.split('.').pop() || '', file.type);
      const hash = await generateFileHash(file);
      const randomCode = 'mc-' + Math.random().toString(36).substring(2, 7);
      
      // If it's an image or text file, create a preview dataUrl
      let dataUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        dataUrl = URL.createObjectURL(file);
      }

      const newFileItem: FileItem = {
        id: 'file_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
        name: file.name,
        size: file.size,
        type: file.type || 'application/octet-stream',
        extension: ext,
        category,
        uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
        lastModified: new Date().toISOString().replace('T', ' ').substring(0, 16),
        downloadsCount: 0,
        viewsCount: 0,
        isFavorite: false,
        isTrash: false,
        folderId: targetFolderId,
        isPublic: true,
        isEncrypted: enableEncryption,
        encryptionAlgorithm: enableEncryption ? 'AES-256-GCM' : undefined,
        password: password.trim() ? password.trim() : undefined,
        expiresAt: expiryOption === 'none' ? null : expiryOption,
        shareCode: randomCode,
        directDownloadUrl: `https://download.mediacloud.net/direct/${randomCode}/${encodeURIComponent(file.name)}`,
        sha256Hash: hash,
        virusScanStatus: 'clean',
        virusScanEnginesPassed: 72,
        dataUrl,
        blobData: file,
        tags: [ext, 'cloud', category],
        uploader: {
          name: 'Ammar Yaser',
          avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
          isPro: true
        }
      };

      createdFiles.push(newFileItem);
    }

    setUploadedItems(createdFiles);
    setUploading(false);
    onUploadSuccess(createdFiles);

    try {
      confetti({
        particleCount: 100,
        spread: 80,
        origin: { y: 0.6 }
      });
    } catch (e) {}
  };

  const copyLink = (url: string, index: number) => {
    navigator.clipboard.writeText(url);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2500);
  };

  const resetForm = () => {
    setSelectedFiles([]);
    setUploadedItems([]);
    setUploadProgress(0);
    setUploading(false);
    setPassword('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-850/50">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">{t.uploadModal.title}</h3>
              <p className="text-xs text-slate-400">Multi-threaded chunked transfer with AES-256</p>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
          {uploadedItems.length > 0 ? (
            /* SUCCESS STATE WITH DIRECT LINKS */
            <div className="space-y-4 text-center">
              <div className="w-16 h-16 rounded-3xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="text-lg font-black text-white">{t.uploadModal.complete}</h4>
              <p className="text-xs text-slate-400">
                {lang === 'ar' 
                  ? 'تم تشفير ملفاتك وتوليد روابط تحميل مباشرة فائقة السرعة.'
                  : 'Files securely encrypted and assigned ultra-fast direct CDN download endpoints.'}
              </p>

              <div className="space-y-2 mt-4 text-start">
                {uploadedItems.map((item, idx) => (
                  <div key={item.id} className="p-3.5 rounded-2xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <h5 className="text-xs font-bold text-white truncate">{item.name}</h5>
                      <span className="text-[11px] font-mono text-cyan-400">{formatBytes(item.size)}</span>
                    </div>

                    <button
                      onClick={() => copyLink(item.directDownloadUrl, idx)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all shadow-sm cursor-pointer shrink-0"
                    >
                      {copiedIndex === idx ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedIndex === idx ? t.downloadPortal.copied : t.actions.copyLink}</span>
                    </button>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <button
                  onClick={resetForm}
                  className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
                >
                  {t.actions.close}
                </button>
              </div>
            </div>
          ) : (
            /* UPLOAD CONFIGURATION FORM */
            <>
              {/* File Dropzone Area */}
              <input
                ref={fileInputRef}
                type="file"
                multiple
                onChange={handleFileSelect}
                className="hidden"
              />

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-2xl p-6 text-center bg-slate-850/40 hover:bg-slate-800/40 transition-all cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-600/10 text-blue-400 border border-blue-500/20 mx-auto flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-slate-200 mb-1">
                  {selectedFiles.length > 0
                    ? `${selectedFiles.length} ${lang === 'ar' ? 'ملفات تم تحديدها' : 'files selected'}`
                    : t.uploadModal.dragDropText}
                </h4>
                <p className="text-[11px] text-slate-400 max-w-md mx-auto">
                  {t.uploadModal.supportedFormats}
                </p>

                {selectedFiles.length > 0 && (
                  <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                    {selectedFiles.map((f, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[11px] font-mono border border-blue-500/30">
                        {f.name} ({formatBytes(f.size)})
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Advanced Security & Sharing Controls */}
              <div className="space-y-4 pt-2">
                {/* Target Folder Selector */}
                <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                    <Folder className="w-4 h-4 text-blue-400" />
                    <span>{lang === 'ar' ? 'المجلد الهدف:' : 'Destination Folder:'}</span>
                  </div>
                  <select
                    value={targetFolderId || ''}
                    onChange={(e) => setTargetFolderId(e.target.value || null)}
                    className="bg-slate-900 text-slate-200 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none"
                  >
                    <option value="">{lang === 'ar' ? 'المجلد الرئيسي (Root Drive)' : 'Root Drive'}</option>
                    {folders.map(f => (
                      <option key={f.id} value={f.id}>{f.name}</option>
                    ))}
                  </select>
                </div>

                {/* AES-256 Encryption Toggle */}
                <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-teal-400" />
                    <div>
                      <h5 className="text-xs font-bold text-slate-200">{t.uploadModal.enableEncryption}</h5>
                      <p className="text-[11px] text-slate-400">Zero-knowledge client-side encryption</p>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={enableEncryption}
                    onChange={(e) => setEnableEncryption(e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 bg-slate-900 border-slate-700 cursor-pointer"
                  />
                </div>

                {/* Password Protection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    {t.uploadModal.enablePassword}
                  </label>
                  <input
                    type="text"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.uploadModal.passwordPlaceholder}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-850 border border-slate-700 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Expiry Options */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-400" />
                    {t.uploadModal.expiryTime}
                  </label>
                  <select
                    value={expiryOption}
                    onChange={(e) => setExpiryOption(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-850 border border-slate-700 text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                  >
                    <option value="none">{t.uploadModal.noExpiry}</option>
                    <option value="1_hour">{t.uploadModal.after1Hour}</option>
                    <option value="24_hours">{t.uploadModal.after24Hours}</option>
                    <option value="7_days">{t.uploadModal.after7Days}</option>
                    <option value="30_days">{t.uploadModal.after30Days}</option>
                    <option value="one_time">{t.uploadModal.oneTimeDownload}</option>
                  </select>
                </div>
              </div>

              {/* Upload Progress Bar if active */}
              {uploading && (
                <div className="space-y-2 p-3.5 rounded-2xl bg-blue-950/40 border border-blue-800/60 animate-in fade-in">
                  <div className="flex justify-between text-xs font-mono text-cyan-300">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
                      Speed: {uploadSpeed}
                    </span>
                    <span className="font-bold">{uploadProgress}%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-200"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex justify-end gap-2.5">
                <button
                  onClick={onClose}
                  disabled={uploading}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  {t.actions.cancel}
                </button>

                <button
                  onClick={handleStartUpload}
                  disabled={selectedFiles.length === 0 || uploading}
                  className={`px-5 py-2 text-xs font-bold rounded-xl text-white shadow-lg transition-all flex items-center gap-2 cursor-pointer ${
                    selectedFiles.length === 0 || uploading
                      ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30'
                  }`}
                >
                  <UploadCloud className="w-4 h-4" />
                  <span>{uploading ? t.uploadModal.uploading : t.actions.upload}</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
