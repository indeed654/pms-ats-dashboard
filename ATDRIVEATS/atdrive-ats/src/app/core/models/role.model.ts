export enum UserRole {
  ADMIN = 'admin',
  RECRUITER = 'recruiter',
  INTERVIEWER = 'interviewer',
  CANDIDATE = 'candidate'
}

export interface RoleRouteConfig {
  allowedRoles: UserRole[];
  redirectTo: string;
}

export const ROLE_ROUTES: Record<string, RoleRouteConfig> = {
  '/app/admin/dashboard': { allowedRoles: [UserRole.ADMIN], redirectTo: '/app/admin/dashboard' },
  '/app/recruiter/dashboard': { allowedRoles: [UserRole.RECRUITER], redirectTo: '/app/recruiter/dashboard' },
  '/app/interviewer/dashboard': { allowedRoles: [UserRole.INTERVIEWER], redirectTo: '/app/interviewer/dashboard' },
  '/app/candidate/dashboard': { allowedRoles: [UserRole.CANDIDATE], redirectTo: '/app/candidate/dashboard' },
  '/app/jobs': { allowedRoles: [UserRole.ADMIN, UserRole.RECRUITER], redirectTo: '/app/dashboard' },
  '/app/candidates': { allowedRoles: [UserRole.ADMIN, UserRole.RECRUITER], redirectTo: '/app/dashboard' },
  '/app/interviews': { allowedRoles: [UserRole.ADMIN, UserRole.RECRUITER, UserRole.INTERVIEWER], redirectTo: '/app/dashboard' },
  '/app/activity': { allowedRoles: [UserRole.ADMIN], redirectTo: '/app/dashboard' },
  '/app/settings': { allowedRoles: [UserRole.ADMIN], redirectTo: '/app/dashboard' },
  '/app/ai/jd-generator': { allowedRoles: [UserRole.ADMIN, UserRole.RECRUITER], redirectTo: '/app/dashboard' },
  '/app/profile': { allowedRoles: [UserRole.ADMIN, UserRole.RECRUITER, UserRole.INTERVIEWER, UserRole.CANDIDATE], redirectTo: '/app/dashboard' }
};

export const ROLE_DASHBOARDS: Record<UserRole, string> = {
  [UserRole.ADMIN]: '/app/admin/dashboard',
  [UserRole.RECRUITER]: '/app/recruiter/dashboard',
  [UserRole.INTERVIEWER]: '/app/interviewer/dashboard',
  [UserRole.CANDIDATE]: '/app/candidate/dashboard'
};

export const ROLE_NAMES: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.RECRUITER]: 'Recruiter',
  [UserRole.INTERVIEWER]: 'Interviewer',
  [UserRole.CANDIDATE]: 'Candidate'
};