export const computeTotals = (lines, cols) => {
  const result = new Map();
  const numberCols = cols.filter(col => col.type === 'Number');
  numberCols.forEach(col => {
    result.set(col.id, lines.reduce((total, line) => (line[col.id] ? total + (1 * line[col.id]) : total), 0));
  });
  return result;
};

const randomUUID = () => window.crypto.randomUUID();

// Add unique ID to compute React "key" property
export const addLineId = <T> (line: T, uniqueKeyColId: string): T => {
  const result = { ...line };
  result[uniqueKeyColId] = randomUUID();
  return result;
};

export const addLinesId = <T> (lines: T[], uniqueKeyColId: string): T[] => lines.map(line => addLineId(line, uniqueKeyColId));

export const computeRowCellId = (lineNumber, colId) => `row-cell-${lineNumber}-${colId}`;
