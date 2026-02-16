import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Headphones, Gamepad2, RotateCcw, Sparkles, Check, Target, Calendar, Flame, X, Camera, Clock, Package, Star } from 'lucide-react';

interface WeekPlanPageProps {
  onBack: () => void;
}

interface Task {
  type: string;
  title: string;
  duration: string;
  completed?: boolean;
  description?: string;
  steps?: string[];
  materials?: string[];
  learningGoal?: string;
  tip?: string;
}

// 活動詳細資料
const activityDetails: Record<string, Omit<Task, 'type' | 'title' | 'duration'>> = {
  // 共讀活動
  '共讀 Colors Everywhere': {
    description: '第一次共讀，重點在建立興趣和熟悉內容',
    steps: [
      '先讓孩子看封面，問「What do you see?」',
      '慢慢翻頁，用手指著圖片說出顏色',
      '每頁停留讓孩子觀察，不急著翻頁',
      '讀完問孩子「Which color do you like?」',
    ],
    learningGoal: '認識顏色詞彙、建立閱讀興趣',
    tip: '第一次讀不用要求孩子跟讀，讓他享受故事就好！',
  },
  '再讀 Colors Everywhere': {
    description: '第二次共讀，可以增加互動和練習',
    steps: [
      '翻頁前問「What color is next?」讓孩子猜',
      '指著圖片問「What color is the apple?」',
      '讓孩子試著說出顏色：「It is red!」',
      '可以找房間裡相同顏色的東西',
    ],
    learningGoal: '練習說出顏色、增加互動',
    tip: '孩子說錯沒關係，用正確的說法重複一次即可，保持輕鬆愉快！',
  },
  '共讀 Counting Fun': {
    description: '第一次共讀數字書，建立數字概念',
    steps: [
      '看封面問「How many ___ do you see?」',
      '每頁一起用手指數：「One, two, three...」',
      '讓孩子用手指點著數，建立一對一對應',
      '數完問「How many?」讓孩子回答',
    ],
    learningGoal: '認識數字 1-10、練習數數',
    tip: '數數時放慢速度，確保孩子手指和數字對應！',
  },
  '再讀 Counting Fun': {
    description: '第二次共讀，讓孩子主導更多',
    steps: [
      '讓孩子自己翻頁，問「What do you see?」',
      '孩子數數時，在旁邊用英文跟著數',
      '試著讓孩子獨立說「I have three apples!」',
      '可以問「Show me five fingers!」做延伸',
    ],
    learningGoal: '獨立數數、說出數量',
    tip: '讓孩子當小老師教爸媽數數，增加成就感！',
  },
  // 複習活動
  '複習 Colors Everywhere': {
    description: '快速複習，鞏固顏色詞彙',
    steps: [
      '快速翻閱，每頁問「What color?」',
      '讓孩子搶答，答對給予鼓勵',
      '找出孩子最喜歡的那一頁多停留',
      '結束時說「Good job! You know all the colors!」',
    ],
    learningGoal: '鞏固顏色詞彙記憶',
    tip: '複習時間短，保持節奏輕快有趣！',
  },
  '複習顏色和數字': {
    description: '綜合複習本週學習內容',
    steps: [
      '拿出房間裡的物品，問「What color?」',
      '再問「How many?」讓孩子數數',
      '玩快問快答：「Show me something blue!」',
      '結合句型：「I see two red cars!」',
    ],
    learningGoal: '綜合運用顏色 + 數字',
    tip: '可以用零食當獎勵，答對就可以吃一個！',
  },
  // 播放音檔
  '播放 Color Song': {
    description: '用歌曲加深顏色印象',
    steps: [
      '播放前告訴孩子「Let\'s sing about colors!」',
      '跟著音樂一起唱、一起比動作',
      '聽到顏色時，指著房間裡對應的東西',
      '可以重複播放 2-3 次',
    ],
    learningGoal: '透過音樂記憶顏色詞彙',
    tip: '不用要求孩子唱對每個字，跟著哼就很棒了！',
  },
  '播放 Number Song': {
    description: '用歌曲練習數字',
    steps: [
      '播放前說「Let\'s count together!」',
      '跟著音樂比出手指數字',
      '唱到數字時大聲跟唱',
      '可以站起來邊唱邊跳',
    ],
    learningGoal: '透過音樂記憶數字 1-10',
    tip: '加入肢體動作，孩子會更投入！',
  },
  '播放 JPR Nn 音檔': {
    description: '自然發音練習 - 字母 N',
    steps: [
      '先問孩子「What sound does N make?」',
      '播放音檔，跟著唸 /n/ /n/ /n/',
      '找出 N 開頭的單字：nose, nine, nut',
      '讓孩子摸自己的鼻子說「nose!」',
    ],
    learningGoal: '認識字母 N 的發音',
    tip: '可以玩遊戲：聽到 /n/ 的音就拍手！',
  },
  // 遊戲活動
  '顏色數字尋寶': {
    description: '結合顏色和數字的室內尋寶遊戲，讓孩子在探索中學習',
    steps: [
      '在房間各處放置不同顏色的物品',
      '給孩子任務：「Find two blue things!」',
      '孩子找到後，一起數數量並說出顏色',
      '可以增加難度：「Find three red and one yellow!」',
    ],
    materials: ['各色玩具或物品', '小籃子收集'],
    learningGoal: '練習顏色詞彙 + 數字 1-10',
    tip: '可以計時增加刺激感，或讓孩子來出題考爸媽！',
  },
  '彩虹塗鴉': {
    description: '用彩色筆或蠟筆創作彩虹，同時練習顏色英文',
    steps: [
      '準備白紙和彩色筆/蠟筆',
      '和孩子一起畫彩虹，邊畫邊說「This is red!」',
      '讓孩子選顏色時說「I want blue!」',
      '完成後一起數彩虹有幾個顏色',
    ],
    materials: ['白紙', '彩色筆或蠟筆'],
    learningGoal: '練習顏色詞彙 + 句型「This is ___」',
    tip: '可以延伸畫其他東西，問孩子「What color is the sun?」',
  },
  '顏色配對遊戲': {
    description: '用積木或卡片進行顏色配對',
    steps: [
      '準備不同顏色的積木或卡片',
      '說「Find the blue one!」讓孩子找出對應顏色',
      '找到後讓孩子說「This is blue!」',
      '可以兩人比賽看誰找得快',
    ],
    materials: ['彩色積木', '或顏色卡片'],
    learningGoal: '顏色認知 + 聽力理解',
    tip: '增加難度可以用「Find something blue」讓孩子找房間裡的東西',
  },
  '數數遊戲': {
    description: '用日常物品練習數數',
    steps: [
      '準備一些小物品（積木、餅乾、玩具）',
      '問孩子「How many blocks?」',
      '一起用英文數：「One, two, three...」',
      '讓孩子自己數並回答「I have five blocks!」',
    ],
    materials: ['積木、餅乾或小玩具'],
    learningGoal: '數字 1-10 + 句型「How many___?」',
    tip: '可以在點心時間數餅乾，增加趣味性',
  },
  '孩子自由選擇活動': {
    description: '讓孩子主導，選擇想要的學習活動',
    steps: [
      '問孩子「What do you want to do today?」',
      '把本週的書和活動選項展示給孩子看',
      '讓孩子自己選擇一本書或活動',
      '跟著孩子的節奏進行，讓他當小老師',
    ],
    learningGoal: '培養自主學習、複習本週內容',
    tip: '孩子自己選的活動參與度最高！尊重他的選擇。',
  },
};

