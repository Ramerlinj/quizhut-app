import hljs from 'highlight.js/lib/core';
import python from 'highlight.js/lib/languages/python';
import javascript from 'highlight.js/lib/languages/javascript';
import typescript from 'highlight.js/lib/languages/typescript';
import sql from 'highlight.js/lib/languages/sql';
import xml from 'highlight.js/lib/languages/xml';
import css from 'highlight.js/lib/languages/css';
import java from 'highlight.js/lib/languages/java';
import cpp from 'highlight.js/lib/languages/cpp';
import c from 'highlight.js/lib/languages/c';
import csharp from 'highlight.js/lib/languages/csharp';
import json from 'highlight.js/lib/languages/json';
import bash from 'highlight.js/lib/languages/bash';
import go from 'highlight.js/lib/languages/go';
import rust from 'highlight.js/lib/languages/rust';
import php from 'highlight.js/lib/languages/php';

hljs.registerLanguage('python', python);
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('typescript', typescript);
hljs.registerLanguage('sql', sql);
hljs.registerLanguage('html', xml);
hljs.registerLanguage('xml', xml);
hljs.registerLanguage('css', css);
hljs.registerLanguage('java', java);
hljs.registerLanguage('cpp', cpp);
hljs.registerLanguage('c', c);
hljs.registerLanguage('csharp', csharp);
hljs.registerLanguage('json', json);
hljs.registerLanguage('bash', bash);
hljs.registerLanguage('go', go);
hljs.registerLanguage('rust', rust);
hljs.registerLanguage('php', php);

const SUPPORTED_LANGS = [
  'python',
  'javascript',
  'typescript',
  'sql',
  'html',
  'css',
  'java',
  'cpp',
  'csharp',
  'json',
  'bash',
  'go',
  'rust',
  'php',
];

const LANG_ALIASES = {
  py: 'python',
  python3: 'python',
  js: 'javascript',
  jsx: 'javascript',
  node: 'javascript',
  ts: 'typescript',
  tsx: 'typescript',
  htm: 'html',
  xhtml: 'xml',
  'c++': 'cpp',
  cc: 'cpp',
  cs: 'csharp',
  'c#': 'csharp',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  ps1: 'bash',
  golang: 'go',
  rs: 'rust',
  postgres: 'sql',
  mysql: 'sql',
  sqlite: 'sql',
};

const LANG_LABELS = {
  python: 'Python',
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  sql: 'SQL',
  html: 'HTML',
  xml: 'XML',
  css: 'CSS',
  java: 'Java',
  cpp: 'C++',
  c: 'C',
  csharp: 'C#',
  json: 'JSON',
  bash: 'Bash',
  go: 'Go',
  rust: 'Rust',
  php: 'PHP',
};

export function formatLanguageLabel(lang) {
  if (!lang) return 'Código';
  const normalized = LANG_ALIASES[lang.toLowerCase()] || lang.toLowerCase();
  return LANG_LABELS[normalized] || lang.toUpperCase();
}

function normalizeLanguage(lang) {
  if (!lang) return null;
  const clean = lang.trim().toLowerCase();
  const mapped = LANG_ALIASES[clean] || clean;
  return hljs.getLanguage(mapped) ? mapped : null;
}

/**
 * Normalizes line breaks from Excel/CSV cells.
 * Converts literal \n outside quotes if the cell has no real line breaks
 * and looks like multi-line escaped text.
 */
export function normalizeCellText(raw) {
  if (raw === null || raw === undefined) return '';
  let text = String(raw).replace(/\r\n/g, '\n').replace(/\r/g, '\n');

  // If there are no real newlines, check if literal \n is being used as line breaks outside quotes
  if (!text.includes('\n') && text.includes('\\n')) {
    let out = '';
    let inSingle = false;
    let inDouble = false;
    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const prev = i > 0 ? text[i - 1] : '';
      if (ch === "'" && !inDouble && prev !== '\\') {
        inSingle = !inSingle;
      } else if (ch === '"' && !inSingle && prev !== '\\') {
        inDouble = !inDouble;
      }
      if (!inSingle && !inDouble && ch === '\\' && text[i + 1] === 'n') {
        out += '\n';
        i++;
        continue;
      }
      out += ch;
    }
    text = out;
  }

  return text.trim();
}

