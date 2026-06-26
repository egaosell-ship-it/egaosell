import { createClient } from '@supabase/supabase-js';
import { loadEnvConfig } from '@next/env';
import path from 'path';

loadEnvConfig(path.resolve(__dirname));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupplierProducts() {
  console.log('Fetching supplier_products data...');
  const { data: products, error } = await supabase
    .from('supplier_products')
    .select('id, supply_product_name, business_id')
    .limit(5);

  if (error) {
    console.error('Error fetching supplier_products:', error.message);
    return;
  }

  console.log('\n--- Supplier Products (Top 5) ---');
  console.log(products);

  if (products && products.length > 0) {
    const businessIds = [...new Set(products.map(p => p.business_id).filter(Boolean))];
    if (businessIds.length > 0) {
      const { data: businesses, error: bizError } = await supabase
        .from('businesses')
        .select('id, company_name')
        .in('id', businessIds);
        
      if (bizError) {
        console.error('Error fetching businesses:', bizError.message);
      } else {
        console.log('\n--- Linked Businesses ---');
        console.log(businesses);
      }
    } else {
      console.log('\nNo business_id found in the fetched products.');
    }
  } else {
    console.log('\nNo products found.');
  }
}

checkSupplierProducts();
