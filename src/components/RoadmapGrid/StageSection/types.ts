import { RoadmapStageVisibility } from 'types/roadmap';
import { RoadmapStage, Scale } from '../../../types/roadmap';
import { Dispatch, SetStateAction } from 'react';

export interface StageSectionProps {
    visibleStages: RoadmapStageVisibility;
    data: RoadmapStage[];
    setData: Dispatch<SetStateAction<RoadmapStage[]>>;
    scale: Scale;
    stage: RoadmapStage;
    allSiblingStages: RoadmapStage[];
    index: number;
    currentLine: number;
    color: string | undefined;
    select: Dispatch<SetStateAction<string | null>>;
    onDeselect(): void;
    selectedId: string | null;
    setIsTransforming: Dispatch<SetStateAction<boolean>>;
    core: boolean; // first level stage
}
