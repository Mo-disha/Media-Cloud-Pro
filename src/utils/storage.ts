import { FileItem, FolderItem, UserProfile, PlanTier, SecurityAuditLog, SupportTicket, ServerNodeStatus, NotificationItem } from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr_premium_789',
  name: 'عمار ياسر (Ammar Yaser)',
  email: 'ammar@mediacloud.net',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  plan: 'pro',
  usedStorage: 34359738368, // 32 GB
  totalStorage: 1073741824000, // 1 TB
  bandwidthUsed: 182536110080, // ~170 GB
  bandwidthLimit: 10995116277760, // 10 TB
  accountCreated: '2025-01-15',
  is2FAEnabled: true,
  brandName: 'MediaCloud Business',
  brandColor: '#2563eb',
  customDomain: 'files.ammar-cloud.com'
};

export const DEFAULT_PLANS: PlanTier[] = [
  {
    id: 'free',
    name: 'Free Starter',
    nameAr: 'الباقة المجانية الأساسية',
    priceMonthly: 0,
    priceAnnual: 0,
    storageGB: 10,
    bandwidthTB: 0.1,
    maxFileSizeGB: 2,
    features: [
      '10 GB Cloud Storage Space',
      'Standard Download Speed (Up to 10 MB/s)',
      'Basic File Sharing Links',
      'Supported by Non-Intrusive Ads',
      '30-Day Link Retention'
    ],
    featuresAr: [
      '10 جيجابايت مساحة تخزين سحابية مجانية',
      'سرعة تحميل قياسية (حتى 10 ميجابايت/ثانية)',
      'روابط مشاركة أساسية',
      'مدعومة بإعلانات غير مزعجة',
      'صلاحية الروابط 30 يوماً'
    ]
  },
  {
    id: 'pro',
    name: 'Pro Plus',
    nameAr: 'باقة المحترفين Pro Plus',
    priceMonthly: 4.99,
    priceAnnual: 49.99,
    storageGB: 1000, // 1 TB
    bandwidthTB: 10,
    maxFileSizeGB: 20,
    isPopular: true,
    badge: 'Most Popular',
    badgeAr: 'الأكثر طلباً',
    features: [
      '1,000 GB (1 TB) Storage Quota',
      'Direct Hotlinking & Ultra Fast Speeds',
      '100% Ad-Free Download Experience',
      'AES-256 Military Grade Encryption',
      'Password Protected & Custom Expiry Links',
      'Priority Bandwidth Routing'
    ],
    featuresAr: [
      '1,000 جيجابايت (1 تيرابايت) مساحة فائقة',
      'روابط تحميل مباشرة وسريعة بدون انتظار',
      'تجربة خالية تماماً من أي إعلانات',
      'تشفير عسكري كامل للملفات AES-256',
      'حماية بكلمات مرور وروابط ذاتية الإلغاء',
      'أولوية التوزيع على خوادم CDN فائقة السرعة'
    ]
  },
  {
    id: 'business',
    name: 'Business Suite',
    nameAr: 'باقة الأعمال والفرق Business',
    priceMonthly: 14.99,
    priceAnnual: 149.99,
    storageGB: 5000, // 5 TB
    bandwidthTB: 50,
    maxFileSizeGB: 50,
    features: [
      '5,000 GB (5 TB) Scalable Cloud Storage',
      'Custom Subdomain (files.yourcompany.com)',
      'White-Label Download Page with Your Logo',
      'Team Collaboration & User Access Roles',
      'Real-Time Download Traffic Analytics & Logs',
      '24/7 Dedicated Priority Technical Support'
    ],
    featuresAr: [
      '5,000 جيجابايت (5 تيرابايت) مساحة مؤسسية قابلة للتوسع',
      'ربط نطاق مخصص (files.yourbrand.com)',
      'تخصيص كامل لصفحة التحميل بشعارك وألوانك',
      'أدوات إدارة وتراخيص فريق العمل والموظفين',
      'لوحة تحليلات تفصيلية لحركة الزوار والتنزيلات',
      'دعم فني مخصص VIP على مدار 24/7'
    ]
  },
  {
    id: 'enterprise',
    name: 'Enterprise Max',
    nameAr: 'باقة المؤسسات الضخمة Enterprise',
    priceMonthly: 39.99,
    priceAnnual: 399.99,
    storageGB: 20000, // 20 TB
    bandwidthTB: 200,
    maxFileSizeGB: 100,
    features: [
      '20 TB+ Ultra Cloud Infrastructure',
      'Dedicated Global Server CDN Node',
      'Custom API Integration & Webhooks',
      '99.99% Guaranteed SLA Uptime',
      'Automated Multi-Region Disaster Recovery',
      'Dedicated Account Manager'
    ],
    featuresAr: [
      '20 تيرابايت مساحة تخزين عملاقة',
      'خوادم مخصصة ذات نطاق ترددي فائق',
      'واجهة برمجية كاملة API وتكامل مع الأنظمة',
      'ضمان استقرار الخوادم 99.99% SLA',
      'نظام نسخ احتياطي تلقائي متعدد المناطق',
      'مدير حسابات فني خاص للمؤسسة'
    ]
  }
];

