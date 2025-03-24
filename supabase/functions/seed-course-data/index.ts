
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { corsHeaders, createClient } from "./helpers.ts";
import { programmingLanguages } from "./languages-data.ts";
import { pythonModules } from "./python-modules.ts";
import { createPythonQuizzes } from "./python-quizzes.ts";
import { createPythonExercises } from "./python-exercises.ts";

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    );

    // Seed programming languages
    const { data: languagesData, error: languagesError } = await supabaseClient
      .from('programming_languages')
      .insert(programmingLanguages)
      .select();

    if (languagesError) {
      throw languagesError;
    }

    const languageMap = languagesData.reduce((acc, lang) => {
      acc[lang.name] = lang.id;
      return acc;
    }, {});

    // Seed Python modules
    if (languageMap.Python) {
      // Add language_id to each module
      const pythonModulesWithLanguageId = pythonModules.map(module => ({
        ...module,
        language_id: languageMap.Python
      }));

      const { error: modulesError } = await supabaseClient
        .from('course_modules')
        .insert(pythonModulesWithLanguageId);

      if (modulesError) {
        throw modulesError;
      }

      // Fetch the created modules to get their IDs
      const { data: createdModules, error: fetchModulesError } = await supabaseClient
        .from('course_modules')
        .select('id, title')
        .eq('language_id', languageMap.Python);

      if (fetchModulesError) {
        throw fetchModulesError;
      }

      // Create a map of module titles to IDs for easier reference
      const moduleIdMap = createdModules.reduce((acc, module) => {
        acc[module.title] = module.id;
        return acc;
      }, {});

      // Create quiz questions for the Python modules
      const quizzes = createPythonQuizzes(moduleIdMap);

      const { error: quizzesError } = await supabaseClient
        .from('quizzes')
        .insert(quizzes);

      if (quizzesError) {
        throw quizzesError;
      }

      // Create coding exercises for Python modules
      const exercises = createPythonExercises(moduleIdMap);

      const { error: exercisesError } = await supabaseClient
        .from('coding_exercises')
        .insert(exercises);

      if (exercisesError) {
        throw exercisesError;
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Course data seeded successfully",
        data: {
          languages: languagesData.length,
          modules: "Python modules created",
          quizzes: "Python quizzes created",
          exercises: "Python exercises created"
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error("Error seeding course data:", error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        message: "Failed to seed course data", 
        error: error.message 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});
