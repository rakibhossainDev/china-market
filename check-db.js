const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTables() {
  console.log("Checking categories...");
  const { data: categories, error: cErr } = await supabase.from('categories').select('*').limit(1);
  console.log(categories || cErr);

  console.log("Checking sub_categories...");
  const { data: sub_categories, error: scErr } = await supabase.from('sub_categories').select('*').limit(1);
  console.log(sub_categories || scErr);

  console.log("Checking products...");
  const { data: products, error: pErr } = await supabase.from('products').select('*').limit(1);
  console.log(products || pErr);
}
checkTables();
