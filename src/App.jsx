import React, { useState, useEffect } from 'react';
import styles from './App.module.scss';
import { Sider } from './components/Sider/index';
import { useRef } from 'react';
import Head from './components/Head';
import RoadmapGrid from './components/RoadmapGrid';
import { ACTUAL_DATA, SCALING_VALUES, SCALES } from './constants';

const reduceStagesToShow = (data) => data.reduce((acc, stage) => ({ ...acc, [stage.id]: true }), {});

const App = () => {
    const [data, setData] = useState(ACTUAL_DATA.stages);
    const [visibleStages, setVisibleStages] = useState(reduceStagesToShow(data));
    const [dataRange, setDataRange] = useState([]);
    const [siderExpanded, setSiderExpanded] = useState(false);
    const [scale, setScale] = useState(0); // day by default

    const { CELL_WIDTH } = SCALING_VALUES[SCALES[scale]];

    const headDatesScaleRef = useRef();
    const mainGridRef = useRef();

    const toggleStageCollapse = (stageId) => {
        setVisibleStages((prev) => ({ ...prev, [stageId]: !prev[stageId] }));
    };

    const onScaleChange = (e) => {
        const { value } = e.target;
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
        moveToCurrentDate();
    }, [scale]);

    const onCanvasDrag = (e) => {
        const x = e.target.x();
        headDatesScaleRef.current.x(x);
    };

    const onCanvasScroll = (e) => {
        const { evt } = e;
        if (evt.shiftKey) {
            evt.preventDefault();
            headDatesScaleRef.current.x(headDatesScaleRef.current.x() - evt.deltaY);
            mainGridRef.current.x(mainGridRef.current.x() - evt.deltaY);
            setBounds();
        }
    };

    const moveToCurrentDate = () => {
        const stage = mainGridRef.current;
        const timelineStage = headDatesScaleRef.current;
        stage.x(0);
        timelineStage.x(0);
        setBounds();
    };

    const setBounds = () => {
        const stage = mainGridRef.current;
        const startIndex = Math.floor((-stage.x() - stage.width()) / CELL_WIDTH);
        const endIndex = Math.floor((-stage.x() + stage.width() * 2) / CELL_WIDTH);
        setDataRange([startIndex, endIndex]);
    };

    return (
        <div className={styles.main}>
            <Head
                scale={SCALES[scale]}
                ref={headDatesScaleRef}
                siderExpanded={siderExpanded}
                setSiderExpanded={setSiderExpanded}
                dataRange={dataRange}
                moveToCurrentDate={moveToCurrentDate}
            />
            <div className={styles.flex}>
                <Sider
                    siderExpanded={siderExpanded}
                    data={data}
                    setData={setData}
                    toggleStageCollapse={toggleStageCollapse}
                    visibleStages={visibleStages}
                />
                <RoadmapGrid
                    scale={SCALES[scale]}
                    ref={mainGridRef}
                    data={data}
                    setData={setData}
                    dataRange={dataRange}
                    setBounds={setBounds}
                    onCanvasDrag={onCanvasDrag}
                    onCanvasScroll={onCanvasScroll}
                />
                <div className={styles.scalePanel}>
                    <input
                        type="range"
                        id="scale"
                        name="scale"
                        min="0"
                        max="3"
                        value={scale}
                        step="1"
                        onInput={onScaleChange}
                    />
                    <label htmlFor="scale">Scale: {SCALES[scale]}</label>
                </div>
            </div>
        </div>
    );
};

export default App;
