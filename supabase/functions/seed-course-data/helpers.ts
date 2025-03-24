
// Helper function to create Supabase client (copy of Supabase JS library function)
export function createClient(
  supabaseUrl: string,
  supabaseKey: string,
  options: any = {}
) {
  return {
    from: (table: string) => ({
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            const response = await fetch(
              `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&limit=1`,
              {
                headers: {
                  'Content-Type': 'application/json',
                  'apikey': supabaseKey,
                  'Authorization': `Bearer ${supabaseKey}`,
                  ...options?.global?.headers
                }
              }
            );
            const json = await response.json();
            if (!response.ok) throw { error: json, status: response.status };
            if (json.length === 0) throw { error: { message: 'No rows found' }, status: 404 };
            return { data: json[0], error: null };
          },
          order: (column: string, { ascending = true } = {}) => ({
            limit: (limit: number) => ({
              single: async () => {
                const response = await fetch(
                  `${supabaseUrl}/rest/v1/${table}?select=${columns}&${column}=eq.${value}&order=${column}.${ascending ? 'asc' : 'desc'}&limit=${limit}`,
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      'apikey': supabaseKey,
                      'Authorization': `Bearer ${supabaseKey}`,
                      ...options?.global?.headers
                    }
                  }
                );
                const json = await response.json();
                if (!response.ok) throw { error: json, status: response.status };
                if (json.length === 0) throw { error: { message: 'No rows found' }, status: 404 };
                return { data: json[0], error: null };
              }
            })
          })
        }),
        order: (column: string, { ascending = true } = {}) => ({
          limit: (limit: number) => ({
            single: async () => {
              const response = await fetch(
                `${supabaseUrl}/rest/v1/${table}?select=${columns}&order=${column}.${ascending ? 'asc' : 'desc'}&limit=${limit}`,
                {
                  headers: {
                    'Content-Type': 'application/json',
                    'apikey': supabaseKey,
                    'Authorization': `Bearer ${supabaseKey}`,
                    ...options?.global?.headers
                  }
                }
              );
              const json = await response.json();
              if (!response.ok) throw { error: json, status: response.status };
              if (json.length === 0) throw { error: { message: 'No rows found' }, status: 404 };
              return { data: json[0], error: null };
            }
          })
        })
      }),
      insert: (data: any) => ({
        select: async (columns = '*') => {
          const response = await fetch(
            `${supabaseUrl}/rest/v1/${table}`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'apikey': supabaseKey,
                'Authorization': `Bearer ${supabaseKey}`,
                'Prefer': 'return=representation',
                ...options?.global?.headers
              },
              body: JSON.stringify(data)
            }
          );
          const json = await response.json();
          if (!response.ok) return { data: null, error: json };
          return { data: json, error: null };
        }
      })
    })
  };
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};
