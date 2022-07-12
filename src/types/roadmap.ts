export interface RoadmapStage {
    id: string;
    name: string;
    start_at: string;
    deadline: string;
    duration?: number;
    type: StageType;
    color?: string | undefined;
    stages: RoadmapStage[] | [];
    tasks?: RoadmapTask[] | [];
}

export interface RoadmapTask {
    id: string;
}

export type StageType = 'stage' | 'milestone' | 'core';

export type Scale = 'DAY' | 'WEEK' | 'MONTH' | 'YEAR';

export type RoadmapStageVisibility = {
    [key: string]: boolean;
};

export type RoadmapDataRange = [number, number];
