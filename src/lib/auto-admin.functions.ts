import { createServerFn } from "@tanstack/react-start";
import { createClient } from "@supabase/supabase-js";

const SUPER_ADMIN_EMAILS = [
  'ericmnisi856@gmail.com',
  'accounts@connectstudio.co.za'
];

/**
 * Automatically grant admin role to super admin emails after signup/signin
 */
export const grantAdminIfSuperUser = createServerFn({ method: "POST" })
  .handler(async ({ request }) => {
    const supabaseUrl = process.env["SUPABASE_URL"];
    const supabaseKey = process.env["SUPABASE_PUBLISHABLE_KEY"];

    if (!supabaseUrl || !supabaseKey) {
      return { success: false, error: "Missing Supabase credentials" };
    }

    // Get the authorization header
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return { success: false, error: "No authorization header" };
    }

    const token = authHeader.replace('Bearer ', '');

    // Create Supabase client with user's token
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
      auth: {
        persistSession: false,
      },
    });

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        return { success: false, error: "Could not get user" };
      }

      // Check if user is a super admin
      if (!SUPER_ADMIN_EMAILS.includes(user.email || '')) {
        return { success: false, error: "Not a super admin email" };
      }

      // Create admin client for inserting roles
      const adminClient = createClient(supabaseUrl, supabaseKey);

      // Try to insert admin role (will fail silently if RLS blocks it)
      const { error: roleError } = await adminClient
        .from('user_roles')
        .upsert(
          { user_id: user.id, role: 'admin' },
          { onConflict: 'user_id,role' }
        );

      if (roleError) {
        console.log('Note: Role insertion blocked by RLS (expected), role assignment needs migration');
        // This is expected - the migration needs to be deployed
        return { 
          success: false, 
          needsMigration: true,
          userId: user.id,
          email: user.email,
          message: 'Admin role assignment requires database migration'
        };
      }

      return { 
        success: true, 
        message: 'Admin role granted',
        userId: user.id,
        email: user.email
      };
    } catch (error) {
      console.error('Auto-admin error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }
  });
