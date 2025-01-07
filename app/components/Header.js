import React from 'react';

const Header = ({ columns, onHighlightColumn }) => {
  return (
    <thead>
      <tr>
        <th></th>
        {columns.map((col, index) => (
          <th
            key={index}
            onClick={() => onHighlightColumn(col)}
            style={{
              cursor: 'pointer',
              backgroundColor: 'inherit', 
            }}
          >
            {col}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default Header;

