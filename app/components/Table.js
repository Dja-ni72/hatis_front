'use client'; 
import React, { useState, useEffect, useRef } from 'react';
import Row from './Row';
import Header from './Header';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const Table = () => {
  const [data, setData] = useState([]);
  const [highlightedRow, setHighlightedRow] = useState(null);
  const [highlightedCol, setHighlightedCol] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const tableRef = useRef(null); // Référence pour détecter les clics en dehors du tableau

  
  useEffect(() => {
    fetch(`${API_BASE_URL}/table`)
      .then((res) => res.json())
      .then((rawData) => {
        const formattedData = Array.from({ length: 10 }, (_, rowIndex) =>
          Array.from({ length: 10 }, (_, colIndex) => {
            const cell = rawData.find(
              (item) =>
                item.row === rowIndex + 1 && item.col === String.fromCharCode(65 + colIndex)
            );
            return { col: String.fromCharCode(65 + colIndex), value: cell ? cell.value : '' };
          })
        );
        setData(formattedData);
      })
      .catch(() => setErrorMessage('Erreur lors du chargement des données.'));
  }, []);

  // gestionnaire global pour détecter les clics en dehors du tableau
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tableRef.current && !tableRef.current.contains(event.target)) {
        setHighlightedRow(null);
        setHighlightedCol(null);
      }
    };

    document.addEventListener('click', handleClickOutside);

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // Modifier une cellule
  const handleEditCell = (row, col, value) => {
    const updatedData = [...data];
    updatedData[row - 1][col.charCodeAt(0) - 65].value = value;
    setData(updatedData);

    fetch(`${API_BASE_URL}/table`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ row, col, value }),
    }).catch(() => setErrorMessage('Échec de la sauvegarde.'));
  };

  // Réinitialiser la table
  const handleResetTable = () => {
    fetch(`${API_BASE_URL}/table/reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Échec de la réinitialisation.');
        return res.json();
      })
      .then(() => {
        setData(
          Array.from({ length: 10 }, (_, rowIndex) =>
            Array.from({ length: 10 }, (_, colIndex) => ({
              col: String.fromCharCode(65 + colIndex),
              value: '', 
            }))
          )
        );
      })
      .catch(() => setErrorMessage('Erreur lors de la réinitialisation.'));
  };

  // Gérer les surbrillances de ligne et colonne
  const handleHighlightRow = (rowNumber) => setHighlightedRow(rowNumber);
  const handleHighlightColumn = (col) => setHighlightedCol(col);

  return (
    <div>
      {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
      <table ref={tableRef}> 
        <Header
          columns={Array.from({ length: 10 }, (_, i) => String.fromCharCode(65 + i))}
          onHighlightColumn={handleHighlightColumn}
        />
        <tbody>
          {data.map((rowData, rowIndex) => (
            <Row
              key={rowIndex}
              rowNumber={rowIndex + 1}
              rowData={rowData}
              onEditCell={handleEditCell}
              onHighlightRow={handleHighlightRow}
              isHighlighted={highlightedRow === rowIndex + 1}
              highlightedCol={highlightedCol} 
            />
          ))}
        </tbody>
      </table>
      <button className="reset-button" onClick={handleResetTable}>
      Réinitialiser
    </button>
    </div>
  );
};

export default Table;
