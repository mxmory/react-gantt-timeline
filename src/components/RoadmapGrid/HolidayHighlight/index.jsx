import React from 'react';
import { Rect } from 'react-konva';
import { CELL_WIDTH } from '../../../constants';

export const HolidayHighlight = ({ height }) => {
    return <Rect width={CELL_WIDTH} height={height} fill="#ccc" opacity={0.2} />;
};
