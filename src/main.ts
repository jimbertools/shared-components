import { createApp } from 'vue';
import App from '../examples/App.vue'
import './index.css';
// import installElementPlus from './plugins/element'
import '@fortawesome/fontawesome-free/css/all.css';
import '@fortawesome/fontawesome-free/js/all.js';

import FileManagerComponent from  './components/FileManager.vue'
import GridViewComponent from './components/GridView.vue'
import TableComponent from './components/Table.vue'
import TestTableComponent from './components/TestTable.vue'

export const FileManager = FileManagerComponent
export const GridView = GridViewComponent
export const Table = TableComponent
export const TestTable = TestTableComponent

const app = createApp(App)
// installElementPlus(app)
app.mount('#app')