// 每日學習資料（第 2 週：2/10-2/16，主題：顏色、數字）
const dailyPlans = [
  {
    dayOfWeek: 1,
    label: '一',
    date: '10',
    fullDate: '2/10',
    theme: '認識顏色',
    sentence: 'I see ___.',
    vocabulary: ['red', 'blue', 'yellow', 'green'],
    tip: '指著物品問「What color is it?」讓孩子回答「It is red!」',
    tasks: [
      { type: 'read', title: '共讀 Colors Everywhere', duration: '10分鐘', completed: true },
      { type: 'listen', title: '播放 Color Song', duration: '5分鐘', completed: true },
    ],
    completed: true,
  },
  {
    dayOfWeek: 2,
    label: '二',
    date: '11',
    fullDate: '2/11',
    theme: '認識顏色',
    sentence: 'The ___ is ___.',
    vocabulary: ['orange', 'purple', 'pink', 'brown'],
    tip: '用彩色積木玩配對：「Find the blue one!」',
    tasks: [
      { type: 'read', title: '再讀 Colors Everywhere', duration: '10分鐘', completed: true },
      { type: 'play', title: '顏色配對遊戲', duration: '10分鐘', completed: true },
    ],
    completed: true,
  },
  {
    dayOfWeek: 3,
    label: '三',
    date: '12',
    fullDate: '2/12',
    theme: '認識數字',
    sentence: 'I have ___ ___.',
    vocabulary: ['one', 'two', 'three', 'four', 'five'],
    tip: '數玩具時說「I have three cars!」讓孩子跟著數',
    tasks: [
      { type: 'read', title: '共讀 Counting Fun', duration: '10分鐘', completed: true },
      { type: 'review', title: '複習 Colors Everywhere', duration: '5分鐘', completed: true },
      { type: 'listen', title: '播放 Number Song', duration: '5分鐘', completed: true },
    ],
    completed: true,
  },
  {
    dayOfWeek: 4,
    label: '四',
    date: '13',
    fullDate: '2/13',
    theme: '認識數字',
    sentence: 'How many ___?',
    vocabulary: ['six', 'seven', 'eight', 'nine', 'ten'],
    tip: '問孩子「How many apples?」讓他數數看並回答',
    tasks: [
      { type: 'read', title: '再讀 Counting Fun', duration: '10分鐘', completed: true },
      { type: 'play', title: '數數遊戲', duration: '10分鐘', completed: true },
    ],
    completed: true,
  },
  {
    dayOfWeek: 5,
    label: '五',
    date: '14',
    fullDate: '2/14',
    theme: '綜合複習',
    sentence: 'I see ___ ___ ___.',
    vocabulary: ['colors', 'numbers'],
    tip: '結合顏色和數字：「I see three red apples!」',
    tasks: [
      { type: 'review', title: '複習顏色和數字', duration: '15分鐘', completed: false },
      { type: 'listen', title: '播放 JPR Nn 音檔', duration: '5分鐘', completed: false },
    ],
    completed: false,
  },
  {
    dayOfWeek: 6,
    label: '六',
    date: '15',
    fullDate: '2/15',
    theme: '遊戲日',
    sentence: 'What color? How many?',
    vocabulary: [],
    tip: '玩尋寶遊戲：「Find two blue things!」',
    tasks: [
      { type: 'play', title: '顏色數字尋寶', duration: '15分鐘', completed: false },
      { type: 'play', title: '彩虹塗鴉', duration: '10分鐘', completed: false },
    ],
    completed: false,
  },
  {
    dayOfWeek: 7,
    label: '日',
    date: '16',
    fullDate: '2/16',
    theme: '自由選擇',
    sentence: '複習本週句型',
    vocabulary: [],
    tip: '讓孩子選擇最喜歡的書再讀一次',
    tasks: [
      { type: 'play', title: '孩子自由選擇活動', duration: '自由', completed: false },
    ],
    completed: false,
  },
];

