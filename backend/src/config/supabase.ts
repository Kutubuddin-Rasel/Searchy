import dotenv from "dotenv";
dotenv.config({path:"./.env"});
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABSE_URL!;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export const supabase = createClient(supabaseUrl,supabaseServiceRoleKey);