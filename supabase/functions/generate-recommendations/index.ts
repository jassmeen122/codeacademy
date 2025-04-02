
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.21.0'

interface Course {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  path: string;
  category: string;
}

interface UserActivity {
  id: string;
  user_id: string;
  activity_type: string;
  course_id: string | null;
  activity_data: Record<string, any>;
  created_at: string;
}

interface UserRecommendation {
  user_id: string;
  recommendation_type: string;
  item_id: string;
  relevance_score: number;
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create a Supabase client with the Admin key
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    )

    // Get request data
    const { userId } = await req.json()

    if (!userId) {
      return new Response(
        JSON.stringify({ error: 'User ID is required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      )
    }

    // Fetch user activity data
    const { data: activityData, error: activityError } = await supabaseAdmin
      .from('user_activity')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(50)

    if (activityError) {
      console.error('Error fetching user activity:', activityError)
      throw activityError
    }

    // Fetch all courses
    const { data: courses, error: coursesError } = await supabaseAdmin
      .from('courses')
      .select('id, title, description, difficulty, path, category')

    if (coursesError) {
      console.error('Error fetching courses:', coursesError)
      throw coursesError
    }

    // Generate recommendations
    const recommendations = generateRecommendations(userId, activityData || [], courses || [])

    // Delete existing recommendations for this user
    const { error: deleteError } = await supabaseAdmin
      .from('user_recommendations')
      .delete()
      .eq('user_id', userId)

    if (deleteError) {
      console.error('Error deleting existing recommendations:', deleteError)
      throw deleteError
    }

    // Insert new recommendations if we have any
    if (recommendations.length > 0) {
      const { error: insertError } = await supabaseAdmin
        .from('user_recommendations')
        .insert(recommendations)

      if (insertError) {
        console.error('Error inserting recommendations:', insertError)
        throw insertError
      }
    }

    return new Response(
      JSON.stringify({ success: true, count: recommendations.length }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('Error generating recommendations:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})

/**
 * Generate course recommendations based on user activity
 */
function generateRecommendations(
  userId: string, 
  activities: UserActivity[], 
  courses: Course[]
): UserRecommendation[] {
  // If no courses or activities, return empty array
  if (!courses.length || !activities.length) {
    return []
  }

  // Get courses the user has interacted with
  const viewedCourseIds = new Set(
    activities
      .filter(a => a.activity_type === 'course_view' && a.course_id)
      .map(a => a.course_id)
  )

  // Count course views by category and path
  const categoryCount: Record<string, number> = {}
  const pathCount: Record<string, number> = {}
  const difficultyCount: Record<string, number> = {}

  // Get courses the user has viewed
  const viewedCourses = courses.filter(c => viewedCourseIds.has(c.id))

  // Count preferences
  viewedCourses.forEach(course => {
    categoryCount[course.category] = (categoryCount[course.category] || 0) + 1
    pathCount[course.path] = (pathCount[course.path] || 0) + 1
    difficultyCount[course.difficulty] = (difficultyCount[course.difficulty] || 0) + 1
  })

  // Find total counts for normalization
  const totalCategoryCount = Object.values(categoryCount).reduce((a, b) => a + b, 0)
  const totalPathCount = Object.values(pathCount).reduce((a, b) => a + b, 0)
  const totalDifficultyCount = Object.values(difficultyCount).reduce((a, b) => a + b, 0)

  // Calculate normalized preferences
  const categoryPref = Object.fromEntries(
    Object.entries(categoryCount).map(([k, v]) => [k, v / totalCategoryCount])
  )
  const pathPref = Object.fromEntries(
    Object.entries(pathCount).map(([k, v]) => [k, v / totalPathCount])
  )
  const difficultyPref = Object.fromEntries(
    Object.entries(difficultyCount).map(([k, v]) => [k, v / totalDifficultyCount])
  )

  // Score each course the user hasn't viewed
  const recommendations = courses
    .filter(course => !viewedCourseIds.has(course.id))
    .map(course => {
      // Calculate score based on preferences
      const categoryScore = categoryPref[course.category] || 0
      const pathScore = pathPref[course.path] || 0
      const difficultyScore = difficultyPref[course.difficulty] || 0

      // Weight the different factors (can be adjusted)
      const relevanceScore = (
        categoryScore * 0.4 + 
        pathScore * 0.4 + 
        difficultyScore * 0.2
      ) 
      
      return {
        user_id: userId,
        recommendation_type: 'course',
        item_id: course.id,
        relevance_score: relevanceScore || 0.1 // Minimum score
      }
    })
    .sort((a, b) => b.relevance_score - a.relevance_score)
    .slice(0, 10) // Keep top 10 recommendations

  return recommendations
}
