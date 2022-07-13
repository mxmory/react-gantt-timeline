import React, { useState } from 'react';
import { Layer } from 'react-konva';
import { increaseColorBrightness, getPrevVisibleItems } from '../../../utils/funcs';
import { CoreStage } from '../CoreStage';
import { TaskItemLine } from '../TaskItemLine';
import { StageSection } from '../StageSection';
import { DataLayerProps } from './types';

export const DataLayer: React.FC<DataLayerProps> = ({ scale, data, setData, visibleStages }) => {
    const [selectedId, selectShape] = useState<string | null>(null);
    const [isTransforming, setIsTransforming] = useState(false);

    const onDeselect = () => {
        if (!isTransforming) {
            selectShape(null);
        }
    };

    return (
        <Layer id="DATA_LAYER">
            {data.map((stage, stageIdx) => {
                const { stages, tasks, color } = stage;
                const prevStages = [...data.slice(0, stageIdx)];
                const prevItemsCount = getPrevVisibleItems(prevStages, visibleStages).length;
                const currentLine = prevItemsCount + stageIdx;

                return (
                    <React.Fragment key={stage.id}>
                        <CoreStage scale={scale} stage={stage} line={currentLine} />

                        {visibleStages[stage.id] &&
                            tasks &&
                            tasks.map((task, taskIdx) => {
                                return (
                                    <TaskItemLine
                                        key={task.id}
                                        scale={scale}
                                        task={task}
                                        stageId={stage.id}
                                        line={currentLine + taskIdx + 1}
                                        // onTransformStart //after
                                        // onTransformEnd // after
                                        data={data}
                                        setData={setData}
                                    />
                                );
                            })}
                        {visibleStages[stage.id] &&
                            stages.map((el, idx) => {
                                return (
                                    <StageSection
                                        visibleStages={visibleStages}
                                        data={data}
                                        setData={setData}
                                        scale={scale}
                                        setIsTransforming={setIsTransforming}
                                        select={selectShape}
                                        onDeselect={onDeselect}
                                        selectedId={selectedId}
                                        key={el.id}
                                        allStages={stages}
                                        index={idx}
                                        stage={el}
                                        color={increaseColorBrightness(color, 40)}
                                        currentLine={currentLine + (tasks?.length || 0) + idx + 1}
                                    />
                                );
                            })}
                    </React.Fragment>
                );
            })}
        </Layer>
    );
};
