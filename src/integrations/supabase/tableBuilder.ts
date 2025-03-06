
import { getCollection } from "@/integrations/mongodb/client";
import { 
  TableQueryBuilder, 
  QueryBuilder, 
  CountBuilder, 
  SelectBuilder, 
  DataResponse 
} from "./types.client";
import { MongoQueryBuilder, MongoCountBuilder, MongoSelectBuilder } from "./queryBuilders";

// MongoDB-based table query builder
export class MongoTableQueryBuilder<T = any> implements TableQueryBuilder<T> {
  private collection: string;

  constructor(collection: string) {
    this.collection = collection;
  }

  select(columns: string = "*"): SelectBuilder<T> {
    return new MongoSelectBuilder<T>(this.collection);
  }

  async insert(data: any): DataResponse<T> {
    try {
      const collection = await getCollection(this.collection);
      const result = await collection.insertOne(data);
      const insertedDoc = await collection.findOne({ _id: result.insertedId }) as T;
      return { data: insertedDoc, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  update(data: any) {
    return {
      eq: async (field: string, value: any) => {
        try {
          const collection = await getCollection(this.collection);
          const filter = { [field]: value };
          await collection.updateOne(filter, { $set: data });
          return { error: null };
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
          const collection = await getCollection(this.collection);
          const filter = { [field]: value };
          await collection.deleteOne(filter);
          return { error: null };
        } catch (error) {
          return { error };
        }
      }
    };
  }

  count(column: string = "*"): CountBuilder {
    return new MongoCountBuilder(this.collection);
  }

  eq(field: string, value: any): QueryBuilder<T> {
    return new MongoQueryBuilder<T>(this.collection, { [field]: value });
  }

  gte(field: string, value: any): QueryBuilder<T> {
    return new MongoQueryBuilder<T>(this.collection, { [field]: { $gte: value } });
  }

  gt(field: string, value: any): QueryBuilder<T> {
    return new MongoQueryBuilder<T>(this.collection, { [field]: { $gt: value } });
  }

  async single(): DataResponse<T> {
    try {
      const collection = await getCollection(this.collection);
      const data = await collection.findOne({}) as T;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  }

  order(field: string, { ascending }: { ascending: boolean }): QueryBuilder<T> {
    return new MongoQueryBuilder<T>(this.collection, {}, [[field, ascending ? 1 : -1]]);
  }

  async then<R>(
    onfulfilled?: ((value: { data: T[]; error: null } | { data: null; error: any }) => R | PromiseLike<R>) | null
  ): Promise<R> {
    try {
      const collection = await getCollection(this.collection);
      const data = await collection.find({}).toArray() as T[];
      return onfulfilled!({ data, error: null });
    } catch (error) {
      return onfulfilled!({ data: null, error });
    }
  }
}
