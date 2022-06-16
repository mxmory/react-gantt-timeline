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
                    name: 'Aboba stage #1',
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
                            id: '001',
                            type: 'milestone',
                            name: 'Milestone 1',
                            start_at: 9,
                            length: 1,
                        },
                        {
                            id: '000',
                            type: 'stage',
                            name: 'Test stage',
                            start_at: 7,
                            length: 15,
                            stages: [
                                {
                                    id: '0000',
                                    type: 'stage',
                                    name: 'Test stage',
                                    start_at: 7,
                                    length: 5,
                                    stages: [
                                        {
                                            id: '00000',
                                            type: 'stage',
                                            name: 'Test stage',
                                            start_at: 7,
                                            length: 5,
                                            tasks: [
                                                {
                                                    id: 'task_00000_1',
                                                    start_at: 10,
                                                    length: 8,
                                                },
                                                {
                                                    id: 'task_00000_2',
                                                    start_at: 16,
                                                    length: 6,
                                                },
                                                {
                                                    id: 'task_00000_3',
                                                    start_at: 22,
                                                    length: 3,
                                                },
                                            ],
                                        },
                                        {
                                            id: '000000',
                                            type: 'stage',
                                            name: 'Test stage',
                                            start_at: 7,
                                            length: 5,
                                            tasks: [
                                                {
                                                    id: 'task_000000_1',
                                                    start_at: 12,
                                                    length: 3,
                                                },
                                                {
                                                    id: 'task_000000_2',
                                                    start_at: 15,
                                                    length: 9,
                                                },
                                                {
                                                    id: 'task_000000_3',
                                                    start_at: 18,
                                                    length: 7,
                                                },
                                            ],
                                        },
                                        {
                                            id: '000001',
                                            type: 'milestone',
                                            name: 'Milestone 1',
                                            start_at: 12,
                                            length: 1,
                                        },
                                    ],
                                    tasks: [
                                        {
                                            id: 'task_0000_1',
                                            start_at: 12,
                                            length: 3,
                                        },
                                        {
                                            id: 'task_0000_2',
                                            start_at: 12,
                                            length: 9,
                                        },
                                        {
                                            id: 'task_0000_3',
                                            start_at: 18,
                                            length: 3,
                                        },
                                    ],
                                },
                                {
                                    id: '0001',
                                    type: 'milestone',
                                    name: 'Milestone 1',
                                    start_at: 15,
                                    length: 1,
                                },
                            ],
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
                            name: 'Test stage',
                            start_at: 10,
                            length: 5,
                            tasks: [
                                {
                                    id: 'task_100_1',
                                    start_at: 12,
                                    length: 5,
                                },
                            ],
                        },
                        {
                            id: '101',
                            type: 'stage',
                            name: 'Test stage',
                            start_at: 10,
                            length: 5,
                            tasks: [
                                {
                                    id: 'task_1111_1',
                                    start_at: 16,
                                    length: 6,
                                },
                            ],
                        },
                        {
                            id: '102',
                            type: 'stage',
                            name: 'Tak vot 2',
                            start_at: 10,
                            length: 16,
                            tasks: [
                                {
                                    id: 'task_1111_1',
                                    start_at: 6,
                                    length: 10,
                                },
                                {
                                    id: 'task_1112_1',
                                    start_at: 7,
                                    length: 7,
                                },
                            ],
                        },
                        {
                            id: '103',
                            type: 'milestone',
                            name: 'Milestone #2',
                            start_at: 11,
                            length: 1,
                        },
                    ],
                },
            ],
        },
    ],
};
