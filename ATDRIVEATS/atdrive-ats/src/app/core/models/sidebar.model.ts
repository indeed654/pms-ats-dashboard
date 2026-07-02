import { UserRole } from '../models/role.model';

export interface SidebarItem {
  label?: string;
  path?: string;
  icon?: string;
  roles?: UserRole[];
  active?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  external?: boolean;
  badge?: string;
  badgeType?: 'primary' | 'success' | 'warning' | 'danger';
  separator?: boolean;
  children?: SidebarItem[];
}

export const ROLE_SIDEBAR_ITEMS: Record<UserRole, SidebarItem[]> = {
  [UserRole.ADMIN]: [
    { 
      label: 'Dashboard', 
      path: '/app/admin/dashboard', 
      icon: 'dashboard', 
      roles: [UserRole.ADMIN] 
    },
    { 
      label: 'Users', 
      path: '/app/users', 
      icon: 'people', 
      roles: [UserRole.ADMIN],
      badge: '5',
      badgeType: 'primary'
    },
    { 
      label: 'Jobs', 
      path: '/app/jobs', 
      icon: 'work', 
      roles: [UserRole.ADMIN],
      badge: '24',
      badgeType: 'success'
    },
    { 
      label: 'Candidates', 
      path: '/app/candidates', 
      icon: 'group', 
      roles: [UserRole.ADMIN],
      badge: '156',
      badgeType: 'warning'
    },
    { 
      label: 'Interviews', 
      path: '/app/interviews', 
      icon: 'calendar_today', 
      roles: [UserRole.ADMIN],
      badge: '42',
      badgeType: 'primary'
    },
    { 
      label: 'Reports', 
      path: '/app/reports', 
      icon: 'insights', 
      roles: [UserRole.ADMIN] 
    },
    { 
      label: 'Activity', 
      path: '/app/activity', 
      icon: 'trending_up', 
      roles: [UserRole.ADMIN] 
    },
    { separator: true },
    { 
      label: 'Settings', 
      path: '/app/settings', 
      icon: 'settings', 
      roles: [UserRole.ADMIN] 
    },
    { 
      label: 'Profile', 
      path: '/app/profile', 
      icon: 'person', 
      roles: [UserRole.ADMIN] 
    }
  ],
  
  [UserRole.RECRUITER]: [
    { 
      label: 'Dashboard', 
      path: '/app/recruiter/dashboard', 
      icon: 'dashboard', 
      roles: [UserRole.RECRUITER] 
    },
    { 
      label: 'Jobs', 
      path: '/app/jobs', 
      icon: 'work', 
      roles: [UserRole.RECRUITER],
      badge: '24',
      badgeType: 'success'
    },
    { 
      label: 'Candidates', 
      path: '/app/candidates', 
      icon: 'group', 
      roles: [UserRole.RECRUITER],
      badge: '156',
      badgeType: 'warning'
    },
    { 
      label: 'Interviews', 
      path: '/app/interviews', 
      icon: 'calendar_today', 
      roles: [UserRole.RECRUITER],
      badge: '42',
      badgeType: 'primary'
    },
    { 
      label: 'AI JD Generator', 
      path: '/app/ai/jd-generator', 
      icon: 'smart_toy', 
      roles: [UserRole.RECRUITER] 
    },
    { 
      label: 'Reports', 
      path: '/app/reports', 
      icon: 'insights', 
      roles: [UserRole.RECRUITER] 
    },
    { separator: true },
    { 
      label: 'Profile', 
      path: '/app/profile', 
      icon: 'person', 
      roles: [UserRole.RECRUITER] 
    }
  ],
  
  [UserRole.INTERVIEWER]: [
    { 
      label: 'Dashboard', 
      path: '/app/interviewer/dashboard', 
      icon: 'dashboard', 
      roles: [UserRole.INTERVIEWER] 
    },
    { 
      label: 'My Interviews', 
      path: '/app/interviews', 
      icon: 'calendar_today', 
      roles: [UserRole.INTERVIEWER],
      badge: '8',
      badgeType: 'primary'
    },
    { 
      label: 'Feedback', 
      path: '/app/feedback', 
      icon: 'rate_review', 
      roles: [UserRole.INTERVIEWER],
      badge: '3',
      badgeType: 'warning'
    },
    { 
      label: 'Candidates', 
      path: '/app/candidates', 
      icon: 'group', 
      roles: [UserRole.INTERVIEWER] 
    },
    { separator: true },
    { 
      label: 'Profile', 
      path: '/app/profile', 
      icon: 'person', 
      roles: [UserRole.INTERVIEWER] 
    }
  ],
  
  [UserRole.CANDIDATE]: [
    { 
      label: 'Dashboard', 
      path: '/app/candidate/dashboard', 
      icon: 'dashboard', 
      roles: [UserRole.CANDIDATE] 
    },
    { 
      label: 'My Applications', 
      path: '/app/applications', 
      icon: 'description', 
      roles: [UserRole.CANDIDATE],
      badge: '5',
      badgeType: 'primary'
    },
    { 
      label: 'Interviews', 
      path: '/app/interviews', 
      icon: 'event', 
      roles: [UserRole.CANDIDATE],
      badge: '2',
      badgeType: 'success'
    },
    { 
      label: 'Job Search', 
      path: '/app/jobs', 
      icon: 'search', 
      roles: [UserRole.CANDIDATE] 
    },
    { separator: true },
    { 
      label: 'Profile', 
      path: '/app/profile', 
      icon: 'person', 
      roles: [UserRole.CANDIDATE] 
    },
    { 
      label: 'Settings', 
      path: '/app/settings', 
      icon: 'settings', 
      roles: [UserRole.CANDIDATE] 
    }
  ]
};

export const getSidebarItemsForRole = (role: UserRole): SidebarItem[] => {
  return ROLE_SIDEBAR_ITEMS[role] || [];
};

export const getAllowedRoutesForRole = (role: UserRole): string[] => {
  const items = getSidebarItemsForRole(role);
  return items.filter(item => item.path).map(item => item.path!);
};