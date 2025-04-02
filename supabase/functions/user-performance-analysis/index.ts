
import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.24.0";

interface UserPerformanceData {
  userId: string;
  siteGenerationTime?: number;
  responseTime?: number;
  pagesCreated?: number;
  interactionsCount?: number;
  sessionDuration?: number;
}

interface UserRecommendation {
  userId: string;
  recommendationType: string;
  itemId?: string;
  relevanceScore?: number;
}

serve(async (req) => {
  try {
    // Create a Supabase client with the service role key
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Parse the request body
    const { data } = await req.json();
    const { action, userId, performanceData } = data;

    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Handle different actions
    switch (action) {
      case "record_performance":
        return await recordPerformance(supabase, userId, performanceData);
      
      case "generate_recommendations":
        return await generateRecommendations(supabase, userId);
      
      case "get_analysis":
        return await getAnalysis(supabase, userId);
      
      default:
        return new Response(
          JSON.stringify({ error: "Invalid action" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }
  } catch (error) {
    console.error("Error:", error.message);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});

// Record performance metrics
async function recordPerformance(supabase, userId: string, performanceData: UserPerformanceData) {
  try {
    const { data, error } = await supabase
      .from('user_performance_metrics')
      .insert({
        user_id: userId,
        site_generation_time: performanceData.siteGenerationTime,
        response_time: performanceData.responseTime,
        pages_created: performanceData.pagesCreated,
        interactions_count: performanceData.interactionsCount,
        session_duration: performanceData.sessionDuration
      });

    if (error) throw error;

    return new Response(
      JSON.stringify({ success: true, data }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error recording performance:", error.message);
    throw error;
  }
}

// Generate personalized recommendations for a user
async function generateRecommendations(supabase, userId: string) {
  try {
    // 1. Get user's recent activities
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);

    if (activitiesError) throw activitiesError;

    // 2. Analyze activities and generate recommendations
    const recommendations: UserRecommendation[] = [];
    
    // Sample recommendation logic (simplified for demo purposes)
    // In a real app, you'd use more sophisticated algorithms
    
    // Check if user has been focusing on a specific area
    const activityTypes = activities.map(a => a.activity_type);
    const uniqueActivityTypes = [...new Set(activityTypes)];
    
    // Course recommendations based on most frequent activities
    if (activityTypes.includes('code_exercise_completed')) {
      recommendations.push({
        userId,
        recommendationType: 'course',
        itemId: 'advanced-coding-patterns',
        relevanceScore: 0.85
      });
    }
    
    if (activityTypes.includes('video_watched')) {
      recommendations.push({
        userId,
        recommendationType: 'course',
        itemId: 'video-based-learning-track',
        relevanceScore: 0.9
      });
    }
    
    // Practice recommendations
    if (uniqueActivityTypes.length < 5) {
      // User has limited activity variety - recommend diversification
      recommendations.push({
        userId,
        recommendationType: 'practice',
        itemId: 'diversify-learning-methods',
        relevanceScore: 0.8
      });
    }
    
    // Study plan optimization
    const timeActivities = activities.filter(a => 
      a.activity_type === 'learning_session' || 
      a.activity_type === 'practice_session'
    );
    
    if (timeActivities.length > 0) {
      const averageDuration = timeActivities.reduce(
        (sum, a) => sum + (a.activity_data?.duration_minutes || 0), 0
      ) / timeActivities.length;
      
      if (averageDuration < 30) {
        recommendations.push({
          userId,
          recommendationType: 'study',
          itemId: 'longer-focused-sessions',
          relevanceScore: 0.75
        });
      } else if (timeActivities.length <= 2 && activities.length > 10) {
        recommendations.push({
          userId,
          recommendationType: 'study',
          itemId: 'more-frequent-practice',
          relevanceScore: 0.85
        });
      }
    }
    
    // 3. Store recommendations in the database
    if (recommendations.length > 0) {
      const formattedRecs = recommendations.map(rec => ({
        user_id: rec.userId,
        recommendation_type: rec.recommendationType,
        item_id: rec.itemId || null,
        relevance_score: rec.relevanceScore || 0.5
      }));
      
      const { error: insertError } = await supabase
        .from('user_recommendations')
        .insert(formattedRecs);
      
      if (insertError) throw insertError;
    }
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        recommendations_count: recommendations.length 
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error generating recommendations:", error.message);
    throw error;
  }
}

// Get performance analysis for a user
async function getAnalysis(supabase, userId: string) {
  try {
    // Get metrics
    const { data: metrics, error: metricsError } = await supabase
      .from('user_performance_metrics')
      .select('*')
      .eq('user_id', userId)
      .order('recorded_at', { ascending: false })
      .limit(30);
    
    if (metricsError) throw metricsError;
    
    // Get activities
    const { data: activities, error: activitiesError } = await supabase
      .from('user_activities')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (activitiesError) throw activitiesError;
    
    // Get progress report
    const { data: progressReport, error: progressError } = await supabase
      .from('user_progress_reports')
      .select('*')
      .eq('user_id', userId)
      .single();
    
    if (progressError && progressError.code !== 'PGRST116') throw progressError;
    
    // Calculate summary stats
    const analysis = {
      total_learning_time: 0,
      average_response_time: 0,
      most_active_day: null,
      completion_rate: progressReport?.completion_percentage || 0,
      skill_focus_areas: {} as Record<string, number>,
    };
    
    // Calculate total learning time
    analysis.total_learning_time = metrics.reduce(
      (sum, m) => sum + (m.session_duration || 0), 0
    );
    
    // Calculate average response time
    const responseTimes = metrics
      .filter(m => m.response_time !== null)
      .map(m => m.response_time);
    
    if (responseTimes.length > 0) {
      analysis.average_response_time = 
        responseTimes.reduce((sum, time) => sum + (time || 0), 0) / responseTimes.length;
    }
    
    // Determine most active day
    if (activities.length > 0) {
      const dayCountMap = activities.reduce((map, activity) => {
        const day = new Date(activity.created_at).toLocaleDateString('en-US', { weekday: 'long' });
        map[day] = (map[day] || 0) + 1;
        return map;
      }, {} as Record<string, number>);
      
      analysis.most_active_day = Object.entries(dayCountMap)
        .sort((a, b) => b[1] - a[1])[0][0];
    }
    
    // Identify skill focus areas
    activities.forEach(activity => {
      if (activity.activity_data?.skill) {
        const skill = activity.activity_data.skill;
        analysis.skill_focus_areas[skill] = (analysis.skill_focus_areas[skill] || 0) + 1;
      }
    });
    
    return new Response(
      JSON.stringify({ success: true, analysis }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error getting analysis:", error.message);
    throw error;
  }
}
