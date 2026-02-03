// 教材類型
export interface Material {
  id: string;
  name: string;
  shortName: string;
  type: 'book_set' | 'single_book' | 'audio' | 'video' | 'toy' | 'flashcard' | 'other';
  category: 'science' | 'technology' | 'engineering' | 'art' | 'math' | 'language' | 'other';
  ageRangeMin?: number;
  ageRangeMax?: number;
  publisher?: string;
  description?: string;
  totalItems?: number;
  isBuiltIn: boolean;
}

// 教材項目（單本書）
export interface MaterialItem {
  id: string;
  materialId: string;
  itemNumber: number;
  title: string;
  theme?: string;
  sightWords?: string[];
  sentencePattern?: string;
  vocabularyWords?: string[];
  phonicsSound?: string;
  mainSentence?: string;
}

// 孩子資料
export interface Child {
  id: string;
  userId: string;
  name: string;
  birthDate: string;
  gender?: 'male' | 'female' | 'other';
  avatar?: string;
}

// 週計劃
export interface WeekPlan {
  id: string;
  weekNumber: number;
  startDate: string;
  endDate: string;
  themes: { name: string; english: string }[];
  sightWordsGoal: string[];
  sentencePatternsGoal: string[];
  aiNotes?: string;
}

// 每日計劃
export interface DayPlan {
  id: string;
  weekPlanId: string;
  date: string;
  dayOfWeek: number;
  tasks: DayTask[];
  aiTips?: string;
}

// 每日任務
export interface DayTask {
  id: string;
  taskType: 'read' | 'listen' | 'play' | 'review' | 'activity';
  materialItemId?: string;
  title: string;
  description?: string;
  duration?: number;
  timeSlot?: 'morning' | 'afternoon' | 'evening' | 'anytime';
  interactionTips?: string;
  order: number;
  completed?: boolean;
}

// 打卡紀錄
export interface CheckIn {
  id: string;
  childId: string;
  date: string;
  completedTasks: string[];
  journalEntry?: string;
  mood?: 'great' | 'good' | 'okay' | 'difficult';
  photos?: string[];
}

// 點子
export interface Idea {
  id: string;
  title: string;
  description: string;
  materials?: string[];
  ageRangeMin?: number;
  ageRangeMax?: number;
  duration?: number;
  category: 'science' | 'technology' | 'engineering' | 'art' | 'math' | 'language' | 'other';
  steps?: string[];
  tips?: string;
  source: 'ai' | 'community' | 'mine';
  likes?: number;
  createdBy?: string;
  createdAt?: string;
}

// 頁面類型
export type PageType = 'home' | 'materials' | 'weekplan' | 'checkin' | 'ideas' | 'settings';
