import React from 'react';
import {
    DataGrid,
    GridActionsCellItem,
    GridColumnHeaderParams,
    GridColumns,
    GridFilterModel,
    GridRenderCellParams,
    GridRowId,
    GridRowIdGetter,
    GridRowParams,
    MuiEvent,
    ptBR,
    GRID_CHECKBOX_SELECTION_COL_DEF,
} from '@mui/x-data-grid';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import { Variant } from '@mui/material/styles/createTypography';
import { complexTableStyle } from './ComplexTableStyle';
import { Toolbar } from './Toolbar';
import {
    GridColumnGroupHeaderParams,
    GridColumnGroupingModel,
} from '@mui/x-data-grid/models/gridColumnGrouping';
import { Tooltip } from '@mui/material';

interface ISchema {
    [key: string]: any;
}

type onClickFunction = (row: any) => void;
interface IAction {
    icon: JSX.Element;
    label: string;
    onClick: onClickFunction;
}

interface IConditionalAction {
    condition: (row: any) => boolean;
    if: {
        icon: JSX.Element;
        label: string;
        onClick: onClickFunction;
    };
    else?: {
        icon: JSX.Element;
        label: string;
        onClick: onClickFunction;
    };
}

export interface IToolbarOptions {
    searchFilter?: boolean;
    density?: boolean;
    selectColumns?: boolean;
    exportTable?: {
        print?: boolean;
        csv?: boolean;
    };
}

interface IComplexTableProps {
    /**
     * Dados que compõem as linhas da tabela.
     */
    data: any[];
    /**
     * Schema dos dados na tabela. Indica quais colunas estarão presentes.
     */
    schema: ISchema;
    /**
     * Função callback ativada quando se clica em uma linha
     * @param {GridRowParams} row Linha que foi clicada. É do tipo [[GridRowParams]].
     */
    onRowClick?: (row: GridRowParams) => void;
    /**
     * Variante do texto da header de cada coluna.
     */
    headerVariant?: Variant;
    /**
     * Variante do texto das linhas.
     */
    rowVariant?: Variant;
    /**
     * Placeholder do campo de pesquisa na tabela, caso exista.
     */
    searchPlaceholder?: string;
    /**
     * Função callback ativada para deletar uma linha. Se é especificada, então há uma action de deleção.
     * @param {any} row Linha que está sendo deletada.
     */
    onDelete?: onClickFunction;
    /**
     * Função callback ativada para editar uma linha. Se é especificada, então há uma action de edição.
     * @param {any} row Linha que está sendo editada.
     */
    onEdit?: onClickFunction;
    /**
     * Array com as actions que devem ter na tabela, exceto deleção e edição que são especificadas pelas
     * callbacks onDelete e onEdit. Deve especificar um ícone, uma label e uma callback para cada action.
     */
    actions?: IAction[];
    /**
     * Array com actions que devem ter na tabela e cuja renderização depende de uma condição. Deve especificar
     * um ícone, uma label e uma callback para cada action e para cada condição. Se não é espeficicada uma action
     * para o caso de "else", então não é renderizada.
     */
    conditionalActions?: IConditionalAction[];
    /**
     * Variante dos botões presentes na tabela.
     */
    buttonVariant?: 'text' | 'outlined' | 'contained';
    /**
     * Objeto com especificações de quais componentes da toolbar devem ser renderizados. Se não é definido,
     * então a toolbar não é renderizada.
     */
    toolbar?: IToolbarOptions;
    /**
     * Função callback que define o comportamento do campo de pesquisa, caso exista. Se não é definida e há
     * o campo de pesquisa, então a pesquisa é feita usando a implementação padrão do Datagrid.
     * @param {string} nextText Novo texto inserido na pesquisa.
     */
    onFilterChange?: (newText: string) => void;
    /**
     * Quando é passado, indica se os dados na tabela ainda estão sendo carregados para que seja carregado um
     * componente visual de carregamento.
     */
    loading?: boolean;
    /**
     * Função callback que é usada para abrir o modal de filtros na visualização mobile. Se não é definido, então
     * não há a opção de abrir o modal.
     */
    openFilterModal?: () => void;
    /**
     * Largura (em px) na qual o ícone do modal de filtro deve começar a ser exibido.
     * @default 600
     */
    filterIconWidth?: number;
    /**
     * Função usada para obter o identificador em uma linha na tabela. Por padrão, o ComplexTable busca o atributo _id,
     * mas caso esse atributo não esteja definido, é possível usar outro atributo como identificador a partir dessa função.
     * @param {any} row Linha onde está sendo buscado o identificador.
     * @returns {GridRowId} O atributo na linha que é usado como identificador.
     */
    getId?: GridRowIdGetter<any>;
    /**
     * Identificador que tem como objetivo se comunicar com o SimpleForm, só é necessário quando utilizando como child do SimpleForm.
     */
    id?: 'complexTable';
    /**
     * Prop que muda a height padrão do componente;
     */
    heightCustomizada?: string;
    /**
     * Prop que define o valor inicial da seleção de linhas na tabela. É um array com IDs de elementos na tabela.
     */
    selectionModel?: GridRowId[];
    /**
     * Função usada para atualizar o valor da prop selectionModel.
     */
    setSelectionModel?: (selection: GridRowId[]) => void;
    /**
     * Prop que controla os grupos de colunas. É necessario passar um objeto com o seguinte esquema para essa prop
     * obj:{
     *  	groupId: <id_do_grupo>
     * 		headerName: <nome_da_coluna_do_grupo>
     * 		children:[{field: <campo_no_esquema_para_agrupar>}]
     * 	}
     */
    groupColumns?: GridColumnGroupingModel;

