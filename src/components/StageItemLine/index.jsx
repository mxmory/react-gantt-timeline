import React from 'react';
import { Group, Rect } from 'react-konva';
import { padding, STAGE_HEIGHT } from '../../constants';

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

    const colorMaps = {
        milestone: '#ff00ff',
        task: '#24a4f9',
        stage: '#ccc',
        core: '#000',
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
            {/* <Rect width={STAGE_HEIGHT / 2} height={STAGE_HEIGHT * 3} fill="#666" x={0} y={-STAGE_HEIGHT} />
			<Rect
				width={STAGE_HEIGHT / 2}
				height={STAGE_HEIGHT * 3}
				fill="#666"
				x={width * padding - STAGE_HEIGHT / 2}
				y={-STAGE_HEIGHT}
			/> */}
        </Group>
    );
};
