import React from 'react';
import { Stage, Layer, Line, Group, Text, Rect } from 'react-konva';
import { CELL_WIDTH, HEADER_TOP_HEIGHT, CELL_HEIGHT, HOLIDAYS } from '../../../constants';
import { uniqWith, isEqual, range } from 'lodash';
import moment from 'moment';
import { getMonthsInRange, clipRect } from '../../../utils/funcs';
import { HolidayHighlight } from '../../RoadmapGrid/HolidayHighlight';

const Scale = ({ dataRange }, ref) => {
    const today = moment();
    const todayHoursNumber = +moment(today).format('HH');
    const [startPoint, endPoint] = dataRange;

    return (
        <Stage width={window.innerWidth} height={CELL_HEIGHT + HEADER_TOP_HEIGHT} ref={ref}>
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
                {uniqWith(getMonthsInRange(dataRange), isEqual).map((m) => {
                    const { date, start, end } = m;

                    const text = date.format('MMMM YYYY');
                    const length = (end - start) * CELL_WIDTH;
                    return (
                        <Group key={text + start} x={start * CELL_WIDTH} y={0}>
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
                            <Line points={[-0.5, 0, -0.5, CELL_HEIGHT * 2 - 0.5]} stroke="#aaa" strokeWidth={0.5} />
                        </Group>
                    );
                })}
                {range(startPoint * CELL_WIDTH, endPoint * CELL_WIDTH, CELL_WIDTH).map((n) => {
                    const weekdayNumber = moment(today)
                        .add(n / CELL_WIDTH, 'days')
                        .format('d');
                    const day = moment(today).add(n / CELL_WIDTH, 'days');
                    const isHoliday =
                        +weekdayNumber === 0 || +weekdayNumber === 6 || HOLIDAYS.includes(day.format('YYYY-MM-DD'));

                    return (
                        <Group key={n} x={n} y={20}>
                            {day.isSame(today) && (
                                <Group
                                    clipFunc={(ctx) => {
                                        clipRect(ctx, 0, 0, CELL_WIDTH, CELL_HEIGHT, 5);
                                    }}
                                >
                                    <Rect width={CELL_WIDTH} height={CELL_HEIGHT} fill="#AEB5BB" />
                                    <Rect
                                        width={(CELL_WIDTH / 24) * todayHoursNumber}
                                        height={CELL_HEIGHT}
                                        fill="#546678"
                                        // cornerRadius={5}
                                    />
                                </Group>
                            )}

                            <Text
                                fontSize={10}
                                fontFamily="Montserrat"
                                text={day.format('dd')}
                                width={CELL_WIDTH}
                                height={CELL_HEIGHT}
                                align="center"
                                fill={day.isSame(today) ? '#fff' : isHoliday ? '#888' : '#000'}
                                verticalAlign="top"
                                padding={4}
                            />
                            <Text
                                fontSize={10}
                                text={day.format('DD')}
                                fontFamily="Montserrat"
                                width={CELL_WIDTH}
                                height={CELL_HEIGHT}
                                align="center"
                                fill={day.isSame(today) ? '#fff' : isHoliday ? '#888' : '#000'}
                                verticalAlign="bottom"
                                padding={4}
                            />

                            {isHoliday && <HolidayHighlight height={CELL_HEIGHT} />}
                        </Group>
                    );
                })}
            </Layer>
        </Stage>
    );
};

export const HeadDatesScale = React.forwardRef(Scale);
