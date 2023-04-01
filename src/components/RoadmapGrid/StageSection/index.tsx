import moment from 'moment';
import React from 'react';
import {
    getScaledCellWidth,
    getStageX,
    getPrevVisibleItems,
    getStage,
    getDataOnStageEdit,
    increaseColorBrightness,
} from '../../../utils/funcs';
import { StageLine } from '../StageLine';
import { TaskItemLine } from '../TaskItemLine';
import { KonvaMouseEvent } from 'types/events';
import { StageSectionProps } from 'components/RoadmapGrid/StageSection/types';

export const StageSection: React.FC<StageSectionProps> = ({
    visibleStages,
    data,
    scale,
    stage,
    index,
    currentLine,
    color,
    select,
    onDeselect,
    selectedId,
    setIsTransforming,
    allSiblingStages,
    core,
}) => {
    const { tasks, start_at, stages, deadline, type } = stage;
    const prevStages = [...allSiblingStages.slice(0, index)];
    const prevItemsCount = getPrevVisibleItems(prevStages, visibleStages).length;
    const scaledCellWidth = getScaledCellWidth(scale);
    const start = moment(start_at);
    const x = getStageX(start, scale);
    const width = moment(deadline).diff(start, 'days', false);

    const onTransformStart = () => {
        setIsTransforming(true);
    };

    const onStageTransformEnd = (e: KonvaMouseEvent) => {
        const node = e.target;

        const {
            attrs: { id },
        } = node;

        const editingStage = getStage(data, id);
        if (!editingStage || editingStage.stages.length !== 0) {
            e.evt.preventDefault();
            node.scaleX(1);
            node.width(node.width());
            return;
        }

        const { start_at } = editingStage;

        const scaleX = node.scaleX();
        node.scaleX(1);

        const width = Math.round((node.width() * scaleX) / getScaledCellWidth(scale));
        const newDeadline = moment(start_at).add(width, 'days').format('YYYY-MM-DD');
        const newData = getDataOnStageEdit(data, { ...editingStage, deadline: newDeadline });

        node.width(width * getScaledCellWidth(scale));
        // setData(newData);
        setIsTransforming(false);
        select(null);
    };

    return (
        <>
            <StageLine
                scale={scale}
                data={data}
                // setData={setData}
                select={select}
                id={stage.id}
                line={currentLine + prevItemsCount}
                isSelected={selectedId === stage.id}
                length={width * scaledCellWidth}
                start_at={x * scaledCellWidth}
                type={type}
                color={color}
                onTransformStart={onTransformStart}
                onTransformEnd={onStageTransformEnd}
                onDeselect={onDeselect}
            />

            {visibleStages[stage.id] &&
                tasks &&
                tasks.map((task, taskIdx) => {
                    return (
                        <TaskItemLine
                            key={task.id}
                            scale={scale}
                            stageId={stage.id}
                            task={task}
                            line={currentLine + prevItemsCount + taskIdx + 1}
                            data={data}
                            // setData={setData}
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
                            // setData={setData}
                            select={select}
                            color={core ? increaseColorBrightness(color, 40) : color}
                            key={s.id}
                            allSiblingStages={stages}
                            index={idx}
                            stage={s}
                            currentLine={currentLine + (tasks?.length || 0) + prevItemsCount + idx + 1}
                            selectedId={selectedId}
                            onDeselect={onDeselect}
                            setIsTransforming={setIsTransforming}
                            core={false}
                        />
                    );
                })}
        </>
    );
};
