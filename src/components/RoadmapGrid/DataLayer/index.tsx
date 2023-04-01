import React, { useState } from 'react';
import { Layer } from 'react-konva';
import { getPrevVisibleItems } from '../../../utils/funcs';
import { StageSection } from '../StageSection';
import { DataLayerProps } from './types';

export const DataLayer: React.FC<DataLayerProps> = ({ scale, data, visibleStages }) => {
    const [selectedId, selectShape] = useState<string | null>(null);
    const [isTransforming, setIsTransforming] = useState(false);

    const onDeselect = () => {
        if (!isTransforming) {
            selectShape(null);
        }
    };

    return (
        <Layer id="DATA_LAYER">
            {data.map((stage, idx) => {
                const { stages, tasks, color, id } = stage;
                const prevStages = [...data.slice(0, idx)];
                const prevItemsCount = getPrevVisibleItems(prevStages, visibleStages).length;

                return (
                    <StageSection
                        key={id}
                        visibleStages={visibleStages}
                        data={data}
                        scale={scale}
                        setIsTransforming={setIsTransforming}
                        select={selectShape}
                        onDeselect={onDeselect}
                        selectedId={selectedId}
                        allSiblingStages={stages}
                        index={idx}
                        stage={stage}
                        color={color}
                        core={true}
                        currentLine={prevItemsCount + (tasks?.length || 0) + idx}
                    />
                );
            })}
        </Layer>
    );
};
