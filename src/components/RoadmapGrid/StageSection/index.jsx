import moment from 'moment';
import React from 'react';
import { getPrevItems, getScaledCellWidth, getStageX } from '../../../utils/funcs';
import { StageItemLine } from '../StageItemLine/index';
import { TaskItemLine } from '../TaskItemLine';

export const StageSection = ({
    scale,
    stage,
    allStages,
    index,
    currentLine,
    color,
    select,
    onDeselect,
    selectedId,
}) => {
    const { tasks, start_at, stages, deadline, type } = stage;
    const prevStages = [...allStages.slice(0, index)];
    const prevItemsCount = getPrevItems(prevStages).length;
    const scaledCellWidth = getScaledCellWidth(scale);
    const start = moment(start_at);
    const x = getStageX(start, scale);
    const width = moment(deadline).diff(start, 'days', false);

    return (
        <>
            <StageItemLine
                select={select}
                id={stage.id}
                tasks={tasks}
                line={currentLine + prevItemsCount}
                isSelected={selectedId === stage.id}
                length={width * scaledCellWidth}
                start_at={x * scaledCellWidth}
                type={type}
                color={color}
                // onDragEnd={onGridStageDragEnd}
                onDeselect={onDeselect}
            />

            {tasks &&
                tasks.map((task, taskIdx) => {
                    return (
                        <TaskItemLine
                            scale={scale}
                            key={task.id}
                            task={task}
                            line={currentLine + prevItemsCount + taskIdx + 1}
                        />
                    );
                })}

            {stages &&
                stages.map((s, idx) => {
                    return (
                        <StageSection
                            scale={scale}
                            select={select}
                            color={color}
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
