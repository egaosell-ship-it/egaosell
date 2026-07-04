-- Create product_collected table
CREATE TABLE product_collected (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    product_id TEXT,
    product_name TEXT NOT NULL,
    price INTEGER,
    image_url TEXT,
    description TEXT,
    reviews JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Add index for user_id to improve query performance
CREATE INDEX product_collected_user_id_idx ON product_collected(user_id);

-- Enable RLS
ALTER TABLE product_collected ENABLE ROW LEVEL SECURITY;

-- Policies for product_collected
CREATE POLICY "Users can view their own product_collected"
    ON product_collected FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own product_collected"
    ON product_collected FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own product_collected"
    ON product_collected FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own product_collected"
    ON product_collected FOR DELETE
    USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_product_collected_updated_at
    BEFORE UPDATE ON product_collected
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at_timestamp();
