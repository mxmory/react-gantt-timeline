import { SceneContext } from 'konva/lib/Context';
import { maxBy, minBy, range, round } from 'lodash';
import moment from 'moment';
import { APPROX_DAYS_SCALE_COUNT, SCALE_MOMENT_DIMENSIONS, SCALING_VALUES } from '../constants';
import { RoadmapDataRange, RoadmapStage, RoadmapStageVisibility, RoadmapTask, Scale } from '../types/roadmap';

export const getScaledCellWidth = (scale: Scale): number => {
    const { CELL_WIDTH } = SCALING_VALUES[scale];
    const daysCount = APPROX_DAYS_SCALE_COUNT[scale];
    return CELL_WIDTH / daysCount;
};

export const getStageX = (start: moment.Moment, scale: Scale): number =>
    start.diff(moment().startOf(SCALE_MOMENT_DIMENSIONS[scale].SCALE_VALUE), 'days', false);

const getStageLength = (deadline: moment.Moment, start: moment.Moment): number =>
    moment(deadline).diff(moment(start), 'days', false);

export const getStageProps = (stage: RoadmapStage, scale: Scale) => {
    const { start_at, deadline } = stage;
    return { x: getStageX(moment(start_at), scale), width: getStageLength(moment(deadline), moment(start_at)) };
};

export const getParentStageProps = (
    stages: RoadmapStage[],
    scale: Scale
): { x: number; width: number; startAt: moment.Moment; deadline: moment.Moment; duration: moment.Duration } => {
    if (stages && stages.length === 0)
        return { x: 0, width: 0, startAt: moment(), deadline: moment(), duration: moment.duration(0) };

    const flatStages = flatInnerStages(stages);
    const firstStageInCore = minBy(flatStages, (stage: RoadmapStage) => moment(stage.start_at));
    const lastStageInCore = maxBy(flatStages, (stage: RoadmapStage) => moment(stage.deadline));

    const stageStartAt = moment(firstStageInCore?.start_at);
    const stageDeadline = moment(lastStageInCore?.deadline);
    const stageLength = getStageLength(stageDeadline, stageStartAt);
    const duration = moment.duration(stageDeadline.diff(stageStartAt));

    return {
        x: getStageX(stageStartAt, scale),
        width: stageLength,
        startAt: stageStartAt,
        deadline: stageDeadline,
        duration: duration,
    };
};

export const adaptStages = (stages: RoadmapStage[], scale: Scale) => {
    return stages.map(function iter(s: RoadmapStage): RoadmapStage {
        if (s.stages.length !== 0) {
            const x = getParentStageProps(s.stages, scale);
            const inner = s.stages.map(iter);
            return {
                ...s,
                start_at: x.startAt.format('YYYY-MM-DD'),
                deadline: x.deadline.format('YYYY-MM-DD'),
                stages: inner,
            };
        }
        return s;
    });
};

export const flatInnerStages = (stagesArr: RoadmapStage[] = []): RoadmapStage[] => {
    const resArr = stagesArr.reduce((acc: RoadmapStage[], stage: RoadmapStage) => {
        const { stages } = stage;
        if (stages) {
            const inner = flatInnerStages(stages);
            return [...acc, stage, ...inner];
        }
        return [...acc, stage];
    }, []);
    return resArr;
};

