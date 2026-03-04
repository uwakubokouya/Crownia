-- Enums
CREATE TYPE event_type AS ENUM ('visit', 'payment', 'bottle', 'extend', 'after', 'memo');
CREATE TYPE customer_stage AS ENUM ('interest', 'build', 'trust', 'depend', 'highvalue');
CREATE TYPE customer_type AS ENUM ('approval', 'lonely', 'control', 'hobby', 'status');
CREATE TYPE danger_level AS ENUM ('safe', 'caution', 'danger', 'critical');
CREATE TYPE user_plan AS ENUM ('free', 'basic', 'pro');
CREATE TYPE message_result AS ENUM ('reply', 'read_only', 'no_reaction', 'visit_fixed', 'other');
CREATE TYPE ai_recommendation_category AS ENUM ('attack', 'growth', 'defense');

-- 1. profiles
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  line_user_id TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  plan user_plan DEFAULT 'free',
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  is_user_consented_raw BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. customers
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  display_name_normalized TEXT NOT NULL,
  stage customer_stage NOT NULL DEFAULT 'interest',
  current_type customer_type,
  current_type_confidence NUMERIC,
  second_best_type customer_type,
  danger_level danger_level DEFAULT 'safe',
  notes TEXT,
  tags TEXT[],
  style_profile JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, display_name_normalized)
);

-- 3. events
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  type event_type NOT NULL,
  amount NUMERIC,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. conversation_summaries
CREATE TABLE conversation_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  raw_text_encrypted TEXT,
  summary_text TEXT NOT NULL,
  keywords TEXT[],
  sentiment_score NUMERIC,
  inferred_features JSONB,
  style_contrib JSONB,
  is_user_consented_raw BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  message_text TEXT NOT NULL,
  suggested_send_time_window TEXT,
  sent_at TIMESTAMPTZ,
  result message_result,
  result_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. ai_recommendations
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  category ai_recommendation_category NOT NULL,
  goal TEXT,
  probability NUMERIC,
  reason_lines TEXT[],
  suggested_message_text TEXT,
  suggested_send_time_window TEXT,
  expected_uplift_min NUMERIC,
  expected_uplift_max NUMERIC,
  meta JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. stage_history
CREATE TABLE stage_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  customer_id UUID REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  from_stage customer_stage,
  to_stage customer_stage NOT NULL,
  reason JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Function & Trigger for automatically creating a profile when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, line_user_id, display_name, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'sub', new.id::text),
    new.raw_user_meta_data->>'name',
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversation_summaries ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stage_history ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can CRUD own customers" ON customers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own events" ON events FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own conversation_summaries" ON conversation_summaries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own messages" ON messages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own ai_recommendations" ON ai_recommendations FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can CRUD own stage_history" ON stage_history FOR ALL USING (auth.uid() = user_id);
