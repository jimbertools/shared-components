import FileManager from './FileManager.vue';

enum FileManagerEmits {
    SearchChanged = 'search-changed',
    SortChanged = 'sort-changed',
    SelectedChanged = 'selected-changed',
    OpenItem = 'open-item',
    DoSearch = 'do-search'
}

enum FileManagerView {
    List = 'list',
    Grid = 'grid',
}

export { FileManager as default, FileManagerEmits, FileManagerView };
