
// Main script to seed the database with all needed data
import { supabase } from '../integrations/supabase/client';
import './seed-java-summary.js';

const runSeeder = async () => {
  console.log('Starting database seeding...');
  
  try {
    // Check if Java language exists, if not create it
    const { data: javaExists, error: checkError } = await supabase
      .from('programming_languages')
      .select('id')
      .eq('name', 'Java')
      .maybeSingle();
      
    if (checkError) {
      console.error('Error checking for Java language:', checkError);
    }
    
    if (!javaExists) {
      // Insert Java language
      const { error: insertError } = await supabase
        .from('programming_languages')
        .insert({
          name: 'Java',
          description: 'Java est un langage de programmation orienté objet très utilisé pour le développement d\'applications d\'entreprise et Android.',
          icon: 'coffee',
          image_url: 'https://upload.wikimedia.org/wikipedia/en/thumb/3/30/Java_programming_language_logo.svg/1200px-Java_programming_language_logo.svg.png',
          color: '#f89820'
        });
        
      if (insertError) {
        console.error('Error inserting Java language:', insertError);
      } else {
        console.log('Java language inserted successfully');
      }
    } else {
      console.log('Java language already exists in the database');
    }
    
    console.log('Database seeding completed');
  } catch (error) {
    console.error('Error during database seeding:', error);
  }
};

runSeeder();
