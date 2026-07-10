-- Add detail_images column to product_collected table
ALTER TABLE product_collected
ADD COLUMN IF NOT EXISTS detail_images TEXT[] DEFAULT '{}';

-- (Optional) Update database comments
COMMENT ON COLUMN product_collected.detail_images IS '상세 이미지 URL 배열';
