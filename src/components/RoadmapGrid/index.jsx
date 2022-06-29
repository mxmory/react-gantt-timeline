import React, { useRef } from 'react';
import styles from './RoadmapGrid.module.scss';
import { Stage, Layer, Rect, Line, Text, Group } from 'react-konva';
import { CANVAS_HEIGHT, CELL_HEIGHT, SCALING_VALUES } from '../../constants';
import { BackgroundLayer } from './BackgroundLayer/index';
import { DataLayer } from './DataLayer/index';
import { getStage, getParentStageProps, flatInnerStages, getStageProps, getScaledCellWidth } from '../../utils/funcs';
import moment from 'moment';
import { STAGE_HEIGHT } from '../../constants/index';

const RoadmapGrid = ({ scale, data, setData, dataRange, onCanvasScroll }, ref) => {
    const crosshairLayerRef = useRef();
    const stageBoundsLayerRef = useRef();
    const dragRangeBoundsLayerRef = useRef();

    const { CELL_WIDTH } = SCALING_VALUES[scale];
    const scaledCellWidth = getScaledCellWidth(scale);

    const onDragMove = (e) => {
        const stageBoundsLayer = stageBoundsLayerRef.current;
        const dragRangeBoundsLayer = dragRangeBoundsLayerRef.current;
        const crosshairLayer = crosshairLayerRef.current;

        if (e.target.attrs?.type === 'STAGE_LINE') {
            dragRangeBoundsLayer.show();
            stageBoundsLayer.hide();
            crosshairLayer.hide();
            const [dragRect, startDateText, endDateText] = dragRangeBoundsLayer.children;

            const { x, y, id } = e.target.attrs;
            const stage = getStage(data, id);
            const { width } = getStageProps(stage, scale);
            const posX = Math.round(x / CELL_WIDTH) * CELL_WIDTH;
            const posY = Math.floor(y / CELL_HEIGHT) * CELL_HEIGHT;

            dragRect.setAttrs({
                x: posX,
                width: width * scaledCellWidth,
                y: 0,
                opacity: 0.1,
            });

            startDateText.setAttrs({
                x: posX - startDateText.width() - 20,
                y: posY + STAGE_HEIGHT,
                text: moment()
                    .add(posX / scaledCellWidth, 'days')
                    .format('DD.MM.YYYY'),
                opacity: 1,
            });

            endDateText.setAttrs({
                x: posX + width * scaledCellWidth + 20,
                y: posY + STAGE_HEIGHT,
                text: moment()
                    .add(posX / scaledCellWidth + width, 'days')
                    .format('DD.MM.YYYY'),
                opacity: 1,
            });
        }
    };

    const onDragEnd = (e) => {
        const dragRangeBoundsLayer = dragRangeBoundsLayerRef.current;
        const [dragRect, startDateText, endDateText] = dragRangeBoundsLayer.children;

        dragRect.to({
            opacity: 0,
            duration: 0.2,
        });

        startDateText.to({
            opacity: 0,
            duration: 0.2,
        });

        endDateText.to({
            opacity: 0,
            duration: 0.2,
        });
    };

    const onMouseMove = (e) => {
        const crosshairLayer = crosshairLayerRef.current;
        const stageBoundsLayer = stageBoundsLayerRef.current;

        if (!crosshairLayer || !stageBoundsLayer) return;
        crosshairLayer.show();
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
                    onDragMove={onDragMove}
                    onDragEnd={onDragEnd}
                    onMouseMove={onMouseMove}
                    onMouseLeave={onMouseLeave}
                    width={window.innerWidth}
                    height={CANVAS_HEIGHT}
                    ref={ref}
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
                    <Layer ref={dragRangeBoundsLayerRef}>
                        <Rect opacity={0} height={CANVAS_HEIGHT} fill="#546678" />
                        <Text opacity={0} fontFamily="Montserrat" fontSize={10} />
                        <Text opacity={0} fontFamily="Montserrat" fontSize={10} />
                    </Layer>
                    <DataLayer scale={scale} data={data} setData={setData} />
                </Stage>
            </div>
        </div>
    );
};

export default React.forwardRef(RoadmapGrid);
