import { Client } from 'pg';

const connectionString = 'postgres://postgres.zuxnkhfysjytctwwlyee:TlaWngks8859!!@aws-0-ap-northeast-2.pooler.supabase.com:6543/postgres';

async function runMigration() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    
    // Add product_registered_at
    const res = await client.query(`
      ALTER TABLE supplier_products
      ADD COLUMN IF NOT EXISTS product_registered_at TIMESTAMPTZ;
    `);
    
    console.log("Migration executed successfully", res);
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    await client.end();
  }
}

runMigration();
