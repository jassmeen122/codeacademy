
import { 
  TableQueryBuilder, 
  QueryBuilder, 
  CountBuilder, 
  SelectBuilder, 
  DataResponse 
} from "./types.client";
import { supabase } from "./client";
import { SupabaseQueryBuilder, SupabaseCountBuilder, SupabaseSelectBuilder } from "./queryBuilders";

// Supabase-based table query builder
export class SupabaseTableQueryBuilder<T = any> implements TableQueryBuilder<T> {
  private table: string;

  constructor(table: string) {
    this.table = table;
  }

  select(columns: string = "*"): SelectBuilder<T> {
    return new SupabaseSelectBuilder<T>(this.table, columns);
  }

  async insert(data: any): DataResponse<T> {
    try {
      const { data: insertedData, error } = await supabase
        .from(this.table)
        .insert(data)
        .select()
        .single();
      
      return { data: insertedData as T, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  update(data: any) {
    return {
      eq: async (field: string, value: any) => {
        try {
          const { error } = await supabase
            .from(this.table)
            .update(data)
            .eq(field, value);
          
          return { error };
        } catch (error) {
          return { error };
        }
      }
    };
  }

  delete() {
    return {
      eq: async (field: string, value: any) => {
        try {
          const { error } = await supabase
            .from(this.table)
            .delete()
            .eq(field, value);
          
          return { error };
        } catch (error) {
          return { error };
        }
      }
    };
  }

  count(column: string = "*"): CountBuilder {
    return new SupabaseCountBuilder(this.table);
  }

  eq(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, { [field]: value });
  }

  gte(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table);
  }

  gt(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table);
  }

  async single(): DataResponse<T> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select()
        .single();
      
      return { data: data as T, error };
    } catch (error) {
      return { data: null, error };
    }
  }

  order(field: string, { ascending }: { ascending: boolean }): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, {}, field, ascending);
  }

  async then<R>(
    onfulfilled?: ((value: { data: T[]; error: null } | { data: null; error: any }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      const { data, error } = await supabase
        .from(this.table)
        .select();
      
      return onfulfilled!({ data: data as T[], error: null });
    } catch (error) {
      return onfulfilled!({ data: null, error });
    }
  }
}
