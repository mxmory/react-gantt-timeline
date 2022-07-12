import { Scale, RoadmapStage, RoadmapStageVisibility } from '../../../types/roadmap';
import { Dispatch, SetStateAction } from 'react';

export interface ListStageItemProps {
    moveToDate(date?: moment.Moment, scale?: Scale): void;
    stage: RoadmapStage;
    data: RoadmapStage[];
    setData: Dispatch<SetStateAction<RoadmapStage[]>>;
    toggleStageCollapse(stageId: string): void;
    visibleStages: RoadmapStageVisibility;
    scale: Scale;
    siderExpanded: boolean;
    durationScale: Scale;
}
