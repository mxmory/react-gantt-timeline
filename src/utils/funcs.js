import { minBy, maxBy } from 'lodash';
import moment from 'moment';
import { padding } from '../constants';

export const getStageProps = (stages, line = 0) => {
    const today = moment();
    const getX = (start) => start.diff(today, 'days', false);
    const getLength = (deadline, start) => moment(deadline).diff(moment(start), 'days', false);

    const firstStageInCore = minBy(stages, 'start_at');
    const lastStageInCore = maxBy(stages, (stage) => moment(stage.deadline));
    const stageStartAt = moment(firstStageInCore.start_at);
    const stageLength = getLength(lastStageInCore.deadline, stageStartAt);

    // const percentSum = stages.reduce((acc, { percent }) => {
    //     return acc + percent;
    // }, 0);

    // const percent = (100 * percentSum) / (stages.length * 100);

    return { x: getX(stageStartAt), y: line * padding, width: stageLength };
};

export const getPrevStages = (stagesArr) => {
    const resArr = stagesArr.reduce((acc, { stages = [] }) => {
        const inner = getPrevStages(stages);
        return [...acc, ...stagesArr, ...stages, ...inner];
    }, []);
    return resArr;
};

export const getStage = (stages, id) => {
    let o;
    stages.some(function iter(a) {
        console.log(a.id, id);
        if (a.id === id) {
            o = a;
            return true;
        }
        return Array.isArray(a.stages) && a.stages.some(iter);
    });
    return o;
};
