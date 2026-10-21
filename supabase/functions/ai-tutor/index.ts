import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  };

  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    
    // Get AI configuration
    const apiUrl = Deno.env.get("AI_API_URL");
    const apiKey = Deno.env.get("AI_API_KEY");
    const model = Deno.env.get("AI_MODEL") || "openai/gpt-oss-20b";

    if (!apiUrl || !apiKey) {
      return new Response(
        JSON.stringify({ 
          reply: "AI tutor is not configured. Please set AI_API_URL and AI_API_KEY secrets in Supabase." 
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Call Groq API
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a patient Java programming teacher. Help students learn DSA concepts with simple English, examples, and dry runs. Never give full solutions unless asked."
          },
          ...messages
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't generate a response.";

    return new Response(
      JSON.stringify({ reply }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" } 
      }
    );
  }
});
