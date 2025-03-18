
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    const { prompt, messageHistory, code, language } = await req.json();
    
    // Format system message based on whether this is code assistance
    let systemMessage;
    let promptForAI;
    
    if (code && language) {
      systemMessage = "You are an expert programming teacher and code assistant. You help students understand code, fix bugs, and learn programming concepts. Be concise, clear, and give practical advice.";
      promptForAI = `Please help me with this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\`\n\n${prompt || "What does this code do and how can it be improved?"}`;
    } else {
      systemMessage = "You are a helpful programming assistant for a coding education platform. You provide clear, concise explanations about programming concepts, help debug code, and offer guidance on best practices.";
      promptForAI = prompt;
    }
    
    // Format messages for OpenAI
    const messages = [
      { role: "system", content: systemMessage },
      ...(messageHistory || []),
      { role: "user", content: promptForAI }
    ];

    console.log(`Processing ${code ? 'code assistance' : 'general'} request with prompt: "${promptForAI.substring(0, 50)}..." and ${messageHistory?.length || 0} previous messages`);

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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(errorData.error?.message || `OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    
    const assistantReply = data.choices[0].message;

    return new Response(
      JSON.stringify({ reply: assistantReply }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in AI assistant function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
