import React, { useRef } from 'react';
import styles from './RoadmapGrid.module.scss';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { CANVAS_HEIGHT, CELL_WIDTH, CELL_HEIGHT, CANVAS_WIDTH } from '../../constants/index';
import { BackgroundLayer } from './BackgroundLayer/index';
import { DataLayer } from './DataLayer/index';
import Konva from 'konva';
import { getStage, getStageProps } from '../../utils/funcs';
import moment from 'moment';

const RoadmapGrid = ({ data, setData, dataRange, setBounds, onCanvasDrag, onCanvasScroll }, ref) => {
    const crosshairLayerRef = useRef();
    const stageBoundsLayerRef = useRef();

    const onMouseMove = (e) => {
        const crosshairLayer = crosshairLayerRef.current;
        const stageBoundsLayer = stageBoundsLayerRef.current;

        if (!crosshairLayer || !stageBoundsLayer) return;
        const { layerX, layerY } = e.evt;
        const [vertCrosshair, horzCrosshair] = crosshairLayer.children;
        const [startBound, endBound] = stageBoundsLayer.children;

        const canvasX = e.currentTarget.x();
        const posX = Math.floor((layerX - canvasX) / CELL_WIDTH) * CELL_WIDTH;
        const posY = Math.floor(layerY / CELL_HEIGHT) * CELL_HEIGHT;

        if (e.target.attrs?.type === 'CORE_STAGE_LINE') {
            const stage = getStage(data, e.target.attrs?.id);
            const { x, width } = getStageProps(stage.stages);
            stageBoundsLayer.show();

            startBound.setAttrs({
                points: [x * CELL_WIDTH - 0.5, 0, x * CELL_WIDTH - 0.5, posY],
            });
            endBound.setAttrs({
                points: [width * CELL_WIDTH + x * CELL_WIDTH - 0.5, 0, width * CELL_WIDTH + x * CELL_WIDTH - 0.5, posY],
            });
        } else if (e.target.attrs?.type === 'STAGE_LINE') {
            const stage = getStage(data, e.target.attrs?.id);
        } else {
            stageBoundsLayer.hide();
        }

        vertCrosshair.setAttrs({
            x: posX,
            y: 0,
            opacity: 0.3,
        });

        horzCrosshair.setAttrs({
            x: dataRange[0] * CELL_WIDTH,
            y: posY,
            opacity: 0.3,
        });
    };

    const onMouseLeave = () => {
        const layer = crosshairLayerRef.current;
        if (!layer) return;
        const [vertCrosshair, horzCrosshair] = layer.children;

        vertCrosshair.to({
            opacity: 0,
            duration: 0.3,
        });
        horzCrosshair.to({
            opacity: 0,
            duration: 0.3,
        });
    };

    const onWheel = (e) => {
        onCanvasScroll(e);
        onMouseLeave();
    };

    return (
        <div className={styles.grid}>
            <div className={styles.innerGridContainer}>
                <Stage
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    width={window.innerWidth}
                    height={CANVAS_HEIGHT}
                    ref={ref}
                    // onMouseUp={onDeselect}
                    listening
                    draggable
                    dragBoundFunc={(pos) => {
                        return {
                            x: pos.x,
                            y: 0,
                        };
                    }}
                    onDragEnd={setBounds}
                    onDragMove={onCanvasDrag}
                    onWheel={onWheel}
                >
                    <Layer ref={stageBoundsLayerRef}>
                        <Line id="startBound" strokeWidth={0.5} stroke="#000" dashEnabled dash={[14, 7]} />
                        <Line id="endBound" strokeWidth={0.5} stroke="#000" dashEnabled dash={[14, 7]} />
                    </Layer>
                    <Layer ref={crosshairLayerRef}>
                        <Rect width={CELL_WIDTH} height={CANVAS_HEIGHT} fill="#ccc" opacity={0} />
                        <Rect
                            width={(dataRange[1] - dataRange[0]) * CELL_WIDTH}
                            height={CELL_HEIGHT}
                            fill="#ccc"
                            opacity={0}
                        />
                    </Layer>
                    <BackgroundLayer dataRange={dataRange} />
                    <DataLayer data={data} setData={setData} />
                </Stage>
            </div>
        </div>
    );
};

export default React.forwardRef(RoadmapGrid);
