import React, { useState, useEffect } from 'react';
import { Stage, Layer, Line, Rect, Group, Text } from 'react-konva';
import styles from './App.module.scss';
import { range } from 'lodash';
import { width, height, padding, initialData, ACTUAL_DATA } from './constants';
import { Sider } from './components/Sider/index';
import { StageItemLine } from './components/StageItemLine';
import { TaskItem } from './components/TaskItem';
import { getStageProps } from './utils/funcs';
import moment from 'moment';

const reduceStagesToShow = (data) => data.reduce((acc, stage) => ({ ...acc, [stage.id]: true }), {});

const App = () => {
    const [data, setData] = useState(ACTUAL_DATA.stages);
    const [selectedId, selectShape] = useState(null);
    const [isTransforming, setIsTransforming] = useState(false);
    const [visibleStages, setVisibleStages] = useState(reduceStagesToShow(data));

    const toggleStageCollapse = (stageId) => {
        setVisibleStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

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

    const onDeselect = () => {
        if (!isTransforming) {
            selectShape(null);
        }
    };

    const getMonths = () => {
        const start = moment('12-12-2018', 'MM-DD-YYYY');
        const end = moment('12-12-2011', 'MM-DD-YYYY');
        let result = [];

        // console.log(start, end, end.isSameOrBefore(start, 'month'));

        while (end.isSameOrBefore(start, 'month')) {
            result = [...result, start.format('YYYY-MM')];
            start.subtract(1, 'month');
        }

        return result.reverse();
    };

    let monthDaysCount = 0;

    return (
        <div className={styles.main}>
            <div className={styles.flex}>
                <Sider
                    data={data}
                    setData={setData}
                    toggleStageCollapse={toggleStageCollapse}
                    visibleStages={visibleStages}
                />

                <div className={styles.grid}>
                    <Stage
                        width={width}
                        height={height}
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
                                const daysCount = moment(item, 'YYYY-MM').daysInMonth();
                                const prevStages = [...getMonths().slice(0, index)];
                                const prevStagesDaysCount = prevStages.reduce((acc, curr) => acc + curr, 0);
                                console.log(prevStagesDaysCount);
                                // TODO

                                return (
                                    <Group
                                        key={item}
                                        x={0}
                                        y={0}
                                        height={padding}
                                        draggable={true}
                                        dragBoundFunc={(pos) => {
                                            return {
                                                x: pos.x,
                                                y: 0,
                                            };
                                        }}
                                    >
                                        <Rect
                                            key={item}
                                            width={padding * daysCount}
                                            height={padding}
                                            fill={'#ff00ff'}
                                            opacity={0.5}
                                            stroke="#ccc"
                                            strokeWidth={0.5}
                                        />
                                        <Text
                                            width={padding * daysCount}
                                            height={padding}
                                            text={
                                                index *
                                                moment(
                                                    getMonths()[index - 1] || getMonths()[0],
                                                    'YYYY-MM'
                                                ).daysInMonth()
                                            }
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
    );
};

export default App;
