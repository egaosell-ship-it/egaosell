-- Add billing fields to subscriptions table
ALTER TABLE public.subscriptions
ADD COLUMN IF NOT EXISTS customer_key TEXT,
ADD COLUMN IF NOT EXISTS billing_key TEXT,
ADD COLUMN IF NOT EXISTS next_billing_date TIMESTAMP WITH TIME ZONE;
