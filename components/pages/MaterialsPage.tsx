import React, { useState, useRef } from 'react';
import {
  ChevronLeft, Plus, X, BookOpen, Sparkles, ChevronRight,
  FlaskConical, Monitor, Wrench, Palette, Calculator, Package,
  Book, BookMarked, Languages, Camera, Image, Loader2, SlidersHorizontal, Check,
  Link2, Lightbulb
} from 'lucide-react';

// 匯入教材配對資料
import pairingsData from '../../data/pairings.json';
import jyswData from '../../data/materials_jysw.json';
import flrData from '../../data/materials_flr.json';
import jprData from '../../data/materials_jpr.json';
// 匯入教具資料
import lukData from '../../data/tools_luk.json';

// Icon 映射
const categoryIcons: Record<string, React.ReactNode> = {
  science: <FlaskConical size={16} />,
  technology: <Monitor size={16} />,
  engineering: <Wrench size={16} />,
  art: <Palette size={16} />,
  math: <Calculator size={16} />,
  language: <BookOpen size={16} />,
  other: <Package size={16} />,
};

const materialIcons: Record<string, React.ReactNode> = {
  jysw: <Book size={32} className="text-blue-500" />,
  flr: <BookMarked size={32} className="text-green-500" />,
  jpr: <BookOpen size={32} className="text-orange-500" />,
  default: <Book size={32} className="text-amber-600" />,
};

interface MaterialsPageProps {
  onBack: () => void;
}

// 預建教材資料
// 預建書籍（書庫用）
const prebuiltBooks = [
  {
    id: 'jysw',
    name: 'JY Sight Word Readers',
    shortName: 'JYSW',
    totalItems: 48,
    description: 'Sight Word 系統學習，48本讀本',
    categories: ['language'],
    subCategory: 'english',
    ageRange: '2-6歲',
    hasFullData: true,
  },
  {
    id: 'flr',
    name: 'First Little Readers Level A',
    shortName: 'FLR',
    totalItems: 25,
    description: '初階英語讀本，簡單句型入門',
    categories: ['language'],
    subCategory: 'english',
    ageRange: '2-5歲',
    hasFullData: true,
  },
  {
    id: 'jpr',
    name: 'JY Phonics Readers',
    shortName: 'JPR',
    totalItems: 36,
    description: '自然發音學習，A-Z + CVC',
    categories: ['language'],
    subCategory: 'english',
    ageRange: '2-6歲',
    hasFullData: true,
  },
];

// 預建教具（教具庫用）
const prebuiltTools = [
  {
    id: 'luk',
    name: 'LUK 洛可腦力開發',
    shortName: 'LUK',
    totalItems: 9,
    description: '德國邏輯思維訓練教具',
    categories: ['math', 'science'],
    ageRange: '2-99歲',
    hasFullData: true,
    hasSeries: true, // 有子系列可選
  },
  {
    id: '康軒桌遊',
    name: '小康軒桌遊系列',
    shortName: '小康軒',
    totalItems: 1,
    description: '拯救快樂森林等益智桌遊',
    categories: ['math', 'science'],
    ageRange: '3-6歲',
    hasFullData: false,
  },
  {
    id: 'smart_games',
    name: 'Smart Games',
    shortName: 'Smart Games',
    totalItems: 1,
    description: '比利時益智解謎桌遊',
    categories: ['math', 'science'],
    ageRange: '3-99歲',
    hasFullData: false,
  },
  {
    id: 'learning_resources',
    name: 'Learning Resources',
    shortName: 'LR',
    totalItems: 1,
    description: '美國 STEM 教具品牌',
    categories: ['science', 'math', 'engineering'],
    ageRange: '2-8歲',
    hasFullData: false,
  },
  {
    id: 'magnetic_tiles',
    name: '磁力片',
    shortName: '磁力片',
    totalItems: 1,
    description: '立體建構與創意發想',
    categories: ['engineering', 'art'],
    ageRange: '3-8歲',
    hasFullData: false,
  },
  {
    id: 'pattern_blocks',
    name: '圖形積木',
    shortName: '圖形積木',
    totalItems: 1,
    description: '幾何圖形認知與空間概念',
    categories: ['math', 'art'],
    ageRange: '2-6歲',
    hasFullData: false,
  },
];

// STEM/STEAM 分類選項
const categoryOptions = [
  { value: 'science', label: '科學' },
  { value: 'technology', label: '科技' },
  { value: 'engineering', label: '工程' },
  { value: 'art', label: '藝術' },
  { value: 'math', label: '數學' },
  { value: 'language', label: '語言' },
  { value: 'other', label: '其他' },
];

// 年齡選項
const ageOptions = [
  { value: '0-2', label: '0-2歲' },
  { value: '2-4', label: '2-4歲' },
  { value: '3-6', label: '3-6歲' },
  { value: '4-8', label: '4-8歲' },
  { value: '6+', label: '6歲以上' },
];

// 常用主題標籤
// 書籍常用標籤
const bookTags = ['動物', '顏色', '數字', '形狀', '食物', '交通', '家庭', '自然', '身體', '情緒'];
// 教具常用標籤
const toolTags = ['邏輯', '建構', '感官', '精細動作', '空間', '創意', '配對', '排序', '專注力', '手眼協調'];

type ViewMode = 'library' | 'addChoice' | 'addPrebuilt' | 'addCustom' | 'addByPhoto' | 'detail' | 'bookList';

interface UserMaterial {
  id: string;
  name: string;
  shortName?: string;
  totalItems: number;
  categories: string[]; // 支援多分類
  subCategory?: string; // 語言子分類：english, chinese, japanese, etc.
  ageRange: string;
  tags: string[];
  notes: string;
  isPrebuilt: boolean;
  progress: number; // 套書：已學習本數
  readCount: number; // 單本書：閱讀次數
  coverImage?: string; // 封面圖片路徑
}

// 篩選用的分類選項
const filterCategories = [
  { id: 'all', label: '全部' },
  { id: 'science', label: '科學' },
  { id: 'technology', label: '科技' },
  { id: 'engineering', label: '工程' },
  { id: 'art', label: '藝術' },
  { id: 'math', label: '數學' },
  { id: 'language', label: '語言' },
];

// 語言子分類（預設）
const defaultLanguageSubCategories = [
  { id: 'all', label: '全部' },
  { id: 'english', label: '英文' },
  { id: 'chinese', label: '中文' },
  { id: 'japanese', label: '日文' },
];

