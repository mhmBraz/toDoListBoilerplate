import { IDoc } from '/imports/typings/IDoc';

export const toDosSch = {
    image: {
        type: String,
        label: 'Imagem',
        defaultValue: '',
        optional: true,
        isImage: true,
    },
    completion: {
        type: Boolean,
        label: 'Completa',
        defaultValue: false,
        optional: true,
    },
    private: {
        type: Boolean,
        label: 'Privado',
        defaultValue: false,
        optional: true,
    },
    title: {
        type: String,
        label: 'Título',
        defaultValue: '',
        optional: false,
    },
    description: {
        type: String,
        label: 'Descrição',
        defaultValue: '',
        optional: true,
    },
    type: {
        type: String,
        label: 'Tipo',
        defaultValue: '',
        optional: false,
        options: [
            { value: 'normal', label: 'Normal' },
            { value: 'hard', label: 'Dificil' },
            { value: 'internal', label: 'Interna' },
            { value: 'extra', label: 'Extra' },
        ],
    },
    typeMulti: {
        type: [String],
        label: 'Tipo com vários valores',
        defaultValue: '',
        optional: false,
        multiple: true,
        visibilityFunction: (doc: any) => !!doc.type && doc.type === 'extra',
        options: [
            { value: 'normal', label: 'Normal' },
            { value: 'extra', label: 'Extra' },
            { value: 'minimo', label: 'Minimo' },
        ],
    },
    date: {
        type: Date,
        label: 'Data',
        defaultValue: '',
        optional: true,
    },
    files: {
        type: [Object],
        label: 'Arquivos',
        defaultValue: '',
        optional: true,
        isUpload: true,
    },
    contacts: {
        type: Object,
        label: 'Contatos',
        defaultValue: '',
        optional: true,
        subSchema: {
            phone: {
                type: String,
                label: 'Telefone',
                defaultValue: '',
                optional: true,
                mask: '(##) ####-####',
            },
            cpf: {
                type: String,
                label: 'CPF',
                defaultValue: '',
                optional: true,
                mask: '###.###.###-##',
            },
        },
    },
    tasks: {
        type: [Object],
        label: 'Tarefas',
        defaultValue: '',
        optional: true,
        subSchema: {
            name: {
                type: String,
                label: 'Nome da Tarefa',
                defaultValue: '',
                optional: true,
            },
            description: {
                type: String,
                label: 'Descrição da Tarefa',
                defaultValue: '',
                optional: true,
            },
        },
    },
    audio: {
        type: String,
        label: 'Áudio',
        defaultValue: '',
        optional: true,
        isAudio: true,
    },
};

export interface IToDos extends IDoc {
    image: string;
    title: string;
    description: string;
    audio: string;
    statusCheck: object;
    statusToggle: boolean;
    nomeUsuario:string;
    type: string;
    completion?: Boolean; //?opcional
    private?: Boolean; //?opcional
}
