import * as XLSX from 'xlsx';
import { normalizeCellText, parseContentWithCode, hasCodeSegment } from './codeDetector.js';

function normalizeHeader(value) {
  return String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
}

function findColumnsFromHeader(row) {
  const normalized = row.map(normalizeHeader);

  let questionCol = -1;
  const answerCols = [];
  let timeCol = -1;
  let correctCol = -1;

  normalized.forEach((cell, idx) => {
    if (!cell) return;

    if (
      questionCol === -1 &&
      (cell.includes('question') || cell.includes('pregunta') || cell.includes('enunciado'))
    ) {
      questionCol = idx;
      return;
    }

    if (
      cell.includes('correct') ||
      cell.includes('correcta') ||
      cell.includes('solucion')
    ) {
      correctCol = idx;
      return;
    }

    if (
      cell.includes('answer') ||
      cell.includes('respuesta') ||
      cell.includes('opcion') ||
      cell.includes('alternativa')
    ) {
      // Avoid matching "correct answer" if order varied
      if (!cell.includes('correct')) {
        answerCols.push(idx);
      }
      return;
    }

    if (
      timeCol === -1 &&
      (cell.includes('time') || cell.includes('tiempo') || cell.includes('sec') || cell.includes('seg'))
    ) {
      timeCol = idx;
    }
  });

  if (questionCol !== -1 && answerCols.length >= 2) {
    return { questionCol, answerCols, timeCol, correctCol };
  }
  return null;
}

function parseCorrectIndices(rawCorrect, answers) {
  const str = String(rawCorrect ?? '').trim();
  if (!str) return [];

  // Handle numeric or comma/semicolon/space separated indices like "1,2,3,4" or "1 y 3"
  const tokens = str
    .split(/[,;/|\s]+|\by\b|\band\b/i)
    .map((t) => t.trim())
    .filter(Boolean);

  const indices = new Set();
  for (const token of tokens) {
    if (/^\d+$/.test(token)) {
      const idx = parseInt(token, 10) - 1;
      if (idx >= 0 && idx < answers.length) {
        indices.add(idx);
      }
    } else if (/^[a-fA-F]$/.test(token)) {
      const idx = token.toUpperCase().charCodeAt(0) - 65;
      if (idx >= 0 && idx < answers.length) {
        indices.add(idx);
      }
    }
  }

  // Fallback: check if user wrote the literal answer text
  if (indices.size === 0) {
    const lowerTarget = str.toLowerCase();
    answers.forEach((ans, idx) => {
      if (ans.raw.trim().toLowerCase() === lowerTarget) {
        indices.add(idx);
      }
    });
  }

  return Array.from(indices).sort((a, b) => a - b);
}

function parseTimeLimit(rawTime) {
  if (rawTime === null || rawTime === undefined || rawTime === '') return null;
  const num = Number(String(rawTime).replace(/[^\d.]/g, ''));
  if (!Number.isFinite(num) || num <= 0) return null;
  return Math.round(num);
}

/**
 * Parses an array of 2D rows into structured quiz questions.
 */
