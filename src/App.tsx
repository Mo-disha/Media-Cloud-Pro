import React, { useState, useEffect } from 'react';
import { 
  FileItem, 
  FolderItem, 
  UserProfile, 
  Language, 
  FileCategory, 
  NotificationItem, 
  PlanTier 
} from './types';
import { translations } from './translations';
import { 
  INITIAL_USER, 
  INITIAL_FILES, 
  INITIAL_FOLDERS, 
  INITIAL_NOTIFICATIONS,
  detectCategory, 
  generateFileHash 
} from './utils/storage';

// Components
import { Navbar } from './components/Navbar';
import { Sidebar, NavigationTab } from './components/Sidebar';
import { FileManager } from './components/FileManager';
import { PublicDownloadView } from './components/PublicDownloadView';
import { UploadModal } from './components/UploadModal';
import { FilePreviewModal } from './components/FilePreviewModal';
import { ShareModal } from './components/ShareModal';
import { PricingModal } from './components/PricingModal';
import { StorageAnalytics } from './components/StorageAnalytics';
import { SecurityCenter } from './components/SecurityCenter';
import { SupportCenter } from './components/SupportCenter';
import { EnterpriseCustomizer } from './components/EnterpriseCustomizer';
import { NotificationCenter } from './components/NotificationCenter';

