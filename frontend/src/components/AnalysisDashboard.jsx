import React from 'react';
import SourceBadge from './SourceBadge';
import ScoreGauge from './ScoreGauge';
import ScoreBreakdown from './ScoreBreakdown';
import SkillsBadges from './SkillsBadges';
import FeedbackList from './FeedbackList';
import { RotateCcw, FileText, Sparkles } from 'lucide-react';

export default function AnalysisDashboard({ data, onReset }) {
  if (!data) return null;

  const {
    overall_score,
    analysis_source,
    scores,
    matching_skills,
    missing_skills,
    strengths,
    weaknesses,
    actionable_suggestions,
    summary
  } = data;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2">
          <SourceBadge source={analysis_source} />
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Resume Match Results
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
            {summary || "Evaluation completed against provided target job profile."}
          </p>
        </div>

        <button
          onClick={onReset}
          className="self-start md:self-center px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-lg shadow-indigo-500/25 flex items-center gap-2 transition-all shrink-0 active:scale-95"
        >
          <RotateCcw className="h-4 w-4" />
          <span>Analyze Another Resume</span>
        </button>
      </div>

      {/* Top Grid: Overall Score Gauge & Category Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <ScoreGauge score={overall_score} />
        </div>
        <div className="md:col-span-2">
          <ScoreBreakdown scores={scores} />
        </div>
      </div>

      {/* Matching vs Missing Skills */}
      <SkillsBadges matchingSkills={matching_skills} missingSkills={missing_skills} />

      {/* Feedback: Strengths, Weaknesses, and Actionable Suggestions */}
      <FeedbackList
        strengths={strengths}
        weaknesses={weaknesses}
        suggestions={actionable_suggestions}
      />
    </div>
  );
}
