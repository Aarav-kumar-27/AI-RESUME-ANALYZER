import React from 'react';
import { useTheme } from '../context/ThemeContext';
import { Cpu, Sun, Moon, RotateCcw, Activity } from 'lucide-react';

export default function Navbar({ onReset, isResultState, healthStatus }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-900/60 backdrop-blur-md sticky top-0 z-50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={onReset}>
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white">
            <Cpu className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
              AI Resume Analyzer
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grounded AI Match & ATS Compatibility
            </p>
          </div>
        </div>

        {/* Action Controls & Theme Toggle */}
        <div className="flex items-center gap-3">
          {/* Health Status Pill */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-medium">
            <span className={`h-2 w-2 rounded-full ${healthStatus ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></span>
            <span className="text-slate-600 dark:text-slate-300">
              {healthStatus ? 'Backend Ready' : 'Connecting...'}
            </span>
          </div>

          {/* Reset / Analyze Another Button */}
          {isResultState && (
            <button
              onClick={onReset}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900 text-xs font-semibold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Analyze Another</span>
            </button>
          )}

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-slate-600" />}
          </button>
        </div>
      </div>
    </header>
  );
}
