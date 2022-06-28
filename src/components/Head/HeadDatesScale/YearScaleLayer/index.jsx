import React from 'react';
import { SCALING_VALUES, HEADER_TOP_HEIGHT, CELL_HEIGHT } from '../../../../constants';
import { Layer, Line, Group, Rect, Text } from 'react-konva';
import { uniqWith, isEqual, range } from 'lodash';
import { getDimensionsInRange } from '../../../../utils/funcs';
import moment from 'moment';
import { APPROX_DAYS_SCALE_COUNT } from '../../../../constants/index';

export const YearScaleLayer = ({ dataRange }) => {
    const { CELL_WIDTH } = SCALING_VALUES.MONTH;
    const [startPoint, endPoint] = dataRange;
    const today = moment();
    return (
        <Layer>
            {range(startPoint * CELL_WIDTH, endPoint * CELL_WIDTH, CELL_WIDTH).map((n) => {
                const year = moment(today).add(n / CELL_WIDTH, 'years');

                return (
                    <Group key={n} x={n} y={0}>
                        {year.isSame(today) && (
                            <Group>
                                <Rect width={CELL_WIDTH} height={CELL_HEIGHT + HEADER_TOP_HEIGHT} fill="#AEB5BB" />
                                <Rect
                                    width={
                                        (CELL_WIDTH / 100) *
                                        ((100 * today.diff(moment(today).startOf('year'), 'days', true)) /
                                            APPROX_DAYS_SCALE_COUNT.YEAR)
                                    }
                                    height={CELL_HEIGHT + HEADER_TOP_HEIGHT}
                                    fill="#546678"
                                />
                            </Group>
                        )}

                        <Line
                            points={[-0.5, 0, -0.5, CELL_HEIGHT + HEADER_TOP_HEIGHT - 0.5]}
                            stroke="#aaa"
                            strokeWidth={0.5}
                        />
                        <Text
                            fontSize={10}
                            text={year.format('YYYY')}
                            fontFamily="Montserrat"
                            width={CELL_WIDTH}
                            height={CELL_HEIGHT + HEADER_TOP_HEIGHT}
                            align="center"
                            fill={year.isSame(today) ? '#fff' : '#000'}
                            verticalAlign="middle"
                            padding={4}
                        />
                    </Group>
                );
            })}
        </Layer>
    );
};
