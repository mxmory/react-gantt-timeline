import { RoadmapDataRange, RoadmapStage, RoadmapStageVisibility, Scale, TreeRoadmapStage } from '../../types/roadmap';
import { KonvaWheelEvent } from '../../types/events';
import { Dispatch, SetStateAction } from 'react';
import Konva from 'konva';

export interface RoadmapGridProps {
    // scale, data, setData, dataRange, onCanvasScroll, visibleStages
    ref: React.RefObject<Konva.Stage>;
    scale: Scale;
    data: RoadmapStage[];
    // setData: Dispatch<SetStateAction<RoadmapStage[]>>;
    dataRange: RoadmapDataRange;
    onCanvasScroll(e: KonvaWheelEvent): void;
    visibleStages: RoadmapStageVisibility;
}