export const INITIAL_FOLDERS: FolderItem[] = [
  { id: 'fld_projects', name: 'مشاريع البرمجيات والأكواد (Projects)', color: '#3b82f6', parentId: null, createdAt: '2025-02-10', itemCount: 3 },
  { id: 'fld_media', name: 'مكتبة الفيديوهات والتصاميم (Media & 4K)', color: '#8b5cf6', parentId: null, createdAt: '2025-02-12', itemCount: 4 },
  { id: 'fld_docs', name: 'وثائق وعقود العمل (Documents)', color: '#10b981', parentId: null, createdAt: '2025-02-14', itemCount: 2 },
  { id: 'fld_backups', name: 'النسخ الاحتياطية المضغوطة (Backups)', color: '#f59e0b', parentId: null, createdAt: '2025-02-15', itemCount: 2 },
];

export const INITIAL_FILES: FileItem[] = [
  {
    id: 'file_winrar_archive',
    name: 'MediaCloud_Full_Database_Backup_2025.zip',
    size: 2453671936, // ~2.28 GB
    type: 'application/zip',
    extension: 'zip',
    category: 'archives',
    uploadDate: '2025-02-18 10:30',
    lastModified: '2025-02-18 10:30',
    downloadsCount: 1420,
    viewsCount: 3890,
    isFavorite: true,
    isTrash: false,
    folderId: 'fld_backups',
    isPublic: true,
    isEncrypted: true,
    encryptionAlgorithm: 'AES-256-GCM',
    password: '',
    expiresAt: null,
    maxDownloads: null,
    shareCode: 'mc-zip-8932',
    directDownloadUrl: 'https://download.mediacloud.net/direct/mc-zip-8932/MediaCloud_Full_Database_Backup_2025.zip',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    virusScanStatus: 'clean',
    virusScanEnginesPassed: 72,
    tags: ['backup', 'database', 'sql', 'production'],
    uploader: {
      name: 'Ammar Yaser',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isPro: true
    }
  },
  {
    id: 'file_video_promo',
    name: 'Cyber_Security_Promo_4K_UltraHD.mp4',
    size: 891289600, // ~850 MB
    type: 'video/mp4',
    extension: 'mp4',
    category: 'videos',
    uploadDate: '2025-02-17 14:15',
    lastModified: '2025-02-17 14:15',
    downloadsCount: 840,
    viewsCount: 2150,
    isFavorite: true,
    isTrash: false,
    folderId: 'fld_media',
    isPublic: true,
    isEncrypted: false,
    shareCode: 'mc-vid-7721',
    directDownloadUrl: 'https://download.mediacloud.net/direct/mc-vid-7721/Cyber_Security_Promo_4K_UltraHD.mp4',
    sha256Hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
    virusScanStatus: 'clean',
    virusScanEnginesPassed: 72,
    tags: ['4k', 'video', 'promo', 'security'],
    uploader: {
      name: 'Ammar Yaser',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isPro: true
    }
  },
  {
    id: 'file_pdf_contract',
    name: 'Enterprise_Cloud_Service_Level_Agreement.pdf',
    size: 14680064, // ~14 MB
    type: 'application/pdf',
    extension: 'pdf',
    category: 'documents',
    uploadDate: '2025-02-16 09:20',
    lastModified: '2025-02-16 09:20',
    downloadsCount: 310,
    viewsCount: 950,
    isFavorite: false,
    isTrash: false,
    folderId: 'fld_docs',
    isPublic: true,
    isEncrypted: true,
    encryptionAlgorithm: 'AES-256-CBC',
    password: '123', // sample password
    shareCode: 'mc-doc-4412',
    directDownloadUrl: 'https://download.mediacloud.net/direct/mc-doc-4412/Enterprise_Cloud_Service_Level_Agreement.pdf',
    sha256Hash: '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8',
    virusScanStatus: 'clean',
    virusScanEnginesPassed: 72,
    tags: ['sla', 'contract', 'legal', 'pdf'],
    uploader: {
      name: 'Ammar Yaser',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isPro: true
    }
  },
  {
    id: 'file_android_apk',
    name: 'MediaCloud_Mobile_App_v3.4.0_Release.apk',
    size: 68157440, // ~65 MB
    type: 'application/vnd.android.package-archive',
    extension: 'apk',
    category: 'software',
    uploadDate: '2025-02-15 16:45',
    lastModified: '2025-02-15 16:45',
    downloadsCount: 5200,
    viewsCount: 11400,
    isFavorite: true,
    isTrash: false,
    folderId: 'fld_projects',
    isPublic: true,
    isEncrypted: false,
    shareCode: 'mc-apk-9912',
    directDownloadUrl: 'https://download.mediacloud.net/direct/mc-apk-9912/MediaCloud_Mobile_App_v3.4.0_Release.apk',
    sha256Hash: '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a',
    virusScanStatus: 'clean',
    virusScanEnginesPassed: 72,
    tags: ['android', 'apk', 'release', 'mobile'],
    uploader: {
      name: 'Ammar Yaser',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isPro: true
    }
  },
  {
    id: 'file_music_audio',
    name: 'Inspirational_Ambient_Corporate_Soundtrack.mp3',
    size: 25165824, // ~24 MB
    type: 'audio/mpeg',
    extension: 'mp3',
    category: 'audio',
    uploadDate: '2025-02-14 11:10',
    lastModified: '2025-02-14 11:10',
    downloadsCount: 620,
    viewsCount: 1400,
    isFavorite: false,
    isTrash: false,
    folderId: 'fld_media',
    isPublic: true,
    isEncrypted: false,
    shareCode: 'mc-aud-3319',
    directDownloadUrl: 'https://download.mediacloud.net/direct/mc-aud-3319/Inspirational_Ambient_Corporate_Soundtrack.mp3',
    sha256Hash: 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d',
    virusScanStatus: 'clean',
    virusScanEnginesPassed: 72,
    tags: ['audio', 'mp3', 'music', 'soundtrack'],
    uploader: {
      name: 'Ammar Yaser',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isPro: true
    }
  },
  {
    id: 'file_highres_image',
    name: 'Cloud_DataCenter_Global_Network_Wall.jpg',
    size: 18874368, // ~18 MB
    type: 'image/jpeg',
    extension: 'jpg',
    category: 'images',
    uploadDate: '2025-02-13 18:00',
    lastModified: '2025-02-13 18:00',
    downloadsCount: 970,
    viewsCount: 3100,
    isFavorite: true,
    isTrash: false,
    folderId: 'fld_media',
    isPublic: true,
    isEncrypted: false,
    shareCode: 'mc-img-5561',
    directDownloadUrl: 'https://download.mediacloud.net/direct/mc-img-5561/Cloud_DataCenter_Global_Network_Wall.jpg',
    dataUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=1200&auto=format&fit=crop&q=80',
    sha256Hash: '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918',
    virusScanStatus: 'clean',
    virusScanEnginesPassed: 72,
    tags: ['datacenter', 'wallpaper', '4k', 'servers'],
    uploader: {
      name: 'Ammar Yaser',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isPro: true
    }
  },
  {
    id: 'file_trash_item',
    name: 'Old_Deprecated_System_Logs_2024.log',
    size: 5242880, // 5 MB
    type: 'text/plain',
    extension: 'log',
    category: 'documents',
    uploadDate: '2025-01-10 12:00',
    lastModified: '2025-01-10 12:00',
    downloadsCount: 12,
    viewsCount: 45,
    isFavorite: false,
    isTrash: true,
    folderId: null,
    isPublic: false,
    isEncrypted: false,
    shareCode: 'mc-log-1102',
    directDownloadUrl: 'https://download.mediacloud.net/direct/mc-log-1102/Old_Deprecated_System_Logs_2024.log',
    sha256Hash: 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3',
    virusScanStatus: 'clean',
    virusScanEnginesPassed: 72,
    uploader: {
      name: 'Ammar Yaser',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      isPro: true
    }
  }
];

