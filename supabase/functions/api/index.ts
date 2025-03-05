
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.24.0";
import { corsHeaders } from "../_shared/cors.ts";

const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
const supabaseAnonKey = Deno.env.get("SUPABASE_ANON_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Create an Oak application (similar to Express)
const app = new Application();
const router = new Router();

// Add CORS middleware
app.use(oakCors({ origin: "*", allowHeaders: Object.keys(corsHeaders).join(",") }));

// Log requests
app.use(async (ctx, next) => {
  console.log(`${ctx.request.method} ${ctx.request.url.pathname}`);
  await next();
});

// Routes configuration
router
  .get("/courses", async (ctx) => {
    try {
      const { data, error } = await supabase
        .from("courses")
        .select("*");

      if (error) throw error;

      ctx.response.body = { success: true, data };
      ctx.response.type = "json";
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { success: false, error: error.message };
      ctx.response.type = "json";
    }
  })
  .post("/courses", async (ctx) => {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      
      const { data, error } = await supabase
        .from("courses")
        .insert(body)
        .select();

      if (error) throw error;

      ctx.response.status = 201;
      ctx.response.body = { success: true, data };
      ctx.response.type = "json";
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { success: false, error: error.message };
      ctx.response.type = "json";
    }
  })
  .get("/courses/:id", async (ctx) => {
    try {
      const id = ctx.params.id;
      const { data, error } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      ctx.response.body = { success: true, data };
      ctx.response.type = "json";
    } catch (error) {
      ctx.response.status = 500;
      ctx.response.body = { success: false, error: error.message };
      ctx.response.type = "json";
    }
  });

// Use the router
app.use(router.routes());
app.use(router.allowedMethods());

// 404 handler for unmatched routes
app.use((ctx) => {
  ctx.response.status = 404;
  ctx.response.body = { success: false, error: "Not found" };
  ctx.response.type = "json";
});

// Serve the application
app.addEventListener("listen", ({ port }) => {
  console.log(`Server running on port ${port}`);
});

// Handle requests using the Oak application
Deno.serve(async (req) => {
  // Handle OPTIONS pre-flight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  // Create a response using Oak
  return await app.handle(req).then((response) => {
    // Add CORS headers to all responses
    for (const [key, value] of Object.entries(corsHeaders)) {
      response.headers.set(key, value);
    }
    return response;
  }).catch((error) => {
    console.error(error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  });
});
