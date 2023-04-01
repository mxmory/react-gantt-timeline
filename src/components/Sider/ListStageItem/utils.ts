import {
    getDataOnStageDelete,
    getDirectStageParent,
    getStage,
    getDataOnStageAdd,
    getDataOnStageEdit,
} from '../../../utils/funcs';
import { RoadmapStage } from '../../../types/roadmap';
import { Dispatch, SetStateAction } from 'react';

export const onDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.stopPropagation();
    e.dataTransfer.setData('dragging-stage-id', e.currentTarget.id);
};

export const onDragEnd = (e: React.DragEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    e.stopPropagation();

    if (ref.current) {
        ref.current.style.opacity = '0';
    }
};

export const onDrop = (
    e: React.DragEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement>,
    data: RoadmapStage[]
    // setData: Dispatch<SetStateAction<RoadmapStage[]>>
) => {
    e.preventDefault();
    e.stopPropagation();

    e.currentTarget.style.borderTop = 'none';
    if (ref.current) {
        ref.current.style.opacity = '0';
        onNestedDragLeave(ref);
    }

    const targetId = e.currentTarget.dataset.dropzoneId;
    const movingStageId = e.dataTransfer.getData('dragging-stage-id');
    const movingStage = getStage(data, movingStageId);
    const parentStage = getDirectStageParent(data, targetId);

    if (getStage(movingStage?.stages, targetId)) {
        console.log('Can not apply parent stage to its child'); // apply toast here
        return;
    }

    if (!parentStage) {
        console.log('Can not place stage here'); // apply toast here
        return;
    }

    if (movingStage && movingStageId !== targetId) {
        const stagesWithoutChanged = getDataOnStageDelete(data, movingStageId);
        const newParentStage = getDirectStageParent(stagesWithoutChanged, targetId);
        const targetStageIndex = parentStage.stages?.findIndex((s) => s.id === targetId);

        if (newParentStage?.stages) {
            const newParentStageStages = [
                ...[...newParentStage.stages].slice(0, targetStageIndex),
                movingStage,
                ...[...newParentStage.stages].slice(targetStageIndex),
            ];

            const res = getDataOnStageEdit(getDataOnStageDelete(data, movingStageId), {
                ...newParentStage,
                stages: newParentStageStages,
            });
            // setData(res);
        }
    }
};

export const onNestedDrop = (
    e: React.DragEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement>,
    data: RoadmapStage[]
    // setData: Dispatch<SetStateAction<RoadmapStage[]>>
) => {
    e.preventDefault();
    e.stopPropagation();

    e.currentTarget.style.borderTop = 'none';
    if (ref.current) {
        ref.current.style.opacity = '0';
        onNestedDragLeave(ref);
    }

    const movingStageId = e.dataTransfer.getData('dragging-stage-id');
    const targetStageId = e.currentTarget.dataset.nestingId;
    const movingStage = getStage(data, movingStageId);
    const targetStage = getStage(data, targetStageId);

    if (
        !movingStage ||
        !targetStage ||
        targetStageId === movingStageId ||
        targetStage.stages?.find((el) => el.id === movingStageId)
    ) {
        return;
    }
    if (targetStage.type === 'milestone') {
        console.log('Can not apply stage to the milestone');
        return;
    }

    if (getStage(movingStage.stages, targetStageId)) {
        console.log('Can not apply parent stage to its child');
        return;
    }

    const newMovedStage = getStage(data, movingStageId);
    const newStagesWithoutMoved = getDataOnStageDelete(data, movingStageId);

    if (newMovedStage) {
        const newStages = getDataOnStageAdd(newStagesWithoutMoved, targetStageId, newMovedStage);
        // setData(newStages);
    }
};

export const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
};

export const onDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    ref: React.RefObject<HTMLDivElement>,
    data: RoadmapStage[]
) => {
    e.preventDefault();
    const targetId = e.currentTarget?.dataset.dropzoneId;

    const targetItemParent = getDirectStageParent(data, targetId);

    if (targetItemParent) {
        e.currentTarget.style.borderTop = '1px dashed #999';
    }

    if (ref.current) {
        ref.current.style.opacity = '1';
    }
};

export const onDragLeave = (e: React.DragEvent<HTMLDivElement>, ref: React.RefObject<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.target instanceof HTMLDivElement && e.relatedTarget instanceof HTMLDivElement) {
        if (e.currentTarget.dataset.dropzoneId && e.target.dataset.dropzoneId) {
            e.currentTarget.style.borderTop = 'none';
        }
        if (!e.target?.dataset?.nestingId && !e.relatedTarget?.dataset?.nestingId && ref.current) {
            ref.current.style.opacity = '0';
            ref.current.style.backgroundColor = '#fff';
            ref.current.style.color = '#000';
        }
    }
};

export const onNestedDragEnter = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
        ref.current.style.backgroundColor = '#000';
        ref.current.style.color = '#fff';
    }
};

export const onNestedDragLeave = (ref: React.RefObject<HTMLDivElement>) => {
    if (ref.current) {
        ref.current.style.backgroundColor = '#fff';
        ref.current.style.color = '#000';
    }
};
