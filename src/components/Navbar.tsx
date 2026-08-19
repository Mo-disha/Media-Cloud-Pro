import React, { useState } from 'react';
import { 
  Cloud, 
  UploadCloud, 
  Search, 
  Globe, 
  Bell, 
  Sparkles, 
  ShieldCheck, 
  Check, 
  HardDrive, 
  ExternalLink,
  Crown
} from 'lucide-react';
import { Language, UserProfile, NotificationItem } from '../types';
import { translations } from '../translations';
import { formatBytes } from '../utils/storage';

interface NavbarProps {
  lang: Language;
  onLanguageChange: (lang: Language) => void;
  user: UserProfile;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onOpenUpload: () => void;
  onOpenPricing: () => void;
  onOpenDirectLinkDemo: () => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  lang,
  onLanguageChange,
  user,
  searchQuery,
  onSearchChange,
  onOpenUpload,
  onOpenPricing,
  onOpenDirectLinkDemo,
  notifications,
  onOpenNotifications,
}) => {
  const t = translations[lang];
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const storagePercentage = Math.min(100, Math.round((user.usedStorage / user.totalStorage) * 100));

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100 px-4 py-2.5 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Brand Logo */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-cyan-400 text-white shadow-lg shadow-blue-500/20">
            <Cloud className="w-6 h-6 stroke-[2.2]" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-black tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
                {lang === 'ar' ? 'ميديا كلاود برو' : 'MediaCloud Pro'}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                v3.5 CDN
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              {lang === 'ar' ? 'منصة رفع وتنزيل فائقة السرعة' : 'Ultra-Fast File Cloud & Sharing'}
            </p>
          </div>
        </div>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-lg mx-2 hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute top-1/2 -translate-y-1/2 left-3 text-slate-400 rtl:right-3 rtl:left-auto" />
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={t.actions.searchPlaceholder}
              className="w-full bg-slate-800/80 border border-slate-700 text-slate-100 text-sm rounded-xl pl-9 pr-4 py-2 rtl:pr-9 rtl:pl-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all placeholder:text-slate-500"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange('')}
                className="absolute top-1/2 -translate-y-1/2 right-3 text-xs text-slate-400 hover:text-white rtl:left-3 rtl:right-auto"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Action Controls & User Meta */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Direct Download Portal Viewer */}
          <button
            id="open-direct-portal-btn"
            onClick={onOpenDirectLinkDemo}
            title={lang === 'ar' ? 'معاينة صفحة التحميل المباشر مثل ميديا فاير' : 'Preview MediaFire-style Download Portal'}
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 transition-all shadow-sm"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span>{lang === 'ar' ? 'صفحة التحميل المباشر' : 'Download Portal'}</span>
          </button>

          {/* Quick Upload Button */}
          <button
            id="quick-upload-btn"
            onClick={onOpenUpload}
            className="flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-bold rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-md shadow-blue-600/30 active:scale-95 transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4 animate-pulse" />
            <span className="hidden sm:inline">{t.actions.upload}</span>
            <span className="sm:hidden">{lang === 'ar' ? 'رفع' : 'Upload'}</span>
          </button>

          {/* Language Switcher */}
          <button
            id="language-switcher-btn"
            onClick={() => onLanguageChange(lang === 'ar' ? 'en' : 'ar')}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-300 transition-all cursor-pointer"
            title="Switch Language / تغيير اللغة"
          >
            <Globe className="w-3.5 h-3.5 text-blue-400" />
            <span className="font-bold">{lang === 'ar' ? 'English' : 'عربي'}</span>
          </button>

          {/* Notifications Center */}
          <div className="relative">
            <button
              id="notifications-bell-btn"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-all cursor-pointer"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 text-[10px] font-black rounded-full bg-red-500 text-white shadow-sm ring-2 ring-slate-900 animate-bounce">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>

          {/* User Profile / Tier Badge */}
          <div className="relative">
            <button
              id="user-profile-menu-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 border border-transparent hover:border-slate-700 transition-all cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-lg object-cover ring-2 ring-blue-500/50"
              />
              <div className="hidden xl:block text-start">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-slate-200">{user.name}</span>
                  <Crown className="w-3 h-3 text-amber-400 fill-amber-400" />
                </div>
                <span className="text-[10px] font-semibold text-blue-400 uppercase tracking-wider">
                  {user.plan.toUpperCase()} PLAN
                </span>
              </div>
            </button>

            {/* Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 rtl:left-0 rtl:right-auto mt-2 w-64 bg-slate-850 bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-800">
                  <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-xl object-cover ring-2 ring-blue-500" />
                  <div className="overflow-hidden">
                    <h4 className="text-xs font-bold text-white truncate">{user.name}</h4>
                    <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-400 mt-0.5">
                      <Sparkles className="w-3 h-3" /> {user.plan.toUpperCase()} VIP
                    </span>
                  </div>
                </div>

                {/* Storage Quick Pill */}
                <div className="my-3 p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/50">
                  <div className="flex justify-between text-[11px] text-slate-300 font-semibold mb-1">
                    <span className="flex items-center gap-1">
                      <HardDrive className="w-3 h-3 text-blue-400" />
                      {t.storage.title}
                    </span>
                    <span>{storagePercentage}%</span>
                  </div>
                  <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-cyan-400 h-full rounded-full transition-all duration-500"
                      style={{ width: `${storagePercentage}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{formatBytes(user.usedStorage)}</span>
                    <span>{formatBytes(user.totalStorage)}</span>
                  </div>
                </div>

                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      onOpenPricing();
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-white rounded-lg bg-gradient-to-r from-amber-500/20 to-orange-500/20 text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-500/30 transition-all"
                  >
                    <span className="flex items-center gap-2">
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                      {t.storage.upgradeBtn}
                    </span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                      +20 TB
                    </span>
                  </button>

                  <div className="flex items-center gap-2 px-3 py-1.5 text-[11px] text-slate-400 font-medium">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{lang === 'ar' ? 'الحساب مؤمن بنظام 2FA' : '2FA Secured Session'}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
