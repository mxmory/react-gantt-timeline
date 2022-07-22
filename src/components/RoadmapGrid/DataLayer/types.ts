import { Dispatch, SetStateAction } from 'react';
import { RoadmapStage, RoadmapStageVisibility, Scale } from '../../../types/roadmap';

export interface DataLayerProps {
    scale: Scale;
    data: RoadmapStage[];
    setData: Dispatch<SetStateAction<RoadmapStage[]>>;
    visibleStages: RoadmapStageVisibility;
}
