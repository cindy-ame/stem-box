import React, { useState } from 'react';
import {
  ChevronLeft, Plus, Sparkles, Users, Heart, Clock, Baby, Search,
  FlaskConical, Monitor, Wrench, Palette, Calculator, BookOpen,
  SlidersHorizontal, X, Check
} from 'lucide-react';

// Icon 映射
const categoryIcons: Record<string, React.ReactNode> = {
  science: <FlaskConical size={14} />,
  technology: <Monitor size={14} />,
  engineering: <Wrench size={14} />,
  art: <Palette size={14} />,
  math: <Calculator size={14} />,
  language: <BookOpen size={14} />,
};

interface IdeasPageProps {
  onBack: () => void;
}

// 範例點子資料（支援多分類）
const sampleIdeas = [
  {
    id: '1',
    title: '農場動物配對遊戲',
    description: '用動物圖卡或玩偶玩配對，找到時說「We see some ___!」',
    materials: ['JYSW #10'],
    ageRange: '2-4歲',
    duration: 10,
    categories: ['language', 'science'], // 語言 + 科學（認識動物）
    source: 'ai',
    likes: 24,
  },
  {
    id: '2',
    title: '形狀捉迷藏',
    description: '在家裡找各種形狀，找到時說「Can you see the circle?」',
    materials: ['JYSW #14', 'FLR #13'],
    ageRange: '2-5歲',
    duration: 15,
    categories: ['math', 'language'], // 數學 + 語言
    source: 'ai',
    likes: 18,
  },
  {
    id: '3',
    title: '字母沙盤練習',
    description: '在沙子或鹽巴上用手指寫字母，邊寫邊念發音',
    materials: ['JPR'],
    ageRange: '3-6歲',
    duration: 10,
    categories: ['language', 'art'], // 語言 + 藝術（感官創作）
    source: 'community',
    likes: 32,
  },
  {
    id: '4',
    title: '紙杯疊疊樂',
    description: '用紙杯搭建各種結構，探索平衡與穩定性',
    materials: ['紙杯 10-20 個'],
    ageRange: '2-5歲',
    duration: 15,
    categories: ['engineering', 'math'], // 工程 + 數學
    source: 'community',
    likes: 45,
  },
  {
    id: '5',
    title: '彩虹牛奶實驗',
    description: '在牛奶中滴入食用色素，再加洗碗精看顏色擴散',
    materials: ['牛奶', '食用色素', '洗碗精'],
    ageRange: '3-6歲',
    duration: 10,
    categories: ['science', 'art'], // 科學 + 藝術
    source: 'ai',
    likes: 67,
  },
  {
    id: '6',
    title: '點點藝術創作',
    description: '用棉花棒沾顏料點出圖案，練習精細動作與創意',
    materials: ['棉花棒', '水彩顏料', '圖畫紙'],
    ageRange: '2-4歲',
    duration: 20,
    categories: ['art'], // 純藝術
    source: 'community',
    likes: 38,
  },
];

const categories = [
  { id: 'all', label: '全部' },
  { id: 'science', label: '科學' },
  { id: 'technology', label: '科技' },
  { id: 'engineering', label: '工程' },
  { id: 'art', label: '藝術' },
  { id: 'math', label: '數學' },
  { id: 'language', label: '語言' },
];

const sourceConfig = {
  ai: { icon: <Sparkles size={12} />, label: 'AI 推薦', color: 'bg-purple-100 text-purple-600' },
  community: { icon: <Users size={12} />, label: '社群', color: 'bg-blue-100 text-blue-600' },
  mine: { icon: <Heart size={12} />, label: '我的', color: 'bg-pink-100 text-pink-600' },
};

