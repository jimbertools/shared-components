<template>
    <div class="flex flex-col min-h-0 overflow-auto h-full">
        <div
            v-if="searchOptions?.enableSearch || $slots.buttons"
            class="flex items-center mb-2"
            :class="{ 'justify-end': !searchOptions?.enableSearch, 'justify-between': searchOptions?.enableSearch }"
        >
            <SearchBar
                v-if="searchOptions?.enableSearch"
                class="flex w-full justify-between items-end"
                :data="data"
                :options="searchOptions.options"
                :enumOptions="searchOptions.enumOptions"
                :matchCase="searchOptions.matchCase"
                @update:searchValue="dataFilterUpdate"
                @update:searchClear="dataFilterClear"
                @update:appliedFilters="$emit('update:applied-filters', $event)"
                :whitelistedOptions="searchOptions.whitelistedOptions"
                :blacklistedOptions="searchOptions.blacklistedOptions"
                :backend-search="backendPaginationSorting"
            />
            <slot name="buttons" />
        </div>
        <div
            ref="tableContainer"
            class="flex flex-col min-h-0 overflow-auto h-min border border-gray-300 dark:border-dark-200"
            :class="{ 'sm:rounded-md rounded-borders': roundedBorder }"
        >
            <table class="min-w-full divide-y divide-gray300 dark:divide-dark-200">
                <thead class="bg-gray-50 sticky z-20 dark:bg-dark-400" style="z-index: 20">
                    <tr>
                        <th
                            scope="col"
                            class="sticky top-0 bg-gray-50 dark:bg-dark-400 px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-100 uppercase tracking-wider"
                            :class="{
                                hidden: header?.displayWidth && header?.displayWidth >= windowWidth,
                                'cursor-default': !header.enableSorting,
                                'cursor-pointer hover:text-gray-400 dark:hover:text-gray-50': header.enableSorting,
                            }"
                            v-for="header in headers"
                            @click="sortData(header)"
                            :key="`${header.key}${sort ? sort.prop + '_' + sort.order : ''}`"
                        >
                            <div class="flex flex-row items-center">
                                <slot :name="`header-${header.key}`" :header="header">
                                    {{ header.displayName }}
                                </slot>
                                <div class="flex flex-col ml-2 w-4 h-7" v-if="header.enableSorting">
                                    <ChevronUpIcon
                                        class="text-gray-400 dark:text-gray-50 h-4"
                                        :class="{ 'text-primary-600': sort && sort.prop === header.key && sort.order === SortType.ASCENDING }"
                                    ></ChevronUpIcon>
                                    <ChevronDownIcon
                                        class="text-gray-400 dark:text-gray-50 h-4"
                                        :class="{ 'text-primary-600': sort && sort.prop === header.key && sort.order === SortType.DESCENDING }"
                                    ></ChevronDownIcon>
                                </div>
                            </div>
                        </th>
                    </tr>
                </thead>
                <tbody class="relative z-10">
                    <tr
                        v-if="!isLoading && dataList.length > 0"
                        v-for="(data, index) in dataList"
                        :key="data"
                        class="border-b border-gray-100 dark:border-dark-200"
                        :class="[
                            (data.isFolder && draggingOverData !== undefined && draggingOverData.id === data.id && selectedDatas.findIndex(selected => selected.id === data.id)) < 0
                                ? 'border-t-2 border-b-2 border-yellow-400'
                                : 'border-t',
                            !isDragging && (selectable || multiSelect || openWithSingleClick) ? 'hover:bg-gray-100 dark:hover:bg-dark-400' : '',
                            selectable || multiSelect || openWithSingleClick ? 'cursor-pointer' : '',
                            selectedDatas.includes(data) ? 'bg-blue-100 hover:bg-blue-50' : '',
                            index % 2 === 0 ? 'bg-white dark:bg-dark-300' : 'bg-gray-50 dark:bg-dark-200',
                        ]"
                        @click.ctrl.exact="addItemToSelect(data)"
                        @click.exact="selectItem(data)"
                        @click.shift.exact="selectRange(data)"
                        @dblclick.stop="openItem(data)"
                        :draggable="dragAndDrop ? 'true' : 'false'"
                        @drop.prevent="dragDrop(data)"
                        @dragend.prevent="$emit(Emits.StopDragging)"
                        @dragstart="e => dragStart(e, data)"
                        @dragover.prevent="dragOver(data)"
                        @drag="e => drag(e)"
                        @dragend="dragEnd"
                    >
                        <a v-if="navigateWithSingleClick" :href="navigateWithSingleClick.basePath + '/' + data[navigateWithSingleClick.navigationKey]" class="block">
                            <TableCell v-for="header in headers" :header="header" :data="data" :windowWidth="windowWidth" />
                        </a>
                        <TableCell v-else v-for="header in headers" :header="header" :data="data" :windowWidth="windowWidth" />
                    </tr>
                    <tr v-else class="dark:bg-dark-300">
                        <td :colspan="headers.length" class="relative px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                            <div class="w-full flex flex-row justify-center items-center">
                                {{ emptyMessage }}
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="isLoading" class="w-full flex flex-row justify-center items-center mt-2">
                <span class="flex flex-col items-center mt-2">
                    <svg class="w-8 h-8 animate-spin -ml-1 mr-3 h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="text-primary opacity-60" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path
                            class="opacity-50"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                    </svg>
                    <slot name="loading"> Loading items... </slot>
                </span>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, onMounted, onUnmounted, PropType, ref } from 'vue';
    import { IHeader, IMoveItems, ISelectedChange, ISort, SelectionAction, TEntry } from '@/infrastructure/types/FileManagerTypes';
    import { orderBy } from '@/infrastructure/utils/SortUtil';
    import { SortType, TableEmits as Emits, INavigateWithSingleClick } from './index';
    import { SearchBar } from '@/components/SearchBar';
    import { SearchOptions } from '@/types/TableTypes';
    import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/vue/solid';
    import TableCell from './TableCell.vue';

    export default defineComponent({
        name: 'Table',
        props: {
            data: { type: Array as () => any[], required: true },
            emptyMessage: { type: String, required: false, default: '' },
            headers: { type: Object as () => IHeader<any>[], required: true },
            page: { type: Number, required: false, default: 1 },
            pageSize: { type: Number, required: false, default: 10 },
            total: { type: Number, required: false },
            backendPaginationSorting: { type: Boolean, required: false, default: false },
            withPagination: { type: Boolean, required: false, default: false },
            openWithSingleClick: { type: Boolean, required: false, default: false },
            navigateWithSingleClick: { type: Object as () => INavigateWithSingleClick, required: false, default: null },
            defaultSort: { type: Object as PropType<ISort>, required: false },
            rowClass: { type: String, required: false },
            dragAndDrop: { type: Boolean, required: false, default: false },
            selectable: { type: Boolean, required: false, default: false },
            multiSelect: { type: Boolean, required: false, default: false },
            isSearching: { type: Boolean, required: false, default: false },
            isLoading: { type: Boolean, required: false, default: false },
            searchOptions: { type: Object as PropType<SearchOptions>, required: false },
            roundedBorder: { type: Boolean, required: false, default: true },
        },
        components: {
            SearchBar,
            ChevronDownIcon,
            ChevronUpIcon,
            TableCell,
        },
        emits: [
            'update:defaultSort',
            'sort-changed',
            'page-changed',
            'page-size-changed',
            'move-items',
            'selected-changed',
            'open-item',
            'drop-items',
            'start-dragging',
            'stop-dragging',
            'data-filter-update',
            'data-filter-clear',
            'update:applied-filters',
        ],
        setup(props, { emit }) {
            const tableContainer = ref();
            const sort = ref<ISort | undefined>(props.defaultSort);
            const currentPage = ref<number>(props.page);
            const currentPageSize = ref<number>(props.pageSize);
            const windowWidth = ref<number>(window?.innerWidth);
            const stop = ref<boolean>(false);
            const filteredData = ref<any[]>();
            const isFiltering = ref<boolean>();

            const dataList = computed(() => {
                let tempData = isFiltering.value ? filteredData.value : props.data;

                if (!tempData) return [];

                if (props.backendPaginationSorting) return tempData;

                if (sort.value) tempData = orderBy(tempData, sort.value, props.headers);

                if (props.withPagination) tempData = tempData.slice((currentPage.value - 1) * currentPageSize.value, currentPage.value * currentPageSize.value);

                return tempData;
            });

            const onWidthChange = () => (windowWidth.value = window.innerWidth);
            onMounted(() => window.addEventListener('resize', onWidthChange));
            onUnmounted(() => window.removeEventListener('resize', onWidthChange));

            const dataFilterClear = () => {
                isFiltering.value = false;
                filteredData.value = props.data;
                emit(Emits.DataFilterClear);
            };
            const dataFilterUpdate = (data: any[]) => {
                isFiltering.value = true;
                filteredData.value = data ? data : [];
                emit(Emits.DataFilterUpdate, filteredData.value);
            };

            const displayColumn = (col: IHeader<any>): boolean => {
                if (!col.displayWidth) return false;
                return window.innerWidth >= col.displayWidth;
            };

            const sortData = (header: IHeader<any>) => {
                if (!header.enableSorting) {
                    return;
                }
                const key = String(header.key);
                let order: SortType = SortType.ASCENDING;
                if (sort && sort.value && sort.value.prop == key) {
                    order = sort.value.order === SortType.DESCENDING ? SortType.ASCENDING : SortType.DESCENDING;
                }
                sort.value = {
                    order,
                    prop: key,
                };
                scrollToTop();
                emit(Emits.UpdateDefaultSort, sort.value);
                emit(Emits.SortChanged, { prop: key, order });
            };

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

            const draggingOverData = ref<TEntry>();
            const initRangeSelectionData = ref<TEntry>();
            const isDragging = ref<boolean>(false);
            const selectedDatas = ref<TEntry[]>([]);
            const previousRangeSelectionData = ref<TEntry[]>([]);

            const selectItem = (data: TEntry) => {
                if (props.openWithSingleClick) {
                    openItem(data);
                    return;
                }

                if (!props.selectable) {
                    return;
                }

                if (selectedDatas.value.length == 1 && selectedDatas.value[0].id == data.id) {
                    selectedDatas.value = [];
                } else {
                    selectedDatas.value = [data];
                }

                emit(Emits.SelectedChanged, <ISelectedChange>{
                    selectedItems: selectedDatas.value,
                    selectionAction: SelectionAction.SIMPLE_SELECTION,
                });

                initRangeSelectionData.value = data;
                previousRangeSelectionData.value = [];
            };

            const addItemToSelect = (data: TEntry) => {
                if (props.openWithSingleClick) {
                    return;
                }
                let position = selectedDatas.value.indexOf(data);

                initRangeSelectionData.value = data;
                previousRangeSelectionData.value = [];

                if (position < 0) {
                    selectedDatas.value.push(data);
                } else {
                    selectedDatas.value.splice(position, 1);
                }

                emit(Emits.SelectedChanged, <ISelectedChange>{
                    selectedItems: selectedDatas.value,
                    selectionAction: SelectionAction.ADDING_SELECTION,
                });
            };

            const selectRange = (data: TEntry) => {
                if (!props.multiSelect || props.openWithSingleClick) {
                    return;
                }
                let initPosition = dataList.value.findIndex(dataListEntry => dataListEntry.id == initRangeSelectionData.value?.id);
                let endPosition = dataList.value.findIndex(dataListEntry => dataListEntry.id == data.id);
                if (0 <= initPosition && 0 <= endPosition) {
                    // Remove of all previously selected by range
                    previousRangeSelectionData.value.forEach(data => {
                        let position = selectedDatas.value.indexOf(data);
                        if (0 <= position) {
                            selectedDatas.value.splice(position, 1);
                        }
                    });

                    // Add newly selected
                    let rangeSelectedDatas = [];
                    if (initPosition <= endPosition) {
                        rangeSelectedDatas = dataList.value.slice(initPosition, endPosition + 1);
                    } else {
                        rangeSelectedDatas = dataList.value.slice(endPosition, initPosition + 1);
                    }

                    rangeSelectedDatas.forEach(data => {
                        if (!selectedDatas.value.includes(data)) {
                            selectedDatas.value.push(data);
                        }
                    });

                    previousRangeSelectionData.value = rangeSelectedDatas;
                }

                emit(Emits.SelectedChanged, <ISelectedChange>{
                    selectedItems: selectedDatas.value,
                    selectionAction: SelectionAction.RANGE_SELECTION,
                });
            };

            const dragStart = (e: any, data: TEntry) => {
                if (selectedDatas.value.findIndex(sel => sel.id == data.id) === -1) {
                    selectedDatas.value = [data];
                }
                e.dataTransfer.setData('text/plain', JSON.stringify(selectedDatas.value));
                isDragging.value = true;
                emit(Emits.StartDragging, e);
            };

            const dragOver = (data: TEntry) => {
                draggingOverData.value = data;
            };

            const dragLeave = () => {
                draggingOverData.value = undefined;
            };

            const dragDrop = (data: TEntry) => {
                if (data.isFolder && !selectedDatas.value.includes(data)) {
                    emit(Emits.MoveItems, <IMoveItems>{
                        source: selectedDatas.value,
                        destination: data,
                    });
                    isDragging.value = false;
                    draggingOverData.value = undefined;
                }
                emit(Emits.StopDragging);
            };

            const openItem = (data: TEntry) => {
                draggingOverData.value = undefined;
                initRangeSelectionData.value = undefined;
                isDragging.value = false;
                selectedDatas.value = [];
                previousRangeSelectionData.value = [];

                emit(Emits.OpenItem, data);
            };

            const drag = (e: DragEvent) => {
                const container = document.getElementById('scroll-container')?.getBoundingClientRect();
                if (!container) return;
                stop.value = true;

                if (container.top + 120 > e.clientY) {
                    stop.value = false;
                    scroll(-1);
                    return;
                }

                if (container.top + container.height - 120 < e.clientY) {
                    stop.value = false;
                    scroll(1);
                    return;
                }
            };

            const dragEnd = () => {
                stop.value = true;
            };

            const scroll = function (step: number) {
                const container = document.getElementById('scroll-container');
                if (!container) return;
                const scrollY = container.scrollTop;
                container.scrollTo(0, scrollY + step);
                if (stop.value) return;
                setTimeout(function () {
                    scroll(step);
                }, 20);
            };

            const scrollToTop = () => {
                tableContainer.value.scrollTo({ top: 0, behavior: 'smooth' });
            };

            return {
                tableContainer,
                dataList,
                sort,
                sortData,
                paginatedData,
                handleSortChanged,
                handlePageChanged,
                handleSizeChanged,
                Emits,
                SortType,
                currentPage,
                currentPageSize,
                draggingOverData,
                isDragging,
                initRangeSelectionData,
                selectedDatas,
                selectItem,
                selectRange,
                addItemToSelect,
                dragStart,
                dragOver,
                dragDrop,
                dragLeave,
                openItem,
                displayColumn,
                windowWidth,
                dragEnd,
                drag,
                dataFilterClear,
                dataFilterUpdate,
            };
        },
    });
</script>

<style></style>
