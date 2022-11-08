import React from 'react';
import ToDosContainer from '../ui/pages/toDosContainer';
import { Recurso } from './Recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const toDosRouterList: IRoute[] = [
    {
        path: '/tarefa/:screenState/:toDosId',
        component: ToDosContainer,
        isProtected: true,
        resources: [Recurso.TODOS_VIEW],
    },
    {
        path: '/tarefa/:screenState',
        component: ToDosContainer,
        isProtected: true,
        resources: [Recurso.TODOS_CREATE],
    },
    {
        path: '/minhas-tarefas',
        component: ToDosContainer,
        isProtected: true,
        resources: [Recurso.TODOS_VIEW],
    },
];
