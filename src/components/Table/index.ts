import Table from './Table.vue';

export enum TableEmits {
    UpdateDefaultSort = 'update:defaultSort',
    SortChanged = 'sort-changed',
    PageChanged = 'page-changed',
    PageSizeChanged = 'page-size-changed',
    MoveItems = 'move-items',
    SelectedChanged = 'selected-changed',
    OpenItem = 'open-item',
    DropItems = 'drop-items',
    StartDragging = 'start-dragging',
    StopDragging = 'stop-dragging',
    TriggerLoadMore = 'trigger-load-more',
    DataFilterUpdate = 'data-filter-update',
    DataFilterClear = 'data-filter-clear',
}

export enum JTableAlignment {
    START = 'left',
    CENTER = 'center',
    END = 'right',
}

export enum SortType {
    ASCENDING = 'ASC',
    DESCENDING = 'DESC',
}

export interface INavigateWithSingleClick {
    basePath: string;
    navigationKey: string;
}

export { Table };
