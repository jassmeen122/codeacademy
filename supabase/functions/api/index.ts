
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.24.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      headers: corsHeaders,
    });
  }

  // Get the path from the URL
  const url = new URL(req.url);
  const path = url.pathname.replace("/api", "");
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  try {
    // Parse the request body if present
    let body = {};
    if (req.method !== "GET") {
      const contentType = req.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        body = await req.json();
      }
    }

    // Route handling
    if (path === "/courses" && req.method === "GET") {
      const { data, error } = await supabase
        .from("courses")
        .select("*");

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }
    
    if (path === "/courses" && req.method === "POST") {
      const { data, error } = await supabase
        .from("courses")
        .insert(body)
        .select();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 201,
        }
      );
    }

    if (path.match(/\/courses\/\w+/) && req.method === "GET") {
      const id = path.split("/")[2];
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      return new Response(
        JSON.stringify({ success: true, data }),
        {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
          status: 200,
        }
      );
    }

    // Add more routes here as needed

    // Default 404 response for unmatched routes
    return new Response(
      JSON.stringify({ success: false, error: "Not found" }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 404,
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
