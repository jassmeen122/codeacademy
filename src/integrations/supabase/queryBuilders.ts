
import { 
  QueryBuilder, 
  CountBuilder, 
  SelectBuilder, 
  DataResponse, 
  CountResponse 
} from "./types.client";
import { supabase } from "./client";
import { PostgrestError } from "@supabase/supabase-js";

// Supabase-based query builder
export class SupabaseQueryBuilder<T = any> implements QueryBuilder<T> {
  private table: string;
  private filters: Record<string, any> = {};
  private sortField: string | null = null;
  private sortAscending: boolean = true;

  constructor(table: string, filters: Record<string, any> = {}, sortField: string | null = null, sortAscending: boolean = true) {
    this.table = table;
    this.filters = filters;
    this.sortField = sortField;
    this.sortAscending = sortAscending;
  }

  eq(field: string, value: any): QueryBuilder<T> {
    const newFilters = { ...this.filters, [field]: value };
    return new SupabaseQueryBuilder<T>(this.table, newFilters, this.sortField, this.sortAscending);
  }

  gte(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, this.filters, this.sortField, this.sortAscending);
  }

  gt(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, this.filters, this.sortField, this.sortAscending);
  }

  order(field: string, { ascending }: { ascending: boolean }): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, this.filters, field, ascending);
  }

  async single(): DataResponse<T> {
    try {
      let query = supabase.from(this.table).select();
      
      // Apply filters
      Object.entries(this.filters).forEach(([field, value]) => {
        query = query.eq(field, value);
      });
      
      // Apply sorting
      if (this.sortField) {
        query = query.order(this.sortField, { ascending: this.sortAscending });
      }
      
      const { data, error } = await query.single();
      return { data, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }

  async then<R>(
    onfulfilled?: ((value: { data: T[] | null; error: PostgrestError | null }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      let query = supabase.from(this.table).select();
      
      // Apply filters
      Object.entries(this.filters).forEach(([field, value]) => {
        query = query.eq(field, value);
      });
      
      // Apply sorting
      if (this.sortField) {
        query = query.order(this.sortField, { ascending: this.sortAscending });
      }
      
      const { data, error } = await query;
      return onfulfilled!({ data: data as T[], error });
    } catch (error) {
      return onfulfilled!({ data: null, error: error as PostgrestError });
    }
  }
}

// Supabase-based count builder
export class SupabaseCountBuilder implements CountBuilder {
  private table: string;
  private filters: Record<string, any> = {};

  constructor(table: string, filters: Record<string, any> = {}) {
    this.table = table;
    this.filters = filters;
  }

  eq(field: string, value: any): CountBuilder {
    const newFilters = { ...this.filters, [field]: value };
    return new SupabaseCountBuilder(this.table, newFilters);
  }

  gte(field: string, value: any): CountBuilder {
    return new SupabaseCountBuilder(this.table, { ...this.filters });
  }

  gt(field: string, value: any): CountBuilder {
    return new SupabaseCountBuilder(this.table, { ...this.filters });
  }

  async then<R>(
    onfulfilled?: ((value: { count: number | null; error: PostgrestError | null }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      let query = supabase.from(this.table).select('*', { count: 'exact' });
      
      // Apply filters
      Object.entries(this.filters).forEach(([field, value]) => {
        query = query.eq(field, value);
      });
      
      const { data, error, count } = await query;
      return onfulfilled!({ count: count || 0, error });
    } catch (error) {
      return onfulfilled!({ count: null, error: error as PostgrestError });
    }
  }
}

// Supabase-based select builder
export class SupabaseSelectBuilder<T = any> implements SelectBuilder<T> {
  private table: string;
  private filters: Record<string, any> = {};
  private sortField: string | null = null;
  private sortAscending: boolean = true;
  private columns: string;

  constructor(table: string, columns: string = "*", filters: Record<string, any> = {}, sortField: string | null = null, sortAscending: boolean = true) {
    this.table = table;
    this.columns = columns;
    this.filters = filters;
    this.sortField = sortField;
    this.sortAscending = sortAscending;
  }

  eq(field: string, value: any): QueryBuilder<T> {
    const newFilters = { ...this.filters, [field]: value };
    return new SupabaseQueryBuilder<T>(this.table, newFilters, this.sortField, this.sortAscending);
  }

  gte(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, this.filters, this.sortField, this.sortAscending);
  }

  gt(field: string, value: any): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, this.filters, this.sortField, this.sortAscending);
  }

  order(field: string, { ascending }: { ascending: boolean }): QueryBuilder<T> {
    return new SupabaseQueryBuilder<T>(this.table, this.filters, field, ascending);
  }

  async single(): DataResponse<T> {
    try {
      let query = supabase.from(this.table).select(this.columns);
      
      // Apply filters
      Object.entries(this.filters).forEach(([field, value]) => {
        query = query.eq(field, value);
      });
      
      // Apply sorting
      if (this.sortField) {
        query = query.order(this.sortField, { ascending: this.sortAscending });
      }
      
      const { data, error } = await query.single();
      return { data, error };
    } catch (error) {
      return { data: null, error: error as PostgrestError };
    }
  }

  async then<R>(
    onfulfilled?: ((value: { data: T[] | null; error: PostgrestError | null }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      let query = supabase.from(this.table).select(this.columns);
      
      // Apply filters
      Object.entries(this.filters).forEach(([field, value]) => {
        query = query.eq(field, value);
      });
      
      // Apply sorting
      if (this.sortField) {
        query = query.order(this.sortField, { ascending: this.sortAscending });
      }
      
      const { data, error } = await query;
      return onfulfilled!({ data: data as T[], error });
    } catch (error) {
      return onfulfilled!({ data: null, error: error as PostgrestError });
    }
  }
}
