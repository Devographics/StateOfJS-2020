import React from 'react';
import styled from 'styled-components';
import Table from '../../charts/table/Table';

const BlockData = ({ data, id }) => {
  return (
    <>
      <Table data={data} id={id} />
    </>
  );
}

export default BlockData;