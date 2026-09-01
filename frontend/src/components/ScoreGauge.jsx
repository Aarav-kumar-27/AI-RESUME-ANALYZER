import React from 'react';

export default function ScoreGauge({ score }) {
  const normalizedScore = Math.max(0, Math.min(100, score || 0));

  let colorClass = 'text-indigo-600 dark:text-indigo-400';
  let strokeColor = '#6366f1';
  let label = 'Good Match';
  let bgGradient = 'from-indigo-500/10 to-violet-500/10';

  if (normalizedScore >= 90) {
    colorClass = 'text-emerald-600 dark:text-emerald-400';
    strokeColor = '#10b981';
    label = 'Excellent Match';
    bgGradient = 'from-emerald-500/10 to-teal-500/10';
  } else if (normalizedScore >= 75) {
    colorClass = 'text-indigo-600 dark:text-indigo-400';
    strokeColor = '#6366f1';
    label = 'Good Match';
    bgGradient = 'from-indigo-500/10 to-violet-500/10';
  } else if (normalizedScore >= 60) {
    colorClass = 'text-amber-600 dark:text-amber-400';
    strokeColor = '#f59e0b';
    label = 'Needs Improvement';
    bgGradient = 'from-amber-500/10 to-orange-500/10';
  } else {
    colorClass = 'text-rose-600 dark:text-rose-400';
    strokeColor = '#f43f5e';
    label = 'Significant Improvement Needed';
    bgGradient = 'from-rose-500/10 to-pink-500/10';
  }

  // SVG Gauge calculations
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedScore / 100) * circumference;

  return (
    <div className={`p-6 rounded-2xl glass-card text-center flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br ${bgGradient}`}>
      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-4">
        Overall Match Score
      </span>

      <div className="relative w-36 h-36 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 120 120">
          {/* Background Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            className="stroke-slate-200 dark:stroke-slate-800"
            strokeWidth="10"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="60"
            cy="60"
            r={radius}
            stroke={strokeColor}
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className={`text-4xl font-extrabold font-mono ${colorClass}`}>
            {normalizedScore}
          </span>
          <span className="text-xs font-semibold text-slate-400">/ 100</span>
        </div>
      </div>

      <span className={`mt-4 px-3 py-1 rounded-full text-xs font-bold ${colorClass} bg-white/80 dark:bg-slate-900/80 shadow-sm border border-slate-200 dark:border-slate-800`}>
        {label}
      </span>
    </div>
  );
}
