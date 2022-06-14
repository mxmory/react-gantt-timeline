import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Line } from 'react-konva';
import styles from './App.module.scss';
import { range } from 'lodash';
import { width, height, padding, initialData } from './constants';
import { Sider } from './components/Sider/index';
import { StageItemLine } from './components/StageItemLine';
import { TaskItem } from './components/TaskItem';
import { getStageProps } from './utils/funcs';

const App = () => {
	const [data, setData] = useState(initialData.stages);
	const [selectedId, selectShape] = useState(null);
	const [isTransforming, setIsTransforming] = useState(false);

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

	const onGridTaskDragEnd = (e) => {
		const node = e.target;
		const {
			attrs: { x, id, stageId },
		} = node;

		const stageGroup = node.getLayer().children.find((el) => el.attrs.id === stageId);
		const [associatedStageNode] = stageGroup.children;

		const newData = data.map((el) => {
			if (el.id === stageId) {
				const newTasks = el.tasks.map((task) => {
					if (task.id === id) {
						if (task.start_at === Math.round(x / padding)) {
							node.to({ x: padding * task.start_at, duration: 0.2 });
						} else {
							node.to({ x: Math.round(x / padding) * padding, duration: 0.2 });
						}
						return { ...task, start_at: Math.round(x / padding) };
					}
					return task;
				});

				associatedStageNode.to({
					width: getStageProps(newTasks).width * padding,
					duration: 0.1,
				});

				stageGroup.to({
					x: getStageProps(newTasks).x,
					duration: 0.1,
				});

				return { ...el, tasks: [...newTasks] };
			}
			return el;
		});

		setTimeout(() => setData(newData), 200);
	};

	const onTransformStart = () => {
		setIsTransforming(true);
	};

	const onGridStageTransformEnd = () => {
		setIsTransforming(false);
		selectShape(null);
	};

	const onGridTaskTransformEnd = (e) => {
		const node = e.target;

		const {
			attrs: { id, stageId },
		} = node;

		const scaleX = node.scaleX();
		node.scaleX(1);
		const width = Math.round((node.width() * scaleX) / padding);

		const newData = data.map((el) => {
			if (el.id === stageId) {
				const newTasks = el.tasks.map((task) => {
					if (task.id === id) {
						if (width !== task.length) {
							node.width(padding * width);
							return { ...task, length: width };
						}
					}
					return task;
				});

				return { ...el, tasks: [...newTasks] };
			}
			return el;
		});
		setData(newData);
		setIsTransforming(false);
		selectShape(null);
	};

	const onDeselect = () => {
		if (!isTransforming) {
			selectShape(null);
		}
	};

	let line = -1;

	return (
		<div className={styles.main}>
			<h1>Gantt</h1>
			<div className={styles.flex}>
				<Sider data={data} setData={setData} />
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
								const { tasks } = stage;
								line++;

								return (
									<React.Fragment key={'__s_' + stage.id}>
										<StageItemLine
											select={selectShape}
											id={stage.id}
											tasks={tasks}
											line={line}
											isSelected={selectedId === stage.id}
											onDragEnd={onGridStageDragEnd}
											onDeselect={onDeselect}
										/>

										{tasks?.map((task) => {
											line++;
											return (
												<TaskItem
													key={'task_' + task.id}
													select={selectShape}
													task={task}
													line={line}
													stageId={stage.id}
													isSelected={selectedId === task.id}
													onDragEnd={onGridTaskDragEnd}
													onTransformEnd={onGridTaskTransformEnd}
													onTransformStart={onTransformStart}
													onDeselect={onDeselect}
												/>
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
