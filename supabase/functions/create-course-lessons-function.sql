
-- Function to get course lessons for multiple modules
CREATE OR REPLACE FUNCTION get_course_lessons_for_modules(module_ids UUID[])
RETURNS SETOF course_lessons
LANGUAGE sql
SECURITY DEFINER
AS $$
  SELECT * FROM course_lessons 
  WHERE module_id = ANY(module_ids)
  ORDER BY order_index;
$$;
