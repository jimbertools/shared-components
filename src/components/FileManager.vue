<template>
    <div class="flex flex-row w-full max-w-full">
        <div class="flex flex-col flex-1 border-r-2 border-grey-100">
            <div>
                <slot name="quickAccess">
                    Quick folder access
                    {{ quickAccessData }}
                </slot>
            </div>
            <div class="flex flex-col">
                <div class="overflow-x-auto">
                    <div class="align-middle inline-block min-w-full">
                        <div class="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                            <test-table
                                :withPagination="withPagination"
                                :backendPaginationSorting="backendPaginationSorting"
                                class=""
                                :data="dataList"
                                :headers="headers"
                                :pageSize="pageSize"
                                :page="page"
                                :total="total"
                                :defaultSort="defaultSort ?? { prop: 'name', order: 'ascending' }"
                                @[TableEmits.RowClicked]="data => $emit(Emits.SelectedChanged, data)"
                                @[TableEmits.SortChanged]="e => $emit(Emits.SortChanged, e)"
                            >
                                <template v-if="!hasSlot('data-name')" #data-name="rowData">
                                    <em :class="getIcon(rowData.row.fileType) + ' ' + getIconColor(rowData.row.fileType)"></em>
                                    {{ getName(rowData.row) }}
                                </template>
                                <template v-for="(_, slot) of $slots" v-slot:[slot]="props">
                                    <slot :name="slot" v-bind="props"> </slot>
                                </template>
                            </test-table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="w-1/4 flex-shrink-0" v-if="sidebarData">
            <slot name="sideBar">
                <div v-for="key of Object.keys(sidebarData)" :key="key">
                    <span class="font-bold"> {{ key }} </span> <span class="italic">{{ sidebarData[key] }}</span
                    ><br />
                </div>
            </slot>
        </div>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent, PropType } from 'vue';
import TestTable, { Emits as TableEmits } from './TestTable.vue';
import { IHeader, ISort, TEntry } from '../infrastructure/types/FileManagerTypes';
import { getIcon, getIconColor, getName } from '../infrastructure/utils/FileUtil';
export enum Emits {
    SortChanged = 'sort-changed',
    SelectedChanged = 'changeSelected',
}

const comparerFunction = (a: TEntry, b: TEntry, i: number) => {
    if (!a.isFolder && b.isFolder) return 1;
    if (a.isFolder && !b.isFolder) return -1;

    return a.name.localeCompare(b.name) * i;
};

const defaultHeaders = [
    { displayName: 'Id', key: 'id', enableSorting: true, customTemplate: true },
    { displayName: 'Name', key: 'name', enableSorting: true, comparer: (entry1, entry2, i) => comparerFunction(entry1, entry2, i) },
    // { displayName: 'Name', key: 'name', enableSorting: true, },
    {
        displayName: 'Modified',
        key: 'modified',
        enableSorting: true,
        formatter: entry => {
            if (entry.isFolder) return;
            const date = new Date(<string>entry.modified);
            return date.toDateString();
        },
    },
    { displayName: 'Created', key: 'created', enableSorting: true },
    { displayName: 'Size', key: 'size', enableSorting: true },
] as IHeader<TEntry>[];

function defineGenericComponent<T extends Partial<TEntry>>() {
    return defineComponent({
        name: 'FileManager',
        components: {
            TestTable,
        },
        props: {
            data: { type: Array as PropType<T[]>, required: true },
            quickAccessData: { type: Array as PropType<T[]>, required: false },
            sidebarData: { type: Object, required: false },
            headers: { type: Array as PropType<Partial<IHeader<T>>[]>, required: false },
            page: { type: Number, required: false, default: 1 },
            pageSize: { type: Number, required: false, default: 10 },
            total: { type: Number, required: false },
            backendPaginationSorting: { type: Boolean, required: false, default: false },
            withPagination: { type: Boolean, required: false, default: false },
            defaultSort: { type: Object as PropType<ISort>, required: false },
            icons: { type: Object, required: false },
        },
        emits: Object.values(Emits),
        setup(props, { slots }) {
            const dataList = computed(() => {
                return props.data;
            });

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

            const handleSort = (sort: ISort) => {
                console.log(sort);
            };

            const hasSlot = computed(() => {
                return (slotName: string) => {
                    return slots?.[slotName];
                };
            });

            return {
                dataList,
                headers,
                TableEmits,
                handleSort,
                Emits,
                hasSlot,
                getIcon,
                getIconColor,
                getName,
            };
        },
    });
}

export default defineGenericComponent();
</script>

<style></style>
