import React from 'react';
import { Rect } from 'react-konva';

export const HolidayHighlight = ({ width, height }) => {
    return <Rect width={width} height={height} fill="#ccc" opacity={0.2} />;
};
