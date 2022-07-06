import React, { useState } from 'react';
import { Layer } from 'react-konva';
import { SCALING_VALUES } from '../../../constants';
import {
    getParentStageProps,
    increaseColorBrightness,
    getPrevVisibleItems,
    getScaledCellWidth,
    getStage,
    getDataOnStageEdit,
} from '../../../utils/funcs';
import { CoreStage } from '../CoreStage';
import { TaskItemLine } from '../TaskItemLine';
import { StageSection } from '../StageSection';
import moment from 'moment';

export const DataLayer = ({ scale, data, setData, visibleStages }) => {
    const [selectedId, selectShape] = useState(null);
    const [isTransforming, setIsTransforming] = useState(false);

    const { CELL_WIDTH } = SCALING_VALUES[scale];

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
                    width: getParentStageProps(newTasks, scale).width * CELL_WIDTH,
                    duration: 0.1,
                });

                percentStageNode.to({
                    width:
                        (getParentStageProps(newTasks, scale).width *
                            getParentStageProps(newTasks).percent *
                            CELL_WIDTH) /
                        100,
                    x: 0,
                    duration: 0.2,
                });

                stageGroup.to({
                    x: getParentStageProps(newTasks, scale).x,
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

    const onStageTransformEnd = (e) => {
        const node = e.target;

        const {
            attrs: { id },
        } = node;

        const editingStage = getStage(data, id);
        const { start_at } = editingStage;

        const scaleX = node.scaleX();
        node.scaleX(1);

        const width = Math.round((node.width() * scaleX) / getScaledCellWidth(scale));
        const newDeadline = moment(start_at).add(width, 'days').format('YYYY-MM-DD');
        const newData = getDataOnStageEdit(data, { ...editingStage, deadline: newDeadline });

        node.width(width * getScaledCellWidth(scale));
        setData(newData);
        setIsTransforming(false);
        selectShape(null);
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
        <Layer id="DATA_LAYER">
            {data.map((stage, stageIdx) => {
                const { stages, tasks, color } = stage;
                const prevStages = [...data.slice(0, stageIdx)];
                const prevItemsCount = getPrevVisibleItems(prevStages, visibleStages).length;
                const currentLine = prevItemsCount + stageIdx;

                return (
                    <React.Fragment key={stage.id}>
                        <CoreStage scale={scale} stage={stage} line={currentLine} />

                        {visibleStages[stage.id] &&
                            tasks &&
                            tasks.map((task, taskIdx) => {
                                return (
                                    <TaskItemLine
                                        scale={scale}
                                        key={task.id}
                                        task={task}
                                        line={currentLine + taskIdx + 1}
                                        data={data}
                                        setData={setData}
                                    />
                                );
                            })}

                        {visibleStages[stage.id] &&
                            stages.map((el, idx) => {
                                return (
                                    <StageSection
                                        visibleStages={visibleStages}
                                        data={data}
                                        setData={setData}
                                        scale={scale}
                                        select={selectShape}
                                        onDeselect={onDeselect}
                                        selectedId={selectedId}
                                        key={el.id}
                                        allStages={stages}
                                        index={idx}
                                        stage={el}
                                        color={increaseColorBrightness(color, 40)}
                                        currentLine={currentLine + (tasks?.length || 0) + idx + 1}
                                        onTransformStart={onTransformStart}
                                        onTransformEnd={onStageTransformEnd}
                                    />
                                );
                            })}
                    </React.Fragment>
                );
            })}
        </Layer>
    );
};
