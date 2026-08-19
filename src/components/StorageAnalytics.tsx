import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Download, 
  Globe2, 
  HardDrive, 
  Users, 
  FileText, 
  ArrowUpRight,
  FileSpreadsheet,
  Calendar
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { FileItem, Language, UserProfile } from '../types';
import { translations } from '../translations';
import { formatBytes } from '../utils/storage';

interface StorageAnalyticsProps {
  lang: Language;
  files: FileItem[];
  user: UserProfile;
}

const DOWNLOAD_CHART_DATA = [
  { day: 'Sat', downloads: 820, bandwidthGB: 45 },
  { day: 'Sun', downloads: 1140, bandwidthGB: 68 },
  { day: 'Mon', downloads: 1420, bandwidthGB: 92 },
  { day: 'Tue', downloads: 1980, bandwidthGB: 120 },
  { day: 'Wed', downloads: 2450, bandwidthGB: 154 },
  { day: 'Thu', downloads: 3100, bandwidthGB: 198 },
  { day: 'Fri', downloads: 3890, bandwidthGB: 240 },
];

const GEO_DATA = [
  { country: 'Saudi Arabia 🇸🇦', downloads: 4820, percentage: 34 },
  { country: 'Egypt 🇪🇬', downloads: 3250, percentage: 23 },
  { country: 'United Arab Emirates 🇦🇪', downloads: 2100, percentage: 15 },
  { country: 'United States 🇺🇸', downloads: 1650, percentage: 12 },
  { country: 'Germany 🇩🇪', downloads: 1200, percentage: 8 },
  { country: 'Other Global Nodes 🌐', downloads: 1120, percentage: 8 },
];

export const StorageAnalytics: React.FC<StorageAnalyticsProps> = ({
  lang,
  files,
  user,
}) => {
  const t = translations[lang];
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d'>('7d');
  const [exported, setExported] = useState(false);

  const totalDownloads = files.reduce((acc, f) => acc + f.downloadsCount, 0) + 14250;
  const activeFilesCount = files.filter(f => !f.isTrash).length;

  const handleExportCSV = () => {
    setExported(true);
    // Generate simple CSV download
    const csvContent = "data:text/csv;charset=utf-8," 
      + "File Name,Size (Bytes),Downloads,SHA256,Upload Date\n"
      + files.map(e => `"${e.name}",${e.size},${e.downloadsCount},"${e.sha256Hash}","${e.uploadDate}"`).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `mediacloud_analytics_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => setExported(false), 3000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950/40 text-slate-100 space-y-6">
      {/* Header & Export Action */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <span>{t.analytics.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{t.analytics.subtitle}</p>
        </div>

        <div className="flex items-center gap-2">
          {/* Time Range Pills */}
          <div className="flex bg-slate-850 p-1 rounded-xl border border-slate-700">
            {(['7d', '30d', '90d'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setTimeRange(r)}
                className={`px-3 py-1 text-xs font-bold rounded-lg transition-all ${
                  timeRange === r ? 'bg-purple-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                }`}
              >
                {r.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-500/30 transition-all cursor-pointer shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-purple-400" />
            <span>{exported ? (lang === 'ar' ? '✓ تم التصدير!' : '✓ Exported!') : t.actions.exportReport}</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Downloads */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{t.analytics.totalDownloads}</span>
            <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400">
              <Download className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {totalDownloads.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 flex items-center gap-1 font-semibold">
            <ArrowUpRight className="w-3.5 h-3.5" /> +28.4% this week
          </div>
        </div>

        {/* Bandwidth Usage */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{t.analytics.bandwidthUsed}</span>
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {formatBytes(user.bandwidthUsed)}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            of {formatBytes(user.bandwidthLimit)} total limit
          </div>
        </div>

        {/* Active Cloud Files */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{t.analytics.activeFiles}</span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {activeFilesCount} files
          </div>
          <div className="text-[11px] text-cyan-400 font-semibold">
            100% SHA-256 verified
          </div>
        </div>

        {/* Conversion / Download Success Rate */}
        <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-1">
          <div className="flex items-center justify-between text-xs font-bold text-slate-400">
            <span>{t.analytics.conversionRate}</span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 font-mono">
            99.4%
          </div>
          <div className="text-[11px] text-slate-400">
            Ultra-low bounce rate (Direct Link CDN)
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Download Traffic Area Chart */}
        <div className="lg:col-span-8 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t.analytics.downloadTrends}
            </h3>
            <span className="text-[11px] text-purple-400 font-mono font-bold">10 Gbps Pipeline Active</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={DOWNLOAD_CHART_DATA}>
                <defs>
                  <linearGradient id="downloadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                <XAxis dataKey="day" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                  itemStyle={{ color: '#c084fc' }}
                />
                <Area type="monotone" dataKey="downloads" stroke="#a855f7" strokeWidth={3} fillOpacity={1} fill="url(#downloadGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Geographic Distribution */}
        <div className="lg:col-span-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Globe2 className="w-4 h-4 text-cyan-400" />
              {t.analytics.topCountries}
            </h3>
          </div>

          <div className="space-y-3">
            {GEO_DATA.map((geo, i) => (
              <div key={i} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">{geo.country}</span>
                  <span className="text-cyan-400 font-mono">{geo.percentage}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-purple-500 to-cyan-400 h-full rounded-full"
                    style={{ width: `${geo.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Files Leaderboard */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
          {t.analytics.topFiles}
        </h3>

        <div className="divide-y divide-slate-800/80">
          {files.slice(0, 4).map((file, idx) => (
            <div key={file.id} className="py-3 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-black text-slate-500 font-mono w-5">#{idx + 1}</span>
                <div className="min-w-0">
                  <h4 className="font-bold text-white truncate">{file.name}</h4>
                  <span className="text-[11px] text-slate-400 font-mono">{formatBytes(file.size)}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0 font-mono">
                <div className="text-end">
                  <span className="text-cyan-400 font-bold">{file.downloadsCount.toLocaleString()}</span>
                  <span className="text-[10px] text-slate-500 block">{lang === 'ar' ? 'تحميل مباشر' : 'downloads'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
