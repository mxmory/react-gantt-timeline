import React, { useState } from 'react';
import styles from './Sider.module.scss';
import cn from 'classnames';
import { ListStageItem } from './ListStageItem';

export const Sider = ({
    moveToDate,
    data,
    setData,
    toggleStageCollapse,
    visibleStages,
    siderExpanded,
    scale,
    durationScale,
}) => {
    return (
        <div className={cn(styles.list, { [styles.open]: siderExpanded })}>
            <div>
                {data.map((stage, index) => {
                    return (
                        <ListStageItem
                            scale={scale}
                            moveToDate={moveToDate}
                            key={stage.id}
                            stage={stage}
                            index={index}
                            data={data}
                            setData={setData}
                            visibleStages={visibleStages}
                            siderExpanded={siderExpanded}
                            toggleStageCollapse={toggleStageCollapse}
                            durationScale={durationScale}
                        />
                    );
                })}
            </div>
        </div>
    );
};
