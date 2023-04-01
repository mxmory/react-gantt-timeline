export interface RoadmapStage {
    id: string;
    name: string;
    start_at: string;
    deadline: string;
    duration?: number;
    type: StageType;
    color?: string | undefined;
    tasks?: RoadmapTask[] | [];
    stages: RoadmapStage[];
    parentStageId: RoadmapStage['id'] | null;
}

export type InitialRoadmapStage = Omit<RoadmapStage, 'stages'>;

export interface RoadmapTask {
    id: string;
    name: string;
    start_at: string;
    deadline: string;
}

export type StageType = 'stage' | 'milestone' | 'core';

export type Scale = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export type RoadmapStageVisibility = {
    [key: string]: boolean;
};

export type RoadmapDataRange = [number, number];

export type DurationScaleValues = {
    [key: string]: {
        TITLE: string;
        DIMENSION: moment.unitOfTime.Diff;
    };
};

export type ScaleMomentDimensions = {
    [key: string]: {
        SCALE_VALUE: moment.unitOfTime.StartOf;
        DIMENSION: moment.unitOfTime.Diff;
        HEAD_SCALE_START_OF: moment.unitOfTime.StartOf;
    };
};

export type ScalingValues = {
    [key: string]: {
        CELL_WIDTH: number;
        CELL_WIDTH_SUB: number;
        DIMENSIONS: {
            VALUE: moment.unitOfTime.StartOf;
            DIMENSION: moment.unitOfTime.Diff;
        };
    };
};
