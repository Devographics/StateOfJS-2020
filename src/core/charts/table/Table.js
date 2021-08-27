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

const Table = ({data, id, headings = defaultHeadings, subheadings}) => {
  const theme = useTheme();
  
  return (
    <DataTable>
      <thead>
        <tr>
          {headings.map((heading) => <th span='col' key={heading.id}>{heading.label}</th>)}
        </tr>
        { subheadings 
          && <tr>
            <th></th>
            {subheadings.map((heading) => <th key={heading.id}>{heading.label}</th>)}
          </tr>
        }
      </thead>
      <tbody>
        {data?.sort((a, b) => b?.percentage - a?.percentage).map((bucket, index) => bucket && <tr key={bucket?.id || index}>
          {headings.map((heading, index) => {
            return index > 0 ? <td>{bucket[heading.value]}</td> : <th span='row'>{bucket?.label || bucket?.id}</th>
          })}
        </tr>)}
      </tbody>
    </DataTable>
  )
};

const DataTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  th {
    text-align: left;
  }

  td, th {
    padding: 0.75rem 0.45rem;
    border: 1px solid ${({ theme }) => theme.colors.border};
    margin: 0;
  }
`;

export default Table;