// region Imports
import { check } from 'meteor/check';
import { ProductBase } from '../../../api/productBase';
import { exampleSch, IExample } from './exampleSch';
import { IContext } from '/imports/typings/IContext';

class ExampleApi extends ProductBase<IExample> {
    constructor() {
        super('example', exampleSch, {
            enableCallMethodObserver: true,
            enableSubscribeObserver: true,
        });
    }
}

export const exampleApi = new ExampleApi();
