import moment from 'moment';
import React, { useEffect } from 'react';
import { Group, Rect } from 'react-konva';
import { CELL_HEIGHT, TASK_HEIGHT } from '../../../constants';
import { getStageX, getScaledCellWidth } from '../../../utils/funcs';

export const TaskItemLine = ({ scale, task, stageId, line, onTransformEnd, onTransformStart }) => {
    const { id, percent = 0, start_at, deadline } = task;
    const shapeRef = React.useRef();

    // const progressRef = React.useRef();

    const scaledCellWidth = getScaledCellWidth(scale);

    const start = moment(start_at);
    const x = getStageX(start, scale);
    const y = line * CELL_HEIGHT;
    const length = moment(deadline).diff(start, 'days', false);

    return (
        <Group
            id={id}
            stageId={stageId}
            x={x * scaledCellWidth}
            y={y + CELL_HEIGHT / 2 - TASK_HEIGHT / 2}
            width={length * scaledCellWidth}
            height={TASK_HEIGHT}
        >
            <Rect
                id={id}
                stageId={stageId}
                ref={shapeRef}
                width={scaledCellWidth * length}
                height={TASK_HEIGHT}
                fill="#D7DADD"
                cornerRadius={5}
                strokeWidth={1}
                onTransformEnd={onTransformEnd}
                onTransformStart={onTransformStart}
            />
            <Rect
                width={(scaledCellWidth * length * percent) / 100}
                height={TASK_HEIGHT}
                fill="#aaa"
                opacity={0.5}
                cornerRadius={5}
                strokeWidth={1}
            />
        </Group>
    );
};
