import React, { useEffect, useState } from 'react';
import { Stage, Layer, Star, Text, Group, Rect, Line } from 'react-konva';
import styles from './App.module.scss';
import cn from 'classnames';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { maxBy, minBy, range } from 'lodash';
import { Rectangle } from './components/Rectangle/Rectangle';
import { width, height, padding } from './constants';

const initialData = {
	stages: [
		{
			id: 0,
			name: 'Stage #1',
			color: '#999',
			length: 10,
			start_at: 3,
			percent: 30,
			tasks: [
				{
					id: 11,
					name: 'Task #11',
					start_at: 3,
					length: 3,
					color: '#A9E5BB',
				},
				{
					id: 12,
					name: 'Task #12',
					start_at: 6,
					length: 3,
					color: '#F72C25',
				},
			],
		},
		{
			id: 1,
			name: 'Stage #2',
			color: '#999',
			length: 6,
			start_at: 5,
			percent: 50,
			tasks: [
				{
					id: 21,
					name: 'Task #21',
					start_at: 7,
					length: 3,
					color: '#A76D60',
				},
				{
					id: 22,
					name: 'Task #22',
					start_at: 9,
					length: 12,
					color: '#601700',
				},
			],
		},
		{
			id: 2,
			name: 'Stage #3',
			color: '#999',
			length: 7,
			start_at: 6,
			percent: 60,
			tasks: [
				{
					id: 31,
					name: 'Task #31',
					start_at: 10,
					length: 5,
					color: '#96CDFF',
				},
				{
					id: 32,
					name: 'Task #32',
					start_at: 15,
					length: 3,
					color: '#DBBADD',
				},
				{
					id: 33,
					name: 'Task #33',
					start_at: 20,
					length: 6,
					color: '#BE92A2',
				},
			],
		},
		{
			id: 3,
			name: 'Stage #4',
			color: '#999',
			length: 9,
			start_at: 9,
			percent: 90,
			tasks: [
				{
					id: 41,
					name: 'Task #41',
					start_at: 21,
					length: 3,
					color: '#88B7B5',
				},
				{
					id: 42,
					name: 'Task #42',
					start_at: 25,
					length: 6,
					color: '#449DD1',
				},
			],
		},
	],
};

const App = () => {
	const [listOpen, setListOpen] = useState(false);
	const [data, setData] = useState(initialData.stages);
	const [selectedId, selectShape] = useState(null);
	const [isTransforming, setIsTransforming] = useState(false);

	const toggleList = () => {
		setListOpen((prev) => !prev);
	};

	const reorder = (list, startIndex, endIndex) => {
		const result = Array.from(list);
		const [removed] = result.splice(startIndex, 1);
		result.splice(endIndex, 0, removed);

		return result;
	};

	const onListStageDragEnd = (values) => {
		const { destination, source } = values;
		if (destination) {
			const newCommands = reorder([...data], source.index, destination.index);
			setData(newCommands);
		}
	};

	const onGridStageDragEnd = (e) => {
		const {
			attrs: { x, id },
		} = e.target;

		const newData = data.map((el) => {
			if (el.id === id) {
				return { ...el, start_at: Math.round(x / padding) };
			}
			return el;
		});

		setData(newData);
	};

	const onGridStageTransformStart = () => {
		setIsTransforming(true);
	};

	const onGridStageTransformEnd = (e) => {
		setIsTransforming(false);
		selectShape(null);
	};

	const onDeselect = (e) => {
		if (!isTransforming) {
			selectShape(null);
		}
	};

	let line = -1;

	return (
		<div className={styles.main}>
			<h1>Gantt</h1>
			<div className={styles.flex}>
				<div className={cn(styles.list, { [styles.open]: listOpen })}>
					<div className={styles.toggle} onClick={toggleList}>
						{listOpen ? '<' : '>'}
					</div>
					<DragDropContext onDragEnd={onListStageDragEnd}>
						<Droppable droppableId="droppable">
							{(provided) => (
								<div
									{...provided.droppableProps}
									ref={provided.innerRef}
									className={styles.reagentsList}
								>
									{data.map((stage, index) => {
										return (
											<Draggable
												key={'_test_' + stage.id}
												draggableId={stage.id + ''}
												index={index}
											>
												{(provided) => (
													<div
														key={stage.id}
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
														className={styles.item}
													>
														<div className={styles.stage}>{stage.name}</div>

														<div className={styles.subList}>
															{stage.tasks?.map((el) => (
																<div key={'tasK__' + el.id} className={styles.task}>
																	{el.name}
																</div>
															))}
														</div>
													</div>
												)}
											</Draggable>
										);
									})}
								</div>
							)}
						</Droppable>
					</DragDropContext>
				</div>
				<div className={styles.grid}>
					<Stage width={width} height={height} onMouseUp={onDeselect}>
						<Layer>
							{range(Math.round(width / padding)).map((n) => (
								<Line
									key={'_vert_line_' + n}
									points={[Math.round(n * padding) + 0.5, 0, Math.round(n * padding) + 0.5, height]}
									stroke="#aaa"
									strokeWidth={0.5}
								/>
							))}

							{range(Math.round(height / padding)).map((n) => (
								<Line
									key={'_horz_line_' + n}
									points={[
										0,
										Math.round((n + 1) * padding) - 0.5,
										width,
										Math.round((n + 1) * padding) - 0.5,
									]}
									stroke="#aaa"
									strokeWidth={0.5}
								/>
							))}

							{data.map((stage) => {
								const { start_at, color, name, length, percent, tasks } = stage;
								line++;

								const firstTaskInStage = minBy(tasks, 'start_at');
								const lastTaskInStage = maxBy(tasks, (task) => task.start_at + task.length);
								const stageStartAt = firstTaskInStage.start_at;
								const stageLength = lastTaskInStage.start_at + lastTaskInStage.length;

								return (
									<React.Fragment key={'__s_' + stage.id}>
										<Rectangle
											onSelect={() => {
												selectShape(stage.id);
											}}
											onDeselect={onDeselect}
											onDragEnd={onGridStageDragEnd}
											onTransformEnd={onGridStageTransformEnd}
											onTransformStart={onGridStageTransformStart}
											isSelected={selectedId === stage.id}
											id={stage.id}
											x={padding * stageStartAt}
											y={padding * line}
											width={stageLength - stageStartAt}
											color={color}
											text={name}
											percent={percent}
										/>
										{tasks?.map((task) => {
											line++;
											return (
												<React.Fragment key={'_task_' + task.id}>
													<Rectangle
														onSelect={() => {
															selectShape(task.id);
														}}
														onDeselect={onDeselect}
														onDragEnd={onGridStageDragEnd}
														onTransformEnd={onGridStageTransformEnd}
														onTransformStart={onGridStageTransformStart}
														isSelected={selectedId === task.id}
														id={task.id}
														x={padding * task.start_at}
														y={padding * line}
														width={task.length}
														color={task.color}
														text={task.name}
														// percent={percent}
													/>
												</React.Fragment>
											);
										})}
									</React.Fragment>
								);
							})}
						</Layer>
					</Stage>
				</div>
			</div>
		</div>
	);
};

export default App;
