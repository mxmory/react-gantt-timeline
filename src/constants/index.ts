import { InitialRoadmapStage } from './../types/roadmap';
import { Scale, DurationScaleValues, ScaleMomentDimensions, ScalingValues } from 'types/roadmap';

export const width = 300;
export const CANVAS_WIDTH = 3000;
export const height = 3000;
export const CANVAS_HEIGHT = 3000;
export const CELL_HEIGHT = 30;
export const HEADER_TOP_HEIGHT = 20;
export const STAGE_HEIGHT = 12;
export const CORE_STAGE_HEIGHT = 8;
export const TASK_HEIGHT = 20;

export const SCALES: { [key: number]: Scale } = {
    0: 'DAY',
    1: 'WEEK',
    2: 'MONTH',
    3: 'YEAR',
};

export const DURATION_SCALE_VALUES: DurationScaleValues = {
    [SCALES[0]]: {
        TITLE: 'Days',
        DIMENSION: 'days',
    },
    [SCALES[1]]: {
        TITLE: 'Weeks',
        DIMENSION: 'weeks',
    },
    [SCALES[2]]: {
        TITLE: 'Months',
        DIMENSION: 'months',
    },
    [SCALES[3]]: {
        TITLE: 'Years',
        DIMENSION: 'years',
    },
};

export const SCALE_MOMENT_DIMENSIONS: ScaleMomentDimensions = {
    [SCALES[0]]: {
        SCALE_VALUE: 'day',
        DIMENSION: 'days',
        HEAD_SCALE_START_OF: 'month',
    },
    [SCALES[1]]: {
        SCALE_VALUE: 'day',
        DIMENSION: 'days',
        HEAD_SCALE_START_OF: 'month',
    },
    [SCALES[2]]: {
        SCALE_VALUE: 'month',
        DIMENSION: 'months',
        HEAD_SCALE_START_OF: 'year',
    },
    [SCALES[3]]: {
        SCALE_VALUE: 'year',
        DIMENSION: 'months',
        HEAD_SCALE_START_OF: 'year',
    },
};

export const APPROX_DAYS_SCALE_COUNT: { [key: string]: number } = {
    [SCALES[0]]: 1,
    [SCALES[1]]: 7,
    [SCALES[2]]: 365 / 12,
    [SCALES[3]]: 365,
};

export const SCALING_VALUES: ScalingValues = {
    [SCALES[0]]: {
        CELL_WIDTH: 36,
        CELL_WIDTH_SUB: 36,
        DIMENSIONS: { VALUE: 'day', DIMENSION: 'days' },
    },
    [SCALES[1]]: {
        CELL_WIDTH: 105,
        CELL_WIDTH_SUB: 15,
        DIMENSIONS: { VALUE: 'day', DIMENSION: 'weeks' },
    },
    [SCALES[2]]: {
        CELL_WIDTH: 80,
        CELL_WIDTH_SUB: 80,
        DIMENSIONS: { VALUE: 'month', DIMENSION: 'months' },
    },
    [SCALES[3]]: {
        CELL_WIDTH: 80,
        CELL_WIDTH_SUB: 80,
        DIMENSIONS: { VALUE: 'year', DIMENSION: 'years' },
    },
};

// Кастомные выходные (по умолчанию выходные - только сб/вс). Можно прикрутить выбор из календаря на беке.
export const HOLIDAYS = ['2022-06-23', '2022-06-28'];

export const ACTUAL_DATA: InitialRoadmapStage[] = [
    {
        id: '1',
        type: 'stage',
        color: '#8189D6',
        start_at: '2023-03-18',
        deadline: '2023-03-30',
        name: 'Stage 1',
        parentStageId: null,
    },
    {
        id: '10',
        type: 'stage',
        color: '#8189D6',
        name: 'Stage 10',
        start_at: '2023-03-18',
        deadline: '2023-03-23',
        parentStageId: '1',
    },
    {
        id: '100',
        type: 'stage',
        color: '#8189D6',
        name: 'Stage 100',
        start_at: '2023-03-18',
        deadline: '2023-03-23',
        parentStageId: '10',
    },
    {
        id: '101',
        type: 'milestone',
        color: '#8189D6',
        name: 'Milestone 101',
        start_at: '2023-03-20',
        deadline: '2023-03-20',
        parentStageId: '10',
    },
    {
        id: '11',
        type: 'stage',
        color: '#8189D6',
        name: 'Stage 11',
        start_at: '2023-03-23',
        deadline: '2023-03-31',
        parentStageId: '1',
    },
    {
        id: '111',
        type: 'stage',
        color: '#8189D6',
        name: 'Stage 100',
        start_at: '2023-03-23',
        deadline: '2023-03-25',
        parentStageId: '11',
    },
    {
        id: '112',
        type: 'stage',
        color: '#8189D6',
        name: 'Stage 112',
        start_at: '2023-03-25',
        deadline: '2023-03-31',
        parentStageId: '11',
    },
    {
        id: '2',
        type: 'stage',
        color: '#aa5344',
        name: 'Main stage 5',
        start_at: '2023-03-21',
        deadline: '2023-03-28',
        parentStageId: null,
    },
];
