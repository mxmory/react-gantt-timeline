export const width = 300;
export const height = 300;
export const padding = 30;
export const STAGE_HEIGHT = 6;
export const TASK_HEIGHT = 20;

// export const ACTUAL_DATA = {
//     stages: [
//         {
//             id: '0',
//             type: 'core',
//             name: 'Main stage 1',
//             color: '#ff00ff',
//             start_at: '2022-06-15',
//             deadline: '2022-06-24',
//         },
//         {
//             id: '1',
//             type: 'core',
//             name: 'Main stage 2',
//             color: '#ffff00',
//             start_at: '2022-06-19',
//             deadline: '2022-06-26',
//         },
//     ],
// };

export const ACTUAL_DATA = {
    stages: [
        {
            id: '0',
            type: 'core',
            name: 'Main stage 1',
            stages: [
                {
                    id: '00',
                    type: 'stage',
                    name: 'Aboba stage #1',
                    start_at: '2022-06-05',
                    deadline: '2022-06-19',
                    // tasks: [
                    //     {
                    //         id: 'task_01_1',
                    //         start_at: 3,
                    //         length: 3,
                    //     },
                    // ],
                    stages: [
                        {
                            id: '001',
                            type: 'milestone',
                            name: 'Milestone 1',
                            start_at: '2022-06-05',
                            deadline: '2022-06-05',
                        },
                        {
                            id: '000',
                            type: 'stage',
                            name: 'Test stage',
                            start_at: '2022-06-08',
                            deadline: '2022-06-12',
                            stages: [
                                {
                                    id: '0000',
                                    type: 'stage',
                                    name: 'Test stage',
                                    start_at: '2022-06-10',
                                    deadline: '2022-06-21',

                                    // tasks: [
                                    //     {
                                    //         id: 'task_0000_1',
                                    //         start_at: 12,
                                    //         length: 3,
                                    //     },
                                    //     {
                                    //         id: 'task_0000_2',
                                    //         start_at: 12,
                                    //         length: 9,
                                    //     },
                                    //     {
                                    //         id: 'task_0000_3',
                                    //         start_at: 18,
                                    //         length: 3,
                                    //     },
                                    // ],
                                },
                                {
                                    id: '0001',
                                    type: 'milestone',
                                    name: 'Milestone 3',
                                    start_at: '2022-06-19',
                                    deadline: '2022-06-19',
                                },
                            ],
                        },
                    ],
                },
            ],
            // tasks: [
            //     {
            //         id: 'task_0_1',
            //         start_at: 3,
            //         length: 5,
            //     },
            // ],
        },
        {
            id: '1',
            type: 'core',
            name: 'Main stage 2',
            stages: [
                {
                    id: '10',
                    type: 'stage',
                    name: 'Stage 10',
                    start_at: '2022-06-15',
                    deadline: '2022-06-25',
                },
            ],
        },
    ],
};
