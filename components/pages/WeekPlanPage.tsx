import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, BookOpen, Headphones, Gamepad2, RotateCcw, Sparkles, Check, Target, Calendar, Flame, X } from 'lucide-react';

interface WeekPlanPageProps {
  onBack: () => void;
}

// 每日學習資料
const dailyPlans = [
  {
    dayOfWeek: 1,
    label: '一',
    date: '2/3',
    theme: '農場動物',
    sentence: 'We see a ___.',
    vocabulary: ['cow', 'pig', 'horse', 'sheep'],
    tip: '共讀時指著動物問「What do we see?」讓孩子回答「We see a cow!」',
    tasks: [
      { type: 'read', title: '共讀 Animals on the Farm', duration: '10分鐘' },
      { type: 'listen', title: '播放 JPR Cc 音檔', duration: '5分鐘' },
    ],
    completed: true,
  },
  {
    dayOfWeek: 2,
    label: '二',
    date: '2/4',
    theme: '農場動物',
    sentence: 'The ___ can ___.',
    vocabulary: ['run', 'jump', 'swim', 'fly'],
    tip: '模仿動物動作，邊做邊說「The horse can run!」增加身體記憶',
    tasks: [
      { type: 'read', title: '再讀 Animals on the Farm', duration: '10分鐘' },
      { type: 'read', title: '配對書 What Can I See?', duration: '10分鐘' },
      { type: 'play', title: '動物動作模仿遊戲', duration: '5分鐘' },
    ],
    completed: true,
  },
  {
    dayOfWeek: 3,
    label: '三',
    date: '2/5',
    theme: '形狀認識',
    sentence: 'I see a ___.',
    vocabulary: ['circle', 'square', 'triangle', 'star'],
    tip: '在家中找形狀：「Can you find a circle?」讓孩子指出圓形物品',
    tasks: [
      { type: 'read', title: '共讀 Look at the Shapes', duration: '10分鐘' },
      { type: 'review', title: '複習 Animals on the Farm', duration: '5分鐘' },
      { type: 'listen', title: '播放 JPR Ss 音檔', duration: '5分鐘' },
    ],
    completed: false,
  },
  {
    dayOfWeek: 4,
    label: '四',
    date: '2/6',
    theme: '形狀認識',
    sentence: 'The ___ is ___.',
    vocabulary: ['big', 'small', 'red', 'blue'],
    tip: '用積木或貼紙玩顏色形狀配對：「The circle is red!」',
    tasks: [
      { type: 'read', title: '再讀 Look at the Shapes', duration: '10分鐘' },
      { type: 'read', title: '配對書 Shapes for Lunch', duration: '10分鐘' },
      { type: 'play', title: '形狀貼紙畫', duration: '10分鐘' },
    ],
    completed: false,
  },
  {
    dayOfWeek: 5,
    label: '五',
    date: '2/7',
    theme: '綜合複習',
    sentence: 'We see some ___.',
    vocabulary: ['animals', 'shapes', 'colors'],
    tip: '結合本週學習，外出時說「We see some birds! They can fly!」',
    tasks: [
      { type: 'review', title: '複習兩本主教材', duration: '15分鐘' },
      { type: 'listen', title: '播放 JPR Pp 音檔', duration: '5分鐘' },
    ],
    completed: false,
  },
  {
    dayOfWeek: 6,
    label: '六',
    date: '2/8',
    theme: '遊戲日',
    sentence: 'Where is the ___?',
    vocabulary: ['farm', 'animal', 'shape'],
    tip: '玩捉迷藏遊戲，藏動物玩具問「Where is the cow?」',
    tasks: [
      { type: 'play', title: '農場動物配對遊戲', duration: '15分鐘' },
      { type: 'play', title: '形狀捉迷藏', duration: '10分鐘' },
    ],
    completed: false,
  },
  {
    dayOfWeek: 7,
    label: '日',
    date: '2/9',
    theme: '自由選擇',
    sentence: '複習本週句型',
    vocabulary: [],
    tip: '讓孩子選擇最喜歡的書再讀一次，增強自主學習動機',
    tasks: [
      { type: 'play', title: '孩子自由選擇活動', duration: '自由' },
    ],
    completed: false,
  },
];

// 打卡紀錄（範例資料）
const checkInRecords = [3, 4, 5, 10, 11, 12, 13, 17, 18, 19, 24, 25]; // 二月份有打卡的日期

const taskTypeConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  read: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <BookOpen size={14} /> },
  listen: { bg: 'bg-purple-50', text: 'text-purple-600', icon: <Headphones size={14} /> },
  play: { bg: 'bg-accent/10', text: 'text-accent', icon: <Gamepad2 size={14} /> },
  review: { bg: 'bg-green-50', text: 'text-green-600', icon: <RotateCcw size={14} /> },
};

