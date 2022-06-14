import React, { useEffect } from 'react';
import { Group, Rect } from 'react-konva';
import { padding, STAGE_HEIGHT } from '../../constants';
import { getStageProps } from '../../utils/funcs';

export const StageItemLine = ({
    select,
    id,
    tasks,
    line,
    // percent = 0,
    onDeselect,
    onDragEnd,
}) => {
    const shapeRef = React.useRef();

    const { x, y, width, percent } = getStageProps(tasks, line);

    return (
        <Group
            onMouseOver={() => select(id)}
            onMouseLeave={onDeselect}
            id={id}
            x={x}
            y={y + padding / 2 - STAGE_HEIGHT / 2}
            width={padding * width}
            height={STAGE_HEIGHT}
            draggable={true}
            dragBoundFunc={(pos) => {
                return {
                    x: pos.x,
                    y: y + padding / 2 - STAGE_HEIGHT / 2,
                };
            }}
            onDragEnd={onDragEnd}
        >
            <Rect
                id={id}
                ref={shapeRef}
                width={padding * width}
                height={STAGE_HEIGHT}
                fill="#666"
                // onTransformEnd={onTransformEnd}
                // onTransformStart={onTransformStart}
            />
            <Rect
                width={(padding * width * percent) / 100}
                height={STAGE_HEIGHT}
                fill="#fff"
                opacity={0.5}
                // onTransformEnd={onTransformEnd}
                // onTransformStart={onTransformStart}
            />
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
