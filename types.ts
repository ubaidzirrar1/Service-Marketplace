
export type UserRole = 'guest' | 'client' | 'worker';

export type JobStatus = 'open' | 'in-progress' | 'completed' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_class: string;
  color?: string; // For UI styling
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'location';
  time: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: string;
}

export interface ChatThread {
  id: string;
  participantName: string;
  participantAvatar: string;
  lastMessage: string;
  time: string;
  unreadCount: number;
  messages: ChatMessage[];
}

export interface Review {
  id: string;
  job_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number; // 1-5
  comment: string;
  date: string;
}

export interface Proposal {
  id: string;
  job_id: string;
  worker_id: string;
  worker_name: string;
  worker_avatar: string;
  worker_rating: number;
  bid_amount: number;
  delivery_time: string;
  cover_letter: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  title: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  cnic: string;
  phone: string;
  latitude: number;
  longitude: number;
  category_id?: string; // For workers
  is_verified: boolean;
  bio: string;
  avatar: string;
  is_online: boolean;
  skills: string[];
  portfolio: PortfolioItem[];
  member_since: string;
  avg_response: string;
}

export interface JobPost {
  id: string;
  client_id: string;
  category_id: string;
  title: string;
  description: string;
  budget: string;
  budget_numeric: number;
  lat: number;
  lng: number;
  status: JobStatus;
  posted_at: string;
  applicants_count: number;
  distance_km?: number; // Computed field
  proposals?: Proposal[];
}

// Compatibility types for views
export type Job = JobPost;

export interface Worker {
  id: string;
  name: string;
  category: string;
  rating: number;
  avatar: string;
  reviewsCount?: number;
  distance?: string;
  location: { lat: number; lng: number };
  verified: boolean;
  about: string;
  skills: string[];
  portfolio: PortfolioItem[];
}

export enum AppRoute {
  HOME = '/',
  ROLE_SELECTION = '/roles',
  REGISTER = '/register',
  VERIFICATION = '/verify',
  WORKER_DASHBOARD = '/worker/dashboard',
  CLIENT_DASHBOARD = '/client/dashboard',
  POST_JOB = '/post-job',
  MAP = '/map',
  SETTINGS = '/settings',
  PROFILE = '/profile/:id',
  INBOX = '/inbox'
}
