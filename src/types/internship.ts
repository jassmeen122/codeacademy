
export type InternshipStatus = 'open' | 'filled' | 'closed';
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';

export interface InternshipOffer {
  id: string;
  title: string;
  company: string;
  description: string;
  required_skills: string[];
  industry: string;
  location: string;
  is_remote: boolean;
  duration: string;
  start_date: string | null;
  end_date: string | null;
  status: InternshipStatus;
  created_at: string;
  updated_at: string;
}

export interface InternshipApplication {
  id: string;
  internship_id: string;
  student_id: string;
  cv_url: string | null;
  cover_letter_url: string | null;
  motivation_text: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
  internship?: {
    title: string;
    company: string;
  };
  student?: {
    full_name: string | null;
    email: string;
    avatar_url: string | null;
  };
}

export interface StudentInternshipPreferences {
  id: string;
  student_id: string;
  industries: string[];
  locations: string[];
  is_remote: boolean | null;
  created_at: string;
  updated_at: string;
}
