
// This is a compatibility layer to support existing components that use supabase
// while actually using MongoDB under the hood

// Re-export necessary functionality from the MongoDB client
import { MongoTableQueryBuilder } from "./tableBuilder";
import { authMethods } from "./auth";
import { functionsMethods } from "./functions";

// Export the Supabase client structure with MongoDB functionality
export const supabase = {
  auth: {
    ...authMethods
  },
  from: (table: string) => {
    return new MongoTableQueryBuilder(table);
  },
  functions: {
    ...functionsMethods
  }
};