export const INITIAL_AUDIT_LOGS: SecurityAuditLog[] = [
  {
    id: 'log_01',
    fileId: 'file_winrar_archive',
    fileName: 'MediaCloud_Full_Database_Backup_2025.zip',
    action: 'download',
    ipAddress: '156.198.42.110',
    location: 'Riyadh, Saudi Arabia (KSA)',
    device: 'Chrome 122 / Windows 11',
    timestamp: '2025-02-19 13:20:15',
    status: 'success'
  },
  {
    id: 'log_02',
    fileId: 'file_pdf_contract',
    fileName: 'Enterprise_Cloud_Service_Level_Agreement.pdf',
    action: 'password_attempt',
    ipAddress: '197.34.12.89',
    location: 'Cairo, Egypt',
    device: 'Safari / iPhone 15 Pro',
    timestamp: '2025-02-19 12:45:02',
    status: 'success'
  },
  {
    id: 'log_03',
    fileId: 'file_android_apk',
    fileName: 'MediaCloud_Mobile_App_v3.4.0_Release.apk',
    action: 'download',
    ipAddress: '54.210.18.99',
    location: 'Frankfurt, Germany',
    device: 'Firefox 123 / Linux x64',
    timestamp: '2025-02-19 11:15:30',
    status: 'success'
  },
  {
    id: 'log_04',
    fileId: 'file_pdf_contract',
    fileName: 'Enterprise_Cloud_Service_Level_Agreement.pdf',
    action: 'password_attempt',
    ipAddress: '185.220.101.5',
    location: 'Amsterdam, Netherlands (TOR Exit)',
    device: 'TorBrowser / Linux',
    timestamp: '2025-02-19 09:30:12',
    status: 'blocked'
  }
];

