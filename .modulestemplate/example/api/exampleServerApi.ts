// region Imports
import { Recurso } from '../config/Recursos';
import { exampleSch, IExample } from './exampleSch';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { IContext } from '/imports/typings/IContext';
import { check } from 'meteor/check';
import { TaskAlt } from '@mui/icons-material';
// endregion

class ExampleServerApi extends ProductServerBase<IExample> {
    constructor() {
        super('example', exampleSch, {
            resources: Recurso,
        });

        const self = this;

        this.addTransformedPublication(
            'exampleList',
            (filter = {}, options = {}) => {

                return this.defaultListCollectionPublication(filter, {
                    ...options,
                    projection: { image: 1, title: 1, description: 1, createdby: 1, completion: 1, type: 1 },
                });
            },
            (doc: IExample & { nomeUsuario: string }) => {
                const userProfileDoc = userprofileServerApi
                    .getCollectionInstance()
                    .findOne({ _id: doc.createdby });
                return { ...doc, nomeUsuario: userProfileDoc?.username };
            }
        );

        this.addPublication('exampleDetail', (filter = {}) => {
            return this.defaultDetailCollectionPublication(filter, {});
        });

        this.addRestEndpoint(
            'view',
            (params, options) => {
                console.log('Params', params);
                console.log('options.headers', options.headers);
                return { status: 'ok' };
            },
            ['post']
        );

        this.addRestEndpoint(
            'view/:exampleId',
            (params, options) => {
                console.log('Rest', params);
                if (params.exampleId) {
                    return self
                        .defaultCollectionPublication({
                            _id: params.exampleId,
                        })
                        .fetch();
                } else {
                    return { ...params };
                }
            },
            ['get'],
            {
                //authFunction: (_h, _p) => _p.exampleId === 'flkdsajflkasdjflsa',
            }
        );

        this.registerMethod('changeCompletion', this.serverChangeCompletion);
    }

    serverChangeCompletion = (doc: { id: string; completion: boolean }, context: IContext) => {

        let task: IExample = this.findOne({ _id: doc.id });

        task.completion = doc.completion

        return this.serverUpdate({ _id: task._id, ...task }, context);
    }
}

export const exampleServerApi = new ExampleServerApi();
