
import { PostgrestError } from "@supabase/supabase-js";

// Response type definitions
export type DataResponse<T = any> = Promise<{ data: T | null; error: PostgrestError | null }>;
export type CountResponse = Promise<{ count: number | null; error: PostgrestError | null }>;

// Query builder interfaces
export interface QueryBuilder<T = any> {
  eq: (field: string, value: any) => QueryBuilder<T>;
  gte: (field: string, value: any) => QueryBuilder<T>;
  gt: (field: string, value: any) => QueryBuilder<T>;
  single: () => DataResponse<T>;
  order: (field: string, options: { ascending: boolean }) => QueryBuilder<T>;
  then: <R>(onfulfilled?: ((value: { data: T[] | null; error: PostgrestError | null }) => R | PromiseLike<R>) | null) => Promise<R>;
}

export interface CountBuilder {
  eq: (field: string, value: any) => CountBuilder;
  gte: (field: string, value: any) => CountBuilder;
  gt: (field: string, value: any) => CountBuilder;
  then: <R>(onfulfilled?: ((value: { count: number | null; error: PostgrestError | null }) => R | PromiseLike<R>) | null) => Promise<R>;
}

export interface SelectBuilder<T = any> {
  eq: (field: string, value: any) => QueryBuilder<T>;
  gte: (field: string, value: any) => QueryBuilder<T>;
  gt: (field: string, value: any) => QueryBuilder<T>;
  single: () => DataResponse<T>;
  order: (field: string, options: { ascending: boolean }) => QueryBuilder<T>;
  then: <R>(onfulfilled?: ((value: { data: T[] | null; error: PostgrestError | null }) => R | PromiseLike<R>) | null) => Promise<R>;
}

export interface TableQueryBuilder<T = any> {
  select: (columns?: string) => SelectBuilder<T>;
  insert: (data: any) => DataResponse<T>;
  update: (data: any) => { eq: (field: string, value: any) => Promise<{ error: PostgrestError | null }> };
  delete: () => { eq: (field: string, value: any) => Promise<{ error: PostgrestError | null }> };
  count: (column?: string) => CountBuilder;
  eq: (field: string, value: any) => QueryBuilder<T>;
  single: () => DataResponse<T>;
  order: (field: string, options: { ascending: boolean }) => QueryBuilder<T>;
  gte: (field: string, value: any) => QueryBuilder<T>;
  gt: (field: string, value: any) => QueryBuilder<T>;
  then: <R>(onfulfilled?: ((value: { data: T[] | null; error: PostgrestError | null }) => R | PromiseLike<R>) | null) => Promise<R>;
}