export const INITIAL_SERVER_NODES: ServerNodeStatus[] = [
  { id: 'node_riyadh', name: 'Middle East Hub 1 (Riyadh)', location: 'Saudi Arabia', flag: '🇸🇦', status: 'online', latencyMs: 14, loadPercentage: 42 },
  { id: 'node_cairo', name: 'North Africa Node 2 (Cairo)', location: 'Egypt', flag: '🇪🇬', status: 'online', latencyMs: 19, loadPercentage: 58 },
  { id: 'node_frankfurt', name: 'Europe Central 1 (Frankfurt)', location: 'Germany', flag: '🇩🇪', status: 'online', latencyMs: 38, loadPercentage: 64 },
  { id: 'node_virginia', name: 'US East Tier 4 (Virginia)', location: 'United States', flag: '🇺🇸', status: 'online', latencyMs: 85, loadPercentage: 49 },
  { id: 'node_singapore', name: 'Asia Pacific Edge (Singapore)', location: 'Singapore', flag: '🇸🇬', status: 'online', latencyMs: 110, loadPercentage: 35 },
  { id: 'node_london', name: 'UK High-Speed CDN (London)', location: 'United Kingdom', flag: '🇬🇧', status: 'online', latencyMs: 44, loadPercentage: 52 },
];

