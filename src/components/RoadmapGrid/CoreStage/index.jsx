import React from 'react';
import { flatInnerStages, getParentStageProps } from '../../../utils/funcs';
import { CELL_HEIGHT, CELL_WIDTH, STAGE_HEIGHT } from '../../../constants';
import { Group, Rect } from 'react-konva';

export const CoreStage = ({ stage, line, cellWidth }) => {
    const { id, stages, color } = stage;
    const shapeRef = React.useRef();

    const innerStages = flatInnerStages(stages);
    const { x, width } = getParentStageProps(innerStages);

    console.log('core', x * cellWidth, width * cellWidth);

    const y = line * CELL_HEIGHT;

    return (
        <Group
            id={id}
            x={x * cellWidth}
            y={y + CELL_HEIGHT / 2 - STAGE_HEIGHT / 2}
            width={width * cellWidth}
            height={STAGE_HEIGHT}
            // onClick={showStage}
        >
            <Rect
                id={id}
                type="STAGE_LINE"
                ref={shapeRef}
                width={width * cellWidth}
                height={STAGE_HEIGHT}
                fill={color}
            />
            {innerStages.length !== 0 && (
                <>
                    <Rect
                        x={0}
                        y={-STAGE_HEIGHT}
                        width={STAGE_HEIGHT / 2}
                        height={STAGE_HEIGHT * 3}
                        fill={color}
                        cornerRadius={STAGE_HEIGHT}
                    />
                    <Rect
                        x={width * cellWidth - STAGE_HEIGHT / 2}
                        y={-STAGE_HEIGHT}
                        width={STAGE_HEIGHT / 2}
                        height={STAGE_HEIGHT * 3}
                        fill={color}
                        cornerRadius={STAGE_HEIGHT}
                    />
                </>
            )}
        </Group>
    );
};
