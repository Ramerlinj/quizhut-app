import React, { useState } from 'react';
import { Check, Copy, Terminal } from 'lucide-react';

function renderInlineText(text) {
  const parts = text.split(/(`[^`\n]+`)/g);
  return parts.map((part, idx) => {
    if (part.startsWith('`') && part.endsWith('`') && part.length >= 2) {
      return (
        <code key={idx} className="inline-code-pill font-mono">
          {part.slice(1, -1)}
        </code>
      );
    }
    return <React.Fragment key={idx}>{part}</React.Fragment>;
  });
}

function CodeBlock({ segment, compact = false }) {
  const [copied, setCopied] = useState(false);
  const lines = segment.content.split('\n');
  const showLineNumbers = !compact || lines.length > 1;

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(segment.content).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    });
  };

  return (
    <div
      className={`code-block-shell ${compact ? 'code-block-compact' : ''}`}
      onClick={(e) => {
        if (!compact) e.stopPropagation();
      }}
    >
      {!compact && (
        <div className="code-block-header">
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#9aa2ba',
            }}
          >
            <Terminal size={13} color="var(--accent-lavender)" />
            <span>{segment.label || 'Código'}</span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title="Copiar código"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'rgba(255,255,255,0.04)',
              color: copied ? '#86dfba' : '#b4bacb',
              fontSize: '0.73rem',
              fontWeight: 600,
              padding: '3px 9px',
              borderRadius: 6,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
      )}

      <pre className="code-block-pre font-mono">
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: compact ? 10 : 14 }}>
          {showLineNumbers && (
            <div
              aria-hidden="true"
              style={{
                userSelect: 'none',
                color: 'var(--code-gutter)',
                textAlign: 'right',
                minWidth: lines.length >= 10 ? '1.8em' : '1.2em',
                flexShrink: 0,
              }}
            >
              {lines.map((_, i) => (
                <div key={i}>{i + 1}</div>
              ))}
            </div>
          )}
          <code
            style={{ display: 'block', flex: 1, whiteSpace: 'pre' }}
            dangerouslySetInnerHTML={{ __html: segment.html }}
          />
        </div>
      </pre>
    </div>
  );
}

export default function RichContent({ segments, compact = false, textStyle = {} }) {
  if (!segments || segments.length === 0) return null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: compact ? 8 : 12,
        width: '100%',
      }}
    >
      {segments.map((seg, idx) => {
        if (seg.type === 'code') {
          return <CodeBlock key={idx} segment={seg} compact={compact} />;
        }
        return (
          <div
            key={idx}
            style={{
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word',
              lineHeight: compact ? 1.42 : 1.55,
              ...textStyle,
            }}
          >
            {renderInlineText(seg.content)}
          </div>
        );
      })}
    </div>
  );
}
