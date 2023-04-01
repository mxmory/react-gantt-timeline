import React from 'react';
import styles from './Sider.module.scss';
import cn from 'classnames';
import { ListStageItem } from './ListStageItem';
import { RoadmapSiderProps } from './types';

export const Sider: React.FC<RoadmapSiderProps> = ({
    moveToDate,
    data,
    // setData,
    toggleStageCollapse,
    visibleStages,
    siderExpanded,
    scale,
    durationScale,
}) => {
    return (
        <div className={cn(styles.list, { [styles.open]: siderExpanded })}>
            <div>
                {data.map((stage) => {
                    return (
                        <ListStageItem
                            scale={scale}
                            moveToDate={moveToDate}
                            key={stage.id}
                            stage={stage}
                            data={data}
                            // setData={setData}
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
