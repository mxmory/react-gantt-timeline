import moment from 'moment';
import React from 'react';
import { getScaledCellWidth, getStageX, getPrevVisibleItems } from '../../../utils/funcs';
import { StageItemLine } from '../StageItemLine/';
import { TaskItemLine } from '../TaskItemLine';

export const StageSection = ({
    visibleStages,
    data,
    setData,
    scale,
    stage,
    allStages,
    index,
    currentLine,
    color,
    select,
    onDeselect,
    selectedId,
    onTransformStart,
    onTransformEnd,
}) => {
    const { tasks, start_at, stages, deadline, type } = stage;
    const prevStages = [...allStages.slice(0, index)];
    const prevItemsCount = getPrevVisibleItems(prevStages, visibleStages).length;
    const scaledCellWidth = getScaledCellWidth(scale);
    const start = moment(start_at);
    const x = getStageX(start, scale);
    const width = moment(deadline).diff(start, 'days', false);

    return (
        <>
            <StageItemLine
                scale={scale}
                data={data}
                setData={setData}
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
                onTransformStart={onTransformStart}
                onTransformEnd={onTransformEnd}
                onDeselect={onDeselect}
            />

            {visibleStages[stage.id] &&
                tasks &&
                tasks.map((task, taskIdx) => {
                    return (
                        <TaskItemLine
                            scale={scale}
                            key={task.id}
                            task={task}
                            line={currentLine + prevItemsCount + taskIdx + 1}
                            data={data}
                            setData={setData}
                        />
                    );
                })}

            {visibleStages[stage.id] &&
                stages &&
                stages.map((s, idx) => {
                    return (
                        <StageSection
                            visibleStages={visibleStages}
                            scale={scale}
                            data={data}
                            setData={setData}
                            select={select}
                            color={color}
                            key={s.id}
                            allStages={stages}
                            index={idx}
                            stage={s}
                            currentLine={currentLine + (tasks?.length || 0) + prevItemsCount + idx + 1}
                            selectedId={selectedId}
                            onTransformStart={onTransformStart}
                            onTransformEnd={onTransformEnd}
                            onDeselect={onDeselect}
                        />
                    );
                })}
        </>
    );
};
