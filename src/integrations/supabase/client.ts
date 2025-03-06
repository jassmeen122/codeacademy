
import { createClient } from "@supabase/supabase-js";
import { SupabaseTableQueryBuilder } from "./tableBuilder";
import { authMethods } from "./auth";
import { functionsMethods } from "./functions";

// Create a Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const supabaseInstance = createClient(supabaseUrl, supabaseKey);

// Add the compatibility layer
export const supabase = {
  auth: {
    ...authMethods,
    getSession: async () => supabaseInstance.auth.getSession(),
    getUser: async () => supabaseInstance.auth.getUser(),
    onAuthStateChange: (callback: any) => supabaseInstance.auth.onAuthStateChange(callback),
    signInWithPassword: async (credentials: any) => supabaseInstance.auth.signInWithPassword(credentials),
    signUp: async (credentials: any) => supabaseInstance.auth.signUp(credentials),
    signOut: async () => supabaseInstance.auth.signOut()
  },
  from: (table: string) => {
    return new SupabaseTableQueryBuilder(table);
  },
  functions: {
    ...functionsMethods
  },
  // Pass through any other methods directly to the real client
  storage: supabaseInstance.storage,
  rpc: supabaseInstance.rpc.bind(supabaseInstance)
};
