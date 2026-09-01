import React from 'react';
import { Sparkles, Cpu, Info } from 'lucide-react';

export default function SourceBadge({ source }) {
  const isGemini = source === 'gemini';

  return (
    <div className="space-y-1">
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm border transition-all">
        {isGemini ? (
          <div className="flex items-center gap-1.5 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 dark:from-indigo-950/60 dark:to-purple-950/60 text-indigo-700 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800">
            <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
            <span>AI Analysis (Gemini API)</span>
          </div>
        ) : (
          <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800">
            <Cpu className="h-3.5 w-3.5 text-amber-500" />
            <span>Basic Local Analysis</span>
          </div>
        )}
      </div>

      {!isGemini && (
        <p className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5 mt-1 font-medium">
          <Info className="h-3.5 w-3.5 shrink-0" />
          <span>Notice: This analysis was generated using the local heuristic fallback engine.</span>
        </p>
      )}
    </div>
  );
}
