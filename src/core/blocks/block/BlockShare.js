import React from 'react'
import ShareBlock from 'core/share/ShareBlock'

const BlockShare = ({ isShareable, block, values, blockTitle }) => (
  <ShareBlock
      block={block}
      className="Block__Title__Share"
      values={values}
      title={blockTitle}
      // toggleClass={() => {
      //     setShowOptions(!showOptions)
      // }}
  />
)

export default BlockShare