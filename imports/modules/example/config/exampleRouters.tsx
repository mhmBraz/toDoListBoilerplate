import React from 'react';
import ExampleContainer from '../ui/pages/exampleContainer';
import { Recurso } from './Recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const exampleRouterList: IRoute[] = [
    {
        path: '/tarefa/:screenState/:exampleId',
        component: ExampleContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_VIEW],
    },
    {
        path: '/tarefa/:screenState',
        component: ExampleContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_CREATE],
    },
    {
        path: '/tarefas',
        component: ExampleContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_VIEW],
    },
];
