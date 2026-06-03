import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wbfreqorkvntlboynxbp.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kPL7QJcbG_ZHjuOjtXl5Ng_6dA6uMKg';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function prepareUsers() {
  const users = [
    { email: 'test1@test.com', password: 'test123!', hasSub: false },
    { email: 'test2@test.com', password: 'test123!', hasSub: true }
  ];

  for (const u of users) {
    console.log(`\n[Account Setup]: ${u.email}`);

    // 1. SignUp / SignIn
    let { data: authData, error: authError } = await supabase.auth.signUp({
      email: u.email,
      password: u.password,
    });

    if (authError && authError.message.includes('already registered')) {
       const signRes = await supabase.auth.signInWithPassword({
         email: u.email,
         password: u.password
       });
       authData = signRes.data;
       authError = signRes.error;
    }

    if (authError || !authData.user) {
      console.error(`=> Error:`, authError?.message);
      continue;
    }

    const userId = authData.user.id;
    console.log(`=> Logged in! UUID: ${userId}`);

    // 2. Set Subscription for test2
    if (u.hasSub) {
      // 기존 내역 삭제 후 삽입
      await supabase.from('subscriptions').delete().eq('user_id', userId);
      
      const { error: dbError } = await supabase.from('subscriptions').insert({
          user_id: userId,
          plan_type: 'Pro',
          status: 'active',
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });

      if (dbError) {
         console.error(`=> Insert Subscription Failed:`, dbError.message);
      } else {
         console.log(`=> [PRO] Subscription inserted in DB successfully.`);
      }
    } else {
       // test1은 무조건 구독 삭제
       await supabase.from('subscriptions').delete().eq('user_id', userId);
       console.log(`=> [FREE] Subscription removed from DB.`);
    }
  }
  console.log('\n--- Setup Complete ---');
}

prepareUsers();
