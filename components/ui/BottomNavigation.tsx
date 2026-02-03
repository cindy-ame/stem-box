import React from 'react';
import { Home, BookOpen, Calendar, Lightbulb, Settings } from 'lucide-react';
import { PageType } from '@/types';

interface BottomNavigationProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

const navItems: { page: PageType; label: string; icon: React.ReactNode }[] = [
  { page: 'home', label: '首頁', icon: <Home size={22} /> },
  { page: 'materials', label: '教材庫', icon: <BookOpen size={22} /> },
  { page: 'weekplan', label: '週計劃', icon: <Calendar size={22} /> },
  { page: 'ideas', label: '點子庫', icon: <Lightbulb size={22} /> },
  { page: 'settings', label: '設定', icon: <Settings size={22} /> },
];

export default function BottomNavigation({ currentPage, onNavigate }: BottomNavigationProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white border-t border-gray-100 z-50 shadow-lg">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => (
          <button
            key={item.page}
            onClick={() => onNavigate(item.page)}
            className={`flex flex-col items-center justify-center flex-1 h-full transition-colors btn-press ${
              currentPage === item.page
                ? 'text-accent'
                : 'text-textSub hover:text-textMain'
            }`}
          >
            {item.icon}
            <span className="text-[10px] mt-1 font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}
