import { minBy, maxBy } from 'lodash';
import moment from 'moment';
import { CELL_WIDTH } from '../constants';

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

    return { x: getX(stageStartAt), y: line * CELL_WIDTH, width: stageLength };
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

export const increaseColorBrightness = (hex, percent) => {
    // strip the leading # if it's there
    hex = hex.replace(/^\s*#|\s*$/g, '');

    // convert 3 char codes --> 6, e.g. `E0F` --> `EE00FF`
    if (hex.length == 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    var r = parseInt(hex.substr(0, 2), 16),
        g = parseInt(hex.substr(2, 2), 16),
        b = parseInt(hex.substr(4, 2), 16);

    return (
        '#' +
        (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).substr(1) +
        (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).substr(1) +
        (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substr(1)
    );
};
