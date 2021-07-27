import Table from './Table.vue';

enum TableEmits {
    SortChanged = 'sort-changed',
    PageChanged = 'page-changed',
    PageSizeChanged = 'page-size-changed',
    MoveItems = 'move-items',
    SelectedChanged = 'selected-changed',
    OpenItem = 'open-item',
    DropItems = 'drop-items',
    StartDragging = 'start-dragging',
    StopDragging = 'stop-dragging',
}

export { Table, TableEmits };
