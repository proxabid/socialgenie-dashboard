// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = "https://dybcafhmzczgjgsdhilv.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5YmNhZmhtemN6Z2pnc2RoaWx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMwNzI1NjUsImV4cCI6MjA0ODY0ODU2NX0.KP2kzm60KarO-oV1ZTVS8XOdp7B4dn_0HsUKY3H54tU";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);