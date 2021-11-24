import styled from 'styled-components'
import T from 'core/i18n/T'
import React from 'react'
import { useTheme } from 'styled-components'
import { fontSize } from 'core/theme'

const Table = ({ tables = [] }) => {
    const theme = useTheme()

    return (
        <TableWrapper>
            {tables.map((table) => {
                return (
                    <>
                        {table.title && <Title>{table.title}</Title>}
                        <DataTable>
                            <thead>
                                <tr>
                                    {table.headings.map((heading) => (
                                        <th scope="col" key={heading.id} id={heading.id}>
                                            <T k={heading.labelId}/>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {table.rows.map((row, i) => {
                                    return (
                                        <tr key={i}>
                                            {row.map(({label, value}, index) => {
                                                return index === 0 ? (
                                                    <th key={index} scope="row">
                                                        {label}
                                                    </th>
                                                ) : (
                                                    <td key={index}>
                                                        {value}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </DataTable>
                    </>
                )
            })}
        </TableWrapper>
    )
}

const TableWrapper = styled.div`
    max-height: 450px;
    overflow-y: scroll;
    margin-bottom: 2rem;
    box-shadow: inset 0px 0px 5px 5px rgba(0, 0, 0, 0.25);
`

const DataTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    th {
        text-align: left;
    }

    td,
    th {
        padding: 0.75rem 0.45rem;
        border: 1px solid ${({ theme }) => theme.colors.border};
        margin: 0;
        font-size: ${fontSize('small')};
    }
`

const Title = styled.h4`
    margin-bottom: 0.25rem;
`

export default Table
