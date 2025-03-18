
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
    
    console.log(`Executing ${language} code: ${code.substring(0, 100)}...`);
    
    // For security and resource constraints, we're simulating code execution here
    // In a production environment, you might want to connect to a secure execution service
    let output = "";
    let error = null;
    
    try {
      // Simulate different language execution
      switch(language) {
        case "python":
          // Simulate Python output with basic validation
          if (code.includes("print(")) {
            const match = code.match(/print\("(.+?)"\)/);
            output = match ? match[1] + "\n" : "Hello from Python!\n";
          } else {
            output = "Code executed successfully, but no output was generated.\n";
          }
          break;
        case "javascript":
          // Simulate JavaScript output
          if (code.includes("console.log(")) {
            const match = code.match(/console.log\("(.+?)"\)/);
            output = match ? match[1] + "\n" : "Hello from JavaScript!\n";
          } else {
            output = "Code executed successfully, but no output was generated.\n";
          }
          break;
        case "java":
          if (code.includes("System.out.println(")) {
            const match = code.match(/System.out.println\("(.+?)"\)/);
            output = match ? match[1] + "\n" : "Hello from Java!\n";
          } else {
            output = "Code compiled successfully, but no output was generated.\n";
          }
          break;
        case "c":
        case "cpp":
          if (code.includes("printf(")) {
            const match = code.match(/printf\("(.+?)\\n"/);
            output = match ? match[1] + "\n" : "Hello from C/C++!\n";
          } else {
            output = "Code compiled successfully, but no output was generated.\n";
          }
          break;
        case "php":
          if (code.includes("echo")) {
            const match = code.match(/echo "(.+?)"/);
            output = match ? match[1] + "\n" : "Hello from PHP!\n";
          } else {
            output = "Script executed, but no output was generated.\n";
          }
          break;
        case "sql":
          if (code.toLowerCase().includes("select")) {
            output = "Query executed successfully. Rows returned: 1\n";
            output += "| result |\n";
            output += "|---------|\n";
            output += "| Hello from SQL! |\n";
          } else {
            output = "Query executed successfully. 0 rows affected.\n";
          }
          break;
        default:
          output = `Execution for ${language} is not yet supported.\n`;
      }
    } catch (err) {
      error = `Error during code execution: ${err.message}`;
      console.error(`Execution error:`, err);
    }

    // In a real implementation, you would use an actual execution service
    const result = {
      output: error || output,
      language
    };

    // Return the simulated execution result
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
    console.error('Error in execute-code function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
