import React, { useEffect, useState } from 'react';
import styles from './StageItem.module.scss';
import cn from 'classnames';
import { ListTaskItem } from '../ListTaskItem';
import { ArrowDropIcon, ContextMenuToggleHorizontal } from '../../Icons';
import { StageContextMenu } from '../../Common/StageContextMenu';
import { getDataOnStageAdd, getStage, getDataOnStageDelete, flatInnerStages } from '../../../utils/funcs';

export const ListStageItem = ({ moveToDate, stage, data, setData, toggleStageCollapse, visibleStages, scale }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const showMenu = () => {
        setMenuVisible((prev) => !prev);
    };

    const onDragStart = (e) => {
        e.stopPropagation();
        e.dataTransfer.setData('dragging-stage-id', e.currentTarget.id);
    };

    const onDragEnd = (e) => {
        e.stopPropagation();
    };

    const onDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const movingStageId = e.dataTransfer.getData('dragging-stage-id');
        const targetStageId = e.currentTarget.id;
        const targetStage = getStage(data, targetStageId);

        if (
            targetStage.type !== 'milestone' &&
            targetStageId !== movingStageId &&
            !targetStage.stages?.find((el) => el.id === movingStageId)
        ) {
            const newMovedStage = getStage(data, movingStageId);
            const newStagesWithoutMoved = getDataOnStageDelete(data, movingStageId);
            const newStages = getDataOnStageAdd(newStagesWithoutMoved, targetStageId, newMovedStage);
            setData(newStages);
        } else {
            console.log('Action is not possible');
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const onDragEnter = (e) => {
        e.stopPropagation();
        e.preventDefault();

        // e.currentTarget.style.borderTop = '1px solid red';
        // console.log('Enter', e.currentTarget);
    };

    const onDragLeave = (e) => {
        e.preventDefault();
        // e.stopPropagation();
        // console.log(e.currentTarget);
        e.currentTarget.style.borderTop = 'none';
        // console.log('Leave', e.relatedTarget);
    };

    return (
        <div
            id={stage.id}
            className={cn(styles.stageItem, { [styles.coreStage]: stage.type === 'core' })}
            onDrop={onDrop}
            onDragOver={onDragOver}
            onDragEnter={onDragEnter}
            onDragLeave={onDragLeave}
        >
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
