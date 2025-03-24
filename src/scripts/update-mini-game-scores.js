
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
    const { data: columnExists, error: checkError } = await supabase
      .rpc('check_column_exists', { 
        table_name: 'mini_game_scores', 
        column_name: 'difficulty' 
      });
    
    if (checkError) {
      console.error('Error checking if column exists:', checkError);
      return;
    }
    
    // If the column doesn't exist, add it
    if (!columnExists) {
      // Create an RPC function to check if a column exists
      const { error: rpcError } = await supabase.rpc('create_check_column_exists_function');
      
      if (rpcError) {
        console.error('Error creating RPC function:', rpcError);
        return;
      }
      
      // Add the difficulty column to the mini_game_scores table
      const { error: alterError } = await supabase
        .rpc('add_difficulty_column_to_mini_game_scores');
      
      if (alterError) {
        console.error('Error adding difficulty column:', alterError);
        return;
      }
      
      console.log('Successfully added difficulty column to mini_game_scores table');
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
