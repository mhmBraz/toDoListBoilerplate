import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import _ from 'lodash';
import Add from '@mui/icons-material/Add';
import Fab from '@mui/material/Fab';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '/imports/libs/searchUtils';
import shortid from 'shortid';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import CheckField from '/imports/ui/components/SimpleFormFields/CheckBoxField/CheckBoxField';
import {
    IDefaultContainerProps,
    IDefaultListProps,
    IMeteorError,
} from '/imports/typings/BoilerplateDefaultTypings';
import { IToDos } from '../../api/toDosSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { Recurso } from '../../config/Recursos';
import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { Avatar, Box, ListItem, ListItemAvatar, ListItemText, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { exampleApi } from '/imports/modules/example/api/exampleApi';

interface IToDosList extends IDefaultListProps {
    remove: (doc: IToDos) => void;
    save: (doc: IToDos) => void;
    viewComplexTable: boolean;
    setViewComplexTable: (_enable: boolean) => void;
    toDoss: IToDos[];
    toDossCompletion: IToDos[];
    setFilter: (newFilter: Object) => void;
    setFilterCompletion: (newFilter: Object) => void;
    setPageCompletion: (page: number) => void;
    clearFilter: () => void;
    changeCompletion: any; // tratar
}

const ToDosList = (props: IToDosList) => {
    const {
        toDoss,
        toDossCompletion,
        navigate,
        remove,
        showDeleteDialog,
        showModal,
        onSearch,
        total,
        loading,
        viewComplexTable,
        setViewComplexTable,
        setFilter,
        setFilterCompletion,
        clearFilter,
        setPage,
        setPageCompletion,
        setPageSize,
        searchBy,
        pageProperties,
        isMobile,
        user,
        save,
        changeCompletion,
    } = props;

    let page = 1;
    const idToDos = shortid.generate();

    const [text, setText] = React.useState(searchBy || '');

    const onClick = (_event: React.SyntheticEvent, id: string) => {
        navigate('/tarefa/view/' + id);
    };

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearFilter();

        if (e.target.value.length !== 0) {
            onSearch(e.target.value);
        } else {
            onSearch();
        }

        setText(e.target.value);
    };

    const click = (_e: any) => {
        if (text && text.trim().length > 0) {
            onSearch(text.trim());
        } else {
            onSearch();
        }
    };

    const callRemove = (doc: IToDos) => {
        const title = 'Remover exemplo';
        const message = `Deseja remover o exemplo "${doc.title}"?`;
        showDeleteDialog && showDeleteDialog(title, message, doc, remove);
    };

    const callChangeCompletion = (doc: IToDos) => {
        changeCompletion({ id: doc._id, completion: !doc.completion }, (e, r) => {
            console.log('error', e);
            console.log('result', r);
        });
    };
    return (
        <PageLayout title={'Tarefas'} actions={[]}>
            <>
                <TextField
                    name={'pesquisar'}
                    label={'Pesquisar'}
                    value={text}
                    onChange={change}
                    placeholder="Digite aqui o que deseja pesquisa..."
                    action={{ icon: 'search', onClick: click }}
                    sx={{ width: 300 }}
                />

                <Box>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>Não concluídas ({toDoss.length})</Typography>
                        </AccordionSummary>
                        {toDoss.map((task, index) => {
                            return (
                                <AccordionDetails
                                    key={index}
                                    onClick={() => {
                                        showModal({
                                            title: 'Tarefa',
                                            url: `/tarefa/view/${task._id}`,
                                        });
                                    }}
                                >
                                    <ListItem sx={{ marginBottom: 2 }} key={index}>
                                        <Box sx={{ display: 'flex', minWidth: 400 }}>
                                            <CheckField
                                                value={task.completion}
                                                onChange={() => callChangeCompletion(task)}
                                                key={index}
                                            ></CheckField>
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
                                            <Box sx={{ display: 'flex', gap: 5 }}>
                                                <Fab
                                                    id={'edit'}
                                                    onClick={(e) => onClick(e, task._id)}
                                                    color={'primary'}
                                                >
                                                    <EditIcon />
                                                </Fab>
                                                <Fab
                                                    id={'add'}
                                                    onClick={(e) => callRemove(task)}
                                                    color={'primary'}
                                                >
                                                    <DeleteIcon />
                                                </Fab>
                                            </Box>
                                        )}
                                    </ListItem>
                                </AccordionDetails>
                            );
                        })}
                    </Accordion>
                </Box>

                <Box sx={{ marginTop: 20 }}>
                    <Accordion>
                        <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                        >
                            <Typography>concluídas ({toDossCompletion.length})</Typography>
                        </AccordionSummary>
                        {toDossCompletion.map((task, index) => {
                            return (
                                <AccordionDetails key={index}>
                                    <ListItem sx={{ marginBottom: 2 }} key={index}>
                                        <Box sx={{ display: 'flex', minWidth: 400 }}>
                                            <CheckField
                                                value={task.completion}
                                                onChange={() => callChangeCompletion(task)}
                                                key={index}
                                            ></CheckField>
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
                                            <Box sx={{ display: 'flex', gap: 5 }}>
                                                <Fab
                                                    id={'edit'}
                                                    onClick={(e) => onClick(e, task._id)}
                                                    color={'primary'}
                                                >
                                                    <EditIcon />
                                                </Fab>
                                                <Fab
                                                    id={'add'}
                                                    onClick={(e) => callRemove(task)}
                                                    color={'primary'}
                                                >
                                                    <DeleteIcon />
                                                </Fab>
                                            </Box>
                                        )}
                                    </ListItem>
                                </AccordionDetails>
                            );
                        })}
                    </Accordion>
                </Box>
            </>
            <RenderComPermissao recursos={[Recurso.TODOS_CREATE]}>
                <div
                    style={{
                        position: 'fixed',
                        bottom: isMobile ? 80 : 30,
                        right: 30,
                    }}
                >
                    <Fab
                        id={'add'}
                        onClick={() => navigate(`/tarefa/create/${idToDos}`)}
                        color={'primary'}
                    >
                        <Add />
                    </Fab>
                </div>
            </RenderComPermissao>
        </PageLayout>
    );
};

