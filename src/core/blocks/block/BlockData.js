import React from 'react';
import styled from 'styled-components';
import Table from '../../charts/table/Table';

const BlockData = ({ data, id, labelledData, headings }) => {
  return (
    <>
      <Table data={labelledData || data} id={id} headings={headings} />
    </>
  );
}

export default BlockData;