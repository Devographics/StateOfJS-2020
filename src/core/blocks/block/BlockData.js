import React from 'react';
import styled from 'styled-components';
import Table from '../../charts/table/Table';

const BlockData = ({ data, id, labelledData }) => {
  console.log(data, labelledData);
  return (
    <>
      <Table data={labelledData || data} id={id} />
    </>
  );
}

export default BlockData;