export function parseQuizRows(rows, sourceName = 'Quiz') {
  if (!Array.isArray(rows) || rows.length === 0) {
    throw new Error('El archivo está vacío o no contiene filas legibles.');
  }

  let headerRowIdx = -1;
  let columns = null;

  const scanLimit = Math.min(rows.length, 25);
  for (let i = 0; i < scanLimit; i++) {
    const row = rows[i] || [];
    const found = findColumnsFromHeader(row);
    if (found) {
      headerRowIdx = i;
      columns = found;
      break;
    }
  }

  // Fallback if no header row was explicitly detected
  if (!columns) {
    const firstNonEmpty = rows.findIndex((r) =>
      (r || []).some((cell) => String(cell ?? '').trim() !== '')
    );
    if (firstNonEmpty === -1) {
      throw new Error('No se encontraron preguntas en el archivo.');
    }
    const sampleRow = rows[firstNonEmpty] || [];
    const col0IsNum = /^\d+$/.test(String(sampleRow[0] ?? '').trim());
    if (col0IsNum && sampleRow.length >= 6) {
      columns = {
        questionCol: 1,
        answerCols: [2, 3, 4, 5].filter((c) => c < sampleRow.length),
        timeCol: sampleRow.length >= 7 ? 6 : -1,
        correctCol: sampleRow.length >= 8 ? 7 : -1,
      };
      headerRowIdx = firstNonEmpty - 1;
    } else if (sampleRow.length >= 4) {
      columns = {
        questionCol: 0,
        answerCols: [1, 2, 3, 4].filter((c) => c < sampleRow.length),
        timeCol: sampleRow.length >= 6 ? 5 : -1,
        correctCol: sampleRow.length >= 7 ? 6 : -1,
      };
      headerRowIdx = firstNonEmpty - 1;
    } else {
      throw new Error(
        'No se pudieron detectar las columnas del quiz. Asegúrate de incluir columnas de Pregunta y Respuestas (estilo plantilla Kahoot).'
      );
    }
  }

  const questions = [];
  const warnings = [];

  for (let r = headerRowIdx + 1; r < rows.length; r++) {
    const row = rows[r] || [];
    const rawQuestion = normalizeCellText(row[columns.questionCol]);

    // Skip empty template rows (e.g. rows 2..100 with only row numbers)
    if (!rawQuestion) continue;

    // Collect non-empty answers while preserving original 1-based column positions
    const indexedAnswers = [];
    columns.answerCols.forEach((colIdx) => {
      const rawAns = normalizeCellText(row[colIdx]);
      if (rawAns !== '') {
        const segments = parseContentWithCode(rawAns);
        indexedAnswers.push({
          raw: rawAns,
          segments,
          hasCode: hasCodeSegment(segments),
        });
      }
    });

    if (indexedAnswers.length < 2) {
      warnings.push(`Fila ${r + 1}: necesita al menos 2 respuestas (omitida).`);
      continue;
    }

    // Map correct indices relative to the full answerCols order, then remap to filtered answers
    const fullAnswersPlaceholder = columns.answerCols.map((colIdx) => ({
      raw: normalizeCellText(row[colIdx]),
    }));
    const rawCorrect = columns.correctCol !== -1 ? row[columns.correctCol] : '';
    const originalCorrectIndices = parseCorrectIndices(rawCorrect, fullAnswersPlaceholder);

    // Remap original col position -> filtered index
    const colPosToFilteredIdx = new Map();
    let filteredCursor = 0;
    columns.answerCols.forEach((colIdx, pos) => {
      const rawAns = normalizeCellText(row[colIdx]);
      if (rawAns !== '') {
        colPosToFilteredIdx.set(pos, filteredCursor);
        filteredCursor++;
      }
    });

    let correctIndices = originalCorrectIndices
      .map((origPos) => colPosToFilteredIdx.get(origPos))
      .filter((idx) => idx !== undefined);

    if (correctIndices.length === 0) {
      warnings.push(
        `Fila ${r + 1}: no tiene respuesta correcta válida; se marcó la opción 1 por defecto.`
      );
      correctIndices = [0];
    }

    const questionSegments = parseContentWithCode(rawQuestion);
    const questionHasCode =
      hasCodeSegment(questionSegments) || indexedAnswers.some((a) => a.hasCode);

    const timeLimit =
      columns.timeCol !== -1 ? parseTimeLimit(row[columns.timeCol]) : null;

    questions.push({
      id: `q-${questions.length + 1}`,
      number: questions.length + 1,
      rawQuestion,
      questionSegments,
      answers: indexedAnswers,
      correctIndices,
      isMultipleChoice: correctIndices.length > 1,
      timeLimit,
      hasCode: questionHasCode,
    });
  }

  if (questions.length === 0) {
    throw new Error(
      'No se encontró ninguna pregunta válida con al menos 2 respuestas en el archivo.'
    );
  }

  return {
    title: sourceName.replace(/\.(xlsx|xls|csv|ods)$/i, ''),
    questions,
    warnings,
    codeQuestionsCount: questions.filter((q) => q.hasCode).length,
  };
}

/**
 * Reads an uploaded File (.xlsx, .xls, .csv) and returns parsed quiz data.
 */
export async function parseExcelFile(file) {
  const buffer = await file.arrayBuffer();
  const isCsv = /\.csv$/i.test(file.name);

  let workbook;
  if (isCsv) {
    const text = new TextDecoder('utf-8').decode(buffer);
    workbook = XLSX.read(text, { type: 'string' });
  } else {
    workbook = XLSX.read(buffer, { type: 'array' });
  }

  const firstSheetName = workbook.SheetNames[0];
  if (!firstSheetName) {
    throw new Error('El libro de Excel no contiene hojas.');
  }

  const sheet = workbook.Sheets[firstSheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    raw: true,
  });

  return parseQuizRows(rows, file.name);
}

