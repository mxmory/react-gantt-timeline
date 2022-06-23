import React, { useState } from 'react';
import styles from './StageItem.module.scss';
import cn from 'classnames';
import { ListTaskItem } from '../ListTaskItem';
import { ContextMenuToggleHorizontal } from '../../Icons/index';
import { StageContextMenu } from '../../Common/StageContextMenu';

export const ListStageItem = ({ stage, data, setData }) => {
    const [menuVisible, setMenuVisible] = useState(false);

    const showMenu = () => {
        setMenuVisible((prev) => !prev);
    };

    return (
        <div className={cn(styles.stageItem, { [styles.coreStage]: stage.type === 'core' })}>
            <div className={styles.name}>
                <div>{stage.name}</div>
                <div className={styles.funcs} title="Click to show actions" onClick={showMenu}>
                    <ContextMenuToggleHorizontal />
                </div>
                {menuVisible && (
                    <StageContextMenu stage={stage} data={data} setData={setData} setMenuVisible={setMenuVisible} />
                )}
            </div>
            {(stage.stages || stage.tasks) && (
                <div className={styles.body}>
                    {stage.tasks?.map((t) => (
                        <ListTaskItem key={t.id} task={t} />
                    ))}
                    {stage.stages?.map((s) => (
                        <ListStageItem key={s.id} stage={s} data={data} setData={setData} />
                    ))}
                </div>
            )}
        </div>
    );
};
