import {
  Table as TablePrimitive,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type Props = {
  columns: string[];
  rows: React.JSX.Element[][];
};

export const Table = ({ columns, rows }: Props) => {
  if (columns.length !== rows[0].length) {
    throw new Error('Columns and rows do not match');
  }
  return (
    <TablePrimitive>
      {/* <TableCaption>Employee</TableCaption> */}
      <TableHeader>
        <TableRow>
          {columns.map((column) => (
            <TableHead key={column}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>

      <TableBody>
        {rows.map((row, i) => (
          <TableRow key={i}>
            {row.map((cell, j) => (
              <TableCell key={j}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </TablePrimitive>
  );
};
