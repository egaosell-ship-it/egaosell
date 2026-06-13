-- Create brands table
CREATE TABLE IF NOT EXISTS public.brands (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  brand_name TEXT NOT NULL,
  code TEXT NOT NULL,
  cafe24_code TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for brands
ALTER TABLE public.brands ENABLE ROW LEVEL SECURITY;

-- Brands RLS Policies
CREATE POLICY "Users can view their own brands" 
  ON public.brands FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own brands" 
  ON public.brands FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own brands" 
  ON public.brands FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own brands" 
  ON public.brands FOR DELETE 
  USING (auth.uid() = user_id);

-- Create platform_margins table
CREATE TABLE IF NOT EXISTS public.platform_margins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  platform_name TEXT NOT NULL,
  commission_rate NUMERIC NOT NULL DEFAULT 0,
  shipping_fee NUMERIC NOT NULL DEFAULT 0,
  other_costs NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for platform_margins
ALTER TABLE public.platform_margins ENABLE ROW LEVEL SECURITY;

-- Platform Margins RLS Policies
CREATE POLICY "Users can view their own platform_margins" 
  ON public.platform_margins FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own platform_margins" 
  ON public.platform_margins FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own platform_margins" 
  ON public.platform_margins FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own platform_margins" 
  ON public.platform_margins FOR DELETE 
  USING (auth.uid() = user_id);

-- Create updated_at trigger function if not exists (assuming it exists or create it)
CREATE OR REPLACE FUNCTION public.set_current_timestamp_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to brands
CREATE TRIGGER set_brands_updated_at
BEFORE UPDATE ON public.brands
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();

-- Apply updated_at trigger to platform_margins
CREATE TRIGGER set_platform_margins_updated_at
BEFORE UPDATE ON public.platform_margins
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
