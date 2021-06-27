<template>
    <div class='flex flex-row w-full max-w-full'>
        <div class=' flex flex-col flex-1 border-r-2 border-grey-100 '>
            <div>
                <slot name='quickAccess'>
                    Quick folder access
                    {{ quickAccessData }}
                </slot>
            </div>
            <div>
                <test-table
                    :withPagination='withPagination'
                    :backendPaginationSorting='backendPaginationSorting'
                    class=''
                    :data='data'
                    :headers='headers'
                    :pageSize='pageSize'
                    :page='page'
                    :total='total'
                    :defaultSort='defaultSort'
                    @[TableEmits.RowClicked]='data => $emit(Emits.SelectedChanged, data)'
                    @[TableEmits.SortChanged]='e => $emit(Emits.SortChanged, e)'
                >
                    <template v-for='(_, slot) of $slots' v-slot:[slot]='props'>
                        <slot :name='slot' v-bind='props' />
                    </template>
                </test-table>
            </div>
        </div>
        <div class='w-80' v-if='sidebarData'>
            <slot name='sideBar'>
                <div v-for='key of Object.keys(sidebarData)' :key='key'>
                    <span class='font-bold'> {{ key }} </span> <span class='italic'>{{ sidebarData[key] }}</span><br />

                </div>
            </slot>
        </div>
    </div>
</template>

<script lang='ts'>
    import { computed, defineComponent, PropType } from 'vue';
    import TestTable, { Emits as TableEmits } from './TestTable.vue';
    import { IHeader, ISort, TEntry } from '../infrastructure/types/FileManagerTypes';

    export enum Emits {
        SortChanged = 'sort-changed',
        SelectedChanged = 'changeSelected'
    }

    const defaultHeaders = [
        { displayName: 'Id', key: 'id', enableSorting: true, customTemplate: true },
        { displayName: 'Name', key: 'name', enableSorting: true },
        { displayName: 'Modified', key: 'modified', enableSorting: true },
        { displayName: 'Created', key: 'created', enableSorting: true },
        { displayName: 'Size', key: 'size', enableSorting: true },
        { displayName: 'Extension', key: 'extension', enableSorting: true },
        { displayName: 'IsFolder', key: 'isFolder', enableSorting: true },
    ] as IHeader<TEntry>[];

    function defineGenericComponent<T extends Partial<TEntry>>() {
        return defineComponent({
            name: 'FileManager',
            components: {
                TestTable,
            },
            props: {
                data: { type: Array as PropType<T[]>, required: true },
                quickAccessData: { type: Array as PropType<T[]>, required: true },
                sidebarData: { type: Object, required: false },
                headers: { type: Array as PropType<Partial<IHeader<T>>[]>, required: false },
                page: { type: Number, required: false, default: 0 },
                pageSize: { type: Number, required: false, default: 10 },
                total: { type: Number, required: false },
                backendPaginationSorting: { type: Boolean, required: false, default: false },
                withPagination: { type: Boolean, required: false, default: false },
                defaultSort: { type: Object as PropType<ISort>, required: false },
            },
            emits: Object.values(Emits),
            setup(props) {
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

                return {
                    dataList,
                    headers,
                    TableEmits,
                    handleSort,
                    Emits,
                };
            },

        });
    }

    export default defineGenericComponent();
</script>

<style></style>
