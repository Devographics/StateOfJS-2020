import React from 'react';
import styled from 'styled-components';
import ButtonGroup from 'core/components/ButtonGroup'
import Button from 'core/components/Button'

const BlockViewSelector = ({ view, setView }) => {
  return (
    <ButtonGroup>
      <Button 
        size="small"
        className={`Button--${view === 'viz' ? 'selected' : 'unselected'}`} 
        onClick={() => setView('viz')}>
        Viz
      </Button>

      <Button 
        size="small"
        className={`Button--${view === 'data' ? 'selected' : 'unselected'}`} 
        onClick={() => setView('data')}>
        Data
      </Button>
    </ButtonGroup>
  );
}

export default BlockViewSelector;