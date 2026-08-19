import React, { useState } from 'react';
import { 
  Building2, 
  Palette, 
  Globe, 
  Check, 
  Save, 
  Sparkles, 
  Eye, 
  Upload,
  Link,
  ShieldCheck
} from 'lucide-react';
import { Language, UserProfile } from '../types';
import { translations } from '../translations';

interface EnterpriseCustomizerProps {
  lang: Language;
  user: UserProfile;
  onUpdateEnterprise: (data: Partial<UserProfile>) => void;
}

export const EnterpriseCustomizer: React.FC<EnterpriseCustomizerProps> = ({
  lang,
  user,
  onUpdateEnterprise,
}) => {
  const t = translations[lang];
  const [brandName, setBrandName] = useState(user.brandName || 'MediaCloud Enterprise');
  const [brandColor, setBrandColor] = useState(user.brandColor || '#2563eb');
  const [customDomain, setCustomDomain] = useState(user.customDomain || 'files.ammar-cloud.com');
  const [greeting, setGreeting] = useState('Welcome to our Secure Corporate Cloud Portal.');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateEnterprise({
      brandName,
      brandColor,
      customDomain
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950/40 text-slate-100 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <Building2 className="w-6 h-6 text-pink-400" />
          <span>{t.enterprise.title}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{t.enterprise.subtitle}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Form */}
        <form onSubmit={handleSave} className="lg:col-span-7 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 shadow-xl">
          {/* Brand Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">{t.enterprise.companyName}</label>
            <input
              type="text"
              value={brandName}
              onChange={(e) => setBrandName(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          {/* Custom Subdomain */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300 flex items-center justify-between">
              <span>{t.enterprise.customDomain}</span>
              <span className="text-[11px] text-emerald-400 font-mono">CNAME Active</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="px-3 py-2 text-xs font-mono rounded-xl bg-slate-950 border border-slate-800 text-slate-500">
                https://
              </span>
              <input
                type="text"
                value={customDomain}
                onChange={(e) => setCustomDomain(e.target.value)}
                placeholder={t.enterprise.domainPlaceholder}
                className="flex-1 px-3.5 py-2 text-xs font-mono rounded-xl bg-slate-800 border border-slate-700 text-cyan-300 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
            </div>
          </div>

          {/* Primary Brand Color Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">{t.enterprise.brandColor}</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-10 h-10 rounded-xl bg-transparent border-0 cursor-pointer"
              />
              <span className="text-xs font-mono text-slate-300 uppercase px-3 py-2 rounded-xl bg-slate-800 border border-slate-700">
                {brandColor}
              </span>
              <div className="flex gap-1.5">
                {['#2563eb', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#06b6d4'].map((col) => (
                  <button
                    key={col}
                    type="button"
                    onClick={() => setBrandColor(col)}
                    className="w-6 h-6 rounded-lg transition-transform hover:scale-110"
                    style={{ backgroundColor: col }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Custom Greeting Text */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-300">{t.enterprise.customGreeting}</label>
            <textarea
              rows={3}
              value={greeting}
              onChange={(e) => setGreeting(e.target.value)}
              className="w-full px-3.5 py-2 text-xs rounded-xl bg-slate-800 border border-slate-700 text-white focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-400">
              {saved ? (lang === 'ar' ? '✓ تم تطبيق الهوية المؤسسية!' : '✓ Enterprise branding saved!') : ''}
            </span>

            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white text-xs font-black shadow-lg shadow-pink-600/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{t.enterprise.saveEnterprise}</span>
            </button>
          </div>
        </form>

        {/* Right Live Preview Box */}
        <div className="lg:col-span-5 p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 text-start">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-wider">
            <span className="flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              {lang === 'ar' ? 'معاينة فورية لصفحة التحميل بشعارك' : 'Live White-Label Preview'}
            </span>
            <span className="text-[10px] text-pink-400 font-bold">Client View</span>
          </div>

          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            {/* Branded Subdomain Address Bar */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-[11px] font-mono text-cyan-400">
              <Globe className="w-3.5 h-3.5 text-slate-500" />
              <span>https://{customDomain}</span>
            </div>

            {/* Branded Download Header Mock */}
            <div className="text-center py-4 space-y-2 border-b border-slate-800">
              <div 
                className="w-12 h-12 rounded-2xl text-white mx-auto flex items-center justify-center font-black text-lg shadow-lg"
                style={{ backgroundColor: brandColor }}
              >
                {brandName.substring(0, 2).toUpperCase()}
              </div>
              <h3 className="text-sm font-black text-white">{brandName}</h3>
              <p className="text-[11px] text-slate-400 italic">{greeting}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs">
              <span className="font-bold text-white">Client_Confidential_Document.pdf</span>
              <span 
                className="px-3 py-1 rounded-lg text-white font-bold text-[11px]"
                style={{ backgroundColor: brandColor }}
              >
                Download
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
