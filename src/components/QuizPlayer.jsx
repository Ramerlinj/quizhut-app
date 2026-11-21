import React, { useEffect, useRef, useState } from 'react';
import {
  Timer,
  ArrowRight,
  CheckCircle2,
  XCircle,
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
  Layers,
} from 'lucide-react';
import RichContent from './RichContent';
import { formatDurationMs, formatSecondsShort } from '../utils/timeFormat';
import { playSound } from '../utils/sound';

const SHAPE_ICONS = [Triangle, Diamond, Circle, Square, Star, Hexagon];

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

  const quizStartRef = useRef(Date.now());
  const questionStartRef = useRef(Date.now());
  const [totalElapsedMs, setTotalElapsedMs] = useState(0);
  const [questionElapsedMs, setQuestionElapsedMs] = useState(0);
  const [frozenTotalMs, setFrozenTotalMs] = useState(null);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

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

  const suggestedMs = currentQuestion.timeLimit ? currentQuestion.timeLimit * 1000 : null;
  const suggestedRemainingPct = suggestedMs
    ? Math.max(0, Math.min(100, ((suggestedMs - questionElapsedMs) / suggestedMs) * 100))
    : 0;
  const suggestedExpired = suggestedMs !== null && questionElapsedMs > suggestedMs;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Minimalist Session HUD */}
      <div className="surface-card" style={{ overflow: 'hidden' }}>
        <div
          style={{
            padding: '12px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 0 }}>
            <span className="badge badge-lavender">
              Pregunta {currentIndex + 1} / {questions.length}
            </span>
            <span
              style={{
                color: 'var(--text-muted)',
                fontWeight: 500,
                fontSize: '0.85rem',
                maxWidth: 240,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
              title={quizTitle}
            >
              {quizTitle}
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
            {streak >= 2 && (
              <span className="badge badge-amber">
                <Flame size={13} />
                Racha {streak}
              </span>
            )}

            <div
              className="badge badge-sky font-mono"
              title="Tiempo total de la sesión"
              style={{ fontVariantNumeric: 'tabular-nums' }}
            >
              <Timer size={14} />
              {formatDurationMs(totalElapsedMs)}
            </div>

            {settings.showQuestionTimer ? (
              <button
                type="button"
                onClick={onToggleQuestionTimer}
                title="Tiempo en esta pregunta (clic para ocultar)"
                className="badge font-mono"
                style={{
                  cursor: 'pointer',
                  fontVariantNumeric: 'tabular-nums',
                }}
              >
                <Clock size={13} />
                {formatSecondsShort(questionElapsedMs)}
                <EyeOff size={12} style={{ opacity: 0.65 }} />
              </button>
            ) : (
              <button
                type="button"
                onClick={onToggleQuestionTimer}
                title="Mostrar tiempo por pregunta"
                className="badge"
                style={{ cursor: 'pointer', color: 'var(--text-muted)' }}
              >
                <Clock size={13} />
                Mostrar tiempo/preg.
              </button>
            )}

            <button
              type="button"
              onClick={onToggleSound}
              title={soundEnabled ? 'Silenciar efectos' : 'Activar sonidos'}
              className="icon-btn"
              style={{ width: 30, height: 30, borderRadius: 7 }}
            >
              {soundEnabled ? <Volume2 size={15} /> : <VolumeX size={15} />}
            </button>
          </div>
        </div>

        {/* Optional Suggested Time Reference */}
        {settings.showSuggestedTimer && suggestedMs !== null && (
          <div
            style={{
              padding: '0 18px 10px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                color: suggestedExpired ? 'var(--accent-rose)' : 'var(--accent-amber)',
                whiteSpace: 'nowrap',
              }}
            >
              {suggestedExpired
                ? `Tiempo sugerido (${currentQuestion.timeLimit}s) superado`
                : `Sugerido: ${Math.ceil(Math.max(0, suggestedMs - questionElapsedMs) / 1000)}s`}
            </span>
            <div
              style={{
                flex: 1,
                height: 3,
                borderRadius: 999,
                background: 'var(--surface-3)',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${suggestedRemainingPct}%`,
                  background: suggestedExpired ? 'var(--accent-rose)' : 'var(--accent-amber)',
                  transition: 'width 0.15s linear',
                }}
              />
            </div>
          </div>
        )}

        {/* Slim Progress Track */}
        <div
          style={{
            height: 3,
            background: 'var(--surface-2)',
            width: '100%',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              background: 'var(--accent-lavender)',
              transition: 'width 0.35s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div
        key={`${currentQuestion.id}-${currentIndex}`}
        className="surface-card animate-enter"
        style={{ padding: '24px 26px' }}
      >
        {currentQuestion.isMultipleChoice && (
          <div style={{ marginBottom: 12 }}>
            <span className="badge badge-lavender">
              <Layers size={13} />
              Selección múltiple — marca todas las opciones correctas
            </span>
          </div>
        )}

        <RichContent
          segments={currentQuestion.questionSegments}
          textStyle={{
            fontSize: 'clamp(1.04rem, 1.8vw, 1.22rem)',
            fontWeight: 600,
            color: 'var(--text-main)',
          }}
        />
      </div>

      {/* Answer Options Grid */}
      <div
        key={`answers-${currentQuestion.id}-${currentIndex}`}
        className="answer-grid animate-enter"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
          gap: 12,
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
              className={`option-card ${statusClass}`}
            >
              <div
                className={`option-shape-badge ${
                  isSubmitted && isCorrectOption
                    ? 'option-tone-3'
                    : isSubmitted && isSelected && !isCorrectOption
                    ? 'option-tone-0'
                    : `option-tone-${idx % 6}`
                }`}
              >
                {isSubmitted && isCorrectOption ? (
                  <Check size={15} strokeWidth={2.8} />
                ) : (
                  <ShapeIcon size={14} strokeWidth={2.2} />
                )}
              </div>

              <div style={{ flex: 1, minWidth: 0, paddingTop: 2 }}>
                <RichContent
                  segments={ans.segments}
                  compact
                  textStyle={{
                    fontWeight: 500,
                    fontSize: '0.94rem',
                  }}
                />
              </div>

              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  flexShrink: 0,
                  marginTop: 2,
                }}
              >
                {!isSubmitted && currentQuestion.isMultipleChoice && (
                  <span
                    style={{
                      width: 18,
                      height: 18,
                      borderRadius: 5,
                      border: `1.5px solid ${
                        isSelected ? 'var(--accent-lavender)' : 'var(--border-strong)'
                      }`,
                      background: isSelected ? 'var(--accent-lavender)' : 'transparent',
                      color: '#13121c',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected && <Check size={12} strokeWidth={3} />}
                  </span>
                )}
                <span className="kbd-hint">{idx + 1}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Multi-select Confirm */}
      {!isSubmitted && currentQuestion.isMultipleChoice && (
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 2 }}>
          <button
            type="button"
            className="btn btn-primary btn-lg"
            disabled={selectedIndices.length === 0}
            onClick={() => evaluateAnswer(selectedIndices)}
          >
            <CheckCircle2 size={17} />
            Confirmar ({selectedIndices.length})
          </button>
        </div>
      )}

      {/* Clean Feedback Bar */}
      {isSubmitted && lastResult && (
        <div
          className="surface-card animate-enter"
          style={{
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            borderColor: lastResult.isCorrect
              ? 'var(--accent-mint-border)'
              : 'var(--accent-rose-border)',
            background: lastResult.isCorrect
              ? 'var(--accent-mint-soft)'
              : 'var(--accent-rose-soft)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
            {lastResult.isCorrect ? (
              <CheckCircle2 size={22} color="var(--accent-mint)" />
            ) : (
              <XCircle size={22} color="var(--accent-rose)" />
            )}
            <div>
              <div
                style={{
                  fontWeight: 600,
                  fontSize: '0.96rem',
                  color: lastResult.isCorrect ? 'var(--accent-mint)' : 'var(--accent-rose)',
                }}
              >
                {lastResult.isCorrect
                  ? 'Respuesta correcta'
                  : 'Respuesta incorrecta — revisa la opción marcada en verde'}
              </div>
              {settings.showQuestionTimer && (
                <div
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--text-secondary)',
                    marginTop: 1,
                  }}
                >
                  Tiempo empleado: {formatSecondsShort(lastResult.timeSpentMs)}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleNext}
          >
            {isLastQuestion ? 'Ver resultados' : 'Siguiente'}
            <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
