
export interface Certificate {
  id: string;
  user_id: string;
  certificate_type: 'course_completion' | 'skill_mastery' | 'full_journey';
  title: string;
  description: string;
  issued_date: string;
  certificate_url?: string;
  verification_code: string;
  skills_covered: string[];
  total_badges_earned: number;
  completion_percentage: number;
}

export interface CertificateTemplate {
  id: string;
  name: string;
  description: string;
  required_badges: number;
  required_skills: string[];
  template_design: string;
  is_active: boolean;
}
