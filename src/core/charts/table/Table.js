import styled from 'styled-components'
import T from 'core/i18n/T'
import React from 'react'
import { useTheme } from 'styled-components'
import { useBucketKeys } from 'core/helpers/useBucketKeys'
import { useI18n } from 'core/i18n/i18nContext'

const Table = ({data, id}) => {
  const theme = useTheme();
  const bucketKeys = useBucketKeys(id);
  const translate = useI18n();

  const getBucketLabel = (id) => {
    const keys = bucketKeys.find((bucket) => bucket.id === id);
    return keys?.shortLabel;
  }

  return (
    <DataTable>
      <thead>
        <tr>
          <th><T k='table.label' /></th>
          <th><T k='table.percentage' /></th>
          <th><T k='table.count' /></th>
        </tr>
      </thead>
      <tbody>
        {data?.buckets?.sort((a, b) => b?.percentage - a?.percentage).map((bucket, index) => bucket && <tr key={bucket?.id}>
          {/* <td>{bucket.id && getBucketLabel(bucket?.id)}</td> */}
          <td>{bucket?.label || bucket?.id}</td>
          <td>{bucket?.percentage}%</td>
          <td>{bucket?.count}</td>
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