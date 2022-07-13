import React from 'react';
import { Rect } from 'react-konva';

interface HolidayHighlightProps {
    width: number;
    height: number;
}

export const HolidayHighlight: React.FC<HolidayHighlightProps> = ({ width, height }) => {
    return <Rect width={width} height={height} fill="#ccc" opacity={0.2} />;
};
