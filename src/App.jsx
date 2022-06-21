import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Group, Text } from 'react-konva';
import styles from './App.module.scss';
import { isEqual, range, uniq, uniqWith } from 'lodash';
import { width, height, padding, ACTUAL_DATA, STAGE_HEIGHT } from './constants';
import { Sider } from './components/Sider/index';
import { StageItemLine } from './components/StageItemLine';
import { TaskItem } from './components/TaskItem';
import { getPrevStages, getStageProps } from './utils/funcs';
import moment from 'moment';
import { useRef } from 'react';
import Konva from 'konva';
import { HOLIDAYS } from './constants/index';

const reduceStagesToShow = (data) => data.reduce((acc, stage) => ({ ...acc, [stage.id]: true }), {});
21;

const App = () => {
    const today = moment();

    const [data, setData] = useState(ACTUAL_DATA.stages);
    const [selectedId, selectShape] = useState(null);
    const [isTransforming, setIsTransforming] = useState(false);
    const [visibleStages, setVisibleStages] = useState(reduceStagesToShow(data));
    const [dataRange, setDataRange] = useState([]);

    const timelineStageRef = useRef();
    const timelineLayerRef = useRef();
    const mainStageRef = useRef();
    const mainLayerRef = useRef();
    const containerRef = useRef();

    const toggleStageCollapse = (stageId) => {
        setVisibleStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

    // const onGridTaskDragEnd = (e) => {
    //     const node = e.target;
    //     const {
    //         attrs: { x, id, stageId },
    //     } = node;

    //     const stageGroup = node.getLayer().children.find((el) => el.attrs.id === stageId);
    //     const [associatedStageNode, percentStageNode] = stageGroup.children;

    //     const newData = data.map((el) => {
    //         if (el.id === stageId) {
    //             const newTasks = el.tasks.map((task) => {
    //                 if (task.id === id) {
    //                     if (task.start_at === Math.round(x / padding)) {
    //                         node.to({
    //                             x: padding * task.start_at,
    //                             duration: 0.2,
    //                         });
    //                     } else {
    //                         node.to({
    //                             x: Math.round(x / padding) * padding,
    //                             duration: 0.2,
    //                         });
    //                     }
    //                     return { ...task, start_at: Math.round(x / padding) };
    //                 }
    //                 return task;
    //             });

    //             // animating lines

    //             associatedStageNode.to({
    //                 width: getStageProps(newTasks).width * padding,
    //                 duration: 0.1,
    //             });

    //             percentStageNode.to({
    //                 width: (getStageProps(newTasks).width * getStageProps(newTasks).percent * padding) / 100,
    //                 x: 0,
    //                 duration: 0.2,
    //             });

    //             stageGroup.to({
    //                 x: getStageProps(newTasks).x,
    //                 duration: 0.1,
    //             });

    //             return { ...el, tasks: [...newTasks] };
    //         }
    //         return el;
    //     });

    //     setTimeout(() => setData(newData), 200);
    // };

    // const onTransformStart = () => {
    //     setIsTransforming(true);
    // };

    // const onGridTaskTransformEnd = (e) => {
    //     const node = e.target;

    //     const {
    //         attrs: { id, stageId },
    //     } = node;

    //     const scaleX = node.scaleX();
    //     node.scaleX(1);
    //     const width = Math.round((node.width() * scaleX) / padding);

    //     const newData = data.map((el) => {
    //         if (el.id === stageId) {
    //             const newTasks = el.tasks.map((task) => {
    //                 if (task.id === id) {
    //                     if (width !== task.length) {
    //                         node.width(padding * width);
    //                         return { ...task, length: width };
    //                     }
    //                 }
    //                 return task;
    //             });

    //             return { ...el, tasks: [...newTasks] };
    //         }
    //         return el;
    //     });
    //     setData(newData);
    //     setIsTransforming(false);
    //     selectShape(null);
    // };

    const onDeselect = () => {
        if (!isTransforming) {
            selectShape(null);
        }
    };

    const CoreStage = ({ stage, line }) => {
        const { id, tasks, stages } = stage;

        const innerStages = getPrevStages(stages);
        const { x, width } = getStageProps(innerStages);

        return (
            <StageItemLine
                select={selectShape}
                id={id}
                tasks={tasks}
                line={line}
                isSelected={selectedId === id}
                length={width}
                start_at={x}
                type="core"
                onDeselect={onDeselect}
            />
        );
    };

    const getPrevItems = (stagesArr) => {
        const resArr = stagesArr.reduce((acc, { stages = [], tasks = [] }) => {
            const all = [...tasks, ...stages];
            const inner = getPrevItems(stages);

            return [...acc, ...all, ...inner];
        }, []);
        return resArr;
    };

    const GridLineItem = ({ stage, allStages, index, currentLine }) => {
        const { tasks, start_at, stages, deadline, type } = stage;
        const prevStages = [...allStages.slice(0, index)];
        const prevItemsCount = getPrevItems(prevStages).length;

        const start = moment(start_at);
        const x = start.diff(today, 'days', false);
        const l = moment(deadline).diff(start, 'days', false);

        return (
            <>
                <StageItemLine
                    select={selectShape}
                    id={stage.id}
                    tasks={tasks}
                    line={currentLine + prevItemsCount}
                    isSelected={selectedId === stage.id}
                    length={l}
                    start_at={x}
                    type={type}
                    // onDragEnd={onGridStageDragEnd}
                    onDeselect={onDeselect}
                />

                {tasks &&
                    tasks.map((task, taskIdx) => {
                        return (
                            <TaskItem
                                key={task.id}
                                select={selectShape}
                                task={task}
                                line={currentLine + prevItemsCount + taskIdx + 1}
                                isSelected={selectedId === task.id}
                                // onDragEnd={onGridStageDragEnd}
                                onDeselect={onDeselect}
                            />
                        );
                    })}

                {stages &&
                    stages.map((s, idx) => {
                        return (
                            <GridLineItem
                                key={s.id}
                                allStages={stages}
                                index={idx}
                                stage={s}
                                currentLine={currentLine + (tasks?.length || 0) + prevItemsCount + idx + 1}
                            />
                        );
                    })}
            </>
        );
    };

    useEffect(() => {
        const stage = mainStageRef.current;
        const startIndex = Math.floor((-stage.x() - stage.width()) / padding);
        const endIndex = Math.floor((-stage.x() + stage.width() * 2) / padding);
        setDataRange([startIndex, endIndex]);
        checkShapes();
        stage.batchDraw();
    }, []);

    useEffect(() => {
        timelineLayerRef?.current?.batchDraw();
        mainLayerRef?.current?.batchDraw();
    }, [dataRange]);

    const onDragStage = (e) => {
        const x = e.target.x();
        timelineStageRef.current.x(x);
    };

    const onStageScroll = (e) => {
        const { evt } = e;
        if (evt.shiftKey) {
            evt.preventDefault();
            timelineStageRef.current.x(timelineStageRef.current.x() - evt.deltaY);
            mainStageRef.current.x(mainStageRef.current.x() - evt.deltaY);
            checkShapes();
        }
    };

    const checkShapes = () => {
        const layer = mainLayerRef.current;
        const timelineLayer = timelineLayerRef.current;

        if (!layer || !timelineLayer) return;

        const stage = mainStageRef.current;

        const startIndex = Math.floor((-stage.x() - stage.width()) / padding);
        const endIndex = Math.floor((-stage.x() + stage.width() * 2) / padding);

        setDataRange([startIndex, endIndex]);
    };

    const getMonths = () => {
        return range(dataRange[0] * padding, dataRange[1] * padding, padding).map((n) => {
            const day = moment(today).add(n / padding, 'days');

            const startDate = moment(day).startOf('month');
            const endDate = moment(day).endOf('month');

            const xStart = moment(startDate).diff(moment(today), 'days', false);
            const xEnd = moment(endDate).diff(moment(today), 'days', false);

            return { date: startDate, start: xStart + (xStart > 0 + 1), end: xEnd + (xEnd > 0 && 1) }; // Check why if > 0 need to add + 1
        }, []);
    };

    return (
        <div className={styles.main}>
            <div className={styles.flex}>
                <Sider
                    data={data}
                    setData={setData}
                    toggleStageCollapse={toggleStageCollapse}
                    visibleStages={visibleStages}
                />

                <div className={styles.grid} ref={containerRef}>
                    <div className={styles.innerGridContainer}>
                        <div className={styles.timelineContainer}>
                            <Stage width={window.innerWidth} height={padding * 2} ref={timelineStageRef}>
                                <Layer ref={timelineLayerRef}>
                                    <Line
                                        points={[
                                            dataRange[0] * padding,
                                            padding - 0.5,
                                            dataRange[1] * padding,
                                            padding - 0.5,
                                        ]}
                                        stroke="#aaa"
                                        strokeWidth={0.5}
                                    />
                                    <Line
                                        points={[
                                            dataRange[0] * padding,
                                            padding * 2 - 0.5,
                                            dataRange[1] * padding,
                                            padding * 2 - 0.5,
                                        ]}
                                        stroke="#aaa"
                                        strokeWidth={0.5}
                                    />
                                    {uniqWith(getMonths(), isEqual).map((m) => {
                                        const { date, start, end } = m;

                                        const text = date.format('MMMM YYYY');
                                        const length = (end - start) * padding;
                                        return (
                                            <Group key={text + start} x={start * padding} y={0}>
                                                <Text
                                                    y={0}
                                                    fontSize={14}
                                                    text={text}
                                                    width={length}
                                                    height={padding}
                                                    align="center"
                                                    verticalAlign="middle"
                                                />
                                                <Line
                                                    points={[-0.5, 0, -0.5, padding * 2 - 0.5]}
                                                    stroke="#aaa"
                                                    strokeWidth={0.5}
                                                />
                                            </Group>
                                        );
                                    })}
                                    {range(dataRange[0] * padding, dataRange[1] * padding, padding).map((n) => {
                                        const weekdayNumber = moment(today)
                                            .add(n / padding, 'days')
                                            .format('d');

                                        const day = moment(today).add(n / padding, 'days');

                                        const isHoliday =
                                            +weekdayNumber === 0 ||
                                            +weekdayNumber === 6 ||
                                            HOLIDAYS.includes(day.format('YYYY-MM-DD'));

                                        return (
                                            <Group key={n} x={n} y={padding}>
                                                {day.isSame(today) && (
                                                    <Rect
                                                        width={padding}
                                                        height={padding}
                                                        cornerRadius={7}
                                                        fill="#546678"
                                                    />
                                                )}

                                                <Text
                                                    fontSize={11}
                                                    text={day.format('dd')}
                                                    width={padding}
                                                    height={padding}
                                                    align="center"
                                                    fill={isHoliday ? '#888' : day.isSame(today) ? '#fff' : '#000'}
                                                    verticalAlign="top"
                                                    padding={3}
                                                />
                                                <Text
                                                    fontSize={11}
                                                    text={day.format('DD')}
                                                    width={padding}
                                                    height={padding}
                                                    align="center"
                                                    fill={isHoliday ? '#888' : day.isSame(today) ? '#fff' : '#000'}
                                                    verticalAlign="bottom"
                                                    padding={3}
                                                />

                                                {isHoliday && (
                                                    <Rect width={padding} height={padding} fill="#ccc" opacity={0.2} />
                                                )}
                                            </Group>
                                        );
                                    })}
                                </Layer>
                            </Stage>
                        </div>
                        <Stage
                            width={window.innerWidth}
                            height={window.innerHeight}
                            ref={mainStageRef}
                            onMouseUp={onDeselect}
                            listening
                            draggable
                            dragBoundFunc={(pos) => {
                                return {
                                    x: pos.x,
                                    y: 0,
                                };
                            }}
                            onDragEnd={checkShapes}
                            onDragMove={onDragStage}
                            onWheel={onStageScroll}
                        >
                            <Layer ref={mainLayerRef}>
                                {range(dataRange[0] * padding, dataRange[1] * padding, padding).map((n) => {
                                    const weekdayNumber = moment(today)
                                        .add(n / padding, 'days')
                                        .format('d');

                                    const day = moment(today).add(n / padding, 'days');

                                    const isHoliday =
                                        +weekdayNumber === 0 ||
                                        +weekdayNumber === 6 ||
                                        HOLIDAYS.includes(day.format('YYYY-MM-DD'));

                                    return (
                                        <Group key={n} x={n} y={0}>
                                            {isHoliday && (
                                                <Rect
                                                    width={padding}
                                                    height={height + padding}
                                                    fill="#ccc"
                                                    opacity={0.2}
                                                />
                                            )}
                                        </Group>
                                    );
                                })}
                                <Line
                                    points={[-0.5, -padding * 2, -0.5, height + padding * 2]}
                                    stroke="#546678"
                                    strokeWidth={0.5}
                                    dashEnabled
                                    dash={[7, 7]}
                                />

                                {range(0, height, padding).map((n) => {
                                    return (
                                        <Line
                                            key={'_horz_line_' + n}
                                            points={[
                                                dataRange[0] * padding,
                                                Math.round(n) - 0.5,
                                                dataRange[1] * padding,
                                                Math.round(n) - 0.5,
                                            ]}
                                            stroke="#aaa"
                                            strokeWidth={0.5}
                                        />
                                    );
                                })}
                            </Layer>
                            <Layer>
                                {data.map((stage, stageIdx) => {
                                    const { stages, tasks } = stage;
                                    const prevStages = [...data.slice(0, stageIdx)];

                                    const currentLine = stageIdx + getPrevItems(prevStages).length;

                                    return (
                                        <React.Fragment key={stage.id}>
                                            <CoreStage stage={stage} line={currentLine} />

                                            {tasks &&
                                                tasks.map((task, taskIdx) => {
                                                    const { id, length, start_at } = task;
                                                    return (
                                                        <TaskItem
                                                            key={task.id}
                                                            select={selectShape}
                                                            id={id}
                                                            task={task}
                                                            line={currentLine + taskIdx + 1}
                                                            isSelected={selectedId === id}
                                                            length={length}
                                                            start_at={start_at}
                                                            // onDragEnd={onGridStageDragEnd}
                                                            onDeselect={onDeselect}
                                                        />
                                                    );
                                                })}

                                            {stages.map((el, idx) => {
                                                return (
                                                    <GridLineItem
                                                        key={el.id}
                                                        allStages={stages}
                                                        index={idx}
                                                        stage={el}
                                                        currentLine={currentLine + (tasks?.length || 0) + idx + 1}
                                                    />
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}
                            </Layer>
                        </Stage>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
