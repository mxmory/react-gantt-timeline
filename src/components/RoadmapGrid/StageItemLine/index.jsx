import moment from 'moment';
import React from 'react';
import { Group, Rect } from 'react-konva';
import { ACTUAL_DATA, CELL_HEIGHT, STAGE_HEIGHT, SCALE_MOMENT_DIMENSIONS, SCALING_VALUES } from '../../../constants';
import { getStage, getScaledCellWidth, getDataOnStageEdit, getStageProps } from '../../../utils/funcs';

const colorMaps = {
    milestone: '#ff00ff',
    task: '#24a4f9',
    stage: '#EBEDEE',
    core: '#000',
};

export const StageItemLine = ({
    scale,
    data,
    setData,
    select,
    id,
    line,
    length,
    start_at,
    // percent = 0,
    onDeselect,
    color,
    type,
}) => {
    const shapeRef = React.useRef();

    const y = line * CELL_HEIGHT;
    const x = start_at;
    const {
        CELL_WIDTH,
        DIMENSIONS: [value, dimension],
    } = SCALING_VALUES[scale];

    const showStage = (e) => {
        const {
            attrs: { id },
        } = e.target;
        const { name, start_at, deadline } = getStage(ACTUAL_DATA.stages, id);
        alert(`Stage name: ${name}\nStarted at: ${start_at}\nDeadline: ${deadline}`);
    };

    const onDragEnd = (e) => {
        const {
            attrs: { x, id },
        } = e.target;

        const stage = getStage(data, id);
        const editedStartBound = moment()
            .add(Math.round(x / CELL_WIDTH), dimension)
            .startOf(value);

        const diff = moment(editedStartBound.startOf('day')).diff(stage.start_at, 'days', false);
        const editedEndBound = moment(stage.deadline).add(diff, 'days');
        e.target.x(Math.round(x / CELL_WIDTH) * CELL_WIDTH);

        const editedStage = {
            ...stage,
            start_at: editedStartBound.format('YYYY-MM-DD'),
            deadline: editedEndBound.format('YYYY-MM-DD'),
        };
        const newData = getDataOnStageEdit(data, editedStage);
        setData(newData);
    };

    return (
        <Group
            type="STAGE_LINE"
            onMouseOver={() => select(id)}
            onMouseLeave={onDeselect}
            id={id}
            x={x}
            y={y + CELL_HEIGHT / 2 - STAGE_HEIGHT / 2}
            width={type === 'milestone' ? STAGE_HEIGHT : length}
            height={STAGE_HEIGHT}
            onClick={showStage}
            draggable={true}
            onDragEnd={onDragEnd}
            dragBoundFunc={(pos) => {
                return {
                    x: pos.x,
                    y: y + CELL_HEIGHT / 2 - STAGE_HEIGHT / 2,
                };
            }}
        >
            <Rect
                id={id}
                type="STAGE_LINE"
                ref={shapeRef}
                width={type === 'milestone' ? STAGE_HEIGHT : length}
                height={STAGE_HEIGHT}
                fill={color ?? colorMaps[type]}
                rotation={type === 'milestone' && 45}
                cornerRadius={type === 'stage' && 5}
                // onTransformEnd={onTransformEnd}
                // onTransformStart={onTransformStart}
            />
            {/* {type !== 'milestone' && <Text width={CELL_WIDTH * length} height={STAGE_HEIGHT} text={id + '_' + type} />} */}

            {/* <Rect
                width={(CELL_WIDTH * width * percent) / 100}
                height={STAGE_HEIGHT}
                fill="#fff"
                opacity={0.5}
                // onTransformEnd={onTransformEnd}
                // onTransformStart={onTransformStart}
            /> */}

            {type === 'core' && (
                <>
                    <Rect width={STAGE_HEIGHT / 2} height={STAGE_HEIGHT * 3} fill={color} x={0} y={-STAGE_HEIGHT} />
                    <Rect
                        width={STAGE_HEIGHT / 2}
                        height={STAGE_HEIGHT * 3}
                        fill={color}
                        x={length - STAGE_HEIGHT / 2}
                        y={-STAGE_HEIGHT}
                    />
                </>
            )}
        </Group>
    );
};
