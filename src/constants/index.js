export const width = 4000;
export const height = 3000;
export const padding = 30;
export const STAGE_HEIGHT = 6;
export const TASK_HEIGHT = 20;

export const ACTUAL_DATA = {
    stages: [
        {
            id: '0',
            type: 'core',
            name: 'Core stage 1',
            color: '#ff00ff',
            start_at: 3,
            stages: [
                {
                    id: '00',
                    type: 'stage',
                    name: 'Aboba',
                    start_at: 5,
                    length: 5,
                    tasks: [
                        {
                            id: 'task_01_1',
                            start_at: 3,
                            length: 3,
                        },
                    ],
                    stages: [
                        {
                            id: '000',
                            type: 'stage',
                            name: 'Test stage',
                            start_at: 7,
                            length: 5,
                        },
                        {
                            id: '001',
                            type: 'milestone',
                            name: 'Milestone 1',
                            start_at: 8,
                            length: 1,
                        },
                    ],
                },
            ],
            tasks: [
                {
                    id: 'task_0_1',
                    start_at: 3,
                    length: 5,
                },
            ],
        },
        {
            id: '1',
            type: 'core',
            name: 'Core stage 2',
            color: '#ffff00',
            start_at: 9,
            stages: [
                {
                    id: '10',
                    type: 'stage',
                    name: 'Stage 10',
                    start_at: 9,
                    length: 5,
                    stages: [
                        {
                            id: '100',
                            type: 'stage',
                            name: 'Tak vot',
                            start_at: 10,
                            length: 5,
                            tasks: [
                                {
                                    id: 'task_100_1',
                                    start_at: 11,
                                    length: 5,
                                },
                            ],
                        },
                        {
                            id: '101',
                            type: 'milestone',
                            name: 'Milestone #2',
                            start_at: 11,
                            length: 2,
                        },
                    ],
                },
            ],
        },
    ],
};
