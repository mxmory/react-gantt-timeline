import { InitialRoadmapStage } from './../types/roadmap';
import { RoadmapStage } from '../types/roadmap';

interface LookupItem extends Partial<InitialRoadmapStage> {
    stages: LookupItem[];
}

export const getNestedStagesTree = (data: InitialRoadmapStage[]): RoadmapStage[] => {
    const lookup: { [key: RoadmapStage['id']]: LookupItem } = {};
    const stages: RoadmapStage[] = [];

    for (const item of data) {
        const { id, parentStageId } = item;

        lookup[id] = { ...item, stages: lookup[id]?.stages ?? [] };

        if (parentStageId === null) {
            stages.push(lookup[id] as RoadmapStage);
        } else {
            if (!lookup[parentStageId]) {
                lookup[parentStageId] = { stages: [] };
            }

            lookup[parentStageId].stages.push(lookup[id]);
        }
    }

    return stages;
};
