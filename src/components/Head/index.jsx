import React, { useState } from 'react';
import cn from 'classnames';
import styles from './Head.module.scss';
import { LocationIcon, ArrowDropIcon, SettingsIcon } from '../Icons';
import { HeadDatesScale } from './HeadDatesScale';
import { DURATION_SCALES } from '../../constants';
import { DURATION_SCALE_VALUES } from '../../constants/index';

export const Head = (
    { scale, siderExpanded, toggleSidebar, dataRange, moveToDate, durationScale, setDurationScale },
    ref
) => {
    const [durationScaleMenuOpen, openDurationScaleMenu] = useState(false);

    return (
        <div className={styles.head}>
            <div className={cn(styles.headSider, { [styles.open]: siderExpanded })}>
                <div className={styles.headerSiderTop}>
                    {siderExpanded && (
                        <div
                            className={styles.settingsFunc}
                            onClick={() => openDurationScaleMenu((prev) => !prev)}
                            title="Click to set duration scale"
                        >
                            <SettingsIcon />
                            {durationScaleMenuOpen && (
                                <div className={styles.contextMenu}>
                                    {Object.keys(DURATION_SCALES).map((key) => {
                                        const scaleKey = DURATION_SCALES[key];

                                        const { TITLE } = DURATION_SCALE_VALUES[scaleKey];
                                        return (
                                            <div
                                                className={cn(styles.contextMenuItem, {
                                                    [styles.active]: durationScale === +key,
                                                })}
                                                key={key}
                                                onClick={() => setDurationScale(+key)}
                                            >
                                                {TITLE}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    )}

                    <div className={styles.commonFunc} onClick={moveToDate} title="Click to move to current date">
                        <LocationIcon />
                    </div>
                </div>
                <div className={styles.headerSiderBottom}>
                    <div className={styles.mainTitle}>Stages/tasks</div>
                    <div className={cn(styles.additionalTitles, { [styles.open]: siderExpanded })}>
                        <div className={styles.titleItem}>Start</div>
                        <div className={styles.titleItem}>End</div>
                        <div className={styles.titleItem}>Duration</div>
                    </div>

                    <div className={styles.commonFunc} onClick={toggleSidebar} title="Click to expand/collapse">
                        <ArrowDropIcon />
                    </div>
                </div>
            </div>
            <div className={styles.timelineContainer}>
                <HeadDatesScale ref={ref} dataRange={dataRange} scale={scale} />
            </div>
        </div>
    );
};

export default React.forwardRef(Head);
