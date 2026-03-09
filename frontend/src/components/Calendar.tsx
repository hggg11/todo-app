import { useState } from 'react';
import type { Todo } from '../types/todo';

interface CalendarProps {
  completedTodos: Todo[];
}

export default function Calendar({ completedTodos }: CalendarProps) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());

  // ① 月の最初の日の曜日（0=日曜, 1=月曜, ..., 6=土曜）
  const firstDayOfWeek = new Date(year, month, 1).getDay();
  // ② 月の最終日（= 翌月の0日目）
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return (
    <div>
      {/* ナビゲーション */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={() => {
          if (month === 0) {
            setYear(year - 1);
            setMonth(11);
          } else {
            setMonth(month - 1);
          }
        }}>←</button>
        <h2>{year}年 {month + 1}月</h2>
        <button onClick={() => {
          if (month === 11) {
            setYear(year + 1);
            setMonth(0);
          } else {
            setMonth(month + 1);
          }
        }}>→</button>
      </div>

      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 text-center text-sm font-medium text-gray-500 mb-1">
        {['日', '月', '火', '水', '木', '金', '土'].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* 日付グリッド */}
      <div className="grid grid-cols-7">
        {/* 空白セル */}
        {Array.from({ length: firstDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {/* 日付セル */}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(day => {
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const todosOnDay = completedTodos.filter(t =>
            t.updatedAt.slice(0, 10) === dateStr
          );
          return (
            <div key={day} className="p-1 min-h-[90px] border border-gray-100 rounded">
              <div className="text-sm text-gray-500">{day}</div>
              <div className="flex flex-wrap gap-0.5 mt-1">
                {todosOnDay.map(t => (
                  <span key={t.id} title={t.title} className="text-3xl leading-none">
                    {t.icon || '📝'}
                  </span>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
