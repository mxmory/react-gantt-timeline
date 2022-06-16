import { minBy, maxBy } from 'lodash';
import { padding } from '../constants';

export const getStageProps = (stages, line = 0) => {
    const firstTaskInStage = minBy(stages, 'start_at');
    const lastTaskInStage = maxBy(stages, (stage) => stage.start_at + stage.length);
    const stageStartAt = firstTaskInStage.start_at;
    const stageLength = lastTaskInStage.start_at + lastTaskInStage.length;

    const percentSum = stages.reduce((acc, { percent }) => {
        return acc + percent;
    }, 0);

    const percent = (100 * percentSum) / (stages.length * 100);

    return { x: stageStartAt * padding, y: line * padding, width: stageLength - stageStartAt, percent };
};
