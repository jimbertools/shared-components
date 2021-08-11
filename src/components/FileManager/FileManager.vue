<template>
    <div class="flex flex-row w-full h-full">
        <div class="flex flex-col flex-1 md:border-r-2 border-grey-100 h-full overflow-x-hidden">
            <div class="flex flex-row items-center mb-4 md:justify-between">
                <div>
                    <Input clearable with-button placeholder="Search..." @[InputEmits.TextChanged]="searchChanged" @[InputEmits.ButtonClicked]="search" />
                </div>
                <div class="flex flex-row flex-grow pl-2 md:pl-0">
                    <slot name="topRight"></slot>
                </div>
            </div>
            <div>
                <slot name="quickAccess"> {{ quickAccessData }}</slot>
            </div>
            <div class="flex flex-row md:my-4">
                <div class="flex flex-grow flex-wrap items-center">
                    <slot name="breadcrumb"></slot>
                </div>
                <div class="flex flex-row items-center h-10 justify-center" v-if='showViewTypes'>
                    <div v-if="activeView === 'grid' && headers?.some(x => x.enableSorting)">
                        <Dropdown :options="headers.map(x => ({ label: x.displayName, value: x.key }))" @[DropdownEmits.Changed]="sortHeader" default-option="name" />
                        <IconButton v-if="sort?.order !== 'ascending'" @click="sortDirection('ascending')">
                            <div>
                                <em class="fas fa-sort-amount-down"></em>
                            </div>
                        </IconButton>
                        <IconButton v-if="sort?.order !== 'descending'" @click="sortDirection('descending')">
                            <div>
                                <em class="fas fa-sort-amount-up"></em>
                            </div>
                        </IconButton>
                    </div>
                    <div :key="activeView" class="ml-4">
                        <IconButton class="rounded-tr-none rounded-br-none border-r-0" @click="activeView = 'list'" :isActive="activeView === 'list'">
                            <div>
                                <em class="fas fa-th-list"></em>
                            </div>
                        </IconButton>
                        <IconButton class="rounded-tl-none rounded-bl-none" @click="activeView = 'grid'" :isActive="activeView === 'grid'">
                            <div>
                                <em class="fas fa-th"></em>
                            </div>
                        </IconButton>
                    </div>
                </div>
            </div>
                <template v-if="activeView === 'list'">
                    <Table
                        :withPagination="withPagination"
                        :backendPaginationSorting="backendPaginationSorting"
                        rowClass="bg-gray-50"
                        :data="dataList"
                        :headers="headers"
                        :pageSize="pageSize"
                        :page="pageValue"
                        :total="totalValue"
                        :defaultSort="sort"
                        :drag-and-drop='dragAndDrop'
                        selectable
                        multi-select
                        @[TableEmits.OpenItem]="data => $emit(Emits.OpenItem, data)"
                        @[TableEmits.SortChanged]="e => $emit(Emits.SortChanged, e)"
                        @[TableEmits.SelectedChanged]="e => $emit(Emits.SelectedChanged, e)"
                        @[TableEmits.MoveItems]="e => $emit(Emits.MoveItems, e)"
                        @[TableEmits.StartDragging]="startDragging"
                        @[TableEmits.StopDragging]="stopDragging"
                    >
                        <template v-if="!hasSlot('data-name')" #data-name="rowData">
                            <em :class="getIcon(rowData.row.fileType) + ' ' + getIconColor(rowData.row.fileType)"></em>
                            {{ getName(rowData.row) }}
                        </template>
                        <template v-for="(_, slot) of $slots" v-slot:[slot]="props">
                            <slot :name="slot" v-bind="props"></slot>
                        </template>
                    </Table>
                </template>
                <template v-if="activeView === 'grid'">
                    <grid-view
                        :withPagination="withPagination"
                        :backendPaginationSorting="backendPaginationSorting"
                        gridClass="bg-gray-50"
                        :data="dataList"
                        :headers="headers"
                        :pageSize="pageSize"
                        :page="pageValue"
                        :total="totalValue"
                        :defaultSort="sort"
                        @[GridViewEmits.SortChanged]="e => $emit(Emits.SortChanged, e)"
                    >
                        <template #grid-item="gridData" class="">
                            <div
                                class="flex-col items-center justify-center text-center w-28 break-word p-2 hover:bg-gray-100 cursor-pointer"
                                :key="getName(gridData.item)"
                            >
                                <div class="flex justify-center">
                                    <em class="fa-2x" :class="getIcon(gridData.item.fileType) + ' ' + getIconColor(gridData.item.fileType)"></em>
                                </div>

                                <span class="block truncate whitespace-normal">
                                    {{ gridData.item.name.length > 25 ? `${gridData.item.name.slice(0, 25)}...` : getName(gridData.item) }}
                                </span>
                            </div>
                        </template>
                    </grid-view>
                </template>
            </div>
        <slot name="sideBar"></slot>

        <!-- Dragging indicator (replicate onedrive)-->
        <div class="absolute pointer-events-none z-0 inset-0">
            <div v-if="dragging" :style="draggingIndicatorStyle" class="absolute overflow-hidden">
                <slot name="dragging-indicator">
                    <div class="max-w-max p-1 border-2 border-black bg-white" >
                        Dragging
                    </div>
                </slot>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
    import { computed, defineComponent, PropType, ref } from 'vue';
    import { Table, TableEmits } from '../Table';
    import { GridView, GridViewEmits } from '../GridView';
    import { IHeader, ISort, ScreenWidth, TEntry } from '../../infrastructure/types/FileManagerTypes';
    import { fileComparer, getIcon, getIconColor, getName } from '../../infrastructure/utils/FileUtil';
    import { Input, InputEmits } from '../Input';
    import { Dropdown, DropdownEmits, IOption } from '../Dropdown';
    import { IconButton } from '../Buttons/IconButton';
    import { FileManagerEmits as Emits, FileManagerView as View } from './index';

    const defaultHeaders = [
        { displayName: 'Id', key: 'id', enableSorting: true, customTemplate: true, displayWidth: ScreenWidth.Screen },
        {
            displayName: 'Name',
            key: 'name',
            displayWidth: ScreenWidth.All,
            enableSorting: true,
            comparer: (entry1, entry2, i) => fileComparer(entry1, entry2, i),
        },
        {
            displayName: 'Modified',
            key: 'modified',
            enableSorting: true,
            displayWidth: ScreenWidth.Screen,
            formatter: entry => {
                if (entry.isFolder) return;
                const date = new Date(<string>entry.modified);
                return date.toDateString();
            },
        },

        { displayName: 'Deleted', key: 'deleted', enableSorting: true },
    ] as IHeader<TEntry>[];

    export default defineComponent({
        name: 'FileManager',
        components: {
            Table,
            Dropdown,
            Input,
            GridView,
            IconButton,
        },
        props: {
            displaySidebar: { type: Boolean, required: true },
            data: { type: Array as PropType<any[]>, required: true },
            quickAccessData: { type: Array as PropType<any[]>, required: false },
            headers: { type: Array as PropType<IHeader<any>[]>, required: false },
            page: { type: Number, required: false, default: 1 },
            pageSize: { type: Number, required: false, default: 10 },
            total: { type: Number, required: false },
            backendPaginationSorting: {
                type: Boolean,
                required: false,
                default: false,
            },
            showViewTypes: {
                type: Boolean,
                required: false,
                default: false,
            },
            dragAndDrop: { type: Boolean, required: false, default: false },
            backendFiltering: { type: Boolean, required: false, default: false },
            withPagination: { type: Boolean, required: false, default: false },
            withFiltering: { type: Boolean, required: false, default: false },
            defaultSort: { type: Object as PropType<ISort>, required: false },
            icons: { type: Object, required: false },
        },
        setup(props, { slots, emit }) {
            const activeView = ref<View>(View.List);
            const sort = ref<ISort | undefined>(props.defaultSort ?? { prop: 'name', order: 'ascending' });
            const searchValue = ref<string>();
            const pageValue = ref(props.page);
            const mouseDraggingX = ref<number>(0);
            const mouseDraggingY = ref<number>(0);
            const dragging = ref<Boolean>(false);

            const headers = computed(() => {
                if (!props.headers || !(props.headers.length > 0)) return defaultHeaders;
                return props.headers
                    .map(h => {
                        if (!h?.key) return;
                        const defaultValue = defaultHeaders.find(x => x.key === h.key);
                        return {
                            ...defaultValue,
                            ...h,
                        };
                    })
                    .filter(h => !!h);
            });
            const nameHeader = headers.value?.find(x => x?.key === 'name');
            const totalValue = ref(props.backendFiltering ? props.total : props.total ? props.total : props.data?.length);
            const dataList = computed(() => {
                const getData = () => {
                    if (props.backendFiltering) return props.data;

                    if (props.withFiltering && nameHeader && searchValue.value) return props.data.filter(x => x.name?.toLowerCase().includes(<string>searchValue.value));

                    return props.data;
                };
                const dl = getData();
                totalValue.value = dl.length;
                return dl;
            });

            const sortChanged = () => {
                emit(Emits.SortChanged, sort.value);
            };

            const sortHeader = (option: IOption) => {
                sort.value = {
                    prop: option.value,
                    order: sort.value?.order === 'descending' ? 'ascending' : 'descending',
                } as ISort;
                sortChanged();
            };

            const sortDirection = (direction: 'ascending' | 'descending') => {
                sort.value = {
                    ...(sort.value ?? {}),
                    order: direction,
                } as ISort;
                sortChanged();
            };

            const sortDisplayName = computed(() => {
                if (!sort.value?.prop) return 'Sorteer';
                const header = headers?.value?.find(x => x?.key === sort?.value?.prop);
                if (!header?.displayName) return sort.value.prop;
                return header.displayName;
            });

            const hasSlot = computed(() => {
                return (slotName: string) => {
                    return slots?.[slotName];
                };
            });

            const searchChanged = (input: string | undefined) => {
                if (props.backendFiltering) emit(Emits.SearchChanged, input);
                searchValue.value = input;
                pageValue.value = 1;
            };

            const search = () => {
                emit(Emits.DoSearch, searchValue.value);
            };

            const startDragging = (e: DragEvent) => {
                dragging.value = true;
                emit(Emits.StartInternalDrag, e);
            };

            const stopDragging = (e: DragEvent) => {
                dragging.value = false;
                emit(Emits.StopInternalDrag, e);
            };

            ondragover = async event => {
                mouseDraggingX.value = event.clientX;
                mouseDraggingY.value = event.clientY;
            };

            return {
                dataList,
                headers,
                TableEmits,
                GridViewEmits,
                InputEmits,
                DropdownEmits,
                sort,
                sortDirection,
                sortHeader,
                Emits,
                hasSlot,
                getIcon,
                getIconColor,
                getName,
                activeView,
                View,
                sortDisplayName,
                totalValue,
                pageValue,
                searchValue,
                search,
                searchChanged,
                dragging,
                startDragging,
                stopDragging,
                mouseDraggingX,
                mouseDraggingY,
            };
        },
        computed: {
            draggingIndicatorStyle(): {[key: string]: string} {
                return {
                    transform: `translate(${this.mouseDraggingX}px,${this.mouseDraggingY}px)`,
                };
            },
        }
    });
</script>

<style>
    .active-view {
        color: #409eff;
    }

    .table tr {
        background: gray;
    }
</style>
