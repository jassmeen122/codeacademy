
import { getCollection } from "@/integrations/mongodb/client";
import { 
  QueryBuilder, 
  CountBuilder, 
  SelectBuilder, 
  DataResponse, 
  CountResponse 
} from "./types.client";

// Define a proper Sort type that supports array operations
type SortOption = [string, 1 | -1];
type SortArray = SortOption[];

// MongoDB-based query builder
export class MongoQueryBuilder<T = any> implements QueryBuilder<T> {
  private collection: string;
  private filters: Record<string, any> = {};
  private sortOptions: SortArray = [];

  constructor(collection: string, filters: Record<string, any> = {}, sortOptions: SortArray = []) {
    this.collection = collection;
    this.filters = filters;
    this.sortOptions = sortOptions;
  }

  eq(field: string, value: any): QueryBuilder<T> {
    const newFilters = { ...this.filters, [field]: value };
    return new MongoQueryBuilder<T>(this.collection, newFilters, this.sortOptions);
  }

  gte(field: string, value: any): QueryBuilder<T> {
    const newFilters = { ...this.filters, [field]: { $gte: value } };
    return new MongoQueryBuilder<T>(this.collection, newFilters, this.sortOptions);
  }

  gt(field: string, value: any): QueryBuilder<T> {
    const newFilters = { ...this.filters, [field]: { $gt: value } };
    return new MongoQueryBuilder<T>(this.collection, newFilters, this.sortOptions);
  }

  order(field: string, { ascending }: { ascending: boolean }): QueryBuilder<T> {
    const newSortOptions = [...this.sortOptions];
    newSortOptions.push([field, ascending ? 1 : -1]);
    return new MongoQueryBuilder<T>(this.collection, this.filters, newSortOptions);
  }

  async single(): DataResponse<T> {
    try {
      const collection = await getCollection(this.collection);
      const options = this.sortOptions.length > 0 ? { sort: this.sortOptions } : {};
      const data = await collection.findOne(this.filters, options) as T;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async then<R>(
    onfulfilled?: ((value: { data: T[]; error: null } | { data: null; error: any }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      const collection = await getCollection(this.collection);
      const options = this.sortOptions.length > 0 ? { sort: this.sortOptions } : {};
      const data = await collection.find(this.filters, options).toArray() as T[];
      return onfulfilled!({ data, error: null });
    } catch (error) {
      return onfulfilled!({ data: null, error });
    }
  }
}

// MongoDB-based count builder
export class MongoCountBuilder implements CountBuilder {
  private collection: string;
  private filters: Record<string, any> = {};

  constructor(collection: string, filters: Record<string, any> = {}) {
    this.collection = collection;
    this.filters = filters;
  }

  eq(field: string, value: any): CountBuilder {
    const newFilters = { ...this.filters, [field]: value };
    return new MongoCountBuilder(this.collection, newFilters);
  }

  gte(field: string, value: any): CountBuilder {
    const newFilters = { ...this.filters, [field]: { $gte: value } };
    return new MongoCountBuilder(this.collection, newFilters);
  }

  gt(field: string, value: any): CountBuilder {
    const newFilters = { ...this.filters, [field]: { $gt: value } };
    return new MongoCountBuilder(this.collection, newFilters);
  }

  async then<R>(
    onfulfilled?: ((value: { count: number; error: null } | { count: null; error: any }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      const collection = await getCollection(this.collection);
      const count = await collection.countDocuments(this.filters);
      return onfulfilled!({ count, error: null });
    } catch (error) {
      return onfulfilled!({ count: null, error });
    }
  }
}

// MongoDB-based select builder
export class MongoSelectBuilder<T = any> implements SelectBuilder<T> {
  private collection: string;
  private filters: Record<string, any> = {};
  private sortOptions: SortArray = [];

  constructor(collection: string, filters: Record<string, any> = {}, sortOptions: SortArray = []) {
    this.collection = collection;
    this.filters = filters;
    this.sortOptions = sortOptions;
  }

  eq(field: string, value: any): QueryBuilder<T> {
    const newFilters = { ...this.filters, [field]: value };
    return new MongoQueryBuilder<T>(this.collection, newFilters, this.sortOptions);
  }

  gte(field: string, value: any): QueryBuilder<T> {
    const newFilters = { ...this.filters, [field]: { $gte: value } };
    return new MongoQueryBuilder<T>(this.collection, newFilters, this.sortOptions);
  }

  gt(field: string, value: any): QueryBuilder<T> {
    const newFilters = { ...this.filters, [field]: { $gt: value } };
    return new MongoQueryBuilder<T>(this.collection, newFilters, this.sortOptions);
  }

  order(field: string, { ascending }: { ascending: boolean }): QueryBuilder<T> {
    const newSortOptions = [...this.sortOptions];
    newSortOptions.push([field, ascending ? 1 : -1]);
    return new MongoQueryBuilder<T>(this.collection, this.filters, newSortOptions);
  }

  async single(): DataResponse<T> {
    try {
      const collection = await getCollection(this.collection);
      const options = this.sortOptions.length > 0 ? { sort: this.sortOptions } : {};
      const data = await collection.findOne(this.filters, options) as T;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  async then<R>(
    onfulfilled?: ((value: { data: T[]; error: null } | { data: null; error: any }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      const collection = await getCollection(this.collection);
      const options = this.sortOptions.length > 0 ? { sort: this.sortOptions } : {};
      const data = await collection.find(this.filters, options).toArray() as T[];
      return onfulfilled!({ data, error: null });
    } catch (error) {
      return onfulfilled!({ data: null, error });
    }
  }
}
