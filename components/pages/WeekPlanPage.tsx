import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, BookOpen, Headphones, Gamepad2, RotateCcw, Sparkles, Check, Target, Calendar, Flame, X } from 'lucide-react';

interface WeekPlanPageProps {
  onBack: () => void;
}

// 每日學習資料（第 2 週：2/10-2/16，主題：顏色、數字）
const dailyPlans = [
  {
    dayOfWeek: 1,
    label: '一',
    date: '2/10',
    theme: '認識顏色',
    sentence: 'I see ___.',
    vocabulary: ['red', 'blue', 'yellow', 'green'],
    tip: '指著物品問「What color is it?」讓孩子回答「It is red!」',
    tasks: [
      { type: 'read', title: '共讀 Colors Everywhere', duration: '10分鐘' },
      { type: 'listen', title: '播放 Color Song', duration: '5分鐘' },
    ],
    completed: true,
  },
  {
    dayOfWeek: 2,
    label: '二',
    date: '2/11',
    theme: '認識顏色',
    sentence: 'The ___ is ___.',
    vocabulary: ['orange', 'purple', 'pink', 'brown'],
    tip: '用彩色積木玩配對：「Find the blue one!」',
    tasks: [
      { type: 'read', title: '再讀 Colors Everywhere', duration: '10分鐘' },
      { type: 'play', title: '顏色配對遊戲', duration: '10分鐘' },
    ],
    completed: true,
  },
  {
    dayOfWeek: 3,
    label: '三',
    date: '2/12',
    theme: '認識數字',
    sentence: 'I have ___ ___.',
    vocabulary: ['one', 'two', 'three', 'four', 'five'],
    tip: '數玩具時說「I have three cars!」讓孩子跟著數',
    tasks: [
      { type: 'read', title: '共讀 Counting Fun', duration: '10分鐘' },
      { type: 'review', title: '複習 Colors Everywhere', duration: '5分鐘' },
      { type: 'listen', title: '播放 Number Song', duration: '5分鐘' },
    ],
    completed: true,
  },
  {
    dayOfWeek: 4,
    label: '四',
    date: '2/13',
    theme: '認識數字',
    sentence: 'How many ___?',
    vocabulary: ['six', 'seven', 'eight', 'nine', 'ten'],
    tip: '問孩子「How many apples?」讓他數數看並回答',
    tasks: [
      { type: 'read', title: '再讀 Counting Fun', duration: '10分鐘' },
      { type: 'play', title: '數數遊戲', duration: '10分鐘' },
    ],
    completed: true,
  },
  {
    dayOfWeek: 5,
    label: '五',
    date: '2/14',
    theme: '綜合複習',
    sentence: 'I see ___ ___ ___.',
    vocabulary: ['colors', 'numbers'],
    tip: '結合顏色和數字：「I see three red apples!」',
    tasks: [
      { type: 'review', title: '複習顏色和數字', duration: '15分鐘' },
      { type: 'listen', title: '播放 JPR Nn 音檔', duration: '5分鐘' },
    ],
    completed: false,
  },
  {
    dayOfWeek: 6,
    label: '六',
    date: '2/15',
    theme: '遊戲日',
    sentence: 'What color? How many?',
    vocabulary: [],
    tip: '玩尋寶遊戲：「Find two blue things!」',
    tasks: [
      { type: 'play', title: '顏色數字尋寶', duration: '15分鐘' },
      { type: 'play', title: '彩虹塗鴉', duration: '10分鐘' },
    ],
    completed: false,
  },
  {
    dayOfWeek: 7,
    label: '日',
    date: '2/16',
    theme: '自由選擇',
    sentence: '複習本週句型',
    vocabulary: [],
    tip: '讓孩子選擇最喜歡的書再讀一次',
    tasks: [
      { type: 'play', title: '孩子自由選擇活動', duration: '自由' },
    ],
    completed: false,
  },
];

// 打卡紀錄（範例資料 - 2/14 之前有打卡的日期）
const checkInRecords = [3, 4, 5, 6, 7, 8, 10, 11, 12, 13]; // 二月份有打卡的日期

const taskTypeConfig: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
  read: { bg: 'bg-blue-50', text: 'text-blue-600', icon: <BookOpen size={14} /> },
  listen: { bg: 'bg-purple-50', text: 'text-purple-600', icon: <Headphones size={14} /> },
  play: { bg: 'bg-accent/10', text: 'text-accent', icon: <Gamepad2 size={14} /> },
  review: { bg: 'bg-green-50', text: 'text-green-600', icon: <RotateCcw size={14} /> },
};

export default function WeekPlanPage({ onBack }: WeekPlanPageProps) {
  const [expandedDay, setExpandedDay] = useState<number | null>(5); // 預設展開今天（週五）
  const [showWeekPicker, setShowWeekPicker] = useState(false);
  const [showCheckInRecord, setShowCheckInRecord] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(2); // 預設顯示本週（第2週）
  const today = 5; // 今天是週五（2/14）

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
  const currentWeek = 2; // 當週是第幾週（2/14 是第 2 週）
  const weeks = [
    { week: 1, startDate: '2/3', endDate: '2/9', themes: ['農場動物', '形狀'], completed: true },
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
                  const isCurrentDay = day === 14; // 今天是 2/14

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
