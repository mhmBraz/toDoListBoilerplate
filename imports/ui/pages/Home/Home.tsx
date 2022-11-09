import React from 'react';
import { toDosApi } from '/imports/modules/toDos/api/toDosApi';
import { useTracker } from 'meteor/react-meteor-data';
import { IToDos } from './../../../modules/toDos/api/toDosSch';
import {
    Avatar,
    Box,
    Button,
    Fab,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material';
import { IDefaultContainerProps, IMeteorError } from '/imports/typings/BoilerplateDefaultTypings';
import CheckField from '/imports/ui/components/SimpleFormFields/CheckBoxField/CheckBoxField';
import EditIcon from '@mui/icons-material/Edit';
import { useNavigate } from 'react-router-dom';
import { PageLayout } from '../../layouts/pageLayout';
import { homeStyles } from './HomeStyle';

const Home = (props: IDefaultContainerProps) => {
    const navigate = useNavigate();
    const { user, showNotification } = props;
    const sort = {
        ['createdat']: -1,
    };

    const tasks: IToDos[] = useTracker(() => {
        const subHandle = toDosApi.subscribe(
            'toDosList',
            {},
            {
                createdat: false,
                sort,
                limit: 4,
            }
        );

        const tasks = subHandle?.ready() ? toDosApi.find({}, {}).fetch() : [];

        return tasks;
    });

    const onClick = (_event: React.SyntheticEvent, id: string) => {
        navigate('/tarefa/view/' + id);
    };

    const callChangeCompletion = (doc: IToDos) => {
        if (doc.createdby !== user._id) {
            showNotification &&
                showNotification({
                    type: 'warning',
                    title: 'Operação não realizada!',
                    description: 'Você não tem permissão para essa ação!',
                });

            return;
        }

        toDosApi.callMethod(
            'changeCompletion',
            { id: doc._id, completion: !doc.completion },
            (e: IMeteorError, r: string) => {
                if (!e) {
                    showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            description: `O exemplo foi${
                                doc.completion ? '' : ' retirado do'
                            } completado com sucesso!`,
                        });
                } else {
                    showNotification &&
                        showNotification({
                            type: 'warning',
                            title: 'Operação não realizada!',
                            description: `Erro ao realizar a operação: ${e.reason}`,
                        });
                }
            }
        );
    };

    return (
        <PageLayout title={'Tarefas'} actions={[]}>
            <Box>
                <h1> Olá, {user?.username}</h1>
            </Box>
            <Box>
                <Box>
                    <h4>
                        Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu
                        time, por você e para você!
                    </h4>
                </Box>
            </Box>
            <Box>
                <h4>Atividades recentes</h4>
            </Box>
            <Box style={homeStyles.divTasks}>
                {tasks &&
                    tasks.map((task, index) => {
                        return (
                            <ListItem style={homeStyles.listItem} key={index}>
                                <Box style={homeStyles.BoxItem}>
                                    {user?._id === task.createdby && (
                                        <CheckField
                                            value={task.completion || ''}
                                            onChange={() => callChangeCompletion(task)}
                                            key={index}
                                        ></CheckField>
                                    )}
                                    <ListItemAvatar>
                                        <Avatar alt="Remy Sharp" src={task.image} />
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={
                                            <Typography
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                                sx={{
                                                    textDecoration: task.completion
                                                        ? 'line-through'
                                                        : 'none',
                                                }}
                                            >
                                                {task.title}
                                            </Typography>
                                        }
                                        secondary={
                                            <React.Fragment>
                                                <>
                                                    <Typography
                                                        component="span"
                                                        variant="body2"
                                                        color="text.primary"
                                                    >
                                                        Criado por:{' '}
                                                        {user._id === task.createdby
                                                            ? 'Você'
                                                            : task.nomeUsuario}
                                                    </Typography>
                                                </>
                                            </React.Fragment>
                                        }
                                    />
                                </Box>

                                {user._id === task.createdby && (
                                    <Box>
                                        <Fab
                                            id={'edit'}
                                            onClick={(e) => onClick(e, task._id)}
                                            color={'primary'}
                                        >
                                            <EditIcon />
                                        </Fab>
                                    </Box>
                                )}
                            </ListItem>
                        );
                    })}
            </Box>
            <Box style={homeStyles.BoxMyTasks}>
                <Button
                    key={'b1'}
                    style={homeStyles.BoxMyTasks}
                    onClick={() => navigate(`/minhas-tarefas`)}
                    color={'secondary'}
                    variant="contained"
                >
                    Minhas tarefas
                </Button>
            </Box>
        </PageLayout>
    );
};

export default Home;
