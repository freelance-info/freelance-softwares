import { addLineId, addLinesId, sortByCol } from '@freelance-info/common';
import {
  PARAMETER_KEYS,
  DATE_COL_ID,
  VAT_RATE_COL_ID,
  AMOUNT_EXCLUDING_TAX_COL_ID,
  AMOUNT_INCLUDING_TAX_COL_ID,
  UNIQUE_KEY_COL_ID,
} from '../utils/globals';

export const linesReducer = ({
  lines, selectedLines, highlightedLines, cols, unsaved,
}, action) => {
  // console.log(`linesReducer: ${JSON.stringify(action)}`);
  // By default copy initial state
  const newCols = [...cols];
  let newSelectedLines = [...selectedLines];
  let newLines = [...lines];
  let newHighlightedLines = [...highlightedLines];
  let newUnsaved = unsaved;

  switch (action.type) {
    case 'initCols':
      // Set default values from parameters
      // eslint-disable-next-line no-restricted-syntax
      for (const newCol of newCols) {
        if (newCol.defaultParamKey) {
          newCol.defaultValue = action.parameters.get(newCol.defaultParamKey);
          newCol.options = PARAMETER_KEYS.get(newCol.defaultParamKey);
        }
      }
      break;
    case 'initLines':
      newLines = addLinesId(action.initLines);
      sortByCol(newLines, DATE_COL_ID);
      newHighlightedLines = [];
      newSelectedLines = [];
      break;
    case 'lineChange':
      newLines[action.lineNumber][action.col.id] = action.val;
      if (action.col.id === AMOUNT_EXCLUDING_TAX_COL_ID
          || action.col.id === VAT_RATE_COL_ID) {
        const vatRate = action.col.id === VAT_RATE_COL_ID ? action.val : newLines[action.lineNumber][VAT_RATE_COL_ID];
        const exclTax = action.col.id === AMOUNT_EXCLUDING_TAX_COL_ID ? action.val : newLines[action.lineNumber][AMOUNT_EXCLUDING_TAX_COL_ID];
        const vat = vatRate / 100;
        newLines[action.lineNumber][AMOUNT_INCLUDING_TAX_COL_ID] = Math.round(exclTax * (1 + vat) * 100) / 100;
      }
      newUnsaved = true;
      break;
    case 'addLine':
      newLines.push(addLineId({}, UNIQUE_KEY_COL_ID));
      cols.forEach(col => {
        if (col.defaultValue) {
          newLines[newLines.length - 1][col.id] = col.defaultValue;
        }
      });
      newHighlightedLines.push(newLines.length - 1);
      newSelectedLines = [];
      newUnsaved = true;
      break;
    case 'select':
      if (action.checked) {
        newSelectedLines.push(action.lineNumber);
      } else {
        const idx = newSelectedLines.findIndex(selectedLine => selectedLine === action.lineNumber);
        newSelectedLines.splice(idx, 1);
      }
      break;
    case 'selectAll':
      newSelectedLines = lines.map((_line, index) => index);
      break;
    case 'unselectAll':
      newSelectedLines = [];
      break;
    case 'removeSelected':
      newLines = [];
      lines.forEach((line, index) => {
        if (!selectedLines.some(idx => index === idx)) {
          newLines.push(line);
        }
      });
      newSelectedLines = [];
      newHighlightedLines = [];
      newUnsaved = true;
      break;
    case 'duplicateSelected':
      lines.forEach((line, index) => {
        if (selectedLines.some(idx => index === idx)) {
          newLines.push(addLineId({ ...line }, UNIQUE_KEY_COL_ID));
          newHighlightedLines.push(newLines.length - 1);
        }
      });
      newSelectedLines = [];
      newUnsaved = true;
      break;
    case 'sortLines':
      sortByCol(newLines, action.clickedColumn, action.direction);
      break;
    case 'unsaved':
      newUnsaved = true;
      break;
    case 'saved':
      newUnsaved = false;
      break;
    default:
      throw new Error();
  }
  return {
    cols: newCols,
    lines: newLines,
    selectedLines: newSelectedLines,
    highlightedLines: newHighlightedLines,
    unsaved: newUnsaved,
  };
};
