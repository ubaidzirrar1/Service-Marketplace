
import { User, JobPost, AppNotification, UserRole, ChatThread, Category, Proposal } from '../types';

/**
 * Persisted Storage Keys
 */
const DB_USERS = 'globalserv_db_users';
const DB_JOBS = 'globalserv_db_jobs';
const DB_NOTIFS = 'globalserv_db_notifications';
const DB_AUTH = 'globalserv_auth_session';
const DB_SETTINGS = 'globalserv_settings';

/**
 * Haversine Formula: The math logic for "Near Me" search.
 */
export const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

/**
 * Category Seeder: 15+ Professional Categories
 */
const INITIAL_CATEGORIES: Category[] = [
  { id: '1', name: 'Plumbing', slug: 'plumbing', icon_class: 'fa-wrench', color: 'bg-blue-50 text-blue-600' },
  { id: '2', name: 'Electrician', slug: 'electrician', icon_class: 'fa-bolt', color: 'bg-yellow-50 text-yellow-600' },
  { id: '3', name: 'Web Developer', slug: 'web-dev', icon_class: 'fa-code', color: 'bg-indigo-50 text-indigo-600' },
  { id: '4', name: 'Home Cleaner', slug: 'cleaning', icon_class: 'fa-broom', color: 'bg-green-50 text-green-600' },
  { id: '5', name: 'Graphic Designer', slug: 'design', icon_class: 'fa-paint-brush', color: 'bg-purple-50 text-purple-600' },
  { id: '6', name: 'AC Repair', slug: 'ac-repair', icon_class: 'fa-snowflake', color: 'bg-cyan-50 text-cyan-600' },
  { id: '7', name: 'Construction', slug: 'construction', icon_class: 'fa-hammer', color: 'bg-orange-50 text-orange-600' },
  { id: '8', name: 'Gardening', slug: 'gardening', icon_class: 'fa-leaf', color: 'bg-emerald-50 text-emerald-600' },
  { id: '9', name: 'Tutor', slug: 'tutor', icon_class: 'fa-book', color: 'bg-rose-50 text-rose-600' },
  { id: '10', name: 'Carpenter', slug: 'carpenter', icon_class: 'fa-tree', color: 'bg-amber-50 text-amber-600' },
  { id: '11', name: 'Painter', slug: 'painter', icon_class: 'fa-fill-drip', color: 'bg-pink-50 text-pink-600' },
  { id: '12', name: 'Mechanic', slug: 'mechanic', icon_class: 'fa-car', color: 'bg-slate-50 text-slate-600' },
  { id: '13', name: 'Photographer', slug: 'photography', icon_class: 'fa-camera', color: 'bg-teal-50 text-teal-600' },
  { id: '14', name: 'Yoga Instructor', slug: 'yoga', icon_class: 'fa-spa', color: 'bg-lime-50 text-lime-600' },
  { id: '15', name: 'Mobile Repair', slug: 'mobile-repair', icon_class: 'fa-mobile-alt', color: 'bg-violet-50 text-violet-600' },
];

/**
 * Category Service
 */
export const CategoryService = {
  getAll: (): Category[] => INITIAL_CATEGORIES,
  getById: (id: string) => INITIAL_CATEGORIES.find(c => c.id === id),
  getBySlug: (slug: string) => INITIAL_CATEGORIES.find(c => c.slug === slug),
};

/**
 * Auth & User Service
 */
