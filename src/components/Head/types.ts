import { RoadmapDataRange } from './../../types/roadmap';
import { Scale } from 'types/roadmap';

export interface HeadProps {
    scale: Scale;
    siderExpanded: boolean;
    toggleSidebar(): void;
    dataRange: RoadmapDataRange;
    moveToDate(date?: moment.Moment, scale?: Scale): void;
    durationScale: Scale;
    setDurationScale: React.Dispatch<React.SetStateAction<number>>;
}
