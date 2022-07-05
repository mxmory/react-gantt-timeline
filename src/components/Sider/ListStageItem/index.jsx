import React, { useRef, useState } from 'react';
import styles from './StageItem.module.scss';
import cn from 'classnames';
import { ListTaskItem } from '../ListTaskItem';
import { ArrowDropIcon, ContextMenuToggleHorizontal, EnterIcon } from '../../Icons';
import { StageContextMenu } from '../../Common/StageContextMenu';
import {
    getDataOnStageAdd,
    getStage,
    getDataOnStageDelete,
    flatInnerStages,
    getDirectStageParent,
    getDataOnStageEdit,
} from '../../../utils/funcs';
import { MilestoneIcon } from '../../Icons/index';

export const ListStageItem = ({ moveToDate, stage, data, setData, toggleStageCollapse, visibleStages, scale }) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const nestAreaRef = useRef();
    const dropZoneRef = useRef();

    const showMenu = () => {
        setMenuVisible((prev) => !prev);
    };

    const onDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('dragging-stage-id', e.currentTarget.id);
    };

    const onDragEnd = (e) => {
        e.stopPropagation();

        if (nestAreaRef.current) {
            nestAreaRef.current.style.opacity = 0;
        }
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        e.currentTarget.style.borderTop = 'none';
        if (nestAreaRef.current) {
            nestAreaRef.current.style.opacity = 0;
            onNestedDragLeave();
        }

        const targetId = e.currentTarget.dataset.dropzoneId;
        const movingStageId = e.dataTransfer.getData('dragging-stage-id');
        const movingStage = getStage(data, movingStageId);
        const parentStage = getDirectStageParent(data, targetId);

        if (getStage(movingStage.stages, targetId)) {
            console.log('Can not apply parent stage to its child');
            return;
        }

        if (!parentStage) {
            console.log('Can not place stage here');
            return;
        }

        if (movingStageId !== targetId) {
            const stagesWithoutChanged = getDataOnStageDelete(data, movingStageId);
            const newParentStage = getDirectStageParent(stagesWithoutChanged, targetId);
            const targetStageIndex = parentStage.stages?.findIndex((s) => s.id === targetId);

            const newParentStageStages = [
                ...[...newParentStage.stages].slice(0, targetStageIndex),
                movingStage,
                ...[...newParentStage.stages].slice(targetStageIndex),
            ];

            const res = getDataOnStageEdit(getDataOnStageDelete(data, movingStageId), {
                ...newParentStage,
                stages: newParentStageStages,
            });
            setData(res);
        }
    };

    const onNestedDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();

        e.currentTarget.style.borderTop = 'none';
        if (nestAreaRef.current) {
            nestAreaRef.current.style.opacity = 0;
            onNestedDragLeave();
        }

        const movingStageId = e.dataTransfer.getData('dragging-stage-id');
        const targetStageId = e.currentTarget.dataset.nestingId;
        const movingStage = getStage(data, movingStageId);
        const targetStage = getStage(data, targetStageId);

        if (targetStageId === movingStageId || targetStage.stages?.find((el) => el.id === movingStageId)) {
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
        const newStages = getDataOnStageAdd(newStagesWithoutMoved, targetStageId, newMovedStage);
        setData(newStages);
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDragEnter = (e) => {
        e.preventDefault();
        const targetId = e.currentTarget?.dataset.dropzoneId;

        const targetItemParent = getDirectStageParent(data, targetId);

        if (targetItemParent) {
            e.currentTarget.style.borderTop = '1px dashed #999';
        }

        if (nestAreaRef.current) {
            nestAreaRef.current.style.opacity = 1;
        }
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (e.currentTarget.dataset.dropzoneId && e.target.dataset.dropzoneId) {
            e.currentTarget.style.borderTop = 'none';
        }
        if (!e.target?.dataset?.nestingId && !e.relatedTarget?.dataset?.nestingId && nestAreaRef.current) {
            nestAreaRef.current.style.opacity = 0;
            nestAreaRef.current.style.backgroundColor = '#fff';
            nestAreaRef.current.style.color = '#000';
        }
    };

    const onNestedDragEnter = () => {
        nestAreaRef.current.style.backgroundColor = '#000';
        nestAreaRef.current.style.color = '#fff';
    };

    const onNestedDragLeave = () => {
        nestAreaRef.current.style.backgroundColor = '#fff';
        nestAreaRef.current.style.color = '#000';
    };

    return (
        <div
            id={stage.id}
            className={cn(styles.stageItem, { [styles.coreStage]: stage.type === 'core' })}
            onDragStart={onDragStart}
            // onDrop={onDrop}
        >
            <div
                ref={dropZoneRef}
                data-dropzone-id={stage.id}
                className={styles.dropZone}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onDragEnter={onDragEnter}
                onDragLeave={onDragLeave}
            >
                {stage.type !== 'milestone' && (
                    <div
                        ref={nestAreaRef}
                        className={styles.nestDropZone}
                        data-nesting-id={stage.id}
                        id={`nest_control_${stage.id}`}
                        // onDragOver={onDragOver}
                        onDrop={onNestedDrop}
                        onDragEnter={onNestedDragEnter}
                        onDragLeave={onNestedDragLeave}
                    >
                        <EnterIcon />
                    </div>
                )}
            </div>

            <div className={styles.name}>
                <div className={styles.nameWrap}>
                    {stage.type !== 'milestone' &&
                        ((stage.stages && stage.stages.length !== 0) || (stage.tasks && stage.tasks.length !== 0)) && (
                            <div
                                className={cn(styles.toggleStageCollapse, {
                                    [styles.collapsed]: visibleStages[stage.id] === false,
                                })}
                                onClick={() => toggleStageCollapse(stage.id)}
                            >
                                <ArrowDropIcon />
                            </div>
                        )}

                    {stage.type === 'milestone' && (
                        <div className={styles.nameIcon}>
                            <MilestoneIcon />
                        </div>
                    )}
                    {stage.name}
                </div>
                <div className={styles.funcs} title="Click to show actions" onClick={showMenu}>
                    <ContextMenuToggleHorizontal />
                </div>
                {menuVisible && (
                    <StageContextMenu
                        scale={scale}
                        stage={stage}
                        data={data}
                        setData={setData}
                        setMenuVisible={setMenuVisible}
                        moveToDate={moveToDate}
                    />
                )}
            </div>
            {visibleStages[stage.id] === true &&
                ((stage.stages && stage.stages.length !== 0) || (stage.tasks && stage.tasks.length !== 0)) && (
                    <div className={styles.body}>
                        {stage.tasks &&
                            stage.tasks.length !== 0 &&
                            stage.tasks.map((t) => <ListTaskItem key={t.id} task={t} />)}
                        {stage.stages &&
                            stage.stages.length !== 0 &&
                            stage.stages.map((s) => (
                                <div id={s.id} key={s.id} onDragStart={onDragStart} onDragEnd={onDragEnd} draggable>
                                    <ListStageItem
                                        scale={scale}
                                        moveToDate={moveToDate}
                                        stage={s}
                                        data={data}
                                        setData={setData}
                                        toggleStageCollapse={toggleStageCollapse}
                                        visibleStages={visibleStages}
                                    />
                                </div>
                            ))}
                    </div>
                )}
        </div>
    );
};
