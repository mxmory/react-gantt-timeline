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
            stages: [
                {
                    id: '00',
                    type: 'stage',
                    name: 'Aboba',
                    tasks: [
                        {
                            id: 'task_01_1',
                        },
                    ],
                    stages: [
                        {
                            id: '000',
                            type: 'stage',
                            name: 'Test stage',
                        },
                        {
                            id: '001',
                            type: 'milestone',
                            name: 'Milestone 1',
                        },
                    ],
                },
            ],
        },
        {
            id: '1',
            type: 'core',
            name: 'Core stage 2',
            color: '#ffff00',
            stages: [
                {
                    id: '10',
                    type: 'stage',
                    name: 'Kak dela',
                    stages: [
                        {
                            id: '100',
                            type: 'stage',
                            name: 'Tak vot',
                            tasks: [
                                {
                                    id: 'task_100_1',
                                },
                            ],
                        },
                        {
                            id: '101',
                            type: 'milestone',
                            name: 'Milestone #2',
                        },
                    ],
                },
            ],
        },
    ],
};

export const initialData = {
    stages: [
        {
            id: 0,
            name: 'Stage #1',
            tasks: [
                {
                    id: 11,
                    name: 'Task #11',
                    start_at: 3,
                    length: 3,
                    color: '#A9E5BB',
                    percent: 100,
                },
                {
                    id: 12,
                    name: 'Task #12',
                    start_at: 6,
                    length: 3,
                    color: '#F72C25',
                    percent: 100,
                },
            ],
        },
        {
            id: 1,
            name: 'Stage #2',
            tasks: [
                {
                    id: 21,
                    name: 'Task #21',
                    start_at: 7,
                    length: 3,
                    color: '#A76D60',
                    percent: 0,
                },
                {
                    id: 22,
                    name: 'Task #22',
                    start_at: 9,
                    length: 12,
                    color: '#601700',
                    percent: 70,
                },
            ],
        },
        {
            id: 2,
            name: 'Stage #3',
            tasks: [
                {
                    id: 31,
                    name: 'Task #31',
                    start_at: 10,
                    length: 5,
                    color: '#96CDFF',
                    percent: 50,
                },
                {
                    id: 32,
                    name: 'Task #32',
                    start_at: 15,
                    length: 3,
                    color: '#DBBADD',
                    percent: 20,
                },
                {
                    id: 33,
                    name: 'Task #33',
                    start_at: 20,
                    length: 6,
                    color: '#BE92A2',
                    percent: 70,
                },
            ],
        },
        {
            id: 3,
            name: 'Stage #4',
            tasks: [
                {
                    id: 41,
                    name: 'Task #41',
                    start_at: 21,
                    length: 3,
                    color: '#88B7B5',
                    percent: 90,
                },
                {
                    id: 42,
                    name: 'Task #42',
                    start_at: 25,
                    length: 6,
                    color: '#449DD1',
                    percent: 15,
                },
                {
                    id: 43,
                    name: 'Task #43',
                    start_at: 25,
                    length: 6,
                    color: '#449DD1',
                    percent: 25,
                },
            ],
        },
    ],
};
