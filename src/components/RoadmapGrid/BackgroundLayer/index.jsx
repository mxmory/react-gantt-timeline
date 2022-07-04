import React from 'react';
import { Layer, Group, Line } from 'react-konva';
import { range } from 'lodash';
import { CANVAS_HEIGHT, HOLIDAYS } from '../../../constants';
import moment from 'moment';
import { HolidayHighlight } from '../HolidayHighlight';
import { SCALING_VALUES, APPROX_DAYS_SCALE_COUNT } from '../../../constants/index';

export const BackgroundLayer = ({ scale, dataRange }) => {
    const today = moment();
    const { CELL_WIDTH } = SCALING_VALUES[scale];

    const currMomentLineMap = {
        DAY: Math.round((CELL_WIDTH / 24) * +moment(today).format('HH')) - 0.5,
        WEEK: Math.round((CELL_WIDTH / 7) * +moment(today).format('d')) - 0.5,
        MONTH: (CELL_WIDTH / 100) * ((100 * +moment(today).format('DD')) / moment(today).daysInMonth()),
        YEAR:
            (CELL_WIDTH / 100) *
            ((100 * today.diff(moment(today).startOf('year'), 'days', true)) / APPROX_DAYS_SCALE_COUNT.YEAR),
    };

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

                        {scale === 'DAY' && isHoliday && <HolidayHighlight height={CANVAS_HEIGHT} width={CELL_WIDTH} />}
                    </Group>
                );
            })}
            <Line
                points={[currMomentLineMap[scale], 0, currMomentLineMap[scale], CANVAS_HEIGHT]}
                stroke="#546678"
                strokeWidth={0.5}
                dashEnabled
                dash={[7, 7]}
            />
        </Layer>
    );
};
