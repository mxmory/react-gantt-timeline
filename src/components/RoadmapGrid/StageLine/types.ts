import { StageType } from './../../../types/roadmap';
import { KonvaMouseEvent } from 'types/events';
import { Dispatch, SetStateAction } from 'react';
import { Scale, RoadmapStage } from 'types/roadmap';

export interface StageLineProps {
    scale: Scale;
    data: RoadmapStage[];
    // setData: Dispatch<SetStateAction<RoadmapStage[]>>;
    select: Dispatch<SetStateAction<string | null>>;
    id: string;
    line: number;
    length: number;
    start_at: number;
    onDeselect(): void;
    color: string | undefined;
    type: StageType;
    isSelected: boolean;
    onTransformStart(e: KonvaMouseEvent): void;
    onTransformEnd(e: KonvaMouseEvent): void;
}
