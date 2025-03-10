
export interface TeacherProfile {
  id: string;
  full_name: string | null;
  email: string;
  bio: string | null;
  specialization: string | null;
  avatar_url: string | null;
  role: 'teacher';
}

export interface ThemeSettings {
  colorTheme: 'blue' | 'purple' | 'green' | 'dark';
}

export interface NotificationSettings {
  emailNotifications: boolean;
  assignmentNotifications: boolean;
  discussionNotifications: boolean;
}

export interface SecuritySettings {
  twoFactorAuth: boolean;
}
