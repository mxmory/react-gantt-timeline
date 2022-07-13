import { RoadmapStageVisibility } from 'types/roadmap';
import { RoadmapStage, Scale } from '../../../types/roadmap';
import { Dispatch, SetStateAction } from 'react';

export interface StageSectionProps {
    visibleStages: RoadmapStageVisibility;
    data: RoadmapStage[];
    setData: Dispatch<SetStateAction<RoadmapStage[]>>;
    scale: Scale;
    stage: RoadmapStage;
    allStages: RoadmapStage[];
    index: number;
    currentLine: number;
    color: string;
    select: Dispatch<SetStateAction<string | null>>;
    onDeselect(): void;
    selectedId: string | null;
    setIsTransforming: Dispatch<SetStateAction<boolean>>;
}
