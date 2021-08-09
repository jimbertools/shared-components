<template>
    <div class='h-full overflow-y-auto'>
        <table class="w-full bg-white dark:bg-gray-800 select-none" @dragleave="dragLeave">
            <thead>
                <tr>
                    <th
                        class="sticky top-0 py-2 bg-white dark:bg-black text-gray-600 dark:text-gray-400 font-normal text-left text-sm cursor-pointer hover:text-gray-400"
                        :class="{ hidden: header?.displayWidth >= windowWidth }"
                        v-for="header in headers"
                        @click="sortData(String(header.key))"
                        :key="header.key"
                    >
                        <slot :name="`header-${header}`" :header="header">
                            {{ header.displayName }}
                        </slot>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr
                    class='h-8 md:h-12 border-gray-300 cursor-pointer'
                    v-for="data in dataList"
                    :key="data"
                    :class ="[(data.isFolder && draggingOverData !== undefined && draggingOverData.id === data.id && selectedDatas.findIndex(selected => selected.id === data.id)) < 0 ? 'border-t-2 border-b-2 border-yellow-400' : 'border-t',
                            !isDragging ? 'hover:bg-gray-100': '',
                            selectedDatas.includes(data) ? 'bg-blue-100 hover:bg-blue-50': '',
                    ]"
                    @click.ctrl.exact="e => addItemToSelect(data)"
                    @click.exact="e => selectItem(data)"
                    @click.shift.exact="e => selectRange(data)"
                    @dblclick.stop='(e)=>openItem(data)'
                    :draggable="dragAndDrop ? 'true' : 'false'"
                    @drop.prevent="e => dragDrop(data)"
                    @dragend.prevent="$emit(Emits.StopDragging)"
                    @dragstart="e => dragStart(e, data)"
                    @dragover.prevent="e => dragOver(data)"
                >
                    <td
                        v-for="header in headers"
                        :data-name="`data-${header.key}`"
                        :key="data[header.key]"
                        class="text-sm text-gray-800 dark:text-gray-100 tracking-normal leading-4"
                        :class="{ hidden: header?.displayWidth >= windowWidth }"
                    >
                        <slot :name="`data-${header.key}`" :data="data[header.key]" :row="data">
                            {{ header.formatter ? header.formatter(data) : data[header.key] }}
                        </slot>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div id="dragImage" class="absolute" style="z-index: -100;">
        <div class="pl-1 pt-1">
            <em class="fas fa-copy" />
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref, onMounted, onUnmounted } from 'vue';
    import { IHeader, ISort, TEntry, IMoveItems, ISelectedChange, SelectionAction } from '../../infrastructure/types/FileManagerTypes';
    import { orderBy } from '../../infrastructure/utils/SortUtil';
    import { TableEmits as Emits } from './index';

    export default defineComponent({
        name: 'Table',
        props: {
            data: { type: Array as () => any[], required: true },
            headers: { type: Object as () => IHeader<any>[], required: true },
            page: { type: Number, required: false, default: 1 },
            pageSize: { type: Number, required: false, default: 10 },
            total: { type: Number, required: false },
            backendPaginationSorting: { type: Boolean, required: false, default: false },
            withPagination: { type: Boolean, required: false, default: false },
            defaultSort: { type: Object as PropType<ISort>, required: false },
            rowClass: { type: String, required: false },
            dragAndDrop: { type: Boolean, required: false, default: false },
            selectable: { type: Boolean, required: false, default: false },
            multiSelect: { type: Boolean, required: false, default: false }
        },
        setup(props, { emit }) {
            const sort = ref<ISort | undefined>(props.defaultSort);
            const currentPage = ref<number>(props.page);
            const currentPageSize = ref<number>(props.pageSize);
            let windowWidth = ref(window?.innerWidth);

            const dataList = computed(() => {
                let tempData = props.data;
                if (props.backendPaginationSorting) return tempData;

                if (sort.value) tempData = orderBy(tempData, sort.value, props.headers);

                if (props.withPagination) tempData = tempData.slice((currentPage.value - 1) * currentPageSize.value, currentPage.value * currentPageSize.value);

                return tempData;
            });

            const onWidthChange = () => (windowWidth.value = window.innerWidth);
            onMounted(() => window.addEventListener('resize', onWidthChange));
            onUnmounted(() => window.removeEventListener('resize', onWidthChange));

            const displayColumn = (col: IHeader<any>): boolean => {
                if (!col.displayWidth) return false;
                return window.innerWidth >= col.displayWidth;
            };

            const sortData = (header: string) => {
                if (sort && sort.value && sort.value.prop == header) {
                    sort.value.order = sort.value.order === 'descending' ? 'ascending' : 'descending';
                    return;
                }
                sort.value = {
                    order: 'ascending',
                    prop: header,
                };
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
                if (!props.multiSelect) {
                    return;
                }
                let initPosition = dataList.value.findIndex( dataListEntry => dataListEntry.id == initRangeSelectionData.value?.id);
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

            const dragStart = (e:any, data: TEntry) => {
                if (selectedDatas.value.findIndex(sel => sel.id == data.id) === -1) {
                    selectedDatas.value = [data];
                }
                e.dataTransfer.setData("text/plain", JSON.stringify(selectedDatas.value));
                e.dataTransfer.setDragImage(document.getElementById('dragImage'),2,2)
                isDragging.value = true;
                emit(Emits.StartDragging)
            };

            const dragOver = (data: TEntry) => {
                draggingOverData.value = data;
            };

            const dragLeave = () => {
                draggingOverData.value = undefined
            }

            const dragDrop = (data: TEntry) => {
                if (data.isFolder && !selectedDatas.value.includes(data)) {
                    emit(Emits.MoveItems, <IMoveItems>{
                        source: selectedDatas.value,
                        destination: data,
                    });
                    isDragging.value = false;
                    draggingOverData.value = undefined;
                }
                emit(Emits.StopDragging)
            };

            const openItem = (data: TEntry) => {
                draggingOverData.value = undefined;
                initRangeSelectionData.value = undefined;
                isDragging.value = false;
                selectedDatas.value = [];
                previousRangeSelectionData.value = [];

                emit(Emits.OpenItem, data);
            };

            return {
                dataList,
                sort,
                sortData,
                paginatedData,
                handleSortChanged,
                handlePageChanged,
                handleSizeChanged,
                Emits,
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
            };
        },
    });
</script>

<style></style>
