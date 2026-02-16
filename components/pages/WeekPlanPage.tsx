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
  // === 共讀活動（循序漸進：初讀 → 再讀 → 複習 → 延伸）===

  // 【初讀】重點：建立興趣，孩子只需聽和看
  '共讀 Colors Everywhere': {
    description: '【初讀階段】建立興趣，讓孩子熟悉故事和聲音',
    steps: [
      '讓孩子看封面，你說「Look! Colors!」',
      '你朗讀每一頁，手指著圖片，孩子只需要看和聽',
      '語調誇張有趣，吸引孩子注意力',
      '讀完給孩子拍拍手「Good job listening!」',
    ],
    learningGoal: '【聽力輸入】讓孩子熟悉顏色的英文發音',
    tip: '初讀時孩子不需要說話，專心聽就是最好的學習！',
  },
  // 【再讀】重點：開始互動，孩子可以指認和回應
  '再讀 Colors Everywhere': {
    description: '【再讀階段】增加互動，讓孩子開始參與',
    steps: [
      '指著圖片問「Where is red?」讓孩子用手指',
      '孩子指對了說「Yes! This is red!」',
      '試著讓孩子跟著你說「red」（單字即可）',
      '問「What color do you like?」接受任何回應',
    ],
    learningGoal: '【認知連結】將顏色和英文單字連結起來',
    tip: '這階段孩子能指認就很棒，不強求說出完整句子。',
  },
  // 【初讀】數字書
  '共讀 Counting Fun': {
    description: '【初讀階段】建立數字概念，熟悉數數的聲音',
    steps: [
      '封面指著數字說「Let\'s count!」',
      '每頁你數給孩子聽：「One, two, three...」',
      '用手指點著每個物品，示範一對一對應',
      '語速放慢，讓孩子聽清楚每個數字',
    ],
    learningGoal: '【聽力輸入】熟悉 1-10 的英文發音',
    tip: '第一次不用要求孩子跟著數，讓他觀察你怎麼數。',
  },
  // 【再讀】數字書
  '再讀 Counting Fun': {
    description: '【再讀階段】孩子開始參與數數',
    steps: [
      '問「How many apples?」讓孩子試著數',
      '孩子數的時候，你在旁邊小聲跟著說英文',
      '數完問「How many?」讓孩子說出數字',
      '答對說「Yes! Three apples!」強化正確答案',
    ],
    learningGoal: '【開始輸出】孩子能跟著數，並說出數量',
    tip: '孩子可能中英混著數，沒關係，慢慢來！',
  },
  // 【複習】重點：鞏固記憶，孩子主動說出
  '複習 Colors Everywhere': {
    description: '【複習階段】加快反應速度，鞏固記憶',
    steps: [
      '快速翻頁，指著圖問「What color?」',
      '給孩子 3 秒回答，答對立刻鼓勵',
      '答錯或不確定，你說正確答案讓他跟著說一次',
      '結束說「Wow! You know so many colors!」',
    ],
    learningGoal: '【快速提取】看到顏色能快速說出英文',
    tip: '複習要快節奏，像玩遊戲一樣！',
  },
  // 【延伸應用】重點：生活中運用
  '複習顏色和數字': {
    description: '【延伸階段】將學到的運用在生活中',
    steps: [
      '指著房間物品問「What color is the ball?」',
      '讓孩子回答，再問「How many balls?」',
      '引導孩子說完整句「I see two red balls!」',
      '出門時也可以玩：「Find something blue!」',
    ],
    learningGoal: '【生活應用】在真實情境中使用顏色和數字',
    tip: '能在生活中說出來，才是真正學會了！',
  },
  // === 播放音檔（搭配肢體記憶）===

  '播放 Color Song': {
    description: '【輔助學習】用音樂強化顏色記憶',
    steps: [
      '播放前說「Let\'s listen to a color song!」',
      '第一次播放：讓孩子專心聽，不要求跟唱',
      '第二次播放：你跟著唱，孩子自然會模仿',
      '聽到顏色時，一起指向房間裡那個顏色的東西',
    ],
    learningGoal: '【多感官學習】透過音樂和動作加深記憶',
    tip: '重複播放 2-3 次，每次孩子會唱得更多！',
  },
  '播放 Number Song': {
    description: '【輔助學習】用音樂強化數字記憶',
    steps: [
      '播放前說「Let\'s count with the song!」',
      '第一次：你比出手指，孩子看著學',
      '第二次：邀請孩子一起比「Show me your fingers!」',
      '唱到數字時，一起大聲說出來',
    ],
    learningGoal: '【多感官學習】手指 + 聲音 + 聽覺一起記憶',
    tip: '手指動作幫助孩子記住數字順序！',
  },
  '播放 JPR Nn 音檔': {
    description: '【自然發音】認識字母 N 的發音',
    steps: [
      '播放前說「Today we learn the letter N!」',
      '播放時跟著唸 /n/ /n/ /n/，讓孩子看你的嘴型',
      '指著鼻子說「N is for nose!」讓孩子摸鼻子',
      '找其他 N 開頭的東西：nine, nut, noodle',
    ],
    learningGoal: '【發音基礎】認識字母 N 的發音和代表單字',
    tip: '每次學一個字母音，不要貪多！',
  },
  // === 遊戲活動（應用階段：把學到的知識用出來）===

  '顏色配對遊戲': {
    description: '【應用練習】透過配對遊戲練習顏色認知',
    steps: [
      '準備彩色積木或卡片，說「Let\'s play a game!」',
      '你說「Find the blue one!」孩子找出來',
      '找到後問「What color is it?」讓孩子說「Blue!」',
      '輪流出題，讓孩子也說「Find the red one!」',
    ],
    materials: ['彩色積木', '或顏色卡片'],
    learningGoal: '【聽說練習】聽懂指令 + 說出顏色名稱',
    tip: '讓孩子出題可以練習說英文，角色互換很有效！',
  },
  '數數遊戲': {
    description: '【應用練習】用實物練習數數和數量表達',
    steps: [
      '拿出積木或點心，說「Let\'s count!」',
      '先示範：「One, two, three. I have three blocks!」',
      '換孩子數，你問「How many blocks do you have?」',
      '引導孩子回答「I have ___ blocks!」',
    ],
    materials: ['積木、餅乾或小玩具'],
    learningGoal: '【句型練習】How many...? / I have...',
    tip: '用點心當道具，孩子會更有動力！',
  },
  '顏色數字尋寶': {
    description: '【綜合應用】結合顏色和數字的尋寶遊戲',
    steps: [
      '說「Let\'s go on a treasure hunt!」',
      '給任務：「Find two blue things!」',
      '孩子找到後，一起確認「One, two. Two blue things!」',
      '讓孩子出題：「What should I find?」',
    ],
    materials: ['各色玩具或物品', '小籃子收集'],
    learningGoal: '【綜合運用】顏色 + 數字 + 聽說能力',
    tip: '這是本週學習的總驗收，孩子能出題代表真的會了！',
  },
  '彩虹塗鴉': {
    description: '【創意應用】邊畫邊說，藝術結合語言',
    steps: [
      '準備畫紙，說「Let\'s draw a rainbow!」',
      '畫每個顏色時說「I am drawing red!」',
      '問孩子「What color do you want?」讓他說「I want blue!」',
      '畫完數數「How many colors? Let\'s count!」',
    ],
    materials: ['白紙', '彩色筆或蠟筆'],
    learningGoal: '【句型練習】I want... / I am drawing...',
    tip: '藝術活動讓孩子放鬆，更容易開口說英文！',
  },
  '孩子自由選擇活動': {
    description: '【自主學習】讓孩子主導，複習最喜歡的內容',
    steps: [
      '問「What do you want to do today?」',
      '展示本週的書和活動，讓孩子選',
      '孩子選擇後說「Good choice! Let\'s read/play!」',
      '讓孩子當小老師，你當學生',
    ],
    learningGoal: '【培養自主】選擇權給孩子，提升學習動機',
    tip: '孩子當老師時會很認真，這是最好的複習方式！',
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
          <button
            onClick={() => setShowCheckInRecord(true)}
            className="text-sm text-accent font-medium flex items-center gap-1"
          >
            <Target size={16} />
            打卡紀錄
          </button>
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
              {(() => {
                const taskIdx = currentDay.tasks.findIndex(t => t.title === selectedActivity.title);
                const taskKey = `${currentDay.dayOfWeek}-${taskIdx}`;
                const task = currentDay.tasks[taskIdx];
                const isCompleted = task?.completed || taskCompletedState[taskKey];

                return isCompleted ? (
                  <button
                    onClick={() => {
                      if (taskIdx !== -1) {
                        setTaskCompletedState(prev => ({ ...prev, [taskKey]: false }));
                      }
                      setSelectedActivity(null);
                    }}
                    className="w-full py-3 bg-gray-100 text-textSub rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <X size={18} />
                    取消打卡
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (taskIdx !== -1) {
                        setTaskCompletedState(prev => ({ ...prev, [taskKey]: true }));
                      }
                      setSelectedActivity(null);
                    }}
                    className="w-full py-3 bg-accent text-white rounded-xl font-medium flex items-center justify-center gap-2"
                  >
                    <Check size={18} />
                    完成打卡
                  </button>
                );
              })()}
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
