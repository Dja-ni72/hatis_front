import React from 'react';
import TableCell from './TableCell';

const Row = ({ rowNumber, rowData, onEditCell, onHighlightRow, isHighlighted, highlightedCol }) => {
  return (
    <tr
      onClick={() => onHighlightRow(rowNumber)}
      style={{ backgroundColor: isHighlighted ? '#f0f0f0' : 'transparent' }}
    >
      <th>{rowNumber}</th>
      {rowData.map((cell, index) => (
        <TableCell
          key={index}
          row={rowNumber}
          col={cell.col}
          value={cell.value}
          onChange={onEditCell}
          isHighlighted={highlightedCol === cell.col} 
        />
      ))}
    </tr>
  );
};

export default Row;
