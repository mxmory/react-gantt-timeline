import React from 'react';
import { flatInnerStages, getParentStageProps, getScaledCellWidth } from '../../../utils/funcs';
import { CELL_HEIGHT, STAGE_HEIGHT } from '../../../constants';
import { Group, Rect } from 'react-konva';

export const CoreStage = ({ scale, stage, line }) => {
    const { id, stages, color } = stage;
    const shapeRef = React.useRef();

    const innerStages = flatInnerStages(stages);
    const { x, width } = getParentStageProps(innerStages, scale);
    const y = line * CELL_HEIGHT;
    const scaledCellWidth = getScaledCellWidth(scale);

    return (
        <Group
            id={id}
            type="STAGE_LINE"
            x={x * scaledCellWidth}
            y={y + CELL_HEIGHT / 2 - STAGE_HEIGHT / 2}
            width={width * scaledCellWidth}
            height={STAGE_HEIGHT}
            // onClick={showStage}
        >
            <Rect
                id={id}
                type="STAGE_LINE"
                ref={shapeRef}
                width={width * scaledCellWidth}
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
                        x={width * scaledCellWidth - STAGE_HEIGHT / 2}
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
