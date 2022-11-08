import React from 'react';
import ExampleContainer from '../ui/pages/exampleContainer';
import { Recurso } from './Recursos';
import { IRoute } from '/imports/modules/modulesTypings';

export const exampleRouterList: IRoute[] = [
    {
        path: '/tarsdsdefas',
        component: ExampleContainer,
        isProtected: true,
        resources: [Recurso.EXAMPLE_VIEW],
    },
];
