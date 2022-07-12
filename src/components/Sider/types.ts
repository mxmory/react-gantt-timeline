import { Dispatch, SetStateAction } from 'react';
import { RoadmapStage, RoadmapStageVisibility, Scale } from '../../types/roadmap';

export interface RoadmapSiderProps {
    moveToDate(date?: moment.Moment, scale?: Scale): void;
    data: RoadmapStage[];
    setData: Dispatch<SetStateAction<RoadmapStage[]>>;
    toggleStageCollapse(stageId: string): void;
    visibleStages: RoadmapStageVisibility;
    siderExpanded: boolean;
    scale: Scale;
    durationScale: Scale;
}
