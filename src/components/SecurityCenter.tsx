import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Smartphone, 
  DatabaseBackup, 
  History, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  RefreshCw,
  Server,
  Zap
} from 'lucide-react';
import { Language, SecurityAuditLog, UserProfile } from '../types';
import { translations } from '../translations';
import { INITIAL_AUDIT_LOGS } from '../utils/storage';

interface SecurityCenterProps {
  lang: Language;
  user: UserProfile;
  onToggle2FA: () => void;
}

export const SecurityCenter: React.FC<SecurityCenterProps> = ({
  lang,
  user,
  onToggle2FA,
}) => {
  const t = translations[lang];
  const [auditLogs, setAuditLogs] = useState<SecurityAuditLog[]>(INITIAL_AUDIT_LOGS);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [backupSuccess, setBackupSuccess] = useState(false);
  const [sessionsRevoked, setSessionsRevoked] = useState(false);

  const handleCreateSnapshot = () => {
    setIsBackingUp(true);
    setTimeout(() => {
      setIsBackingUp(false);
      setBackupSuccess(true);
      setTimeout(() => setBackupSuccess(false), 4000);
    }, 2000);
  };

  const handleRevokeSessions = () => {
    setSessionsRevoked(true);
    setTimeout(() => setSessionsRevoked(false), 3000);
  };

  return (
    <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-slate-950/40 text-slate-100 space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800">
        <h2 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-teal-400" />
          <span>{t.security.title}</span>
        </h2>
        <p className="text-xs text-slate-400 mt-0.5">{t.security.subtitle}</p>
      </div>

      {/* Security Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* End-to-End Encryption */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-teal-500/20 text-teal-400">
              <Lock className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-300 border border-teal-500/30">
              Active AES-256
            </span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t.security.encryptionStatus}</h3>
            <p className="text-xs text-slate-400 mt-1">{t.security.encryptionDesc}</p>
          </div>
        </div>

        {/* Two-Factor Authentication (2FA) */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-blue-500/20 text-blue-400">
              <Smartphone className="w-5 h-5" />
            </div>
            <button
              onClick={onToggle2FA}
              className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full transition-all cursor-pointer ${
                user.is2FAEnabled
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}
            >
              {user.is2FAEnabled ? 'ENABLED (ON)' : 'DISABLED (OFF)'}
            </button>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t.security.twoFactor}</h3>
            <p className="text-xs text-slate-400 mt-1">{t.security.twoFactorDesc}</p>
          </div>
        </div>

        {/* Automated Backups */}
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-2xl bg-indigo-500/20 text-indigo-400">
              <DatabaseBackup className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold text-indigo-300">Daily 03:00 AM</span>
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">{t.security.autoBackup}</h3>
            <p className="text-xs text-slate-400 mt-1">{t.security.backupSchedule}</p>
          </div>
          <button
            onClick={handleCreateSnapshot}
            disabled={isBackingUp}
            className="w-full py-1.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isBackingUp ? 'animate-spin' : ''}`} />
            <span>{isBackingUp ? 'Creating Encrypted Snapshot...' : backupSuccess ? '✓ Snapshot Created!' : t.actions.startBackup}</span>
          </button>
        </div>
      </div>

      {/* Active Sessions & Global Revocation */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              {t.security.activeSessions}
            </h3>
            <p className="text-xs text-slate-400">Devices currently authenticated with OAuth and 2FA</p>
          </div>

          <button
            onClick={handleRevokeSessions}
            className="px-3.5 py-1.5 rounded-xl bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border border-rose-500/30 text-xs font-bold transition-all cursor-pointer"
          >
            {sessionsRevoked ? '✓ All Sessions Terminated' : t.security.revokeAll}
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-white flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                Windows 11 / Chrome 122 (Current)
              </div>
              <span className="text-slate-400 text-[11px] font-mono">IP: 156.198.42.110 • Riyadh, Saudi Arabia</span>
            </div>
            <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded">Active</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between">
            <div className="space-y-1">
              <div className="font-bold text-slate-300 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                Apple iPhone 15 Pro / Safari Mobile
              </div>
              <span className="text-slate-400 text-[11px] font-mono">IP: 197.34.12.89 • Cairo, Egypt</span>
            </div>
            <span className="text-[10px] text-slate-400">2 hours ago</span>
          </div>
        </div>
      </div>

      {/* Real-Time Security Audit Logs */}
      <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
        <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
          <History className="w-4 h-4 text-cyan-400" />
          <span>{t.security.auditLogs}</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-start">
            <thead className="text-slate-500 uppercase border-b border-slate-800 text-[10px]">
              <tr>
                <th className="py-2.5 px-3 text-start">Action</th>
                <th className="py-2.5 px-3 text-start">Target File</th>
                <th className="py-2.5 px-3 text-start">IP & Geolocation</th>
                <th className="py-2.5 px-3 text-start">Device / Client</th>
                <th className="py-2.5 px-3 text-start">Timestamp</th>
                <th className="py-2.5 px-3 text-start">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
              {auditLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-850/50">
                  <td className="py-3 px-3 uppercase font-bold text-cyan-400">{log.action}</td>
                  <td className="py-3 px-3 truncate max-w-xs font-sans text-white font-medium">{log.fileName}</td>
                  <td className="py-3 px-3 text-slate-400">{log.location} ({log.ipAddress})</td>
                  <td className="py-3 px-3 text-slate-400 font-sans">{log.device}</td>
                  <td className="py-3 px-3 text-slate-500">{log.timestamp}</td>
                  <td className="py-3 px-3">
                    {log.status === 'success' ? (
                      <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Allowed
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                        <XCircle className="w-3.5 h-3.5" /> Blocked
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
