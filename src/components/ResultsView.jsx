import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Timer,
  RotateCcw,
  Upload,
  CheckCircle2,
  XCircle,
  Zap,
  Flame,
  Clock,
  Sparkles,
  Download,
  Check,
  X,
} from 'lucide-react';
import RichContent from './RichContent';
import { formatDurationMs, formatSecondsShort } from '../utils/timeFormat';
import { exportQuizToExcel } from '../utils/excelParser';

export default function ResultsView({
  quizTitle,
  summary,
  showQuestionTimer = true,
  onRetry,
  onUploadNew,
  onCreateWrongQuiz,
}) {
  const { results, totalTimeMs, bestStreak } = summary;
  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const wrongQuestions = results.filter((r) => !r.isCorrect).map((r) => r.question);
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const avgMs = totalQuestions > 0 ? totalTimeMs / totalQuestions : 0;

  useEffect(() => {
    const end = Date.now() + 900;
    const colors = ['#c4b5fd', '#fbcfe8', '#a7f3d0', '#bae6fd', '#fde68a'];
    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    })();
  }, []);

  const message =
    accuracy === 100
      ? '¡Puntuación perfecta!'
      : accuracy >= 75
      ? '¡Muy buen trabajo!'
      : accuracy >= 50
      ? '¡Buen intento, sigue practicando!'
      : '¡Buena práctica! Inténtalo otra vez';

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Hero Result Card */}
      <div className="pastel-card" style={{ padding: '34px 26px', textAlign: 'center' }}>
        <div
          className="animate-bounce-slow"
          style={{
            width: 82,
            height: 82,
            margin: '0 auto 14px',
            borderRadius: 26,
            background: 'linear-gradient(135deg, #fde68a, #fbcfe8)',
            color: '#78350f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 10px 24px -8px rgba(245, 158, 11, 0.4)',
          }}
        >
          <Trophy size={42} />
        </div>

        <div
          style={{
            fontSize: '0.9rem',
            fontWeight: 800,
            color: 'var(--pill-purple-text)',
            marginBottom: 4,
          }}
        >
          {quizTitle}
        </div>
        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 'clamp(1.65rem, 3.2vw, 2.2rem)',
            fontWeight: 900,
            color: 'var(--text-main)',
          }}
        >
          {message}
        </h1>
        <p style={{ margin: '0 auto 24px', color: 'var(--text-muted)', fontSize: '0.98rem' }}>
          Aquí tienes tu resumen de aciertos y el tiempo exacto que te tomó completarlo.
        </p>

        {/* Stats Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
            gap: 14,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              background: 'var(--pill-mint-bg)',
              border: '2px solid var(--pill-mint-border)',
              color: 'var(--pill-mint-text)',
              borderRadius: 20,
              padding: '16px 14px',
            }}
          >
            <div style={{ fontWeight: 800, fontSize: '0.84rem', marginBottom: 4, opacity: 0.9 }}>
              Aciertos
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900 }}>
              {correctCount}/{totalQuestions}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 800, opacity: 0.9 }}>
              {accuracy}% de precisión
            </div>
          </div>

          <div
            style={{
              background: 'var(--pill-sky-bg)',
              border: '2px solid var(--pill-sky-border)',
              color: 'var(--pill-sky-text)',
              borderRadius: 20,
              padding: '16px 14px',
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: '0.84rem',
                marginBottom: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                opacity: 0.9,
              }}
            >
              <Timer size={15} />
              Tiempo total
            </div>
            <div
              style={{
                fontSize: '1.85rem',
                fontWeight: 900,
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatDurationMs(totalTimeMs, true)}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, opacity: 0.85 }}>
              min : seg
            </div>
          </div>

          <div
            style={{
              background: 'var(--pill-purple-bg)',
              border: '2px solid var(--pill-purple-border)',
              color: 'var(--pill-purple-text)',
              borderRadius: 20,
              padding: '16px 14px',
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: '0.84rem',
                marginBottom: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                opacity: 0.9,
              }}
            >
              <Zap size={15} />
              Promedio / pregunta
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900 }}>
              {formatSecondsShort(avgMs)}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, opacity: 0.85 }}>
              ritmo medio
            </div>
          </div>

          <div
            style={{
              background: 'var(--pill-butter-bg)',
              border: '2px solid var(--pill-butter-border)',
              color: 'var(--pill-butter-text)',
              borderRadius: 20,
              padding: '16px 14px',
            }}
          >
            <div
              style={{
                fontWeight: 800,
                fontSize: '0.84rem',
                marginBottom: 4,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                opacity: 0.9,
              }}
            >
              <Flame size={15} />
              Mejor racha
            </div>
            <div style={{ fontSize: '1.85rem', fontWeight: 900 }}>
              {bestStreak}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, opacity: 0.85 }}>
              seguidas
            </div>
          </div>
        </div>

        {/* Retry / Upload Actions */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
          <button type="button" className="btn-pastel btn-primary" onClick={onRetry}>
            <RotateCcw size={19} />
            Volver a intentar
          </button>
          <button type="button" className="btn-pastel btn-secondary" onClick={onUploadNew}>
            <Upload size={18} />
            Subir otro Excel
          </button>
        </div>

        {/* Create Quiz from Wrong Questions Callout */}
        {wrongQuestions.length > 0 && (
          <div
            className="animate-pop"
            style={{
              marginTop: 22,
              padding: '18px 20px',
              borderRadius: 22,
              background: 'var(--pill-rose-bg)',
              border: '2px solid var(--pill-rose-border)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <div
              style={{
                color: 'var(--pill-rose-text)',
                fontWeight: 900,
                fontSize: '1.02rem',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={18} />
              Fallaste {wrongQuestions.length}{' '}
              {wrongQuestions.length === 1 ? 'pregunta' : 'preguntas'} — ¿quieres reforzarlas?
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, justifyContent: 'center' }}>
              <button
                type="button"
                className="btn-pastel btn-coral"
                onClick={() => onCreateWrongQuiz(wrongQuestions)}
              >
                <Sparkles size={18} />
                Crear quiz con las {wrongQuestions.length} falladas
              </button>

              <button
                type="button"
                className="btn-pastel btn-secondary"
                onClick={() => exportQuizToExcel(wrongQuestions, `Repaso_${quizTitle}`)}
              >
                <Download size={17} />
                Descargar falladas (.xlsx)
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detailed Breakdown */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <h2 style={{ margin: '4px 6px', fontSize: '1.2rem', fontWeight: 900 }}>
          Revisión por pregunta
        </h2>

        {results.map((item, idx) => {
          const { question, selectedIndices, isCorrect, timeSpentMs } = item;
          return (
            <div
              key={`${question.id}-${idx}`}
              className="pastel-card"
              style={{
                padding: '20px 22px',
                borderColor: isCorrect ? 'var(--pill-mint-border)' : 'var(--pill-rose-border)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {isCorrect ? (
                    <CheckCircle2 size={21} color="#10b981" />
                  ) : (
                    <XCircle size={21} color="#fb7185" />
                  )}
                  <span style={{ fontWeight: 900, fontSize: '0.96rem' }}>
                    Pregunta {idx + 1}
                  </span>
                  <span
                    style={{
                      background: isCorrect ? 'var(--pill-mint-bg)' : 'var(--pill-rose-bg)',
                      color: isCorrect ? 'var(--pill-mint-text)' : 'var(--pill-rose-text)',
                      padding: '3px 10px',
                      borderRadius: 999,
                      fontSize: '0.78rem',
                      fontWeight: 800,
                    }}
                  >
                    {isCorrect ? 'Correcta' : 'Incorrecta'}
                  </span>
                </div>

                {showQuestionTimer && (
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 5,
                      background: 'var(--pill-purple-bg)',
                      color: 'var(--pill-purple-text)',
                      padding: '4px 11px',
                      borderRadius: 999,
                      fontSize: '0.82rem',
                      fontWeight: 800,
                    }}
                  >
                    <Clock size={14} />
                    {formatSecondsShort(timeSpentMs)}
                  </span>
                )}
              </div>

              <RichContent
                segments={question.questionSegments}
                textStyle={{ fontWeight: 800, fontSize: '1rem' }}
              />

              <div
                style={{
                  marginTop: 14,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: 8,
                }}
              >
                {question.answers.map((ans, aIdx) => {
                  const wasPicked = selectedIndices.includes(aIdx);
                  const isRightAns = question.correctIndices.includes(aIdx);

                  let bg = 'var(--surface-neutral)';
                  let border = 'var(--surface-neutral-border)';
                  let color = 'var(--text-main)';
                  let tag = null;
                  let tagIcon = null;

                  if (isRightAns) {
                    bg = 'var(--pill-mint-bg)';
                    border = 'var(--pill-mint-border)';
                    color = 'var(--pill-mint-text)';
                    tag = wasPicked ? 'Tu respuesta correcta' : 'Respuesta correcta';
                    tagIcon = <Check size={13} strokeWidth={3} />;
                  } else if (wasPicked) {
                    bg = 'var(--pill-rose-bg)';
                    border = 'var(--pill-rose-border)';
                    color = 'var(--pill-rose-text)';
                    tag = 'Tu elección';
                    tagIcon = <X size={13} strokeWidth={3} />;
                  }

                  return (
                    <div
                      key={aIdx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 14,
                        background: bg,
                        border: `1.5px solid ${border}`,
                        color,
                        fontSize: '0.88rem',
                        fontWeight: 700,
                      }}
                    >
                      {tag && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.74rem',
                            fontWeight: 900,
                            marginBottom: 4,
                          }}
                        >
                          {tagIcon}
                          {tag}
                        </div>
                      )}
                      <RichContent segments={ans.segments} compact />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
