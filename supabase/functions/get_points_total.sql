
-- Function to calculate a user's total points
CREATE OR REPLACE FUNCTION public.get_points_total(user_uuid UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    total INTEGER;
BEGIN
    -- Get the total points from user metrics
    SELECT COALESCE(total_time_spent, 0) INTO total
    FROM user_metrics
    WHERE user_id = user_uuid;
    
    -- If no entry found, return 0
    IF total IS NULL THEN
        total := 0;
    END IF;
    
    RETURN total;
END;
$$;
