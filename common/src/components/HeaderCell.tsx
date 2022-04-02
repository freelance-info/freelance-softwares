import React from 'react';
import { func, shape, string } from 'prop-types';

export const HeaderCell = ({ col, sort, onSort }) => (
  <th
    key={`header-cell-${col.id}`}
    onClick={() => onSort(col.id)}
    className={sort.column === col.id ? `sorted ${sort.direction}` : 'sorted'}
  >
    {col.title}
  </th>
);

HeaderCell.propTypes = {
  col: shape({ id: string.isRequired }).isRequired,
  sort: shape({
    column: string,
    direction: string,
  }),
  onSort: func,
};

HeaderCell.defaultProps = {
  sort: {
    column: null,
    direction: null,
  },
  onSort: () => {},
};
