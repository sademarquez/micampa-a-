// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://zecltlsdkbndhqimpjjo.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InplY2x0bHNka2JuZGhxaW1wampvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk5NzI2MTIsImV4cCI6MjA2NTU0ODYxMn0.bOBZZ8RoPf9AU6FWg5WBIki11oA2xFkZcRS3QBzNZd0";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);