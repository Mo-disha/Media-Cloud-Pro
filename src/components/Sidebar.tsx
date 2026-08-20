import React from 'react';
import { 
  FolderTree, 
  Star, 
  Share2, 
  Trash2, 
  BarChart3, 
  Zap, 
  ShieldAlert, 
  Headphones, 
  Building2, 
  DatabaseBackup,
  Download,
  HardDrive,
  CheckCircle2,
  Cpu,
  Clock
} from 'lucide-react';
import { Language, UserProfile, FileCategory } from '../types';
import { translations } from '../translations';
import { formatBytes } from '../utils/storage';

export type NavigationTab = 
  | 'my_files' 
  | 'recent' 
  | 'starred' 
  | 'shared' 
  | 'trash' 
  | 'analytics' 
  | 'subscriptions' 
  | 'security' 
  | 'support' 
  | 'enterprise' 
  | 'backup' 
  | 'download_portal';

interface SidebarProps {
  lang: Language;
  activeTab: NavigationTab;
  onSelectTab: (tab: NavigationTab) => void;
  user: UserProfile;
  onOpenPricing: () => void;
  filesCount: number;
  trashCount: number;
  starredCount: number;
  sharedCount: number;
  categoryCounts: Record<FileCategory, number>;
  activeCategory: FileCategory;
  onSelectCategory: (cat: FileCategory) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lang,
  activeTab,
  onSelectTab,
  user,
  onOpenPricing,
  filesCount,
  trashCount,
  starredCount,
  sharedCount,
  categoryCounts,
  activeCategory,
  onSelectCategory,
}) => {
  const t = translations[lang];

  const storageUsedPercent = Math.min(100, Math.round((user.usedStorage / user.totalStorage) * 100));

  const navItems = [
    {
      id: 'my_files' as NavigationTab,
      label: t.nav.myFiles,
      icon: FolderTree,
      count: filesCount,
      color: 'text-blue-400',
    },
    {
      id: 'recent' as NavigationTab,
      label: t.nav.recent,
      icon: Clock,
      color: 'text-indigo-400',
    },
    {
      id: 'starred' as NavigationTab,
      label: t.nav.starred,
      icon: Star,
      count: starredCount,
      color: 'text-amber-400',
    },
    {
      id: 'shared' as NavigationTab,
      label: t.nav.shared,
      icon: Share2,
      count: sharedCount,
      color: 'text-cyan-400',
    },
    {
      id: 'trash' as NavigationTab,
      label: t.nav.trash,
      icon: Trash2,
      count: trashCount,
      color: 'text-rose-400',
    },
  ];

  const adminNavItems = [
    {
      id: 'download_portal' as NavigationTab,
      label: t.nav.publicPreview,
      icon: Download,
      color: 'text-emerald-400',
      badge: 'MediaFire UI',
    },
    {
      id: 'analytics' as NavigationTab,
      label: t.nav.analytics,
      icon: BarChart3,
      color: 'text-purple-400',
    },
    {
      id: 'subscriptions' as NavigationTab,
      label: t.nav.subscriptions,
      icon: Zap,
      color: 'text-amber-400',
      badge: 'PRO',
    },
    {
      id: 'security' as NavigationTab,
      label: t.nav.security,
      icon: ShieldAlert,
      color: 'text-teal-400',
    },
    {
      id: 'backup' as NavigationTab,
      label: t.nav.backup,
      icon: DatabaseBackup,
      color: 'text-sky-400',
    },
    {
      id: 'enterprise' as NavigationTab,
      label: t.nav.enterprise,
      icon: Building2,
      color: 'text-pink-400',
    },
    {
      id: 'support' as NavigationTab,
      label: t.nav.support,
      icon: Headphones,
      color: 'text-green-400',
      badge: '24/7',
    },
  ];

  return (
    <aside className="w-full md:w-64 lg:w-72 shrink-0 bg-slate-900/60 backdrop-blur-md border-b md:border-b-0 md:border-r rtl:md:border-r-0 rtl:md:border-l border-slate-800 p-3 sm:p-4 flex flex-col justify-between overflow-y-auto space-y-6">
      <div className="space-y-5">
        {/* Primary Cloud Navigation */}
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
            <span>{lang === 'ar' ? 'التخزين السحابي' : 'Cloud Storage'}</span>
            <span className="text-[10px] bg-slate-800 text-blue-400 px-1.5 py-0.5 rounded font-mono">
              NVMe Fast
            </span>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-sm shadow-blue-500/10'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {typeof item.count === 'number' && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-mono font-bold ${
                        isActive
                          ? 'bg-blue-500 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Category Filter Pills (When on file browser) */}
        {['my_files', 'recent', 'starred'].includes(activeTab) && (
          <div className="pt-2 border-t border-slate-800/80">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">
              {t.actions.filterByCategory}
            </div>
            <div className="grid grid-cols-2 gap-1 px-1">
              {(['all', 'documents', 'images', 'videos', 'audio', 'archives', 'software'] as FileCategory[]).map((cat) => {
                const isCatActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => onSelectCategory(cat)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-medium flex items-center justify-between transition-all cursor-pointer ${
                      isCatActive
                        ? 'bg-slate-800 text-cyan-300 font-bold border border-cyan-500/40'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <span className="capitalize truncate">
                      {lang === 'ar'
                        ? cat === 'all' ? 'الكل'
                          : cat === 'documents' ? 'مستندات'
                          : cat === 'images' ? 'صور'
                          : cat === 'videos' ? 'فيديوهات'
                          : cat === 'audio' ? 'صوتيات'
                          : cat === 'archives' ? 'مضغوطة'
                          : 'برمجيات'
                        : cat}
                    </span>
                    {categoryCounts[cat] > 0 && (
                      <span className="text-[10px] opacity-70 font-mono">
                        {categoryCounts[cat]}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Management & Advanced Features */}
        <div className="pt-2 border-t border-slate-800/80">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2 flex items-center justify-between">
            <span>{lang === 'ar' ? 'الخدمات والأدوات' : 'Services & Tools'}</span>
            <span className="text-[10px] text-emerald-400 font-bold">24/7 Live</span>
          </div>

          <nav className="space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => onSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${item.color}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Storage Quota Card & Upgrade Prompt */}
      <div className="mt-4 space-y-3 pt-3 border-t border-slate-800/80">
        <div className="p-3.5 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-850/90 border border-slate-750 border-slate-700/60 shadow-lg">
          <div className="flex items-center justify-between text-xs font-bold text-slate-200 mb-2">
            <span className="flex items-center gap-1.5">
              <HardDrive className="w-4 h-4 text-blue-400" />
              {t.storage.title}
            </span>
            <span className="text-cyan-400 font-mono">{storageUsedPercent}%</span>
          </div>

          {/* Segmented Progress Bar */}
          <div className="w-full bg-slate-700/80 h-2.5 rounded-full overflow-hidden flex">
            <div className="bg-blue-500 h-full transition-all duration-500" style={{ width: `${storageUsedPercent * 0.45}%` }} title="Archives & Software" />
            <div className="bg-indigo-500 h-full transition-all duration-500" style={{ width: `${storageUsedPercent * 0.35}%` }} title="Media" />
            <div className="bg-emerald-500 h-full transition-all duration-500" style={{ width: `${storageUsedPercent * 0.2}%` }} title="Docs" />
          </div>

          <div className="flex justify-between text-[11px] text-slate-300 mt-2 font-medium">
            <span>{formatBytes(user.usedStorage)}</span>
            <span className="text-slate-400">{t.storage.of} {formatBytes(user.totalStorage)}</span>
          </div>

          <button
            id="sidebar-upgrade-btn"
            onClick={onOpenPricing}
            className="w-full mt-3 py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold text-xs shadow-md shadow-blue-600/20 active:scale-[0.98] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{t.storage.upgradeBtn}</span>
          </button>
        </div>

        {/* Global Node Health / CDN Latency */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-800/40 border border-slate-750 border-slate-700/40 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{lang === 'ar' ? 'الخادم السريع (Riyadh Node)' : 'CDN Node: Riyadh Hub'}</span>
          </div>
          <span className="font-mono text-emerald-400 font-bold">14ms</span>
        </div>
      </div>
    </aside>
  );
};
