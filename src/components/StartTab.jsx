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
  Layers,
} from 'lucide-react';
import RichContent from './RichContent';

function SettingToggleRow({ icon: Icon, label, description, checked, onToggle }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onToggle}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        width: '100%',
        textAlign: 'left',
        padding: '13px 16px',
        background: 'transparent',
        border: 'none',
        cursor: 'pointer',
        fontFamily: 'inherit',
        color: 'var(--text-main)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 11 }}>
        <Icon size={17} color="var(--text-muted)" style={{ marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>{label}</div>
          {description && (
            <div style={{ fontSize: '0.79rem', color: 'var(--text-muted)', marginTop: 2 }}>
              {description}
            </div>
          )}
        </div>
      </div>

      <span className={`toggle-switch ${checked ? 'is-on' : ''}`} aria-hidden="true" />
    </button>
  );
}

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
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <div className="surface-card" style={{ padding: '28px 28px 24px' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 14,
            marginBottom: 22,
          }}
        >
          <div>
            <span className="badge badge-mint" style={{ marginBottom: 10 }}>
              <CheckCircle2 size={13} />
              Archivo cargado
            </span>
            <h1
              style={{
                margin: '0 0 6px',
                fontSize: '1.55rem',
                fontWeight: 700,
                color: 'var(--text-main)',
              }}
            >
              {quiz.title}
            </h1>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Revisa la configuración de la sesión antes de comenzar. El cronómetro total iniciará al empezar.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-secondary"
            onClick={onBackToUpload}
          >
            <Upload size={15} />
            Cambiar archivo
          </button>
        </div>

        {/* Structured Metrics Strip */}
        <div
          className="metric-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
            border: '1px solid var(--border-hairline)',
            borderRadius: 12,
            background: 'var(--surface-2)',
            marginBottom: 22,
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border-hairline)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}
            >
              <ListChecks size={14} color="var(--accent-lavender)" />
              Preguntas
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {quiz.questions.length}
            </div>
          </div>

          <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border-hairline)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}
            >
              <Code2 size={14} color="var(--accent-sky)" />
              Con código
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {quiz.codeQuestionsCount}
            </div>
          </div>

          <div style={{ padding: '14px 16px', borderRight: '1px solid var(--border-hairline)' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}
            >
              <Layers size={14} color="var(--accent-rose)" />
              Múltiple opción
            </div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {multiCount}
            </div>
          </div>

          <div style={{ padding: '14px 16px' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--text-muted)',
                marginBottom: 4,
              }}
            >
              <Timer size={14} color="var(--accent-mint)" />
              Cronómetro
            </div>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--accent-mint)', marginTop: 4 }}>
              Activo
            </div>
          </div>
        </div>

        {/* Settings List */}
        <div
          style={{
            border: '1px solid var(--border-hairline)',
            borderRadius: 12,
            background: 'var(--surface-1)',
            marginBottom: 22,
            overflow: 'hidden',
          }}
        >
          <div style={{ borderBottom: '1px solid var(--border-hairline)' }}>
            <SettingToggleRow
              icon={Shuffle}
              label="Mezclar orden de las preguntas"
              description="Presenta las preguntas en orden aleatorio en cada intento."
              checked={settings.shuffleQuestions}
              onToggle={() =>
                onChangeSettings({ ...settings, shuffleQuestions: !settings.shuffleQuestions })
              }
            />
          </div>

          <div
            style={{
              borderBottom: hasAnyTimeLimit ? '1px solid var(--border-hairline)' : 'none',
            }}
          >
            <SettingToggleRow
              icon={Clock}
              label="Mostrar tiempo por pregunta"
              description="Muestra el cronómetro individual de la pregunta actual y en la revisión."
              checked={settings.showQuestionTimer}
              onToggle={() =>
                onChangeSettings({ ...settings, showQuestionTimer: !settings.showQuestionTimer })
              }
            />
          </div>

          {hasAnyTimeLimit && (
            <SettingToggleRow
              icon={Timer}
              label="Mostrar barra de tiempo sugerido del Excel"
              description="Usa la columna de tiempo límite del archivo como referencia visual."
              checked={settings.showSuggestedTimer}
              onToggle={() =>
                onChangeSettings({
                  ...settings,
                  showSuggestedTimer: !settings.showSuggestedTimer,
                })
              }
            />
          )}
        </div>

        {quiz.warnings?.length > 0 && (
          <div
            style={{
              marginBottom: 20,
              padding: '12px 15px',
              borderRadius: 10,
              background: 'var(--accent-amber-soft)',
              border: '1px solid var(--accent-amber-border)',
              color: 'var(--accent-amber)',
              fontSize: '0.84rem',
              fontWeight: 500,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontWeight: 600, marginBottom: 4 }}>
              <AlertTriangle size={15} />
              Observaciones al importar
            </div>
            <ul style={{ margin: 0, paddingLeft: 18 }}>
              {quiz.warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Footer Actions */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setShowPreview((p) => !p)}
          >
            {showPreview ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showPreview
              ? 'Ocultar vista previa'
              : `Vista previa (${quiz.questions.length})`}
          </button>

          <button
            type="button"
            className="btn btn-primary btn-lg"
            onClick={onStartQuiz}
          >
            <Play size={16} fill="currentColor" />
            Iniciar evaluación
          </button>
        </div>
      </div>

      {/* Preview List */}
      {showPreview && (
        <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {quiz.questions.map((q, idx) => (
            <div key={q.id} className="surface-card" style={{ padding: '18px 20px' }}>
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
                <span className="badge badge-lavender">Pregunta {idx + 1}</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {q.hasCode && <span className="badge badge-sky">Código</span>}
                  {q.isMultipleChoice && <span className="badge badge-rose">Múltiple</span>}
                </div>
              </div>

              <RichContent
                segments={q.questionSegments}
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
                {q.answers.map((ans, aIdx) => {
                  const isCorrect = q.correctIndices.includes(aIdx);
                  return (
                    <div
                      key={aIdx}
                      style={{
                        padding: '9px 12px',
                        borderRadius: 9,
                        background: isCorrect ? 'var(--accent-mint-soft)' : 'var(--surface-2)',
                        border: `1px solid ${
                          isCorrect ? 'var(--accent-mint-border)' : 'var(--border-hairline)'
                        }`,
                        color: isCorrect ? 'var(--accent-mint)' : 'var(--text-secondary)',
                        fontSize: '0.84rem',
                        fontWeight: 500,
                      }}
                    >
                      <RichContent segments={ans.segments} compact />
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