export const AuthService = {
  async register(userData: Partial<User>): Promise<User> {
    const users = this.getUsers();
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: userData.name || '',
      email: userData.email || '',
      role: userData.role || 'guest',
      cnic: userData.cnic || '',
      phone: userData.phone || '',
      latitude: userData.latitude || 0,
      longitude: userData.longitude || 0,
      category_id: userData.category_id,
      is_verified: false,
      bio: '',
      avatar: `https://i.pravatar.cc/150?u=${userData.email}`,
      is_online: true,
      skills: [],
      portfolio: [],
      member_since: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      avg_response: '1 Hour',
    };
    
    users.push(newUser);
    localStorage.setItem(DB_USERS, JSON.stringify(users));
    localStorage.setItem(DB_AUTH, JSON.stringify(newUser));
    return newUser;
  },

  getCurrentUser(): User | null {
    const session = localStorage.getItem(DB_AUTH);
    return session ? JSON.parse(session) : null;
  },

  getUsers(): User[] {
    const data = localStorage.getItem(DB_USERS);
    return data ? JSON.parse(data) : [];
  },

  updateProfile(updatedUser: User): void {
    const users = this.getUsers().map(u => u.id === updatedUser.id ? updatedUser : u);
    localStorage.setItem(DB_USERS, JSON.stringify(users));
    localStorage.setItem(DB_AUTH, JSON.stringify(updatedUser));
  },

  logout(): void {
    localStorage.removeItem(DB_AUTH);
  }
};

/**
 * Profile Service
 */
export const ProfileService = {
  get: async (): Promise<User | null> => AuthService.getCurrentUser(),
};

/**
 * Job Service with Location Filtering
 */
export const JobService = {
  async getAll(): Promise<JobPost[]> {
    const data = localStorage.getItem(DB_JOBS);
    return data ? JSON.parse(data) : [];
  },

  async getNearMe(lat: number, lng: number, radiusKm: number = 10, categoryId?: string): Promise<JobPost[]> {
    const allJobs = await this.getAll();
    return allJobs
      .map(job => ({
        ...job,
        distance_km: calculateDistance(lat, lng, job.lat, job.lng)
      }))
      .filter(job => {
        const inRadius = job.distance_km! <= radiusKm;
        const correctCategory = categoryId ? job.category_id === categoryId : true;
        const isOpen = job.status === 'open';
        return inRadius && correctCategory && isOpen;
      })
      .sort((a, b) => a.distance_km! - b.distance_km!); // Nearest First
  },

  async post(jobData: Partial<JobPost>): Promise<void> {
    const jobs = await this.getAll();
    const currentUser = AuthService.getCurrentUser();
    
    const newJob: JobPost = {
      id: `j-${Date.now()}`,
      client_id: currentUser?.id || 'anonymous',
      category_id: jobData.category_id || '',
      title: jobData.title || '',
      description: jobData.description || '',
      budget: jobData.budget || '$0',
      budget_numeric: jobData.budget_numeric || 0,
      lat: jobData.lat || 0,
      lng: jobData.lng || 0,
      status: 'open',
      posted_at: 'Just now',
      applicants_count: 0
    };

    localStorage.setItem(DB_JOBS, JSON.stringify([newJob, ...jobs]));
  }
};

/**
 * Notification Service
 */
export const NotificationService = {
  async fetch(): Promise<AppNotification[]> {
    const data = localStorage.getItem(DB_NOTIFS);
    return data ? JSON.parse(data) : [];
  },

  async add(notif: AppNotification) {
    const current = await this.fetch();
    localStorage.setItem(DB_NOTIFS, JSON.stringify([notif, ...current]));
  },

  async markAsRead(id: string) {
    const notifs = await this.fetch();
    const updated = notifs.map(n => n.id === id ? { ...n, read: true } : n);
    localStorage.setItem(DB_NOTIFS, JSON.stringify(updated));
  }
};

/**
 * Message Service
 */
export const MessageService = {
  async getThreads(): Promise<ChatThread[]> {
    // Basic mock threads
    return [
      {
        id: 't1',
        participantName: 'Ahmed Khan',
        participantAvatar: 'https://i.pravatar.cc/150?u=ahmed',
        lastMessage: 'Can you start the plumbing job tomorrow?',
        time: '10:30 AM',
        unreadCount: 2,
        messages: []
      }
    ];
  }
};

/**
 * Settings Service
 */
export const SettingsService = {
  get() {
    const data = localStorage.getItem(DB_SETTINGS);
    return data ? JSON.parse(data) : { language: 'English', currency: 'USD' };
  },
  update(settings: any) {
    localStorage.setItem(DB_SETTINGS, JSON.stringify(settings));
  }
};
