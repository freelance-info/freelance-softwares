import React, { useContext, useEffect, useState } from 'react';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Checkbox } from 'semantic-ui-react';
import { HeaderCell } from './HeaderCell';
import { FooterCell } from './FooterCell';
import { Row } from './Row';
import { computeTotals } from '../utils/computations';
import { LinesContext, LinesContextType } from '../contexts/lines.context';

export const Table = ({ allSelected, errors, uniqueKeyColId, parameters }) => {
  const [{ cols, lines }, dispatchLinesAction] = useContext<LinesContextType>(LinesContext);

  const [sortState, setSortState] = useState({ column: 'date', direction: 'ascending' });
  const handleSort = clickedColumn => {
    const { column, direction } = sortState;
    const newDirection = column === clickedColumn && direction === 'ascending' ? 'descending' : 'ascending';
    setSortState({ column: clickedColumn, direction: newDirection });
    dispatchLinesAction({ type: 'sortLines', clickedColumn, direction: newDirection });
  };

  const rowChange = (lineNumber, col, val) => {
    dispatchLinesAction({ type: 'lineChange', lineNumber, col, val });
  };

  const selectAll = checked => {
    if (checked) {
      dispatchLinesAction({ type: 'selectAll' });
    } else {
      dispatchLinesAction({ type: 'unselectAll' });
    }
  };

  const select = (lineNumber, checked) => {
    dispatchLinesAction({ type: 'select', checked, lineNumber });
  };


  useEffect(() => {
    dispatchLinesAction({ type: 'initCols', parameters });
  }, [parameters]);

  const headerCells = cols
    .filter(col => col.width !== '0')
    .map(col => (
      <HeaderCell
        key={`header-cell-${col.id}`}
        col={col}
        sort={sortState}
        onSort={handleSort}
      />
    ));

  const rows = lines.map((line, lineNumber) => {
    console.log(`row-${line[uniqueKeyColId]}`, line, uniqueKeyColId);
    return (
    <Row
      key={`row-${line[uniqueKeyColId]}`}
      uniqueKeyColId={uniqueKeyColId}
      line={line}
      lineNumber={lineNumber}
      errors={errors}
      select={select}
      rowChange={rowChange}
    />
  );});

  const computedTotals = computeTotals(lines, cols);
  const footerCells = cols
    .filter(col => col.width !== '0')
    .map(col => (
      <FooterCell
        key={`footer-cell-${col.id}`}
        col={col}
        computedTotals={computedTotals}
      />
    ));

  return (
    <table className="ui table small compact brown sortable">
      <thead>
        <tr>
          {
            select
            && (
            <th key="header-check">
              <Checkbox
                checked={allSelected}
                onChange={(_e, { checked }) => selectAll(checked)}
              />
            </th>
            )
          }
          {headerCells}
        </tr>
      </thead>
      <tbody>
        {rows}
      </tbody>
      <tfoot>
        <tr>
          <th>&nbsp;</th>
          {footerCells}
        </tr>
      </tfoot>
    </table>
  );
};

Table.propTypes = {
  uniqueKeyColId: string.isRequired,
  allSelected: bool,
  errors: arrayOf(shape({
    col: shape({ id: string.isRequired }),
    lineNumber: number.isRequired,
  })),
};

Table.defaultProps = {
  errors: [],
  allSelected: false,
};
