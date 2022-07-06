import React, { useState, useEffect } from 'react';
import styles from './App.module.scss';
import { Sider } from './components/Sider/index';
import { useRef } from 'react';
import Head from './components/Head';
import RoadmapGrid from './components/RoadmapGrid';
import { ACTUAL_DATA, SCALING_VALUES, SCALES } from './constants';
import { flatInnerStages, getScaledCellWidth } from './utils/funcs';
import { STAGE_HEIGHT } from './constants/';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import moment from 'moment';
import { MinusIcon } from './components/Icons';
import { PlusIcon } from './components/Icons/index';

const reduceStagesToShow = (data) =>
    flatInnerStages(data).reduce(
        (acc, stage) => ({ ...acc, [stage.id]: true, ...(stage.stages && reduceStagesToShow(stage.stages)) }),
        {}
    );

const App = () => {
    const [data, setData] = useState(ACTUAL_DATA.stages);
    const [visibleStages, setVisibleStages] = useState(reduceStagesToShow(data));
    const [dataRange, setDataRange] = useState([]);
    const [siderExpanded, setSiderExpanded] = useState(false);
    const [scale, setScale] = useState(0); // day by default
    const [offsetItems, setOffsetItems] = useState([]);

    const { CELL_WIDTH } = SCALING_VALUES[SCALES[scale]];

    const headDatesScaleRef = useRef();
    const mainGridRef = useRef();

    const dataLayer = mainGridRef.current?.getChildren((el) => el.getId('DATA_LAYER'))[0];

    useEffect(() => {
        setVisibleStages(reduceStagesToShow(data));
        moveToDate(moment());
    }, []);

    useEffect(() => {
        mainGridRef.current?.draw();
        setTimeout(() => {
            const items =
                dataLayer?.getChildren((node) => node.getType('Group') && node?.getAttrs().type === 'STAGE_LINE') || [];
            setOffsetItems(items);
        }, 100); // Need to wait layer to redraw itself. Maybe todo.
    }, [visibleStages, data]);

    const toggleStageCollapse = (stageId) => {
        setVisibleStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

    const onScaleChange = (value) => {
        if (value !== scale) {
            setScale(value);
        }
    };

    useEffect(() => {
        const stage = mainGridRef.current;
        const startIndex = Math.floor((-stage.x() - stage.width()) / CELL_WIDTH);
        const endIndex = Math.floor((-stage.x() + stage.width() * 2) / CELL_WIDTH);
        setDataRange([startIndex, endIndex]);
        setBounds();
        stage.batchDraw();
        moveToDate(moment());
    }, [scale]);

    const onCanvasDrag = (e) => {
        const x = e.target.x();
        headDatesScaleRef.current.x(x);
    };

    const onCanvasScroll = (e) => {
        const { evt } = e;
        if (evt.shiftKey || evt.wheelDeltaX !== 0) {
            evt.preventDefault();
            headDatesScaleRef.current.x(headDatesScaleRef.current.x() - evt.deltaY);
            mainGridRef.current.x(mainGridRef.current.x() - evt.deltaY);
            setBounds();
        }
    };

    const moveToDate = (date = moment(), scale = 'DAY') => {
        const {
            DIMENSIONS: { VALUE },
        } = SCALING_VALUES[scale];
        const scaledCellWidth = getScaledCellWidth(scale);
        const isAfterToday = moment(date).isSameOrAfter(moment());
        const diff = moment().startOf(VALUE).diff(moment(date), 'days', !isAfterToday);
        const stage = mainGridRef.current;
        const timelineStage = headDatesScaleRef.current;
        stage.x(Math.round(diff) * scaledCellWidth);
        timelineStage.x(Math.round(diff) * scaledCellWidth);
        setBounds();
    };

    const setBounds = () => {
        const stage = mainGridRef.current;
        const startIndex = Math.floor((-stage.x() - stage.width()) / CELL_WIDTH);
        const endIndex = Math.floor((-stage.x() + stage.width() * 2) / CELL_WIDTH);
        setDataRange([startIndex, endIndex]);
    };

    const minusScale = () => {
        if (scale > 0) {
            setScale(scale - 1);
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
                setSiderExpanded={setSiderExpanded}
                dataRange={dataRange}
                moveToDate={moveToDate}
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
                />
                <div className={styles.innerFlex}>
                    <RoadmapGrid
                        visibleStages={visibleStages}
                        scale={SCALES[scale]}
                        ref={mainGridRef}
                        data={data}
                        setData={setData}
                        dataRange={dataRange}
                        setBounds={setBounds}
                        onCanvasDrag={onCanvasDrag}
                        onCanvasScroll={onCanvasScroll}
                    />
                    <div className={styles.backgroundStagesLayout}>
                        {offsetItems.map((el) => {
                            const [rect] = el.getChildren((rect) => rect.getType('STAGE_LINE'));
                            const color = rect?.getAttr('fill');
                            const isVisible = el.isClientRectOnScreen();
                            const xStageStart = -mainGridRef.current.x();
                            const xRectEnd = el.width() + el.x();
                            const position = xStageStart - xRectEnd > 0 ? '-10px' : 'calc(100% - 10px)';

                            return (
                                <div
                                    key={el.attrs.id}
                                    style={{
                                        position: 'absolute',
                                        width: 20,
                                        height: STAGE_HEIGHT,
                                        backgroundColor: color,
                                        left: !isVisible ? position : '-100%',
                                        top: el.y(),
                                        opacity: !isVisible ? 1 : 0,
                                        borderRadius: 5,
                                        zIndex: -1,
                                        transition: 'opacity 0.5s ease',
                                    }}
                                ></div>
                            );
                        })}
                    </div>
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
                            onChange={onScaleChange}
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

export default App;
