import moment from 'moment';
import React, { useEffect } from 'react';
import { Group, Rect, Transformer } from 'react-konva';
import { ACTUAL_DATA, CELL_HEIGHT, STAGE_HEIGHT, SCALING_VALUES } from '../../../constants';
import { getStage, getDataOnStageEdit } from '../../../utils/funcs';

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
    isSelected,
    onTransformStart,
    onTransformEnd,
}) => {
    const shapeRef = React.useRef();
    const trRef = React.useRef();

    const y = line * CELL_HEIGHT;
    const x = start_at;
    const {
        CELL_WIDTH,
        DIMENSIONS: { VALUE, DIMENSION },
    } = SCALING_VALUES[scale];

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

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
            .add(Math.round(x / CELL_WIDTH), DIMENSION)
            .startOf(VALUE);

        const diff = moment(editedStartBound.startOf('day')).diff(stage.start_at, 'days', false);
        const editedEndBound = moment(stage.deadline).add(diff, 'days');

        e.target.to({ x: Math.round(x / CELL_WIDTH) * CELL_WIDTH, duration: 0.2 });

        const editedStage = {
            ...stage,
            start_at: editedStartBound.format('YYYY-MM-DD'),
            deadline: editedEndBound.format('YYYY-MM-DD'),
        };
        const newData = getDataOnStageEdit(data, editedStage);

        setTimeout(() => {
            setData(newData);
        }, 200); // wait for tween to end to avoid flickering
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
                fill={color}
                rotation={type === 'milestone' && 45}
                cornerRadius={type === 'stage' && 5}
                onTransformEnd={onTransformEnd}
                onTransformStart={onTransformStart}
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
            {isSelected && (
                <Transformer
                    ref={trRef}
                    rotateEnabled={false}
                    flipEnabled={false}
                    enabledAnchors={['middle-right']}
                    anchorCornerRadius={3}
                    anchorStroke="#999"
                    anchorStrokeWidth={0.5}
                    anchorSize={15}
                    padding={-15}
                    borderEnabled={false}
                />
            )}
        </Group>
    );
};
