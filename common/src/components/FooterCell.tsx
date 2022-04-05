import React from 'react';
import { instanceOf, shape, string } from 'prop-types';

export const FooterCell = ({ col, computedTotals }) => {
  let total = computedTotals.get(col.id);
  const unit = col.type === 'Price' ? '€' : '';
  total = total ? `${total}${unit}` : '';
  return (<th key={`total-${col.id}`}>{total}</th>);
};

FooterCell.propTypes = {
  col: shape({ id: string.isRequired }),
  computedTotals: instanceOf(Map),
};

const defaultMap = new Map();
defaultMap.set(0, 0);
FooterCell.defaultProps = { col: { id: 0 }, computedTotals: defaultMap };
