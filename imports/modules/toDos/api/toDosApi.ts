// region Imports
import { check } from 'meteor/check';
import { ProductBase } from '../../../api/productBase';
import { toDosSch, IToDos } from './toDosSch';
import { IContext } from '/imports/typings/IContext';

class ToDosApi extends ProductBase<IToDos> {
    constructor() {
        super('toDos', toDosSch, {
            enableCallMethodObserver: true,
            enableSubscribeObserver: true,
        });
    }
}

export const toDosApi = new ToDosApi();
