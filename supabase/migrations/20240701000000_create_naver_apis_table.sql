-- Create naver_apis table
CREATE TABLE IF NOT EXISTS public.naver_apis (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT '커머스API',
  app_id TEXT NOT NULL,
  app_secret TEXT NOT NULL,
  api_ip TEXT,
  expire_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.naver_apis ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own naver_apis" 
  ON public.naver_apis FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own naver_apis" 
  ON public.naver_apis FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own naver_apis" 
  ON public.naver_apis FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own naver_apis" 
  ON public.naver_apis FOR DELETE 
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER set_naver_apis_updated_at
BEFORE UPDATE ON public.naver_apis
FOR EACH ROW
EXECUTE FUNCTION public.set_current_timestamp_updated_at();
