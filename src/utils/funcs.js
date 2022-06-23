import { minBy, maxBy, range } from 'lodash';
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
    stages.some(function iter(s) {
        if (s.id === id) {
            o = s;
            return true;
        }
        return Array.isArray(s.stages) && s.stages.some(iter);
    });
    return o;
};

export const getDataOnStageEdit = (stages, changedStage) => {
    return stages.map(function iter(s) {
        if (s.id === changedStage.id) {
            return changedStage;
        }
        if (s.stages) {
            const newStages = s.stages.map(iter);
            return { ...s, stages: newStages };
        }
        return s;
    });
};

export const getDataOnStageAdd = (stages, parentStageId, newStage) => {
    return stages.map(function iter(s) {
        if (s.id === parentStageId) {
            return { ...s, stages: [...(s.stages || []), newStage] };
        }
        if (s.stages) {
            const newStages = s.stages.map(iter);
            return { ...s, stages: newStages };
        }
        return s;
    });
};

export const getPrevItems = (stagesArr) => {
    const resArr = stagesArr.reduce((acc, { stages = [], tasks = [] }) => {
        const all = [...tasks, ...stages];
        const inner = getPrevItems(stages);

        return [...acc, ...all, ...inner];
    }, []);
    return resArr;
};

export const getMonthsInRange = (dataRange) => {
    const today = moment();

    return range(dataRange[0] * CELL_WIDTH, dataRange[1] * CELL_WIDTH, CELL_WIDTH).map((n) => {
        const day = moment(today).add(n / CELL_WIDTH, 'days');

        const startDate = moment(day).startOf('month');
        const endDate = moment(day).endOf('month');

        const xStart = moment(startDate).diff(moment(today), 'days', false);
        const xEnd = moment(endDate).diff(moment(today), 'days', false);

        return { date: startDate, start: xStart + (xStart > 0 + 1), end: xEnd + (xEnd > 0 && 1) }; // Check why if > 0 need to add + 1
    }, []);
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

export const clipRect = (ctx, x, y, width, height, radius) => {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
};
