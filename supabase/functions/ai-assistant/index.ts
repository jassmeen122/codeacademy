
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Define allowed programming languages
const ALLOWED_LANGUAGES = ["python", "java", "javascript", "c", "cpp", "c++", "php", "sql"];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for API key before processing anything else
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error('OpenAI API key is not configured in Supabase secrets');
      return new Response(
        JSON.stringify({ 
          error: 'Le service est temporairement indisponible. Veuillez réessayer plus tard.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    if (openAIApiKey === 'sk-your-key-here' || openAIApiKey.trim() === '') {
      console.error('OpenAI API key is not properly set');
      return new Response(
        JSON.stringify({ 
          error: 'Le service est temporairement indisponible. Veuillez réessayer plus tard.' 
        }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Parse request body
    const requestData = await req.json().catch(error => {
      console.error('Failed to parse request JSON:', error);
      throw new Error('Format de requête invalide');
    });
    
    const { prompt, messageHistory, code, language } = requestData;
    
    console.log("Request details:");
    console.log("- Prompt preview:", prompt ? prompt.substring(0, 50) + '...' : 'No prompt');
    console.log("- Message history length:", messageHistory?.length || 0);
    console.log("- Code assistance:", code ? 'Yes' : 'No');
    console.log("- Language:", language || 'N/A');
    
    // Check if the query is related to programming languages
    const isProgrammingRelated = checkIfProgrammingRelated(prompt, code, language);
    
    if (!isProgrammingRelated) {
      return new Response(
        JSON.stringify({ 
          reply: { 
            role: "assistant", 
            content: "Je suis désolé, je ne peux répondre qu'aux questions concernant les langages de programmation suivants : Python, Java, JavaScript, C, C++, PHP et SQL. Veuillez reformuler votre question pour qu'elle soit liée à ces langages."
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Format system message for programming assistance
    const systemMessage = "Vous êtes un assistant de programmation qui aide uniquement avec les langages Python, Java, JavaScript, C, C++, PHP et SQL. Vos réponses doivent être concises, claires et centrées uniquement sur ces langages de programmation. Si une question ne concerne pas ces langages, rappelez poliment à l'utilisateur que vous êtes spécialisé dans ces langages uniquement.";
    let promptForAI;
    
    if (code && language) {
      promptForAI = `Aidez-moi avec ce code ${language}:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n${prompt || "Que fait ce code et comment peut-il être amélioré?"}`;
    } else {
      promptForAI = prompt;
    }
    
    // Format messages for OpenAI
    const messages = [
      { role: "system", content: systemMessage },
      ...(messageHistory || []),
      { role: "user", content: promptForAI }
    ];

    console.log("Calling OpenAI API with model gpt-4o-mini...");
    
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      // Handle API errors
      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenAI API error:', response.status, errorText);
        
        try {
          const errorData = JSON.parse(errorText);
          let errorMessage = errorData.error?.message || `Erreur API OpenAI: ${response.status}`;
          
          // Check for common error types
          if (errorData.error?.type === 'invalid_request_error' && errorData.error?.message.includes('API key')) {
            errorMessage = 'Le service est temporairement indisponible. Veuillez réessayer plus tard.';
          } else if (errorData.error?.type === 'insufficient_quota') {
            errorMessage = 'Le service est temporairement indisponible. Veuillez réessayer plus tard.';
            
            // Return a more user-friendly message for quota errors
            return new Response(
              JSON.stringify({ 
                reply: { 
                  role: "assistant", 
                  content: "Je suis désolé, notre service d'intelligence artificielle est actuellement surchargé. Nous travaillons à résoudre ce problème. En attendant, essayez d'utiliser le modèle alternatif Hugging Face en cliquant sur 'Changer de modèle' ci-dessous."
                }
              }),
              { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
          }
          
          throw new Error(errorMessage);
        } catch (parseError) {
          throw new Error(`Le service est temporairement indisponible. Veuillez réessayer plus tard.`);
        }
      }

      const data = await response.json();
      console.log('OpenAI response received successfully:', data.choices ? 'Valid response' : 'Invalid response format');
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        console.error('Invalid response format from OpenAI:', data);
        throw new Error('Format de réponse invalide de l\'API');
      }
      
      const assistantReply = data.choices[0].message;

      return new Response(
        JSON.stringify({ reply: assistantReply }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (apiError) {
      console.error('OpenAI API call failed:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error in AI assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message || "Une erreur inconnue s'est produite" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Function to check if the query is related to programming languages
function checkIfProgrammingRelated(prompt: string, code?: string, codeLanguage?: string): boolean {
  if (!prompt && !code) return false;
  
  // If code is provided with an allowed language, it's programming-related
  if (code && codeLanguage) {
    const normalizedLanguage = codeLanguage.toLowerCase();
    return ALLOWED_LANGUAGES.some(lang => 
      normalizedLanguage === lang || 
      (lang === "cpp" && (normalizedLanguage === "c++" || normalizedLanguage === "c")) ||
      (lang === "c++" && (normalizedLanguage === "cpp" || normalizedLanguage === "c"))
    );
  }
  
  // Check if prompt mentions any of the allowed languages
  const promptLower = prompt.toLowerCase();
  const containsLanguage = ALLOWED_LANGUAGES.some(lang => promptLower.includes(lang));
  
  // Check for programming keywords
  const programmingKeywords = [
    "code", "function", "variable", "class", "method", "syntax", "error", 
    "debug", "compiler", "interpreter", "algorithm", "loop", "array", "string", 
    "integer", "float", "boolean", "if statement", "while", "for loop", 
    "switch", "case", "exception", "try catch", "import", "module", "library",
    "api", "framework", "package", "dependency", "object", "inheritance", 
    "polymorphism", "interface", "abstract", "static", "dynamic", "null", "undefined",
    "query", "database", "table", "select", "insert", "update", "delete", "join"
  ];
  
  const containsProgrammingKeyword = programmingKeywords.some(keyword => 
    promptLower.includes(keyword)
  );
  
  return containsLanguage || containsProgrammingKeyword;
}
