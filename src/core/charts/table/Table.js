import styled from 'styled-components'
import T from 'core/i18n/T'
import React from 'react'
import { useTheme } from 'styled-components'

const defaultHeadings = [
  {
    id: 'label',
    label: <T k='table.label' />,
    value: 'label',
  },
  {
    id: 'percentage',
    label: <T k='table.percentage' />,
    value: 'percentage',
  },
  {
    id: 'count',
    label: <T k='table.count' />,
    value: 'count',
  },
];

const Table = ({data, id, headings = defaultHeadings, tables}) => {
  const theme = useTheme();
  
  return (
    <>
      {
        tables.map((table) => {
          return <>
          {table.title && <Title>{table.title}</Title>}
          <DataTable>
            <thead>
              <tr>
                {table.headings.map((heading) => <th scope='col' key={heading.id} id={heading.id}>{heading.label}</th>)}
              </tr>
            </thead>
            <tbody>
              {table.rows.map((row) => {
                return <tr key={row.id}>
                  {table.headings.map((cell, index) => {
                    return index > 0 
                      ? <td key={cell.id}>{row.find(r => r.id === cell.id)?.label}</td> 
                      : <th key={cell.id} scope='row'>{row.find(r => r.id === cell.id).label}</th>
                  })}
                </tr>
              })}
            </tbody>
          </DataTable>
          </>
        })
      }
    </>
  )
};

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 2rem;

  th {
    text-align: left;
  }

  td, th {
    padding: 0.75rem 0.45rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin: 0;
  }
`;

const Title = styled.h4`
  margin-bottom: 0.25rem;
`;

export default Table;