/**
 * Script to apply the order functions SQL migration to the Supabase database
 * 
 * Run with: node scripts/apply-order-functions.js
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_KEY must be set in .env file');
  console.error('\nTo fix this:');
  console.error('1. Make sure SUPABASE_URL and SUPABASE_SERVICE_KEY are in your .env file');
  console.error('2. Get your service role key from Supabase dashboard > Project Settings > API');
  console.error('3. The service key is different from the anon key and starts with "eyJ..."');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Path to migration file
const migrationFilePath = path.join(__dirname, '../supabase/migrations/20240622_add_order_functions.sql');

async function applyMigration() {
  try {
    // Read the migration file
    const migrationSQL = fs.readFileSync(migrationFilePath, 'utf8');
    console.log('Migration file loaded successfully');
    
    // Try using the SQL API directly to execute our SQL
    const { error } = await supabase.from('_sql').select('*').execute(migrationSQL);
    
    if (error) {
      console.error('Error executing SQL directly:', error.message);
      console.log('\nAutomated migration failed. Please apply the migration manually:');
      console.log('1. Log in to the Supabase dashboard');
      console.log('2. Go to SQL Editor');
      console.log('3. Copy and paste the SQL below or upload the file:');
      console.log('   File path: ' + migrationFilePath);
      console.log('\n--- SQL Content ---\n');
      console.log(migrationSQL);
      console.log('\n--- End SQL Content ---\n');
      console.log('After running the SQL manually, the following functions should be available:');
      console.log('- create_order_from_cart');
      console.log('- get_order_details');
      process.exit(1);
    }
    
    console.log('Order functions migration applied successfully!');
    console.log('The following SQL functions are now available:');
    console.log('- create_order_from_cart');
    console.log('- get_order_details');
    
  } catch (error) {
    console.error('Error applying migration:', error.message);
    process.exit(1);
  }
}

applyMigration(); 