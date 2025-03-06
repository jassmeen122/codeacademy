
// Authentication mock implementation for Supabase-MongoDB compatibility layer
export const authMethods = {
  getSession: async () => {
    // Mock implementation - should be replaced with actual authentication
    return {
      data: {
        session: null
      }
    };
  },
  getUser: async () => {
    // Mock implementation - should be replaced with actual authentication
    return {
      data: {
        user: null
      }
    };
  },
  onAuthStateChange: (callback: any) => {
    // Mock implementation - should be replaced with actual authentication
    return {
      data: {
        subscription: {
          unsubscribe: () => {}
        }
      }
    };
  },
  signInWithPassword: async (credentials: any = {}) => {
    // Mock implementation - should be replaced with actual authentication
    return {
      data: {
        user: null
      },
      error: new Error("Authentication using MongoDB is not implemented yet")
    };
  },
  signUp: async (credentials: any = {}) => {
    // Mock implementation - should be replaced with actual authentication
    return {
      data: {
        user: { 
          identities: [] 
        }
      },
      error: new Error("Authentication using MongoDB is not implemented yet")
    };
  },
  signOut: async () => {
    // Mock implementation - should be replaced with actual authentication
    return {
      error: null
    };
  }
};
