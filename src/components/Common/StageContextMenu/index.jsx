import React, { useState } from 'react';
import { getDataOnStageEdit, getDataOnStageAdd } from '../../../utils/funcs';
import styles from './StageContextMenu.module.scss';
import Modal from 'react-modal';

export const StageContextMenu = ({ stage, data, setData, setMenuVisible }) => {
    const [addModalVisible, setAddModalVisible] = useState(false);
    const editStage = () => {
        const newStages = getDataOnStageEdit(data, { ...stage, name: 'CHANGED' });
        setData(newStages);
    };

    const addStage = (e) => {
        e.preventDefault();
        const inputs = Array.from(e.target.querySelectorAll('input')).map((el) => el.value);
        const [name, start_at, deadline] = inputs;
        const newStage = {
            name,
            start_at,
            deadline,
            type: 'stage',
            id: Math.floor(10 + Math.random() * (10000 - 10 + 1)),
        };
        const newStages = getDataOnStageAdd(data, stage.id, newStage);
        console.log(newStages);
        setData(newStages);
        setAddModalVisible(false);
        setMenuVisible(false);
    };

    return (
        <div className={styles.block}>
            <div className={styles.listItem} onClick={() => setAddModalVisible(true)}>
                + Add stage
                <Modal
                    isOpen={addModalVisible}
                    onRequestClose={() => setAddModalVisible(false)}
                    contentLabel="Add stage"
                    style={{
                        content: { width: 300, height: '500' },
                        overlay: { zIndex: 100, backgroundColor: 'rgba(70,70,70,0.5)' },
                    }}
                >
                    <form onSubmit={addStage}>
                        <div>
                            <div>
                                <label htmlFor="name">Name</label>
                            </div>
                            <div>
                                <input type="text" name="name" />
                            </div>
                        </div>
                        <br />
                        <div>
                            <div>
                                <label htmlFor="start_at">Start at</label>
                            </div>
                            <div>
                                <input type="date" name="start_at" />
                            </div>
                        </div>
                        <br />
                        <div>
                            <div>
                                <label htmlFor="deadline">Name</label>
                            </div>
                            <div>
                                <input type="date" name="deadline" />
                            </div>
                        </div>
                        <br />
                        <button type="submit">Ok</button>
                    </form>
                </Modal>
            </div>
        </div>
    );
};
