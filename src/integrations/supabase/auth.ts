
// Authentication methods for Supabase
import { supabase } from "@supabase/supabase-js";

export const authMethods = {
  // All these methods are implementation stubs
  // The actual methods will be overridden in client.ts with the real Supabase client
  getSession: async () => ({ data: { session: null } }),
  getUser: async () => ({ data: { user: null } }),
  onAuthStateChange: (callback: any) => ({ data: { subscription: { unsubscribe: () => {} } } }),
  signInWithPassword: async (credentials: any = {}) => ({ data: { user: null }, error: null }),
  signUp: async (credentials: any = {}) => ({ data: { user: { identities: [] } }, error: null }),
  signOut: async () => ({ error: null })
};
