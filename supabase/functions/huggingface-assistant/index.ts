
// Follow this setup guide to integrate the Deno runtime and Supabase's Edge Functions:
// https://supabase.com/docs/guides/functions/getting-started

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

// Type definitions
type Message = {
  role: string;
  content: string;
};

interface RequestBody {
  prompt: string;
  messageHistory?: Message[];
  code?: string;
  language?: string;
}

// Default Hugging Face model - can be changed based on requirements
const DEFAULT_MODEL = "HuggingFaceH4/zephyr-7b-beta";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Get the API key from environment variables
    const apiKey = Deno.env.get("HUGGINGFACE_API_KEY");
    if (!apiKey) {
      throw new Error(
        "HUGGINGFACE_API_KEY is not configured in Supabase Edge Functions secrets."
      );
    }

    // Parse the request body
    const requestData: RequestBody = await req.json();
    const { prompt, messageHistory = [], code, language } = requestData;

    console.log("Request details:");
    console.log(`- Prompt preview: ${prompt.substring(0, 50)}...`);
    console.log(`- Message history length: ${messageHistory.length}`);
    console.log(`- Code assistance: ${code ? "Yes" : "No"}`);
    console.log(`- Language: ${language || "N/A"}`);

    // Format input based on whether code is provided
    let userInput = prompt;
    if (code && language) {
      userInput = prompt.trim()
        ? `${prompt}\n\n\`\`\`${language}\n${code}\n\`\`\``
        : `Help with this ${language} code:\n\n\`\`\`${language}\n${code}\n\`\`\``;
    }

    // Format conversation history for the model
    const conversation = messageHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    // Add the user's current input to the conversation
    conversation.push({
      role: "user",
      content: userInput,
    });

    // Format the messages for Hugging Face text generation API
    const formattedMessages = conversation.map(msg => 
      `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`
    ).join("\n\n");

    const systemPrompt = "You are a helpful, respectful and honest AI assistant specializing in programming and computer science. Always provide accurate information and helpful code examples when requested. If you're not sure about something, admit it rather than making up information.";
    
    const fullPrompt = `${systemPrompt}\n\n${formattedMessages}\n\nAssistant:`;

    console.log("Calling Hugging Face API...");

    // Make request to Hugging Face API
    const response = await fetch(`https://api-inference.huggingface.co/models/${DEFAULT_MODEL}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 1024,
          temperature: 0.7,
          top_p: 0.95,
          do_sample: true,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Hugging Face API error: ${response.status} ${errorText}`);
      throw new Error(`Hugging Face API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    
    // Extract the generated text from the response
    let generatedText;
    if (Array.isArray(result) && result.length > 0 && result[0].generated_text) {
      // Extract just the assistant's reply - after the last "Assistant:"
      const fullText = result[0].generated_text;
      const parts = fullText.split("Assistant:");
      generatedText = parts[parts.length - 1].trim();
    } else {
      generatedText = "I'm sorry, I couldn't generate a proper response. Please try again.";
    }

    // Return the response
    return new Response(
      JSON.stringify({
        reply: {
          role: "assistant",
          content: generatedText,
        },
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error in Hugging Face assistant function:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred while calling the Hugging Face assistant.",
      }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
      }
    );
  }
});
