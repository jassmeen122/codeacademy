
import { createClient } from "@supabase/supabase-js";
import { SupabaseTableQueryBuilder } from "./tableBuilder";
import { authMethods } from "./auth";
import { functionsMethods } from "./functions";

// Create a Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Add the compatibility layer
const compatibleClient = {
  auth: {
    ...authMethods,
    getSession: async () => supabase.auth.getSession(),
    getUser: async () => supabase.auth.getUser(),
    onAuthStateChange: (callback: any) => supabase.auth.onAuthStateChange(callback),
    signInWithPassword: async (credentials: any) => supabase.auth.signInWithPassword(credentials),
    signUp: async (credentials: any) => supabase.auth.signUp(credentials),
    signOut: async () => supabase.auth.signOut()
  },
  from: (table: string) => {
    return new SupabaseTableQueryBuilder(table);
  },
  functions: {
    ...functionsMethods
  },
  // Pass through any other methods directly to the real client
  storage: supabase.storage,
  rpc: supabase.rpc.bind(supabase)
};

// Re-export the compatible client as supabase
export { compatibleClient as supabase };
