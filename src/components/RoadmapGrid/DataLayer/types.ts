import { RoadmapStage, RoadmapStageVisibility, Scale } from '../../../types/roadmap';
import { Dispatch, SetStateAction } from 'react';

export interface DataLayerProps {
    // scale, data, setData, visibleStages
    scale: Scale;
    data: RoadmapStage[];
    setData: Dispatch<SetStateAction<RoadmapStage[]>>;
    visibleStages: RoadmapStageVisibility;
}