    /**
     *  Determina se mantem a altura padrão
     * @default true
     */
    autoHeight?: boolean;

    /**
     *  Função que renderiza as células específicas determinadas no parâmetro fieldsRenderCellModified
     * @param {GridRenderCellParams} params
     */
    renderCellModified?: (params: GridRenderCellParams) => JSX.Element;

    /**
     *  Objeto contendo os campos a serem renderizados pela função renderCellModified
     */
    fieldsRenderCellModified?: { [key: string]: any };
}

export const locale = {
    ...ptBR.components.MuiDataGrid.defaultProps.localeText,
    toolbarExportPrint: 'Imprimir',
    noRowsLabel: 'Nenhum resultado encontrado.',
    toolbarColumns: 'Exibir colunas',
};

export const ComplexTable = (props: IComplexTableProps) => {
    const {
        data,
        schema,
        headerVariant,
        rowVariant,
        searchPlaceholder,
        actions,
        conditionalActions,
        buttonVariant,
        toolbar,
        loading,
        filterIconWidth,
        onFilterChange,
        onRowClick,
        onDelete,
        onEdit,
        openFilterModal,
        getId,
        heightCustomizada,
        selectionModel,
        setSelectionModel,
        groupColumns,
        autoHeight,
        renderCellModified,
        fieldsRenderCellModified,
    } = props;

    locale.toolbarQuickFilterPlaceholder = searchPlaceholder ?? 'Pesquisar';

    const transformData = (value: any, type: Function) => {
        if (Array.isArray(value)) return value.join();
        else if (type === Object) {
            return Object.keys(value).reduce((prev: string, curr: string) => {
                return !!value[curr] ? prev + `${curr}: ${value[curr]}\n` : prev + '\n';
            }, '');
        } else if (type === Date) return value.toLocaleDateString();
        else return value;
    };
    const renderHeader = (params: GridColumnHeaderParams) => (
        <Typography variant={headerVariant ?? 'h5'}>{params.colDef.headerName}</Typography>
    );

    const renderHeaderGroup = (params: GridColumnGroupHeaderParams) => (
        <Typography variant={headerVariant ?? 'h5'}>{params.headerName}</Typography>
    );

    const transformGroup = (params: GridColumnGroupingModel) => {
        return params.map((value) => {
            return !value.renderHeaderGroup ? { ...value, renderHeaderGroup } : value;
        });
    };

    const groupIds = (value: GridColumnGroupingModel) => {
        return value.map((group) => group);
    };

    const groupColumsTransform = groupColumns ? transformGroup(groupColumns) : undefined;

    const columns: GridColumns = Object.keys(schema).map((key: string) => {
        return {
            field: key,
            headerName: schema[key].label,
            flex: 1,
            minWidth: 150,
            renderHeader,
            renderHeaderGroup,
            groupPath: groupColumsTransform ? groupIds(groupColumsTransform) : [],
            renderCell: !fieldsRenderCellModified?.hasOwnProperty(key)
                ? (params: GridRenderCellParams) => {
                      if (schema[key].isImage || schema[key].isAvatar) {
                          return (
                              <Box
                                  component="img"
                                  sx={complexTableStyle.renderImg}
                                  src={params.value}
                                  onError={(e: React.BaseSyntheticEvent) => {
                                      e.target.onerror = null;
                                      e.target.src = '/images/wireframe/imagem_default.png';
                                  }}
                              />
                          );
                      } else {
                          const value = transformData(params.value, schema[key].type);
                          return (
                              <Tooltip title={value} arrow={true}>
                                  <Typography
                                      variant={rowVariant ?? 'body1'}
                                      sx={complexTableStyle.rowText}
                                  >
                                      {value}
                                  </Typography>
                              </Tooltip>
                          );
                      }
                  }
                : renderCellModified,
        };
    });

    columns.unshift({
        ...GRID_CHECKBOX_SELECTION_COL_DEF,
        hideable: false,
    });

    if (
        !!onDelete ||
        !!onEdit ||
        (!!actions && actions.length > 0) ||
        (!!conditionalActions && conditionalActions.length > 0)
    ) {
        columns.push({
            field: 'actions',
            type: 'actions',
            headerName: 'Ações',
            flex: 0.5,
            minWidth: 70,
            headerAlign: 'center',
            hideable: false,
            renderHeader,
            getActions: (params: GridRowParams) => {
                const renderActions = !!actions ? [...actions] : [];
                if (!!onDelete)
                    renderActions.unshift({
                        icon: <Delete />,
                        label: 'Deletar',
                        onClick: onDelete,
                    });

                if (!!onEdit)
                    renderActions.unshift({ icon: <Edit />, label: 'Editar', onClick: onEdit });

                if (!!conditionalActions) {
                    conditionalActions.forEach((action: IConditionalAction) => {
                        if (action.condition(params.row)) {
                            renderActions.push({
                                icon: action.if.icon,
                                label: action.if.label,
                                onClick: action.if.onClick,
                            });
                        } else if (!!action.else) {
                            renderActions.push({
                                icon: action.else.icon,
                                label: action.else.label,
                                onClick: action.else.onClick,
                            });
                        }
                    });
                }

                return renderActions.map((action: IAction) => {
                    return (
                        <GridActionsCellItem
                            label={action.label}
                            icon={action.icon}
                            sx={complexTableStyle.actionsMenu}
                            onClick={(evt: React.SyntheticEvent) => {
                                evt.stopPropagation();
                                action.onClick(params.row);
                            }}
                            showInMenu={renderActions.length > 2}
                        />
                    );
                });
            },
        });
    }

    const [selection, setSelection] = React.useState<GridRowId[]>([]);

    React.useEffect(() => {
        if (setSelectionModel !== undefined && selectionModel !== undefined)
            setSelectionModel(selection);
    }, [selection]);

    React.useEffect(() => {
        if (selection?.length === 0 && selectionModel && selectionModel.length > 0)
            setSelection(selectionModel);
    }, [selectionModel]);

    return (
        <Box sx={{ ...complexTableStyle.container, height: heightCustomizada ?? '90%' }}>
            <DataGrid
                sx={complexTableStyle.hideScrollBar}
                autoHeight={autoHeight ?? true}
                experimentalFeatures={{ columnGrouping: true }}
                columnGroupingModel={groupColumsTransform ?? undefined}
                rows={data}
                columns={columns}
                rowCount={data?.length}
                localeText={locale}
                getRowId={!!getId ? getId : (row) => row._id}
                onSelectionModelChange={(newSelection) => setSelection(newSelection)}
                selectionModel={selection}
                onRowClick={
                    !!onRowClick
                        ? (params: GridRowParams, event: MuiEvent<React.MouseEvent>) => {
                              event.stopPropagation();
                              onRowClick(params);
                          }
                        : undefined
                }
                getRowHeight={() => 'auto'}
                components={{
                    Toolbar: Toolbar,
                    BaseSwitch: Checkbox,
                }}
                componentsProps={{
                    toolbar: {
                        buttonVariant,
                        toolbarOptions: toolbar,
                        openFilterModal,
                        filterIconWidth,
                    },
                    columnsPanel: {
                        sx: { ...complexTableStyle.columnsPanel },
                    },
                    baseButton: {
                        sx: {
                            pb: '0.3em',
                            pt: '0.3em',
                        },
                    },
                }}
                filterMode={!!onFilterChange ? 'server' : 'client'}
                onFilterModelChange={
                    !!onFilterChange
                        ? (model: GridFilterModel) => {
                              const search = model.quickFilterValues![0]
                                  ? model.quickFilterValues![0]
                                  : '';
                              onFilterChange(search);
                          }
                        : undefined
                }
                loading={loading ?? undefined}
                hideFooter
                checkboxSelection
                disableColumnFilter
                disableColumnMenu
            />
        </Box>
    );
};
