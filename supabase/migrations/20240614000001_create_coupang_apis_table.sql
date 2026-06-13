-- Create coupang_apis table
CREATE TABLE IF NOT EXISTS public.coupang_apis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  purpose TEXT NOT NULL DEFAULT 'OPEN API',
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  vendor_code TEXT NOT NULL,
  access_key TEXT NOT NULL,
  secret_key TEXT NOT NULL,
  expire_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for coupang_apis
ALTER TABLE public.coupang_apis ENABLE ROW LEVEL SECURITY;

-- Coupang APIs RLS Policies
CREATE POLICY "Users can view their own coupang_apis" 
  ON public.coupang_apis FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own coupang_apis" 
  ON public.coupang_apis FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own coupang_apis" 
  ON public.coupang_apis FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own coupang_apis" 
  ON public.coupang_apis FOR DELETE 
  USING (auth.uid() = user_id);

-- Apply updated_at trigger to coupang_apis
CREATE TRIGGER set_coupang_apis_updated_at
BEFORE UPDATE ON public.coupang_apis
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
