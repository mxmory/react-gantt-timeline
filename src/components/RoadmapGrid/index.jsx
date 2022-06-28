import React, { useRef } from 'react';
import styles from './RoadmapGrid.module.scss';
import { Stage, Layer, Rect, Line } from 'react-konva';
import { CANVAS_HEIGHT, CELL_HEIGHT, SCALING_VALUES } from '../../constants';
import { BackgroundLayer } from './BackgroundLayer/index';
import { DataLayer } from './DataLayer/index';
import { getStage, getParentStageProps, flatInnerStages, getStageProps } from '../../utils/funcs';

const RoadmapGrid = ({ scale, data, setData, dataRange, setBounds, onCanvasDrag, onCanvasScroll }, ref) => {
    const crosshairLayerRef = useRef();
    const stageBoundsLayerRef = useRef();

    const { CELL_WIDTH } = SCALING_VALUES[scale];

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

        stageBoundsLayer.moveToTop();

        if (e.target.attrs?.type === 'STAGE_LINE') {
            // e.target.batchDraw();
            const stage = getStage(data, e.target.attrs?.id);
            let stageX, stageWidth;
            if (stage.type === 'core') {
                const innerStages = flatInnerStages(stage.stages);
                const { x, width } = getParentStageProps(innerStages, scale);
                stageX = x;
                stageWidth = width;
            } else {
                const { x, width } = getStageProps(stage, scale);
                stageX = x;
                stageWidth = width;
            }

            stageBoundsLayer.show();
            startBound.setAttrs({
                points: [stageX * CELL_WIDTH - 0.5, 0, stageX * CELL_WIDTH - 0.5, posY + CELL_HEIGHT / 2],
            });
            endBound.setAttrs({
                points: [
                    stageWidth * CELL_WIDTH + stageX * CELL_WIDTH - 0.5,
                    0,
                    stageWidth * CELL_WIDTH + stageX * CELL_WIDTH - 0.5,
                    posY + CELL_HEIGHT / 2,
                ],
            });
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
                        <Line id="startBound" strokeWidth={0.5} stroke="#666" dashEnabled dash={[14, 7]} />
                        <Line id="endBound" strokeWidth={0.5} stroke="#666" dashEnabled dash={[14, 7]} />
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
                    <BackgroundLayer scale={scale} dataRange={dataRange} />
                    <DataLayer scale={scale} data={data} setData={setData} />
                </Stage>
            </div>
        </div>
    );
};

export default React.forwardRef(RoadmapGrid);
