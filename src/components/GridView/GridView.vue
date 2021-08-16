<template>
    <div>
        <div class="full-w flex flex-row flex-wrap p-2" :class="gridClass">
            <div v-for="item in dataList" class="item">
                <slot name="grid-item" :item="item"></slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue';
    import { IHeader, ISort } from '../../infrastructure/types/FileManagerTypes';
    import { orderBy } from '../../infrastructure/utils/SortUtil';
    import { GridViewEmits as Emits} from './index';

    function defineGenericComponent<T>() {
        return defineComponent({
            name: 'GridView',
            props: {
                data: { type: Array as PropType<Array<T>>, required: true },
                headers: { type: Array as PropType<IHeader<T>[]>, required: true },
                page: { type: Number, required: false, default: 1 },
                pageSize: { type: Number, required: false, default: 10 },
                total: { type: Number, required: false },
                backendPaginationSorting: { type: Boolean, required: false, default: false },
                withPagination: { type: Boolean, required: false, default: false },
                defaultSort: { type: Object as PropType<ISort>, required: false },
                gridClass: { type: String, required: false },
            },
            emits: Object.values(Emits),
            setup(props, { emit }) {
                const currentPage = ref<number>(props.page);
                const currentPageSize = ref<number>(props.pageSize);
                const dataList = computed(() => {
                    let tempData = props.data;
                    if (props.backendPaginationSorting) return tempData;

                    if (props.defaultSort) tempData = orderBy(tempData, props.defaultSort, props.headers);

                    if (props.withPagination) tempData = tempData.slice((currentPage.value - 1) * currentPageSize.value, currentPage.value * currentPageSize.value);

                    return tempData;
                });

                // const sortHeader = (header: string) => {
                //     sort.value = {
                //         prop: header,
                //         order: sort.value?.order === 'descending' ? 'ascending' : 'descending',
                //     } as ISort;
                // };
                //
                // const sortDirection = (direction: 'ascending' | 'descending') => {
                //     sort.value = {
                //         ...(sort.value ?? {}),
                //         order: direction,
                //     } as ISort;
                // };

                const paginatedData = computed(() => {
                    if (!props.withPagination) return props.data;
                    return props.data.slice((currentPageSize.value - 1) * currentPageSize.value, currentPageSize.value * currentPageSize.value);
                });

                const handleSortChanged = (sortEvent: ISort) => {
                    if (!props.backendPaginationSorting) return;
                    emit(Emits.SortChanged, sortEvent);
                };

                const handlePageChanged = (pageEvent: number) => {
                    if (props.backendPaginationSorting) {
                        emit(Emits.PageChanged, pageEvent);
                        return;
                    }
                    currentPage.value = pageEvent;
                };

                const handleSizeChanged = (sizeEvent: number) => {
                    if (props.backendPaginationSorting) {
                        emit(Emits.PageSizeChanged, sizeEvent);
                        return;
                    }
                    currentPageSize.value = sizeEvent;
                };

                return {
                    dataList,
                    paginatedData,
                    handleSortChanged,
                    handlePageChanged,
                    handleSizeChanged,
                    Emits,
                    currentPage,
                    currentPageSize,
                };
            },
        });
    }

    export default defineGenericComponent();
</script>

<style scoped>
    .item {
        flex-grow: 0;
        word-wrap: break-word;
    }
</style>