export const INITIAL_TICKETS: SupportTicket[] = [
  {
    id: 'TICK-8841',
    subject: 'طلب تفعيل نطاق مخصص للنظام الفرعي (CNAME Configuration)',
    category: 'api',
    priority: 'high',
    status: 'in_progress',
    createdAt: '2025-02-18 14:00',
    updatedAt: '2025-02-18 15:30',
    messages: [
      {
        id: 'msg_1',
        sender: 'user',
        senderName: 'Ammar Yaser',
        text: 'مرحباً، أود ربط النطاق files.ammar-cloud.com وتفعيل شهادة SSL Wildcard تلقائية.',
        timestamp: '2025-02-18 14:00'
      },
      {
        id: 'msg_2',
        sender: 'agent',
        senderName: 'Eng. Tariq (Senior Cloud Ops)',
        text: 'أهلاً بك أستاذ عمار! تم توجيه سجلات الـ DNS ومزامنة شهادة Let’s Encrypt بنجاح. النطاق جاهز بنسبة 100%.',
        timestamp: '2025-02-18 15:30'
      }
    ]
  },
  {
    id: 'TICK-8720',
    subject: 'استفسار بخصوص سرعات الرفع متعددة القنوات (Multi-part S3 Acceleration)',
    category: 'speed',
    priority: 'medium',
    status: 'resolved',
    createdAt: '2025-02-14 09:15',
    updatedAt: '2025-02-14 10:45',
    messages: [
      {
        id: 'msg_3',
        sender: 'user',
        senderName: 'Ammar Yaser',
        text: 'هل تدعم الخوادم استئناف الرفع في حال انقطاع الاتصال؟',
        timestamp: '2025-02-14 09:15'
      },
      {
        id: 'msg_4',
        sender: 'bot',
        senderName: 'MediaCloud AI Bot',
        text: 'نعم بالتأكيد! تعتمد خوادمنا على بروتوكول Chunked Transfer مع SHA-256 Checkpoint لضمان استئناف الرفع فور عودة الاتصال دون إعادة رفع الملف من البداية.',
        timestamp: '2025-02-14 09:16'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'notif_1',
    title: 'تنزيلات قياسية للملف',
    titleAr: 'تنزيلات قياسية للملف',
    message: 'وصل ملف MediaCloud_Mobile_App_v3.4.0_Release.apk إلى أكثر من 5,000 تحميل مباشر اليوم!',
    messageAr: 'وصل ملف MediaCloud_Mobile_App_v3.4.0_Release.apk إلى أكثر من 5,000 تحميل مباشر اليوم!',
    type: 'download',
    timestamp: 'منذ 15 دقيقة',
    isRead: false
  },
  {
    id: 'notif_2',
    title: 'تم إنشاء نسخة احتياطية بنجاح',
    titleAr: 'تم إنشاء نسخة احتياطية بنجاح',
    message: 'تم حفظ لقطة Snapshot كاملة لجميع ملفات السحابة مشفرة ببروتوكول AES-256.',
    messageAr: 'تم حفظ لقطة Snapshot كاملة لجميع ملفات السحابة مشفرة ببروتوكول AES-256.',
    type: 'system',
    timestamp: 'منذ ساعتين',
    isRead: false
  },
  {
    id: 'notif_3',
    title: 'تنبيه أمني جديد',
    titleAr: 'تنبيه أمني جديد',
    message: 'تم تسجيل محاولة تحميل ناجحة للملف المحمي بكلمة مرور من الرياض (156.198.42.110).',
    messageAr: 'تم تسجيل محاولة تحميل ناجحة للملف المحمي بكلمة مرور من الرياض (156.198.42.110).',
    type: 'security',
    timestamp: 'منذ 4 ساعات',
    isRead: true
  }
];

// Formatting Utilities
export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export function detectCategory(extension: string, mimeType: string): { category: FileItem['category'], ext: string } {
  const ext = extension.toLowerCase().replace('.', '');
  if (['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg', 'bmp', 'ico'].includes(ext) || mimeType.startsWith('image/')) {
    return { category: 'images', ext };
  }
  if (['mp4', 'mkv', 'avi', 'mov', 'webm', 'wmv', 'flv'].includes(ext) || mimeType.startsWith('video/')) {
    return { category: 'videos', ext };
  }
  if (['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a'].includes(ext) || mimeType.startsWith('audio/')) {
    return { category: 'audio', ext };
  }
  if (['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'md'].includes(ext) || mimeType.includes('pdf') || mimeType.includes('word') || mimeType.includes('document')) {
    return { category: 'documents', ext };
  }
  if (['zip', 'rar', '7z', 'tar', 'gz', 'iso', 'bz2'].includes(ext) || mimeType.includes('zip') || mimeType.includes('compressed')) {
    return { category: 'archives', ext };
  }
  if (['apk', 'exe', 'msi', 'dmg', 'deb', 'rpm', 'sh', 'jar'].includes(ext)) {
    return { category: 'software', ext };
  }
  return { category: 'others', ext: ext || 'bin' };
}

export async function generateFileHash(fileOrString: File | string): Promise<string> {
  try {
    let buffer: ArrayBuffer;
    if (typeof fileOrString === 'string') {
      const encoder = new TextEncoder();
      buffer = encoder.encode(fileOrString);
    } else {
      buffer = await fileOrString.arrayBuffer();
    }
    const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback pseudo-hash
    let hash = 0;
    const str = typeof fileOrString === 'string' ? fileOrString : fileOrString.name + fileOrString.size;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(16).padStart(64, 'a1f309b8');
  }
}
