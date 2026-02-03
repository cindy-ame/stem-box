-- 教材資料表
-- 建立順序：1

-- 教材主表
CREATE TABLE IF NOT EXISTS materials (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  short_name TEXT,
  type TEXT NOT NULL CHECK (type IN ('book_set', 'single_book', 'audio', 'video', 'toy', 'flashcard', 'other')),
  category TEXT NOT NULL CHECK (category IN ('english', 'chinese', 'math', 'art', 'music', 'other')),
  age_range_min INTEGER,
  age_range_max INTEGER,
  publisher TEXT,
  description TEXT,
  total_items INTEGER,
  is_built_in BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 教材項目表（單本書）
CREATE TABLE IF NOT EXISTS material_items (
  id TEXT PRIMARY KEY,
  material_id TEXT NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  item_number INTEGER NOT NULL,
  title TEXT NOT NULL,
  theme TEXT,
  sight_words TEXT[], -- PostgreSQL 陣列
  sentence_pattern TEXT,
  vocabulary_words TEXT[],
  phonics_sound TEXT,
  main_sentence TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 索引
CREATE INDEX IF NOT EXISTS idx_material_items_material_id ON material_items(material_id);
CREATE INDEX IF NOT EXISTS idx_material_items_item_number ON material_items(item_number);

-- 插入預建教材
INSERT INTO materials (id, name, short_name, type, category, age_range_min, age_range_max, publisher, description, total_items, is_built_in)
VALUES
  ('jysw', 'JY Sight Word Readers', 'JYSW', 'book_set', 'english', 24, 72, 'JY Books', '48本 Sight Word 讀本，系統化學習高頻字', 48, true),
  ('flr_a', 'First Little Readers Level A', 'FLR', 'book_set', 'english', 24, 60, 'Scholastic', '25本初階英語讀本，簡單句型入門', 25, true),
  ('jpr', 'JY Phonics Readers', 'JPR', 'book_set', 'english', 24, 72, 'JY Books', '36本自然發音讀本，系統化學習 Phonics', 36, true)
ON CONFLICT (id) DO NOTHING;
