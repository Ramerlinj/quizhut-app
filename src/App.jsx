import React, { useEffect, useState } from 'react';
import { UploadCloud, PlayCircle, LayoutGrid, Moon, Sun } from 'lucide-react';
import UploadTab from './components/UploadTab';
import StartTab from './components/StartTab';
import QuizPlayer from './components/QuizPlayer';
import ResultsView from './components/ResultsView';
import { createSampleQuiz } from './utils/sampleQuiz';
import { buildQuizFromQuestions } from './utils/excelParser';

function shuffleArray(arr) {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export default function App() {
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window === 'undefined') return true;
    const saved = window.localStorage.getItem('pastelquiz-theme');
    return saved ? saved === 'dark' : true;
  });

  const [activeTab, setActiveTab] = useState('upload');
  const [quiz, setQuiz] = useState(null);
  const [phase, setPhase] = useState('ready'); // 'ready' | 'playing' | 'results'
  const [playQuestions, setPlayQuestions] = useState([]);
  const [runId, setRunId] = useState(0);
  const [summary, setSummary] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [settings, setSettings] = useState({
    shuffleQuestions: false,
    showQuestionTimer: true,
    showSuggestedTimer: false,
  });

  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    try {
      window.localStorage.setItem('pastelquiz-theme', theme);
    } catch {
      // Ignore storage errors
    }
  }, [darkMode]);

  const handleQuizLoaded = (loadedQuiz) => {
    setQuiz(loadedQuiz);
    setSummary(null);
    setPhase('ready');
    setActiveTab('quiz');
  };

  const handleLoadSample = () => {
    const sample = createSampleQuiz();
    handleQuizLoaded(sample);
  };

  const handleStartQuiz = () => {
    if (!quiz) return;
    const prepared = settings.shuffleQuestions
      ? shuffleArray(quiz.questions)
      : [...quiz.questions];
    setPlayQuestions(prepared);
    setSummary(null);
    setRunId((id) => id + 1);
    setPhase('playing');
    setActiveTab('quiz');
  };

  const handleCompleteQuiz = (resultSummary) => {
    setSummary(resultSummary);
    setPhase('results');
  };

  const handleCreateWrongQuiz = (wrongQuestions) => {
    if (!wrongQuestions || wrongQuestions.length === 0) return;
    const baseTitle = (quiz?.title || 'Quiz').replace(/^Repaso de falladas:\s*/i, '');
    const reviewQuiz = buildQuizFromQuestions(
      wrongQuestions,
      `Repaso de falladas: ${baseTitle}`
    );
    setQuiz(reviewQuiz);
    setSummary(null);
    setPhase('ready');
    setActiveTab('quiz');
  };

  return (
    <>
      <header className="top-header">
        <div className="top-header-inner">
          {/* Brand */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: 'var(--accent-lavender-soft)',
                border: '1px solid var(--accent-lavender-border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent-lavender)',
              }}
            >
              <LayoutGrid size={17} />
            </div>
            <div>
              <div
                className="font-display"
                style={{
                  fontWeight: 700,
                  fontSize: '1.02rem',
                  lineHeight: 1.15,
                  color: 'var(--text-main)',
                }}
              >
                PastelQuiz
              </div>
              <div style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>
                Evaluaciones desde Excel
              </div>
            </div>
          </div>

          {/* Navigation & Theme Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <nav className="segmented-nav" aria-label="Navegación principal">
              <button
                type="button"
                className={`segmented-tab ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <UploadCloud size={15} />
                Cargar archivo
              </button>

              <button
                type="button"
                disabled={!quiz}
                className={`segmented-tab ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                <PlayCircle size={15} />
                Evaluación
                {quiz && (
                  <span
                    style={{
                      background: 'var(--accent-lavender-soft)',
                      color: 'var(--accent-lavender)',
                      fontSize: '0.72rem',
                      padding: '1px 6px',
                      borderRadius: 5,
                      fontWeight: 600,
                    }}
                  >
                    {quiz.questions.length}
                  </span>
                )}
              </button>
            </nav>

            <button
              type="button"
              className="icon-btn"
              onClick={() => setDarkMode((d) => !d)}
              title={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>
        </div>
      </header>

      <main className="app-main">
        {activeTab === 'upload' && (
          <UploadTab onQuizLoaded={handleQuizLoaded} onLoadSample={handleLoadSample} />
        )}

        {activeTab === 'quiz' && quiz && phase === 'ready' && (
          <StartTab
            quiz={quiz}
            settings={settings}
            onChangeSettings={setSettings}
            onStartQuiz={handleStartQuiz}
            onBackToUpload={() => setActiveTab('upload')}
          />
        )}

        {activeTab === 'quiz' && quiz && phase === 'playing' && (
          <QuizPlayer
            key={runId}
            questions={playQuestions}
            quizTitle={quiz.title}
            settings={settings}
            soundEnabled={soundEnabled}
            onToggleSound={() => setSoundEnabled((s) => !s)}
            onToggleQuestionTimer={() =>
              setSettings((prev) => ({
                ...prev,
                showQuestionTimer: !prev.showQuestionTimer,
              }))
            }
            onComplete={handleCompleteQuiz}
          />
        )}

        {activeTab === 'quiz' && quiz && phase === 'results' && summary && (
          <ResultsView
            quizTitle={quiz.title}
            summary={summary}
            showQuestionTimer={settings.showQuestionTimer}
            onRetry={handleStartQuiz}
            onUploadNew={() => setActiveTab('upload')}
            onCreateWrongQuiz={handleCreateWrongQuiz}
          />
        )}
      </main>
    </>
  );
}
