
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type"
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Create a Supabase client with the auth context of the current request
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the internship ID from the request
    const { internshipId } = await req.json();

    // Fetch the internship details
    const { data: internship, error: internshipError } = await supabase
      .from("internship_offers")
      .select("*")
      .eq("id", internshipId)
      .single();

    if (internshipError) {
      console.error("Error fetching internship:", internshipError);
      return new Response(
        JSON.stringify({ error: "Error fetching internship" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Get all students with preferences matching this internship
    const { data: studentPreferences, error: preferencesError } = await supabase
      .from("student_internship_preferences")
      .select("*, student:student_id(id, email, full_name)");

    if (preferencesError) {
      console.error("Error fetching student preferences:", preferencesError);
      return new Response(
        JSON.stringify({ error: "Error fetching student preferences" }),
        { 
          status: 400, 
          headers: { ...corsHeaders, "Content-Type": "application/json" } 
        }
      );
    }

    // Find students with matching preferences
    const matchingStudents = studentPreferences.filter(pref => {
      // Check if the industry matches
      const industryMatch = pref.industries && pref.industries.includes(internship.industry);
      
      // Check if the location matches
      const locationMatch = pref.locations && pref.locations.includes(internship.location);
      
      // Check if remote preference matches
      const remoteMatch = pref.is_remote === null || pref.is_remote === internship.is_remote;
      
      // Return true if any criteria matches
      return industryMatch || locationMatch || remoteMatch;
    });

    // Create notifications for matching students
    const notifications = matchingStudents.map(match => ({
      user_id: match.student_id,
      title: "New Internship Opportunity",
      content: `A new internship matching your preferences is available: ${internship.title} at ${internship.company}`,
      type: "internship"
    }));

    if (notifications.length > 0) {
      // Insert notifications into the database
      const { data: notificationData, error: notificationError } = await supabase
        .from("notifications")
        .insert(notifications);

      if (notificationError) {
        console.error("Error creating notifications:", notificationError);
        return new Response(
          JSON.stringify({ error: "Error creating notifications" }),
          { 
            status: 400, 
            headers: { ...corsHeaders, "Content-Type": "application/json" } 
          }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Notified ${notifications.length} students about new internship opportunity` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  } catch (err) {
    console.error("Error in notify-internship function:", err);
    return new Response(
      JSON.stringify({ error: err.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
