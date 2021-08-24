import React from 'react';
import styled from 'styled-components';
import ButtonGroup from 'core/components/ButtonGroup'
import Button from 'core/components/Button'
import T from 'core/i18n/T'

const BlockViewSelector = ({ view, setView }) => {
  return (
    <ButtonGroup>
      <Button 
        size="small"
        className={`Button--${view === 'viz' ? 'selected' : 'unselected'}`} 
        onClick={() => setView('viz')}>
          <T k="views.viz" />
      </Button>

      <Button 
        size="small"
        className={`Button--${view === 'data' ? 'selected' : 'unselected'}`} 
        onClick={() => setView('data')}>
          <T k="views.table" />
      </Button>
    </ButtonGroup>
  );
}

export default BlockViewSelector;