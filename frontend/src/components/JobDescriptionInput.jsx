import React from 'react';
import { FileText, Sparkles } from 'lucide-react';

const MIN_CHARS = 20;

const SAMPLE_JDS = [
  {
    title: "Senior Full Stack Engineer (Python & React)",
    text: "We are seeking a Senior Full Stack Engineer with 5+ years of experience in Python, FastAPI, React, PostgreSQL, AWS, and Docker. Responsibilities include designing RESTful microservices, optimizing database queries, and deploying containerized applications to cloud environments."
  },
  {
    title: "Backend Engineer (FastAPI & Cloud)",
    text: "Looking for a Backend Developer skilled in Python, FastAPI, Microservices, REST APIs, Redis, PostgreSQL, Docker, and Kubernetes. Must have experience with unit testing, CI/CD pipelines, and performance optimization."
  }
];

export default function JobDescriptionInput({ value, onChange, error }) {
  const trimmedLen = value ? value.trim().length : 0;
  const isValid = trimmedLen >= MIN_CHARS;

  const handleSampleSelect = (sampleText) => {
    onChange(sampleText);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-sm font-semibold text-slate-900 dark:text-white">
          Target Job Description <span className="text-rose-500">*</span>
        </label>
        <span className={`text-xs font-mono font-medium ${isValid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'}`}>
          {trimmedLen} / min {MIN_CHARS} chars
        </span>
      </div>

      <div className="relative">
        <textarea
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Paste the complete job description here... (Minimum 20 characters required)"
          className={`w-full rounded-xl p-4 text-sm font-sans transition-all focus:outline-none focus:ring-2 resize-y bg-slate-50/50 dark:bg-slate-900/40 text-slate-900 dark:text-slate-100 ${
            error
              ? 'border border-rose-400 focus:ring-rose-500'
              : isValid
              ? 'border border-slate-300 dark:border-slate-700 focus:border-indigo-500 focus:ring-indigo-500/20'
              : 'border border-slate-300 dark:border-slate-700 focus:ring-slate-400'
          }`}
        />
      </div>

      {/* Quick Sample Presets */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
          <Sparkles className="h-3.5 w-3.5 text-indigo-500" /> Quick fill sample:
        </span>
        {SAMPLE_JDS.map((sample, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handleSampleSelect(sample.text)}
            className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800/80 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 dark:hover:bg-indigo-950/60 hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors border border-slate-200 dark:border-slate-700"
          >
            {sample.title}
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <p className="text-xs text-rose-500 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
