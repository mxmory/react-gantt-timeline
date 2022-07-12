import { Scale, RoadmapStage } from 'types/roadmap';

export const width = 300;
export const CANVAS_WIDTH = 3000;
export const height = 3000;
export const CANVAS_HEIGHT = 3000;
export const CELL_HEIGHT = 30;
export const HEADER_TOP_HEIGHT = 20;
export const STAGE_HEIGHT = 8;
export const TASK_HEIGHT = 20;

export const SCALES: { [key: number]: Scale } = {
    0: 'DAY',
    1: 'WEEK',
    2: 'MONTH',
    3: 'YEAR',
};

type DurationScaleValues = {
    [key: string]: {
        TITLE: string;
        DIMENSION: moment.unitOfTime.Diff;
    };
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

type ScaleMomentDimensions = {
    [key: string]: {
        SCALE_VALUE: moment.unitOfTime.StartOf;
        DIMENSION: moment.unitOfTime.Diff;
        HEAD_SCALE_START_OF: moment.unitOfTime.StartOf;
    };
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

type ScalingValues = {
    [key: string]: {
        CELL_WIDTH: number;
        CELL_WIDTH_SUB: number;
        DIMENSIONS: {
            VALUE: moment.unitOfTime.StartOf;
            DIMENSION: moment.unitOfTime.Diff;
        };
    };
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

export const HOLIDAYS = ['2022-06-23', '2022-06-28'];

export const ACTUAL_DATA: { [key: string]: RoadmapStage[] } = {
    stages: [
        {
            id: '1',
            type: 'core',
            color: '#8189D6',
            start_at: '2022-07-21',
            deadline: '2025-07-3',
            name: 'Main stage 2',
            stages: [
                {
                    id: '10',
                    type: 'stage',
                    name: 'Stage 10',
                    start_at: '2022-07-21',
                    deadline: '2025-07-3',
                    stages: [],
                },
            ],
        },
    ],
};
