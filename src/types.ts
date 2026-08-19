export type Language = 'ar' | 'en';

export type FileCategory = 'all' | 'documents' | 'images' | 'videos' | 'audio' | 'archives' | 'software' | 'others';

export interface FileItem {
  id: string;
  name: string;
  size: number; // in bytes
  type: string; // mime type or extension
  extension: string;
  category: FileCategory;
  uploadDate: string;
  lastModified: string;
  downloadsCount: number;
  viewsCount: number;
  isFavorite: boolean;
  isTrash: boolean;
  folderId: string | null;
  // Security & Sharing
  isPublic: boolean;
  isEncrypted: boolean;
  encryptionAlgorithm?: string;
  password?: string;
  expiresAt?: string | null;
  maxDownloads?: number | null;
  shareCode: string;
  directDownloadUrl: string;
  sha256Hash: string;
  virusScanStatus: 'clean' | 'scanning' | 'flagged';
  virusScanEnginesPassed?: number; // e.g. 72/72
  dataUrl?: string; // for real preview/download of user uploaded files
  blobData?: Blob;
  tags?: string[];
  uploader: {
    name: string;
    avatar: string;
    isPro: boolean;
  };
}

export interface FolderItem {
  id: string;
  name: string;
  color?: string;
  parentId: string | null;
  createdAt: string;
  itemCount: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  plan: 'free' | 'pro' | 'business' | 'enterprise';
  usedStorage: number; // in bytes
  totalStorage: number; // in bytes
  bandwidthUsed: number; // in bytes
  bandwidthLimit: number; // in bytes
  accountCreated: string;
  is2FAEnabled: boolean;
  customDomain?: string;
  brandName?: string;
  brandColor?: string;
}

export interface PlanTier {
  id: 'free' | 'pro' | 'business' | 'enterprise';
  name: string;
  nameAr: string;
  priceMonthly: number;
  priceAnnual: number;
  storageGB: number;
  bandwidthTB: number;
  maxFileSizeGB: number;
  features: string[];
  featuresAr: string[];
  isPopular?: boolean;
  badge?: string;
  badgeAr?: string;
}

export interface SecurityAuditLog {
  id: string;
  fileId: string;
  fileName: string;
  action: 'download' | 'view' | 'upload' | 'delete' | 'password_attempt' | 'link_generated';
  ipAddress: string;
  location: string;
  device: string;
  timestamp: string;
  status: 'success' | 'blocked' | 'warning';
}

export interface SupportTicket {
  id: string;
  subject: string;
  category: 'speed' | 'storage' | 'billing' | 'security' | 'api' | 'general';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    sender: 'user' | 'agent' | 'bot';
    senderName: string;
    text: string;
    timestamp: string;
  }[];
}

export interface NotificationItem {
  id: string;
  title: string;
  titleAr: string;
  message: string;
  messageAr: string;
  type: 'download' | 'security' | 'system' | 'billing' | 'quota';
  timestamp: string;
  isRead: boolean;
  link?: string;
}

export interface ServerNodeStatus {
  id: string;
  name: string;
  location: string;
  flag: string;
  status: 'online' | 'degraded' | 'maintenance';
  latencyMs: number;
  loadPercentage: number;
}
