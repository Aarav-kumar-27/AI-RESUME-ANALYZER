import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Navbar from './components/Navbar';
import FileUploader from './components/FileUploader';
import JobDescriptionInput from './components/JobDescriptionInput';
import LoadingState from './components/LoadingState';
import AnalysisDashboard from './components/AnalysisDashboard';
import { analyzeResume, getHealthStatus } from './services/api';
import { Sparkles, ArrowRight, AlertTriangle, ShieldCheck } from 'lucide-react';

function AppContent() {
  const [viewState, setViewState] = useState('INPUT'); // 'INPUT' | 'LOADING' | 'RESULT' | 'ERROR'
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [fileError, setFileError] = useState(null);
  const [jdError, setJdError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [healthStatus, setHealthStatus] = useState(false);

  // Initial Health Check
  useEffect(() => {
    getHealthStatus()
      .then(() => setHealthStatus(true))
      .catch(() => setHealthStatus(false));
  }, []);

  const handleAnalyze = async (e) => {
    e.preventDefault();
    setFileError(null);
    setJdError(null);
    setSubmitError(null);

    // Validate Input Client-Side
    let valid = true;
    if (!file) {
      setFileError('Please upload a PDF or DOCX resume.');
      valid = false;
    }

    if (!jobDescription || jobDescription.trim().length < 20) {
      setJdError('Please provide a target job description with at least 20 characters.');
      valid = false;
    }

    if (!valid) return;

    // Transition to LOADING state
    setViewState('LOADING');

    try {
      const data = await analyzeResume(file, jobDescription.trim());
      setAnalysisResult(data);
      setViewState('RESULT');
    } catch (err) {
      console.error('Analysis submission failed:', err);
      setSubmitError(err.message || 'An error occurred while processing your request.');
      setViewState('INPUT');
    }
  };

  const handleReset = () => {
    setFile(null);
    setJobDescription('');
    setFileError(null);
    setJdError(null);
    setSubmitError(null);
    setAnalysisResult(null);
    setViewState('INPUT');
  };

  const isFormValid = file && jobDescription && jobDescription.trim().length >= 20;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-200">
      {/* Navigation Header */}
      <Navbar
        onReset={handleReset}
        isResultState={viewState === 'RESULT'}
        healthStatus={healthStatus}
      />

      {/* Main Body Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full">
        {/* INPUT STATE */}
        {viewState === 'INPUT' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Hero Title Section */}
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-300 text-xs font-semibold">
                <Sparkles className="h-3.5 w-3.5 text-indigo-500" />
                <span>Grounded Resume Match & ATS Optimization</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                AI Resume Analyzer
              </h2>

              <p className="text-base text-slate-600 dark:text-slate-400">
                See how well your resume matches the job you're targeting.
              </p>
            </div>

            {/* General Submission Error Banner */}
            {submitError && (
              <div className="max-w-2xl mx-auto p-4 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3 shadow-sm">
                <AlertTriangle className="h-5 w-5 text-rose-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Analysis Request Failed</p>
                  <p className="text-xs text-rose-600 dark:text-rose-300 mt-0.5">{submitError}</p>
                </div>
              </div>
            )}

            {/* Input Form Panel */}
            <form onSubmit={handleAnalyze} className="glass-panel p-6 sm:p-10 rounded-2xl space-y-8 shadow-xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Left: Resume Upload */}
                <FileUploader
                  file={file}
                  setFile={setFile}
                  error={fileError}
                  setError={setFileError}
                />

                {/* Right: Job Description Input */}
                <JobDescriptionInput
                  value={jobDescription}
                  onChange={(val) => {
                    setJobDescription(val);
                    if (val.trim().length >= 20) setJdError(null);
                  }}
                  error={jdError}
                />
              </div>

              {/* Submit Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition-all ${
                    isFormValid
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-indigo-500/25 active:scale-95 cursor-pointer'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-300 dark:border-slate-700'
                  }`}
                >
                  <span>Analyze Resume</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>

            {/* Trust Footer Notes */}
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 dark:text-slate-400 pt-4">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-500" /> In-Memory Text Parsing (No Document Storage)
              </span>
              <span>&bull;</span>
              <span>Supported Formats: PDF, DOCX (Max 5 MB)</span>
              <span>&bull;</span>
              <span>FastAPI Backend Security</span>
            </div>
          </div>
        )}

        {/* LOADING STATE */}
        {viewState === 'LOADING' && <LoadingState />}

        {/* RESULT DASHBOARD STATE */}
        {viewState === 'RESULT' && (
          <AnalysisDashboard data={analysisResult} onReset={handleReset} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 py-6 text-center text-xs text-slate-500 dark:text-slate-400 transition-colors">
        AI Resume Analyzer &bull; Step 4 Verified &bull; Grounded Resume Analysis Architecture
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
