ALTER TABLE public.supplier_products
ADD COLUMN IF NOT EXISTS business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE;

-- 기존 데이터 마이그레이션 로직
DO $$
DECLARE
  action_goods_id UUID;
  user_rec RECORD;
BEGIN
  -- 각 유저별로 '액션굿즈' 사업자가 있는지 확인
  FOR user_rec IN SELECT DISTINCT user_id FROM public.supplier_products LOOP
    SELECT id INTO action_goods_id FROM public.businesses 
      WHERE user_id = user_rec.user_id AND company_name = '액션굿즈' LIMIT 1;
      
    IF action_goods_id IS NULL THEN
      -- 액션굿즈가 없으면 대표(is_main) 사업자로 지정
      SELECT id INTO action_goods_id FROM public.businesses 
        WHERE user_id = user_rec.user_id AND is_main = true LIMIT 1;
    END IF;
    
    -- 그래도 없으면 업데이트 안 함. 찾은 사업자가 있으면 업데이트.
    IF action_goods_id IS NOT NULL THEN
      UPDATE public.supplier_products SET business_id = action_goods_id WHERE user_id = user_rec.user_id AND business_id IS NULL;
    END IF;
  END LOOP;
END $$;
