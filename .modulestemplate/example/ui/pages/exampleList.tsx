import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { exampleApi } from '../../api/exampleApi';
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
import { IExample } from '../../api/exampleSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { Recurso } from '../../config/Recursos';
import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import {
    Avatar,
    Box,
    Button,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

interface IExampleList extends IDefaultListProps {
    remove: (doc: IExample) => void;
    save: (doc: IExample) => void;
    viewComplexTable: boolean;
    setViewComplexTable: (_enable: boolean) => void;
    examples: IExample[];
    setFilter: (newFilter: Object) => void;
    clearFilter: () => void;
    changeCompletion: any; // tratar
}

const ExampleList = (props: IExampleList) => {
    const {
        examples,
        navigate,
        remove,
        showDeleteDialog,
        onSearch,
        total,
        loading,
        viewComplexTable,
        setViewComplexTable,
        setFilter,
        clearFilter,
        setPage,
        setPageSize,
        searchBy,
        pageProperties,
        isMobile,
        user,
        save,
        changeCompletion,
    } = props;
    let page = 1;
    const idExample = shortid.generate();
    const [text, setText] = React.useState(searchBy || '');

    const onClick = (_event: React.SyntheticEvent, id: string) => {
        navigate('/tarefa/view/' + id);
    };

    const handleClickRowsPerPage = (
        event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null
    ) => {
        page = event?.target.id === 'nextPagination' ? page + 1 : page - 1;

        setPage(page);
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

    const callRemove = (doc: IExample) => {
        const title = 'Remover exemplo';
        const message = `Deseja remover o exemplo "${doc.title}"?`;
        showDeleteDialog && showDeleteDialog(title, message, doc, remove);
    };

    const callChangeCompletion = (doc: IExample) => {
        changeCompletion({ id: doc._id, completion: !doc.completion }, (e, r) => {
            console.log('error', e);
            console.log('result', r);
        });
    };

    return (
        <PageLayout title={'Tarefas'} actions={[]}>
            <Box>
                <h1> Olá, {user.username}</h1>
            </Box>
            <Box>
                <Box>
                    <h4>
                        {' '}
                        Seus projetos muito mais organizados. Veja as tarefas adicionadas por seu
                        time, por você e para você!
                    </h4>
                </Box>
                <Box>
                    <Button
                        key={'b1'}
                        style={{ marginRight: 10 }}
                        color={'secondary'}
                        variant="contained"
                    >
                        Minhas tarefas
                    </Button>
                </Box>
            </Box>
            <>
                <TextField
                    name={'pesquisar'}
                    label={'Pesquisar'}
                    value={text}
                    onChange={change}
                    placeholder="Digite aqui o que deseja pesquisa..."
                    action={{ icon: 'search', onClick: click }}
                />

                <Box sx={{ minHeight: 450 }}>
                    <Box>
                        <h5>Atividades recentes</h5>
                    </Box>
                    <Box sx={{ minHeight: 350 }}>
                        {examples.map((task, index) => {
                            return (
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
                                        <Box>
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
                            );
                        })}
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                        <Fab
                            // disabled={pagination.skip === 0}
                            onClick={handleClickRowsPerPage}
                            sx={{ marginRight: 1 }}
                            id="backPagination"
                            color="primary"
                            aria-label="add"
                        >
                            <ArrowBackIosIcon id="backPagination" />
                        </Fab>
                        <Fab
                            // disabled={examples.length < 4}
                            onClick={handleClickRowsPerPage}
                            id="nextPagination"
                            color="primary"
                            aria-label="add"
                        >
                            <ArrowForwardIosIcon id="nextPagination" />
                        </Fab>
                    </Box>
                </Box>
            </>
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

const exampleSearch = initSearch(
    exampleApi, // API
    subscribeConfig, // ReactiveVar subscribe configurations
    ['title', 'description'] // list of fields
);

let onSearchExampleTyping: any;

const viewComplexTable = new ReactiveVar(false);

export const ExampleListContainer = withTracker((props: IDefaultContainerProps) => {
    const { showNotification } = props;

    //Reactive Search/Filter
    const config = subscribeConfig.get();
    const sort = {
        [config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1,
    };
    exampleSearch.setActualConfig(config);

    //Subscribe parameters
    const filter = { ...config.filter };
    // const filter = filtroPag;
    const limit = config.pageProperties.pageSize;
    const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;

    //Collection Subscribe
    const subHandle = exampleApi.subscribe('exampleList', filter, {
        sort,
        limit,
        skip,
    });
    const examples = subHandle?.ready() ? exampleApi.find(filter, { sort }).fetch() : [];

    return {
        examples,
        loading: !!subHandle && !subHandle.ready(),
        remove: (doc: IExample) => {
            exampleApi.remove(doc, (e: IMeteorError) => {
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
            exampleApi.callMethod('changeCompletion', doc, (e: IMeteorError, r: string) => {
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
        save: (doc: IExample, _callback: () => void) => {
            exampleApi['update'](doc, (e: IMeteorError, r: string) => {
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
            onSearchExampleTyping && clearTimeout(onSearchExampleTyping);
            onSearchExampleTyping = setTimeout(() => {
                config.pageProperties.currentPage = 1;
                subscribeConfig.set(config);
                exampleSearch.onSearch(...params);
            }, 1000);
        },
        total: subHandle ? subHandle.total : examples.length,
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
})(showLoading(ExampleList));
