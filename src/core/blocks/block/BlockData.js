import React from 'react';
import styled from 'styled-components';
import Table from '../../charts/table/Table';

const BlockData = ({ data }) => {
  return (
    <>
      <Table data={data} />
    </>
  );
}

export default BlockData;