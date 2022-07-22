import React from 'react';
import { SCALING_VALUES, HEADER_TOP_HEIGHT, CELL_HEIGHT } from '../../../../constants';
import { Layer, Line, Group, Rect, Text } from 'react-konva';
import { uniqWith, isEqual, range } from 'lodash';
import { getDimensionsInRange } from '../../../../utils/funcs';
import moment from 'moment';
import { RoadmapDataRange } from 'types/roadmap';

export const WeekScaleLayer: React.FC<{ dataRange: RoadmapDataRange }> = ({ dataRange }) => {
    const { CELL_WIDTH, CELL_WIDTH_SUB } = SCALING_VALUES.WEEK;
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
            {uniqWith(getDimensionsInRange(dataRange, 'WEEK'), isEqual).map((m) => {
                const { date, start, end } = m;

                const text = date.format('MMMM YYYY');
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
                const weekdayNumber = moment(today.startOf('day'))
                    .add(n / CELL_WIDTH, 'weeks')
                    .format('d');
                const day = moment(today.startOf('day')).add(n / CELL_WIDTH, 'weeks');
                const day2 = moment(day).add(6, 'days');
                // const day3 = moment(day.startOf('week'))

                return (
                    <Group key={n} x={n} y={20}>
                        {day.isSame(today) && (
                            <Group>
                                <Rect width={CELL_WIDTH} height={CELL_HEIGHT} fill="#AEB5BB" />
                                <Rect width={(CELL_WIDTH / 7) * +weekdayNumber} height={CELL_HEIGHT} fill="#546678" />
                            </Group>
                        )}

                        <Text
                            fontSize={10}
                            fontFamily="Montserrat"
                            text={'Week ' + day.format('w')}
                            width={CELL_WIDTH}
                            height={CELL_HEIGHT}
                            align="center"
                            fill={day.isSame(today) ? '#fff' : '#888'}
                            verticalAlign="top"
                            padding={4}
                        />
                        <Line points={[-0.5, 0, -0.5, CELL_HEIGHT - 0.5]} stroke="#aaa" strokeWidth={0.5} />
                        <Text
                            fontSize={10}
                            text={day.format('DD') + ' - ' + day2.format('DD')}
                            fontFamily="Montserrat"
                            width={CELL_WIDTH}
                            height={CELL_HEIGHT}
                            align="center"
                            fill={day.isSame(today) ? '#fff' : '#000'}
                            verticalAlign="bottom"
                            padding={4}
                        />
                    </Group>
                );
            })}
        </Layer>
    );
};
