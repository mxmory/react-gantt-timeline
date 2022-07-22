import React from 'react';
import { Stage } from 'react-konva';
import { HEADER_TOP_HEIGHT, CELL_HEIGHT } from '../../../constants';
import { WeekScaleLayer } from './WeekScaleLayer';
import { DayScaleLayer } from './DayScaleLayer';
import { MonthScaleLayer } from './MonthScaleLayer';
import { YearScaleLayer } from './YearScaleLayer';
import Konva from 'konva';
import { RoadmapDataRange, Scale } from '../../../types/roadmap';

interface HeadDatesScaleProps {
    dataRange: RoadmapDataRange;
    scale: Scale;
}

const HeadDatesScale: React.ForwardRefRenderFunction<Konva.Stage, HeadDatesScaleProps> = (
    { dataRange, scale },
    ref
) => {
    const scalingMap: { [key: string]: JSX.Element } = {
        DAY: <DayScaleLayer dataRange={dataRange} />,
        WEEK: <WeekScaleLayer dataRange={dataRange} />,
        MONTH: <MonthScaleLayer dataRange={dataRange} />,
        YEAR: <YearScaleLayer dataRange={dataRange} />,
    };

    return (
        <Stage width={window.innerWidth} height={CELL_HEIGHT + HEADER_TOP_HEIGHT} ref={ref}>
            {scalingMap[scale]}
        </Stage>
    );
};

export default React.forwardRef(HeadDatesScale);
