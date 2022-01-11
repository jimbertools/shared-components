import FileManager from './FileManager.vue';

enum FileManagerEmits {
    SearchChanged = 'search-changed',
    SortChanged = 'sort-changed',
    SelectedChanged = 'selected-changed',
    OpenItem = 'open-item',
    DoSearch = 'do-search',
    MoveItems = 'move-items',
    StartInternalDrag = 'start-internal-drag',
    StopInternalDrag = 'stop-internal-drag',
}

enum FileManagerView {
    List = 'list',
    Grid = 'grid',
}

export { FileManager, FileManagerEmits, FileManagerView };
