
/**
 * Script to update the mini_game_scores table to include the difficulty field
 * 
 * Run this script with:
 * npx node src/scripts/update-mini-game-scores.js
 */

import { supabase } from '../integrations/supabase/client.js';

const addDifficultyFieldToMiniGameScores = async () => {
  try {
    console.log('Adding difficulty field to mini_game_scores table...');
    
    // Check if the difficulty column already exists
    const { data, error: checkError } = await supabase
      .from('mini_game_scores')
      .select('difficulty')
      .limit(1);
    
    if (checkError) {
      // Column likely doesn't exist
      console.log('Difficulty column not found, attempting to add it...');
      
      try {
        // Use RPC to execute raw SQL (requires appropriate permissions)
        const { error: rpcError } = await supabase.rpc('execute_sql', {
          sql_query: `ALTER TABLE mini_game_scores ADD COLUMN IF NOT EXISTS difficulty TEXT DEFAULT 'Beginner';`
        });
        
        if (rpcError) {
          console.error('Error adding difficulty column via RPC:', rpcError);
          console.log('Please run the add-difficulty-column edge function instead.');
          return;
        }
        
        console.log('Successfully added difficulty column to mini_game_scores table');
      } catch (sqlError) {
        console.error('Error executing SQL:', sqlError);
        console.log('Please ensure the execute_sql RPC function exists or run the add-difficulty-column edge function.');
      }
    } else {
      console.log('Difficulty column already exists in mini_game_scores table');
    }
    
    // Update any existing rows to have a default difficulty value of 'Beginner'
    const { error: updateError } = await supabase
      .from('mini_game_scores')
      .update({ difficulty: 'Beginner' })
      .is('difficulty', null);
    
    if (updateError) {
      console.error('Error updating existing rows:', updateError);
      return;
    }
    
    console.log('Successfully updated existing rows with default difficulty value');
    
  } catch (error) {
    console.error('Error:', error);
  }
};

// Run the function
addDifficultyFieldToMiniGameScores();
