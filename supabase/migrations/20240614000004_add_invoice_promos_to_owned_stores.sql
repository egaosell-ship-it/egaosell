-- owned_stores 테이블에 송장홍보문구 1, 2 컬럼 추가
ALTER TABLE public.owned_stores
ADD COLUMN IF NOT EXISTS invoice_promo_1 VARCHAR(1000) DEFAULT '',
ADD COLUMN IF NOT EXISTS invoice_promo_2 VARCHAR(1000) DEFAULT '';
