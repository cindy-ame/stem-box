import React from 'react';
import { BookOpen, Target, Calendar, Lightbulb, Sparkles, Baby, Check } from 'lucide-react';

interface HomePageProps {
  onNavigate: (page: 'materials' | 'weekplan' | 'checkin' | 'ideas') => void;
}

// 範例今日任務
const todayTasks = [
  { id: '1', title: '共讀《Animals on the Farm》', type: 'read', done: false, time: '10分鐘' },
  { id: '2', title: '播放 JPR Cc 背景音樂', type: 'listen', done: true, time: '5分鐘' },
  { id: '3', title: '複習 Sight Words: we, see, some', type: 'review', done: false, time: '5分鐘' },
];

export default function HomePage({ onNavigate }: HomePageProps) {
  const completedCount = todayTasks.filter(t => t.done).length;
  const progress = Math.round((completedCount / todayTasks.length) * 100);

  return (
    <div className="pb-20 bg-white">
      {/* Header */}
      <div className="bg-accent text-white p-5 rounded-b-[28px]">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h1 className="text-xl font-bold">STEM Box</h1>
            <p className="text-amber-100 text-xs">教材管理 · 學習規劃 · 成長紀錄</p>
          </div>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Baby size={24} />
          </div>
        </div>

        {/* 進度卡片 */}
        <div className="bg-white/20 backdrop-blur rounded-2xl p-4 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">今日進度</span>
            <span className="font-bold text-lg">{completedCount}/{todayTasks.length}</span>
          </div>
          <div className="w-full bg-white/30 rounded-full h-2.5">
            <div
              className="bg-white rounded-full h-2.5 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* 快速入口 */}
      <div className="p-4">
        <h2 className="text-base font-bold text-textMain mb-3">快速開始</h2>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => onNavigate('materials')}
            className="bg-cardBgSoft rounded-2xl p-4 text-left card-hover border border-amber-100"
          >
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mb-2">
              <BookOpen className="text-accent" size={22} />
            </div>
            <h3 className="font-semibold text-textMain text-sm">教材庫</h3>
            <p className="text-xs text-textSub mt-0.5">管理我的教材</p>
          </button>

          <button
            onClick={() => onNavigate('weekplan')}
            className="bg-cardBgSoft rounded-2xl p-4 text-left card-hover border border-amber-100"
          >
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mb-2">
              <Calendar className="text-accent" size={22} />
            </div>
            <h3 className="font-semibold text-textMain text-sm">週計劃</h3>
            <p className="text-xs text-textSub mt-0.5">查看學習安排</p>
          </button>

          <button
            onClick={() => onNavigate('ideas')}
            className="bg-cardBgSoft rounded-2xl p-4 text-left card-hover border border-amber-100"
          >
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mb-2">
              <Lightbulb className="text-accent" size={22} />
            </div>
            <h3 className="font-semibold text-textMain text-sm">點子庫</h3>
            <p className="text-xs text-textSub mt-0.5">遊戲與活動靈感</p>
          </button>

          <button
            onClick={() => onNavigate('checkin')}
            className="bg-cardBgSoft rounded-2xl p-4 text-left card-hover border border-amber-100"
          >
            <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center mb-2">
              <Target className="text-accent" size={22} />
            </div>
            <h3 className="font-semibold text-textMain text-sm">打卡</h3>
            <p className="text-xs text-textSub mt-0.5">記錄今日學習</p>
          </button>
        </div>
      </div>

      {/* 今日任務 */}
      <div className="px-4 pb-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="text-base font-bold text-textMain">今日任務</h2>
          <button
            onClick={() => onNavigate('checkin')}
            className="text-sm text-accent font-medium"
          >
            去打卡 →
          </button>
        </div>

        <div className="space-y-2.5">
          {todayTasks.map((task) => (
            <div
              key={task.id}
              className={`bg-white rounded-xl p-3.5 border ${
                task.done ? 'border-accent/30 bg-accent/5' : 'border-gray-100'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  task.done
                    ? 'bg-accent border-accent text-white'
                    : 'border-gray-300'
                }`}>
                  {task.done && <Check size={12} />}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className={`font-medium text-sm truncate ${task.done ? 'text-accent' : 'text-textMain'}`}>
                    {task.title}
                  </h3>
                  <p className="text-xs text-textSub">預計 {task.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 本週重點 */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-bold text-textMain mb-3">本週重點</h2>
        <div className="flex flex-wrap gap-2">
          {['we', 'see', 'some', 'can', 'you', 'the'].map((word) => (
            <span
              key={word}
              className="bg-accent/10 text-accent px-3.5 py-1.5 rounded-full text-sm font-semibold"
            >
              {word}
            </span>
          ))}
        </div>
      </div>

      {/* AI 小提示 */}
      <div className="mx-4 mb-4 bg-cardBgSoft rounded-2xl p-4 border border-amber-100">
        <div className="flex items-start gap-2">
          <Sparkles className="text-accent flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-sm text-textMain font-medium mb-1">AI 小提示</p>
            <p className="text-xs text-textSub leading-relaxed">
              今天重點是「We see some」句型，可以在日常生活中多使用喔！
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
