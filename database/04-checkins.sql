-- 打卡紀錄資料表
-- 建立順序：4

-- 打卡紀錄
CREATE TABLE IF NOT EXISTS check_ins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  child_id UUID NOT NULL REFERENCES children(id) ON DELETE CASCADE,
  day_plan_id UUID REFERENCES day_plans(id),
  date DATE NOT NULL,
  completed_tasks UUID[], -- 完成的任務 ID
  mood TEXT CHECK (mood IN ('great', 'good', 'okay', 'difficult')),
  journal_entry TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, child_id, date) -- 每天只能打卡一次
);

-- 打卡照片
CREATE TABLE IF NOT EXISTS check_in_photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_id UUID NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  photo_url TEXT NOT NULL,
  caption TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- AI 回饋
CREATE TABLE IF NOT EXISTS ai_feedbacks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_in_id UUID NOT NULL REFERENCES check_ins(id) ON DELETE CASCADE,
  feedback_type TEXT NOT NULL CHECK (feedback_type IN ('instant', 'weekly', 'milestone')),
  content TEXT NOT NULL,
  suggestions TEXT[],
  encouragement TEXT,
  next_steps TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_check_ins_user_id ON check_ins(user_id);
CREATE INDEX IF NOT EXISTS idx_check_ins_date ON check_ins(date);
CREATE INDEX IF NOT EXISTS idx_check_in_photos_check_in_id ON check_in_photos(check_in_id);
CREATE INDEX IF NOT EXISTS idx_ai_feedbacks_check_in_id ON ai_feedbacks(check_in_id);

-- RLS 政策
ALTER TABLE check_ins ENABLE ROW LEVEL SECURITY;
ALTER TABLE check_in_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_feedbacks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own check-ins" ON check_ins
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own check-in photos" ON check_in_photos
  FOR ALL USING (
    check_in_id IN (
      SELECT id FROM check_ins WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view own AI feedbacks" ON ai_feedbacks
  FOR ALL USING (
    check_in_id IN (
      SELECT id FROM check_ins WHERE user_id = auth.uid()
    )
  );
