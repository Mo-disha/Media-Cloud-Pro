import React, { useState } from 'react';
import { 
  Folder, 
  FolderPlus, 
  UploadCloud, 
  MoreVertical, 
  Download, 
  Share2, 
  Eye, 
  Trash2, 
  RotateCcw, 
  Lock, 
  ShieldCheck, 
  Star, 
  LayoutGrid, 
  List, 
  FileText, 
  FileArchive, 
  FileVideo, 
  FileAudio, 
  FileImage, 
  FileCode, 
  File, 
  ArrowUpDown,
  CheckSquare,
  Square,
  Copy,
  ExternalLink,
  Info
} from 'lucide-react';
import { FileItem, FolderItem, Language, FileCategory } from '../types';
import { translations } from '../translations';
import { formatBytes } from '../utils/storage';

interface FileManagerProps {
  lang: Language;
  files: FileItem[];
  folders: FolderItem[];
  currentFolderId: string | null;
  onNavigateFolder: (folderId: string | null) => void;
  onUploadClick: () => void;
  onNewFolder: () => void;
  onFileDownload: (file: FileItem) => void;
  onFileShare: (file: FileItem) => void;
  onFilePreview: (file: FileItem) => void;
  onFileDelete: (fileId: string, permanent?: boolean) => void;
  onFileRestore: (fileId: string) => void;
  onFileToggleStar: (fileId: string) => void;
  onFileLock: (file: FileItem) => void;
  onDropFiles: (files: FileList) => void;
  viewMode: 'grid' | 'list';
  onToggleViewMode: (mode: 'grid' | 'list') => void;
  isTrashView?: boolean;
  onEmptyTrash?: () => void;
  onOpenDirectLanding: (file: FileItem) => void;
}