export default function App() {
  const [lang, setLang] = useState<Language>('ar');
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [folders, setFolders] = useState<FolderItem[]>(INITIAL_FOLDERS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);

  // Navigation & Filtering
  const [activeTab, setActiveTab] = useState<NavigationTab>('my_files');
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<FileCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Modals & Active Targets
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPricingOpen, setIsPricingOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [shareFile, setShareFile] = useState<FileItem | null>(null);
  const [publicViewFile, setPublicViewFile] = useState<FileItem | null>(null);
  const [newFolderModalOpen, setNewFolderModalOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Synchronize document title and direction
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.title = lang === 'ar' 
      ? 'ميديا كلاود برو | رفع وتنزيل الملفات بروابط مباشرة وسريعة'
      : 'MediaCloud Pro | Ultra-Fast Cloud Storage & Direct Downloads';
  }, [lang]);

  // Recalculate used storage whenever files change
  useEffect(() => {
    const totalBytes = files
      .filter(f => !f.isTrash)
      .reduce((sum, f) => sum + f.size, 0);
    setUser(prev => ({ ...prev, usedStorage: totalBytes }));
  }, [files]);

  // Filtered files depending on active tab, category, search, and folder
  const displayedFiles = files.filter(f => {
    // Trash tab filter
    if (activeTab === 'trash') {
      return f.isTrash;
    }
    // Starred tab
    if (activeTab === 'starred') {
      return !f.isTrash && f.isFavorite;
    }
    // Shared tab
    if (activeTab === 'shared') {
      return !f.isTrash && f.isPublic;
    }
    // Recent tab
    if (activeTab === 'recent') {
      return !f.isTrash;
    }
    // Default My Files tab
    if (f.isTrash) return false;

    // Folder filtering
    if (currentFolderId && f.folderId !== currentFolderId) return false;
    if (!currentFolderId && f.folderId !== null && activeTab === 'my_files') return false;

    // Category filter
    if (activeCategory !== 'all' && f.category !== activeCategory) return false;

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        f.name.toLowerCase().includes(q) ||
        f.extension.toLowerCase().includes(q) ||
        (f.tags && f.tags.some(t => t.toLowerCase().includes(q)))
      );
    }

    return true;
  });

  // Calculate counts for categories
  const categoryCounts = (['all', 'documents', 'images', 'videos', 'audio', 'archives', 'software', 'others'] as FileCategory[]).reduce((acc, cat) => {
    if (cat === 'all') {
      acc[cat] = files.filter(f => !f.isTrash).length;
    } else {
      acc[cat] = files.filter(f => !f.isTrash && f.category === cat).length;
    }
    return acc;
  }, {} as Record<FileCategory, number>);

  // Action Handlers
  const handleUploadSuccess = (newFiles: FileItem[]) => {
    setFiles(prev => [...newFiles, ...prev]);
    // Add notification
    const notif: NotificationItem = {
      id: 'notif_' + Date.now(),
      title: lang === 'ar' ? 'تم رفع ملفات جديدة بنجاح' : 'New Files Uploaded',
      titleAr: 'تم رفع ملفات جديدة بنجاح',
      message: `${newFiles.length} ${lang === 'ar' ? 'ملفات تم تشفيرها وحفظها في السحابة' : 'files securely encrypted and stored'}`,
      messageAr: `${newFiles.length} ملفات تم تشفيرها وحفظها في السحابة`,
      type: 'system',
      timestamp: 'الآن',
      isRead: false
    };
    setNotifications(prev => [notif, ...prev]);
  };

  const handleDropFiles = async (droppedFiles: FileList) => {
    const created: FileItem[] = [];
    for (let i = 0; i < droppedFiles.length; i++) {
      const file = droppedFiles[i];
      const { category, ext } = detectCategory(file.name.split('.').pop() || '', file.type);
      const hash = await generateFileHash(file);
      const randomCode = 'mc-' + Math.random().toString(36).substring(2, 7);

      let dataUrl: string | undefined = undefined;
      if (file.type.startsWith('image/')) {
        dataUrl = URL.createObjectURL(file);
      }

      created.push({
        id: 'file_' + Date.now() + '_' + i,
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
        folderId: currentFolderId,
        isPublic: true,
        isEncrypted: true,
        encryptionAlgorithm: 'AES-256-GCM',
        shareCode: randomCode,
        directDownloadUrl: `https://download.mediacloud.net/direct/${randomCode}/${encodeURIComponent(file.name)}`,
        sha256Hash: hash,
        virusScanStatus: 'clean',
        virusScanEnginesPassed: 72,
        dataUrl,
        blobData: file,
        tags: [ext, 'quick-upload'],
        uploader: {
          name: user.name,
          avatar: user.avatar,
          isPro: user.plan !== 'free'
        }
      });
    }
    setFiles(prev => [...created, ...prev]);
  };

  const handleDownloadFile = (file: FileItem) => {
    // Increment download counter
    setFiles(prev => prev.map(f => f.id === file.id ? { ...f, downloadsCount: f.downloadsCount + 1 } : f));
    setUser(prev => ({ ...prev, bandwidthUsed: prev.bandwidthUsed + file.size }));

    // Trigger browser download
    if (file.blobData) {
      const url = URL.createObjectURL(file.blobData);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } else {
      const blob = new Blob([`MediaCloud Pro High Speed Download Content for: ${file.name}\nSHA256: ${file.sha256Hash}`], { type: file.type });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleDeleteFile = (fileId: string, permanent: boolean = false) => {
    if (permanent) {
      setFiles(prev => prev.filter(f => f.id !== fileId));
    } else {
      setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isTrash: true } : f));
    }
  };

  const handleRestoreFile = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isTrash: false } : f));
  };

  const handleEmptyTrash = () => {
    setFiles(prev => prev.filter(f => !f.isTrash));
  };

  const handleToggleStar = (fileId: string) => {
    setFiles(prev => prev.map(f => f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f));
  };

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newFolder: FolderItem = {
      id: 'fld_' + Date.now(),
      name: newFolderName.trim(),
      color: randomColor,
      parentId: currentFolderId,
      createdAt: new Date().toISOString().substring(0, 10),
      itemCount: 0
    };

    setFolders(prev => [...prev, newFolder]);
    setNewFolderName('');
    setNewFolderModalOpen(false);
  };

  const handleUpgradePlan = (planId: PlanTier['id'], storageGB: number) => {
    setUser(prev => ({
      ...prev,
      plan: planId,
      totalStorage: storageGB * 1024 * 1024 * 1024,
      bandwidthLimit: storageGB * 10 * 1024 * 1024 * 1024
    }));
  };

  const handleToggle2FA = () => {
    setUser(prev => ({ ...prev, is2FAEnabled: !prev.is2FAEnabled }));
  };

  const handleSaveToCloudFromPublic = (file: FileItem) => {
    const cloned: FileItem = {
      ...file,
      id: 'file_cloned_' + Date.now(),
      name: 'Copy_' + file.name,
      folderId: null,
      uploadDate: new Date().toISOString().replace('T', ' ').substring(0, 16)
    };
    setFiles(prev => [cloned, ...prev]);
  };

  // If Public MediaFire Direct Download View is active
  if (publicViewFile || activeTab === 'download_portal') {
    const targetFile = publicViewFile || files.find(f => !f.isTrash) || files[0];
    return (
      <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 selection:bg-blue-500 selection:text-white">
        <PublicDownloadView
          lang={lang}
          file={targetFile}
          onBackToDrive={() => {
            setPublicViewFile(null);
            if (activeTab === 'download_portal') setActiveTab('my_files');
          }}
          onSaveToCloud={handleSaveToCloudFromPublic}
          onDownloadFile={handleDownloadFile}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 font-sans antialiased text-slate-100 flex flex-col selection:bg-blue-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        lang={lang}
        onLanguageChange={setLang}
        user={user}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onOpenUpload={() => setIsUploadOpen(true)}
        onOpenPricing={() => setIsPricingOpen(true)}
        onOpenDirectLinkDemo={() => setPublicViewFile(files[0])}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
      />

      {/* Main Workspace Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar */}
        <Sidebar
          lang={lang}
          activeTab={activeTab}
          onSelectTab={(tab) => {
            setActiveTab(tab);
            if (tab === 'my_files') setCurrentFolderId(null);
          }}
          user={user}
          onOpenPricing={() => setIsPricingOpen(true)}
          filesCount={files.filter(f => !f.isTrash).length}
          trashCount={files.filter(f => f.isTrash).length}
          starredCount={files.filter(f => !f.isTrash && f.isFavorite).length}
          sharedCount={files.filter(f => !f.isTrash && f.isPublic).length}
          categoryCounts={categoryCounts}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />

        {/* Dynamic Center View Container */}
        <main className="flex-1 flex flex-col overflow-hidden bg-slate-950/60">
          {['my_files', 'recent', 'starred', 'shared', 'trash'].includes(activeTab) && (
            <FileManager
              lang={lang}
              files={displayedFiles}
              folders={folders}
              currentFolderId={currentFolderId}
              onNavigateFolder={setCurrentFolderId}
              onUploadClick={() => setIsUploadOpen(true)}
              onNewFolder={() => setNewFolderModalOpen(true)}
              onFileDownload={handleDownloadFile}
              onFileShare={(file) => setShareFile(file)}
              onFilePreview={(file) => setPreviewFile(file)}
              onFileDelete={handleDeleteFile}
              onFileRestore={handleRestoreFile}
              onFileToggleStar={handleToggleStar}
              onFileLock={(file) => setShareFile(file)}
              onDropFiles={handleDropFiles}
              viewMode={viewMode}
              onToggleViewMode={setViewMode}
              isTrashView={activeTab === 'trash'}
              onEmptyTrash={handleEmptyTrash}
              onOpenDirectLanding={(file) => setPublicViewFile(file)}
            />
          )}

          {activeTab === 'analytics' && (
            <StorageAnalytics
              lang={lang}
              files={files}
              user={user}
            />
          )}

          {activeTab === 'subscriptions' && (
            <div className="flex-1 p-6 overflow-y-auto">
              <PricingModal
                lang={lang}
                isOpen={true}
                onClose={() => setActiveTab('my_files')}
                user={user}
                onUpgradePlan={handleUpgradePlan}
              />
            </div>
          )}

          {activeTab === 'security' && (
            <SecurityCenter
              lang={lang}
              user={user}
              onToggle2FA={handleToggle2FA}
            />
          )}

          {activeTab === 'support' && (
            <SupportCenter
              lang={lang}
            />
          )}

          {activeTab === 'enterprise' && (
            <EnterpriseCustomizer
              lang={lang}
              user={user}
              onUpdateEnterprise={(data) => setUser(prev => ({ ...prev, ...data }))}
            />
          )}

          {activeTab === 'backup' && (
            <SecurityCenter
              lang={lang}
              user={user}
              onToggle2FA={handleToggle2FA}
            />
          )}
        </main>
      </div>

      {/* Global Modals */}
      <UploadModal
        lang={lang}
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        folders={folders}
        currentFolderId={currentFolderId}
        onUploadSuccess={handleUploadSuccess}
      />

      <PricingModal
        lang={lang}
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        user={user}
        onUpgradePlan={handleUpgradePlan}
      />

      <FilePreviewModal
        lang={lang}
        file={previewFile}
        onClose={() => setPreviewFile(null)}
        onDownload={handleDownloadFile}
        onShare={(file) => setShareFile(file)}
        onOpenDirectLanding={(file) => setPublicViewFile(file)}
      />

      <ShareModal
        lang={lang}
        file={shareFile}
        onClose={() => setShareFile(null)}
        onUpdateFile={(updated) => {
          setFiles(prev => prev.map(f => f.id === updated.id ? updated : f));
        }}
        onOpenDirectLanding={(file) => setPublicViewFile(file)}
      />

      <NotificationCenter
        lang={lang}
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
        }}
      />

      {/* New Folder Creation Modal */}
      {newFolderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-sm p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-sm font-bold text-white">
              {lang === 'ar' ? 'إنشاء مجلد جديد' : 'Create New Folder'}
            </h3>
            <form onSubmit={handleCreateFolder} className="space-y-4">
              <input
                type="text"
                autoFocus
                required
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                placeholder={lang === 'ar' ? 'اسم المجلد...' : 'Folder name...'}
                className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setNewFolderModalOpen(false)}
                  className="px-3.5 py-1.5 text-xs font-bold rounded-xl bg-slate-800 text-slate-300"
                >
                  {translations[lang].actions.cancel}
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold rounded-xl bg-blue-600 hover:bg-blue-500 text-white shadow-md cursor-pointer"
                >
                  {translations[lang].actions.confirm}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
