import { minBy, maxBy } from 'lodash';
import { padding } from '../constants';

export const getStageProps = (stages, line = 0) => {
    const firstStageInCore = minBy(stages, 'start_at');
    const lastStageInCore = maxBy(stages, (stage) => stage.start_at + stage.length);
    const stageStartAt = firstStageInCore.start_at;
    const stageLength = lastStageInCore.start_at + lastStageInCore.length;

    // const percentSum = stages.reduce((acc, { percent }) => {
    //     return acc + percent;
    // }, 0);

    // const percent = (100 * percentSum) / (stages.length * 100);

    return { x: stageStartAt * padding, y: line * padding, width: stageLength - stageStartAt };
};

export const getPrevStages = (stagesArr) => {
    const resArr = stagesArr.reduce((acc, { stages = [] }) => {
        const inner = getPrevStages(stages);
        return [...acc, ...stagesArr, ...stages, ...inner];
    }, []);
    return resArr;
};
