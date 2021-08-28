import React from 'react';
import styled from 'styled-components';
import Table from '../../charts/table/Table';

const BlockData = ({ data, id, headings, tables }) => {
  return (
    <>
      <Table id={id} headings={headings} tables={tables} />
    </>
  );
}

export default BlockData;