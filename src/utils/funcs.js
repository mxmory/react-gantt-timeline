import { minBy, maxBy, range, round } from 'lodash';
import moment from 'moment';
import { APPROX_DAYS_SCALE_COUNT, SCALING_VALUES, SCALE_MOMENT_DIMENSIONS } from '../constants';

export const getScaledCellWidth = (scale) => {
    const { CELL_WIDTH } = SCALING_VALUES[scale];
    const daysCount = APPROX_DAYS_SCALE_COUNT[scale];
    return CELL_WIDTH / daysCount;
};

export const getStageX = (start, scale) =>
    start.diff(moment().startOf(SCALE_MOMENT_DIMENSIONS[scale].SCALE_VALUE), 'days', false);

const getStageLength = (deadline, start) => moment(deadline).diff(moment(start), 'days', false);

export const getStageProps = (stage, scale) => {
    const { start_at, deadline } = stage;
    return { x: getStageX(moment(start_at), scale), width: getStageLength(moment(deadline), moment(start_at)) };
};

export const getParentStageProps = (stages, scale) => {
    if (stages && stages.length === 0) return { x: null, width: 0 };
    const flatStages = flatInnerStages(stages);
    const firstStageInCore = minBy(flatStages, (stage) => moment(stage.start_at));
    const lastStageInCore = maxBy(flatStages, (stage) => moment(stage.deadline));

    const stageStartAt = moment(firstStageInCore.start_at);
    const stageDeadline = moment(lastStageInCore.deadline);
    const stageLength = getStageLength(lastStageInCore.deadline, stageStartAt);
    const duration = moment.duration(stageDeadline.diff(stageStartAt));

    // const percentSum = stages.reduce((acc, { percent }) => {
    //     return acc + percent;
    // }, 0);

    // const percent = (100 * percentSum) / (stages.length * 100);

    return {
        x: getStageX(stageStartAt, scale),
        width: stageLength,
        startAt: stageStartAt,
        deadline: stageDeadline,
        duration: duration,
    };
};

export const flatInnerStages = (stagesArr) => {
    const resArr = stagesArr.reduce((acc, stage) => {
        const { stages } = stage;
        if (stages) {
            const inner = flatInnerStages(stages);
            return [...acc, stage, ...inner];
        }
        return [...acc, stage];
    }, []);
    return resArr;
};

export const getStage = (stages = [], id) => {
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

export const getDirectStageParent = (data, stageId) => {
    return flatInnerStages(data).find((el) => el.stages?.find((s) => s.id === stageId));
};

export const getDataOnStageEdit = (stages, changedStage) => {
    return stages.map(function iter(s) {
        if (s.id === changedStage.id) {
            return changedStage;
        }
        if (s.stages && s.stages.length !== 0) {
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
        if (s.stages && s.stages.length !== 0) {
            const newStages = s.stages.map(iter);
            return { ...s, stages: newStages };
        }
        return s;
    });
};

export function getDataOnStageDelete(stages, stageId) {
    return [...stages].filter((o) => {
        const keep = o.id != stageId;
        if (keep && o.stages) {
            o.stages = getDataOnStageDelete(o.stages, stageId);
        }
        return keep;
    });
}

export const getPrevVisibleItems = (stagesArr, visibleStages) => {
    const resArr = stagesArr.reduce((acc, { id, stages = [], tasks = [] }) => {
        const all = visibleStages[id] ? [...tasks, ...stages] : [];
        const inner = visibleStages[id] ? getPrevVisibleItems(stages, visibleStages) : [];
        return [...acc, ...all, ...inner];
    }, []);
    return resArr;
};

export const getDimensionsInRange = (dataRange, scale) => {
    const { CELL_WIDTH, CELL_WIDTH_SUB } = SCALING_VALUES[scale];

    const { SCALE_VALUE, DIMENSION, HEAD_SCALE_START_OF } = SCALE_MOMENT_DIMENSIONS[scale];

    const today = moment();

    return range(dataRange[0] * CELL_WIDTH, dataRange[1] * CELL_WIDTH, CELL_WIDTH_SUB).map((n) => {
        const day = moment(today).add(n / CELL_WIDTH_SUB, DIMENSION);

        const startDate = moment(day).startOf(HEAD_SCALE_START_OF);
        const endDate = moment(day).endOf(HEAD_SCALE_START_OF);

        const xStart = moment(startDate).diff(moment(today).startOf(SCALE_VALUE), DIMENSION, false);
        const xEnd = moment(endDate).diff(moment(today).endOf(SCALE_VALUE), DIMENSION, false);

        return { date: startDate, start: xStart, end: xEnd };
    }, []);
};

export const increaseColorBrightness = (hex, percent) => {
    hex = hex.replace(/^\s*#|\s*$/g, '');

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

export const formatDuration = (duration, dimension) => {
    if (!duration) return;
    const map = {
        hours: duration.asHours(),
        days: duration.asDays(),
        weeks: duration.asWeeks(),
        months: duration.asMonths(),
    };
    return round(map[dimension], 1);
};

export const reduceStagesToShow = (data) =>
    flatInnerStages(data).reduce(
        (acc, stage) => ({ ...acc, [stage.id]: true, ...(stage.stages && reduceStagesToShow(stage.stages)) }),
        {}
    );
