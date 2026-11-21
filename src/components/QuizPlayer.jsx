import React, { useEffect, useRef, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  ArrowRight,
  CheckCircle2,
  XCircle,
  Sparkles,
  Flame,
  Volume2,
  VolumeX,
  Check,
  Clock,
  EyeOff,
  Triangle,
  Diamond,
  Circle,
  Square,
  Star,
  Hexagon,
} from 'lucide-react';
import RichContent from './RichContent';
import { formatDurationMs, formatSecondsShort } from '../utils/timeFormat';
import { playSound } from '../utils/sound';

const SHAPE_ICONS = [Triangle, Diamond, Circle, Square, Star, Hexagon];
const SHAPE_BG = [
  '#fb7185',
  '#38bdf8',
  '#f59e0b',
  '#10b981',
  '#8b5cf6',
  '#fb923c',
];

function setsEqual(a, b) {
  if (a.length !== b.length) return false;
  const setA = new Set(a);
  return b.every((item) => setA.has(item));
}

export default function QuizPlayer({
  questions,
  quizTitle,
  settings,
  soundEnabled,
  onToggleSound,
  onToggleQuestionTimer,
  onComplete,
}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndices, setSelectedIndices] = useState([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [results, setResults] = useState([]);

  // Timers
  const quizStartRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const [questionElapsedMs, setQuestionElapsedMs] = useState(0);
  const [frozenTotalMs, setFrozenTotalMs] = useState(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Live stopwatch tick
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      if (frozenTotalMs === null) {
        setTotalElapsedMs(now - quizStartRef.current);
      }
      if (!isSubmitted) {
        setQuestionElapsedMs(now - questionStartRef.current);
      }
    }, 100);
    return () => clearInterval(interval);
  }, [isSubmitted, frozenTotalMs]);

  const evaluateAnswer = (chosenIndices) => {
    if (isSubmitted) return;
    const now = Date.now();
    const spentMs = now - questionStartRef.current;
    const totalNowMs = now - quizStartRef.current;

    const sortedChosen = [...chosenIndices].sort((a, b) => a - b);
    const isCorrect = setsEqual(sortedChosen, currentQuestion.correctIndices);

    setQuestionElapsedMs(spentMs);
    setIsSubmitted(true);

    if (isLastQuestion) {
      setFrozenTotalMs(totalNowMs);
      setTotalElapsedMs(totalNowMs);
    }

    if (isCorrect) {
      const nextStreak = streak + 1;
      setStreak(nextStreak);
      setBestStreak((prev) => Math.max(prev, nextStreak));
      playSound('correct', soundEnabled);
      confetti({
        particleCount: 42,
        spread: 62,
        origin: { y: 0.72 },
        colors: ['#c4b5fd', '#fbcfe8', '#a7f3d0', '#bae6fd', '#fde68a'],
      });
    } else {
      setStreak(0);
      playSound('wrong', soundEnabled);
    }

    const record = {
      question: currentQuestion,
      selectedIndices: sortedChosen,
      isCorrect,
      timeSpentMs: spentMs,
    };

    setResults((prev) => [...prev, record]);
  };

  const handleOptionClick = (idx) => {
    if (isSubmitted) return;

    if (!currentQuestion.isMultipleChoice) {
      setSelectedIndices([idx]);
      evaluateAnswer([idx]);
      return;
    }

    playSound('click', soundEnabled);
    setSelectedIndices((prev) =>
      prev.includes(idx) ? prev.filter((item) => item !== idx) : [...prev, idx]
    );
  };

  const handleNext = () => {
    if (!isSubmitted) return;

    if (isLastQuestion) {
      playSound('finish', soundEnabled);
      onComplete({
        results,
        totalTimeMs: frozenTotalMs ?? totalElapsedMs,
        bestStreak,
      });
      return;
    }

    setCurrentIndex((prev) => prev + 1);
    setSelectedIndices([]);
    setIsSubmitted(false);
    questionStartRef.current = Date.now();
    setQuestionElapsedMs(0);
  };

  // Keyboard shortcuts (1-6 to pick, Enter to confirm/next)
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      const num = parseInt(e.key, 10);
      if (num >= 1 && num <= currentQuestion.answers.length && !isSubmitted) {
        e.preventDefault();
        handleOptionClick(num - 1);
      } else if (e.key === 'Enter') {
        if (!isSubmitted && currentQuestion.isMultipleChoice && selectedIndices.length > 0) {
          e.preventDefault();
          evaluateAnswer(selectedIndices);
        } else if (isSubmitted) {
          e.preventDefault();
          handleNext();
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const progressPercent = ((currentIndex + (isSubmitted ? 1 : 0)) / questions.length) * 100;
  const lastResult = isSubmitted ? results[results.length - 1] : null;

  // Optional suggested time progress
  const suggestedMs = currentQuestion.timeLimit ? currentQuestion.timeLimit * 1000 : null;
  const suggestedRemainingPct = suggestedMs
    ? Math.max(0, Math.min(100, ((suggestedMs - questionElapsedMs) / suggestedMs) * 100))
    : 0;
  const suggestedExpired = suggestedMs !== null && questionElapsedMs > suggestedMs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* HUD Header */}
      <div
        className="pastel-card"
        style={{
          padding: '14px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                background: 'var(--pill-purple-bg)',
                color: 'var(--pill-purple-text)',
                padding: '6px 14px',
                borderRadius: 999,
                fontWeight: 900,
                fontSize: '0.9rem',
                border: '1.5px solid var(--pill-purple-border)',
              }}
            >
              Pregunta {currentIndex + 1} / {questions.length}
            </span>

            <span
              style={{
                color: 'var(--text-muted)',
                fontWeight: 700,
                fontSize: '0.9rem',
                maxWidth: 220,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={quizTitle}
            >
              {quizTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
            {streak >= 2 && (
              <span
                className="animate-pop"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'var(--pill-butter-bg)',
                  color: 'var(--pill-butter-text)',
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  border: '1.5px solid var(--pill-butter-border)',
                }}
              >
                <Flame size={16} fill="#f59e0b" color="#d97706" />
                Racha x{streak}
              </span>
            )}

            {/* Total Elapsed Stopwatch */}
            <div
              title="Tiempo total que llevas respondiendo el quiz"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 7,
                background: 'var(--pill-sky-bg)',
                color: 'var(--pill-sky-text)',
                padding: '6px 14px',
                borderRadius: 999,
                fontWeight: 900,
                fontSize: '0.94rem',
                border: '1.5px solid var(--pill-sky-border)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              <Timer size={17} />
              <span>Total: {formatDurationMs(totalElapsedMs)}</span>
            </div>

            {/* Per-question elapsed (toggleable) */}
            {settings.showQuestionTimer ? (
              <button
                type="button"
                onClick={onToggleQuestionTimer}
                title="Tiempo en esta pregunta (clic para ocultar)"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                  background: 'var(--pill-purple-bg)',
                  color: 'var(--pill-purple-text)',
                  padding: '6px 12px',
                  borderRadius: 999,
                  fontWeight: 800,
                  fontSize: '0.86rem',
                  fontVariantNumeric: 'tabular-nums',
                  border: '1.5px solid var(--pill-purple-border)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <Clock size={15} />
                {formatSecondsShort(questionElapsedMs)}
                <EyeOff size={13} style={{ opacity: 0.65 }} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleQuestionTimer}
                title="Mostrar tiempo por pregunta"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  background: 'var(--surface-btn)',
                  color: 'var(--text-muted)',
                  padding: '6px 11px',
                  borderRadius: 999,
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  border: '1.5px solid var(--surface-btn-border)',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                }}
              >
                <Clock size={14} />
                Mostrar tiempo/preg.
              </button>
            )}

            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Silenciar efectos' : 'Activar sonidos'}
              style={{
                width: 36,
                height: 36,
                borderRadius: 12,
                border: '1.5px solid var(--surface-btn-border)',
                background: 'var(--surface-btn)',
                color: 'var(--pill-purple-text)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
            >
              {soundEnabled ? <Volume2 size={17} /> : <VolumeX size={17} />}
            </button>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div
          style={{
            height: 10,
            borderRadius: 999,
            background: 'var(--progress-track)',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              borderRadius: 999,
              background: 'linear-gradient(90deg, #a78bfa, #f472b6, #6ee7b7)',
              transition: 'width 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)',
            }}
          />
        </div>

        {/* Optional Suggested Time Limit Bar */}
        {settings.showSuggestedTimer && suggestedMs !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span
              style={{
                fontSize: '0.76rem',
                fontWeight: 800,
                color: suggestedExpired ? 'var(--pill-rose-text)' : 'var(--pill-butter-text)',
                whiteSpace: 'nowrap',
              }}
            >
              {suggestedExpired
                ? `Tiempo sugerido (${currentQuestion.timeLimit}s) cumplido — ¡toma tu tiempo!`
                : `Sugerido: ${Math.ceil(Math.max(0, suggestedMs - questionElapsedMs) / 1000)}s`}
            </span>
            <div
              style={{
                flex: 1,
                height: 6,
                borderRadius: 999,
                background: 'var(--suggested-track)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${suggestedRemainingPct}%`,
                  borderRadius: 999,
                  background: suggestedExpired ? '#fda4af' : '#fbbf24',
                  transition: 'width 0.15s linear',
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Question Card */}
      <div
        key={`${currentQuestion.id}-${currentIndex}`}
        className="pastel-card animate-fade-up"
        style={{ padding: '26px 26px 24px' }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            flexWrap: 'wrap',
            marginBottom: 14,
          }}
        >
          {currentQuestion.isMultipleChoice && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'var(--pill-pink-bg)',
                color: 'var(--pill-pink-text)',
                padding: '5px 12px',
                borderRadius: 999,
                fontSize: '0.82rem',
                fontWeight: 800,
                border: '1.5px solid var(--pill-pink-border)',
              }}
            >
              <Sparkles size={14} />
              Selección múltiple — elige todas las correctas
            </span>
          )}
        </div>

        <RichContent
          segments={currentQuestion.questionSegments}
          textStyle={{
            fontSize: 'clamp(1.1rem, 2.2vw, 1.35rem)',
            fontWeight: 800,
            color: 'var(--text-main)',
          }}
        />
      </div>

      {/* Answer Options Grid */}
      <div
        key={`answers-${currentQuestion.id}-${currentIndex}`}
        className="answer-grid animate-fade-up"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 14,
          animationDelay: '0.06s',
        }}
      >
        {currentQuestion.answers.map((ans, idx) => {
          const isSelected = selectedIndices.includes(idx);
          const isCorrectOption = currentQuestion.correctIndices.includes(idx);

          let statusClass = '';
          if (isSubmitted) {
            if (isCorrectOption) {
              statusClass = 'is-correct';
            } else if (isSelected && !isCorrectOption) {
              statusClass = 'is-wrong';
            } else {
              statusClass = 'is-dimmed';
            }
          } else if (isSelected) {
            statusClass = 'is-selected';
          }

          const ShapeIcon = SHAPE_ICONS[idx % 6];
          return (
            <button
              key={idx}
              type="button"
              disabled={isSubmitted}
              onClick={() => handleOptionClick(idx)}
              className={`answer-card answer-theme-${idx % 6} ${statusClass}`}
            >
              <div
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 12,
                  background: isSubmitted && isCorrectOption
                    ? '#10b981'
                    : isSubmitted && isSelected && !isCorrectOption
                    ? '#f43f5e'
                    : SHAPE_BG[idx % 6],
                  color: '#ffffff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 3px 8px rgba(0,0,0,0.12)',
                }}
              >
                {isSubmitted && isCorrectOption ? (
                  <Check size={20} strokeWidth={3} />
                ) : (
                  <ShapeIcon size={18} fill="currentColor" strokeWidth={2.2} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <RichContent
                  segments={ans.segments}
                  compact
                  textStyle={{
                    fontWeight: 800,
                    fontSize: '0.98rem',
                  }}
                />
              </div>

              {!isSubmitted && currentQuestion.isMultipleChoice && (
                <div
                  style={{
                    width: 24,
                    height: 24,
                    borderRadius: 8,
                    border: `2.5px solid ${isSelected ? '#7c3aed' : 'rgba(0,0,0,0.18)'}`,
                    background: isSelected ? '#8b5cf6' : 'rgba(255,255,255,0.7)',
                    color: '#ffffff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {isSelected && <Check size={15} strokeWidth={3} />}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Action / Feedback Footer */}
      {!isSubmitted && currentQuestion.isMultipleChoice && (
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 4 }}>
          <button
            type="button"
            className="btn-pastel btn-primary"
            disabled={selectedIndices.length === 0}
            onClick={() => evaluateAnswer(selectedIndices)}
          >
            <CheckCircle2 size={20} />
            Comprobar respuestas ({selectedIndices.length} seleccionadas)
          </button>
        </div>
      )}

      {isSubmitted && lastResult && (
        <div
          className="pastel-card animate-pop"
          style={{
            padding: '18px 22px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            background: lastResult.isCorrect
              ? 'var(--feedback-correct-bg)'
              : 'var(--feedback-wrong-bg)',
            borderColor: lastResult.isCorrect
              ? 'var(--pill-mint-border)'
              : 'var(--pill-rose-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {lastResult.isCorrect ? (
              <CheckCircle2 size={30} color="#10b981" />
            ) : (
              <XCircle size={30} color="#fb7185" />
            )}
            <div>
              <div
                style={{
                  fontWeight: 900,
                  fontSize: '1.08rem',
                  color: lastResult.isCorrect
                    ? 'var(--feedback-correct-title)'
                    : 'var(--feedback-wrong-title)',
                }}
              >
                {lastResult.isCorrect
                  ? '¡Excelente! Respuesta correcta'
                  : 'Casi — revisa las opciones marcadas en verde'}
              </div>
              {settings.showQuestionTimer && (
                <div
                  style={{
                    fontSize: '0.88rem',
                    fontWeight: 700,
                    color: lastResult.isCorrect
                      ? 'var(--feedback-correct-sub)'
                      : 'var(--feedback-wrong-sub)',
                  }}
                >
                  Tiempo en esta pregunta: {formatSecondsShort(lastResult.timeSpentMs)}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="btn-pastel btn-primary"
            onClick={handleNext}
          >
            {isLastQuestion ? 'Ver resultados finales' : 'Siguiente pregunta'}
            <ArrowRight size={19} />
          </button>
        </div>
      )}
    </div>
  );
}