/**
 * Generates and downloads an Excel template compatible with the Kahoot format,
 * explicitly without character restrictions and with code block examples.
 */
export function downloadExcelTemplate() {
  const rows = [
    ['', 'Plantilla PastelQuiz (Sin límite de caracteres)'],
    [
      '',
      'Agrega tus preguntas, al menos 2 opciones, tiempo sugerido (opcional) y respuestas correctas separadas por coma (ej: 1 o 1,3).',
    ],
    [
      '',
      'Puedes escribir texto largo y bloques de código (con ```lenguaje ... ``` o código directo con saltos de línea). ¡La app lo detectará y formateará automáticamente!',
    ],
    ['', ''],
    ['', ''],
    ['', ''],
    [
      '',
      'Question (sin límite)',
      'Answer 1',
      'Answer 2',
      'Answer 3',
      'Answer 4',
      'Time limit (sec)',
      'Correct answer(s)',
    ],
    [
      1,
      '¿Qué herramientas de hojas de cálculo pueden leer y exportar en formato .xlsx?',
      'Excel',
      'Google Docs / Sheets',
      'Numbers',
      'LibreOffice Calc',
      60,
      '1,2,3,4',
    ],
    [
      2,
      '¿Qué imprime en consola el siguiente código de Python?\n```python\nnumeros = [1, 2, 3, 4]\nresultado = [n * 2 for n in numeros if n % 2 == 0]\nprint(resultado)\n```',
      '[2, 4]',
      '[4, 8]',
      '[1, 4, 9, 16]',
      'Error de sintaxis',
      45,
      '2',
    ],
    [
      3,
      'Analiza esta función en JavaScript. ¿Cuál es el valor devuelto?\nconst sumar = (a, b = 5) => {\n  return a + b;\n};\nsumar(10);',
      '15',
      '10',
      'undefined',
      'NaN',
      30,
      '1',
    ],
  ];

  for (let i = 4; i <= 30; i++) {
    rows.push([i, '', '', '', '', '', '', '']);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 5 },
    { wch: 55 },
    { wch: 24 },
    { wch: 24 },
    { wch: 24 },
    { wch: 24 },
    { wch: 16 },
    { wch: 18 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Quiz');
  XLSX.writeFile(wb, 'Plantilla_PastelQuiz.xlsx');
}

/**
 * Creates a fresh quiz object from an existing array of parsed questions
 * (e.g., missed questions for a review quiz).
 */
export function buildQuizFromQuestions(questions, title = 'Quiz de Repaso') {
  const renumbered = questions.map((q, idx) => ({
    ...q,
    id: `review-q-${idx + 1}`,
    number: idx + 1,
  }));

  return {
    title,
    questions: renumbered,
    warnings: [],
    codeQuestionsCount: renumbered.filter((q) => q.hasCode).length,
  };
}

/**
 * Exports an array of parsed questions to a Kahoot-compatible .xlsx file.
 */
export function exportQuizToExcel(questions, title = 'Repaso_Falladas') {
  const maxAnswers = Math.max(4, ...questions.map((q) => q.answers.length));
  const answerHeaders = Array.from({ length: maxAnswers }, (_, i) => `Answer ${i + 1}`);

  const rows = [
    ['', `Quiz de Repaso — ${title}`],
    ['', 'Preguntas generadas automáticamente a partir de tus respuestas incorrectas en PastelQuiz.'],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', 'Question (sin límite)', ...answerHeaders, 'Time limit (sec)', 'Correct answer(s)'],
  ];

  questions.forEach((q, idx) => {
    const paddedAnswers = Array.from({ length: maxAnswers }, (_, aIdx) =>
      q.answers[aIdx] ? q.answers[aIdx].raw : ''
    );
    const correctStr = q.correctIndices.map((i) => i + 1).join(',');
    rows.push([
      idx + 1,
      q.rawQuestion,
      ...paddedAnswers,
      q.timeLimit ?? '',
      correctStr,
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(rows);
  ws['!cols'] = [
    { wch: 5 },
    { wch: 55 },
    ...Array.from({ length: maxAnswers }, () => ({ wch: 24 })),
    { wch: 16 },
    { wch: 18 },
  ];

  const safeName =
    String(title)
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_') || 'Repaso_Falladas';

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Quiz');
  XLSX.writeFile(wb, `${safeName}.xlsx`);
}