export default function MaterialsPage({ onBack }: MaterialsPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('library');
  const [selectedMaterial, setSelectedMaterial] = useState<UserMaterial | null>(null);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]); // 空陣列 = 全部
  const [selectedSubCategory, setSelectedSubCategory] = useState('all');
  const [showFilterPanel, setShowFilterPanel] = useState(false); // 篩選面板開關
  const [libraryTab, setLibraryTab] = useState<'materials' | 'books'>('books'); // 教材庫/書庫切換

  // 使用者自訂配對
  interface UserPairing {
    fromId: string;       // 來源教材 ID
    toSetId: string;      // 配對目標教材 ID
    toItemNumber: number; // 配對目標的項目編號（0 表示整本書）
    toTitle: string;
    reason: string;
  }
  const [userPairings, setUserPairings] = useState<UserPairing[]>([]);
  const [showAddPairing, setShowAddPairing] = useState(false);
  const [pairingStep, setPairingStep] = useState<'selectSet' | 'selectItem' | 'addReason'>('selectSet');
  const [pendingPairing, setPendingPairing] = useState<Partial<UserPairing>>({});

  // 教具系列展開狀態
  const [expandedTool, setExpandedTool] = useState<string | null>(null);

  // 自訂語言子分類
  const [customLanguages, setCustomLanguages] = useState<{ id: string; label: string }[]>([]);
  const [newLanguageInput, setNewLanguageInput] = useState('');
  const [showAddLanguage, setShowAddLanguage] = useState(false);

  // 合併預設和自訂語言子分類
  const languageSubCategories = [...defaultLanguageSubCategories, ...customLanguages];

  // 用戶的教材庫
  const [myMaterials, setMyMaterials] = useState<UserMaterial[]>([
    {
      id: 'jysw',
      name: 'JY Sight Word Readers',
      shortName: 'JYSW',
      totalItems: 48,
      categories: ['language'],
      subCategory: 'english',
      ageRange: '2-6歲',
      tags: ['常見字', '句型'],
      notes: '',
      isPrebuilt: true,
      progress: 12,
      readCount: 0,
      coverImage: '/covers/jysw.avif',
    },
    {
      id: 'flr',
      name: 'First Little Readers Level A',
      shortName: 'FLR',
      totalItems: 25,
      categories: ['language'],
      subCategory: 'english',
      ageRange: '2-5歲',
      tags: ['句型', '入門'],
      notes: '',
      isPrebuilt: true,
      progress: 8,
      readCount: 0,
    },
    {
      id: 'jpr',
      name: 'JY Phonics Readers',
      shortName: 'JPR',
      totalItems: 36,
      categories: ['language'],
      subCategory: 'english',
      ageRange: '2-6歲',
      tags: ['自然發音', 'Phonics'],
      notes: '',
      isPrebuilt: true,
      progress: 5,
      readCount: 0,
    },
    {
      id: 'sample_single',
      name: 'Brown Bear, Brown Bear',
      totalItems: 1,
      categories: ['language', 'art'],
      subCategory: 'english',
      ageRange: '1-4歲',
      tags: ['顏色', '動物'],
      notes: '',
      isPrebuilt: false,
      progress: 0,
      readCount: 5,
      coverImage: '/covers/brown.webp',
    },
  ]);

  // 新增自訂教材的表單狀態
  const [customForm, setCustomForm] = useState({
    name: '',
    totalItems: '',
    categories: ['language'] as string[],
    subCategory: 'english',
    ageRange: '2-4',
    tags: [] as string[],
    notes: '',
  });
  const [newTag, setNewTag] = useState('');

  // 拍照辨識相關狀態
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{
    name: string;
    author?: string;
    publisher?: string;
    categories: string[];
    ageRange: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 處理圖片選擇
  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
        // 模擬 AI 分析
        simulateAnalysis();
      };
      reader.readAsDataURL(file);
    }
  };

  // 模擬 AI 分析（之後會替換成真正的 API 調用）
  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);

    // 模擬 2 秒的分析時間
    setTimeout(() => {
      setAnalysisResult({
        name: 'The Very Hungry Caterpillar',
        author: 'Eric Carle',
        publisher: 'Penguin Books',
        categories: ['language', 'science'], // 範例：繪本同時有語言和科學元素
        ageRange: '2-4',
      });
      setIsAnalyzing(false);
    }, 2000);
  };

  // 使用辨識結果建立教材
  const createFromAnalysis = () => {
    if (!analysisResult) return;

    // 將結果填入自訂表單
    setCustomForm({
      ...customForm,
      name: analysisResult.name,
      totalItems: '1',
      categories: analysisResult.categories,
      ageRange: analysisResult.ageRange,
    });

    // 清除拍照狀態
    setPhotoPreview(null);
    setAnalysisResult(null);

    // 跳轉到自訂表單讓用戶確認
    setViewMode('addCustom');
  };

  // 新增預建教材（書或教具）
  const addPrebuiltMaterial = (material: typeof prebuiltBooks[0] | typeof prebuiltTools[0]) => {
    if (myMaterials.find(m => m.id === material.id)) {
      alert('您已經加入這套教材了！');
      return;
    }

    const newMaterial: UserMaterial = {
      id: material.id,
      name: material.name,
      shortName: material.shortName,
      totalItems: material.totalItems,
      categories: material.categories,
      subCategory: 'subCategory' in material ? material.subCategory : undefined,
      ageRange: material.ageRange,
      tags: [],
      notes: '',
      isPrebuilt: true,
      progress: 0,
      readCount: 0,
    };

    setMyMaterials([...myMaterials, newMaterial]);
    setViewMode('library');
  };

  // 新增自訂教材
  const addCustomMaterial = () => {
    if (!customForm.name.trim()) {
      alert('請輸入教材名稱');
      return;
    }

    const newMaterial: UserMaterial = {
      id: `custom_${Date.now()}`,
      name: customForm.name,
      totalItems: parseInt(customForm.totalItems) || 1,
      categories: customForm.categories,
      subCategory: customForm.categories.includes('language') ? customForm.subCategory : undefined,
      ageRange: ageOptions.find(a => a.value === customForm.ageRange)?.label || '2-4歲',
      tags: customForm.tags,
      notes: customForm.notes,
      isPrebuilt: false,
      progress: 0,
      readCount: 0,
    };

    setMyMaterials([...myMaterials, newMaterial]);
    setCustomForm({ name: '', totalItems: '', categories: ['language'], subCategory: 'english', ageRange: '2-4', tags: [], notes: '' });
    setViewMode('library');
  };

  // 新增標籤
  const addTag = (tag: string) => {
    if (tag && !customForm.tags.includes(tag)) {
      setCustomForm({ ...customForm, tags: [...customForm.tags, tag] });
    }
    setNewTag('');
  };

  // 移除標籤
  const removeTag = (tag: string) => {
    setCustomForm({ ...customForm, tags: customForm.tags.filter(t => t !== tag) });
  };

  // 新增自訂語言
  const addCustomLanguage = () => {
    if (newLanguageInput.trim()) {
      const id = newLanguageInput.toLowerCase().replace(/\s+/g, '_');
      if (!languageSubCategories.find(l => l.id === id)) {
        setCustomLanguages([...customLanguages, { id, label: newLanguageInput.trim() }]);
      }
      setNewLanguageInput('');
      setShowAddLanguage(false);
    }
  };

  // 切換篩選分類（多選）
  const toggleFilterCategory = (catId: string) => {
    if (selectedCategories.includes(catId)) {
      // 取消選擇
      const newCategories = selectedCategories.filter(c => c !== catId);
      setSelectedCategories(newCategories);
      // 如果沒有選擇語言，重置子分類
      if (!newCategories.includes('language')) {
        setSelectedSubCategory('all');
      }
    } else {
      // 新增選擇
      setSelectedCategories([...selectedCategories, catId]);
    }
  };

  // 清除所有篩選
  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedSubCategory('all');
  };

  // 調整閱讀次數（單本書）- 保留但未使用
  const updateReadCount = (materialId: string, delta: number) => {
    setMyMaterials(materials =>
      materials.map(m =>
        m.id === materialId ? { ...m, readCount: Math.max(0, m.readCount + delta) } : m
      )
    );
    if (selectedMaterial && selectedMaterial.id === materialId) {
      setSelectedMaterial({ ...selectedMaterial, readCount: Math.max(0, selectedMaterial.readCount + delta) });
    }
  };

  // 篩選後的教材（先按 tab 分類，再套用篩選條件）
  const filteredMaterials = myMaterials.filter(material => {
    // 先根據 tab 過濾：書庫顯示書本（有 language 類別），教具庫顯示教具（沒有 language 類別）
    if (libraryTab === 'books') {
      // 書庫：必須有 language 類別
      if (!material.categories.includes('language')) return false;
    } else {
      // 教具庫：不能有 language 類別
      if (material.categories.includes('language')) return false;
    }

    // 沒有選擇任何分類 = 顯示全部
    if (selectedCategories.length === 0) return true;
    // 教材必須包含所有選擇的分類
    const hasAllCategories = selectedCategories.every(cat => material.categories.includes(cat));
    if (!hasAllCategories) return false;
    // 語言子分類篩選
    if (selectedCategories.includes('language') && selectedSubCategory !== 'all') {
      return material.subCategory === selectedSubCategory;
    }
    return true;
  });

  // 計算已啟用的篩選數量
  const activeFilterCount = selectedCategories.length + (selectedSubCategory !== 'all' ? 1 : 0);

  // 渲染書架視圖
  const renderLibrary = () => (
    <div className="pb-20 bg-white">
      {/* Header */}
      <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center">
            <button onClick={onBack} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={24} className="text-textMain" />
            </button>
            <h1 className="text-lg font-bold text-textMain">{libraryTab === 'books' ? '我的書庫' : '我的教具庫'}</h1>
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
            <button
              onClick={() => setViewMode('addChoice')}
              className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-white"
            >
              <Plus size={20} />
            </button>
          </div>
        </div>

        {/* 教材庫/書庫 切換 Tab */}
        <div className="flex px-4 pb-3 gap-2">
          <button
            onClick={() => setLibraryTab('books')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              libraryTab === 'books'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-textSub'
            }`}
          >
            書庫
          </button>
          <button
            onClick={() => setLibraryTab('materials')}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-colors ${
              libraryTab === 'materials'
                ? 'bg-accent text-white'
                : 'bg-gray-100 text-textSub'
            }`}
          >
            教具庫
          </button>
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
          <div className="p-4 border-b border-gray-100">
            <p className="text-xs text-textSub mb-2">分類（可多選）</p>
            <div className="flex flex-wrap gap-2">
              {filterCategories.filter(cat => cat.id !== 'all').map((cat) => (
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

          {/* 語言子分類篩選 */}
          {selectedCategories.includes('language') && (
            <div className="p-4">
              <p className="text-xs text-textSub mb-2">語言類型</p>
              <div className="flex flex-wrap gap-2">
                {languageSubCategories.map((lang) => (
                  <button
                    key={lang.id}
                    onClick={() => setSelectedSubCategory(lang.id)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                      selectedSubCategory === lang.id
                        ? 'bg-accent text-white'
                        : 'bg-accent/10 text-accent border border-accent/30'
                    }`}
                  >
                    {selectedSubCategory === lang.id && <Check size={14} className="inline mr-1" />}
                    {lang.label}
                  </button>
                ))}
                {/* 新增語言按鈕 */}
                {showAddLanguage ? (
                  <div className="flex items-center gap-1">
                    <input
                      type="text"
                      value={newLanguageInput}
                      onChange={(e) => setNewLanguageInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addCustomLanguage()}
                      placeholder="輸入語言"
                      className="w-20 px-2 py-1.5 text-sm rounded-full border border-accent/50 focus:outline-none focus:ring-1 focus:ring-accent"
                      autoFocus
                    />
                    <button
                      onClick={addCustomLanguage}
                      className="px-2 py-1.5 bg-accent text-white rounded-full text-sm"
                    >
                      加
                    </button>
                    <button
                      onClick={() => { setShowAddLanguage(false); setNewLanguageInput(''); }}
                      className="px-2 py-1.5 text-accent text-sm"
                    >
                      取消
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setShowAddLanguage(true)}
                    className="px-3 py-1.5 rounded-full text-sm border-2 border-dashed border-accent/50 text-accent/60 hover:border-accent hover:text-accent"
                  >
                    + 新增
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 已啟用篩選提示 */}
      {activeFilterCount > 0 && !showFilterPanel && (
        <div className="mx-4 mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2 flex-wrap">
            {selectedCategories.map(catId => {
              const cat = filterCategories.find(c => c.id === catId);
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
            {selectedCategories.includes('language') && selectedSubCategory !== 'all' && (
              <span className="flex items-center gap-1 bg-accent/10 text-accent px-2 py-1 rounded-full text-xs">
                {languageSubCategories.find(l => l.id === selectedSubCategory)?.label}
                <button onClick={() => setSelectedSubCategory('all')} className="ml-0.5">
                  <X size={12} />
                </button>
              </span>
            )}
          </div>
          <button
            onClick={clearFilters}
            className="text-xs text-textSub hover:text-accent"
          >
            清除
          </button>
        </div>
      )}

      {/* 教材書架 */}
      <div className="p-4">
        {/* 數量顯示 */}
        {filteredMaterials.length > 0 && (
          <p className="text-xs text-textSub mb-3">
            {activeFilterCount > 0
              ? `顯示 ${filteredMaterials.length} 套（共 ${myMaterials.length} 套）`
              : `共 ${myMaterials.length} 套教材`
            }
          </p>
        )}

        {filteredMaterials.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-cardBgSoft rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Book size={32} className="text-accent" />
            </div>
            <p className="text-textSub mb-4">
              {myMaterials.length === 0
                ? '您還沒有加入任何教材'
                : '此分類沒有教材'}
            </p>
            <button
              onClick={() => setViewMode('addChoice')}
              className="bg-accent text-white px-6 py-2.5 rounded-xl font-medium"
            >
              新增教材
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-x-4 gap-y-6">
            {(() => {
              // 教具庫：將同品牌的教具組合顯示
              if (libraryTab === 'materials') {
                // 定義品牌分組
                const toolBrands: Record<string, { name: string; shortName: string; prefix: string }> = {
                  luk: { name: 'LUK 洛可腦力開發', shortName: 'LUK', prefix: 'luk_' },
                  smart_games: { name: 'Smart Games', shortName: 'Smart Games', prefix: 'smart_games_' },
                  learning_resources: { name: 'Learning Resources', shortName: 'LR', prefix: 'learning_resources_' },
                  康軒桌遊: { name: '小康軒桌遊系列', shortName: '小康軒', prefix: '康軒桌遊_' },
                };

                // 組合同品牌的教具
                const brandGroups: Record<string, UserMaterial[]> = {};
                const standalone: UserMaterial[] = [];

                filteredMaterials.forEach(m => {
                  let matched = false;
                  for (const [brandId, brand] of Object.entries(toolBrands)) {
                    if (m.id.startsWith(brand.prefix) || m.id === brandId) {
                      if (!brandGroups[brandId]) brandGroups[brandId] = [];
                      brandGroups[brandId].push(m);
                      matched = true;
                      break;
                    }
                  }
                  if (!matched) standalone.push(m);
                });

                // 渲染品牌分組
                const items: React.ReactNode[] = [];

                Object.entries(brandGroups).forEach(([brandId, materials]) => {
                  const brand = toolBrands[brandId];
                  const totalProgress = materials.reduce((sum, m) => sum + m.progress, 0);
                  const totalItems = materials.reduce((sum, m) => sum + m.totalItems, 0);

                  items.push(
                    <button
                      key={brandId}
                      onClick={() => {
                        // 點進品牌詳情頁
                        setSelectedMaterial({
                          id: brandId,
                          name: brand.name,
                          shortName: brand.shortName,
                          totalItems: totalItems,
                          categories: ['math', 'science'],
                          ageRange: materials[0]?.ageRange || '',
                          tags: ['邏輯', '專注力'],
                          notes: '',
                          isPrebuilt: true,
                          progress: totalProgress,
                          readCount: 0,
                        });
                        setViewMode('detail');
                      }}
                      className="text-left"
                    >
                      <div className="mb-2">
                        <div className="aspect-square flex items-center justify-center bg-accent/5 rounded-xl">
                          <Package size={48} className="text-accent/40" />
                        </div>
                      </div>
                      <h3 className="font-medium text-textMain text-sm text-center leading-tight line-clamp-1">
                        {brand.shortName}
                      </h3>
                      <p className="text-xs text-textSub text-center mt-0.5">
                        {materials.length} 系列
                      </p>
                    </button>
                  );
                });

                // 加入獨立教具
                standalone.forEach(material => {
                  items.push(
                    <button
                      key={material.id}
                      onClick={() => {
                        setSelectedMaterial(material);
                        setViewMode('detail');
                      }}
                      className="text-left"
                    >
                      <div className="mb-2">
                        {material.coverImage ? (
                          <img src={material.coverImage} alt={material.name} className="w-full h-auto rounded-lg" />
                        ) : (
                          <div className="aspect-square flex items-center justify-center bg-accent/5 rounded-xl">
                            <Package size={48} className="text-accent/40" />
                          </div>
                        )}
                      </div>
                      <h3 className="font-medium text-textMain text-sm text-center leading-tight line-clamp-1">
                        {material.shortName || material.name}
                      </h3>
                      <p className="text-xs text-textSub text-center mt-0.5">
                        {material.totalItems > 1 ? `${material.progress}/${material.totalItems}` : `已用 ${material.readCount} 次`}
                      </p>
                    </button>
                  );
                });

                return items;
              }

              // 書庫：正常顯示
              return filteredMaterials.map((material) => (
                <button
                  key={material.id}
                  onClick={() => {
                    setSelectedMaterial(material);
                    setViewMode('detail');
                  }}
                  className="text-left"
                >
                  <div className="mb-2">
                    {material.coverImage ? (
                      <img src={material.coverImage} alt={material.name} className="w-full h-auto rounded-lg" />
                    ) : (
                      <div className="aspect-square flex items-center justify-center">
                        <Book size={64} className="text-accent/40" />
                      </div>
                    )}
                  </div>
                  <h3 className="font-medium text-textMain text-sm text-center leading-tight line-clamp-1">
                    {material.shortName || material.name}
                  </h3>
                  <p className="text-xs text-textSub text-center mt-0.5">
                    {material.totalItems > 1 ? `${material.progress}/${material.totalItems}` : `已讀 ${material.readCount} 次`}
                  </p>
                </button>
              ));
            })()}
          </div>
        )}
      </div>

    </div>
  );

  // 渲染選擇新增方式（根據 libraryTab 調整）
  const renderAddChoice = () => {
    const isBooks = libraryTab === 'books';

    return (
      <div className="pb-20 bg-white">
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center p-4">
            <button onClick={() => setViewMode('library')} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={24} className="text-textMain" />
            </button>
            <h1 className="text-lg font-bold text-textMain">
              {isBooks ? '新增書籍' : '新增教具'}
            </h1>
          </div>
        </div>

        <div className="p-4 space-y-4">
          <p className="text-sm text-textSub">選擇新增方式</p>

          {/* 從預建庫選擇 */}
          <button
            onClick={() => setViewMode('addPrebuilt')}
            className="w-full bg-cardBgSoft rounded-2xl p-4 border border-amber-100 text-left card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                {isBooks ? <BookOpen className="text-accent" size={24} /> : <Package className="text-accent" size={24} />}
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-textMain">
                  {isBooks ? '從預建書庫選擇' : '從預建教具庫選擇'}
                </h3>
                <p className="text-xs text-textSub mt-0.5">
                  {isBooks ? '選擇預建書籍，享有完整 AI 配對功能' : '選擇常見教具，快速加入'}
                </p>
              </div>
              <ChevronRight size={20} className="text-textSub" />
            </div>
          </button>

          {/* 拍照辨識 */}
          <button
            onClick={() => setViewMode('addByPhoto')}
            className="w-full bg-cardBgSoft rounded-2xl p-4 border border-amber-100 text-left card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Camera className="text-blue-500" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-textMain">拍照辨識</h3>
                <p className="text-xs text-textSub mt-0.5">
                  {isBooks ? '拍攝書籍封面，AI 自動填入資訊' : '拍攝教具外盒，AI 自動填入資訊'}
                </p>
              </div>
              <ChevronRight size={20} className="text-textSub" />
            </div>
          </button>

          {/* 自訂新增 */}
          <button
            onClick={() => setViewMode('addCustom')}
            className="w-full bg-cardBgSoft rounded-2xl p-4 border border-amber-100 text-left card-hover"
          >
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-accent/20 rounded-xl flex items-center justify-center">
                <Plus className="text-accent" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-textMain">手動輸入</h3>
                <p className="text-xs text-textSub mt-0.5">
                  {isBooks ? '自行填寫書籍資訊' : '自行填寫教具資訊'}
                </p>
              </div>
              <ChevronRight size={20} className="text-textSub" />
            </div>
          </button>
        </div>
      </div>
    );
  };

  // 渲染拍照辨識頁面
  const renderAddByPhoto = () => {
    const isBooks = libraryTab === 'books';

    return (
      <div className="pb-20 bg-white">
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center p-4">
            <button
              onClick={() => {
                setViewMode('addChoice');
                setPhotoPreview(null);
                setAnalysisResult(null);
              }}
              className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100"
            >
              <ChevronLeft size={24} className="text-textMain" />
            </button>
            <h1 className="text-lg font-bold text-textMain">拍照辨識</h1>
          </div>
        </div>

        <div className="p-4">
          {/* 說明 */}
          <div className="bg-blue-50 rounded-xl p-3 mb-4 border border-blue-100">
            <p className="text-xs text-blue-700 leading-relaxed">
              <Camera size={12} className="inline mr-1" />
              {isBooks
                ? '拍攝或上傳書籍封面，AI 將自動辨識書名、作者等資訊。'
                : '拍攝或上傳教具外盒，AI 將自動辨識名稱、品牌等資訊。'}
            </p>
          </div>

          {/* 上傳區域 */}
          {!photoPreview ? (
            <div className="space-y-3">
              {/* 拍照按鈕 */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-blue-300 rounded-2xl p-8 flex flex-col items-center gap-3 text-blue-500 hover:border-blue-500 hover:bg-blue-50 transition-colors"
              >
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <Camera size={32} />
                </div>
                <div className="text-center">
                  <p className="font-medium">{isBooks ? '拍攝書籍封面' : '拍攝教具外盒'}</p>
                  <p className="text-xs text-blue-400 mt-1">或從相簿選擇照片</p>
                </div>
              </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            {/* 圖片預覽 */}
            <div className="relative rounded-2xl overflow-hidden border border-gray-200">
              <img
                src={photoPreview}
                alt="書籍封面"
                className="w-full h-64 object-cover"
              />
              {isAnalyzing && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="text-center text-white">
                    <Loader2 size={32} className="animate-spin mx-auto mb-2" />
                    <p className="text-sm">AI 分析中...</p>
                  </div>
                </div>
              )}
            </div>

            {/* 辨識結果 */}
            {analysisResult && (
              <div className="bg-green-50 rounded-2xl p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles size={16} className="text-green-600" />
                  <span className="font-medium text-green-800 text-sm">辨識結果</span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-textSub">書名</span>
                    <span className="font-medium text-textMain">{analysisResult.name}</span>
                  </div>
                  {analysisResult.author && (
                    <div className="flex justify-between">
                      <span className="text-textSub">作者</span>
                      <span className="text-textMain">{analysisResult.author}</span>
                    </div>
                  )}
                  {analysisResult.publisher && (
                    <div className="flex justify-between">
                      <span className="text-textSub">出版社</span>
                      <span className="text-textMain">{analysisResult.publisher}</span>
                    </div>
                  )}
                  <div className="flex justify-between items-start">
                    <span className="text-textSub">分類</span>
                    <div className="flex flex-wrap gap-1 justify-end">
                      {analysisResult.categories.map(cat => (
                        <span key={cat} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                          {categoryOptions.find(c => c.value === cat)?.label}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 操作按鈕 */}
            <div className="space-y-2">
              {analysisResult && (
                <button
                  onClick={createFromAnalysis}
                  className="w-full py-3 bg-accent text-white rounded-xl font-medium"
                >
                  使用此結果建立教材
                </button>
              )}
              <button
                onClick={() => {
                  setPhotoPreview(null);
                  setAnalysisResult(null);
                }}
                className="w-full py-3 bg-cardBgSoft text-textMain rounded-xl font-medium border border-amber-100"
              >
                重新拍照
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
    );
  };

  // 渲染預建教材列表（根據 libraryTab 顯示書或教具）
  const renderAddPrebuilt = () => {
    const isBooks = libraryTab === 'books';
    const prebuiltList = isBooks ? prebuiltBooks : prebuiltTools;

    return (
      <div className="pb-20 bg-white">
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center p-4">
            <button onClick={() => setViewMode('addChoice')} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={24} className="text-textMain" />
            </button>
            <h1 className="text-lg font-bold text-textMain">
              {isBooks ? '預建書庫' : '預建教具庫'}
            </h1>
          </div>
        </div>

        <div className="p-4">
          <div className="bg-purple-50 rounded-xl p-3 mb-4 border border-purple-100">
            <p className="text-xs text-purple-700 leading-relaxed">
              <Sparkles size={12} className="inline mr-1" />
              {isBooks
                ? '預建書籍包含完整書目資料，可享有 AI 自動配對、學習計劃產生等功能。'
                : '預建教具可快速加入常見教具，方便追蹤使用紀錄。'}
            </p>
          </div>

          <div className="space-y-3">
            {prebuiltList.map((material: any) => {
              const isAdded = myMaterials.some(m => m.id === material.id);
              const hasSeries = !isBooks && material.hasSeries;
              const isExpanded = expandedTool === material.id;

              // 取得該教具的系列資料
              const getSeriesData = () => {
                if (material.id === 'luk') return lukData.series;
                return [];
              };

              return (
                <div key={material.id}>
                  <div
                    className={`bg-cardBgSoft rounded-2xl p-4 border ${isAdded ? 'border-green-300 bg-green-50' : 'border-amber-100'} ${hasSeries ? 'cursor-pointer' : ''}`}
                    onClick={() => hasSeries && setExpandedTool(isExpanded ? null : material.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                        {isBooks
                          ? (materialIcons[material.id] || materialIcons.default)
                          : <Package size={20} className="text-accent" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-textMain">{material.shortName || material.name}</h3>
                          {isBooks && (
                            <span className="text-xs bg-white text-textSub px-2 py-0.5 rounded-full border border-gray-200">
                              {material.totalItems}本
                            </span>
                          )}
                          {hasSeries && (
                            <span className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                              {material.totalItems} 系列
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-textSub mt-0.5">{material.description}</p>
                        <p className="text-xs text-textSub">{material.ageRange}</p>
                      </div>
                      {hasSeries ? (
                        <ChevronRight size={20} className={`text-textSub transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
                      ) : isAdded ? (
                        <span className="text-xs text-green-600 font-medium">已加入</span>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); addPrebuiltMaterial(material); }}
                          className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium"
                        >
                          加入
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 展開的系列列表 */}
                  {hasSeries && isExpanded && (
                    <div className="ml-4 mt-2 space-y-2">
                      {getSeriesData().map((series: any) => {
                        const seriesId = `${material.id}_${series.id}`;
                        const seriesAdded = myMaterials.some(m => m.id === seriesId);
                        return (
                          <div
                            key={series.id}
                            className={`bg-white rounded-xl p-3 border ${seriesAdded ? 'border-green-300 bg-green-50' : 'border-gray-200'}`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                                <span className="text-xs font-bold text-accent">{series.code}</span>
                              </div>
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-textMain">{series.name}</h4>
                                <p className="text-xs text-textSub">{series.description}</p>
                                <p className="text-xs text-textSub">{series.ageRange} · {series.totalItems}本</p>
                              </div>
                              {seriesAdded ? (
                                <span className="text-xs text-green-600 font-medium">已加入</span>
                              ) : (
                                <button
                                  onClick={() => {
                                    const newMaterial: UserMaterial = {
                                      id: seriesId,
                                      name: `LUK ${series.code} ${series.name}`,
                                      shortName: `LUK ${series.code}`,
                                      totalItems: series.totalItems,
                                      categories: ['math', 'science'],
                                      ageRange: series.ageRange,
                                      tags: ['邏輯', '專注力'],
                                      notes: series.requiresBoard ? `需搭配${series.requiresBoard}操作板` : '',
                                      isPrebuilt: true,
                                      progress: 0,
                                      readCount: 0,
                                    };
                                    setMyMaterials([...myMaterials, newMaterial]);
                                  }}
                                  className="bg-accent text-white px-3 py-1.5 rounded-lg text-xs font-medium"
                                >
                                  加入
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-center py-6">
            <p className="text-xs text-textSub">
              {isBooks ? '更多書籍持續新增中...' : '更多教具持續新增中...'}
            </p>
          </div>
        </div>
      </div>
    );
  };

  // 渲染自訂新增表單（根據 libraryTab 調整欄位）
  const renderAddCustom = () => {
    const isBooks = libraryTab === 'books';

    return (
      <div className="pb-20 bg-white">
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center">
              <button onClick={() => setViewMode('addChoice')} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
                <ChevronLeft size={24} className="text-textMain" />
              </button>
              <h1 className="text-lg font-bold text-textMain">
                {isBooks ? '自訂新增書籍' : '自訂新增教具'}
              </h1>
            </div>
            <button
              onClick={addCustomMaterial}
              className="bg-accent text-white px-4 py-2 rounded-xl text-sm font-medium"
            >
              儲存
            </button>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* 名稱 */}
          <div>
            <label className="block text-sm font-medium text-textMain mb-2">
              {isBooks ? '書名' : '教具名稱'} <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={customForm.name}
              onChange={(e) => setCustomForm({ ...customForm, name: e.target.value })}
              placeholder={isBooks ? '例如：小熊繪本系列' : '例如：邏輯狗'}
              className="w-full px-4 py-3 bg-cardBgSoft rounded-xl text-sm border border-amber-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {/* 本數（僅書庫顯示） */}
          {isBooks && (
            <div>
              <label className="block text-sm font-medium text-textMain mb-2">本數</label>
              <input
                type="number"
                value={customForm.totalItems}
                onChange={(e) => setCustomForm({ ...customForm, totalItems: e.target.value })}
                placeholder="例如：12"
                className="w-full px-4 py-3 bg-cardBgSoft rounded-xl text-sm border border-amber-100 focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          {/* 分類（可多選） */}
          <div>
            <label className="block text-sm font-medium text-textMain mb-2">
              分類 <span className="text-xs text-textSub font-normal">（可多選）</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {categoryOptions
                .filter(cat => isBooks ? true : cat.value !== 'language')
                .map((cat) => {
                  const isSelected = customForm.categories.includes(cat.value);
                  return (
                    <button
                      key={cat.value}
                      onClick={() => {
                        if (isSelected) {
                          if (customForm.categories.length > 1) {
                            setCustomForm({
                              ...customForm,
                              categories: customForm.categories.filter(c => c !== cat.value)
                            });
                          }
                        } else {
                          setCustomForm({
                            ...customForm,
                            categories: [...customForm.categories, cat.value]
                          });
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-colors ${
                        isSelected
                          ? 'bg-accent text-white'
                          : 'bg-cardBgSoft text-textSub border border-gray-200'
                      }`}
                    >
                      {categoryIcons[cat.value]}
                      {cat.label}
                    </button>
                  );
                })}
            </div>
            {customForm.categories.length > 1 && (
              <p className="text-xs text-accent mt-2">已選擇 {customForm.categories.length} 個分類</p>
            )}
          </div>

          {/* 語言子分類（僅書庫且選擇語言時顯示） */}
          {isBooks && customForm.categories.includes('language') && (
          <div>
            <label className="block text-sm font-medium text-textMain mb-2">語言類型</label>
            <div className="flex flex-wrap gap-2">
              {languageSubCategories.filter(l => l.id !== 'all').map((lang) => (
                <button
                  key={lang.id}
                  onClick={() => setCustomForm({ ...customForm, subCategory: lang.id })}
                  className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                    customForm.subCategory === lang.id
                      ? 'bg-accent text-white'
                      : 'bg-accent/10 text-accent border border-accent/30'
                  }`}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 適合年齡 */}
        <div>
          <label className="block text-sm font-medium text-textMain mb-2">適合年齡</label>
          <div className="flex flex-wrap gap-2">
            {ageOptions.map((age) => (
              <button
                key={age.value}
                onClick={() => setCustomForm({ ...customForm, ageRange: age.value })}
                className={`px-3 py-1.5 rounded-full text-sm transition-colors ${
                  customForm.ageRange === age.value
                    ? 'bg-accent text-white'
                    : 'bg-cardBgSoft text-textSub border border-gray-200'
                }`}
              >
                {age.label}
              </button>
            ))}
          </div>
        </div>

        {/* 主題標籤 */}
        <div>
          <label className="block text-sm font-medium text-textMain mb-2">主題標籤</label>

          {/* 已選標籤 */}
          {customForm.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2">
              {customForm.tags.map((tag) => (
                <span
                  key={tag}
                  className="flex items-center gap-1 bg-accent/20 text-accent px-2.5 py-1 rounded-full text-sm"
                >
                  {tag}
                  <button onClick={() => removeTag(tag)}>
                    <X size={14} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* 常用標籤（書籍/教具不同） */}
          <div className="flex flex-wrap gap-2 mb-2">
            {(isBooks ? bookTags : toolTags).filter(t => !customForm.tags.includes(t)).map((tag) => (
              <button
                key={tag}
                onClick={() => addTag(tag)}
                className="px-2.5 py-1 bg-gray-100 text-textSub rounded-full text-xs hover:bg-gray-200"
              >
                + {tag}
              </button>
            ))}
          </div>

          {/* 自訂標籤輸入 */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag(newTag)}
              placeholder="輸入自訂標籤"
              className="flex-1 px-3 py-2 bg-cardBgSoft rounded-lg text-sm border border-amber-100 focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button
              onClick={() => addTag(newTag)}
              className="px-3 py-2 bg-gray-200 rounded-lg text-sm text-textSub"
            >
              新增
            </button>
          </div>
        </div>

        {/* 備註 */}
        <div>
          <label className="block text-sm font-medium text-textMain mb-2">備註（選填）</label>
          <textarea
            value={customForm.notes}
            onChange={(e) => setCustomForm({ ...customForm, notes: e.target.value })}
            placeholder={isBooks ? '例如：每本都有重複句型，適合初學者...' : '例如：可訓練邏輯思維...'}
            rows={3}
            className="w-full px-4 py-3 bg-cardBgSoft rounded-xl text-sm border border-amber-100 focus:outline-none focus:ring-2 focus:ring-accent resize-none"
          />
        </div>
      </div>
    </div>
    );
  };

  // 渲染教材詳情
  const renderDetail = () => {
    if (!selectedMaterial) return null;

    return (
      <div className="pb-20 bg-white">
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center p-4">
            <button onClick={() => setViewMode('library')} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={24} className="text-textMain" />
            </button>
            <h1 className="text-lg font-bold text-textMain">{selectedMaterial.shortName || selectedMaterial.name}</h1>
          </div>
        </div>

        <div className="p-4">
          {/* 教材資訊 */}
          <div className="mb-4">
            <div className="flex items-start gap-4 mb-4">
              {/* 封面圖片 - 自然比例 */}
              <div className="w-24 flex-shrink-0">
                {selectedMaterial.coverImage ? (
                  <img
                    src={selectedMaterial.coverImage}
                    alt={selectedMaterial.name}
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <div className="aspect-square flex items-center justify-center">
                    <Book size={48} className="text-accent/40" />
                  </div>
                )}
              </div>
              <div className="flex-1 pt-1">
                <h2 className="font-bold text-textMain text-base leading-tight">{selectedMaterial.name}</h2>
                <p className="text-sm text-textSub mt-1">
                  {selectedMaterial.ageRange} · {selectedMaterial.totalItems === 1 ? '單本' : `${selectedMaterial.totalItems}本`}
                </p>
              </div>
            </div>

            {/* 進度顯示 - 統一格式 */}
            <div className="mb-4">
              {selectedMaterial.totalItems > 1 ? (
                <>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-textSub">學習進度</span>
                    <span className="font-medium text-textMain">{selectedMaterial.progress}/{selectedMaterial.totalItems}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-accent rounded-full h-2"
                      style={{ width: `${(selectedMaterial.progress / selectedMaterial.totalItems) * 100}%` }}
                    />
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-textSub">閱讀次數</span>
                  <span className="font-medium text-accent">{selectedMaterial.readCount} 次</span>
                </div>
              )}
            </div>

            {/* 標籤 */}
            {selectedMaterial.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {selectedMaterial.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-white text-textSub px-2 py-1 rounded-full border border-gray-200">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* 可搭配教材 - 三層配對系統 */}
          {(() => {
            interface BookRecommendation {
              setId: string;
              setName: string;
              itemNumber: number;
              title: string;
              reason: string;
              type: string;
              coverImage?: string;
              score: number;
              layer: 'preset' | 'user' | 'auto'; // 配對來源層級
            }

            const recommendations: BookRecommendation[] = [];
            const seenKeys = new Set<string>();
            const hasFlr = myMaterials.some(m => m.id === 'flr' || m.id === 'flr_a');
            const hasJpr = myMaterials.some(m => m.id === 'jpr');
            const hasJysw = myMaterials.some(m => m.id === 'jysw');

            const addRecommendation = (rec: BookRecommendation) => {
              const key = `${rec.setId}-${rec.itemNumber}`;
              if (!seenKeys.has(key)) {
                seenKeys.add(key);
                recommendations.push(rec);
              }
            };

            const SCORE_PRESET_PAIRING = 10;
            const SCORE_USER_PAIRING = 8;
            const SCORE_SAME_LANGUAGE = 5;
            const SCORE_VOCAB_OVERLAP = 4;

            // ===== 第一層：預設配對（pairings.json） =====

            // JYSW → FLR / JPR
            if (selectedMaterial.id === 'jysw') {
              if (hasFlr) {
                pairingsData.jysw_flr_pairings.forEach(pairing => {
                  pairing.flr.forEach(flr => {
                    addRecommendation({
                      setId: 'flr', setName: 'FLR',
                      itemNumber: flr.itemNumber, title: flr.title,
                      reason: flr.reason, type: flr.type,
                      coverImage: `/covers/flr/${flr.itemNumber}.jpg`,
                      score: SCORE_PRESET_PAIRING + SCORE_SAME_LANGUAGE,
                      layer: 'preset',
                    });
                  });
                });
              }
              if (hasJpr) {
                pairingsData.jysw_jpr_pairings.forEach(pairing => {
                  pairing.jpr.forEach(jpr => {
                    addRecommendation({
                      setId: 'jpr', setName: 'JPR',
                      itemNumber: jpr.itemNumber, title: jpr.title,
                      reason: jpr.reason, type: jpr.type,
                      coverImage: `/covers/jpr/${jpr.itemNumber}.jpg`,
                      score: SCORE_PRESET_PAIRING + SCORE_SAME_LANGUAGE,
                      layer: 'preset',
                    });
                  });
                });
              }
            }

            // FLR → JYSW（反向）
            if ((selectedMaterial.id === 'flr' || selectedMaterial.id === 'flr_a') && hasJysw) {
              pairingsData.jysw_flr_pairings.forEach(pairing => {
                if (pairing.flr.length > 0) {
                  addRecommendation({
                    setId: 'jysw', setName: 'JYSW',
                    itemNumber: pairing.jysw.itemNumber, title: pairing.jysw.title,
                    reason: pairing.flr[0].reason, type: pairing.flr[0].type,
                    coverImage: `/covers/jysw/${pairing.jysw.itemNumber}.jpg`,
                    score: SCORE_PRESET_PAIRING + SCORE_SAME_LANGUAGE,
                    layer: 'preset',
                  });
                }
              });
            }

            // JPR → JYSW（反向）
            if (selectedMaterial.id === 'jpr' && hasJysw) {
              pairingsData.jysw_jpr_pairings.forEach(pairing => {
                if (pairing.jpr.length > 0) {
                  addRecommendation({
                    setId: 'jysw', setName: 'JYSW',
                    itemNumber: pairing.jysw.itemNumber, title: pairing.jysw.title,
                    reason: pairing.jpr[0].reason, type: pairing.jpr[0].type,
                    coverImage: `/covers/jysw/${pairing.jysw.itemNumber}.jpg`,
                    score: SCORE_PRESET_PAIRING + SCORE_SAME_LANGUAGE,
                    layer: 'preset',
                  });
                }
              });
            }

            // 單本書預設配對（如 Brown Bear）
            if (!['jysw', 'flr', 'flr_a', 'jpr'].includes(selectedMaterial.id)) {
              const nameLower = selectedMaterial.name.toLowerCase();
              const singlePairings = (pairingsData as any).single_book_pairings || [];
              const matchedEntry = singlePairings.find((entry: any) =>
                entry.book.keywords.some((kw: string) => nameLower.includes(kw))
              );

              if (matchedEntry) {
                if (hasJysw && matchedEntry.jysw) {
                  matchedEntry.jysw.forEach((item: any) => {
                    addRecommendation({
                      setId: 'jysw', setName: 'JYSW',
                      itemNumber: item.itemNumber, title: item.title,
                      reason: item.reason, type: item.type,
                      coverImage: `/covers/jysw/${item.itemNumber}.jpg`,
                      score: SCORE_PRESET_PAIRING + SCORE_SAME_LANGUAGE,
                      layer: 'preset',
                    });
                  });
                }
                if (hasFlr && matchedEntry.flr) {
                  matchedEntry.flr.forEach((item: any) => {
                    addRecommendation({
                      setId: 'flr', setName: 'FLR',
                      itemNumber: item.itemNumber, title: item.title,
                      reason: item.reason, type: item.type,
                      coverImage: `/covers/flr/${item.itemNumber}.jpg`,
                      score: SCORE_PRESET_PAIRING + SCORE_SAME_LANGUAGE,
                      layer: 'preset',
                    });
                  });
                }
                if (hasJpr && matchedEntry.jpr) {
                  matchedEntry.jpr.forEach((item: any) => {
                    addRecommendation({
                      setId: 'jpr', setName: 'JPR',
                      itemNumber: item.itemNumber, title: item.title,
                      reason: item.reason, type: item.type,
                      coverImage: `/covers/jpr/${item.itemNumber}.jpg`,
                      score: SCORE_PRESET_PAIRING + SCORE_SAME_LANGUAGE,
                      layer: 'preset',
                    });
                  });
                }
              }
            }

            // ===== 第二層：使用者自訂配對 =====
            userPairings
              .filter(p => p.fromId === selectedMaterial.id)
              .forEach(p => {
                const coverImage = p.toSetId === 'jysw' ? `/covers/jysw/${p.toItemNumber}.jpg`
                  : p.toSetId === 'flr' ? `/covers/flr/${p.toItemNumber}.jpg`
                  : p.toSetId === 'jpr' ? `/covers/jpr/${p.toItemNumber}.jpg`
                  : myMaterials.find(m => m.id === p.toSetId)?.coverImage;
                addRecommendation({
                  setId: p.toSetId,
                  setName: p.toSetId === 'jysw' ? 'JYSW' : p.toSetId === 'flr' ? 'FLR' : p.toSetId === 'jpr' ? 'JPR' : p.toTitle,
                  itemNumber: p.toItemNumber,
                  title: p.toTitle,
                  reason: p.reason,
                  type: 'user',
                  coverImage,
                  score: SCORE_USER_PAIRING + SCORE_SAME_LANGUAGE,
                  layer: 'user',
                });
              });

            // ===== 第三層：單字重疊自動建議 =====
            if (!['jysw', 'flr', 'flr_a', 'jpr'].includes(selectedMaterial.id)) {
              // 從教材名稱和標籤提取關鍵詞
              const bookWords = [
                ...selectedMaterial.name.toLowerCase().split(/[\s,]+/),
                ...selectedMaterial.tags.map(t => t.toLowerCase()),
              ].filter(w => w.length > 2);

              // 比對 JYSW 單字
              if (hasJysw) {
                jyswData.items.forEach((item: any) => {
                  const vocabLower = item.vocabularyWords.map((w: string) => w.toLowerCase());
                  const overlap = vocabLower.filter((v: string) =>
                    bookWords.some(bw => v.includes(bw) || bw.includes(v))
                  );
                  if (overlap.length > 0) {
                    addRecommendation({
                      setId: 'jysw', setName: 'JYSW',
                      itemNumber: item.itemNumber, title: item.title,
                      reason: `相似單字：${overlap.slice(0, 3).join(', ')}`,
                      type: 'vocabulary_overlap',
                      coverImage: `/covers/jysw/${item.itemNumber}.jpg`,
                      score: SCORE_VOCAB_OVERLAP + overlap.length,
                      layer: 'auto',
                    });
                  }
                });
              }

              // 比對 FLR 單字
              if (hasFlr) {
                flrData.items.forEach((item: any) => {
                  const vocabLower = item.vocabularyWords.map((w: string) => w.toLowerCase());
                  const overlap = vocabLower.filter((v: string) =>
                    bookWords.some(bw => v.includes(bw) || bw.includes(v))
                  );
                  if (overlap.length > 0) {
                    addRecommendation({
                      setId: 'flr', setName: 'FLR',
                      itemNumber: item.itemNumber, title: item.title,
                      reason: `相似單字：${overlap.slice(0, 3).join(', ')}`,
                      type: 'vocabulary_overlap',
                      coverImage: `/covers/flr/${item.itemNumber}.jpg`,
                      score: SCORE_VOCAB_OVERLAP + overlap.length,
                      layer: 'auto',
                    });
                  }
                });
              }

              // 比對 JPR 單字
              if (hasJpr) {
                jprData.items.forEach((item: any) => {
                  const vocabLower = item.vocabularyWords.map((w: string) => w.toLowerCase());
                  const overlap = vocabLower.filter((v: string) =>
                    bookWords.some(bw => v.includes(bw) || bw.includes(v))
                  );
                  if (overlap.length > 0) {
                    addRecommendation({
                      setId: 'jpr', setName: 'JPR',
                      itemNumber: item.itemNumber, title: item.title,
                      reason: `相似單字：${overlap.slice(0, 3).join(', ')}`,
                      type: 'vocabulary_overlap',
                      coverImage: `/covers/jpr/${item.itemNumber}.jpg`,
                      score: SCORE_VOCAB_OVERLAP + overlap.length,
                      layer: 'auto',
                    });
                  }
                });
              }
            }

            // 排序：預設 > 使用者 > 自動，同層按分數
            const topRecommendations = recommendations
              .sort((a, b) => b.score - a.score)
              .slice(0, 8);

            return (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium text-textMain">可搭配教材</h3>
                  <button
                    onClick={() => {
                      setShowAddPairing(true);
                      setPairingStep('selectSet');
                      setPendingPairing({ fromId: selectedMaterial.id });
                    }}
                    className="flex items-center gap-1 text-xs text-accent"
                  >
                    <Link2 size={12} />
                    新增配對
                  </button>
                </div>

                {topRecommendations.length > 0 ? (
                  <div className="flex gap-3 overflow-x-auto pb-2 items-stretch">
                    {topRecommendations.map((rec, idx) => {
                      const material = myMaterials.find(m => m.id === rec.setId);
                      const isSingleBook = rec.itemNumber === 0;
                      return (
                        <button
                          key={`${rec.setId}-${rec.itemNumber}-${idx}`}
                          onClick={() => material && setSelectedMaterial(material)}
                          className="flex-shrink-0 w-24 text-center flex flex-col items-stretch"
                        >
                          <div className={`w-full h-28 rounded-lg mb-1 overflow-hidden bg-accent/5 flex items-center justify-center ${rec.layer === 'auto' ? 'opacity-75' : ''}`}>
                            <img
                              src={rec.coverImage || ''}
                              alt={rec.title}
                              className="w-full h-full object-contain"
                              onError={(e) => { e.currentTarget.style.display = 'none'; }}
                              onLoad={(e) => {
                                const sibling = e.currentTarget.nextElementSibling as HTMLElement;
                                if (sibling) sibling.style.display = 'none';
                              }}
                            />
                            <div className="flex flex-col items-center">
                              <BookOpen size={28} className="text-accent/25" strokeWidth={1.5} />
                            </div>
                          </div>
                          <div className="min-h-[3.2rem]">
                            {isSingleBook ? (
                              <p className="text-xs text-textMain leading-tight">{rec.title}</p>
                            ) : (
                              <>
                                <p className="text-xs font-medium text-textMain">
                                  {rec.setName} #{rec.itemNumber}
                                </p>
                                <p className="text-xs text-textSub leading-tight">{rec.title}</p>
                              </>
                            )}
                          </div>
                          <p className={`text-[10px] mt-1 leading-tight ${
                            rec.layer === 'preset' ? 'text-accent/70' :
                            rec.layer === 'user' ? 'text-blue-500/70' :
                            'text-textSub/50 italic'
                          }`}>
                            {rec.layer === 'auto' && <>{'\u{1F4A1} '}</>}
                            {rec.layer === 'user' && <>{'\u{1F517} '}</>}
                            {rec.reason}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-textSub">尚無配對資料，點擊「新增配對」手動添加</p>
                )}
              </div>
            );
          })()}

          {/* 新增配對彈窗 */}
          {showAddPairing && selectedMaterial && (
            <div className="fixed inset-0 bg-black/50 flex items-end justify-center z-50">
              <div className="bg-white w-full max-w-md rounded-t-2xl p-5 max-h-[70vh] overflow-y-auto">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-base font-bold text-textMain">
                    {pairingStep === 'selectSet' ? '選擇要配對的教材' :
                     pairingStep === 'selectItem' ? '選擇具體書本' : '添加配對原因'}
                  </h3>
                  <button onClick={() => setShowAddPairing(false)}>
                    <X size={20} className="text-textSub" />
                  </button>
                </div>

                {pairingStep === 'selectSet' && (
                  <div className="space-y-2">
                    {myMaterials
                      .filter(m => m.id !== selectedMaterial.id)
                      .map(m => (
                        <button
                          key={m.id}
                          onClick={() => {
                            if (m.totalItems === 1) {
                              setPendingPairing({
                                ...pendingPairing,
                                toSetId: m.id,
                                toItemNumber: 0,
                                toTitle: m.name,
                              });
                              setPairingStep('addReason');
                            } else {
                              setPendingPairing({ ...pendingPairing, toSetId: m.id });
                              setPairingStep('selectItem');
                            }
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-accent/5 text-left"
                        >
                          <Book size={20} className="text-accent" />
                          <div>
                            <p className="text-sm font-medium text-textMain">{m.shortName || m.name}</p>
                            <p className="text-xs text-textSub">{m.name} · {m.totalItems} 本</p>
                          </div>
                        </button>
                      ))}
                  </div>
                )}

                {pairingStep === 'selectItem' && (
                  <div className="space-y-2 max-h-[50vh] overflow-y-auto">
                    {(() => {
                      const setId = pendingPairing.toSetId;
                      const items = setId === 'jysw' ? jyswData.items
                        : setId === 'flr' || setId === 'flr_a' ? flrData.items
                        : setId === 'jpr' ? jprData.items : [];
                      return items.map((item: any) => (
                        <button
                          key={item.itemNumber}
                          onClick={() => {
                            setPendingPairing({
                              ...pendingPairing,
                              toItemNumber: item.itemNumber,
                              toTitle: item.title,
                            });
                            setPairingStep('addReason');
                          }}
                          className="w-full flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 hover:bg-accent/5 text-left"
                        >
                          <span className="text-xs font-bold text-accent/60 w-6 text-center">
                            {item.itemNumber}
                          </span>
                          <p className="text-sm text-textMain">{item.title}</p>
                        </button>
                      ));
                    })()}
                  </div>
                )}

                {pairingStep === 'addReason' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-accent/5 rounded-xl">
                      <p className="text-sm text-textMain">
                        {selectedMaterial.name} ↔ {pendingPairing.toTitle}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs text-textSub mb-1 block">配對原因（選填）</label>
                      <input
                        type="text"
                        placeholder="例如：都有農場動物、句型類似..."
                        value={pendingPairing.reason || ''}
                        onChange={e => setPendingPairing({ ...pendingPairing, reason: e.target.value })}
                        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {['單字重疊', '句型類似', '主題相關', '適合一起讀'].map(tag => (
                          <button
                            key={tag}
                            onClick={() => setPendingPairing({ ...pendingPairing, reason: tag })}
                            className="text-xs px-2.5 py-1 rounded-full bg-gray-100 text-textSub hover:bg-accent/10"
                          >
                            {tag}
                          </button>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        if (pendingPairing.fromId && pendingPairing.toSetId && pendingPairing.toTitle) {
                          setUserPairings([...userPairings, {
                            fromId: pendingPairing.fromId,
                            toSetId: pendingPairing.toSetId!,
                            toItemNumber: pendingPairing.toItemNumber || 0,
                            toTitle: pendingPairing.toTitle,
                            reason: pendingPairing.reason || '手動配對',
                          }]);
                          setShowAddPairing(false);
                        }
                      }}
                      className="w-full bg-accent text-white py-2.5 rounded-xl text-sm font-medium"
                    >
                      確認新增配對
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* AI 功能提示 */}
          {selectedMaterial.isPrebuilt ? (
            <div className="flex items-center gap-1.5 mb-4 px-1">
              <Sparkles className="text-accent" size={12} />
              <p className="text-xs text-textSub">
                支援 AI 配對建議、自動產生週計劃
              </p>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 mb-4 px-1">
              <p className="text-xs text-textSub">
                自訂教材，提供基本追蹤功能
              </p>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="space-y-2">
            {selectedMaterial.totalItems > 1 && (
              <button
                onClick={() => setViewMode('bookList')}
                className="w-full py-3 bg-accent text-white rounded-xl font-medium"
              >
                查看書目列表
              </button>
            )}
            <button className="w-full py-3 bg-cardBgSoft text-textMain rounded-xl font-medium border border-amber-100">
              編輯教材資訊
            </button>
            <button className="w-full py-3 text-red-500 rounded-xl font-medium">
              從書架移除
            </button>
          </div>
        </div>
      </div>
    );
  };

  // 範例書目資料（之後可從 JSON 檔案載入）
  const sampleBooks = [
    { id: 1, title: 'We See', completed: true },
    { id: 2, title: 'We Can', completed: true },
    { id: 3, title: 'I See', completed: true },
    { id: 4, title: 'Can You?', completed: false },
    { id: 5, title: 'Look at Me', completed: false },
    { id: 6, title: 'What Do You See?', completed: false },
    { id: 7, title: 'I Like', completed: false },
    { id: 8, title: 'We Like', completed: false },
  ];

  // 渲染書目/教具系列列表
  const renderBookList = () => {
    if (!selectedMaterial) return null;

    // 教具品牌分組的情況：顯示該品牌下的所有系列
    const toolBrandPrefixes: Record<string, string> = {
      luk: 'luk_',
      smart_games: 'smart_games_',
      learning_resources: 'learning_resources_',
      康軒桌遊: '康軒桌遊_',
    };

    const brandPrefix = toolBrandPrefixes[selectedMaterial.id];
    const isToolBrand = brandPrefix !== undefined;

    if (isToolBrand) {
      // 找出該品牌下使用者已加入的所有系列
      const brandMaterials = myMaterials.filter(m =>
        m.id.startsWith(brandPrefix) || m.id === selectedMaterial.id
      );

      return (
        <div className="pb-20 bg-white">
          <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
            <div className="flex items-center p-4">
              <button onClick={() => setViewMode('library')} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
                <ChevronLeft size={24} className="text-textMain" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-textMain">{selectedMaterial.shortName || selectedMaterial.name}</h1>
                <p className="text-xs text-textSub">{brandMaterials.length} 個系列</p>
              </div>
            </div>
          </div>

          <div className="p-4 space-y-3">
            {brandMaterials.map((material) => {
              // 檢查是否有書目資料（totalItems > 1 表示有細項可看）
              const hasBookList = material.totalItems > 1;

              return (
                <button
                  key={material.id}
                  onClick={() => {
                    if (hasBookList) {
                      // 直接進入該系列的書目列表
                      setSelectedMaterial(material);
                      // 不改 viewMode，讓它重新渲染為書目網格
                    }
                  }}
                  className={`w-full bg-cardBgSoft rounded-2xl p-4 border border-amber-100 text-left ${!hasBookList ? 'opacity-60' : ''}`}
                  disabled={!hasBookList}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center">
                      <span className="text-sm font-bold text-accent">
                        {material.shortName?.replace('LUK ', '') || material.name.slice(0, 2)}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-textMain">{material.name}</h3>
                      <p className="text-xs text-textSub mt-0.5">
                        {material.ageRange} · {material.progress}/{material.totalItems} 完成
                      </p>
                      {material.notes && (
                        <p className="text-xs text-accent/70 mt-0.5">{material.notes}</p>
                      )}
                    </div>
                    {hasBookList && <ChevronRight size={20} className="text-textSub" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    // 檢查是否為教具系列（如 luk_va），如果是，返回時要回到品牌列表
    const toolSeriesPrefixes = ['luk_', 'smart_games_', 'learning_resources_', '康軒桌遊_'];
    const isToolSeries = toolSeriesPrefixes.some(prefix => selectedMaterial.id.startsWith(prefix));

    // 找出對應的品牌
    const getBrandForSeries = () => {
      if (selectedMaterial.id.startsWith('luk_')) return 'luk';
      if (selectedMaterial.id.startsWith('smart_games_')) return 'smart_games';
      if (selectedMaterial.id.startsWith('learning_resources_')) return 'learning_resources';
      if (selectedMaterial.id.startsWith('康軒桌遊_')) return '康軒桌遊';
      return null;
    };

    const handleBackFromBookList = () => {
      if (isToolSeries) {
        // 教具系列：返回品牌的系列列表
        const brandId = getBrandForSeries();
        if (brandId) {
          const toolBrands: Record<string, { name: string; shortName: string }> = {
            luk: { name: 'LUK 洛可腦力開發', shortName: 'LUK' },
            smart_games: { name: 'Smart Games', shortName: 'Smart Games' },
            learning_resources: { name: 'Learning Resources', shortName: 'Learning Resources' },
            康軒桌遊: { name: '小康軒桌遊', shortName: '小康軒' },
          };
          const brand = toolBrands[brandId];
          const brandMaterials = myMaterials.filter(m => m.id.startsWith(`${brandId}_`));
          setSelectedMaterial({
            id: brandId,
            name: brand.name,
            shortName: brand.shortName,
            totalItems: brandMaterials.reduce((sum, m) => sum + m.totalItems, 0),
            categories: ['math', 'science'],
            ageRange: brandMaterials[0]?.ageRange || '',
            tags: ['邏輯', '專注力'],
            notes: '',
            isPrebuilt: true,
            progress: brandMaterials.reduce((sum, m) => sum + m.progress, 0),
            readCount: 0,
          });
          // 保持在 bookList 顯示系列列表
        }
      } else {
        // 書籍：返回詳情頁
        setViewMode('detail');
      }
    };

    // 根據類型產生項目列表
    const getItemsForMaterial = () => {
      // 教具系列：產生編號項目
      if (isToolSeries) {
        return Array.from({ length: selectedMaterial.totalItems }, (_, i) => ({
          id: i + 1,
          title: `第 ${i + 1} 本`,
          completed: i < selectedMaterial.progress,
        }));
      }
      // 書籍：使用範例資料（之後可從 JSON 載入真實書目）
      return sampleBooks;
    };

    const items = getItemsForMaterial();
    const itemLabel = isToolSeries ? '本' : '本';

    // 書籍/教具系列的情況：顯示書目網格
    return (
      <div className="pb-20 bg-white">
        <div className="bg-white sticky top-0 z-10 border-b border-gray-100">
          <div className="flex items-center p-4">
            <button onClick={handleBackFromBookList} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={24} className="text-textMain" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-textMain">{selectedMaterial.shortName || selectedMaterial.name}</h1>
              <p className="text-xs text-textSub">{selectedMaterial.progress}/{selectedMaterial.totalItems} {itemLabel}已完成</p>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="grid grid-cols-3 gap-3">
            {items.map((item) => (
              <div
                key={item.id}
                className={`relative rounded-xl overflow-hidden border-2 ${
                  item.completed ? 'border-accent' : 'border-gray-200'
                }`}
              >
                <div className="aspect-[3/4] bg-gradient-to-br from-amber-50 to-amber-100 flex items-center justify-center">
                  <div className="text-center px-2">
                    {isToolSeries ? (
                      <Package size={24} className="text-accent/40 mx-auto mb-1" />
                    ) : (
                      <Book size={24} className="text-accent/40 mx-auto mb-1" />
                    )}
                    <p className="text-xs text-textSub font-medium leading-tight">{item.title}</p>
                  </div>
                </div>
                {item.completed && (
                  <div className="absolute top-1 right-1 w-5 h-5 bg-accent rounded-full flex items-center justify-center">
                    <Check size={12} className="text-white" />
                  </div>
                )}
                <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1.5 py-0.5 rounded">
                  #{item.id}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 根據 viewMode 渲染對應畫面
  switch (viewMode) {
    case 'library':
      return renderLibrary();
    case 'addChoice':
      return renderAddChoice();
    case 'addPrebuilt':
      return renderAddPrebuilt();
    case 'addByPhoto':
      return renderAddByPhoto();
    case 'addCustom':
      return renderAddCustom();
    case 'detail':
      return renderDetail();
    case 'bookList':
      return renderBookList();
    default:
      return renderLibrary();
  }
}
