import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function SkillsBadges({ matchingSkills = [], missingSkills = [] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Matching Skills Card */}
      <div className="p-6 rounded-2xl glass-card space-y-3 border-l-4 border-l-emerald-500">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Matching Skills ({matchingSkills.length})
          </h4>
        </div>

        {matchingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {matchingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-1.5 shadow-sm"
              >
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 dark:text-slate-400 italic">
            No matching key skills identified.
          </p>
        )}
      </div>

      {/* Missing Skills Card */}
      <div className="p-6 rounded-2xl glass-card space-y-3 border-l-4 border-l-amber-500">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-amber-500" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
            Missing Skills ({missingSkills.length})
          </h4>
        </div>

        {missingSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {missingSkills.map((skill, idx) => (
              <span
                key={idx}
                className="px-3 py-1 rounded-lg text-xs font-semibold bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/60 flex items-center gap-1.5 shadow-sm"
              >
                <AlertCircle className="h-3 w-3 text-amber-500" />
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
            Great news! No critical requested skills are missing.
          </p>
        )}
      </div>
    </div>
  );
}
