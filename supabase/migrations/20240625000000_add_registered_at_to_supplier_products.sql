-- Add product_registered_at column to supplier_products table
ALTER TABLE supplier_products
ADD COLUMN IF NOT EXISTS product_registered_at TIMESTAMPTZ;
