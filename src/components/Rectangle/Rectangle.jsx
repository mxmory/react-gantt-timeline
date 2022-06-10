import React, { useEffect } from 'react';
import { Text, Group, Rect, Transformer } from 'react-konva';
import { padding } from '../../constants';

export const Rectangle = ({
	x = 0,
	y = 0,
	width = 1,
	color = '#aaa',
	text = 'test',
	id = 0,
	percent = 0,
	isSelected = false,
	onSelect,
	onDeselect,
	onDragEnd,
	onTransformEnd,
	onTransformStart,
}) => {
	const shapeRef = React.useRef();
	const trRef = React.useRef();
	const progressRef = React.useRef();

	useEffect(() => {
		if (isSelected) {
			trRef.current.nodes([shapeRef.current]);
			trRef.current.getLayer().batchDraw();
		}
	}, [isSelected]);

	return (
		<Group
			onMouseOver={onSelect}
			onMouseLeave={onDeselect}
			id={id}
			x={x}
			y={y + 5}
			width={padding * width}
			height={padding}
			draggable={true}
			dragBoundFunc={(pos) => {
				return {
					x: pos.x,
					y: y + 5,
				};
			}}
			onDragEnd={onDragEnd}
		>
			<Rect
				id={id}
				ref={shapeRef}
				width={padding * width}
				height={padding - 10}
				fill={color}
				cornerRadius={5}
				strokeWidth={1}
				onTransformEnd={onTransformEnd}
				onTransformStart={onTransformStart}
			/>
			{!isSelected && (
				<Rect
					width={(padding * width * percent) / 100}
					height={padding - 10}
					fill="#aaa"
					opacity={0.2}
					cornerRadius={5}
					strokeWidth={1}
				/>
			)}

			<Text text={text} fontSize={12} fontStyle="italic" fill="#fff" padding={5} />
			{isSelected && (
				<Transformer
					ref={trRef}
					// boundBoxFunc={(oldBox, newBox) => {
					// 	if (newBox.width < 5 || newBox.height < 5) {
					// 		return oldBox;
					// 	}
					// 	return newBox;
					// }}
					rotateEnabled={false}
					flipEnabled={false}
					enabledAnchors={['middle-left', 'middle-right']}
					anchorCornerRadius={3}
					anchorStroke="#999"
					anchorStrokeWidth={0.5}
					anchorSize={15}
					padding={-15}
					borderEnabled={false}
				/>
			)}
		</Group>
	);
};
