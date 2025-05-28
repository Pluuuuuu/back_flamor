import React from 'react';
import '../styles/GenericTable.css';

const GenericTable = ({ columns, data, onEdit, onDelete, onAdd }) => {
  // Add rowIndex to each row for count display
  const dataWithIndex = data.map((item, index) => ({ ...item, rowIndex: index + 1 }));

  // Replace columns with accessor 'id' to count column
  const updatedColumns = columns.map((col) => {
    if (col.accessor === 'id') {
      return {
        header: '#',
        accessor: 'rowIndex',
        render: (row) => row.rowIndex,
      };
    }
    return col;
  });

  return (
    <div className="generic-table-container">
      <div className="generic-table-header">
        {/* <h2 className="generic-table-title">Data Table</h2> */}
        {onAdd && (
          <button onClick={onAdd} className="generic-table-add-button" title="Add new item" aria-label="Add new item">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="generic-table-add-icon">
              <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>
      <table className="generic-table">
        <thead>
          <tr>
            {updatedColumns.map((col) => (
              <th key={col.header} className="generic-table-th">
                {col.header}
              </th>
            ))}
            {(onEdit || onDelete) && <th className="generic-table-th">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {dataWithIndex.length === 0 ? (
            <tr>
              <td colSpan={updatedColumns.length + 1} className="generic-table-no-data">
                No data available.
              </td>
            </tr>
          ) : (
            dataWithIndex.map((row, rowIndex) => (
              <tr key={row.id || rowIndex} className="generic-table-row">
                {updatedColumns.map((col) => (
                  <td key={col.header} className="generic-table-td">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className="generic-table-td">
                    {onEdit && (
                      <button onClick={() => onEdit(row)} className="generic-table-actions-button edit" title="Edit" aria-label="Edit">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="generic-table-actions-icon">
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 000-1.42l-2.34-2.34a1.003 1.003 0 00-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                        </svg>
                      </button>
                    )}
                    {onDelete && (
                      <button onClick={() => onDelete(row)} className="generic-table-actions-button delete" title="Delete" aria-label="Delete">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="generic-table-actions-icon">
                          <path d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-4.5l-1-1z" />
                        </svg>
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default GenericTable;
