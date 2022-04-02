import { createContext } from 'react';

export type ColumnType = {
  id: string;
  title: string;
  type: string;
  required: boolean;
  width: string;
};

export type LinesType = {
  cols: Array<ColumnType>,
  lines: any[],
  selectedLines: number[],
  highlightedLines: number[],
  unsaved: false,
};

export type LinesContextType = [lines: LinesType, dispatch: React.Dispatch<any>];

export const LinesContext = createContext<LinesContextType>([{
  cols: [{ id: 'Id', title: 'Id', type: 'Text', required: true, width: '0' }],
  lines: [],
  selectedLines: [],
  highlightedLines: [],
  unsaved: false,
}, (_arg) => {}]);
