import React, { useState } from 'react';
import { Check, Copy, Code2 } from 'lucide-react';

function renderInlineText(text) {
  // Split prose by inline backtick code `...`
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span
              style={{
                display: 'inline-flex',
                gap: 5,
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#eb6f92',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#f6c177',
                  display: 'inline-block',
                }}
              />
              <span
                style={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  background: '#9ccfd8',
                  display: 'inline-block',
                }}
              />
            </span>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 5,
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#c4a7e7',
                background: 'rgba(196, 167, 231, 0.14)',
                padding: '2px 9px',
                borderRadius: 999,
                marginLeft: 4,
              }}
            >
              <Code2 size={13} />
              {segment.label || 'Código'}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopy}
            title="Copiar código"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5,
              border: 'none',
              background: 'rgba(224, 222, 244, 0.1)',
              color: copied ? '#9ccfd8' : '#e0def4',
              fontSize: '0.74rem',
              fontWeight: 700,
              padding: '4px 10px',
              borderRadius: 10,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            {copied ? <Check size={13} /> : <Copy size={13} />}
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
                color: '#6e6a86',
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
        gap: compact ? 8 : 14,
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
              lineHeight: compact ? 1.38 : 1.5,
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
