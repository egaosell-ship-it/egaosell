-- Add product_registered_at column to supplier_products table
ALTER TABLE supplier_products
ADD COLUMN product_registered_at TIMESTAMPTZ;
