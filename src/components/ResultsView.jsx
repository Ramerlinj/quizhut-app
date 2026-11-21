import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Timer,
  RotateCcw,
  Upload,
  CheckCircle2,
  XCircle,
  Zap,
  Flame,
  Clock,
  RefreshCw,
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
  const [filter, setFilter] = useState('all'); // 'all' | 'wrong'

  const { results, totalTimeMs, bestStreak } = summary;
  const totalQuestions = results.length;
  const correctCount = results.filter((r) => r.isCorrect).length;
  const wrongQuestions = results.filter((r) => !r.isCorrect).map((r) => r.question);
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
  const avgMs = totalQuestions > 0 ? totalTimeMs / totalQuestions : 0;

  useEffect(() => {
    if (accuracy >= 80) {
      confetti({
        particleCount: 48,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#c4b5fd', '#86dfba', '#93c8f5', '#ecc982'],
      });
    }
  }, [accuracy]);

  const headline =
    accuracy === 100
      ? 'Evaluación completada sin errores'
      : accuracy >= 75
      ? 'Buen resultado general'
      : accuracy >= 50
      ? 'Evaluación completada'
      : 'Sesión finalizada — repasa los errores';

  const visibleResults =
    filter === 'wrong'
      ? results
          .map((item, idx) => ({ item, idx }))
          .filter(({ item }) => !item.isCorrect)
      : results.map((item, idx) => ({ item, idx }));

  return (
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Executive Summary Card */}
      <div className="surface-card" style={{ padding: '28px 28px 24px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 16,
            marginBottom: 22,
          }}
        >
          <div>
            <span className="badge badge-lavender" style={{ marginBottom: 10 }}>
              <Award size={13} />
              {quizTitle}
            </span>
            <h1
              style={{
                margin: '0 0 6px',
                fontSize: '1.55rem',
                fontWeight: 700,
                color: 'var(--text-main)',
              }}
            >
              {headline}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Resumen de rendimiento, tiempo de ejecución y desglose por pregunta.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary" onClick={onUploadNew}>
              <Upload size={15} />
              Otro archivo
            </button>
            <button type="button" className="btn btn-primary" onClick={onRetry}>
              <RotateCcw size={15} />
              Reintentar
            </button>
          </div>
        </div>

        {/* 4-column KPI Strip */}
        <div
          className="metric-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            border: '1px solid var(--border-hairline)',
            borderRadius: 12,
            background: 'var(--surface-2)',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '16px 18px', borderRight: '1px solid var(--border-hairline)' }}>
            <div
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}
            >
              Precisión
            </div>
            <div
              style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: accuracy >= 75 ? 'var(--accent-mint)' : 'var(--text-main)',
              }}
            >
              {accuracy}%
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              {correctCount} de {totalQuestions} correctas
            </div>
          </div>

          <div style={{ padding: '16px 18px', borderRight: '1px solid var(--border-hairline)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}
            >
              <Timer size={13} color="var(--accent-sky)" />
              Tiempo total
            </div>
            <div
              className="font-mono"
              style={{
                fontSize: '1.45rem',
                fontWeight: 600,
                color: 'var(--text-main)',
                fontVariantNumeric: 'tabular-nums',
              }}
            >
              {formatDurationMs(totalTimeMs, true)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              min : seg
            </div>
          </div>

          <div style={{ padding: '16px 18px', borderRight: '1px solid var(--border-hairline)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}
            >
              <Zap size={13} color="var(--accent-lavender)" />
              Promedio / preg.
            </div>
            <div
              className="font-mono"
              style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--text-main)' }}
            >
              {formatSecondsShort(avgMs)}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              ritmo medio
            </div>
          </div>

          <div style={{ padding: '16px 18px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}
            >
              <Flame size={13} color="var(--accent-amber)" />
              Mejor racha
            </div>
            <div
              className="font-mono"
              style={{ fontSize: '1.45rem', fontWeight: 600, color: 'var(--text-main)' }}
            >
              {bestStreak}
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: 2 }}>
              aciertos seguidos
            </div>
          </div>
        </div>

        {/* Review Quiz Builder for Wrong Questions */}
        {wrongQuestions.length > 0 && (
          <div
            style={{
              marginTop: 18,
              padding: '16px 18px',
              borderRadius: 12,
              background: 'var(--accent-rose-soft)',
              border: '1px solid var(--accent-rose-border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 14,
            }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: '0.94rem', color: 'var(--accent-rose)' }}>
                {wrongQuestions.length}{' '}
                {wrongQuestions.length === 1 ? 'pregunta incorrecta' : 'preguntas incorrectas'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: 2 }}>
                Genera una nueva evaluación enfocada únicamente en tus fallos o expórtalas a Excel.
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => exportQuizToExcel(wrongQuestions, `Repaso_${quizTitle}`)}
              >
                <Download size={15} />
                Exportar .xlsx
              </button>

              <button
                type="button"
                className="btn btn-accent-rose"
                onClick={() => onCreateWrongQuiz(wrongQuestions)}
              >
                <RefreshCw size={15} />
                Crear quiz con falladas ({wrongQuestions.length})
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Review List Header & Filter */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 10,
          marginTop: 4,
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>
          Revisión detallada
        </h2>

        {wrongQuestions.length > 0 && (
          <div className="segmented-nav">
            <button
              type="button"
              className={`segmented-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              Todas ({totalQuestions})
            </button>
            <button
              type="button"
              className={`segmented-tab ${filter === 'wrong' ? 'active' : ''}`}
              onClick={() => setFilter('wrong')}
            >
              Incorrectas ({wrongQuestions.length})
            </button>
          </div>
        )}
      </div>

      {/* Detailed Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {visibleResults.map(({ item, idx }) => {
          const { question, selectedIndices, isCorrect, timeSpentMs } = item;
          return (
            <div
              key={`${question.id}-${idx}`}
              className="surface-card"
              style={{
                padding: '18px 20px',
                borderColor: isCorrect
                  ? 'var(--border-hairline)'
                  : 'var(--accent-rose-border)',
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
                    <CheckCircle2 size={17} color="var(--accent-mint)" />
                  ) : (
                    <XCircle size={17} color="var(--accent-rose)" />
                  )}
                  <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>
                    Pregunta {idx + 1}
                  </span>
                  <span className={`badge ${isCorrect ? 'badge-mint' : 'badge-rose'}`}>
                    {isCorrect ? 'Correcta' : 'Incorrecta'}
                  </span>
                </div>

                {showQuestionTimer && (
                  <span className="badge font-mono">
                    <Clock size={12} />
                    {formatSecondsShort(timeSpentMs)}
                  </span>
                )}
              </div>

              <RichContent
                segments={question.questionSegments}
                textStyle={{ fontWeight: 600, fontSize: '0.96rem' }}
              />

              <div
                style={{
                  marginTop: 12,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: 8,
                }}
              >
                {question.answers.map((ans, aIdx) => {
                  const wasPicked = selectedIndices.includes(aIdx);
                  const isRightAns = question.correctIndices.includes(aIdx);

                  let bg = 'var(--surface-2)';
                  let border = 'var(--border-hairline)';
                  let color = 'var(--text-secondary)';
                  let tag = null;
                  let tagIcon = null;

                  if (isRightAns) {
                    bg = 'var(--accent-mint-soft)';
                    border = 'var(--accent-mint-border)';
                    color = 'var(--accent-mint)';
                    tag = wasPicked ? 'Tu respuesta correcta' : 'Respuesta correcta';
                    tagIcon = <Check size={12} strokeWidth={2.8} />;
                  } else if (wasPicked) {
                    bg = 'var(--accent-rose-soft)';
                    border = 'var(--accent-rose-border)';
                    color = 'var(--accent-rose)';
                    tag = 'Tu elección';
                    tagIcon = <X size={12} strokeWidth={2.8} />;
                  }

                  return (
                    <div
                      key={aIdx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 9,
                        background: bg,
                        border: `1px solid ${border}`,
                        color,
                        fontSize: '0.85rem',
                        fontWeight: 500,
                      }}
                    >
                      {tag && (
                        <div
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 4,
                            fontSize: '0.73rem',
                            fontWeight: 600,
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
