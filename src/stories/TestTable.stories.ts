// import TestTable from '../components/Table.vue';
// import jsonData from '../data.json';
// import TEntry from '../types/TestTableTypes';
// import getFileType from '../infrastructure/utils/FileUtil.ts';
// import '../index.css';
//
// export default {
//     title: 'FileManager/TestTable',
//     component: TestTable,
// };
//
// const Template = args => ({
//     components: { TestTable },
//     setup() {
//         // console.log("--- Debug : Loading TestTable");
//         return { args };
//     },
//     template: '<Table v-bind="args" />',
// });
//
// const data = jsonData.map(dataItem => {
//     //@ts-ignore
//     return { ...dataItem };
//     // const type = getFileType(dataItem.isFolder ? 'dir' : dataItem.extension);
//     // return { ...dataItem, fileType: type };
// });
//
// const dataTest = [
//     {
//         id: '978e5862-58ff-405a-a2bd-b23510f05bdd',
//         name: 'NEWTESTTTTTTTTasdfsadfasdfASDF',
//         modified: '2021-06-23T12:12:29.000Z',
//         parentUuid: '07839905-f957-490e-a2ef-3c78dae6f5eb',
//         folderName: 'to_be_classified',
//         note: null,
//         deleted: false,
//         extension: 'docx',
//         spaceId: '95be6acb-b7ac-4ccc-b692-d977e1dab6f2',
//     },
// ];
//
// const defaultHeaders = [
//     { displayName: 'Id', key: 'id', enableSorting: true, customTemplate: true },
//     {
//         displayName: 'Name',
//         key: 'name',
//         enableSorting: true,
//         comparer: (entry1, entry2, i) => comparerFunction(entry1, entry2, i),
//     },
//     {
//         displayName: 'Modified',
//         key: 'modified',
//         enableSorting: true,
//         formatter: entry => {
//             if (entry.isFolder) return;
//             const date = new Date(<string>entry.modified);
//             return date.toDateString();
//         },
//     },
//     { displayName: 'Created', key: 'created', enableSorting: true },
//     { displayName: 'Size', key: 'size', enableSorting: true },
// ] as IHeader<TEntry>[];
//
// export const Primary = Template.bind({});
// Primary.args = {
//     // data: dataTest,
//     data: <TEntry[]>data,
//     headers: defaultHeaders,
// };
//
// export const Pagination = Template.bind({});
// Pagination.args = {
//     // data: dataTest,
//     data: <TEntry[]>data,
//     headers: defaultHeaders,
//     withPagination: true,
// };
