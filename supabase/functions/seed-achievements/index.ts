
// This edge function seeds the challenges and badges data

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the access token from the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and service role key are required');
    }

    // Add badges
    const addBadgesSql = `
      INSERT INTO public.badges (name, description, icon, points)
      VALUES 
      ('Débutant', 'Compléter 1 exercice', 'award', 50),
      ('Intermédiaire', 'Compléter 5 exercices', 'zap', 100),
      ('Expert', 'Compléter un cours entier', 'award', 200),
      ('Motivé', 'Coder 3 jours d''affilée', 'flame', 150),
      ('Challengeur', 'Compléter un défi quotidien', 'star', 75),
      ('Pro du Debug', 'Résoudre un exercice sans erreur du premier coup', 'code', 125),
      ('Full Stack Dev', 'Compléter un exercice en Frontend + Backend', 'layers', 250)
      ON CONFLICT DO NOTHING;
    `;
    
    const badgesResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: addBadgesSql,
      }),
    });
    
    if (!badgesResponse.ok) {
      const errorData = await badgesResponse.json();
      throw new Error(`Failed to add badges: ${JSON.stringify(errorData)}`);
    }
    
    // Add challenges
    const addChallengesSql = `
      INSERT INTO public.challenges (title, description, type, points, start_date, end_date)
      VALUES 
      ('Premier pas', 'Compléter 1 exercice', 'daily', 10, NOW(), NOW() + INTERVAL '1 day'),
      ('Apprenti', 'Terminer 5 exercices', 'weekly', 20, NOW(), NOW() + INTERVAL '7 days'),
      ('Maître du Code', 'Compléter 1 cours entier', 'weekly', 30, NOW(), NOW() + INTERVAL '7 days'),
      ('Série en cours', 'Coder 3 jours d''affilée', 'weekly', 15, NOW(), NOW() + INTERVAL '7 days'),
      ('Challenge du Jour', 'Résoudre l''exercice du jour', 'daily', 10, NOW(), NOW() + INTERVAL '1 day'),
      ('Challenge de la Semaine', 'Compléter 3 exercices en 7 jours', 'weekly', 20, NOW(), NOW() + INTERVAL '7 days'),
      ('Défi Pro', 'Écrire un code sans erreur du premier coup', 'weekly', 25, NOW(), NOW() + INTERVAL '7 days'),
      ('Défi Full Stack', 'Compléter un exercice en Frontend + Backend', 'weekly', 30, NOW(), NOW() + INTERVAL '7 days')
      ON CONFLICT DO NOTHING;
    `;
    
    const challengesResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: addChallengesSql,
      }),
    });
    
    if (!challengesResponse.ok) {
      const errorData = await challengesResponse.json();
      throw new Error(`Failed to add challenges: ${JSON.stringify(errorData)}`);
    }
    
    // Set up RLS policies
    const rlsPoliciesSql = `
      -- Enable RLS for challenges table if not already enabled
      ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

      -- Create RLS policy for challenges table if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'challenges' 
          AND policyname = 'Allow challenges read access for all users'
        ) THEN
          CREATE POLICY "Allow challenges read access for all users"
          ON public.challenges
          FOR SELECT
          USING (true);
        END IF;
      END
      $$;

      -- Enable RLS for badges table if not already enabled
      ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;

      -- Create RLS policy for badges table if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'badges' 
          AND policyname = 'Allow badges read access for all users'
        ) THEN
          CREATE POLICY "Allow badges read access for all users"
          ON public.badges
          FOR SELECT
          USING (true);
        END IF;
      END
      $$;

      -- Enable RLS for user_badges table if not already enabled
      ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

      -- Create RLS policy for user_badges table if it doesn't exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'user_badges' 
          AND policyname = 'Users can only view their own badges'
        ) THEN
          CREATE POLICY "Users can only view their own badges"
          ON public.user_badges
          FOR SELECT
          USING (auth.uid() = user_id);
        END IF;
      END
      $$;

      -- Enable RLS for user_challenges table if not already enabled
      ALTER TABLE public.user_challenges ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies for user_challenges table if they don't exist
      DO $$
      BEGIN
        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'user_challenges' 
          AND policyname = 'Users can only view their own challenges'
        ) THEN
          CREATE POLICY "Users can only view their own challenges"
          ON public.user_challenges
          FOR SELECT
          USING (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'user_challenges' 
          AND policyname = 'Users can insert their own challenges'
        ) THEN
          CREATE POLICY "Users can insert their own challenges"
          ON public.user_challenges
          FOR INSERT
          WITH CHECK (auth.uid() = user_id);
        END IF;

        IF NOT EXISTS (
          SELECT FROM pg_policies 
          WHERE tablename = 'user_challenges' 
          AND policyname = 'Users can update their own challenges'
        ) THEN
          CREATE POLICY "Users can update their own challenges"
          ON public.user_challenges
          FOR UPDATE
          USING (auth.uid() = user_id);
        END IF;
      END
      $$;
    `;
    
    const rlsResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: rlsPoliciesSql,
      }),
    });
    
    if (!rlsResponse.ok) {
      const errorData = await rlsResponse.json();
      throw new Error(`Failed to set up RLS policies: ${JSON.stringify(errorData)}`);
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Successfully seeded achievements and challenges data!' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in seed-achievements function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
