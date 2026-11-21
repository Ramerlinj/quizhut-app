import React, { useEffect, useState } from 'react';
import { UploadCloud, PlayCircle, Sparkles, Moon, Sun } from 'lucide-react';
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
      {/* Animated Pastel Background Blobs */}
      <div className="pastel-bg" aria-hidden="true">
        <div className="blob blob-1" />
        <div className="blob blob-2" />
        <div className="blob blob-3" />
        <div className="blob blob-4" />
      </div>

      <div className="app-container">
        {/* Top Bar */}
        <header
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            marginBottom: 24,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            <div
              style={{
                width: 46,
                height: 46,
                borderRadius: 16,
                background: 'linear-gradient(135deg, #c4b5fd 0%, #fbcfe8 55%, #fde68a 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4c1d95',
                boxShadow: '0 8px 20px -6px rgba(139, 92, 246, 0.35)',
              }}
            >
              <Sparkles size={24} />
            </div>
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: '1.3rem',
                  letterSpacing: '-0.02em',
                  lineHeight: 1.1,
                }}
              >
                PastelQuiz
              </div>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                Excel → Quiz interactivo con código
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            <nav className="nav-tabs" aria-label="Navegación principal">
              <button
                type="button"
                className={`nav-tab ${activeTab === 'upload' ? 'active' : ''}`}
                onClick={() => setActiveTab('upload')}
              >
                <UploadCloud size={18} />
                Cargar Excel
              </button>

              <button
                type="button"
                disabled={!quiz}
                className={`nav-tab ${activeTab === 'quiz' ? 'active' : ''}`}
                onClick={() => setActiveTab('quiz')}
              >
                <PlayCircle size={18} />
                Responder Quiz
                {quiz && (
                  <span
                    style={{
                      background: 'var(--pill-purple-bg)',
                      color: 'var(--pill-purple-text)',
                      fontSize: '0.74rem',
                      padding: '2px 8px',
                      borderRadius: 999,
                      fontWeight: 900,
                    }}
                  >
                    {quiz.questions.length}
                  </span>
                )}
              </button>
            </nav>

            <button
              type="button"
              className="icon-pill-btn"
              onClick={() => setDarkMode((d) => !d)}
              title={darkMode ? 'Cambiar a modo claro pastel' : 'Cambiar a modo oscuro pastel'}
              aria-label={darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            >
              {darkMode ? <Sun size={19} color="#fde68a" /> : <Moon size={19} color="#6d28d9" />}
            </button>
          </div>
        </header>

        {/* Active Tab Content */}
        <main>
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
      </div>
    </>
  );
}
