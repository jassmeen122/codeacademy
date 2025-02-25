
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { language, code } = await req.json();

    // In a production environment, this would connect to a secure execution service
    // For demo purposes, we'll just simulate code execution
    let output = "";
    
    // Simulate code execution with timeout
    try {
      await Promise.race([
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error("Execution timeout")), 5000)
        ),
        // Here you would integrate with a proper code execution service
        Promise.resolve("Code executed successfully")
      ]);
      
      output = "Code executed successfully\nOutput: Hello, World!";
    } catch (error) {
      output = `Error: ${error.message}`;
    }

    return new Response(
      JSON.stringify({ output }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