export const getStage = (stages: RoadmapStage[] = [], id: string | undefined): RoadmapStage | undefined => {
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

export const getDirectStageParent = (stages: RoadmapStage[], stageId: string | undefined) => {
    return flatInnerStages(stages).find((el: RoadmapStage) => el.stages?.find((s: RoadmapStage) => s.id === stageId));
};

export const getDataOnStageEdit = (stages: RoadmapStage[], changedStage: RoadmapStage) => {
    return stages.map(function iter(s: RoadmapStage): RoadmapStage {
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

export const getDataOnStageAdd = (
    stages: RoadmapStage[],
    parentStageId: string | undefined,
    newStage: RoadmapStage
) => {
    return stages.map(function iter(s: RoadmapStage): RoadmapStage {
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

export function getDataOnStageDelete(stages: RoadmapStage[], stageId: string) {
    return [...stages].filter((s) => {
        const keep = s.id != stageId;
        if (keep && s.stages) {
            s.stages = getDataOnStageDelete(s.stages, stageId);
        }
        return keep;
    });
}

export const getPrevVisibleItems = (
    stagesArr: RoadmapStage[],
    visibleStages: RoadmapStageVisibility
): (RoadmapStage | RoadmapTask)[] => {
    const resArr = stagesArr.reduce(
        (acc: (RoadmapStage | RoadmapTask)[], { id, stages = [], tasks = [] }): (RoadmapStage | RoadmapTask)[] => {
            const all: (RoadmapStage | RoadmapTask)[] = visibleStages[id] ? [...tasks, ...stages] : [];
            const inner = visibleStages[id] ? getPrevVisibleItems(stages, visibleStages) : [];
            return [...acc, ...all, ...inner];
        },
        []
    );
    return resArr;
};

export const getDimensionsInRange = (dataRange: RoadmapDataRange, scale: Scale) => {
    const { CELL_WIDTH, CELL_WIDTH_SUB } = SCALING_VALUES[scale];
    const { SCALE_VALUE, DIMENSION, HEAD_SCALE_START_OF } = SCALE_MOMENT_DIMENSIONS[scale];
    const [start, end] = dataRange;
    const today = moment();

    return range(start * CELL_WIDTH, end * CELL_WIDTH, CELL_WIDTH_SUB).map((n) => {
        const day = moment().add(
            (n / CELL_WIDTH_SUB) as moment.DurationInputArg1,
            DIMENSION as moment.DurationInputArg2
        );

        const startDate = moment(day).startOf(HEAD_SCALE_START_OF);
        const endDate = moment(day).endOf(HEAD_SCALE_START_OF);

        const xStart = moment(startDate).diff(moment(today).startOf(SCALE_VALUE), DIMENSION, false);
        const xEnd = moment(endDate).diff(moment(today).endOf(SCALE_VALUE), DIMENSION, false);

        return { date: startDate, start: xStart, end: xEnd };
    }, []);
};

export const increaseColorBrightness = (hex: string | undefined, percent: number): string => {
    if (!hex) return '';

    hex = hex.replace(/^\s*#|\s*$/g, '');

    if (hex.length == 3) {
        hex = hex.replace(/(.)/g, '$1$1');
    }

    const r = parseInt(hex.substring(0, 2), 16),
        g = parseInt(hex.substring(2, 4), 16),
        b = parseInt(hex.substring(4, 6), 16);

    return (
        '#' +
        (0 | ((1 << 8) + r + ((256 - r) * percent) / 100)).toString(16).substring(1) +
        (0 | ((1 << 8) + g + ((256 - g) * percent) / 100)).toString(16).substring(1) +
        (0 | ((1 << 8) + b + ((256 - b) * percent) / 100)).toString(16).substring(1)
    );
};

export const clipRect = (ctx: SceneContext, x: number, y: number, width: number, height: number, radius: number) => {
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

export const formatDuration = (duration: moment.Duration | undefined, dimension: string) => {
    if (!duration) return;

    const map: { [key: string]: number } = {
        days: duration.asDays(),
        weeks: duration.asWeeks(),
        months: duration.asMonths(),
        years: duration.asYears(),
    };
    return round(map[dimension], 1);
};

export const reduceStagesToShow = (data: RoadmapStage[]): RoadmapStageVisibility =>
    flatInnerStages(data).reduce(
        (acc, stage) => ({ ...acc, [stage.id]: true, ...(stage.stages && reduceStagesToShow(stage.stages)) }),
        {}
    );
