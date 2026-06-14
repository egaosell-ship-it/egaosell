-- Create product_code_settings table
CREATE TABLE IF NOT EXISTS public.product_code_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform_name VARCHAR(255) NOT NULL,
    supplier_name_delimiter_1 VARCHAR(50) DEFAULT '[',
    supplier_name_delimiter_2 VARCHAR(50) DEFAULT ']',
    price_info_delimiter VARCHAR(50) DEFAULT '-',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.product_code_settings ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own product code settings" 
ON public.product_code_settings FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own product code settings" 
ON public.product_code_settings FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own product code settings" 
ON public.product_code_settings FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own product code settings" 
ON public.product_code_settings FOR DELETE 
USING (auth.uid() = user_id);

-- Create updated_at trigger
CREATE TRIGGER handle_updated_at_product_code_settings
BEFORE UPDATE ON public.product_code_settings
FOR EACH ROW
EXECUTE FUNCTION public.handle_updated_at();
