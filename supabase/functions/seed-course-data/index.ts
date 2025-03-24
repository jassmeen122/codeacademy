
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

interface Badge {
  name: string;
  description: string;
  icon: string;
  points: number;
}

interface Challenge {
  title: string;
  description: string;
  type: 'daily' | 'weekly';
  points: number;
  start_date: string;
  end_date: string;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  try {
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default when deployed to Supabase
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default when deployed to Supabase
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    );

    // Insert badges if they don't exist
    const badges: Badge[] = [
      {
        name: 'First Step',
        description: 'Completed your first module',
        icon: 'award',
        points: 100,
      },
      {
        name: 'Code Novice',
        description: 'Completed 5 modules',
        icon: 'code',
        points: 250, 
      },
      {
        name: 'Skilled Coder',
        description: 'Completed 10 modules',
        icon: 'code',
        points: 500,
      },
      {
        name: 'Code Master',
        description: 'Completed all modules for a language',
        icon: 'award',
        points: 1000,
      },
      {
        name: 'Quiz Ace',
        description: 'Achieved 100% on 5 quizzes',
        icon: 'zap',
        points: 300,
      },
      {
        name: 'Challenge Champion',
        description: 'Completed 10 daily challenges',
        icon: 'trophy',
        points: 500,
      },
      {
        name: 'Social Learner',
        description: 'Joined the community and made first post',
        icon: 'users',
        points: 150,
      },
      {
        name: 'Consistent Learner',
        description: 'Completed at least one module every day for a week',
        icon: 'target',
        points: 400,
      }
    ];

    for (const badge of badges) {
      const { data: existingBadge } = await supabaseClient
        .from('badges')
        .select('id')
        .eq('name', badge.name)
        .maybeSingle();

      if (!existingBadge) {
        await supabaseClient.from('badges').insert([badge]);
      }
    }

    // Create some example challenges
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);

    const challenges: Challenge[] = [
      {
        title: 'Hello World Challenge',
        description: 'Create a simple "Hello World" program in any language of your choice',
        type: 'daily',
        points: 50,
        start_date: today.toISOString(),
        end_date: tomorrow.toISOString(),
      },
      {
        title: 'Array Sorting Challenge',
        description: 'Implement a function to sort an array of integers without using built-in sort functions',
        type: 'daily',
        points: 100,
        start_date: today.toISOString(),
        end_date: tomorrow.toISOString(),
      },
      {
        title: 'Weekly Coding Marathon',
        description: 'Complete at least 5 modules in any programming language this week',
        type: 'weekly',
        points: 300,
        start_date: today.toISOString(),
        end_date: nextWeek.toISOString(),
      },
      {
        title: 'Algorithm Master Challenge',
        description: 'Solve three algorithmic problems of increasing difficulty',
        type: 'weekly',
        points: 500,
        start_date: today.toISOString(),
        end_date: nextWeek.toISOString(),
      }
    ];

    // Only insert challenges if none exist
    const { count: challengeCount } = await supabaseClient
      .from('challenges')
      .select('*', { count: 'exact', head: true });

    if (challengeCount === 0) {
      await supabaseClient.from('challenges').insert(challenges);
    }

    // Create a function to increment user points if it doesn't exist
    const checkFunction = await supabaseClient.rpc('function_exists', { 
      function_name: 'increment_user_points' 
    });
    
    if (!checkFunction.data) {
      // Create the function using SQL query
      await supabaseClient.rpc('execute_sql', {
        sql_query: `
        CREATE OR REPLACE FUNCTION increment_user_points(user_id UUID, points_to_add INT)
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          UPDATE profiles
          SET points = COALESCE(points, 0) + points_to_add
          WHERE id = user_id;
        END;
        $$;
        `
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Successfully seeded badges and challenges',
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 200,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
        status: 400,
      }
    );
  }
});
