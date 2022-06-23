import React from 'react';
import { getPrevStages, getStageProps } from '../../../utils/funcs';
import { CELL_HEIGHT, CELL_WIDTH, STAGE_HEIGHT } from '../../../constants';
import { Group, Rect } from 'react-konva';

export const CoreStage = ({ stage, line }) => {
    const { id, stages, color } = stage;
    const shapeRef = React.useRef();

    const innerStages = getPrevStages(stages);
    const { x, width } = getStageProps(innerStages);

    const y = line * CELL_HEIGHT;

    return (
        <Group
            id={id}
            x={x * CELL_WIDTH}
            y={y + CELL_HEIGHT / 2 - STAGE_HEIGHT / 2}
            width={width * CELL_WIDTH}
            height={STAGE_HEIGHT}
            // onClick={showStage}
        >
            <Rect
                id={id}
                type="CORE_STAGE_LINE"
                ref={shapeRef}
                width={width * CELL_WIDTH}
                height={STAGE_HEIGHT}
                fill={color}
            />
            <Rect
                x={0}
                y={-STAGE_HEIGHT}
                width={STAGE_HEIGHT / 2}
                height={STAGE_HEIGHT * 3}
                fill={color}
                cornerRadius={STAGE_HEIGHT}
            />
            <Rect
                x={width * CELL_WIDTH - STAGE_HEIGHT / 2}
                y={-STAGE_HEIGHT}
                width={STAGE_HEIGHT / 2}
                height={STAGE_HEIGHT * 3}
                fill={color}
                cornerRadius={STAGE_HEIGHT}
            />
        </Group>
    );
};
