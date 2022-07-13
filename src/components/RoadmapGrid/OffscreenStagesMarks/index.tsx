import React from 'react';
import styles from './OffscreenStagesMarks.module.scss';
import { STAGE_HEIGHT } from '../../../constants/index';
import Konva from 'konva';

const OffscreenStagesMarks: React.ForwardRefRenderFunction<Konva.Stage, { marks: Konva.Group[] }> = (
    { marks },
    mainGridRef
) => {
    return (
        <div className={styles.backgroundStagesLayout}>
            {marks.map((el) => {
                const [rect] = el.getChildren((rect) => rect.getAttrs().type === 'STAGE_LINE');
                const color = rect?.getAttr('fill');
                const isVisible = el.isClientRectOnScreen();
                const xStageStart = -(mainGridRef as React.MutableRefObject<Konva.Stage>)?.current.x();
                const xRectEnd = el.width() + el.x();
                const position = xStageStart - xRectEnd > 0 ? '-10px' : 'calc(100% - 10px)';

                return (
                    <div
                        key={el.attrs.id}
                        className={styles.mark}
                        style={{
                            height: STAGE_HEIGHT,
                            backgroundColor: color,
                            left: !isVisible ? position : '-100%',
                            top: el.y(),
                            opacity: !isVisible ? 1 : 0,
                        }}
                    />
                );
            })}
        </div>
    );
};

export default React.forwardRef(OffscreenStagesMarks);
