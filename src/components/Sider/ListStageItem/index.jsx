import React from 'react';
import styles from './StageItem.module.scss';
import cn from 'classnames';
import { ListTaskItem } from '../ListTaskItem';
import { ContextMenuToggleHorizontal } from '../../Icons/index';

export const ListStageItem = ({ stage }) => {
    const showStage = () => {
        const { name, start_at, deadline } = stage;
        alert(`Stage name: ${name}\nStarted at: ${start_at}\nDeadline: ${deadline}`);
    };

    return (
        <div className={cn(styles.stageItem, { [styles.coreStage]: stage.type === 'core' })}>
            <div className={styles.name} onClick={showStage}>
                <div>{stage.name}</div>
                <div className={styles.funcs} title="Click to show actions">
                    <ContextMenuToggleHorizontal />
                </div>
            </div>
            {(stage.stages || stage.tasks) && (
                <div className={styles.body}>
                    {stage.tasks?.map((t) => (
                        <ListTaskItem key={t.id} task={t} />
                    ))}
                    {stage.stages?.map((s) => (
                        <ListStageItem key={s.id} stage={s} />
                    ))}
                </div>
            )}
        </div>
    );
};
