// backend/src/db/supabase.ts
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
// Use the new service role key variable
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; 

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables.');
}

// Initialize the client with the admin privileges
export const supabase = createClient(supabaseUrl, supabaseServiceKey);