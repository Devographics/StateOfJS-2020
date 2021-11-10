import React from 'react'

import * as Tooltip from '@radix-ui/react-tooltip'

const Tip = ({ trigger, contents }) => (
    <Tooltip.Root>
        <Tooltip.Trigger>{trigger}</Tooltip.Trigger>
        <Tooltip.Content>
            {contents}
            <Tooltip.Arrow />
        </Tooltip.Content>
    </Tooltip.Root>
)

export default Tip
