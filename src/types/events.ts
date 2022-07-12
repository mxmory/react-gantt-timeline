import Konva from 'konva';

export type KonvaWheelEvent = Konva.KonvaEventObject<WheelEvent> & {
    evt: {
        wheelDeltaX: number;
    };
};

export type KonvaMouseEvent = Konva.KonvaEventObject<WheelEvent> & {
    evt: {
        layerX: number;
        layerY: number;
    };
};
