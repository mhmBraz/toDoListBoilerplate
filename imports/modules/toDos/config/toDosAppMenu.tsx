import React from 'react';
import Class from '@mui/icons-material/Class';
import { IAppMenu } from '/imports/modules/modulesTypings';

export const toDosMenuItemList: (IAppMenu | null)[] = [
    {
        path: '/minhas-tarefas',
        name: 'minhas tarefas',
        icon: <Class />,
    },
];
