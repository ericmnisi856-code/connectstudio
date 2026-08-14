// Run this once to create admin user: node init-admin.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const ADMIN_USERS = [
  {
    email: 'ericmnisi856@gmail.com',
    password: 'Connectstudio@123'
  },
  {
    email: 'accounts@connectstudio.co.za',
    password: 'Connectstudio@123'
  }
];

async function createAdmin() {
  console.log('🚀 Creating admin users...\n');

  for (const admin of ADMIN_USERS) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`Processing: ${admin.email}`);
    console.log('='.repeat(60));

    try {
      // Step 1: Sign up the user
      console.log('Step 1: Creating user account...');
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: admin.email,
        password: admin.password,
        options: {
          emailRedirectTo: undefined,
        },
      });

      if (signUpError) {
        if (signUpError.message.includes('already registered')) {
          console.log('✓ User already exists');
        } else {
          throw signUpError;
        }
      } else {
        console.log('✓ User created successfully');
      }

      // Step 2: Sign in to get session
      console.log('\nStep 2: Signing in...');
      const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: admin.email,
        password: admin.password,
      });

      if (signInError) throw signInError;
      if (!signInData.user) throw new Error('No user returned from sign in');

      console.log('✓ Signed in successfully');
      const userId = signInData.user.id;

      // Step 3: Check if table exists
      console.log('\nStep 3: Checking user_roles table...');
      const { error: checkError } = await supabase
        .from('user_roles')
        .select('*')
        .limit(1);

      if (checkError && checkError.message.includes('does not exist')) {
        console.log('⚠️  Table user_roles does not exist.');
        console.log('   Please run MAKE_SUPER_ADMINS.sql in Supabase SQL Editor first!');
        continue;
      }

      // Step 4: Assign admin role
      console.log('\nStep 4: Assigning admin role...');
      const { error: roleError } = await supabase
        .from('user_roles')
        .upsert({ user_id: userId, role: 'admin' }, { onConflict: 'user_id,role' });

      if (roleError) {
        console.error('❌ Error assigning role:', roleError.message);
        console.log(`\n⚠️  Run this SQL manually for ${admin.email}:`);
        console.log(`
INSERT INTO public.user_roles (user_id, role)
VALUES ('${userId}', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;
        `);
        continue;
      }

      console.log('✓ Admin role assigned');

      // Step 5: Verify
      console.log('\nStep 5: Verifying setup...');
      const { data: roleData, error: verifyError } = await supabase
        .from('user_roles')
        .select('*')
        .eq('user_id', userId)
        .eq('role', 'admin')
        .single();

      if (verifyError || !roleData) {
        console.error('❌ Could not verify admin role');
        continue;
      }

      console.log('✓ Admin role verified');
      console.log(`\n✅ SUCCESS: ${admin.email} is now an admin!`);

    } catch (error) {
      console.error(`\n❌ Error for ${admin.email}:`, error.message);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ ADMIN SETUP COMPLETE!');
  console.log('='.repeat(60));
  console.log('\nSuper Admin Users:');
  ADMIN_USERS.forEach(admin => {
    console.log(`  • ${admin.email} / ${admin.password}`);
  });
  console.log('\nYou can now:');
  console.log('1. Go to http://localhost:8081/auth');
  console.log('2. Sign in with any of the above credentials');
  console.log('3. Access the admin dashboard at http://localhost:8081/admin');
  console.log('='.repeat(60) + '\n');
}

createAdmin();
