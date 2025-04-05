
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !serviceRoleKey) {
      throw new Error('Missing environment variables for Supabase');
    }
    
    const supabaseAdmin = createClient(supabaseUrl, serviceRoleKey);
    
    // Get the JWT token from the request
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Missing Authorization header');
    }
    
    // Extract the token without the "Bearer " prefix
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: userError } = await supabaseAdmin.auth.getUser(token);
    
    if (userError || !user) {
      throw new Error('Invalid token or user not found');
    }
    
    // Parse request URL to get the endpoint path
    const url = new URL(req.url);
    const endpoint = url.pathname.split('/').pop();
    
    // Parse request body if it exists
    let requestBody = null;
    if (req.method !== 'GET') {
      try {
        requestBody = await req.json();
      } catch (e) {
        // No body or invalid JSON
      }
    }
    
    let result: any = null;
    
    // Handle different API endpoints
    switch (endpoint) {
      case 'add-points':
        // Add points to user
        if (!requestBody || typeof requestBody.points !== 'number') {
          throw new Error('Missing or invalid points value');
        }
        
        const { data: pointsData, error: pointsError } = await supabaseAdmin.rpc(
          'update_user_points',
          { 
            user_uuid: user.id, 
            points_to_add: requestBody.points
          }
        );
        
        if (pointsError) throw pointsError;
        
        // Check for new badges
        const { data: badgesData, error: badgesError } = await supabaseAdmin.rpc(
          'check_and_award_badges',
          { user_uuid: user.id }
        );
        
        if (badgesError) throw badgesError;
        
        result = {
          success: true,
          pointsAdded: requestBody.points,
          newBadges: badgesData || []
        };
        break;
        
      case 'update-challenge':
        // Update challenge progress
        if (!requestBody || !requestBody.challenge_id || typeof requestBody.progress !== 'number') {
          throw new Error('Missing or invalid challenge update data');
        }
        
        const { data: challengeData, error: challengeError } = await supabaseAdmin
          .from('user_daily_challenges')
          .update({
            current_progress: requestBody.progress,
            completed: requestBody.progress >= requestBody.target,
            completed_at: requestBody.progress >= requestBody.target ? new Date().toISOString() : null
          })
          .eq('id', requestBody.challenge_id)
          .eq('user_id', user.id)
          .select()
          .single();
          
        if (challengeError) throw challengeError;
        
        // If challenge is completed, award XP
        if (challengeData && challengeData.completed && !requestBody.completed) {
          await supabaseAdmin.rpc(
            'update_user_points',
            { 
              user_uuid: user.id, 
              points_to_add: challengeData.reward_xp
            }
          );
          
          result = {
            success: true,
            challenge: challengeData,
            pointsAwarded: challengeData.reward_xp
          };
        } else {
          result = {
            success: true,
            challenge: challengeData
          };
        }
        break;
        
      case 'generate-certificate':
        // Generate certificate for a course
        if (!requestBody || !requestBody.course_id || !requestBody.course_title) {
          throw new Error('Missing or invalid certificate data');
        }
        
        // Check if certificate already exists
        const { data: existingCert, error: certQueryError } = await supabaseAdmin
          .from('user_certificates')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', requestBody.course_id)
          .maybeSingle();
          
        if (certQueryError) throw certQueryError;
        
        if (existingCert) {
          result = {
            success: true,
            certificateId: existingCert.id,
            alreadyExists: true
          };
        } else {
          // Create a new certificate
          const { data: newCert, error: newCertError } = await supabaseAdmin
            .from('user_certificates')
            .insert({
              user_id: user.id,
              course_id: requestBody.course_id,
              title: `Certificat: ${requestBody.course_title}`,
              description: `Ce certificat atteste que l'utilisateur a complété avec succès le cours "${requestBody.course_title}"`,
              certificate_url: null // Would generate an actual certificate URL in production
            })
            .select()
            .single();
            
          if (newCertError) throw newCertError;
          
          // Award XP for completing a course
          await supabaseAdmin.rpc(
            'update_user_points',
            { 
              user_uuid: user.id, 
              points_to_add: 100 // Award 100 XP for course completion
            }
          );
          
          result = {
            success: true,
            certificateId: newCert.id,
            pointsAwarded: 100
          };
        }
        break;
        
      case 'get-leaderboard':
        // Get global or weekly leaderboard
        const period = url.searchParams.get('period') || 'global';
        
        let leaderboardQuery = supabaseAdmin
          .from('profiles')
          .select('id, full_name, avatar_url, points')
          .order('points', { ascending: false })
          .limit(10);
          
        if (period === 'weekly') {
          // For weekly leaderboard, use user_points instead
          leaderboardQuery = supabaseAdmin
            .from('user_points')
            .select('user_id, weekly_points, profiles:user_id(full_name, avatar_url)')
            .order('weekly_points', { ascending: false })
            .limit(10);
        }
        
        const { data: leaderboardData, error: leaderboardError } = await leaderboardQuery;
        
        if (leaderboardError) throw leaderboardError;
        
        result = {
          success: true,
          leaderboard: leaderboardData
        };
        break;
        
      default:
        throw new Error(`Unknown endpoint: ${endpoint}`);
    }
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
    
  } catch (error) {
    console.error(`Error processing request:`, error.message);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        status: 400,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      }
    );
  }
});
