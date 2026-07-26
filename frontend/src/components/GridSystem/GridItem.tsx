import { type ReactNode } from 'react';
import { useSelector } from 'react-redux';

import { type RootState } from '../../features/store';

export const GridEnum = {
  COL_COUNT: 80,
  ROW_COUNT: 24,
} as const;

type GridItemProps = {
  row: number;
  rowEnd?: number;
  col: number;
  colEnd?: number;
  lineBreak?: boolean;
  classes?: string;
  className?: string;
  children: ReactNode;
};

export default function GridItem({
  row,
  rowEnd,
  col,
  colEnd,
  lineBreak,
  classes,
  className,
  children,
}: GridItemProps) {
  const theme = useSelector((state: RootState) => state.theme);

  return (
    <div
      className={`grid-item row-${row} ${
        rowEnd ? 'row-end-' + rowEnd : ''
      } col-${col} ${colEnd ? 'col-end-' + colEnd : ''} ${
        classes ? classes : ''
      } ${className ? className : ''} ${lineBreak ? `line-break-${theme.name}` : ''}`}
    >
      {children}
    </div>
  );
}
