import React from 'react';
import cn from 'classnames';
import styles from './TimelineGrid.module.scss';

const TimelineGrid = ({ siderExpanded }, mainGridRef) => {
    return <div className={cn(styles.wrapper, { [styles.withSiderOpen]: siderExpanded })}>TimelineGrid</div>;
};

export default React.forwardRef(TimelineGrid);
