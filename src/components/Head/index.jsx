import React from 'react';
import cn from 'classnames';
import styles from './Head.module.scss';
import { LocationIcon, ArrowDropIcon } from '../Icons';
import { HeadDatesScale } from './HeadDatesScale';

export const Head = ({ siderExpanded, setSiderExpanded, dataRange, moveToCurrentDate }, ref) => {
    const toggleSiderExpand = () => {
        setSiderExpanded((prev) => !prev);
    };

    return (
        <div className={styles.head}>
            <div className={cn(styles.headSider, { [styles.open]: siderExpanded })}>
                <div className={styles.headerSiderTop}>
                    <div
                        className={styles.headerSiderFunc}
                        onClick={moveToCurrentDate}
                        title="Click to move to current date"
                    >
                        <LocationIcon />
                    </div>
                </div>
                <div className={styles.headerSiderBottom}>
                    <div>Stages/tasks</div>

                    <div
                        className={styles.headerSiderFunc}
                        onClick={toggleSiderExpand}
                        title="Click to expand information"
                    >
                        <ArrowDropIcon />
                    </div>
                </div>
            </div>
            <div className={styles.timelineContainer}>
                <HeadDatesScale ref={ref} dataRange={dataRange} />
            </div>
        </div>
    );
};

export default React.forwardRef(Head);
