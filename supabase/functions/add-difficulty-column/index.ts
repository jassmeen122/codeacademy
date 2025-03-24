
// This edge function will add the difficulty column to the mini_game_scores table

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

    // Check if the difficulty column exists
    const checkColumnSql = `
      SELECT EXISTS (
        SELECT FROM information_schema.columns 
        WHERE table_name = 'mini_game_scores' 
        AND column_name = 'difficulty'
      );
    `;
    
    const checkColumnResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: checkColumnSql,
      }),
    });
    
    const checkColumnResult = await checkColumnResponse.json();
    const columnExists = checkColumnResult[0]?.exists;
    
    if (columnExists) {
      return new Response(
        JSON.stringify({ message: 'Difficulty column already exists' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Add the difficulty column
    const alterTableSql = `
      ALTER TABLE mini_game_scores 
      ADD COLUMN difficulty TEXT DEFAULT 'Beginner';
    `;
    
    const alterTableResponse = await fetch(`${supabaseUrl}/rest/v1/rpc/pg_execute`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`,
        'apikey': supabaseKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: alterTableSql,
      }),
    });
    
    if (!alterTableResponse.ok) {
      const errorData = await alterTableResponse.json();
      throw new Error(`Failed to add difficulty column: ${JSON.stringify(errorData)}`);
    }
    
    return new Response(
      JSON.stringify({ 
        message: 'Successfully added difficulty column to mini_game_scores table' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error('Error in add-difficulty-column function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
