import React from 'react';

const CATEGORIES = [
  { key: 'ats_compatibility', name: 'ATS Compatibility', weight: '20%' },
  { key: 'skills_match', name: 'Skills Match', weight: '30%' },
  { key: 'experience_relevance', name: 'Experience Relevance', weight: '25%' },
  { key: 'achievement', name: 'Achievement', weight: '15%' },
  { key: 'clarity', name: 'Clarity', weight: '10%' },
];

export default function ScoreBreakdown({ scores }) {
  const getBarColor = (val) => {
    if (val >= 85) return 'bg-emerald-500';
    if (val >= 70) return 'bg-indigo-500';
    if (val >= 55) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  return (
    <div className="p-6 rounded-2xl glass-card space-y-4">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Score Category Breakdown
      </h3>

      <div className="space-y-4">
        {CATEGORIES.map(cat => {
          const val = scores?.[cat.key] ?? 0;
          return (
            <div key={cat.key} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-800 dark:text-slate-200">
                  {cat.name} <span className="text-slate-400 font-normal">({cat.weight})</span>
                </span>
                <span className="font-mono text-slate-900 dark:text-white font-bold">
                  {val} %
                </span>
              </div>

              <div className="h-2.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden p-0.5">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ease-out ${getBarColor(val)}`}
                  style={{ width: `${Math.max(0, Math.min(100, val))}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
