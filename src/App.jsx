import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Group, Text } from 'react-konva';
import styles from './App.module.scss';
import { range } from 'lodash';
import { width, height, padding, ACTUAL_DATA } from './constants';
import { Sider } from './components/Sider/index';
import { StageItemLine } from './components/StageItemLine';
import { TaskItem } from './components/TaskItem';
import { getStageProps } from './utils/funcs';
import moment from 'moment';
import { render } from 'react-dom';
import { useRef } from 'react';

const reduceStagesToShow = (data) => data.reduce((acc, stage) => ({ ...acc, [stage.id]: true }), {});

const App = () => {
    const [data, setData] = useState(ACTUAL_DATA.stages);
    const [selectedId, selectShape] = useState(null);
    const [isTransforming, setIsTransforming] = useState(false);
    const [visibleStages, setVisibleStages] = useState(reduceStagesToShow(data));

    const stageRef = useRef();
    const containerRef = useRef();

    const width = 200 * padding;

    const toggleStageCollapse = (stageId) => {
        setVisibleStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

    const renderHeaderRows = (top, middle, bottom) => {
        // let result = { top: [], middle: [], bottom: [] };
        // let lastLeft = {};
        // let currentTop = '';
        // let currentMiddle = '';
        // let currentBottom = '';
        // let currentDate = null;
        // let box = null;

        // let start = this.props.currentday;
        // let end = this.props.currentday + this.props.numVisibleDays;
        const BUFFER_DAYS = 100;
        const today = moment(Date.now());
        const bufferPrevDate = moment(today).subtract(BUFFER_DAYS, 'days');
        const bufferNextDate = moment(today).add(BUFFER_DAYS, 'days');

        // for (let i = start - BUFFER_DAYS; i < end + BUFFER_DAYS; i++) {
        //     //The unit of iteration is day
        //     // currentDate = moment().add(i, 'days');
        //     // if (currentTop != currentDate.format(this.getFormat(top, 'top'))) {
        //     //     currentTop = currentDate.format(this.getFormat(top, 'top'));
        //     //     box = this.getBox(currentDate, top, lastLeft.top);
        //     //     lastLeft.top = box.left + box.width;
        //     //     result.top.push(<HeaderItem key={i} left={box.left} width={box.width} label={currentTop} />);
        //     // }
        //     // if (currentMiddle != currentDate.format(this.getFormat(middle))) {
        //     //     currentMiddle = currentDate.format(this.getFormat(middle));
        //     //     box = this.getBox(currentDate, middle, lastLeft.middle);
        //     //     lastLeft.middle = box.left + box.width;
        //     //     result.middle.push(<HeaderItem key={i} left={box.left} width={box.width} label={currentMiddle} />);
        //     // }
        //     // if (currentBottom != currentDate.format(this.getFormat(bottom))) {
        //     //     currentBottom = currentDate.format(this.getFormat(bottom));
        //     //     box = this.getBox(currentDate, bottom, lastLeft.bottom);
        //     //     lastLeft.bottom = box.left + box.width;
        //     //     if (bottom == 'shorttime' || bottom == 'fulltime') {
        //     //         result.bottom.push(this.renderTime(box.left, box.width, bottom, i));
        //     //     } else {
        //     //         result.bottom.push(<HeaderItem key={i} left={box.left} width={box.width} label={currentBottom} />);
        //     //     }
        //     // }
        // }
    };

    useEffect(() => {
        // renderHeaderRows();
        containerRef.current.addEventListener('scroll', repositionStage);
        repositionStage();
    }, []);

    // const onGridStageDragEnd = (e) => {
    //     const {
    //         attrs: { x, id },
    //     } = e.target;
    //     const newData = data.map((el) => {
    //         if (el.id === id) {
    //             return { ...el, start_at: Math.round(x / padding) };
    //         }
    //         return el;
    //     });

    //     setData(newData);
    // };

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

    function repositionStage() {
        const stage = stageRef.current;
        const container = containerRef.current;
        var dx = container.scrollLeft - padding;
        var dy = container.scrollTop - padding;
        stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
        stage.x(-dx);
        stage.y(-dy);
    }

    const onDeselect = () => {
        if (!isTransforming) {
            selectShape(null);
        }
    };

    const getMonths = () => {
        const start = moment('12-12-2011', 'MM-DD-YYYY');
        const end = moment('12-12-2023', 'MM-DD-YYYY');
        let result = [];

        // console.log(start, end, end.isSameOrBefore(start, 'month'));

        // while (end.isSameOrBefore(start, 'month')) {
        //     result = [...result, start.format('YYYY-MM')];
        //     start.subtract(1, 'month');
        // }

        return result.reverse();
    };

    const getDaysInMonth = (value) => {
        return moment(value, 'YYYY-MM').daysInMonth();
    };

    const CoreStage = ({ stage, line }) => {
        const { tasks, type, length, start_at, stages } = stage;
        const { x, width } = getStageProps(stages);

        return (
            <StageItemLine
                select={selectShape}
                id={stage.id}
                tasks={tasks}
                line={line}
                isSelected={selectedId === stage.id}
                length={width}
                start_at={x / padding}
                type="core"
                // onDragEnd={onGridStageDragEnd}
                onDeselect={onDeselect}
            />
        );
    };

    const GridLineItem = ({ stage, currentLine }) => {
        const { tasks, start_at, stages, length } = stage;

        console.log(stage.id, currentLine);

        console.log(tasks);
        return (
            <>
                <StageItemLine
                    select={selectShape}
                    id={stage.id}
                    tasks={tasks}
                    line={currentLine}
                    isSelected={selectedId === stage.id}
                    length={length}
                    start_at={start_at}
                    // onDragEnd={onGridStageDragEnd}
                    onDeselect={onDeselect}
                />

                {stages &&
                    stages.map((s, idx) => {
                        return <GridLineItem key={s.id} stage={s} currentLine={currentLine + idx + 1} />;
                    })}

                {tasks &&
                    tasks.map((task, taskIdx) => {
                        const { id, length, start_at, tasks = [] } = task;
                        console.log('currLine', stages?.length ?? 0 + currentLine);
                        return (
                            <StageItemLine
                                key={task.id}
                                select={selectShape}
                                id={id}
                                tasks={tasks}
                                line={4}
                                isSelected={selectedId === id}
                                length={length}
                                start_at={start_at}
                                // onDragEnd={onGridStageDragEnd}
                                onDeselect={onDeselect}
                                type="task"
                            />
                        );
                    })}
            </>
        );
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
                        <Stage
                            width={window.innerWidth + padding * 2}
                            height={window.innerHeight + padding * 2}
                            ref={stageRef}
                            onMouseUp={onDeselect}
                            listening
                            // onWheel={(e) => console.log(e)}
                        >
                            <Layer y={0}>
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
                                {getMonths().map((item, index) => {
                                    const daysCount = getDaysInMonth(item);
                                    const prevStages = [...getMonths().slice(0, index)];
                                    const prevStagesDaysCount = prevStages.reduce((acc, curr) => {
                                        return acc + getDaysInMonth(curr);
                                    }, 0);

                                    return (
                                        <Group key={item} x={prevStagesDaysCount * padding} y={0} height={padding}>
                                            <Rect
                                                key={item}
                                                width={padding * daysCount}
                                                height={padding}
                                                fill="#fff"
                                                opacity={0.5}
                                                stroke="#ccc"
                                                strokeWidth={0.5}
                                            />
                                            <Text
                                                width={padding * daysCount}
                                                height={padding}
                                                text={moment(item).format('MMMM')}
                                                align="center"
                                                verticalAlign="middle"
                                            />
                                        </Group>
                                    );
                                })}
                            </Layer>
                            <Layer y={padding * 2}>
                                {range(Math.round(width / padding)).map((n) => (
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
                                ))}

                                {range(Math.round(height / padding)).map((n) => (
                                    <Line
                                        key={'_horz_line_' + n}
                                        points={[
                                            0,
                                            Math.round((n + 1) * padding) - 0.5,
                                            width,
                                            Math.round((n + 1) * padding) - 0.5,
                                        ]}
                                        stroke="#aaa"
                                        strokeWidth={0.5}
                                    />
                                ))}

                                {data.map((stage, stageIdx) => {
                                    const { stages } = stage;
                                    const prevStages = [...data.slice(0, stageIdx)];
                                    const getPrevItems = (prevStages) => {
                                        const resArr = prevStages.reduce((acc, { id, stages = [], tasks = [] }) => {
                                            const all = [...tasks, ...stages];
                                            const inner = getPrevItems(stages);

                                            // console.log('prev prev', prevCount, stages);
                                            return [...all, ...inner];
                                        }, []);
                                        return resArr;
                                    };

                                    const currentLine = stageIdx + getPrevItems(prevStages).length;

                                    return (
                                        <React.Fragment key={stage.id}>
                                            <CoreStage stage={stage} line={currentLine} />

                                            {stages.map((el, idx) => {
                                                return (
                                                    <GridLineItem
                                                        key={el.id}
                                                        stage={el}
                                                        currentLine={currentLine + idx + 1}
                                                    />
                                                );
                                            })}
                                        </React.Fragment>
                                    );
                                })}

                                {/* {data.map((stage, stageIdx) => {
                                const { tasks } = stage;

                                const prevStages = [...data.slice(0, stageIdx)];

                                // if tasks are visible/hidden
                                const prevTasksCount = prevStages.reduce((acc, { id, tasks }) => {
                                    return visibleStages[id] ? acc + tasks.length : acc;
                                }, 0);

                                const currentLine = stageIdx + prevTasksCount;

                                return (
                                    <React.Fragment key={'__s_' + stage.id}>
                                        <StageItemLine
                                            select={selectShape}
                                            id={stage.id}
                                            tasks={tasks}
                                            line={currentLine}
                                            isSelected={selectedId === stage.id}
                                            onDragEnd={onGridStageDragEnd}
                                            onDeselect={onDeselect}
                                        />

                                        {visibleStages[stage.id] &&
                                            tasks?.map((task, taskIdx) => {
                                                return (
                                                    <TaskItem
                                                        key={'task_' + task.id}
                                                        select={selectShape}
                                                        task={task}
                                                        line={currentLine + taskIdx + 1}
                                                        stageId={stage.id}
                                                        isSelected={selectedId === task.id}
                                                        onDragEnd={onGridTaskDragEnd}
                                                        onTransformEnd={onGridTaskTransformEnd}
                                                        onTransformStart={onTransformStart}
                                                        onDeselect={onDeselect}
                                                    />
                                                );
                                            })}
                                    </React.Fragment>
                                );
                            })} */}
                            </Layer>
                        </Stage>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default App;
