import React, { useState } from 'react';
import { Stage, Layer, Star, Text, Group, Rect, Line } from 'react-konva';
import styles from './App.module.scss';
import cn from 'classnames';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';

const initialData = {
	stages: [
		{
			id: 0,
			name: 'Stage #1',
			color: '#7A5C58',
			length: 4,
			start_at: 3,
		},
		{
			id: 1,
			name: 'Stage #2',
			color: '#8d80ad',
			length: 6,
			start_at: 5,
		},
		{
			id: 2,
			name: 'Stage #3',
			color: '#99B2DD',
			length: 2,
			start_at: 6,
		},
		{
			id: 3,
			name: 'Stage #4',
			color: '#9DFFF9',
			length: 9,
			start_at: 7,
		},
	],
};

const width = 4000;
const height = 3000;
const padding = 30;

const App = () => {
	const [listOpen, setListOpen] = useState(false);
	const [data, setData] = useState(initialData.stages);

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
		const newCommands = reorder([...data], source.index, destination.index);
		setData(newCommands);
	};

	const onGridStageDragEnd = (...args) => {
		console.log(args);
	};

	const Rectangle = ({ x = 0, y = 0, width = 1, color = '#aaa', text = 'test' }) => {
		return (
			<Group
				x={x}
				y={y}
				width={padding * width}
				height={padding}
				draggable={true}
				dragBoundFunc={(pos) => {
					return {
						x: pos.x,
						y: y,
					};
				}}
				onDragEnd={onGridStageDragEnd}
			>
				<Rect width={padding * width} height={padding} fill={color} cornerRadius={5} strokeWidth={1} />
				<Text text={text} fontSize={14} fontStyle="italic" fill="#222" padding={9} />
			</Group>
		);
	};

	return (
		<div className={styles.flex}>
			<div className={cn(styles.list, { [styles.open]: listOpen })}>
				<div className={styles.toggle} onClick={toggleList}>
					{listOpen ? '<' : '>'}
				</div>
				<DragDropContext onDragEnd={onListStageDragEnd}>
					<Droppable droppableId="droppable">
						{(provided) => (
							<div {...provided.droppableProps} ref={provided.innerRef} className={styles.reagentsList}>
								{data.map((stage, index) => {
									return (
										<Draggable key={'_test_' + stage.id} draggableId={stage.id + ''} index={index}>
											{(provided) => (
												<div
													key={stage.id}
													ref={provided.innerRef}
													{...provided.draggableProps}
													{...provided.dragHandleProps}
													className={styles.item}
												>
													<div className={styles.name}>{stage.name}</div>
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
				<Stage width={width} height={height}>
					{/* [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height] */}

					<Layer>
						<Line
							points={[Math.round(2 * padding) + 0.5, 0, Math.round(2 * padding) + 0.5, height]}
							stroke="#aaa"
							strokeWidth={0.5}
						/>
						<Line
							points={[Math.round(4 * padding) + 0.5, 0, Math.round(4 * padding) + 0.5, height]}
							stroke="#aaa"
							strokeWidth={0.5}
						/>
						{data.map((stage, index) => {
							const { start_at, color, name, length } = stage;
							return (
								<React.Fragment key={'__s_' + stage.id}>
									<Line
										points={[
											0,
											Math.round((index + 1) * padding) - 0.5,
											width,
											Math.round((index + 1) * padding) - 0.5,
										]}
										stroke="#aaa"
										strokeWidth={0.5}
									/>
									<Rectangle
										x={padding * start_at}
										y={padding * index}
										width={length}
										color={color}
										text={name}
									/>
								</React.Fragment>
							);
						})}
					</Layer>
				</Stage>
			</div>
		</div>
	);
};

export default App;

// const shadowRectangle = new Konva.Rect({
// 	x: 0,
// 	y: 0,
// 	width: blockSnapSize,
// 	height: blockSnapSize,
// 	fill: '#aaa',
// 	opacity: 0.3,
// 	stroke: '#ddd',
// 	strokeWidth: 3,
// 	dash: [20, 2],
// });

// function newRectangle(x, y, layer, stage, width, color, text) {
// 	var rectangleGroup = new Konva.Group({
// 		x: x,
// 		y: y,
// 		width: blockSnapSize * width,
// 		height: blockSnapSize,
// 		draggable: true,
// 		dragBoundFunc: (pos) => {
// 			return {
// 				x: pos.x,
// 				y: y,
// 			};
// 		},
// 	});

// 	let rectangle = new Konva.Rect({
// 		width: blockSnapSize * width,
// 		height: blockSnapSize,
// 		fill: color,
// 		stroke: '#ddd',
// 		cornerRadius: 5,
// 		strokeWidth: 1,
// 	});

// 	let progressRectangle = new Konva.Rect({
// 		width: blockSnapSize * width - 100,
// 		height: blockSnapSize,
// 		fill: '#444',
// 		opacity: 0.3,
// 		cornerRadius: 5,
// 		strokeWidth: 1,
// 	});

// 	rectangleGroup.on('dragstart', (e) => {
// 		shadowRectangle.show();
// 		shadowRectangle.moveToTop();
// 		rectangleGroup.moveToTop();
// 	});
// 	rectangleGroup.on('dragend', (e) => {
// 		rectangleGroup.position({
// 			x: Math.round(rectangleGroup.x() / blockSnapSize) * blockSnapSize,
// 			y: Math.round(rectangleGroup.y() / blockSnapSize) * blockSnapSize,
// 		});
// 		stage.batchDraw();
// 		shadowRectangle.hide();
// 	});
// 	rectangleGroup.on('dragmove', (e) => {
// 		shadowRectangle.position({
// 			x: Math.round(rectangleGroup.x() / blockSnapSize) * blockSnapSize,
// 			y: Math.round(rectangleGroup.y() / blockSnapSize) * blockSnapSize,
// 		});
// 		stage.batchDraw();
// 	});
// 	rectangleGroup.add(rectangle);
// 	rectangleGroup.add(progressRectangle);
// 	rectangleGroup.add(
// 		new Konva.Text({
// 			text: text,
// 			fontSize: 14,
// 			fontStyle: 'italic',
// 			// fontFamily: 'sans-serif',
// 			fill: '#fff',
// 			// width: blockSnapSize * width,
// 			// height: 30,
// 			// lineHeight: blockSnapSize,
// 			padding: 9,
// 			align: 'center',
// 			verticalAlign: 'middle',
// 		})
// 	);
// 	layer.add(rectangleGroup);
// }

// var stage = new Konva.Stage({
// 	container: 'container',
// 	width: width,
// 	height: height,
// });

// var gridLayer = new Konva.Layer();
// var padding = blockSnapSize;
// console.log(width, padding, width / padding);
// for (var i = 0; i < width / padding; i++) {
// 	const isHoliday = i % 7 === 0;
// 	gridLayer.add(
// 		new Konva.Line({
// 			points: [Math.round(i * padding) + 0.5, 0, Math.round(i * padding) + 0.5, height],
// 			stroke: '#ddd',
// 			strokeWidth: 1,
// 		})
// 	);
// 	if (isHoliday) {
// 		gridLayer.add(
// 			new Konva.Rect({
// 				x: blockSnapSize * i,
// 				y: 0,
// 				width: blockSnapSize * 2,
// 				height: height,
// 				fill: '#ddd',
// 				opacity: 0.2,
// 				stroke: '#ddd',
// 				strokeWidth: 1,
// 				dash: [20, 2],
// 			})
// 		);
// 	}
// }

// var layer = new Konva.Layer();
// shadowRectangle.hide();
// layer.add(shadowRectangle);
// newRectangle(blockSnapSize * 3, blockSnapSize * 3, layer, stage, 6, '#6a99f7', '#1');
// newRectangle(blockSnapSize * 10, blockSnapSize * 7, layer, stage, 15, '#96de81', '#2');

// stage.add(gridLayer);
// stage.add(layer);
