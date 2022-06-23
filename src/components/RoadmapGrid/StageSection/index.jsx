import moment from 'moment';
import React from 'react';
import { getPrevItems } from '../../../utils/funcs';
import { StageItemLine } from '../StageItemLine/index';
import { TaskItemLine } from '../TaskItemLine';

export const StageSection = ({ stage, allStages, index, currentLine, color, select, onDeselect, selectedId }) => {
    const { tasks, start_at, stages, deadline, type } = stage;
    const prevStages = [...allStages.slice(0, index)];
    const prevItemsCount = getPrevItems(prevStages).length;
    const today = moment();

    const start = moment(start_at);
    const x = start.diff(today, 'days', false);
    const width = moment(deadline).diff(start, 'days', false);

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
