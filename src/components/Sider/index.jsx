import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import styles from './Sider.module.scss';
import cn from 'classnames';
import { ListStageItem } from './ListStageItem';

export const Sider = ({ data, setData, toggleStageCollapse, visibleStages, siderExpanded }) => {
    const onListStageDragEnd = (values) => {
        const { destination, source } = values;
        if (destination) {
            const newCommands = reorder([...data], source.index, destination.index);
            setData(newCommands);
        }
    };

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    };

    return (
        <div className={cn(styles.list, { [styles.open]: siderExpanded })}>
            <DragDropContext onDragEnd={onListStageDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef} className={styles.reagentsList}>
                            {data.map((stage, index) => {
                                return <ListStageItem key={stage.id} stage={stage} index={index} />;
                            })}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
        </div>
    );
};
