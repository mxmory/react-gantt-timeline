import React, { useEffect } from 'react';
import { Text, Group, Rect, Transformer } from 'react-konva';
import { padding, TASK_HEIGHT } from '../../constants';

export const TaskItem = ({
    select,
    task,
    stageId,
    line,
    isSelected,
    onDeselect,
    onDragEnd,
    onTransformEnd,
    onTransformStart,
}) => {
    const { id, name, percent = 0, start_at, length } = task;
    const shapeRef = React.useRef();
    const trRef = React.useRef();
    // const progressRef = React.useRef();

    useEffect(() => {
        if (isSelected) {
            trRef.current.nodes([shapeRef.current]);
            trRef.current.getLayer().batchDraw();
        }
    }, [isSelected]);

    const x = start_at * padding;
    const y = line * padding;

    return (
        <Group
            onMouseOver={() => select(id)}
            onMouseLeave={onDeselect}
            id={id}
            stageId={stageId}
            x={x}
            y={y + padding / 2 - TASK_HEIGHT / 2}
            width={length * padding}
            height={TASK_HEIGHT}
            draggable={true}
            dragBoundFunc={(pos) => {
                return {
                    x: pos.x,
                    y: y + padding / 2 - TASK_HEIGHT / 2,
                };
            }}
            onDragEnd={(e) => {
                onDragEnd(e);
                shapeRef.current.getLayer().batchDraw();
            }}
        >
            <Rect
                id={id}
                stageId={stageId}
                ref={shapeRef}
                width={padding * length}
                height={TASK_HEIGHT}
                fill="#8fd6ff"
                scaleX={1}
                scaleY={1}
                cornerRadius={5}
                strokeWidth={1}
                onTransformEnd={onTransformEnd}
                onTransformStart={onTransformStart}
            />
            <Rect
                width={(padding * length * percent) / 100}
                height={TASK_HEIGHT}
                fill="#aaa"
                opacity={0.5}
                cornerRadius={5}
                strokeWidth={1}
            />

            <Text text={id} fontSize={12} fontStyle="italic" fill="#333" padding={5} />
            {isSelected && (
                <Transformer
                    keepRatio={false}
                    ref={trRef}
                    scaleX={1}
                    scaleY={1}
                    rotateEnabled={false}
                    flipEnabled={false}
                    enabledAnchors={['middle-right']}
                    anchorCornerRadius={3}
                    anchorStroke="transparent"
                    anchorFill="#33333322"
                    anchorStrokeWidth={0.5}
                    anchorSize={TASK_HEIGHT}
                    padding={-TASK_HEIGHT}
                    borderEnabled={false}
                />
            )}
        </Group>
    );
};