export default function IdeasPage({ onBack }: IdeasPageProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // 空陣列 = 全部
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilterPanel, setShowFilterPanel] = useState(false); // 篩選面板開關

  // 切換篩選分類（多選）
  const toggleFilterCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      setSelectedCategories(selectedCategories.filter(c => c !== catId));
    } else {
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  // 清除所有篩選
  const clearFilters = () => {
    setSelectedCategories([]);
  };

  // 篩選點子（AND 邏輯：必須符合所有選擇的分類）
  const filteredIdeas = sampleIdeas.filter(idea => {
    // 沒有選擇任何分類 = 顯示全部
    if (selectedCategories.length > 0) {
      // 點子必須包含所有選擇的分類
      const hasAllCategories = selectedCategories.every(cat => idea.categories.includes(cat));
      if (!hasAllCategories) return false;
    }
    // 搜尋篩選
    if (searchQuery && !idea.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const activeFilterCount = selectedCategories.length;

  return (
    <div className="pb-20 bg-white">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={24} className="text-textMain" />
            </button>
            <h1 className="text-lg font-bold text-textMain">點子庫</h1>
          </div>
          <div className="flex items-center gap-2">
            {/* 篩選按鈕 */}
            <button
              onClick={() => setShowFilterPanel(!showFilterPanel)}
              className={`relative w-9 h-9 rounded-xl flex items-center justify-center ${
                activeFilterCount > 0 ? 'bg-accent text-white' : 'bg-cardBgSoft text-textSub'
              }`}
            >
              <SlidersHorizontal size={18} />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-white text-accent text-xs font-bold rounded-full flex items-center justify-center border border-accent">
                  {activeFilterCount}
                </span>
              )}
            </button>
            {/* 新增按鈕 */}
            <button className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-white">
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* 搜尋欄 */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textSub" size={18} />
            <input
              type="text"
              placeholder="搜尋點子..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-cardBgSoft rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-accent border border-transparent focus:border-accent"
            />
          </div>
        </div>
      </div>

      {/* 篩選面板 */}
      {showFilterPanel && (
        <div className="mx-4 mt-4 bg-white rounded-2xl border border-gray-200 shadow-lg overflow-hidden">
          {/* 面板標題 */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilterPanel(false)}
                className="p-1 hover:bg-gray-100 rounded-lg -ml-1"
              >
                <X size={18} className="text-textSub" />
              </button>
              <h3 className="font-semibold text-textMain">篩選條件</h3>
            </div>
            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-accent"
              >
                清除全部
              </button>
            )}
          </div>

          {/* 分類篩選 */}
          <div className="p-4">
            <p className="text-xs text-textSub mb-2">分類（可多選）</p>
            <div className="flex flex-wrap gap-2">
              {categories.filter(cat => cat.id !== 'all').map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => toggleFilterCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    selectedCategories.includes(cat.id)
                      ? 'bg-accent text-white'
                      : 'bg-cardBgSoft text-textSub border border-gray-200'
                  }`}
                >
                  {selectedCategories.includes(cat.id) && <Check size={14} />}
                  {categoryIcons[cat.id]}
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 已啟用篩選提示 */}
      {activeFilterCount > 0 && !showFilterPanel && (
        <div className="mx-4 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategories.map(catId => {
              const cat = categories.find(c => c.id === catId);
              return (
                <span
                  key={catId}
                  className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs"
                >
                  {categoryIcons[catId]}
                  {cat?.label}
                  <button onClick={() => toggleFilterCategory(catId)} className="ml-0.5">
                    <X size={12} />
                  </button>
                </span>
              );
            })}
          </div>
          <button
            onClick={clearFilters}
            className="text-xs text-textSub hover:text-accent"
          >
            清除
          </button>
        </div>
      )}

      {/* 點子列表 */}
      <div className="p-4 space-y-3">
        {filteredIdeas.map((idea) => {
          const source = sourceConfig[idea.source as keyof typeof sourceConfig];
          return (
            <div
              key={idea.id}
              className="bg-cardBgSoft rounded-2xl p-4 border border-amber-100 card-hover"
            >
              {/* 標題列 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-textMain text-sm">{idea.title}</h3>
                  {/* 分類標籤 */}
                  <div className="flex items-center gap-1 mt-1">
                    {idea.categories.map(catId => (
                      <span key={catId} className="flex items-center gap-0.5 text-xs text-textSub">
                        {categoryIcons[catId]}
                      </span>
                    ))}
                  </div>
                </div>
                <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs ${source.color}`}>
                  {source.icon}
                  {source.label}
                </span>
              </div>

              {/* 描述 */}
              <p className="text-xs text-textSub mb-3 leading-relaxed">{idea.description}</p>

              {/* 教材標籤 */}
              <div className="flex flex-wrap gap-1 mb-3">
                {idea.materials.map((mat) => (
                  <span
                    key={mat}
                    className="text-xs bg-white text-textSub px-2 py-0.5 rounded border border-gray-200"
                  >
                    {mat}
                  </span>
                ))}
              </div>

              {/* 底部資訊 */}
              <div className="flex items-center justify-between text-xs text-textSub">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1">
                    <Baby size={14} />
                    {idea.ageRange}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {idea.duration}分鐘
                  </span>
                </div>
                <button className="flex items-center gap-1 text-pink-500">
                  <Heart size={14} />
                  {idea.likes}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* AI 推薦提示 */}
      <div className="mx-4 mb-4 bg-purple-50 rounded-2xl p-4 border border-purple-100">
        <div className="flex items-start gap-2">
          <Sparkles className="text-purple-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-purple-800 font-medium mb-1">AI 推薦</p>
            <p className="text-xs text-purple-600 leading-relaxed">
              根據你本週的學習計劃，推薦「農場動物配對遊戲」來加強 Sight Words！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
