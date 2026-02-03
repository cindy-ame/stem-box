import React from 'react';
import { ChevronLeft, User, Baby, Bell, HelpCircle, LogOut, ChevronRight, Shield, Heart } from 'lucide-react';

interface SettingsPageProps {
  onBack: () => void;
}

const settingsItems = [
  { id: 'profile', label: '我的帳號', icon: <User size={20} />, disabled: false },
  { id: 'child', label: '孩子資料', icon: <Baby size={20} />, disabled: false },
  { id: 'notification', label: '通知設定', icon: <Bell size={20} />, disabled: true },
  { id: 'help', label: '使用說明', icon: <HelpCircle size={20} />, disabled: true },
];

export default function SettingsPage({ onBack }: SettingsPageProps) {
  return (
    <div className="pb-20 bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="flex items-center p-4">
          <button onClick={onBack} className="mr-3 p-1 -ml-1 rounded-lg hover:bg-gray-100">
            <ChevronLeft size={24} className="text-textMain" />
          </button>
          <h1 className="text-lg font-bold text-textMain">設定</h1>
        </div>
      </div>

      {/* 使用者資訊 */}
      <div className="p-4">
        <div className="bg-accent rounded-2xl p-4 text-white">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <User size={28} />
            </div>
            <div>
              <h2 className="font-bold text-lg">Cindy</h2>
              <p className="text-amber-100 text-sm">STEM 學習中的媽媽</p>
            </div>
          </div>
        </div>
      </div>

      {/* 孩子資訊 */}
      <div className="px-4 mb-4">
        <div className="bg-cardBgSoft rounded-2xl p-4 border border-amber-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
              <Baby size={24} className="text-accent" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-textMain">寶寶</h3>
              <p className="text-sm text-textSub">2歲6個月</p>
            </div>
            <button className="text-accent text-sm font-medium">
              編輯
            </button>
          </div>
        </div>
      </div>

      {/* 設定項目 */}
      <div className="px-4">
        <p className="text-xs font-medium text-textSub mb-2">設定</p>
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {settingsItems.map((item, index) => (
            <button
              key={item.id}
              disabled={item.disabled}
              className={`w-full flex items-center gap-3 p-4 text-left ${
                item.disabled ? 'opacity-50' : 'hover:bg-cardBgSoft active:bg-cardBgSoft'
              } ${index !== settingsItems.length - 1 ? 'border-b border-gray-100' : ''}`}
            >
              <div className="text-textSub">{item.icon}</div>
              <span className="flex-1 text-textMain font-medium text-sm">{item.label}</span>
              {item.disabled && (
                <span className="text-xs text-textSub bg-gray-100 px-2 py-0.5 rounded-full">即將推出</span>
              )}
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>

      {/* 免責聲明 */}
      <div className="px-4 mt-4">
        <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
          <div className="flex items-start gap-3">
            <Shield className="text-blue-500 flex-shrink-0 mt-0.5" size={20} />
            <div>
              <p className="text-sm font-medium text-blue-800 mb-1">關於本 App</p>
              <p className="text-xs text-blue-600 leading-relaxed">
                STEM Box 是一款教材管理與學習規劃工具，幫助您整理已擁有的教材並規劃學習進度。
                本 App 不包含任何教材內容，請搭配您已購買的實體教材使用。
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 登出 */}
      <div className="px-4 mt-4">
        <button className="w-full flex items-center justify-center gap-2 p-4 bg-red-50 rounded-2xl text-red-500 font-medium hover:bg-red-100 transition-colors">
          <LogOut size={20} />
          <span>登出</span>
        </button>
      </div>

      {/* 版本資訊 */}
      <div className="text-center py-8">
        <p className="text-sm text-textSub font-medium">STEM Box v0.1.0</p>
        <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
          Made with <Heart size={12} className="text-red-400 fill-red-400" /> for STEM parents
        </p>
      </div>
    </div>
  );
}
