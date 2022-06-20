import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Group, Text } from 'react-konva';
import styles from './App.module.scss';
import { range } from 'lodash';
import { width, height, padding, ACTUAL_DATA, STAGE_HEIGHT } from './constants';
import { Sider } from './components/Sider/index';
import { StageItemLine } from './components/StageItemLine';
import { TaskItem } from './components/TaskItem';
import { getPrevStages, getStageProps } from './utils/funcs';
import moment from 'moment';
import { useRef } from 'react';
import Konva from 'konva';

const reduceStagesToShow = (data) => data.reduce((acc, stage) => ({ ...acc, [stage.id]: true }), {});
21;

const App = () => {
    const [data, setData] = useState(ACTUAL_DATA.stages);
    const [selectedId, selectShape] = useState(null);
    const [isTransforming, setIsTransforming] = useState(false);
    const [visibleStages, setVisibleStages] = useState(reduceStagesToShow(data));
    const [dataRange, setDataRange] = useState([]);

    const stageRef = useRef();
    const mainLayerRef = useRef();
    const timelineLayerRef = useRef();
    const containerRef = useRef();

    const toggleStageCollapse = (stageId) => {
        setVisibleStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

    const buffer = 500;
    const projectStart = moment('22.05.2022', 'DD.MM.YYYY');
    const projectEnd = moment('10.10.2023', 'DD.MM.YYYY');
    const today = moment();

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

    const getMonths = () => {
        const projectStart = moment('12-12-2011', 'MM-DD-YYYY');
        const projectEnd = moment('12-12-2023', 'MM-DD-YYYY');
        let result = [];

        console.log(projectStart.isSameOrBefore(projectEnd));

        console.log(result);

        return result.reverse();
    };

    const getDaysInMonth = (value) => {
        return moment(value, 'YYYY-MM').daysInMonth();
    };

    const CoreStage = ({ stage, line }) => {
        const { tasks, type, length, start_at, stages } = stage;

        const innerStages = getPrevStages(stages);
        const { x, width } = getStageProps(innerStages);

        return (
            <>
                <StageItemLine
                    select={selectShape}
                    id={stage.id}
                    tasks={tasks}
                    line={line}
                    isSelected={selectedId === stage.id}
                    length={width}
                    start_at={x}
                    type="core"
                    onDeselect={onDeselect}
                />
            </>
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
        const { tasks, start_at, stages, length, type } = stage;
        const prevStages = [...allStages.slice(0, index)];
        const prevItemsCount = getPrevItems(prevStages).length;

        const start = moment(stage.start_at);
        const deadline = moment(stage.deadline);
        const x = start.diff(today, 'days', false);
        const l = deadline.diff(start, 'days', false);

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
                        const { id, length, start_at, tasks = [] } = task;
                        return (
                            <TaskItem
                                key={task.id}
                                select={selectShape}
                                id={id}
                                task={task}
                                line={currentLine + prevItemsCount + taskIdx + 1}
                                isSelected={selectedId === id}
                                length={length}
                                start_at={start_at}
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
        checkShapes();
        stageRef.current.batchDraw();
        console.log(mainLayerRef);
    }, []);

    function checkShapes() {
        const stage = stageRef.current;
        const layer = mainLayerRef.current;
        const timelineLayer = timelineLayerRef.current;

        if (!layer || !timelineLayer) return;

        layer.destroyChildren();
        // layer.offsetY(-padding * 2);
        timelineLayer.destroyChildren();

        const startIndex = Math.floor((-stage.x() - stage.width()) / padding);
        const endIndex = Math.floor((-stage.x() + stage.width() * 2) / padding);

        const startX = startIndex * padding;
        const endX = endIndex * padding;

        setDataRange([startIndex, endIndex]);

        for (let y = 0; y < height; y += padding) {
            layer.add(
                new Konva.Line({
                    points: [startX, Math.round(y) - 0.5, endX, Math.round(y) - 0.5],
                    stroke: '#aaa',
                    strokeWidth: 0.5,
                })
            );
        }

        for (let x = startX; x < endX; x += padding) {
            const indexX = x / padding;

            timelineLayer.add(
                new Konva.Text({
                    fontSize: 10,
                    text: moment(today).add(indexX, 'days').format('DD.MM.YYYY'),
                    x,
                    y: 0,
                    width: padding,
                    height: padding * 2,
                    align: 'center',
                    verticalAlign: 'middle',
                })
            );
        }
    }

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
                        {/* <div
                            style={{
                                position: 'absolute',
                                width,
                                height: padding * 2,
                                borderBottom: '1px solid #aaa',
                                borderLeft: '1px solid #aaa',
                                top: 0,
                                background: '#fff',
                                zIndex: 2,
                            }}
                        >
                            <Stage width={window.innerWidth} height={padding * 2}>
                                <Layer>
                                    <Group x={0} y={0} height={padding * 2}>
                                        <Line
                                            points={[0, 1 * padding - 0.5, width, 1 * padding - 0.5]}
                                            stroke="#aaa"
                                            strokeWidth={0.5}
                                        />
                                        <Line
                                            points={[0, 2 * padding - 0.5, width, 2 * padding - 0.5]}
                                            stroke="#aaa"
                                            strokeWidth={0.5}
                                        />
                                    </Group>
                                </Layer>
                            </Stage>
                        </div> */}
                        <Stage
                            width={window.innerWidth}
                            height={window.innerHeight}
                            ref={stageRef}
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
                            // onWheel={(e) => console.log(e)}
                        >
                            <Layer ref={timelineLayerRef} y={0}>
                                <Line
                                    points={[0, 1 * padding - 0.5, window.innerWidth, 1 * padding - 0.5]}
                                    stroke="#ff0000"
                                    strokeWidth={0.5}
                                />
                                <Line
                                    points={[0, 2 * padding - 0.5, window.innerWidth, 2 * padding - 0.5]}
                                    stroke="#ff0000"
                                    strokeWidth={0.5}
                                />
                            </Layer>

                            <Layer ref={mainLayerRef} y={2 * padding}>
                                {/* {range(Math.round(width / padding)).map((n) => (
                                    <Line
                                        key={'_vert_line_' + n}
                                        points={[
                                            Math.round(n * padding) + 0.5,
                                            0,
                                            Math.round(n * padding) + 0.5,
                                            height,
                                        ]}
                                        stroke="#aaa"
                                        strokeWidth={0.5}
                                    />
                                ))} */}

                                {range(Math.round(height / padding)).map((n) => (
                                    <Line
                                        key={'_horz_line_' + n}
                                        points={[
                                            0,
                                            Math.round((n + 1) * padding) - 0.5,
                                            window.innerWidth,
                                            Math.round((n + 1) * padding) - 0.5,
                                        ]}
                                        stroke="#aaa"
                                        strokeWidth={0.5}
                                    />
                                ))}
                            </Layer>
                            <Layer>
                                {data.map((stage, stageIdx) => {
                                    // const start = moment(stage.start_at);
                                    // const deadline = moment(stage.deadline);
                                    // const x = start.diff(today, 'days', false);
                                    // const length = deadline.diff(start, 'days', false);

                                    const { stages, tasks } = stage;
                                    const prevStages = [...data.slice(0, stageIdx)];

                                    const currentLine = stageIdx + getPrevItems(prevStages).length;

                                    return (
                                        <React.Fragment key={stage.id}>
                                            <CoreStage stage={stage} line={currentLine + 2} />
                                            {/*  2 is for header padding  */}

                                            {/* {tasks &&
                                                tasks.map((task, taskIdx) => {
                                                    const { id, length, start_at, tasks = [] } = task;
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
                                                })} */}

                                            {stages.map((el, idx) => {
                                                return (
                                                    <GridLineItem
                                                        key={el.id}
                                                        allStages={stages}
                                                        index={idx}
                                                        stage={el}
                                                        currentLine={
                                                            currentLine + (tasks?.length || 0) + idx + 1 + 2
                                                        } /* 2 is for header padding */
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
