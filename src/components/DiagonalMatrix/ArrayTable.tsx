import React from 'react';

type ArrayTableProps = {
  data: any[][];
};

const ArrayTable: React.FC<ArrayTableProps> = ({ data }) => {
  return (
    <table>
      <thead>
        <tr key={`row-head`}>
          <th></th>
          {data.map((row, columnIndex) => (
            <th key={`cell-${columnIndex}`}>{columnIndex}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={`row-${rowIndex}`}>
            <th>{rowIndex}</th>
            {row.map((cell, cellIndex) => (
              <td key={`cell-${cellIndex}`}>{cell}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ArrayTable;
