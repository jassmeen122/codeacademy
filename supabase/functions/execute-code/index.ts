
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
    
    let output = "";
    let error = null;
    
    // Use Deno's built-in capabilities to execute JavaScript code
    if (language === "javascript") {
      try {
        // For JavaScript, we can use Deno's eval
        const result = await executeJavaScript(code);
        output = result;
      } catch (err) {
        error = `JavaScript execution error: ${err.message}`;
      }
    } else {
      // For other languages, we'll use a real execution service
      // Here we're using a direct approach with Deno capabilities
      try {
        const result = await executeCode(code, language);
        output = result;
      } catch (err) {
        error = `Execution error for ${language}: ${err.message}`;
      }
    }

    // Return the execution result
    const result = {
      output: error || output,
      language
    };

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

// Function to execute JavaScript code using Deno
async function executeJavaScript(code) {
  const consoleOutput = [];
  
  // Create a custom console.log implementation to capture output
  const originalConsoleLog = console.log;
  console.log = (...args) => {
    consoleOutput.push(args.map(arg => String(arg)).join(' '));
    originalConsoleLog(...args);
  };
  
  try {
    // Execute the code and capture any result
    const result = await eval(`(async () => { ${code} })()`);
    
    // Restore the original console.log
    console.log = originalConsoleLog;
    
    // Return both console output and any result
    return consoleOutput.join('\n') + (result !== undefined ? `\n${result}` : '');
  } catch (error) {
    // Restore the original console.log even if there's an error
    console.log = originalConsoleLog;
    throw error;
  }
}

// Function to execute code in different languages
async function executeCode(code, language) {
  // For Python code, we'll use Deno's Command API to run Python in a subprocess
  if (language === "python") {
    // Create a temporary file with the Python code
    const tempFile = await Deno.makeTempFile({suffix: '.py'});
    await Deno.writeTextFile(tempFile, code);
    
    try {
      // Execute the Python code
      const cmd = new Deno.Command("python3", {
        args: [tempFile],
        stdout: "piped",
        stderr: "piped",
      });
      
      const { stdout, stderr } = await cmd.output();
      
      // Remove the temporary file
      await Deno.remove(tempFile);
      
      // If there's an error, throw it
      if (stderr.length > 0) {
        const errorText = new TextDecoder().decode(stderr);
        if (errorText.trim()) {
          throw new Error(errorText);
        }
      }
      
      // Return the output
      return new TextDecoder().decode(stdout);
    } catch (error) {
      // Make sure to clean up the temporary file
      try { await Deno.remove(tempFile); } catch {}
      throw error;
    }
  } else {
    // For other languages, we return a message that direct execution is not supported
    return `Direct execution of ${language} is not supported in this environment. The code would normally be sent to a specialized execution service.`;
  }
}
