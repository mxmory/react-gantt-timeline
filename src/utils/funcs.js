import { minBy, maxBy } from 'lodash';
import { padding } from '../constants';

export const getStageProps = (tasks, line = 0) => {
    const firstTaskInStage = minBy(tasks, 'start_at');
    const lastTaskInStage = maxBy(tasks, (task) => task.start_at + task.length);
    const stageStartAt = firstTaskInStage.start_at;
    const stageLength = lastTaskInStage.start_at + lastTaskInStage.length;

    const percentSum = tasks.reduce((acc, { percent }) => {
        return acc + percent;
    }, 0);

    const percent = (100 * percentSum) / (tasks.length * 100);

    return { x: stageStartAt * padding, y: line * padding, width: stageLength - stageStartAt, percent };
};