export const FileManager: React.FC<FileManagerProps> = ({
  lang,
  files,
  folders,
  currentFolderId,
  onNavigateFolder,
  onUploadClick,
  onNewFolder,
  onFileDownload,
  onFileShare,
  onFilePreview,
  onFileDelete,
  onFileRestore,
  onFileToggleStar,
  onFileLock,
  onDropFiles,
  viewMode,
  onToggleViewMode,
  isTrashView = false,
  onEmptyTrash,
  onOpenDirectLanding,
}) => {
  const t = translations[lang];
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>([]);
  const [activeMenuFileId, setActiveMenuFileId] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'size' | 'downloads'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isDragOver, setIsDragOver] = useState(false);

  // Folder Breadcrumb
  const currentFolder = folders.find(f => f.id === currentFolderId);

  // Sorting
  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'name') comparison = a.name.localeCompare(b.name);
    else if (sortBy === 'size') comparison = a.size - b.size;
    else if (sortBy === 'downloads') comparison = a.downloadsCount - b.downloadsCount;
    else comparison = new Date(b.uploadDate).getTime() - new Date(a.uploadDate).getTime();
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSelectAll = () => {
    if (selectedFileIds.length === files.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(files.map(f => f.id));
    }
  };

  const toggleSelectFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Drag and Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onDropFiles(e.dataTransfer.files);
    }
  };

  const getFileIcon = (category: FileCategory, ext: string) => {
    switch (category) {
      case 'images':
        return <FileImage className="w-7 h-7 text-pink-400" />;
      case 'videos':
        return <FileVideo className="w-7 h-7 text-indigo-400" />;
      case 'audio':
        return <FileAudio className="w-7 h-7 text-violet-400" />;
      case 'archives':
        return <FileArchive className="w-7 h-7 text-amber-400" />;
      case 'documents':
        return <FileText className="w-7 h-7 text-emerald-400" />;
      case 'software':
        return <FileCode className="w-7 h-7 text-cyan-400" />;
      default:
        return <File className="w-7 h-7 text-blue-400" />;
    }
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`flex-1 flex flex-col h-full bg-slate-950/40 p-4 sm:p-6 overflow-y-auto relative transition-all ${
        isDragOver ? 'ring-4 ring-blue-500/50 bg-blue-950/20' : ''
      }`}
    >
      {/* Drag & Drop Visual Overlay */}
      {isDragOver && (
        <div className="absolute inset-0 bg-blue-900/80 backdrop-blur-md z-50 flex flex-col items-center justify-center text-white border-2 border-dashed border-cyan-400 m-4 rounded-3xl animate-in fade-in">
          <UploadCloud className="w-16 h-16 text-cyan-400 animate-bounce mb-3" />
          <h3 className="text-xl font-black">
            {lang === 'ar' ? 'أفلت الملفات الآن للرفع الفوري!' : 'Drop files here for instant high-speed upload!'}
          </h3>
          <p className="text-sm text-cyan-200 mt-1">
            {lang === 'ar' ? 'سيتم تشفير وفحص الملفات تلقائياً' : 'Files will be scanned and encrypted on-the-fly'}
          </p>
        </div>
      )}

      {/* Top Header & Breadcrumb Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2 text-sm sm:text-base font-bold text-slate-200">
          <button 
            onClick={() => onNavigateFolder(null)}
            className={`hover:text-blue-400 transition-all ${!currentFolderId ? 'text-blue-400' : 'text-slate-400'}`}
          >
            {isTrashView ? t.nav.trash : t.nav.myFiles}
          </button>
          {currentFolder && (
            <>
              <span className="text-slate-600">/</span>
              <span className="text-white flex items-center gap-1.5 bg-slate-800/60 px-2.5 py-1 rounded-lg border border-slate-700">
                <Folder className="w-4 h-4 text-blue-400" />
                {currentFolder.name}
              </span>
            </>
          )}
        </div>

        {/* Action Toolbar */}
        <div className="flex items-center gap-2">
          {isTrashView ? (
            <button
              onClick={onEmptyTrash}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 border border-rose-500/30 transition-all"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{t.actions.emptyTrash}</span>
            </button>
          ) : (
            <>
              <button
                id="new-folder-btn"
                onClick={onNewFolder}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all cursor-pointer"
              >
                <FolderPlus className="w-4 h-4 text-blue-400" />
                <span className="hidden sm:inline">{t.actions.newFolder}</span>
              </button>

              <button
                id="upload-files-btn"
                onClick={onUploadClick}
                className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{t.actions.upload}</span>
              </button>
            </>
          )}

          {/* Sort Menu */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-slate-300 text-xs font-semibold px-2 py-1 focus:outline-none cursor-pointer"
            >
              <option value="date" className="bg-slate-900">{lang === 'ar' ? 'التاريخ' : 'Date'}</option>
              <option value="name" className="bg-slate-900">{lang === 'ar' ? 'الاسم' : 'Name'}</option>
              <option value="size" className="bg-slate-900">{lang === 'ar' ? 'الحجم' : 'Size'}</option>
              <option value="downloads" className="bg-slate-900">{lang === 'ar' ? 'التحميلات' : 'Downloads'}</option>
            </select>
            <button
              onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
              className="p-1 text-slate-400 hover:text-white rounded transition-all"
              title="Reverse Order"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center bg-slate-800/80 p-1 rounded-xl border border-slate-700/80">
            <button
              onClick={() => onToggleViewMode('grid')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'grid' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => onToggleViewMode('list')}
              className={`p-1.5 rounded-lg transition-all ${
                viewMode === 'list' ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
              title="List View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Folders Section (Only on root or matching folder) */}
      {!isTrashView && !currentFolderId && folders.length > 0 && (
        <div className="my-5">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
            {lang === 'ar' ? 'المجلدات الرئيسية' : 'Folders'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {folders.map((fld) => (
              <div
                key={fld.id}
                onClick={() => onNavigateFolder(fld.id)}
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-900/80 hover:bg-slate-850 border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer shadow-sm hover:shadow-md"
              >
                <div className="flex items-center gap-3 truncate">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                    style={{ backgroundColor: `${fld.color || '#3b82f6'}20`, color: fld.color || '#3b82f6' }}
                  >
                    <Folder className="w-5 h-5 fill-current" />
                  </div>
                  <div className="truncate text-start">
                    <h5 className="text-xs font-bold text-slate-200 group-hover:text-blue-400 truncate transition-colors">
                      {fld.name}
                    </h5>
                    <span className="text-[11px] text-slate-400 font-mono font-medium">
                      {fld.itemCount} {lang === 'ar' ? 'ملفات' : 'files'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files Section */}
      <div className="mt-4 flex-1">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleSelectAll}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200"
            >
              {selectedFileIds.length === files.length && files.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-blue-400" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>{lang === 'ar' ? 'تحديد الكل' : 'Select All'} ({files.length})</span>
            </button>
            {selectedFileIds.length > 0 && (
              <span className="text-xs font-bold text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded-lg border border-cyan-800">
                {selectedFileIds.length} {lang === 'ar' ? 'محدد' : 'selected'}
              </span>
            )}
          </div>
        </div>

        {files.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-slate-800 rounded-3xl bg-slate-900/30 p-8">
            <div className="w-16 h-16 rounded-2xl bg-blue-600/10 flex items-center justify-center text-blue-400 mb-4 border border-blue-500/20">
              <UploadCloud className="w-8 h-8 animate-pulse" />
            </div>
            <h3 className="text-base font-bold text-slate-200 mb-1">
              {lang === 'ar' ? 'لا توجد ملفات في هذا المجلد' : 'No files in this folder'}
            </h3>
            <p className="text-xs text-slate-400 max-w-sm mb-5">
              {lang === 'ar' ? 'اسحب وأفلت الملفات هنا، أو انقر على زر الرفع لبدء تخزين ملفاتك بسرعة فائقة.' : 'Drag & drop files here, or click the upload button to start hosting at extreme speed.'}
            </p>
            {!isTrashView && (
              <button
                onClick={onUploadClick}
                className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20 transition-all cursor-pointer"
              >
                {t.actions.upload}
              </button>
            )}
          </div>
        ) : viewMode === 'grid' ? (
          /* GRID VIEW */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5">
            {sortedFiles.map((file) => {
              const isSelected = selectedFileIds.includes(file.id);
              return (
                <div
                  key={file.id}
                  id={`file-card-${file.id}`}
                  onClick={() => onFilePreview(file)}
                  className={`group relative flex flex-col justify-between p-4 rounded-2xl bg-slate-900/90 hover:bg-slate-850 border transition-all duration-200 cursor-pointer shadow-sm hover:shadow-xl ${
                    isSelected
                      ? 'border-blue-500 ring-2 ring-blue-500/30 bg-blue-950/20'
                      : 'border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top Bar on Card */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => toggleSelectFile(file.id, e)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4 opacity-50 group-hover:opacity-100" />
                        )}
                      </button>
                      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50">
                        {getFileIcon(file.category, file.extension)}
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      {file.isEncrypted && (
                        <span title="AES-256 Encrypted" className="p-1 rounded bg-teal-500/20 text-teal-400">
                          <ShieldCheck className="w-3.5 h-3.5" />
                        </span>
                      )}
                      {file.password && (
                        <span title="Password Protected" className="p-1 rounded bg-amber-500/20 text-amber-400">
                          <Lock className="w-3.5 h-3.5" />
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onFileToggleStar(file.id);
                        }}
                        className={`p-1 rounded hover:bg-slate-800 transition-colors ${
                          file.isFavorite ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'
                        }`}
                      >
                        <Star className={`w-3.5 h-3.5 ${file.isFavorite ? 'fill-amber-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  {/* Image Thumbnail Preview if photo */}
                  {file.dataUrl && file.category === 'images' ? (
                    <div className="my-2.5 h-28 w-full rounded-xl overflow-hidden bg-slate-800/50 border border-slate-700/50">
                      <img src={file.dataUrl} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                  ) : (
                    <div className="my-3 space-y-1 text-start">
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 transition-colors line-clamp-2" title={file.name}>
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                        <span>{formatBytes(file.size)}</span>
                        <span>•</span>
                        <span className="uppercase text-slate-500">{file.extension}</span>
                      </div>
                    </div>
                  )}

                  {/* Card Meta & Downloads Badge */}
                  <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1 text-cyan-400 font-bold font-mono">
                      <Download className="w-3 h-3" />
                      {file.downloadsCount}
                    </span>

                    {/* Action buttons on card hover */}
                    <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                      {isTrashView ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileRestore(file.id);
                            }}
                            className="p-1 rounded-lg bg-slate-800 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                            title={t.actions.restore}
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileDelete(file.id, true);
                            }}
                            className="p-1 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white"
                            title={t.actions.permanentDelete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDirectLanding(file);
                            }}
                            className="p-1 rounded-lg bg-slate-800 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                            title={lang === 'ar' ? 'فتح صفحة التحميل المباشر' : 'Direct Download Page'}
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileShare(file);
                            }}
                            className="p-1 rounded-lg bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white"
                            title={t.actions.share}
                          >
                            <Share2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileDownload(file);
                            }}
                            className="p-1 rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-600 hover:text-white"
                            title={t.actions.download}
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileDelete(file.id, false);
                            }}
                            className="p-1 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white"
                            title={t.actions.delete}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* LIST VIEW */
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
            <div className="divide-y divide-slate-800/60">
              {sortedFiles.map((file) => {
                const isSelected = selectedFileIds.includes(file.id);
                return (
                  <div
                    key={file.id}
                    onClick={() => onFilePreview(file)}
                    className={`group flex items-center justify-between p-3.5 hover:bg-slate-850 transition-colors cursor-pointer ${
                      isSelected ? 'bg-blue-950/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <button
                        onClick={(e) => toggleSelectFile(file.id, e)}
                        className="text-slate-400 hover:text-white"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Square className="w-4 h-4 opacity-40 group-hover:opacity-100" />
                        )}
                      </button>

                      <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/50 shrink-0">
                        {getFileIcon(file.category, file.extension)}
                      </div>

                      <div className="min-w-0 flex-1 text-start">
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-100 group-hover:text-blue-400 truncate">
                            {file.name}
                          </h4>
                          {file.isEncrypted && (
                            <ShieldCheck className="w-3.5 h-3.5 text-teal-400 shrink-0" />
                          )}
                          {file.password && (
                            <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          )}
                        </div>
                        <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                          <span>{formatBytes(file.size)}</span>
                          <span>•</span>
                          <span>{file.uploadDate}</span>
                          <span>•</span>
                          <span className="text-cyan-400 font-semibold">{file.downloadsCount} {lang === 'ar' ? 'تحميل' : 'downloads'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions on List Row */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isTrashView ? (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileRestore(file.id);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                            title={t.actions.restore}
                          >
                            <RotateCcw className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileDelete(file.id, true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white"
                            title={t.actions.permanentDelete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenDirectLanding(file);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-emerald-400 hover:bg-emerald-600 hover:text-white"
                            title={lang === 'ar' ? 'صفحة التنزيل المباشر' : 'Direct Download Page'}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileShare(file);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-blue-400 hover:bg-blue-600 hover:text-white"
                            title={t.actions.share}
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileDownload(file);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-cyan-400 hover:bg-cyan-600 hover:text-white"
                            title={t.actions.download}
                          >
                            <Download className="w-4 h-4" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onFileDelete(file.id, false);
                            }}
                            className="p-1.5 rounded-lg bg-slate-800 text-rose-400 hover:bg-rose-600 hover:text-white"
                            title={t.actions.delete}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
