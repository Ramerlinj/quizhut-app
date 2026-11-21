import React, { useRef, useState } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Sparkles,
  Download,
  Code2,
  Infinity as InfinityIcon,
  Timer,
  AlertCircle,
} from 'lucide-react';
import { downloadExcelTemplate, parseExcelFile } from '../utils/excelParser';

export default function UploadTab({ onQuizLoaded, onLoadSample }) {
  const inputRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleFile = async (file) => {
    if (!file) return;
    setErrorMsg('');
    setIsLoading(true);
    try {
      const quiz = await parseExcelFile(file);
      onQuizLoaded(quiz);
    } catch (err) {
      setErrorMsg(err?.message || 'No pudimos leer ese archivo. Verifica que sea .xlsx, .xls o .csv.');
    } finally {
      setIsLoading(false);
      if (inputRef.current) inputRef.current.value = '';
    }
  };

  const onDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  return (
    <div className="animate-fade-up" style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
      {/* Main Upload Card */}
      <div className="pastel-card" style={{ padding: '32px 28px', textAlign: 'center' }}>
        <div
          className="animate-bounce-slow"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            background: 'var(--pill-purple-bg)',
            color: 'var(--pill-purple-text)',
            padding: '7px 16px',
            borderRadius: 999,
            fontSize: '0.86rem',
            fontWeight: 800,
            marginBottom: 14,
            border: '1.5px solid var(--pill-purple-border)',
          }}
        >
          <Sparkles size={16} />
          Sube tu Excel estilo Kahoot — ¡sin límites!
        </div>

        <h1
          style={{
            margin: '0 0 8px',
            fontSize: 'clamp(1.65rem, 3.2vw, 2.25rem)',
            fontWeight: 900,
            color: 'var(--text-main)',
            letterSpacing: '-0.02em',
          }}
        >
          Convierte tu hoja de cálculo en un Quiz
        </h1>
        <p
          style={{
            margin: '0 auto 24px',
            maxWidth: 590,
            color: 'var(--text-muted)',
            fontSize: '1rem',
            lineHeight: 1.55,
          }}
        >
          Carga archivos <strong>.xlsx</strong>, <strong>.xls</strong> o <strong>.csv</strong>.
          Detectamos automáticamente fragmentos de código, respuestas múltiples y medimos tu tiempo total.
        </p>

        {/* Dropzone */}
        <div
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click();
          }}
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={onDrop}
          style={{
            border: `3px dashed ${isDragging ? '#a78bfa' : 'var(--dropzone-border)'}`,
            background: isDragging ? 'var(--dropzone-bg-active)' : 'var(--dropzone-bg)',
            borderRadius: 24,
            padding: '40px 24px',
            cursor: 'pointer',
            transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
            transform: isDragging ? 'scale(1.015)' : 'scale(1)',
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv,.ods"
            style={{ display: 'none' }}
            onChange={(e) => handleFile(e.target.files?.[0])}
          />

          <div
            style={{
              width: 74,
              height: 74,
              margin: '0 auto 14px',
              borderRadius: 22,
              background: 'linear-gradient(135deg, #c4b5fd, #fbcfe8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4c1d95',
              boxShadow: '0 8px 20px -6px rgba(139, 92, 246, 0.35)',
            }}
          >
            <UploadCloud size={36} />
          </div>

          <div style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
            {isLoading
              ? 'Analizando preguntas y detectando código...'
              : 'Arrastra tu archivo Excel aquí o haz clic para seleccionarlo'}
          </div>
          <div style={{ marginTop: 6, fontSize: '0.9rem', color: 'var(--text-soft)', fontWeight: 600 }}>
            Compatible con la plantilla de Kahoot y tablas personalizadas (.xlsx, .xls, .csv)
          </div>
        </div>

        {errorMsg && (
          <div
            className="animate-shake"
            style={{
              marginTop: 18,
              padding: '13px 16px',
              borderRadius: 16,
              background: 'var(--pill-rose-bg)',
              border: '2px solid var(--pill-rose-border)',
              color: 'var(--pill-rose-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              fontWeight: 700,
              fontSize: '0.94rem',
            }}
          >
            <AlertCircle size={19} />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Quick actions */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 12,
            justifyContent: 'center',
            marginTop: 22,
          }}
        >
          <button
            type="button"
            className="btn-pastel btn-secondary"
            onClick={downloadExcelTemplate}
          >
            <Download size={18} />
            Descargar plantilla (.xlsx)
          </button>

          <button
            type="button"
            className="btn-pastel btn-mint"
            onClick={onLoadSample}
          >
            <FileSpreadsheet size={18} />
            Probar con Quiz de ejemplo
          </button>
        </div>
      </div>

      {/* Feature Highlights */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: 16,
        }}
      >
        <div
          className="pastel-card"
          style={{
            padding: 20,
            background: 'var(--feature-pink-bg)',
            borderColor: 'var(--pill-pink-border)',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: 'var(--pill-pink-bg)',
              color: 'var(--pill-pink-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <InfinityIcon size={22} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '1.02rem', fontWeight: 800 }}>
            Sin límite de caracteres
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.48 }}>
            Olvídate del límite de 120 o 75 caracteres. Escribe enunciados largos, casos completos y opciones detalladas.
          </p>
        </div>

        <div
          className="pastel-card"
          style={{
            padding: 20,
            background: 'var(--feature-purple-bg)',
            borderColor: 'var(--pill-purple-border)',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: 'var(--pill-purple-bg)',
              color: 'var(--pill-purple-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <Code2 size={22} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '1.02rem', fontWeight: 800 }}>
            Detección automática de código
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.48 }}>
            Usa <code className="inline-code-pill">```python</code> o pega código directo con saltos de línea: lo estructuramos y resaltamos al instante.
          </p>
        </div>

        <div
          className="pastel-card"
          style={{
            padding: 20,
            background: 'var(--feature-mint-bg)',
            borderColor: 'var(--pill-mint-border)',
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 14,
              background: 'var(--pill-mint-bg)',
              color: 'var(--pill-mint-text)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 10,
            }}
          >
            <Timer size={22} />
          </div>
          <h3 style={{ margin: '0 0 6px', fontSize: '1.02rem', fontWeight: 800 }}>
            Cronómetro de tiempo total
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: 1.48 }}>
            Mide exactamente cuánto tardas en completar el quiz y repasa tus preguntas falladas creando un nuevo quiz al instante.
          </p>
        </div>
      </div>
    </div>
  );
}
