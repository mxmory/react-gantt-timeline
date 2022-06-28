import moment from 'moment';
import React from 'react';
import { getPrevItems } from '../../../utils/funcs';
import { StageItemLine } from '../StageItemLine/index';
import { TaskItemLine } from '../TaskItemLine';

export const StageSection = ({
    cellWidth,
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
    const today = moment().startOf('day');

    const start = moment(start_at);
    const x = start.diff(today, 'days', false) * cellWidth;
    const width = moment(deadline).diff(start, 'days', false) * cellWidth;

    console.log({ width });
    return (
        <>
            <StageItemLine
                select={select}
                id={stage.id}
                tasks={tasks}
                line={currentLine + prevItemsCount}
                isSelected={selectedId === stage.id}
                length={width}
                start_at={x}
                type={type}
                color={color}
                // onDragEnd={onGridStageDragEnd}
                onDeselect={onDeselect}
            />

            {tasks &&
                tasks.map((task, taskIdx) => {
                    return (
                        <TaskItemLine
                            cellWidth={cellWidth}
                            key={task.id}
                            select={select}
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
                        <StageSection
                            cellWidth={cellWidth}
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
