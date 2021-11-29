import GridView from './GridView.vue';

enum GridViewEmits {
    SortChanged = 'sort-changed',
    PageChanged = 'page-changed',
    PageSizeChanged = 'page-size-changed',
}

export { GridView, GridViewEmits };
