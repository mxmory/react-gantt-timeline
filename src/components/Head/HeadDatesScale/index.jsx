import React from 'react';
import { Stage } from 'react-konva';
import { HEADER_TOP_HEIGHT, CELL_HEIGHT } from '../../../constants';
import { WeekScaleLayer } from './WeekScaleLayer';
import { DayScaleLayer } from './DayScaleLayer';

const Scale = ({ dataRange, scale }, ref) => {
    const scalingMap = {
        DAY: <DayScaleLayer />,
        WEEK: <WeekScaleLayer />,
    };
    return (
        <Stage width={window.innerWidth} height={CELL_HEIGHT + HEADER_TOP_HEIGHT} ref={ref}>
            {React.cloneElement(scalingMap[scale], {
                dataRange,
            })}
        </Stage>
    );
};

export const HeadDatesScale = React.forwardRef(Scale);
