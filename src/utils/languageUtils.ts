
import { supabase } from '@/integrations/supabase/client';

/**
 * Checks if a string is a valid UUID
 */
export function isUuid(str: string): boolean {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
}

/**
 * Gets a language ID from either a UUID or a language name
 */
export async function getLanguageId(languageIdOrName: string): Promise<string> {
  if (isUuid(languageIdOrName)) {
    return languageIdOrName;
  }
  
  // If it's not a UUID, fetch the language ID by name
  const { data, error } = await supabase
    .from('programming_languages')
    .select('id')
    .ilike('name', languageIdOrName)
    .single();
  
  if (error) {
    throw new Error(`Language not found: ${languageIdOrName}`);
  }
  
  return data.id;
}
