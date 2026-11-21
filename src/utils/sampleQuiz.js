import { parseQuizRows } from './excelParser.js';

export function createSampleQuiz() {
  const rows = [
    ['', 'Quiz template'],
    ['', 'Ejemplo interactivo PastelQuiz con detección automática de código'],
    ['', ''],
    ['', ''],
    ['', ''],
    ['', ''],
    [
      '',
      'Question - sin límite',
      'Answer 1',
      'Answer 2',
      'Answer 3',
      'Answer 4',
      'Time limit (sec)',
      'Correct answer(s)',
    ],
    [
      1,
      '¿Qué imprime en consola el siguiente fragmento de Python?\ndef saludar(nombre, veces=2):\n    return " ".join([f"¡Hola {nombre}!" for _ in range(veces)])\n\nprint(saludar("Luna"))',
      '¡Hola Luna! ¡Hola Luna!',
      '["¡Hola Luna!", "¡Hola Luna!"]',
      '¡Hola Luna!',
      'TypeError: missing argument',
      45,
      '1',
    ],
    [
      2,
      'Observa este código JavaScript (sin bloques markdown, detectado automáticamente). ¿Cuál es el resultado final?\nconst precios = [10, 20, 30, 40];\nconst total = precios\n  .filter(p => p >= 20)\n  .reduce((acc, p) => acc + p, 0);\nconsole.log(total);',
      '60',
      '90',
      '100',
      '70',
      45,
      '2',
    ],
    [
      3,
      '¿Cuáles de las siguientes consultas SQL seleccionan correctamente a los usuarios activos ordenados por nombre?',
      'SELECT * FROM users WHERE active = 1 ORDER BY name ASC;',
      'SELECT name, email FROM users WHERE active = true ORDER BY name;',
      'GET * FROM users SORT name;',
      'FETCH users WHERE active IS 1;',
      60,
      '1,2',
    ],
    [
      4,
      '¿Qué herramientas de hojas de cálculo pueden leer la plantilla y exportar a formato .xlsx? (Selección múltiple)',
      'Excel',
      'Google Docs / Sheets',
      'Numbers',
      'LibreOffice',
      30,
      '1,2,3,4',
    ],
    [
      5,
      'En React, ¿qué devuelve este componente cuando `items` tiene 3 elementos?\n```jsx\nfunction Lista({ items }) {\n  if (!items.length) return <p>Vacío</p>;\n  return (\n    <ul>\n      {items.map((item, i) => <li key={i}>{item}</li>)}\n    </ul>\n  );\n}\n```',
      '<ul> con 3 elementos <li>',
      '<p>Vacío</p>',
      'Un arreglo de strings',
      'undefined',
      40,
      '1',
    ],
  ];

  return parseQuizRows(rows, 'Quiz de Ejemplo (Código + Kahoot)');
}
