DROP POLICY IF EXISTS "Users can create own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can update own subscriptions" ON public.subscriptions;
DROP POLICY IF EXISTS "Users can create own billing history" ON public.billing_history;
DROP POLICY IF EXISTS "Users can update own billing history" ON public.billing_history;

-- Add INSERT and UPDATE policies for subscriptions
CREATE POLICY "Users can create own subscriptions" ON public.subscriptions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own subscriptions" ON public.subscriptions FOR UPDATE USING (auth.uid() = user_id);

-- Add INSERT and UPDATE policies for billing_history
CREATE POLICY "Users can create own billing history" ON public.billing_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own billing history" ON public.billing_history FOR UPDATE USING (auth.uid() = user_id);
