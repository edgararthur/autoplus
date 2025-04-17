// Script to apply the profiles insert policy
// Run with: node scripts/apply-profiles-policy.js

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Important: Use the service role key for admin operations
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase URL or service role key in environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function applyProfilesPolicy() {
  try {
    const { error } = await supabase.rpc('apply_profiles_insert_policy');
    
    if (error) {
      // If RPC doesn't exist, run the SQL directly
      console.log('Applying policy directly with SQL...');
      const { error: sqlError } = await supabase.from('_manual_sql').select('*').execute(`
        CREATE POLICY "Users can insert their own profile"
        ON profiles FOR INSERT
        USING (auth.uid() = id);
      `);
      
      if (sqlError) {
        console.error('Error applying policy:', sqlError);
      } else {
        console.log('Successfully applied profiles insert policy');
      }
    } else {
      console.log('Successfully applied profiles insert policy');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}

// Execute the function
applyProfilesPolicy(); 