import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { toDosApi } from '../../api/toDosApi';
import { userprofileApi } from '../../../../userprofile/api/UserProfileApi';
import { SimpleTable } from '/imports/ui/components/SimpleTable/SimpleTable';
import _ from 'lodash';
import Add from '@mui/icons-material/Add';
import Delete from '@mui/icons-material/Delete';
import Fab from '@mui/material/Fab';
import TablePagination from '@mui/material/TablePagination';
import { ReactiveVar } from 'meteor/reactive-var';
import { initSearch } from '/imports/libs/searchUtils';
import * as appStyle from '/imports/materialui/styles';
import shortid from 'shortid';
import { PageLayout } from '/imports/ui/layouts/pageLayout';
import TextField from '/imports/ui/components/SimpleFormFields/TextField/TextField';
import SearchDocField from '/imports/ui/components/SimpleFormFields/SearchDocField/SearchDocField';
import {
    IDefaultContainerProps,
    IDefaultListProps,
    IMeteorError,
} from '/imports/typings/BoilerplateDefaultTypings';
import { IToDos } from '../../api/toDosSch';
import { IConfigList } from '/imports/typings/IFilterProperties';
import { Recurso } from '../../config/Recursos';
import { RenderComPermissao } from '/imports/seguranca/ui/components/RenderComPermisao';
import { isMobile } from '/imports/libs/deviceVerify';
import { showLoading } from '/imports/ui/components/Loading/Loading';
import { ComplexTable } from '/imports/ui/components/ComplexTable/ComplexTable';
import ToggleField from '/imports/ui/components/SimpleFormFields/ToggleField/ToggleField';

interface IToDosList extends IDefaultListProps {
    remove: (doc: IToDos) => void;
    viewComplexTable: boolean;
    setViewComplexTable: (_enable: boolean) => void;
    toDoss: IToDos[];
    setFilter: (newFilter: Object) => void;
    clearFilter: () => void;
}

const ToDosList = (props: IToDosList) => {
    const {
        toDoss,
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
    } = props;

    const idToDos = shortid.generate();

    const onClick = (_event: React.SyntheticEvent, id: string) => {
        navigate('/toDos/view/' + id);
    };

    const handleChangePage = (
        _event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
        newPage: number
    ) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setPageSize(parseInt(event.target.value, 10));
        setPage(1);
    };

    const [text, setText] = React.useState(searchBy || '');

    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        clearFilter();
        if (text.length !== 0 && e.target.value.length === 0) {
            onSearch();
        }
        setText(e.target.value);
    };
    const keyPress = (_e: React.SyntheticEvent) => {
        // if (e.key === 'Enter') {
        if (text && text.trim().length > 0) {
            onSearch(text.trim());
        } else {
            onSearch();
        }
        // }
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

    const handleSearchDocChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        !!e.target.value ? setFilter({ createdby: e.target.value }) : clearFilter();
    };

    // @ts-ignore
    // @ts-ignore
    return (
        <PageLayout title={'Lista de Exemplos'} actions={[]}>
            <SearchDocField
                api={userprofileApi}
                subscribe={'getListOfusers'}
                getOptionLabel={(doc) => doc.username || 'error'}
                sort={{ username: 1 }}
                textToQueryFilter={(textoPesquisa) => {
                    textoPesquisa = textoPesquisa.replace(/[+[\\?()*]/g, '\\$&');
                    return { username: new RegExp(textoPesquisa, 'i') };
                }}
                autocompleteOptions={{ noOptionsText: 'Não encontrado' }}
                name={'userId'}
                label={'Pesquisar com SearchDocField'}
                onChange={handleSearchDocChange}
                placeholder={'Todos'}
                showAll={false}
                key={'SearchDocKey'}
            />

            {!isMobile && (
                <ToggleField
                    label={'Habilitar ComplexTable'}
                    value={viewComplexTable}
                    onChange={(evt: { target: { value: boolean } }) => {
                        console.log('evt', evt, evt.target);
                        setViewComplexTable(evt.target.value);
                    }}
                />
            )}
            {(!viewComplexTable || isMobile) && (
                <>
                    <TextField
                        name={'pesquisar'}
                        label={'Pesquisar'}
                        value={text}
                        onChange={change}
                        onKeyPress={keyPress}
                        placeholder="Digite aqui o que deseja pesquisa..."
                        action={{ icon: 'search', onClick: click }}
                    />

                    <SimpleTable
                        schema={_.pick(
                            {
                                ...toDosApi.schema,
                                nomeUsuario: { type: String, label: 'Criado por' },
                            },
                            ['image', 'title', 'description', 'nomeUsuario']
                        )}
                        data={toDoss}
                        onClick={onClick}
                        actions={[{ icon: <Delete />, id: 'delete', onClick: callRemove }]}
                    />
                </>
            )}

            {!isMobile && viewComplexTable && (
                <ComplexTable
                    data={toDoss}
                    schema={_.pick(
                        {
                            ...toDosApi.schema,
                            nomeUsuario: { type: String, label: 'Criado por' },
                        },
                        ['image', 'title', 'description', 'nomeUsuario']
                    )}
                    onRowClick={(row) => navigate('/toDos/view/' + row.id)}
                    searchPlaceholder={'Pesquisar exemplo'}
                    onDelete={callRemove}
                    onEdit={(row) => navigate('/toDos/edit/' + row._id)}
                    toolbar={{
                        selectColumns: true,
                        exportTable: { csv: true, print: true },
                        searchFilter: true,
                    }}
                    onFilterChange={onSearch}
                    loading={loading}
                />
            )}

            <div
                style={{
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'center',
                }}
            >
                <TablePagination
                    style={{ width: 'fit-content', overflow: 'unset' }}
                    rowsPerPageOptions={[10, 25, 50, 100]}
                    labelRowsPerPage={''}
                    component="div"
                    count={total || 0}
                    rowsPerPage={pageProperties.pageSize}
                    page={pageProperties.currentPage - 1}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                    SelectProps={{
                        inputProps: { 'aria-label': 'rows per page' },
                    }}
                />
            </div>

            <RenderComPermissao recursos={[Recurso.EXAMPLE_CREATE]}>
                <div
                    style={{
                        position: 'fixed',
                        bottom: isMobile ? 80 : 30,
                        right: 30,
                    }}
                >
                    <Fab
                        id={'add'}
                        onClick={() => navigate(`/toDos/create/${idToDos}`)}
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
        pageSize: 25,
    },
    sortProperties: { field: 'createdat', sortAscending: true },
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
    const { showNotification } = props;

    //Reactive Search/Filter
    const config = subscribeConfig.get();
    const sort = {
        [config.sortProperties.field]: config.sortProperties.sortAscending ? 1 : -1,
    };
    toDosSearch.setActualConfig(config);

    //Subscribe parameters
    const filter = { ...config.filter };
    // const filter = filtroPag;
    const limit = config.pageProperties.pageSize;
    const skip = (config.pageProperties.currentPage - 1) * config.pageProperties.pageSize;

    //Collection Subscribe
    const subHandle = toDosApi.subscribe('toDosList', filter, {
        sort,
        limit,
        skip,
    });
    const toDoss = subHandle?.ready() ? toDosApi.find(filter, { sort }).fetch() : [];

    return {
        toDoss,
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
        total: subHandle ? subHandle.total : toDoss.length,
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