// 打卡紀錄（範例資料）
const checkInRecords = [3, 4, 5, 6, 7, 8, 10, 11, 12, 13];

const taskTypeConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  read: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <BookOpen size={16} /> },
  listen: { bg: 'bg-purple-50', text: 'text-purple-600', icon: <Headphones size={16} /> },
  play: { bg: 'bg-accent/10', text: 'text-accent', icon: <Gamepad2 size={16} /> },
  review: { bg: 'bg-green-50', text: 'text-green-600', icon: <RotateCcw size={16} /> },
};

export default function WeekPlanPage({ onBack }: WeekPlanPageProps) {
  const [selectedDay, setSelectedDay] = useState(5); // 預設選擇今天（週五）
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showCheckInRecord, setShowCheckInRecord] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(2);
  const [selectedActivity, setSelectedActivity] = useState<Task | null>(null);
  const [taskCompletedState, setTaskCompletedState] = useState<Record<string, boolean>>({});
  const today = 5; // 今天是週五

  const currentDay = dailyPlans[selectedDay - 1];
  const completedDays = dailyPlans.filter(d => d.completed).length;
  const streakDays = 5;

  // 週資料
  const currentWeek = 2;
  const weeks = [
    { week: 1, startDate: '2/3', endDate: '2/9', themes: ['農場動物', '形狀'], completed: true },
    { week: 2, startDate: '2/10', endDate: '2/16', themes: ['顏色', '數字'], completed: false },
    { week: 3, startDate: '2/17', endDate: '2/23', themes: ['家庭', '食物'], completed: false },
    { week: 4, startDate: '2/24', endDate: '3/2', themes: ['交通工具', '天氣'], completed: false },
  ];

  // 生成月曆
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);
    return days;
  };
  const calendarDays = generateCalendarDays(2026, 1);

  return (
    <div className="pb-20 bg-white min-h-screen">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={24} className="text-textMain" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-textMain">第 {selectedWeek} 週</h1>
            <p className="text-xs text-textSub">{weeks[selectedWeek - 1]?.startDate} - {weeks[selectedWeek - 1]?.endDate}</p>
          </div>
          <button
            onClick={() => setShowWeekPicker(true)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Calendar size={20} className="text-accent" />
          </button>
        </div>
      </div>

      {/* 日期選擇器 */}
      <div className="bg-gradient-to-r from-accent/10 to-amber-50 px-2 py-3">
        <div className="flex justify-between items-center">
          {dailyPlans.map((day) => {
            const isSelected = selectedDay === day.dayOfWeek;
            const isToday = day.dayOfWeek === today;

            return (
              <button
                key={day.dayOfWeek}
                onClick={() => setSelectedDay(day.dayOfWeek)}
                className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all ${
                  isSelected
                    ? 'bg-accent text-white shadow-md'
                    : 'hover:bg-white/50'
                }`}
              >
                <span className={`text-xs ${isSelected ? 'text-white/80' : 'text-textSub'}`}>
                  {day.label}
                </span>
                <span className={`text-lg font-bold ${isSelected ? 'text-white' : 'text-textMain'}`}>
                  {day.date}
                </span>
                {day.completed ? (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-accent'}`} />
                ) : isToday ? (
                  <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? 'bg-white' : 'bg-orange-400'}`} />
                ) : (
                  <div className="w-1.5 h-1.5 mt-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>


      {/* 當日內容 */}
      <div className="p-4 space-y-4">
        {/* 日期標題 */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-textMain">
                {currentDay.fullDate} 週{currentDay.label}
              </h2>
              {currentDay.dayOfWeek === today && (
                <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">今天</span>
              )}
              {currentDay.completed && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">已完成</span>
              )}
            </div>
            <p className="text-sm text-textSub mt-0.5">{currentDay.theme}</p>
          </div>
        </div>

        {/* 今日句型 */}
        <div className="bg-cardBgSoft rounded-2xl p-4 border border-amber-100">
          <p className="text-xs text-textSub mb-2">今日句型</p>
          <p className="text-xl font-bold text-accent">"{currentDay.sentence}"</p>
          {currentDay.vocabulary.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-3">
              {currentDay.vocabulary.map(word => (
                <span key={word} className="text-sm bg-white text-accent px-3 py-1 rounded-full border border-accent/20">
                  {word}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* 親子互動提示 */}
        <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-accent/20 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles size={16} className="text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-textMain mb-1">親子互動提示</p>
              <p className="text-sm text-textSub leading-relaxed">{currentDay.tip}</p>
            </div>
          </div>
        </div>

        {/* 今日活動 */}
        <div>
          <h3 className="text-base font-bold text-textMain mb-3">今日活動</h3>
          <div className="space-y-2">
            {currentDay.tasks.map((task, idx) => {
              const config = taskTypeConfig[task.type];
              const taskKey = `${currentDay.dayOfWeek}-${idx}`;
              const isCompleted = task.completed || taskCompletedState[taskKey];
              const hasDetails = activityDetails[task.title];

              return (
                <button
                  key={idx}
                  onClick={() => setSelectedActivity({ ...task, ...activityDetails[task.title] })}
                  className="w-full flex items-center gap-3 bg-white rounded-xl p-4 border border-gray-100 shadow-sm hover:border-accent/30 hover:shadow-md transition-all text-left"
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.bg} ${config.text}`}>
                    {config.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-textMain">{task.title}</p>
                    <p className="text-xs text-textSub">{task.duration}</p>
                  </div>
                  {isCompleted ? (
                    <Check size={20} className="text-accent" />
                  ) : hasDetails ? (
                    <ChevronRight size={20} className="text-gray-300" />
                  ) : null}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 週選擇器彈窗 */}
      {showWeekPicker && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-textMain">選擇週次</h3>
              <button onClick={() => setShowWeekPicker(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={20} className="text-textSub" />
              </button>
            </div>
            <div className="p-4 space-y-2">
              {weeks.map((w) => (
                <button
                  key={w.week}
                  onClick={() => {
                    setSelectedWeek(w.week);
                    setShowWeekPicker(false);
                  }}
                  className={`w-full p-3 rounded-xl text-left border transition-all ${
                    selectedWeek === w.week
                      ? 'border-accent bg-accent/10'
                      : 'border-gray-200 hover:border-accent/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-textMain">第 {w.week} 週</p>
                        {w.week === currentWeek && (
                          <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">本週</span>
                        )}
                      </div>
                      <p className="text-xs text-textSub">{w.startDate} - {w.endDate}</p>
                    </div>
                    <div className="flex gap-1">
                      {w.themes.map(t => (
                        <span key={t} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 活動詳情彈窗 */}
      {selectedActivity && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden max-h-[85vh] flex flex-col">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
              <h3 className="font-bold text-textMain">{selectedActivity.title}</h3>
              <button onClick={() => setSelectedActivity(null)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={20} className="text-textSub" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto">
              {/* 基本資訊 */}
              <div className="p-4 bg-gradient-to-r from-accent/10 to-amber-50">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${taskTypeConfig[selectedActivity.type]?.bg} ${taskTypeConfig[selectedActivity.type]?.text}`}>
                    {taskTypeConfig[selectedActivity.type]?.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-textSub" />
                      <span className="text-sm text-textSub">{selectedActivity.duration}</span>
                    </div>
                    {selectedActivity.learningGoal && (
                      <div className="flex items-center gap-2 mt-1">
                        <Star size={14} className="text-accent" />
                        <span className="text-sm text-accent font-medium">{selectedActivity.learningGoal}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 space-y-4">
                {/* 活動說明 */}
                {selectedActivity.description && (
                  <div>
                    <p className="text-sm text-textSub leading-relaxed">{selectedActivity.description}</p>
                  </div>
                )}

                {/* 準備材料 */}
                {selectedActivity.materials && selectedActivity.materials.length > 0 && (
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Package size={16} className="text-accent" />
                      <p className="text-sm font-medium text-textMain">準備材料</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {selectedActivity.materials.map((item, idx) => (
                        <span key={idx} className="text-sm bg-gray-100 text-textSub px-3 py-1 rounded-full">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* 活動步驟 */}
                {selectedActivity.steps && selectedActivity.steps.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-textMain mb-2">活動步驟</p>
                    <div className="space-y-2">
                      {selectedActivity.steps.map((step, idx) => (
                        <div key={idx} className="flex gap-3">
                          <div className="w-6 h-6 bg-accent/10 rounded-full flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-bold text-accent">{idx + 1}</span>
                          </div>
                          <p className="text-sm text-textSub pt-0.5">{step}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 小提示 */}
                {selectedActivity.tip && (
                  <div className="bg-amber-50 rounded-xl p-3 border border-amber-100">
                    <div className="flex items-start gap-2">
                      <Sparkles size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-textSub">{selectedActivity.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 打卡按鈕 */}
            <div className="p-4 border-t border-gray-100 flex-shrink-0">
              <button
                onClick={() => {
                  // 找到當前任務的 index
                  const taskIdx = currentDay.tasks.findIndex(t => t.title === selectedActivity.title);
                  if (taskIdx !== -1) {
                    const taskKey = `${currentDay.dayOfWeek}-${taskIdx}`;
                    setTaskCompletedState(prev => ({ ...prev, [taskKey]: true }));
                  }
                  setSelectedActivity(null);
                }}
                className="w-full py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <Check size={18} />
                完成打卡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 打卡紀錄彈窗 */}
      {showCheckInRecord && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-textMain">打卡紀錄</h3>
              <button onClick={() => setShowCheckInRecord(false)} className="p-1 rounded-lg hover:bg-gray-100">
                <X size={20} className="text-textSub" />
              </button>
            </div>

            <div className="p-4 bg-gradient-to-r from-accent/10 to-amber-50">
              <div className="flex items-center justify-around">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-orange-500">
                    <Flame size={20} />
                    <span className="text-2xl font-bold">{streakDays}</span>
                  </div>
                  <p className="text-xs text-textSub mt-1">連續天數</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <span className="text-2xl font-bold text-accent">{checkInRecords.length}</span>
                  <p className="text-xs text-textSub mt-1">本月打卡</p>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div className="text-center">
                  <span className="text-2xl font-bold text-accent">85%</span>
                  <p className="text-xs text-textSub mt-1">完成率</p>
                </div>
              </div>
            </div>

            <div className="p-4">
              <div className="flex items-center justify-between mb-3">
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronLeft size={18} className="text-textSub" />
                </button>
                <span className="font-medium text-textMain">2026 年 2 月</span>
                <button className="p-1 rounded hover:bg-gray-100">
                  <ChevronRight size={18} className="text-textSub" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d} className="text-center text-xs text-textSub py-1">{d}</div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const hasCheckIn = day && checkInRecords.includes(day);
                  const isCurrentDay = day === 14;
                  return (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center text-sm rounded-full ${
                        !day ? '' : hasCheckIn ? 'bg-accent text-white font-medium' : isCurrentDay ? 'border-2 border-accent text-accent font-medium' : 'text-textSub'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setShowCheckInRecord(false)}
                className="w-full py-2.5 bg-accent text-white rounded-xl font-medium"
              >
                關閉
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
