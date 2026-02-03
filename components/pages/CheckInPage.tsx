import React, { useState } from 'react';
import { ChevronLeft, Camera, Check, Sparkles, Smile, Meh, Frown, ThumbsUp } from 'lucide-react';

// 心情 Icon 映射
const moodIcons: Record<string, React.ReactNode> = {
  great: <Smile size={28} />,
  good: <ThumbsUp size={28} />,
  okay: <Meh size={28} />,
  difficult: <Frown size={28} />,
};

interface CheckInPageProps {
  onBack: () => void;
}

// 今日任務
const todayTasks = [
  { id: '1', title: '共讀《Animals on the Farm》', type: 'read', duration: '10分鐘' },
  { id: '2', title: '播放 JPR Cc 背景音樂', type: 'listen', duration: '5分鐘' },
  { id: '3', title: '複習 Sight Words: we, see, some', type: 'review', duration: '5分鐘' },
];

const moods = [
  { id: 'great', label: '很棒' },
  { id: 'good', label: '不錯' },
  { id: 'okay', label: '普通' },
  { id: 'difficult', label: '困難' },
];

export default function CheckInPage({ onBack }: CheckInPageProps) {
  const [completedTasks, setCompletedTasks] = useState<string[]>(['2']);
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [journal, setJournal] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const toggleTask = (taskId: string) => {
    setCompletedTasks((prev) =>
      prev.includes(taskId)
        ? prev.filter((id) => id !== taskId)
        : [...prev, taskId]
    );
  };

  const handleSubmit = () => {
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    return (
      <div className="pb-20 flex flex-col items-center justify-center min-h-screen bg-white">
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center mx-auto mb-4 animate-checkmark">
            <Check size={40} className="text-white" />
          </div>
          <h1 className="text-xl font-bold text-textMain mb-2">打卡成功！</h1>
          <p className="text-textSub text-sm mb-6">
            完成了 {completedTasks.length}/{todayTasks.length} 項任務
          </p>

          {/* AI 回饋 */}
          <div className="bg-cardBgSoft rounded-2xl p-4 text-left max-w-xs mx-auto border border-amber-100">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles className="text-accent" size={18} />
              <span className="font-semibold text-accent text-sm">AI 回饋</span>
            </div>
            <p className="text-sm text-textMain leading-relaxed">
              今天完成了共讀和背景音樂，太棒了！
              建議明天可以試試在生活中指認動物，問問孩子「Do you see some cats?」
            </p>
          </div>

          <button
            onClick={onBack}
            className="mt-6 bg-accent text-white px-8 py-3 rounded-xl font-semibold btn-press"
          >
            返回首頁
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pb-20 bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={24} className="text-textMain" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-textMain">今日打卡</h1>
            <p className="text-xs text-textSub">2月3日 星期一</p>
          </div>
        </div>
      </div>

      {/* 任務列表 */}
      <div className="p-4">
        <h2 className="text-base font-bold text-textMain mb-3">完成了哪些？</h2>
        <div className="space-y-2.5">
          {todayTasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            return (
              <button
                key={task.id}
                onClick={() => toggleTask(task.id)}
                className={`w-full rounded-xl p-3.5 border text-left transition-all ${
                  isCompleted
                    ? 'bg-accent/10 border-accent/30'
                    : 'bg-cardBgSoft border-amber-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                    isCompleted
                      ? 'bg-accent border-accent text-white'
                      : 'border-gray-300 bg-white'
                  }`}>
                    {isCompleted && <Check size={12} />}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-medium text-sm ${isCompleted ? 'text-accent' : 'text-textMain'}`}>
                      {task.title}
                    </h3>
                    <p className="text-xs text-textSub">{task.duration}</p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 孩子狀態 */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-bold text-textMain mb-3">孩子今天狀態？</h2>
        <div className="grid grid-cols-4 gap-2">
          {moods.map((mood) => (
            <button
              key={mood.id}
              onClick={() => setSelectedMood(mood.id)}
              className={`p-3 rounded-xl border-2 flex flex-col items-center gap-1 transition-all ${
                selectedMood === mood.id
                  ? 'border-accent bg-accent/10 text-accent'
                  : 'border-gray-200 bg-white text-textSub'
              }`}
            >
              {moodIcons[mood.id]}
              <span className="text-xs font-medium">{mood.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 上傳照片 */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-bold text-textMain mb-3">上傳照片（選填）</h2>
        <button className="w-full border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center gap-2 text-textSub hover:border-accent hover:text-accent transition-colors bg-cardBgSoft">
          <Camera size={28} />
          <span className="text-sm">點擊上傳照片</span>
        </button>
      </div>

      {/* 學習日記 */}
      <div className="px-4 pb-4">
        <h2 className="text-base font-bold text-textMain mb-3">學習日記（選填）</h2>
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="記錄今天的學習觀察..."
          className="w-full p-3.5 bg-cardBgSoft rounded-xl border border-amber-100 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
          rows={3}
        />
      </div>

      {/* 提交按鈕 */}
      <div className="px-4 pb-4">
        <button
          onClick={handleSubmit}
          disabled={completedTasks.length === 0}
          className={`w-full py-3.5 rounded-xl font-bold text-white transition-all btn-press ${
            completedTasks.length > 0
              ? 'bg-accent'
              : 'bg-gray-300 cursor-not-allowed'
          }`}
        >
          完成打卡
        </button>
      </div>
    </div>
  );
}
