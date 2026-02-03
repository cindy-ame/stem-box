-- 學習計劃資料表
-- 建立順序：3

-- 學習計劃主表
CREATE TABLE IF NOT EXISTS learning_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'completed')),
  generated_by_ai BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 週計劃
CREATE TABLE IF NOT EXISTS week_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  learning_plan_id UUID NOT NULL REFERENCES learning_plans(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  themes JSONB, -- [{name: "農場動物", english: "Farm Animals"}]
  primary_materials TEXT[], -- 主教材項目 ID
  support_materials TEXT[], -- 輔助教材項目 ID
  sight_words_goal TEXT[],
  sentence_patterns_goal TEXT[],
  ai_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 日計劃
CREATE TABLE IF NOT EXISTS day_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  week_plan_id UUID NOT NULL REFERENCES week_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 1 AND 7),
  ai_tips TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 每日任務
CREATE TABLE IF NOT EXISTS day_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  day_plan_id UUID NOT NULL REFERENCES day_plans(id) ON DELETE CASCADE,
  task_type TEXT NOT NULL CHECK (task_type IN ('read', 'listen', 'play', 'review', 'activity')),
  material_item_id TEXT REFERENCES material_items(id),
  title TEXT NOT NULL,
  description TEXT,
  duration INTEGER, -- 分鐘
  time_slot TEXT DEFAULT 'anytime' CHECK (time_slot IN ('morning', 'afternoon', 'evening', 'anytime')),
  interaction_tips TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_learning_plans_user_id ON learning_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_week_plans_learning_plan_id ON week_plans(learning_plan_id);
CREATE INDEX IF NOT EXISTS idx_day_plans_week_plan_id ON day_plans(week_plan_id);
CREATE INDEX IF NOT EXISTS idx_day_tasks_day_plan_id ON day_tasks(day_plan_id);

-- RLS 政策
ALTER TABLE learning_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE week_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE day_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own learning plans" ON learning_plans
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own week plans" ON week_plans
  FOR ALL USING (
    learning_plan_id IN (
      SELECT id FROM learning_plans WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own day plans" ON day_plans
  FOR ALL USING (
    week_plan_id IN (
      SELECT wp.id FROM week_plans wp
      JOIN learning_plans lp ON wp.learning_plan_id = lp.id
      WHERE lp.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own day tasks" ON day_tasks
  FOR ALL USING (
    day_plan_id IN (
      SELECT dp.id FROM day_plans dp
      JOIN week_plans wp ON dp.week_plan_id = wp.id
      JOIN learning_plans lp ON wp.learning_plan_id = lp.id
      WHERE lp.user_id = auth.uid()
    )
  );