export const subscribeConfig = new ReactiveVar<IConfigList & { viewComplexTable: boolean }>({
    pageProperties: {
        currentPage: 1,
        pageSize: 4,
    },
    sortProperties: { field: 'createdat', sortAscending: false },
    filter: {},
    searchBy: null,
    viewComplexTable: false,
});

export const subscribeConfigCompletion = new ReactiveVar<
    IConfigList & { viewComplexTable: boolean }
>({
    pageProperties: {
        currentPage: 1,
        pageSize: 4,
    },
    sortProperties: { field: 'createdat', sortAscending: false },
    filter: {},
    searchBy: null,
    viewComplexTable: false,
});

const toDosSearch = initSearch(
    toDosApi, // API
    subscribeConfig, // ReactiveVar subscribe configurations
    ['title', 'description'] // list of fields
);

let onSearchToDosTyping: any;

const viewComplexTable = new ReactiveVar(false);

export const ToDosListContainer = withTracker((props: IDefaultContainerProps) => {
    const { showNotification, user } = props;

    //Reactive Search/Filter
    const config = subscribeConfig.get();
    const sort = {
        [config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1,
    };
    toDosSearch.setActualConfig(config);

    const filter = { ...config.filter };

    //Collection Subscribe
    const subHandle = toDosApi.subscribe('toDosList', { ...filter });

    const toDoss = subHandle?.ready()
        ? toDosApi.find({ ...filter, completion: false }, { createdat: -1, sort }).fetch()
        : [];
    const toDossCompletion = subHandle?.ready()
        ? toDosApi
              .find(
                  { ...filter, completion: true },
                  {
                      sort,
                  }
              )
              .fetch()
        : [];

    return {
        toDoss,
        toDossCompletion,
        loading: !!subHandle && !subHandle.ready(),
        remove: (doc: IToDos) => {
            toDosApi.remove(doc, (e: IMeteorError) => {
                if (!e) {
                    showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            message: `O exemplo foi removido com sucesso!`,
                        });
                } else {
                    console.log('Error:', e);
                    showNotification &&
                        showNotification({
                            type: 'warning',
                            title: 'Operação não realizada!',
                            message: `Erro ao realizar a operação: ${e.reason}`,
                        });
                }
            });
        },
        changeCompletion: (doc: { _id: string; completion: boolean }, _callback: () => void) => {
            toDosApi.callMethod('changeCompletion', doc, (e: IMeteorError, r: string) => {
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
            });
        },
        save: (doc: IToDos, _callback: () => void) => {
            toDosApi['update'](doc, (e: IMeteorError, r: string) => {
                if (!e) {
                    showNotification &&
                        showNotification({
                            type: 'success',
                            title: 'Operação realizada!',
                            description: `O exemplo foi ${
                                doc.completion ? '' : 'retirado do'
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
            });
        },
        viewComplexTable: viewComplexTable.get(),
        setViewComplexTable: (enableComplexTable: boolean) =>
            viewComplexTable.set(enableComplexTable),
        searchBy: config.searchBy,
        onSearch: (...params: any) => {
            onSearchToDosTyping && clearTimeout(onSearchToDosTyping);
            onSearchToDosTyping = setTimeout(() => {
                config.pageProperties.currentPage = 1;
                subscribeConfig.set(config);
                toDosSearch.onSearch(...params);
            }, 1000);
        },
        total: subHandle ? subHandle.total : toDos.length,
        pageProperties: config.pageProperties,
        filter,
        sort,
        setPage: (page = 1) => {
            config.pageProperties.currentPage = page;
            subscribeConfig.set(config);
        },
        setFilter: (newFilter = {}) => {
            config.filter = { ...filter, ...newFilter };
            Object.keys(config.filter).forEach((key) => {
                if (config.filter[key] === null || config.filter[key] === undefined) {
                    delete config.filter[key];
                }
            });
            subscribeConfig.set(config);
        },
        clearFilter: () => {
            config.filter = {};
            subscribeConfig.set(config);
        },
        setSort: (sort = { field: 'createdat', sortAscending: true }) => {
            config.sortProperties = sort;
            subscribeConfig.set(config);
        },
        setPageSize: (size = 25) => {
            config.pageProperties.pageSize = size;
            subscribeConfig.set(config);
        },
    };
})(showLoading(ToDosList));
