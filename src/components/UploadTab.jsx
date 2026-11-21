import React, { useRef, useState } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Download,
  Code2,
  Infinity as InfinityIcon,
  Timer,
  AlertCircle,
  ArrowUpRight,
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
      setErrorMsg(err?.message || 'No se pudo procesar el archivo. Verifica que sea .xlsx, .xls o .csv.');
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
    <div className="animate-enter" style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      {/* Main Upload Panel */}
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
            <h1
              style={{
                margin: '0 0 6px',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--text-main)',
              }}
            >
              Importar cuestionario
            </h1>
            <p
              style={{
                margin: 0,
                color: 'var(--text-secondary)',
                fontSize: '0.92rem',
                lineHeight: 1.5,
                maxWidth: 580,
              }}
            >
              Sube un archivo Excel o CSV compatible con la plantilla de Kahoot o una tabla simple.
              Al cargar el archivo pasarás directamente a la vista de inicio.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={downloadExcelTemplate}
            >
              <Download size={15} />
              Plantilla .xlsx
            </button>

            <button
              type="button"
              className="btn btn-accent-mint"
              onClick={onLoadSample}
            >
              <FileSpreadsheet size={15} />
              Cargar ejemplo
              <ArrowUpRight size={14} />
            </button>
          </div>
        </div>

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
            border: `1.5px dashed ${isDragging ? 'var(--accent-lavender)' : 'var(--border-strong)'}`,
            background: isDragging ? 'var(--accent-lavender-soft)' : 'var(--surface-2)',
            borderRadius: 12,
            padding: '44px 24px',
            textAlign: 'center',
            cursor: 'pointer',
            transition: 'border-color 0.16s ease, background-color 0.16s ease',
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
              width: 44,
              height: 44,
              margin: '0 auto 12px',
              borderRadius: 10,
              background: 'var(--surface-1)',
              border: '1px solid var(--border-hairline)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-lavender)',
            }}
          >
            <Upload size={20} />
          </div>

          <div style={{ fontSize: '0.98rem', fontWeight: 600, color: 'var(--text-main)' }}>
            {isLoading
              ? 'Procesando archivo y estructurando bloques de código...'
              : 'Arrastra tu archivo aquí o haz clic para seleccionarlo'}
          </div>
          <div style={{ marginTop: 6, fontSize: '0.82rem', color: 'var(--text-muted)' }}>
            Formatos soportados: .xlsx, .xls, .csv, .ods
          </div>
        </div>

        {errorMsg && (
          <div
            style={{
              marginTop: 16,
              padding: '11px 14px',
              borderRadius: 10,
              background: 'var(--accent-rose-soft)',
              border: '1px solid var(--accent-rose-border)',
              color: 'var(--accent-rose)',
              display: 'flex',
              alignItems: 'center',
              gap: 9,
              fontWeight: 500,
              fontSize: '0.88rem',
            }}
          >
            <AlertCircle size={17} style={{ flexShrink: 0 }} />
            <span>{errorMsg}</span>
          </div>
        )}
      </div>

      {/* Clean 3-column Spec Strip */}
      <div
        className="surface-card spec-strip"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            padding: '18px 20px',
            borderRight: '1px solid var(--border-hairline)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: '0.86rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              marginBottom: 6,
            }}
          >
            <InfinityIcon size={16} color="var(--accent-rose)" />
            Sin límite de caracteres
          </div>
          <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Soporta enunciados extensos y opciones largas sin recortar ni rechazar contenido.
          </p>
        </div>

        <div
          style={{
            padding: '18px 20px',
            borderRight: '1px solid var(--border-hairline)',
          }}
        >
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: '0.86rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              marginBottom: 6,
            }}
          >
            <Code2 size={16} color="var(--accent-lavender)" />
            Detección de código
          </div>
          <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Formatea bloques <code className="inline-code-pill">```</code> o código multilínea con resaltado de sintaxis.
          </p>
        </div>

        <div style={{ padding: '18px 20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 7,
              fontSize: '0.86rem',
              fontWeight: 600,
              color: 'var(--text-main)',
              marginBottom: 6,
            }}
          >
            <Timer size={16} color="var(--accent-mint)" />
            Control de tiempo y repaso
          </div>
          <p style={{ margin: 0, fontSize: '0.83rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>
            Registra el tiempo total de sesión y genera un nuevo quiz con tus errores al finalizar.
          </p>
        </div>
      </div>
    </div>
  );
}
