import React, { useState } from 'react';
import {
  Play,
  Code2,
  ListChecks,
  Timer,
  Shuffle,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Clock,
  Sparkles,
} from 'lucide-react';
import RichContent from './RichContent';

export default function StartTab({
  quiz,
  settings,
  onChangeSettings,
  onStartQuiz,
  onBackToUpload,
}) {
  const [showPreview, setShowPreview] = useState(false);

  const multiCount = quiz.questions.filter((q) => q.isMultipleChoice).length;
  const hasAnyTimeLimit = quiz.questions.some((q) => q.timeLimit !== null);

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div className="pastel-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
        <div
          className="animate-pop"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--pill-mint-bg)',
            color: 'var(--pill-mint-text)',
            padding: '7px 16px',
            borderRadius: 999,
            fontWeight: 800,
            fontSize: '0.88rem',
            border: '1.5px solid var(--pill-mint-border)',
            marginBottom: 14,
          }}
        >
          <CheckCircle2 size={17} />
          ¡Quiz listo para responder!
        </div>

        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 'clamp(1.6rem, 3vw, 2.15rem)',
            fontWeight: 900,
            color: 'var(--text-main)',
          }}
        >
          {quiz.title}
        </h1>
        <p style={{ margin: '0 auto 24px', maxWidth: 540, color: 'var(--text-muted)', fontSize: '0.98rem' }}>
          Todo está listo. Cuando presiones iniciar, comenzará el cronómetro para medir cuánto tiempo te toma responder todo el quiz.
        </p>

        {/* Stats Pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: 12,
            marginBottom: 26,
          }}
        >
          <div
            style={{
              background: 'var(--pill-purple-bg)',
              color: 'var(--pill-purple-text)',
              border: '1.5px solid var(--pill-purple-border)',
              padding: '10px 16px',
              borderRadius: 16,
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <ListChecks size={18} />
            {quiz.questions.length} {quiz.questions.length === 1 ? 'pregunta' : 'preguntas'}
          </div>

          <div
            style={{
              background: 'var(--pill-sky-bg)',
              color: 'var(--pill-sky-text)',
              border: '1.5px solid var(--pill-sky-border)',
              padding: '10px 16px',
              borderRadius: 16,
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Code2 size={18} />
            {quiz.codeQuestionsCount} con código detectado
          </div>

          {multiCount > 0 && (
            <div
              style={{
                background: 'var(--pill-pink-bg)',
                color: 'var(--pill-pink-text)',
                border: '1.5px solid var(--pill-pink-border)',
                padding: '10px 16px',
                borderRadius: 16,
                fontWeight: 800,
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
              }}
            >
              <Sparkles size={18} />
              {multiCount} de selección múltiple
            </div>
          )}

          <div
            style={{
              background: 'var(--pill-butter-bg)',
              color: 'var(--pill-butter-text)',
              border: '1.5px solid var(--pill-butter-border)',
              padding: '10px 16px',
              borderRadius: 16,
              fontWeight: 800,
              fontSize: '0.92rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Timer size={18} />
            Cronómetro activo
          </div>
        </div>

        {/* Settings */}
        <div
          style={{
            maxWidth: 520,
            margin: '0 auto 26px',
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
            textAlign: 'left',
          }}
        >
          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 16,
              background: 'var(--surface-subtle)',
              border: '1.5px solid var(--surface-subtle-border)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.93rem',
              color: 'var(--text-main)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <Shuffle size={17} color="#a78bfa" />
              Mezclar orden de las preguntas
            </span>
            <input
              type="checkbox"
              checked={settings.shuffleQuestions}
              onChange={(e) =>
                onChangeSettings({ ...settings, shuffleQuestions: e.target.checked })
              }
              style={{ width: 19, height: 19, accentColor: '#8b5cf6', cursor: 'pointer' }}
            />
          </label>

          <label
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: 12,
              padding: '12px 16px',
              borderRadius: 16,
              background: 'var(--surface-subtle)',
              border: '1.5px solid var(--surface-subtle-border)',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.93rem',
              color: 'var(--text-main)',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
              <Clock size={17} color="#a78bfa" />
              Mostrar tiempo por pregunta
            </span>
            <input
              type="checkbox"
              checked={settings.showQuestionTimer}
              onChange={(e) =>
                onChangeSettings({ ...settings, showQuestionTimer: e.target.checked })
              }
              style={{ width: 19, height: 19, accentColor: '#8b5cf6', cursor: 'pointer' }}
            />
          </label>

          {hasAnyTimeLimit && (
            <label
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 12,
                padding: '12px 16px',
                borderRadius: 16,
                background: 'var(--pill-butter-bg)',
                border: '1.5px solid var(--pill-butter-border)',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '0.93rem',
                color: 'var(--pill-butter-text)',
              }}
            >
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 9 }}>
                <Clock size={17} />
                Mostrar barra de tiempo sugerido del Excel
              </span>
              <input
                type="checkbox"
                checked={settings.showSuggestedTimer}
                onChange={(e) =>
                  onChangeSettings({ ...settings, showSuggestedTimer: e.target.checked })
                }
                style={{ width: 19, height: 19, accentColor: '#f59e0b', cursor: 'pointer' }}
              />
            </label>
          )}
        </div>

        {quiz.warnings?.length > 0 && (
          <div
            style={{
              maxWidth: 560,
              margin: '0 auto 22px',
              padding: '12px 16px',
              borderRadius: 16,
              background: 'var(--pill-butter-bg)',
              border: '1.5px solid var(--pill-butter-border)',
              color: 'var(--pill-butter-text)',
              textAlign: 'left',
              fontSize: '0.86rem',
              fontWeight: 700,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <AlertTriangle size={16} />
              Notas al importar:
            </div>
            <ul style={{ margin: 0, paddingLeft: 20 }}>
              {quiz.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Primary CTA */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <button
            type="button"
            className="btn-pastel btn-primary"
            style={{ padding: '16px 36px', fontSize: '1.15rem' }}
            onClick={onStartQuiz}
          >
            <Play size={22} fill="currentColor" />
            ¡Comenzar a responder!
          </button>

          <button
            type="button"
            className="btn-pastel btn-secondary"
            onClick={onBackToUpload}
          >
            <Upload size={17} />
            Cambiar archivo
          </button>
        </div>

        {/* Toggle Preview */}
        <div style={{ marginTop: 22 }}>
          <button
            type="button"
            onClick={() => setShowPreview((p) => !p)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--pill-purple-text)',
              fontWeight: 800,
              fontSize: '0.92rem',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontFamily: 'inherit',
            }}
          >
            {showPreview ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            {showPreview
              ? 'Ocultar vista previa de preguntas'
              : `Ver vista previa (${quiz.questions.length} preguntas)`}
          </button>
        </div>
      </div>

      {/* Collapsible Preview List */}
      {showPreview && (
        <div
          className="animate-fade-up"
          style={{ display: 'flex', flexDirection: 'column', gap: 14 }}
        >
          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="pastel-card" style={{ padding: '20px 22px' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: 10,
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <span
                  style={{
                    background: 'var(--pill-purple-bg)',
                    color: 'var(--pill-purple-text)',
                    fontWeight: 800,
                    fontSize: '0.82rem',
                    padding: '4px 12px',
                    borderRadius: 999,
                  }}
                >
                  Pregunta {idx + 1}
                </span>
                <div style={{ display: 'flex', gap: 8 }}>
                  {q.hasCode && (
                    <span
                      style={{
                        background: 'var(--pill-sky-bg)',
                        color: 'var(--pill-sky-text)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      Código detectado
                    </span>
                  )}
                  {q.isMultipleChoice && (
                    <span
                      style={{
                        background: 'var(--pill-pink-bg)',
                        color: 'var(--pill-pink-text)',
                        fontWeight: 800,
                        fontSize: '0.78rem',
                        padding: '4px 10px',
                        borderRadius: 999,
                      }}
                    >
                      Múltiple respuesta
                    </span>
                  )}
                </div>
              </div>

              <RichContent
                segments={q.questionSegments}
                textStyle={{ fontWeight: 700, fontSize: '1rem' }}
              />

              <div
                style={{
                  marginTop: 14,
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                  gap: 8,
                }}
              >
                {q.answers.map((ans, aIdx) => {
                  const isCorrect = q.correctIndices.includes(aIdx);
                  return (
                    <div
                      key={aIdx}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 14,
                        background: isCorrect ? 'var(--pill-mint-bg)' : 'var(--surface-neutral)',
                        border: `1.5px solid ${
                          isCorrect ? 'var(--pill-mint-border)' : 'var(--surface-neutral-border)'
                        }`,
                        color: isCorrect ? 'var(--pill-mint-text)' : 'var(--text-main)',
                        fontSize: '0.86rem',
                        fontWeight: 700,
                      }}
                    >
                      <RichContent segments={ans.segments} compact />
                    </div>
                  );
                })}
              </div>
            </div>
          )