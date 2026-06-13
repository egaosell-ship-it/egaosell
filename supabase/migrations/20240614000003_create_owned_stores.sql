-- 보유스토어 정보를 저장하는 owned_stores 테이블 생성
CREATE TABLE IF NOT EXISTS public.owned_stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    platform_name VARCHAR(255) NOT NULL,
    login_id VARCHAR(255) NOT NULL,
    site_name VARCHAR(255) NOT NULL,
    store_url VARCHAR(2048) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS(Row Level Security) 활성화
ALTER TABLE public.owned_stores ENABLE ROW LEVEL SECURITY;

-- 정책 생성
CREATE POLICY "Users can view their own owned stores"
    ON public.owned_stores FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own owned stores"
    ON public.owned_stores FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own owned stores"
    ON public.owned_stores FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own owned stores"
    ON public.owned_stores FOR DELETE
    USING (auth.uid() = user_id);

-- 인덱스 생성 (조회 성능 최적화)
CREATE INDEX IF NOT EXISTS owned_stores_user_id_idx ON public.owned_stores(user_id);
CREATE INDEX IF NOT EXISTS owned_stores_business_id_idx ON public.owned_stores(business_id);
