import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://alnyfziczijbgkrhvsat.supabase.co';
const supabaseAnonKey = 'sb_publishable_IVrLnzJ6dCwJUKrOyQOU6Q_j1BVXKJt';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
export const STORAGE_BUCKET = 'media-files';
