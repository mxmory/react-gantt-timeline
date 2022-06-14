import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import styles from './Stage.module.scss';

export const GanttStage = ({ stage, index }) => {
	return (
		<div>
			<Draggable key={'_test_' + stage.id} draggableId={stage.id + ''} index={index}>
				{(provided) => (
					<div
						ref={provided.innerRef}
						{...provided.draggableProps}
						{...provided.dragHandleProps}
						className={styles.item}
					>
						<div className={styles.stage}>
							<div className={styles.stageToggle}>v</div>
							{stage.name}
						</div>

						<div className={styles.subList}>
							{stage.tasks?.map((el) => (
								<div key={'task__' + el.id} className={styles.task}>
									{el.name}
								</div>
							))}
						</div>
					</div>
				)}
			</Draggable>
		</div>
	);
};
