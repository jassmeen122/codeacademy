
// Type definitions for Supabase MongoDB compatibility layer

// Response type definitions
export type DataResponse<T = any> = Promise<{ data: T; error: null } | { data: null; error: any }>;
export type CountResponse = Promise<{ count: number; error: null } | { count: null; error: any }>;

// Query builder interfaces
export interface QueryBuilder<T = any> {
  eq: (field: string, value: any) => QueryBuilder<T>;
  gte: (field: string, value: any) => QueryBuilder<T>;
  gt: (field: string, value: any) => QueryBuilder<T>;
  single: () => DataResponse<T>;
  order: (field: string, options: { ascending: boolean }) => QueryBuilder<T>;
  then: <R>(onfulfilled?: ((value: { data: T[]; error: null } | { data: null; error: any }) => R | PromiseLike<R>) | null) => Promise<R>;
}

export interface CountBuilder {
  eq: (field: string, value: any) => CountBuilder;
  gte: (field: string, value: any) => CountBuilder;
  gt: (field: string, value: any) => CountBuilder;
  then: <R>(onfulfilled?: ((value: { count: number; error: null } | { count: null; error: any }) => R | PromiseLike<R>) | null) => Promise<R>;
}

export interface SelectBuilder<T = any> {
  eq: (field: string, value: any) => QueryBuilder<T>;
  gte: (field: string, value: any) => QueryBuilder<T>;
  gt: (field: string, value: any) => QueryBuilder<T>;
  single: () => DataResponse<T>;
  order: (field: string, options: { ascending: boolean }) => QueryBuilder<T>;
  then: <R>(onfulfilled?: ((value: { data: T[]; error: null } | { data: null; error: any }) => R | PromiseLike<R>) | null) => Promise<R>;
}

export interface TableQueryBuilder<T = any> {
  select: (columns?: string) => SelectBuilder<T>;
  insert: (data: any) => DataResponse<T>;
  update: (data: any) => { eq: (field: string, value: any) => Promise<{ error: null } | { error: any }> };
  delete: () => { eq: (field: string, value: any) => Promise<{ error: null } | { error: any }> };
  count: (column?: string) => CountBuilder;
  eq: (field: string, value: any) => QueryBuilder<T>;
  single: () => DataResponse<T>;
  order: (field: string, options: { ascending: boolean }) => QueryBuilder<T>;
  gte: (field: string, value: any) => QueryBuilder<T>;
  gt: (field: string, value: any) => QueryBuilder<T>;
  then: <R>(onfulfilled?: ((value: { data: T[]; error: null } | { data: null; error: any }) => R | PromiseLike<R>) | null) => Promise<R>;
}
