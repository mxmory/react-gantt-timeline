import React, { useState } from 'react';
import styles from './Sider.module.scss';
import cn from 'classnames';
import { ListStageItem } from './ListStageItem';

export const Sider = ({ data, setData, toggleStageCollapse, visibleStages, siderExpanded }) => {
    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    return (
        <div className={cn(styles.list, { [styles.open]: siderExpanded })}>
            <div>
                {data.map((stage, index) => {
                    return (
                        <ListStageItem
                            key={stage.id}
                            stage={stage}
                            index={index}
                            data={data}
                            setData={setData}
                            visibleStages={visibleStages}
                            toggleStageCollapse={toggleStageCollapse}
                        />
                    );
                })}
            </div>
        </div>
    );
};