export default function WeekPlanPage({ onBack }: WeekPlanPageProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(3);
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showCheckInRecord, setShowCheckInRecord] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const today = new Date().getDay() || 7;

  const completedDays = dailyPlans.filter(d => d.completed).length;
  const progressPercent = (completedDays / 7) * 100;
  const streakDays = 5; // 連續打卡天數（之後從資料庫取）

  // 生成月曆資料
  const generateCalendarDays = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];

    // 填充前面的空白
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    // 填充日期
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i);
    }
    return days;
  };

  const calendarDays = generateCalendarDays(2026, 1); // 2026年2月

  // 週資料（範例）
  const currentWeek = 1; // 當週是第幾週（之後從日期計算）
  const weeks = [
    { week: 1, startDate: '2/3', endDate: '2/9', themes: ['農場動物', '形狀'], completed: false },
    { week: 2, startDate: '2/10', endDate: '2/16', themes: ['顏色', '數字'], completed: false },
    { week: 3, startDate: '2/17', endDate: '2/23', themes: ['家庭', '食物'], completed: false },
    { week: 4, startDate: '2/24', endDate: '3/2', themes: ['交通工具', '天氣'], completed: false },
  ];

  return (
    <div className="pb-20 bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={24} className="text-textMain" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-textMain">第 {selectedWeek} 週學習計畫</h1>
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

      {/* 週進度總覽 + 打卡連續 */}
      <div className="p-4 bg-gradient-to-r from-accent/10 to-amber-50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-accent" />
            <span className="text-sm font-medium text-textMain">本週進度</span>
          </div>
          <span className="text-sm font-bold text-accent">{completedDays}/7 天</span>
        </div>
        <div className="w-full bg-white rounded-full h-2.5 mb-3">
          <div
            className="bg-accent rounded-full h-2.5 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* 連續打卡 + 查看紀錄 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-orange-100 text-orange-600 px-2.5 py-1 rounded-full">
              <Flame size={14} />
              <span className="text-xs font-bold">連續 {streakDays} 天</span>
            </div>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-accent shadow-sm">
              {weeks[selectedWeek - 1]?.themes[0]}
            </span>
            <span className="bg-white px-3 py-1 rounded-full text-xs font-medium text-accent shadow-sm">
              {weeks[selectedWeek - 1]?.themes[1]}
            </span>
          </div>
          <button
            onClick={() => setShowCheckInRecord(true)}
            className="text-xs text-accent font-medium"
          >
            打卡紀錄
          </button>
        </div>
      </div>

      {/* 每日計畫列表 */}
      <div className="p-4">
        <h2 className="text-base font-bold text-textMain mb-3">每日安排</h2>
        <div className="space-y-3">
          {dailyPlans.map((day) => {
            const isExpanded = expandedDay === day.dayOfWeek;
            const isToday = day.dayOfWeek === today;

            return (
              <div
                key={day.dayOfWeek}
                className={`rounded-2xl border overflow-hidden transition-all ${
                  isToday ? 'border-accent bg-accent/5' : 'border-amber-100 bg-cardBgSoft'
                }`}
              >
                {/* 日期標題列 */}
                <button
                  onClick={() => setExpandedDay(isExpanded ? null : day.dayOfWeek)}
                  className="w-full p-4 flex items-center gap-3"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    day.completed
                      ? 'bg-accent text-white'
                      : isToday
                      ? 'bg-accent/20 text-accent border-2 border-accent'
                      : 'bg-white text-textSub border border-gray-200'
                  }`}>
                    {day.completed ? <Check size={18} /> : day.label}
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-textMain">
                        週{day.label} {day.date}
                      </span>
                      {isToday && (
                        <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                          今天
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-textSub mt-0.5">{day.theme} · {day.tasks.length} 個活動</p>
                  </div>
                  <ChevronDown
                    size={20}
                    className={`text-textSub transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  />
                </button>

                {/* 展開內容 */}
                {isExpanded && (
                  <div className="px-4 pb-4 space-y-4">
                    {/* 今日句型 */}
                    <div className="bg-white rounded-xl p-3 border border-gray-100">
                      <p className="text-xs text-textSub mb-1">今日句型</p>
                      <p className="text-base font-bold text-accent">"{day.sentence}"</p>
                      {day.vocabulary.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {day.vocabulary.map(word => (
                            <span key={word} className="text-xs bg-accent/10 text-accent px-2 py-0.5 rounded-full">
                              {word}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 親子互動提示 */}
                    <div className="flex items-start gap-2 bg-amber-50 rounded-xl p-3">
                      <Sparkles size={16} className="text-accent flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-medium text-textMain mb-0.5">親子互動提示</p>
                        <p className="text-xs text-textSub leading-relaxed">{day.tip}</p>
                      </div>
                    </div>

                    {/* 任務列表 */}
                    <div>
                      <p className="text-xs text-textSub mb-2">今日活動</p>
                      <div className="space-y-2">
                        {day.tasks.map((task, idx) => {
                          const config = taskTypeConfig[task.type];
                          return (
                            <div key={idx} className="flex items-center gap-3 bg-white rounded-xl p-3 border border-gray-100">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.bg} ${config.text}`}>
                                {config.icon}
                              </div>
                              <div className="flex-1">
                                <p className="text-sm font-medium text-textMain">{task.title}</p>
                                <p className="text-xs text-textSub">{task.duration}</p>
                              </div>
                              {day.completed && (
                                <Check size={18} className="text-accent" />
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
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
                          <span className="text-xs bg-accent text-white px-2 py-0.5 rounded-full">
                            本週
                          </span>
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

            {/* 統計 */}
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

            {/* 月曆 */}
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

              {/* 星期標題 */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['日', '一', '二', '三', '四', '五', '六'].map(d => (
                  <div key={d} className="text-center text-xs text-textSub py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* 日期 */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, idx) => {
                  const hasCheckIn = day && checkInRecords.includes(day);
                  const isCurrentDay = day === 14; // 假設今天是14號

                  return (
                    <div
                      key={idx}
                      className={`aspect-square flex items-center justify-center text-sm rounded-full ${
                        !day
                          ? ''
                          : hasCheckIn
                          ? 'bg-accent text-white font-medium'
                          : isCurrentDay
                          ? 'border-2 border-accent text-accent font-medium'
                          : 'text-textSub'
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
