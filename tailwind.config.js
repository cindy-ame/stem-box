/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Nini App 風格配色
        primary: '#ffffff',
        accent: '#F7B340',           // 琥珀橘 - 主要按鈕
        accentLight: '#FEF3E2',      // 淺橘背景
        highlight: '#F7A831',        // 強調色
        textMain: '#3A2D26',         // 主要文字 - 暖棕色
        textSub: '#7A6D5E',          // 次要文字
        cardBg: '#ffffff',
        cardBgSoft: '#FAF5E6',       // 米白卡片背景
        badge: '#8b5cf6',            // 紫色徽章
        success: '#22C55E',
        warning: '#F59E0B',
        info: '#3B82F6',
      },
    },
  },
  plugins: [],
}
