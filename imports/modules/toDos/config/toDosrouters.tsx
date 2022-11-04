import React from 'react';
import ToDosContainer from '../ui/pages/toDosContainer';

export const toDosRouterList = [
  {
    path: '/toDos/:screenState/:toDosId',
    component: ToDosContainer,
    isProtected: true,
  },
  {
    path: '/toDos/:screenState',
    component: ToDosContainer,
    isProtected: true,
  },
  {
    path: '/toDos',
    component: ToDosContainer,
    isProtected: true,
  },
];
