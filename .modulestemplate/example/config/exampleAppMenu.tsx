import React from 'react';
import Class from '@mui/icons-material/Class';
import { IAppMenu } from '/imports/modules/modulesTypings';

export const exampleMenuItemList: (IAppMenu | null)[] = [
    {
        path: '/tarefas',
        name: 'Tarefas',
        icon: <Class />,
    },
];