const STRONG_CODE_LINE_PATTERNS = [
  /^\s*(def|class|async\s+def|import|from\s+\w+\s+import|function|async\s+function|const|let|var|export\s+(default|const|function|class)|return\b|yield\b)/,
  /^\s*(public|private|protected)\s+(static\s+)?[\w<>[\]]+\s+\w+/,
  /^\s*(#include|#define|using\s+namespace|package\s+[\w.]+|func\s+\w+|fn\s+\w+)/,
  /^\s*(SELECT|INSERT\s+INTO|UPDATE\s+\w+\s+SET|DELETE\s+FROM|CREATE\s+TABLE|ALTER\s+TABLE|DROP\s+TABLE|WITH\s+\w+\s+AS)\b/i,
  /^\s*(FROM|WHERE|GROUP\s+BY|ORDER\s+BY|HAVING|INNER\s+JOIN|LEFT\s+JOIN|LIMIT)\b/i,
  /^\s*(if|elif|else|for|while|switch|case|try|except|catch|finally)\b.*(\(|\{|:)\s*$/,
  /^\s*<\/?[a-zA-Z][\w:-]*(\s+[^>]*)?\/?>\s*$/,
  /^\s*[{}[\]();]+\s*$/,
  /^\s*[\w$.]+\s*(\([^)]*\))?\s*=>\s*[{(]?/,
  /^\s*(console\.log|print|printf|System\.out\.println|echo|fmt\.Println)\s*\(/,
  /^\s*@[A-Za-z_][\w.]*(\(.*\))?\s*$/,
  /^\s*\/\/.*$/,
  /^\s*#(?!!|[\d]+).+$/,
  /^\s*--.+$/,
  /^\s*\/\*.*(\*\/)?\s*$/,
];

const MEDIUM_CODE_SIGNALS = [
  /=>|->|::|===|!==|<=|>=|\+=|-=|\*=|\?\?/,
  /;\s*(\/\/.*)?$/,
  /\{\s*$|\}\s*(else|catch|finally|;)?\s*$/,
  /^\s{2,}\S+/, // indented line
  /^\t+\S+/,
  /\b[\w]+\.[\w]+\([^)]*\)/, // method call like arr.map(...)
  /^\s*[\w[\].]+\s*=\s*[^=]/, // assignment x = ...
  /^["'][\w-]+["']\s*:\s*.+/, // JSON property
  /^\s*\$[\w]+\s*=|^\s*(npm|npx|pip|python|node|git|docker|curl)\s+/,
];

function isQuestionProseLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return false;
  // Spanish/English question markers or natural sentence ending with ? or :
  if (/^[¿¡]/.test(trimmed)) return true;
  if (/\?\s*$/.test(trimmed) && !/\?.*:/.test(trimmed) && !/[;{}=<>]/.test(trimmed)) {
    return true;
  }
  // Natural prose introducing code like "Dado el siguiente código:" or "Consider the code below:"
  if (
    /:$/.test(trimmed) &&
    !/^\s*(if|elif|else|for|while|try|except|finally|def|class|case|default)\b/.test(trimmed) &&
    !/^["'][\w-]+["']\s*:/.test(trimmed) &&
    trimmed.split(/\s+/).length >= 3 &&
    !/[{}();=<>[\]]/.test(trimmed)
  ) {
    return true;
  }
  return false;
}

function scoreCodeLine(line) {
  const trimmed = line.trim();
  if (!trimmed) return 0;
  if (isQuestionProseLine(trimmed)) return -3;

  let score = 0;
  for (const rx of STRONG_CODE_LINE_PATTERNS) {
    if (rx.test(line)) {
      score += 3;
      break;
    }
  }
  for (const rx of MEDIUM_CODE_SIGNALS) {
    if (rx.test(line)) {
      score += 1.5;
    }
  }

  // Penalize plain natural language sentences (many words, no code symbols)
  const words = trimmed.split(/\s+/);
  const hasCodePunctuation = /[{}();=<>[\]\\|&`]|=>|->/.test(trimmed);
  if (words.length >= 5 && !hasCodePunctuation && !/^\s{2,}/.test(line)) {
    score -= 2;
  }

  return score;
}

/**
 * Heuristically determines if a single-line answer option should be displayed as code.
 */
export function isSingleLineCode(text) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.includes('\n')) return false;
  if (trimmed.length > 180) {
    // Long single-line string with code markers
    return scoreCodeLine(trimmed) >= 2.5;
  }

  // Never treat plain comma-separated numbers like "1,2,3,4" or short words as code
  if (/^[\d\s,.-]+$/.test(trimmed)) return false;

  // Explicit single-line inline backticks wrapping the whole option
  if (/^`[^`]+`$/.test(trimmed)) return true;

  // Strong code constructs
  for (const rx of STRONG_CODE_LINE_PATTERNS) {
    if (rx.test(trimmed)) return true;
  }

  // Specific single-line code patterns for answers
  if (
    /^(const|let|var|def|class|function|return|import|from|SELECT|INSERT|UPDATE|DELETE|npm|git|pip)\b/i.test(
      trimmed
    )
  ) {
    return true;
  }
  if (/^<\/?[a-zA-Z][\w:-]*(\s+[^>]*)?\/?>$/.test(trimmed)) return true; // HTML tag
  if (/^(\[.*\]|\{.*\})$/.test(trimmed) && trimmed.length >= 4) return true; // Array/JSON literal
  if (/^[\w$.]+\([^)]*\);?$/.test(trimmed)) return true; // Function call like print(x) or arr.map()
  if (/=>|===|!==|::/.test(trimmed)) return true;
  if (/;\s*$/.test(trimmed) && /[=()]/.test(trimmed)) return true;
  if (/^[\w[\].]+\s*=\s*[^=]/.test(trimmed) && !/\s{2}/.test(trimmed)) return true;

  return false;
}

/**
 * Splits a plain text block (no markdown fences) into prose and unfenced code blocks.
 */
function splitUnfencedBlock(text) {
  const lines = text.split('\n');
  if (lines.length === 1) {
    if (isSingleLineCode(text)) {
      const cleaned = text.trim().replace(/^`([^`]+)`$/, '$1');
      return [{ type: 'code', content: cleaned }];
    }
    return [{ type: 'text', content: text }];
  }

  const lineScores = lines.map((line) => scoreCodeLine(line));

  // Mark lines as code if score >= 2, or if indented/blank between code lines
  const isCode = lineScores.map((s) => s >= 2);

  // Propagate code status to mildly-scored lines (score >= 1) adjacent to code
  for (let pass = 0; pass < 2; pass++) {
    for (let i = 0; i < lines.length; i++) {
      const trimmed = lines[i].trim();
      if (!isCode[i] && trimmed && lineScores[i] >= 0.5 && !isQuestionProseLine(trimmed)) {
        const prevIsCode = i > 0 && isCode[i - 1];
        const nextIsCode = i < lines.length - 1 && isCode[i + 1];
        if (prevIsCode || nextIsCode) {
          isCode[i] = true;
        }
      }
    }
  }

  // Bridge single blank lines surrounded by code lines
  for (let i = 1; i < lines.length - 1; i++) {
    if (!lines[i].trim() && isCode[i - 1] && isCode[i + 1]) {
      isCode[i] = true;
    }
  }

  // Group contiguous runs
  const segments = [];
  let currentType = isCode[0] ? 'code' : 'text';
  let buffer = [lines[0]];

  for (let i = 1; i < lines.length; i++) {
    const nextType = isCode[i] ? 'code' : 'text';
    if (nextType === currentType) {
      buffer.push(lines[i]);
    } else {
      pushCleanSegment(segments, currentType, buffer);
      currentType = nextType;
      buffer = [lines[i]];
    }
  }
  pushCleanSegment(segments, currentType, buffer);

  return segments;
}

function pushCleanSegment(segments, type, lines) {
  const joined = lines.join('\n').replace(/^\n+|\n+$/g, '');
  if (!joined.trim()) return;

  if (type === 'code') {
    segments.push({ type: 'code', content: dedentCode(joined) });
  } else {
    segments.push({ type: 'text', content: joined });
  }
}

/**
 * Removes common leading indentation across all non-empty lines of a code block.
 */
export function dedentCode(code) {
  const lines = code.split('\n');
  const indents = lines
    .filter((l) => l.trim().length > 0)
    .map((l) => l.match(/^[ \t]*/)[0].length);
  if (indents.length === 0) return code;
  const minIndent = Math.min(...indents);
  if (minIndent === 0) return code;
  return lines.map((l) => l.slice(minIndent)).join('\n');
}

/**
 * Highlights a code string using highlight.js and returns { html, language, label }.
 */
export function highlightCode(code, explicitLang = null) {
  const normalized = normalizeLanguage(explicitLang);
  try {
    if (normalized) {
      const res = hljs.highlight(code, { language: normalized, ignoreIllegals: true });
      return {
        html: res.value,
        language: normalized,
        label: formatLanguageLabel(normalized),
      };
    }
    const auto = hljs.highlightAuto(code, SUPPORTED_LANGS);
    const detected = auto.language || null;
    return {
      html: auto.value,
      language: detected,
      label: formatLanguageLabel(detected),
    };
  } catch {
    return {
      html: escapeHtml(code),
      language: null,
      label: 'Código',
    };
  }
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

/**
 * Main parser: takes raw cell text and returns structured segments of prose and highlighted code.
 */
export function parseContentWithCode(rawText) {
  const text = normalizeCellText(rawText);
  if (!text) return [];

  const fenceRegex = /```([a-zA-Z0-9_+#.-]*)\s*\n?([\s\S]*?)```/g;
  const rawParts = [];
  let lastIndex = 0;
  let match;

  while ((match = fenceRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      rawParts.push({
        kind: 'unfenced',
        content: text.slice(lastIndex, match.index),
      });
    }
    rawParts.push({
      kind: 'fenced',
      language: match[1] || null,
      content: dedentCode(match[2].replace(/^\n+|\n+$/g, '')),
    });
    lastIndex = fenceRegex.lastIndex;
  }

  if (lastIndex < text.length) {
    rawParts.push({
      kind: 'unfenced',
      content: text.slice(lastIndex),
    });
  }

  const finalSegments = [];
  for (const part of rawParts) {
    if (part.kind === 'fenced') {
      if (part.content.trim()) {
        const highlighted = highlightCode(part.content, part.language);
        finalSegments.push({
          type: 'code',
          content: part.content,
          ...highlighted,
        });
      }
    } else {
      const subSegments = splitUnfencedBlock(part.content);
      for (const seg of subSegments) {
        if (seg.type === 'code') {
          const highlighted = highlightCode(seg.content, null);
          finalSegments.push({
            type: 'code',
            content: seg.content,
            ...highlighted,
          });
        } else {
          finalSegments.push(seg);
        }
      }
    }
  }

  return finalSegments;
}

/**
 * Checks if any segment in a parsed list contains code.
 */
export function hasCodeSegment(segments) {
  return segments.some((s) => s.type === 'code');
}
