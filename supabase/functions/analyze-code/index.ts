
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
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key is not configured');
    }
    
    const { language, code, output } = await req.json();

    const analysisPrompt = `
You are an expert programming tutor. Analyze the following ${language} code:

\`\`\`${language}
${code}
\`\`\`

${output ? `Execution result:\n${output}` : 'No execution output provided.'}

Provide a brief, helpful analysis including:
1. Code quality (1-2 sentences)
2. Potential bugs or issues (if any)
3. Optimization suggestions (if applicable)
4. Best practices that could be applied
Keep your response concise and educational.
`;

    const analysisResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: 'You are a helpful programming tutor that provides concise code feedback.' },
          { role: 'user', content: analysisPrompt }
        ],
      }),
    });

    const analysisData = await analysisResponse.json();
    const analysis = analysisData.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-code function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
