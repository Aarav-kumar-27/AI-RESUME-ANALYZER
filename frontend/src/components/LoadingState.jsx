import React, { useEffect, useState } from 'react';
import { Cpu, CheckCircle2, Loader2 } from 'lucide-react';

const STAGES = [
  "Uploading resume document...",
  "Extracting and sanitizing resume text...",
  "Analyzing technical & soft skills...",
  "Evaluating experience relevance & achievements...",
  "Generating grounded recommendations..."
];

export default function LoadingState() {
  const [currentStage, setCurrentStage] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentStage(prev => (prev < STAGES.length - 1 ? prev + 1 : prev));
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="glass-panel p-8 sm:p-12 rounded-2xl max-w-xl mx-auto text-center space-y-6">
      {/* Animated Glowing Icon */}
      <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-2xl blur-xl opacity-50 animate-pulse"></div>
        <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-600 text-white flex items-center justify-center shadow-xl">
          <Cpu className="h-10 w-10 animate-bounce" />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
          Analyzing Your Resume
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Our backend AI engine is evaluating your document against the job requirements...
        </p>
      </div>

      {/* Progress Stage Checklist */}
      <div className="bg-slate-50/80 dark:bg-slate-900/60 rounded-xl p-5 border border-slate-200 dark:border-slate-800 text-left space-y-3">
        {STAGES.map((stageText, idx) => {
          const isDone = idx < currentStage;
          const isCurrent = idx === currentStage;

          return (
            <div key={idx} className="flex items-center gap-3 text-xs sm:text-sm">
              {isDone ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="h-4 w-4 text-indigo-500 animate-spin shrink-0" />
              ) : (
                <span className="h-4 w-4 rounded-full border border-slate-300 dark:border-slate-700 shrink-0"></span>
              )}
              <span className={`font-medium ${isCurrent ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : isDone ? 'text-slate-700 dark:text-slate-300' : 'text-slate-400 dark:text-slate-600'}`}>
                {stageText}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
