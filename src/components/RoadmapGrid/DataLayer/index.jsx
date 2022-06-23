import React, { useState } from 'react';
import { Layer } from 'react-konva';
import { CELL_WIDTH } from '../../../constants';
import { getPrevItems, getStageProps, increaseColorBrightness } from '../../../utils/funcs';
import { CoreStage } from '../CoreStage';
import { TaskItemLine } from '../TaskItemLine';
import { StageSection } from '../StageSection';

export const DataLayer = ({ data, setData }) => {
    const [selectedId, selectShape] = useState(null);
    const [isTransforming, setIsTransforming] = useState(false);

    //#region funcs
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
                        if (task.start_at === Math.round(x / CELL_WIDTH)) {
                            node.to({
                                x: CELL_WIDTH * task.start_at,
                                duration: 0.2,
                            });
                        } else {
                            node.to({
                                x: Math.round(x / CELL_WIDTH) * CELL_WIDTH,
                                duration: 0.2,
                            });
                        }
                        return { ...task, start_at: Math.round(x / CELL_WIDTH) };
                    }
                    return task;
                });

                // animating lines

                associatedStageNode.to({
                    width: getStageProps(newTasks).width * CELL_WIDTH,
                    duration: 0.1,
                });

                percentStageNode.to({
                    width: (getStageProps(newTasks).width * getStageProps(newTasks).percent * CELL_WIDTH) / 100,
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
        const width = Math.round((node.width() * scaleX) / CELL_WIDTH);

        const newData = data.map((el) => {
            if (el.id === stageId) {
                const newTasks = el.tasks.map((task) => {
                    if (task.id === id) {
                        if (width !== task.length) {
                            node.width(CELL_WIDTH * width);
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
    //#endregion funcs

    const onDeselect = () => {
        if (!isTransforming) {
            selectShape(null);
        }
    };

    return (
        <Layer>
            {data.map((stage, stageIdx) => {
                const { stages, tasks, color } = stage;
                const prevStages = [...data.slice(0, stageIdx)];

                const currentLine = stageIdx + getPrevItems(prevStages).length;

                return (
                    <React.Fragment key={stage.id}>
                        <CoreStage stage={stage} line={currentLine} />

                        {tasks &&
                            tasks.map((task, taskIdx) => {
                                const { id, length, start_at } = task;
                                return (
                                    <TaskItemLine
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
                                <StageSection
                                    select={selectShape}
                                    onDeselect={onDeselect}
                                    selectedId={selectedId}
                                    key={el.id}
                                    allStages={stages}
                                    index={idx}
                                    stage={el}
                                    color={increaseColorBrightness(color, 40)}
                                    currentLine={currentLine + (tasks?.length || 0) + idx + 1}
                                />
                            );
                        })}
                    </React.Fragment>
                );
            })}
        </Layer>
    );
};