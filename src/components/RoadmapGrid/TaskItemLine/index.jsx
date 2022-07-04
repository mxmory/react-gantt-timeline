import moment from 'moment';
import React, { useEffect } from 'react';
import { Group, Rect } from 'react-konva';
import { CELL_HEIGHT, SCALING_VALUES, TASK_HEIGHT } from '../../../constants';
import { getStageX, getScaledCellWidth, getStage, getStageProps, getDataOnStageEdit } from '../../../utils/funcs';

export const TaskItemLine = ({ scale, task, stageId, line, onTransformEnd, onTransformStart, data, setData }) => {
    const { id, percent = 0, start_at, deadline } = task;
    const shapeRef = React.useRef();
    const {
        CELL_WIDTH,
        DIMENSIONS: { VALUE, DIMENSION },
    } = SCALING_VALUES[scale];

    // const progressRef = React.useRef();

    const onDragEnd = (e) => {
        const {
            attrs: { x, id },
        } = e.target;

        const { x: stageX } = getStageProps(task, scale);

        if (stageX !== Math.round(x / CELL_WIDTH)) {
            const editedStartBound = moment()
                .add(Math.round(x / CELL_WIDTH), DIMENSION)
                .startOf(VALUE);
            const diff = moment(editedStartBound.startOf('day')).diff(task.start_at, 'days', false);
            const editedEndBound = moment(task.deadline).add(diff, 'days');

            const editedStage = {
                ...task,
                start_at: editedStartBound.format('YYYY-MM-DD'),
                deadline: editedEndBound.format('YYYY-MM-DD'),
            };
            const newData = getDataOnStageEdit(data, editedStage);
            setData(newData);
        } else {
            e.target.x(Math.round(x / CELL_WIDTH) * CELL_WIDTH);
        }
    };

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
            draggable={true}
            onDragEnd={onDragEnd}
            dragBoundFunc={(pos) => {
                return {
                    x: pos.x,
                    y: y + CELL_HEIGHT / 2 - TASK_HEIGHT / 2,
                };
            }}
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
