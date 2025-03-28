
export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  content?: string | null;
  order_index: number;
  is_published?: boolean;
  requires_completion?: boolean;
  created_at?: string;
  updated_at?: string;
}
