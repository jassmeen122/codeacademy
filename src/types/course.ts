export type CourseResourceType = "pdf" | "video" | "presentation";

export interface CourseResource {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  type: CourseResourceType;
  course_id: string | null;
  order_index: number;
  created_at: string | null;
}
