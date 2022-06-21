import React, { useState } from 'react';
import { Group, Rect } from 'react-konva';
import { ACTUAL_DATA, padding, STAGE_HEIGHT } from '../../constants';
import { getStage } from '../../utils/funcs';

const colorMaps = {
    milestone: '#ff00ff',
    task: '#24a4f9',
    stage: '#ccc',
    core: '#000',
};

export const StageItemLine = ({
    select,
    id,
    line,
    length,
    start_at,
    // percent = 0,
    onDeselect,
    // onDragEnd,
    type,
}) => {
    const shapeRef = React.useRef();

    const y = line * padding;
    const x = start_at * padding;

    const showStage = (e) => {
        const {
            attrs: { id },
        } = e.target;
        const { name, start_at, deadline } = getStage(ACTUAL_DATA.stages, id);
        alert(`Stage name: ${name}\nStarted at: ${start_at}\nDeadline: ${deadline}`);
    };

    return (
        <Group
            onMouseOver={() => select(id)}
            onMouseLeave={onDeselect}
            id={id}
            x={x}
            y={y + padding / 2 - STAGE_HEIGHT / 2}
            width={type === 'milestone' ? STAGE_HEIGHT : padding * length}
            height={STAGE_HEIGHT}
            onClick={showStage}
            // draggable={onDragEnd && true}
            // dragBoundFunc={(pos) => {
            //     return {
            //         x: pos.x,
            //         y: y + padding / 2 - STAGE_HEIGHT / 2,
            //     };
            // }}
            // onDragEnd={onDragEnd}
        >
            <Rect
                id={id}
                ref={shapeRef}
                width={type === 'milestone' ? STAGE_HEIGHT : padding * length}
                height={STAGE_HEIGHT}
                fill={colorMaps[type]}
                rotation={type === 'milestone' && 45}

                // onTransformEnd={onTransformEnd}
                // onTransformStart={onTransformStart}
            />
            {/* {type !== 'milestone' && <Text width={padding * length} height={STAGE_HEIGHT} text={id + '_' + type} />} */}

            {/* <Rect
                width={(padding * width * percent) / 100}
                height={STAGE_HEIGHT}
                fill="#fff"
                opacity={0.5}
                // onTransformEnd={onTransformEnd}
                // onTransformStart={onTransformStart}
            /> */}

            {type === 'core' && (
                <>
                    <Rect width={STAGE_HEIGHT / 2} height={STAGE_HEIGHT * 3} fill="#000" x={0} y={-STAGE_HEIGHT} />
                    <Rect
                        width={STAGE_HEIGHT / 2}
                        height={STAGE_HEIGHT * 3}
                        fill="#000"
                        x={length * padding - STAGE_HEIGHT / 2}
                        y={-STAGE_HEIGHT}
                    />
                </>
            )}
        </Group>
    );
};
