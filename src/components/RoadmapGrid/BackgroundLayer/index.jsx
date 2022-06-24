import React from 'react';
import { Layer, Group, Line } from 'react-konva';
import { range } from 'lodash';
import { CELL_WIDTH, CANVAS_HEIGHT, HOLIDAYS } from '../../../constants';
import moment from 'moment';
import { HolidayHighlight } from '../HolidayHighlight';

export const BackgroundLayer = ({ dataRange }) => {
    const today = moment();
    const todayHoursNumber = +moment(today).format('HH');

    return (
        <Layer>
            {range(dataRange[0] * CELL_WIDTH, dataRange[1] * CELL_WIDTH, CELL_WIDTH).map((n) => {
                const weekdayNumber = moment(today.startOf('day'))
                    .add(n / CELL_WIDTH, 'days')
                    .format('d');

                const day = moment(today.startOf('day')).add(n / CELL_WIDTH, 'days');

                const isHoliday =
                    +weekdayNumber === 0 || +weekdayNumber === 6 || HOLIDAYS.includes(day.format('YYYY-MM-DD'));

                return (
                    <Group key={n} x={n} y={0} width={CELL_WIDTH}>
                        <Line
                            key={'_vert_line_' + n}
                            points={[-0.5, 0, -0.5, CANVAS_HEIGHT]}
                            stroke="#fff"
                            // opacity={0.7}
                            strokeWidth={0.5}
                        />
                        {isHoliday && <HolidayHighlight height={CANVAS_HEIGHT} />}
                    </Group>
                );
            })}
            <Line
                points={[
                    Math.round((CELL_WIDTH / 24) * todayHoursNumber) - 0.5,
                    0,
                    Math.round((CELL_WIDTH / 24) * todayHoursNumber) - 0.5,
                    CANVAS_HEIGHT,
                ]}
                stroke="#546678"
                strokeWidth={0.5}
                dashEnabled
                dash={[7, 7]}
            />
        </Layer>
    );
};
