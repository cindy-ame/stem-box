import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, BookOpen, Headphones, Gamepad2, RotateCcw, Lightbulb } from 'lucide-react';

interface WeekPlanPageProps {
  onBack: () => void;
}

// 範例週計劃資料
const weekPlan = {
  weekNumber: 1,
  startDate: '2/3',
  endDate: '2/9',
  themes: ['農場動物', '形狀'],
  sightWords: ['we', 'see', 'some', 'can', 'you', 'the'],
  days: [
    {
      dayOfWeek: 1,
      label: '一',
      tasks: [
        { type: 'read', title: '共讀 Animals on the Farm', icon: <BookOpen size={16} /> },
        { type: 'listen', title: '播放 JPR Cc', icon: <Headphones size={16} /> },
      ],
    },
    {
      dayOfWeek: 2,
      label: '二',
      tasks: [
        { type: 'read', title: '再讀 Animals on the Farm', icon: <BookOpen size={16} /> },
        { type: 'read', title: '配對書 What Can I See?', icon: <BookOpen size={16} /> },
        { type: 'listen', title: '播放 JPR Hh', icon: <Headphones size={16} /> },
      ],
    },
    {
      dayOfWeek: 3,
      label: '三',
      tasks: [
        { type: 'read', title: '共讀 Look at the Shapes', icon: <BookOpen size={16} /> },
        { type: 'review', title: '複習 Animals on the Farm', icon: <RotateCcw size={16} /> },
        { type: 'listen', title: '播放 JPR Ss', icon: <Headphones size={16} /> },
      ],
    },
    {
      dayOfWeek: 4,
      label: '四',
      tasks: [
        { type: 'read', title: '再讀 Look at the Shapes', icon: <BookOpen size={16} /> },
        { type: 'read', title: '配對書 Shapes for Lunch', icon: <BookOpen size={16} /> },
        { type: 'play', title: '形狀捉迷藏遊戲', icon: <Gamepad2 size={16} /> },
      ],
    },
    {
      dayOfWeek: 5,
      label: '五',
      tasks: [
        { type: 'review', title: '複習兩本主教材', icon: <RotateCcw size={16} /> },
        { type: 'listen', title: '播放 JPR Pp', icon: <Headphones size={16} /> },
      ],
    },
    {
      dayOfWeek: 6,
      label: '六',
      tasks: [
        { type: 'play', title: '農場動物配對遊戲', icon: <Gamepad2 size={16} /> },
        { type: 'play', title: '形狀貼紙畫', icon: <Gamepad2 size={16} /> },
      ],
    },
    {
      dayOfWeek: 7,
      label: '日',
      tasks: [
        { type: 'play', title: '自由選擇日', icon: <Gamepad2 size={16} /> },
      ],
    },
  ],
};

const taskTypeConfig: Record<string, { bg: string; text: string; label: string }> = {
  read: { bg: 'bg-blue-50', text: 'text-blue-600', label: '共讀' },
  listen: { bg: 'bg-purple-50', text: 'text-purple-600', label: '聆聽' },
  play: { bg: 'bg-accent/10', text: 'text-accent', label: '遊戲' },
  review: { bg: 'bg-green-50', text: 'text-green-600', label: '複習' },
};

export default function WeekPlanPage({ onBack }: WeekPlanPageProps) {
  const [selectedDay, setSelectedDay] = useState(1);
  const today = new Date().getDay() || 7;

  return (
    <div className="pb-20 bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={24} className="text-textMain" />
          </button>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-textMain">第 {weekPlan.weekNumber} 週</h1>
            <p className="text-xs text-textSub">{weekPlan.startDate} - {weekPlan.endDate}</p>
          </div>
          <div className="flex gap-1">
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronLeft size={18} className="text-textSub" />
            </button>
            <button className="p-2 rounded-lg hover:bg-gray-100">
              <ChevronRight size={18} className="text-textSub" />
            </button>
          </div>
        </div>
      </div>

      {/* 本週主題 */}
      <div className="p-4 bg-accent/10">
        <p className="text-xs font-medium text-textSub mb-2">本週主題</p>
        <div className="flex gap-2">
          {weekPlan.themes.map((theme) => (
            <span
              key={theme}
              className="bg-white px-3 py-1.5 rounded-full text-sm font-medium text-accent shadow-sm"
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* 星期選擇器 */}
      <div className="flex justify-around py-3 bg-white border-b border-gray-100 px-2">
        {weekPlan.days.map((day) => (
          <button
            key={day.dayOfWeek}
            onClick={() => setSelectedDay(day.dayOfWeek)}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
              selectedDay === day.dayOfWeek
                ? 'bg-accent text-white'
                : day.dayOfWeek === today
                ? 'bg-accent/20 text-accent'
                : 'text-textSub hover:bg-gray-100'
            }`}
          >
            {day.label}
          </button>
        ))}
      </div>

      {/* 當日任務 */}
      <div className="p-4">
        <h2 className="text-base font-bold text-textMain mb-3">
          星期{weekPlan.days[selectedDay - 1].label}的任務
        </h2>

        <div className="space-y-2.5">
          {weekPlan.days[selectedDay - 1].tasks.map((task, index) => {
            const config = taskTypeConfig[task.type];
            return (
              <div
                key={index}
                className="bg-cardBgSoft rounded-xl p-3.5 border border-amber-100"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${config.bg} ${config.text}`}>
                    {task.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-textMain text-sm">{task.title}</h3>
                    <p className="text-xs text-textSub mt-0.5">{config.label}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 本週 Sight Words */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-bold text-textMain mb-3">本週 Sight Words</h2>
        <div className="flex flex-wrap gap-2">
          {weekPlan.sightWords.map((word) => (
            <span
              key={word}
              className="bg-accent/10 text-accent px-3 py-1.5 rounded-full text-sm font-semibold"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* AI 小提示 */}
      <div className="mx-4 mb-4 bg-cardBgSoft rounded-2xl p-4 border border-amber-100">
        <div className="flex items-start gap-2">
          <Lightbulb size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-sm text-textMain">
            <span className="font-medium">小提示：</span>
            <span className="text-textSub"> 這週結合動物與形狀，建議共讀時多問「Where are the ___?」</span>
          </p>
        </div>
      </div>
    </div>
  );
}
