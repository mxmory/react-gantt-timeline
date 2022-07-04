import React from 'react';
import { SCALING_VALUES, HEADER_TOP_HEIGHT, CELL_HEIGHT } from '../../../../constants';
import { Layer, Line, Group, Rect, Text } from 'react-konva';
import { uniqWith, isEqual, range } from 'lodash';
import { getDimensionsInRange } from '../../../../utils/funcs';
import moment from 'moment';

export const MonthScaleLayer = ({ dataRange }) => {
    const { CELL_WIDTH, CELL_WIDTH_SUB } = SCALING_VALUES.MONTH;
    const [startPoint, endPoint] = dataRange;
    const today = moment();
    return (
        <Layer>
            <Line
                points={[
                    dataRange[0] * CELL_WIDTH,
                    HEADER_TOP_HEIGHT - 0.5,
                    dataRange[1] * CELL_WIDTH,
                    HEADER_TOP_HEIGHT - 0.5,
                ]}
                stroke="#aaa"
                strokeWidth={0.5}
            />
            {uniqWith(getDimensionsInRange(dataRange, 'MONTH'), isEqual).map((m) => {
                const { date, start, end } = m;

                const text = date.format('YYYY');
                const length = (end - start) * CELL_WIDTH_SUB;

                return (
                    <Group key={text + start} x={start * CELL_WIDTH_SUB} y={0}>
                        <Text
                            y={0}
                            fontSize={12}
                            fontFamily="Montserrat"
                            text={text}
                            width={length}
                            height={20}
                            align="center"
                            verticalAlign="middle"
                        />
                        <Line points={[-0.5, 0, -0.5, HEADER_TOP_HEIGHT - 0.5]} stroke="#aaa" strokeWidth={0.5} />
                    </Group>
                );
            })}
            {range(startPoint * CELL_WIDTH, endPoint * CELL_WIDTH, CELL_WIDTH).map((n) => {
                const month = moment(today).add(n / CELL_WIDTH, 'months');
                // const day3 = moment(day.startOf('week'))

                return (
                    <Group key={n} x={n} y={20}>
                        {month.isSame(today) && (
                            <Group>
                                <Rect width={CELL_WIDTH} height={CELL_HEIGHT} fill="#AEB5BB" />
                                <Rect
                                    width={
                                        (CELL_WIDTH / 100) *
                                        ((100 * +moment(today).format('DD')) / moment(today).daysInMonth())
                                    }
                                    height={CELL_HEIGHT}
                                    fill="#546678"
                                />
                            </Group>
                        )}

                        <Line points={[-0.5, 0, -0.5, CELL_HEIGHT - 0.5]} stroke="#aaa" strokeWidth={0.5} />
                        <Text
                            fontSize={10}
                            text={month.format('MMMM')}
                            fontFamily="Montserrat"
                            width={CELL_WIDTH}
                            height={CELL_HEIGHT}
                            align="center"
                            fill={month.isSame(today) ? '#fff' : '#000'}
                            verticalAlign="middle"
                            padding={4}
                        />
                    </Group>
                );
            })}
        </Layer>
    );
};
