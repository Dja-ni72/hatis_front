import React, { useState } from 'react';

const TableCell = ({ row, col, value, onChange, isHighlighted }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [cellValue, setCellValue] = useState(value);

  const handleDoubleClick = () => setIsEditing(true);

  const handleBlur = () => {
    setIsEditing(false);
    onChange(row, col, cellValue);
  };

  return isEditing ? (
    <td>
      <input
        type="text"
        value={cellValue}
        onChange={(e) => setCellValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
      />
    </td>
  ) : (
    <td
      onDoubleClick={handleDoubleClick}
      style={{ backgroundColor: isHighlighted ? '#d3d3f4' : 'transparent' }}
    >
      {value || ''}
    </td>
  );
};

export default TableCell;
