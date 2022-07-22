import Konva from 'konva';
import moment from 'moment';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import React, { useEffect, useRef, useState } from 'react';
import { KonvaWheelEvent } from 'types/events';
import styles from './Roadmap.module.scss';
import Head from './components/Head';
import { MinusIcon, PlusIcon } from './components/Icons';
import RoadmapGrid from './components/RoadmapGrid';
import OffscreenStagesMarks from './components/RoadmapGrid/OffscreenStagesMarks';
import { Sider } from './components/Sider';
import TimelineGrid from './components/TimelineGrid';
import { SCALING_VALUES, ACTUAL_DATA, SCALES } from './constants';
import { adaptStages, getScaledCellWidth, reduceStagesToShow } from './utils/funcs';
import { RoadmapDataRange, RoadmapStage, RoadmapStageVisibility, Scale } from './types/roadmap';
import { isEqual } from 'lodash';

const Roadmap = () => {
    const [data, setData] = useState<RoadmapStage[]>(ACTUAL_DATA.stages);
    const [visibleStages, setVisibleStages] = useState<RoadmapStageVisibility>(reduceStagesToShow(data));
    const [dataRange, setDataRange] = useState<RoadmapDataRange>([0, 0]);
    const [siderExpanded, setSiderExpanded] = useState<boolean>(false);
    const [scale, setScale] = useState<number>(0); // day by default (REDUX)
    const [durationScale, setDurationScale] = useState<number>(0); // day by default (REDUX)
    const [offscreenItems, setOffscreenItems] = useState<Konva.Group[] | []>([]);

    const { CELL_WIDTH } = SCALING_VALUES[SCALES[scale]];

    const headDatesScaleRef = useRef<Konva.Stage>(null);
    const mainGridRef = useRef<Konva.Stage>(null);

    const dataLayer = mainGridRef.current?.getChildren((el) => el.getAttr('id') === 'DATA_LAYER')[0];

    useEffect(() => {
        // (reduceStagesToShow(data));
        moveToDate(moment());
    }, []);

    useEffect(() => {
        mainGridRef.current?.draw();
        // const redrawGrid = async () => {
        // };

        // redrawGrid().then(() => {
        //     const items =
        //         dataLayer?.getChildren(
        //             (node) => node.getType() === 'Group' && node?.getAttrs().type === 'STAGE_LINE'
        //         ) || [];
        //     setOffscreenItems(items);
        // });
        setTimeout(() => {
            const items =
                (dataLayer?.getChildren(
                    (node) => node.getType() === 'Group' && node?.getAttrs().type === 'STAGE_LINE'
                ) as Konva.Group[]) || [];
            setOffscreenItems(items);
        }, 100); // Need to wait layer to redraw itself. Maybe todo.
    }, [visibleStages, data]);

    const toggleStageCollapse = (stageId: string) => {
        setVisibleStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

    useEffect(() => {
        const adaptedData = adaptStages(data, SCALES[scale]);
        if (!isEqual(adaptedData, data)) {
            setData(adaptedData);
        }
    }, [data]);

    useEffect(() => {
        const stage = mainGridRef.current;
        if (!stage) return;
        const startIndex = Math.floor((-stage.x() - stage.width()) / CELL_WIDTH);
        const endIndex = Math.floor((-stage.x() + stage.width() * 2) / CELL_WIDTH);
        setDataRange([startIndex, endIndex]);
        setBounds();
        stage.batchDraw();
        moveToDate(moment());
    }, [scale, siderExpanded]);

    const onCanvasScroll = (e: KonvaWheelEvent): void => {
        const { evt } = e;
        console.log(evt.shiftKey, evt.wheelDeltaX);
        if (evt.shiftKey || evt.wheelDeltaX !== 0) {
            evt.preventDefault();
            headDatesScaleRef.current?.x(
                headDatesScaleRef.current.x() - (evt.shiftKey ? evt.deltaY : -evt.wheelDeltaX)
            );
            mainGridRef.current?.x(mainGridRef.current.x() - (evt.shiftKey ? evt.deltaY : -evt.wheelDeltaX));
            setBounds();
        }
    };

    const moveToDate = (date = moment(), scale: Scale = SCALES[0]) => {
        const {
            DIMENSIONS: { VALUE },
        } = SCALING_VALUES[scale];

        const scaledCellWidth = getScaledCellWidth(scale);
        const isAfterToday = moment(date).isSameOrAfter(moment());
        const diff = moment().startOf(VALUE).diff(moment(date), 'days', !isAfterToday);
        const stage = mainGridRef.current;
        const timelineStage = headDatesScaleRef.current;
        stage?.x(Math.round(diff) * scaledCellWidth);
        timelineStage?.x(Math.round(diff) * scaledCellWidth);
        setBounds();
    };

    const setBounds = () => {
        const stage = mainGridRef.current;
        if (!stage) return;
        const startIndex = Math.floor((-stage.x() - stage.width()) / CELL_WIDTH);
        const endIndex = Math.floor((-stage.x() + stage.width() * 2) / CELL_WIDTH);
        setDataRange([startIndex, endIndex]);
    };

    const minusScale = () => {
        if (scale > 0) {
            setScale((prev) => prev - 1);
        }
    };

    const plusScale = () => {
        if (scale < 3) {
            setScale(scale + 1);
        }
    };

    return (
        <div className={styles.main}>
            <Head
                scale={SCALES[scale]}
                ref={headDatesScaleRef}
                siderExpanded={siderExpanded}
                toggleSidebar={() => setSiderExpanded((prev) => !prev)}
                dataRange={dataRange}
                moveToDate={moveToDate}
                durationScale={SCALES[durationScale]}
                setDurationScale={setDurationScale}
            />
            <div className={styles.flex}>
                <Sider
                    scale={SCALES[scale]}
                    moveToDate={moveToDate}
                    siderExpanded={siderExpanded}
                    data={data}
                    setData={setData}
                    toggleStageCollapse={toggleStageCollapse}
                    visibleStages={visibleStages}
                    durationScale={SCALES[durationScale]}
                />
                <div className={styles.innerFlex}>
                    <RoadmapGrid
                        visibleStages={visibleStages}
                        scale={SCALES[scale]}
                        ref={mainGridRef}
                        data={data}
                        setData={setData}
                        dataRange={dataRange}
                        onCanvasScroll={onCanvasScroll}
                    />
                    <OffscreenStagesMarks marks={offscreenItems} ref={mainGridRef} />
                    <TimelineGrid siderExpanded={siderExpanded} />
                </div>

                <div className={styles.scalePanel}>
                    <div className={styles.scaleControl} onClick={minusScale}>
                        <MinusIcon />
                    </div>
                    <div className={styles.scaleSliderWrap}>
                        <Slider
                            min={0}
                            max={3}
                            value={scale}
                            onChange={setScale as () => void}
                            className={styles.scaleSlider}
                            dots={true}
                            handleStyle={[
                                {
                                    backgroundColor: '#F05729',
                                    width: 14,
                                    height: 14,
                                    border: 'none',
                                    opacity: 1,
                                    boxShadow: 'none',
                                },
                            ]}
                            dotStyle={{
                                width: 2,
                                height: 9,
                                borderRadius: 1,
                                top: -3,
                                bottom: 0,
                                borderColor: '#D7DADD',
                            }}
                            trackStyle={{ backgroundColor: '#D7DADD' }}
                            railStyle={{ backgroundColor: '#D7DADD' }}
                        />
                        <div className={styles.scaleLabel}>
                            Scale:{' '}
                            <span className={styles.value}>{SCALING_VALUES[SCALES[scale]].DIMENSIONS.DIMENSION}</span>
                        </div>
                    </div>
                    <div className={styles.scaleControl} onClick={plusScale}>
                        <PlusIcon />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;
