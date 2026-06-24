-- Create supplier_products table
CREATE TABLE supplier_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    naver_product_id TEXT,
    image_url TEXT,
    supplier_name TEXT,
    brand_name TEXT,
    supply_product_name TEXT NOT NULL,
    supply_price INTEGER,
    sell_price INTEGER,
    registered_platform TEXT,
    net_profit INTEGER,
    is_used BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for user_id to improve query performance
CREATE INDEX supplier_products_user_id_idx ON supplier_products(user_id);

-- Enable RLS
ALTER TABLE supplier_products ENABLE ROW LEVEL SECURITY;

-- Policies for supplier_products
CREATE POLICY "Users can view their own supplier_products"
    ON supplier_products FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own supplier_products"
    ON supplier_products FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own supplier_products"
    ON supplier_products FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own supplier_products"
    ON supplier_products FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_supplier_products_updated_at
    BEFORE UPDATE ON supplier_products
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_timestamp();
