
// This edge function handles various gamification features
// including points, challenges, badges, and certificates

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, endpoint, period',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('Authorization header is required');
    }

    const endpoint = req.headers.get('endpoint') || '';
    console.log(`Processing ${endpoint} request`);
    
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get the JWT token from the Authorization header
    const token = authHeader.replace('Bearer ', '');
    
    // Verify the token and get the user
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      throw new Error('Invalid token or user not found');
    }
    
    console.log(`User authenticated: ${user.id}`);
    
    // Process based on the endpoint
    if (endpoint === 'add-points') {
      console.log('Adding points...');
      // Handle adding points
      const { points } = await req.json();
      
      if (!points || typeof points !== 'number') {
        throw new Error('Points value is required and must be a number');
      }
      
      console.log(`Adding ${points} points to user ${user.id}`);
      
      // Call the function to update user points
      const { data, error } = await supabase.rpc('update_user_points', {
        user_uuid: user.id,
        points_to_add: points
      });
      
      if (error) {
        console.error('Error updating points:', error);
        throw error;
      }
      
      console.log('Points added successfully');
      
      // Check if any new badges were earned
      const { data: newBadges, error: badgeError } = await supabase.rpc('check_and_award_badges', {
        user_uuid: user.id
      });
      
      if (badgeError) {
        console.error('Error checking badges:', badgeError);
        throw badgeError;
      }
      
      console.log(`Checked for badges. New badges: ${newBadges?.length || 0}`);
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          pointsAdded: points,
          newBadges: newBadges
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } 
    else if (endpoint === 'update-challenge') {
      console.log('Updating challenge...');
      // Handle updating challenge progress
      const { challenge_id, progress, target, completed } = await req.json();
      
      if (!challenge_id) {
        throw new Error('Challenge ID is required');
      }
      
      console.log(`Updating challenge ${challenge_id} for user ${user.id}: progress=${progress}, completed=${completed}`);
      
      // Update the challenge progress
      const { data, error } = await supabase
        .from('user_daily_challenges')
        .update({ 
          current_progress: progress,
          completed: completed,
          completed_at: completed ? new Date().toISOString() : null
        })
        .eq('id', challenge_id)
        .eq('user_id', user.id)
        .select();
        
      if (error) {
        console.error('Error updating challenge:', error);
        throw error;
      }
      
      console.log('Challenge updated successfully');
      
      let pointsAwarded = 0;
      
      // Award points if the challenge is completed
      if (completed && data && data.length > 0) {
        pointsAwarded = data[0].reward_xp || 0;
        
        if (pointsAwarded > 0) {
          console.log(`Awarding ${pointsAwarded} points for completing challenge`);
          // Update user points
          const { error: pointsError } = await supabase.rpc('update_user_points', {
            user_uuid: user.id,
            points_to_add: pointsAwarded
          });
          
          if (pointsError) {
            console.error('Error updating points:', pointsError);
            throw pointsError;
          }
          
          console.log('Points awarded successfully');
        }
      }
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          pointsAwarded,
          challenge: data ? data[0] : null
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else if (endpoint === 'generate-certificate') {
      // Generate a certificate for course completion
      const { course_id, course_title } = await req.json();
      
      // Check if the user already has a certificate for this course
      const { data: existingCert, error: certCheckError } = await supabase
        .from('user_certificates')
        .select('id')
        .eq('user_id', user.id)
        .eq('course_id', course_id)
        .maybeSingle();
        
      if (certCheckError) throw certCheckError;
      
      // If certificate already exists, return it
      if (existingCert) {
        return new Response(
          JSON.stringify({ 
            success: true, 
            alreadyExists: true,
            certificate_id: existingCert.id
          }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Create a new certificate
      const { data: newCert, error: createError } = await supabase
        .from('user_certificates')
        .insert({
          user_id: user.id,
          course_id: course_id,
          title: `Certificat de réussite: ${course_title}`,
          description: `Ce certificat atteste que l'utilisateur a complété avec succès le cours ${course_title}.`,
          // We could generate a real PDF certificate here and store it in storage
          certificate_url: null
        })
        .select()
        .single();
        
      if (createError) throw createError;
      
      // Award points for completing a course
      const courseCompletionPoints = 100;
      const { error: pointsError } = await supabase.rpc('update_user_points', {
        user_uuid: user.id,
        points_to_add: courseCompletionPoints
      });
      
      if (pointsError) throw pointsError;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          alreadyExists: false,
          certificate: newCert,
          pointsAwarded: courseCompletionPoints
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else if (endpoint === 'get-leaderboard') {
      // Get the leaderboard data
      const period = req.headers.get('period') || 'global';
      
      let leaderboardData;
      let leaderboardError;
      
      if (period === 'weekly') {
        // Get weekly leaderboard
        const { data, error } = await supabase
          .from('user_points')
          .select(`
            user_id,
            weekly_points,
            profiles:user_id (
              full_name,
              avatar_url
            )
          `)
          .order('weekly_points', { ascending: false })
          .limit(10);
          
        leaderboardData = data;
        leaderboardError = error;
      } else {
        // Get global leaderboard
        const { data, error } = await supabase
          .from('profiles')
          .select('id, full_name, avatar_url, points')
          .order('points', { ascending: false })
          .limit(10);
          
        leaderboardData = data;
        leaderboardError = error;
      }
      
      if (leaderboardError) throw leaderboardError;
      
      return new Response(
        JSON.stringify({ 
          success: true, 
          leaderboard: leaderboardData,
          period
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    else {
      throw new Error('Invalid endpoint specified');
    }
  } catch (error) {
    console.error('Error in gamification function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
