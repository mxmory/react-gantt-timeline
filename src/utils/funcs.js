import { minBy, maxBy } from 'lodash';
import { padding } from '../constants';

export const getStageProps = (tasks, line = 0) => {
	const firstTaskInStage = minBy(tasks, 'start_at');
	const lastTaskInStage = maxBy(tasks, (task) => task.start_at + task.length);
	const stageStartAt = firstTaskInStage.start_at;
	const stageLength = lastTaskInStage.start_at + lastTaskInStage.length;

	// console.log(tasks.reduce((acc, curr) => acc.percent + curr.percent));

	const sum = tasks.reduce((acc, curr) => {
		return acc + curr.percent;
	}, 0);

	console.log(sum);

	const percent =
		(100 *
			tasks.reduce((acc, curr) => {
				console.log(acc.percent, curr.percent);
				return acc.percent + curr.percent;
			}, 0)) /
		(tasks.length * 100);

	return { x: stageStartAt * padding, y: line * padding, width: stageLength - stageStartAt, percent };
};
