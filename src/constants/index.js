export const width = 300;
export const height = 3000;
export const CELL_HEIGHT = 30;
export const CELL_WIDTH = 36;
export const HEADER_TOP_HEIGHT = 20;
export const STAGE_HEIGHT = 6;
export const TASK_HEIGHT = 20;

export const HOLIDAYS = ['2022-06-23', '2022-06-28'];

export const ACTUAL_DATA = {
    stages: [
        {
            id: '0',
            type: 'core',
            color: '#D485D6',
            name: 'Main stage 1',
            stages: [
                {
                    id: '00',
                    type: 'stage',
                    name: 'Aboba stage #1',
                    start_at: '2022-06-05',
                    deadline: '2022-06-19',
                    tasks: [
                        {
                            id: 'task_01_1',
                            start_at: '2022-06-05',
                            deadline: '2022-06-12',
                        },
                    ],
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

                                    tasks: [
                                        {
                                            id: 'task_0000_1',
                                            start_at: '2022-06-10',
                                            deadline: '2022-06-12',
                                        },
                                        {
                                            id: 'task_0000_2',
                                            start_at: '2022-06-11',
                                            deadline: '2022-06-15',
                                        },
                                        {
                                            id: 'task_0000_3',
                                            start_at: '2022-06-9',
                                            deadline: '2022-06-10',
                                        },
                                    ],
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
            tasks: [
                {
                    id: 'task_0_1',
                    start_at: '2022-06-11',
                    deadline: '2022-06-16',
                },
            ],
        },
        {
            id: '1',
            type: 'core',
            color: '#8189D6',
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
        //#region Data
        // {
        //     id: '0',
        //     type: 'core',
        //     name: 'Main stage 1',
        //     stages: [
        //         {
        //             id: '00',
        //             type: 'stage',
        //             name: 'Aboba stage #1',
        //             start_at: '2022-06-05',
        //             deadline: '2022-06-19',
        //             tasks: [
        //                 {
        //                     id: 'task_01_1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-12',
        //                 },
        //             ],
        //             stages: [
        //                 {
        //                     id: '001',
        //                     type: 'milestone',
        //                     name: 'Milestone 1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-05',
        //                 },
        //                 {
        //                     id: '000',
        //                     type: 'stage',
        //                     name: 'Test stage',
        //                     start_at: '2022-06-08',
        //                     deadline: '2022-06-12',
        //                     stages: [
        //                         {
        //                             id: '0000',
        //                             type: 'stage',
        //                             name: 'Test stage',
        //                             start_at: '2022-06-10',
        //                             deadline: '2022-06-21',

        //                             tasks: [
        //                                 {
        //                                     id: 'task_0000_1',
        //                                     start_at: '2022-06-10',
        //                                     deadline: '2022-06-12',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_2',
        //                                     start_at: '2022-06-11',
        //                                     deadline: '2022-06-15',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_3',
        //                                     start_at: '2022-06-9',
        //                                     deadline: '2022-06-10',
        //                                 },
        //                             ],
        //                         },
        //                         {
        //                             id: '0001',
        //                             type: 'milestone',
        //                             name: 'Milestone 3',
        //                             start_at: '2022-06-19',
        //                             deadline: '2022-06-19',
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        //     tasks: [
        //         {
        //             id: 'task_0_1',
        //             start_at: '2022-06-11',
        //             deadline: '2022-06-16',
        //         },
        //     ],
        // },
        // {
        //     id: '1',
        //     type: 'core',
        //     name: 'Main stage 2',
        //     stages: [
        //         {
        //             id: '10',
        //             type: 'stage',
        //             name: 'Stage 10',
        //             start_at: '2022-06-15',
        //             deadline: '2022-06-25',
        //         },
        //     ],
        // },
        // {
        //     id: '0',
        //     type: 'core',
        //     name: 'Main stage 1',
        //     stages: [
        //         {
        //             id: '00',
        //             type: 'stage',
        //             name: 'Aboba stage #1',
        //             start_at: '2022-06-05',
        //             deadline: '2022-06-19',
        //             tasks: [
        //                 {
        //                     id: 'task_01_1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-12',
        //                 },
        //             ],
        //             stages: [
        //                 {
        //                     id: '001',
        //                     type: 'milestone',
        //                     name: 'Milestone 1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-05',
        //                 },
        //                 {
        //                     id: '000',
        //                     type: 'stage',
        //                     name: 'Test stage',
        //                     start_at: '2022-06-08',
        //                     deadline: '2022-06-12',
        //                     stages: [
        //                         {
        //                             id: '0000',
        //                             type: 'stage',
        //                             name: 'Test stage',
        //                             start_at: '2022-06-10',
        //                             deadline: '2022-06-21',

        //                             tasks: [
        //                                 {
        //                                     id: 'task_0000_1',
        //                                     start_at: '2022-06-10',
        //                                     deadline: '2022-06-12',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_2',
        //                                     start_at: '2022-06-11',
        //                                     deadline: '2022-06-15',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_3',
        //                                     start_at: '2022-06-9',
        //                                     deadline: '2022-06-10',
        //                                 },
        //                             ],
        //                         },
        //                         {
        //                             id: '0001',
        //                             type: 'milestone',
        //                             name: 'Milestone 3',
        //                             start_at: '2022-06-19',
        //                             deadline: '2022-06-19',
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        //     tasks: [
        //         {
        //             id: 'task_0_1',
        //             start_at: '2022-06-11',
        //             deadline: '2022-06-16',
        //         },
        //     ],
        // },
        // {
        //     id: '1',
        //     type: 'core',
        //     name: 'Main stage 2',
        //     stages: [
        //         {
        //             id: '10',
        //             type: 'stage',
        //             name: 'Stage 10',
        //             start_at: '2022-06-15',
        //             deadline: '2022-06-25',
        //         },
        //     ],
        // },
        // {
        //     id: '0',
        //     type: 'core',
        //     name: 'Main stage 1',
        //     stages: [
        //         {
        //             id: '00',
        //             type: 'stage',
        //             name: 'Aboba stage #1',
        //             start_at: '2022-06-05',
        //             deadline: '2022-06-19',
        //             tasks: [
        //                 {
        //                     id: 'task_01_1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-12',
        //                 },
        //             ],
        //             stages: [
        //                 {
        //                     id: '001',
        //                     type: 'milestone',
        //                     name: 'Milestone 1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-05',
        //                 },
        //                 {
        //                     id: '000',
        //                     type: 'stage',
        //                     name: 'Test stage',
        //                     start_at: '2022-06-08',
        //                     deadline: '2022-06-12',
        //                     stages: [
        //                         {
        //                             id: '0000',
        //                             type: 'stage',
        //                             name: 'Test stage',
        //                             start_at: '2022-06-10',
        //                             deadline: '2022-06-21',

        //                             tasks: [
        //                                 {
        //                                     id: 'task_0000_1',
        //                                     start_at: '2022-06-10',
        //                                     deadline: '2022-06-12',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_2',
        //                                     start_at: '2022-06-11',
        //                                     deadline: '2022-06-15',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_3',
        //                                     start_at: '2022-06-9',
        //                                     deadline: '2022-06-10',
        //                                 },
        //                             ],
        //                         },
        //                         {
        //                             id: '0001',
        //                             type: 'milestone',
        //                             name: 'Milestone 3',
        //                             start_at: '2022-06-19',
        //                             deadline: '2022-06-19',
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        //     tasks: [
        //         {
        //             id: 'task_0_1',
        //             start_at: '2022-06-11',
        //             deadline: '2022-06-16',
        //         },
        //     ],
        // },
        // {
        //     id: '1',
        //     type: 'core',
        //     name: 'Main stage 2',
        //     stages: [
        //         {
        //             id: '10',
        //             type: 'stage',
        //             name: 'Stage 10',
        //             start_at: '2022-06-15',
        //             deadline: '2022-06-25',
        //         },
        //     ],
        // },
        // {
        //     id: '0',
        //     type: 'core',
        //     name: 'Main stage 1',
        //     stages: [
        //         {
        //             id: '00',
        //             type: 'stage',
        //             name: 'Aboba stage #1',
        //             start_at: '2022-06-05',
        //             deadline: '2022-06-19',
        //             tasks: [
        //                 {
        //                     id: 'task_01_1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-12',
        //                 },
        //             ],
        //             stages: [
        //                 {
        //                     id: '001',
        //                     type: 'milestone',
        //                     name: 'Milestone 1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-05',
        //                 },
        //                 {
        //                     id: '000',
        //                     type: 'stage',
        //                     name: 'Test stage',
        //                     start_at: '2022-06-08',
        //                     deadline: '2022-06-12',
        //                     stages: [
        //                         {
        //                             id: '0000',
        //                             type: 'stage',
        //                             name: 'Test stage',
        //                             start_at: '2022-06-10',
        //                             deadline: '2022-06-21',

        //                             tasks: [
        //                                 {
        //                                     id: 'task_0000_1',
        //                                     start_at: '2022-06-10',
        //                                     deadline: '2022-06-12',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_2',
        //                                     start_at: '2022-06-11',
        //                                     deadline: '2022-06-15',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_3',
        //                                     start_at: '2022-06-9',
        //                                     deadline: '2022-06-10',
        //                                 },
        //                             ],
        //                         },
        //                         {
        //                             id: '0001',
        //                             type: 'milestone',
        //                             name: 'Milestone 3',
        //                             start_at: '2022-06-19',
        //                             deadline: '2022-06-19',
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        //     tasks: [
        //         {
        //             id: 'task_0_1',
        //             start_at: '2022-06-11',
        //             deadline: '2022-06-16',
        //         },
        //     ],
        // },
        // {
        //     id: '1',
        //     type: 'core',
        //     name: 'Main stage 2',
        //     stages: [
        //         {
        //             id: '10',
        //             type: 'stage',
        //             name: 'Stage 10',
        //             start_at: '2022-06-15',
        //             deadline: '2022-06-25',
        //         },
        //     ],
        // },
        // {
        //     id: '0',
        //     type: 'core',
        //     name: 'Main stage 1',
        //     stages: [
        //         {
        //             id: '00',
        //             type: 'stage',
        //             name: 'Aboba stage #1',
        //             start_at: '2022-06-05',
        //             deadline: '2022-06-19',
        //             tasks: [
        //                 {
        //                     id: 'task_01_1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-12',
        //                 },
        //             ],
        //             stages: [
        //                 {
        //                     id: '001',
        //                     type: 'milestone',
        //                     name: 'Milestone 1',
        //                     start_at: '2022-06-05',
        //                     deadline: '2022-06-05',
        //                 },
        //                 {
        //                     id: '000',
        //                     type: 'stage',
        //                     name: 'Test stage',
        //                     start_at: '2022-06-08',
        //                     deadline: '2022-06-12',
        //                     stages: [
        //                         {
        //                             id: '0000',
        //                             type: 'stage',
        //                             name: 'Test stage',
        //                             start_at: '2022-06-10',
        //                             deadline: '2022-06-21',

        //                             tasks: [
        //                                 {
        //                                     id: 'task_0000_1',
        //                                     start_at: '2022-06-10',
        //                                     deadline: '2022-06-12',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_2',
        //                                     start_at: '2022-06-11',
        //                                     deadline: '2022-06-15',
        //                                 },
        //                                 {
        //                                     id: 'task_0000_3',
        //                                     start_at: '2022-06-9',
        //                                     deadline: '2022-06-10',
        //                                 },
        //                             ],
        //                         },
        //                         {
        //                             id: '0001',
        //                             type: 'milestone',
        //                             name: 'Milestone 3',
        //                             start_at: '2022-06-19',
        //                             deadline: '2022-06-19',
        //                         },
        //                     ],
        //                 },
        //             ],
        //         },
        //     ],
        //     tasks: [
        //         {
        //             id: 'task_0_1',
        //             start_at: '2022-06-11',
        //             deadline: '2022-06-16',
        //         },
        //     ],
        // },
        // {
        //     id: '1',
        //     type: 'core',
        //     name: 'Main stage 2',
        //     stages: [
        //         {
        //             id: '10',
        //             type: 'stage',
        //             name: 'Stage 10',
        //             start_at: '2022-06-15',
        //             deadline: '2022-06-25',
        //         },
        //     ],
        // },
        //#endregion
    ],
};
