import React from 'react';
import { ThumbsUp, AlertTriangle, Lightbulb } from 'lucide-react';

export default function FeedbackList({ strengths = [], weaknesses = [], suggestions = [] }) {
  return (
    <div className="space-y-6">
      {/* Actionable Suggestions */}
      <div className="p-6 rounded-2xl glass-card border-l-4 border-l-indigo-500 space-y-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-indigo-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Actionable Improvement Suggestions
          </h4>
        </div>

        {suggestions.length > 0 ? (
          <div className="space-y-2.5">
            {suggestions.map((sug, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-3"
              >
                <span className="h-5 w-5 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="leading-relaxed">{sug}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400">
            No specific suggestions generated.
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Resume Strengths */}
        <div className="p-6 rounded-2xl glass-card space-y-4 border-l-4 border-l-emerald-500">
          <div className="flex items-center gap-2">
            <ThumbsUp className="h-5 w-5 text-emerald-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Resume Strengths
            </h4>
          </div>

          {strengths.length > 0 ? (
            <ul className="space-y-2.5">
              {strengths.map((str, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg bg-emerald-50/50 dark:bg-emerald-950/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2.5 border border-emerald-100 dark:border-emerald-900/30"
                >
                  <span className="text-emerald-500 font-bold">•</span>
                  <span className="leading-relaxed">{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No specific strengths listed.
            </p>
          )}
        </div>

        {/* Areas for Improvement / Weaknesses */}
        <div className="p-6 rounded-2xl glass-card space-y-4 border-l-4 border-l-rose-500">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-rose-500" />
            <h4 className="text-sm font-bold text-slate-900 dark:text-white">
              Areas for Improvement
            </h4>
          </div>

          {weaknesses.length > 0 ? (
            <ul className="space-y-2.5">
              {weaknesses.map((weak, idx) => (
                <li
                  key={idx}
                  className="p-3 rounded-lg bg-rose-50/50 dark:bg-rose-950/20 text-xs sm:text-sm text-slate-800 dark:text-slate-200 flex items-start gap-2.5 border border-rose-100 dark:border-rose-900/30"
                >
                  <span className="text-rose-500 font-bold">•</span>
                  <span className="leading-relaxed">{weak}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No critical weaknesses detected.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
