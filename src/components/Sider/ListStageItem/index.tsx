import React, { useRef, useState } from 'react';
import styles from './StageItem.module.scss';
import cn from 'classnames';
import { ListTaskItem } from '../ListTaskItem';
import { ArrowDropIcon, ContextMenuToggleHorizontalIcon, EnterIcon, MilestoneIcon } from '../../Icons';
import { StageContextMenu } from '../../Common/StageContextMenu';
import { getParentStageProps, formatDuration } from '../../../utils/funcs';
import moment from 'moment';
import { DURATION_SCALE_VALUES } from '../../../constants';
import { ListStageItemProps } from 'components/Sider/ListStageItem/types';
import {
    onDragEnd,
    onDragStart,
    onDrop,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onNestedDrop,
    onNestedDragEnter,
    onNestedDragLeave,
} from './utils';

export const ListStageItem: React.FC<ListStageItemProps> = ({
    moveToDate,
    stage,
    data,
    // setData,
    toggleStageCollapse,
    visibleStages,
    scale,
    siderExpanded,
    durationScale,
}) => {
    const [menuVisible, setMenuVisible] = useState(false);
    const nestAreaRef = useRef<HTMLDivElement>(null);

    const showMenu = () => {
        setMenuVisible((prev) => !prev);
    };

    const { DIMENSION, TITLE } = DURATION_SCALE_VALUES[durationScale];

    const additionalInfoMap = {
        core: {
            start:
                stage &&
                stage.type === 'core' &&
                stage.stages &&
                stage.stages.length !== 0 &&
                getParentStageProps(stage.stages, scale)?.startAt?.format('YYYY-MM-DD'),
            end:
                stage &&
                stage.type === 'core' &&
                stage.stages &&
                stage.stages.length !== 0 &&
                getParentStageProps(stage.stages, scale)?.deadline?.format('YYYY-MM-DD'),
            duration:
                stage &&
                stage.type === 'core' &&
                stage.stages &&
                stage.stages.length !== 0 &&
                formatDuration(getParentStageProps(stage.stages, scale)?.duration, DIMENSION) + ' ' + TITLE,
        }, // REFACTOR TODO !!!!!!!!
        milestone: { start: stage.start_at, end: stage.deadline, duration: null },
        stage: {
            start: stage.start_at,
            end: stage.deadline,
            duration:
                formatDuration(moment.duration(moment(stage.deadline).diff(stage.start_at)), DIMENSION) + ' ' + TITLE,
        },
    };

    return (
        <div
            id={stage.id}
            className={cn(styles.stageItem, { [styles.coreStage]: stage.type === 'core' })}
            onDragStart={onDragStart}
        >
            <div
                data-dropzone-id={stage.id}
                className={styles.dropZone}
                onDrop={(e) => onDrop(e, nestAreaRef, data)}
                onDragOver={onDragOver}
                onDragEnter={(e) => onDragEnter(e, nestAreaRef, data)}
                onDragLeave={(e) => onDragLeave(e, nestAreaRef)}
            >
                {stage.type !== 'milestone' && (
                    <div
                        ref={nestAreaRef}
                        className={styles.nestDropZone}
                        data-nesting-id={stage.id}
                        id={`nest_control_${stage.id}`}
                        onDrop={(e) => onNestedDrop(e, nestAreaRef, data)}
                        onDragEnter={() => onNestedDragEnter(nestAreaRef)}
                        onDragLeave={() => onNestedDragLeave(nestAreaRef)}
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
                <div className={cn(styles.additionalInfo, { [styles.additionalInfoOpen]: siderExpanded })}>
                    <div className={styles.data}>{additionalInfoMap[stage.type].start}</div>
                    <div className={styles.data}>{additionalInfoMap[stage.type].end}</div>
                    <div className={styles.data}>{additionalInfoMap[stage.type].duration}</div>
                </div>

                <div className={styles.funcs} title="Click to show actions" onClick={showMenu}>
                    <ContextMenuToggleHorizontalIcon />
                </div>

                {menuVisible && (
                    <StageContextMenu
                        scale={scale}
                        stage={stage}
                        data={data}
                        // setData={setData}
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
                                <div
                                    id={s.id}
                                    key={s.id}
                                    onDragStart={onDragStart}
                                    onDragEnd={(e) => onDragEnd(e, nestAreaRef)}
                                    draggable
                                >
                                    <ListStageItem
                                        scale={scale}
                                        moveToDate={moveToDate}
                                        stage={s}
                                        data={data}
                                        // setData={setData}
                                        toggleStageCollapse={toggleStageCollapse}
                                        visibleStages={visibleStages}
                                        siderExpanded={siderExpanded}
                                        durationScale={durationScale}
                                    />
                                </div>
                            ))}
                    </div>
                )}
        </div>
    );
};
