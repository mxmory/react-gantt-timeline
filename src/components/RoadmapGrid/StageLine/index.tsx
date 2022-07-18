import Konva from 'konva';
import moment from 'moment';
import React, { useEffect } from 'react';
import { Group, Rect, Transformer } from 'react-konva';
import { KonvaMouseEvent } from 'types/events';
import { ACTUAL_DATA, CELL_HEIGHT, STAGE_HEIGHT, SCALING_VALUES, CORE_STAGE_HEIGHT } from '../../../constants';
import { getStage, getDataOnStageEdit } from '../../../utils/funcs';
import { StageLineProps } from './types';

export const StageLine: React.FC<StageLineProps> = ({
    scale,
    data,
    setData,
    select,
    id,
    line,
    length,
    start_at,
    onDeselect,
    color,
    type,
    isSelected,
    onTransformStart,
    onTransformEnd,
}) => {
    const shapeRef = React.useRef<Konva.Rect>(null);
    const trRef = React.useRef<Konva.Transformer>(null);

    const stage = getStage(data, id);

    const y = line * CELL_HEIGHT;
    const x = start_at;
    const {
        CELL_WIDTH,
        DIMENSIONS: { VALUE, DIMENSION },
    } = SCALING_VALUES[scale];

    useEffect(() => {
        if (isSelected && shapeRef.current) {
            trRef.current?.nodes([shapeRef.current]);
            trRef.current?.getLayer()?.batchDraw();
        }
    }, [isSelected]);

    const showStage = (e: KonvaMouseEvent) => {
        const {
            attrs: { id },
        } = e.target;
        const { name, start_at, deadline } = getStage(ACTUAL_DATA.stages, id) || {};
        alert(`Stage name: ${name}\nStarted at: ${start_at}\nDeadline: ${deadline}`);
    };

    const onDragEnd = (e: Konva.KonvaEventObject<DragEvent>) => {
        const {
            attrs: { x, id },
        } = e.target;

        const stage = getStage(data, id);
        if (!stage) return;

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
        }, 200); // wait for tween to end to dismiss flickering
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
                height={stage?.stages.length === 0 ? STAGE_HEIGHT : CORE_STAGE_HEIGHT}
                fill={color}
                rotation={type === 'milestone' ? 45 : undefined}
                cornerRadius={type !== 'milestone' ? 10 : undefined}
                onTransformEnd={onTransformEnd}
                onTransformStart={onTransformStart}
                listening={stage?.stages.length === 0}
            />

            {stage?.stages.length !== 0 && (
                <>
                    <Rect x={0} y={-4} width={4} height={16} fill={color} cornerRadius={CORE_STAGE_HEIGHT} />
                    <Rect
                        x={length - CORE_STAGE_HEIGHT / 2}
                        y={-4}
                        width={4}
                        height={16}
                        fill={color}
                        cornerRadius={CORE_STAGE_HEIGHT}
                    />
                </>
            )}

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
