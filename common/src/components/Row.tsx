import React, { useContext } from 'react';
import { arrayOf, func, number, object, shape, string } from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import CellEdit from './CellEdit';
import { computeRowCellId } from '../utils/computations';
import { LinesContext } from '../contexts/lines.context';

type RowType = {
  line: any;
  lineNumber: number;
  errors: any[];
  select: (arg1: any, arg2: any) => void;
  rowChange: (arg1: any, arg2: any, arg3: any) => void;
  rowDetails: (line) => void;
  uniqueKeyColId: string;
};
export const Row = ({
  line, lineNumber, errors, select, rowChange, rowDetails, uniqueKeyColId,
}: RowType) => {
  const [{ cols, selectedLines, highlightedLines }] = useContext(LinesContext);
  const lineId = line[uniqueKeyColId];
  // Return error message to display if any for given line / column
  const getErrorMsg = (lineNum, errorLines, col) => {
    const error = errorLines.filter(err => err.lineNumber === lineNum);
    if (error.length === 0) {
      return null;
    }
    if (error[0].cols.some(errorCol => col.id === errorCol.id)) {
      return (<i className="icon attention" title="Obligatoire" />);
    }
    return '';
  };

  const td = cols
    .filter(col => col.width !== '0')
    .map(col => {
      const key = `row-cell-${lineId}-${col.id}`;
      const id = computeRowCellId(lineNumber, col.id);
      const errorMsg = getErrorMsg(lineNumber, errors, col);
      return (
        <td key={key} id={id} className={errorMsg ? 'error' : ''}>
          {
            rowChange
            && (
            <CellEdit
              lineId={lineId}
              def={col}
              value={line[col.id]}
              onChange={val => rowChange(lineNumber, col, val)}
              onDetailsClick={() => rowDetails(line)}
            />
            )
          }
          {errorMsg || ''}
        </td>
      );
    });
  return (
    <tr
      key={`body-line-${lineId}`}
      className={highlightedLines.includes(lineNumber) ? 'positive' : ''}
    >
      {
        select
        && (
        <td key={`body-check-${lineId}`}>
          <Checkbox
            checked={selectedLines.some(selectedLine => selectedLine === lineNumber)}
            onChange={(e, { checked }) => select(lineNumber, checked)}
          />
        </td>
        )
      }
      {td}
    </tr>
  );
};

Row.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  line: object.isRequired,
  lineNumber: number.isRequired,
  errors: arrayOf(shape({
    col: shape({ id: string.isRequired }),
    lineNumber: number.isRequired,
  })),
  select: func,
  rowChange: func,
};

Row.defaultProps = {
  errors: [],
  select: () => {},
  rowChange: () => {},
};
