# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Learning App（教養學習助手）是一款結合 AI 的親子英語學習 App，幫助家長：
- 管理和配對教材（JYSW、FLR、JPR）
- 追蹤學習進度
- 每日打卡記錄
- 獲得 AI 個人化建議

目標用戶：0-6 歲孩子的家長

## Development Commands

```bash
npm run dev    # 啟動開發伺服器 (http://localhost:3000)
npm run build  # 建置生產版本
npm start      # 啟動生產伺服器
npm run lint   # 執行 ESLint 檢查
```

## Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **Icons**: Lucide React

## Architecture

```
learning_app/
├── components/
│   ├── layouts/       # 版面元件 (Layout.tsx)
│   ├── pages/         # 頁面元件 (HomePage, MaterialsPage, etc.)
│   └── ui/            # UI 元件 (BottomNavigation, Modal, etc.)
├── pages/
│   ├── _app.tsx       # App 入口
│   ├── index.tsx      # 主頁面（處理頁面切換）
│   └── api/           # API 路由（未來用）
├── types/             # TypeScript 型別定義
├── utils/             # 工具函數 (supabase client, etc.)
├── styles/            # 全域樣式
├── data/              # 教材資料 JSON
└── database/          # Supabase SQL 檔案
```

## Page Navigation

使用 client-side state 控制頁面切換：
- `home` - 首頁 Dashboard
- `materials` - 教材庫
- `weekplan` - 週計劃
- `checkin` - 打卡頁
- `settings` - 設定頁

## Key Data Models

詳見 `/types/index.ts`：
- `Material` - 教材（如 JYSW、FLR）
- `MaterialItem` - 教材項目（單本書）
- `WeekPlan` - 週計劃
- `DayPlan` / `DayTask` - 每日計劃與任務
- `CheckIn` - 打卡紀錄

## Color Palette

定義在 `tailwind.config.js`：
- `accent`: #10B981 (綠色主色調)
- `highlight`: #F59E0B (橘黃強調色)
- `textMain`: #1F2937
- `textSub`: #6B7280

## 教材資料

預建教材庫：
- **JYSW** (JY Sight Word Readers) - 48本，Sight Words 系統學習
- **FLR** (First Little Readers) - 25本，簡單句型入門
- **JPR** (JY Phonics Readers) - 36本，自然發音學習

教材配對邏輯：
1. 句型配對（sentence_pattern）
2. 主題配對（theme）
3. 單字重疊（vocabulary_overlap）
4. Phonics 配對（phonics）

## Database (Supabase)

SQL 檔案在 `/database/` 資料夾，按順序執行：
1. `01-materials.sql` - 教材資料表
2. `02-users-children.sql` - 使用者與孩子
3. `03-plans.sql` - 學習計劃
4. `04-checkins.sql` - 打卡紀錄

## 開發注意事項

- Mobile-first 設計，最大寬度 `max-w-md` (448px)
- 使用 Lucide React 圖示
- 所有文字使用繁體中文
- 避免深色模式（已在 CSS 中禁用）
