
// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

import { Application, Router } from "https://deno.land/x/oak@v12.6.1/mod.ts";
import { oakCors } from "https://deno.land/x/cors@v1.2.2/mod.ts";
import { MongoClient, ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { corsHeaders } from "../_shared/cors.ts";

// MongoDB connection string - in a real app, use environment variables
const MONGODB_URI = Deno.env.get("MONGODB_URI") || "mongodb://localhost:27017";
const DB_NAME = "learning_platform";

// Create the MongoDB client
const client = new MongoClient();

// Connect to MongoDB
try {
  await client.connect(MONGODB_URI);
  console.log("Connected to MongoDB");
} catch (err) {
  console.error("Error connecting to MongoDB:", err);
}

const db = client.database(DB_NAME);
const coursesCollection = db.collection("courses");
const resourcesCollection = db.collection("course_resources");

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
      const courses = await coursesCollection.find().toArray();

      ctx.response.body = { success: true, data: courses };
      ctx.response.type = "json";
    } catch (error) {
      console.error("Error fetching courses:", error);
      ctx.response.status = 500;
      ctx.response.body = { success: false, error: error.message };
      ctx.response.type = "json";
    }
  })
  .post("/courses", async (ctx) => {
    try {
      const body = await ctx.request.body({ type: "json" }).value;
      
      const result = await coursesCollection.insertOne(body);
      const insertedId = result.insertedId;
      
      // Fetch the inserted document
      const insertedDoc = await coursesCollection.findOne({ _id: insertedId });

      ctx.response.status = 201;
      ctx.response.body = { success: true, data: insertedDoc };
      ctx.response.type = "json";
    } catch (error) {
      console.error("Error creating course:", error);
      ctx.response.status = 500;
      ctx.response.body = { success: false, error: error.message };
      ctx.response.type = "json";
    }
  })
  .get("/courses/:id", async (ctx) => {
    try {
      const id = ctx.params.id;
      
      let query = {};
      try {
        // Try to use the id as ObjectId
        query = { _id: new ObjectId(id) };
      } catch (e) {
        // If it's not a valid ObjectId, use it as is
        query = { id: id };
      }
      
      const course = await coursesCollection.findOne(query);

      if (!course) {
        ctx.response.status = 404;
        ctx.response.body = { success: false, error: "Course not found" };
        return;
      }

      ctx.response.body = { success: true, data: course };
      ctx.response.type = "json";
    } catch (error) {
      console.error("Error fetching course:", error);
      ctx.response.status = 500;
      ctx.response.body = { success: false, error: error.message };
      ctx.response.type = "json";
    }
  })
  .get("/courses/:id/resources", async (ctx) => {
    try {
      const id = ctx.params.id;
      
      let courseId;
      try {
        // Try to convert to ObjectId
        courseId = new ObjectId(id);
      } catch (e) {
        // If not a valid ObjectId, use as is
        courseId = id;
      }
      
      const resources = await resourcesCollection.find({ course_id: courseId.toString() }).toArray();

      ctx.response.body = { success: true, data: resources };
      ctx.response.type = "json";
    } catch (error) {
      console.error("Error fetching course resources:", error);
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
