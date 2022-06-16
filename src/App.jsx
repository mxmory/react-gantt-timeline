import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Group, Text } from 'react-konva';
import styles from './App.module.scss';
import { range } from 'lodash';
import { width, height, padding, ACTUAL_DATA } from './constants';
import { Sider } from './components/Sider/index';
import { StageItemLine } from './components/StageItemLine';
import { TaskItem } from './components/TaskItem';
import { getPrevStages, getStageProps } from './utils/funcs';
import moment from 'moment';
import { useRef } from 'react';

const reduceStagesToShow = (data) => data.reduce((acc, stage) => ({ ...acc, [stage.id]: true }), {});

const App = () => {
    const [data, setData] = useState(ACTUAL_DATA.stages);
    const [selectedId, selectShape] = useState(null);
    const [isTransforming, setIsTransforming] = useState(false);
    const [visibleStages, setVisibleStages] = useState(reduceStagesToShow(data));

    const stageRef = useRef();
    const containerRef = useRef();

    const toggleStageCollapse = (stageId) => {
        setVisibleStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

    useEffect(() => {
        // renderHeaderRows();
        // containerRef.current.addEventListener('scroll', repositionStage);
        // repositionStage();
    }, []);

    const onGridStageDragEnd = (e) => {
        console.log(e);
        const {
            attrs: { x, id },
        } = e.target;
        // const newData = data.map((el) => {
        //     if (el.id === id) {
        //         return { ...el, start_at: Math.round(x / padding) };
        //     }
        //     return el;
        // });

        // setData(newData);
    };

    const onGridTaskDragEnd = (e) => {
        const node = e.target;
        const {
            attrs: { x, id, stageId },
        } = node;

        const stageGroup = node.getLayer().children.find((el) => el.attrs.id === stageId);
        const [associatedStageNode, percentStageNode] = stageGroup.children;

        const newData = data.map((el) => {
            if (el.id === stageId) {
                const newTasks = el.tasks.map((task) => {
                    if (task.id === id) {
                        if (task.start_at === Math.round(x / padding)) {
                            node.to({
                                x: padding * task.start_at,
                                duration: 0.2,
                            });
                        } else {
                            node.to({
                                x: Math.round(x / padding) * padding,
                                duration: 0.2,
                            });
                        }
                        return { ...task, start_at: Math.round(x / padding) };
                    }
                    return task;
                });

                // animating lines

                associatedStageNode.to({
                    width: getStageProps(newTasks).width * padding,
                    duration: 0.1,
                });

                percentStageNode.to({
                    width: (getStageProps(newTasks).width * getStageProps(newTasks).percent * padding) / 100,
                    x: 0,
                    duration: 0.2,
                });

                stageGroup.to({
                    x: getStageProps(newTasks).x,
                    duration: 0.1,
                });

                return { ...el, tasks: [...newTasks] };
            }
            return el;
        });

        setTimeout(() => setData(newData), 200);
    };

    const onTransformStart = () => {
        setIsTransforming(true);
    };

    const onGridTaskTransformEnd = (e) => {
        const node = e.target;

        const {
            attrs: { id, stageId },
        } = node;

        const scaleX = node.scaleX();
        node.scaleX(1);
        const width = Math.round((node.width() * scaleX) / padding);

        const newData = data.map((el) => {
            if (el.id === stageId) {
                const newTasks = el.tasks.map((task) => {
                    if (task.id === id) {
                        if (width !== task.length) {
                            node.width(padding * width);
                            return { ...task, length: width };
                        }
                    }
                    return task;
                });

                return { ...el, tasks: [...newTasks] };
            }
            return el;
        });
        setData(newData);
        setIsTransforming(false);
        selectShape(null);
    };

    // function repositionStage() {
    //     const stage = stageRef.current;
    //     const container = containerRef.current;
    //     var dx = container.scrollLeft - padding;
    //     var dy = container.scrollTop - padding;
    //     stage.container().style.transform = 'translate(' + dx + 'px, ' + dy + 'px)';
    //     stage.x(-dx);
    //     stage.y(-dy);
    // }

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
                    start_at={x / padding}
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

        return (
            <>
                <StageItemLine
                    select={selectShape}
                    id={stage.id}
                    tasks={tasks}
                    line={currentLine + prevItemsCount}
                    isSelected={selectedId === stage.id}
                    length={length}
                    start_at={start_at}
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
                    <div style={{ width, height: padding * 2, borderBottom: '1px solid #aaa' }}></div>
                    {/* <div className={styles.innerGridContainer}> */}
                    <Stage
                        width={4000}
                        height={3000}
                        ref={stageRef}
                        onMouseUp={onDeselect}
                        listening
                        // onWheel={(e) => console.log(e)}
                    >
                        {/* <Layer>
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
                        </Layer> */}
                        <Layer>
                            {range(Math.round(width / padding)).map((n) => (
                                <Line
                                    key={'_vert_line_' + n}
                                    points={[Math.round(n * padding) + 0.5, 0, Math.round(n * padding) + 0.5, height]}
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
                                const { stages, tasks } = stage;
                                const prevStages = [...data.slice(0, stageIdx)];

                                const currentLine = stageIdx + getPrevItems(prevStages).length;

                                return (
                                    <React.Fragment key={stage.id}>
                                        <CoreStage stage={stage} line={currentLine} />

                                        {tasks &&
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
                    {/* </div> */}
                </div>
            </div>
        </div>
    );
};

export default App;
