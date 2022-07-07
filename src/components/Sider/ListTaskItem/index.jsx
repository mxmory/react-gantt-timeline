import React from 'react';
import { ContextMenuToggleHorizontalIcon } from '../../Icons';
import styles from './ListTaskItem.module.scss';

export const ListTaskItem = ({ task }) => {
    const { id } = task;
    return (
        <div className={styles.task}>
            <div>{id}</div>
            <div className={styles.funcs} title="Click to show actions">
                <ContextMenuToggleHorizontalIcon />
            </div>
        </div>
    );
};
