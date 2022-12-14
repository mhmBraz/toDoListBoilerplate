// region Imports
import { Recurso } from '../config/Recursos';
import { toDosSch, IToDos } from './toDosSch';
import { userprofileServerApi } from '/imports/userprofile/api/UserProfileServerApi';
import { ProductServerBase } from '/imports/api/productServerBase';
import { IContext } from '/imports/typings/IContext';
import { check } from 'meteor/check';
import { TaskAlt } from '@mui/icons-material';
import { Meteor } from 'meteor/meteor';
import { getSystemUserProfile, getUser } from '/imports/libs/getUser';
// endregion

class ToDosServerApi extends ProductServerBase<IToDos> {
    constructor() {
        super('toDos', toDosSch, {
            resources: Recurso,
        });

        const self = this;

        this.addTransformedPublication(
            'toDosList',
            (filter = {}, options = {}) => {
                const user = getUser();

                return this.defaultListCollectionPublication({
                    $and: [
                        {
                            $or: [{ $and: [{ private: true }, { createdby: user._id }] }, { private: false }]
                        },
                        filter
                    ],
                }, {
                    ...options,
                    projection: { image: 1, title: 1, description: 1, createdby: 1, completion: 1, type: 1, createdat: 1, private: 1 },
                });
            },
            (doc: IToDos & { nomeUsuario: string }) => {
                const userProfileDoc = userprofileServerApi
                    .getCollectionInstance()
                    .findOne({ _id: doc.createdby });
                return { ...doc, nomeUsuario: userProfileDoc?.username };
            }
        );

        this.addPublication('toDosDetail', (filter = {}) => {
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
            'view/:toDosId',
            (params, options) => {
                console.log('Rest', params);
                if (params.toDosId) {
                    return self
                        .defaultCollectionPublication({
                            _id: params.toDosId,
                        })
                        .fetch();
                } else {
                    return { ...params };
                }
            },
            ['get'],
            {
                //authFunction: (_h, _p) => _p.toDosId === 'flkdsajflkasdjflsa',
            }
        );

        this.registerMethod('changeCompletion', this.serverChangeCompletion);
    }

    serverChangeCompletion = (doc: { id: string; completion: boolean }, context: IContext) => {

        const { user } = context
        let task = this.findOne({ _id: doc.id });

        if (task.createdby !== user._id) {
            throw new Meteor.Error(
                'Opera????o n??o realizada!',
                `Voc?? n??o tem permiss??o para essa a????o!`
            );
        }
        task.completion = doc.completion

        return this.serverUpdate({ _id: task._id, ...task }, context);
    }
}

export const toDosServerApi = new ToDosServerApi();
