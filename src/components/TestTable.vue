<template>
    <!--    <table class="min-w-full bg-white dark:bg-gray-800">-->
    <!--        <thead class="sticky top-0">-->
    <!--            <tr class="w-full h-16 border-gray-300 border-b py-8">-->
    <!--                <th-->
    <!--                    class=" text-gray-600 dark:text-gray-400 font-normal pr-6 text-left text-sm tracking-normal leading-4 cursor-pointer hover:text-gray-400"-->
    <!--                    v-for="header in headers"-->
    <!--                    @click="sortMePlx(header.key)"-->
    <!--                    :key="header"-->
    <!--                >-->
    <!--                    <slot :name="`header-${header}`" :header="header">-->
    <!--                        {{ header.displayName }}-->
    <!--                    </slot>-->
    <!--                </th>-->
    <!--            </tr>-->
    <!--        </thead>-->
    <!--        <tbody>-->
    <!--            <tr class="h-24 border-gray-300 border-b cursor-pointer hover:bg-gray-100" v-for="data in dataList" :key="data" @click.prevent="$emit('clickedRow',data)">-->
    <!--                <slot :name="`data-${header.key}`" :data="data[header.key]" :row="data" v-for="header in headers" :key="data[header.key]">-->
    <!--                    <td class="text-sm pr-6 whitespace-no-wrap text-gray-800 dark:text-gray-100 tracking-normal leading-4" :data-name="`data-${header.key}`">-->
    <!--                        {{ data[header.key] }}-->
    <!--                    </td>-->
    <!--                </slot>-->
    <!--            </tr>-->
    <!--        </tbody>-->
    <!--    </table>-->
    <el-table
        :data='paginatedData'
        :default-sort='defaultSort'
        @sort-change='handleSortChanged'
        @row-click='e => $emit(Emits.RowClicked, e)'
        class='break-all'
    >
        <el-table-column
            v-for='header in headers'
            :prop='header.key'
            :label='header.displayName'
            :width='header.width'
            :sortable='header.enableSorting && (backendPaginationSorting || header.sortValue) ? "custom" : true'
        >
            <template #default='scope' v-if='header.customTemplate'>
                <slot :name='header.key' :row='scope.row'></slot>
            </template>
        </el-table-column>
    </el-table>
    <div class='block' v-if='withPagination'>
        <el-pagination
            hide-on-single-page
            :page-sizes='[10, 20, 50, 100]'
            :page-size='pageSize'
            :current-page='page'
            :total='!total && data ? data.length : total'
            layout='total, sizes, prev, pager, next'
            @size-change='handleSizeChanged'
            @current-change='handlePageChanged'
        >
        </el-pagination>
    </div>
</template>

<script lang='ts'>
    import { computed, defineComponent, PropType } from 'vue';
    import { IHeader, ISort, TEntry } from '../infrastructure/types/FileManagerTypes';
    //
    // type AbstractData = {
    //     [name: string]: string | number | object | boolean;
    // };

    export enum Emits {
        RowClicked = 'clickedRow',
        SortChanged = 'sort-changed',
        PageChanged = 'page-changed',
        PageSizeChanged = 'page-size-changed'
    }


    // export const orderBy = (
    //     array: AbstractData[],
    //     sortKey: string,
    //     reverse: boolean,
    //     headers: any[],
    // ): AbstractData[] => {
    //     const i = reverse ? -1 : 1;
    //
    //     console.log(headers);
    //     console.log(sortKey);
    //     const getData = headers.find((h: any) => h.key == sortKey).sort;
    //     return array.sort((a: AbstractData, b: AbstractData) => {
    //         const aValue = getData ? getData(a[sortKey]) : a[sortKey];
    //         const bValue = getData ? getData(b[sortKey]) : b[sortKey];
    //         return (
    //             i *
    //             ('' + aValue).localeCompare('' + bValue, undefined, {
    //                 sensitivity: 'base',
    //                 numeric: true,
    //             })
    //         );
    //     });
    // };

    // const sortKey = ref<string | null>(null);
    // const reverse = ref<boolean>(false);
    function defineGenericComponent<T>() {
        return defineComponent({
            name: 'TestTable',
            props: {
                data: { type: Array, required: true },
                headers: { type: Array as PropType<IHeader<T>[]>, required: true },
                page: { type: Number, required: false, default: 0 },
                pageSize: { type: Number, required: false, default: 10 },
                total: { type: Number, required: false },
                //@todo naming: is client = is sorting on client
                backendPaginationSorting: { type: Boolean, required: false, default: false },
                withPagination: { type: Boolean, required: false, default: false },
                defaultSort: { type: Object as PropType<ISort>, required: false },
            },
            emits: Object.values(Emits),
            setup(props, { emit }) {
                // const dataList = computed(() => {
                //     if (!sortKey.value) {
                //         return props.data.slice(props.pageIndex * props.pageSize, (props.pageIndex + 1) * props.pageSize);
                //     }
                //     const dataList = orderBy(<any>props.data, sortKey.value, reverse.value, props.headers);
                //
                //     if (props.pageSize !== -1) return dataList.slice(props.pageIndex * props.pageSize, (props.pageIndex + 1) * props.pageSize);
                //
                //     return dataList;
                // });

                // const sortMePlx = (header: string) => {
                //     //@todo: add external sort
                //     console.log(header);
                //     if ((sortKey.value = header)) {
                //         reverse.value = !reverse.value;
                //         return;
                //     }
                //     reverse.value = false;
                //     sortKey.value = header;
                // };


                const paginatedData = computed(() => {
                    if (!props.withPagination) return props.data;
                    return props.data.slice((props.page - 1) * props.pageSize, (props.page) * props.pageSize);
                });


                const handleSortChanged = (sortEvent: ISort) => {
                    if (!props.backendPaginationSorting) return;
                    emit(Emits.SortChanged, sortEvent);
                };

                const handlePageChanged = (pageEvent: number) => {
                    if (!props.backendPaginationSorting) return;
                    emit(Emits.PageChanged, pageEvent);
                };

                const handleSizeChanged = (sizeEvent: number) => {
                    if (!props.backendPaginationSorting) return;
                    emit(Emits.PageSizeChanged, sizeEvent);
                };

                return {
                    // dataList,
                    // sortKey,
                    // reverse,
                    // sortMePlx,
                    paginatedData,
                    handleSortChanged,
                    handlePageChanged,
                    handleSizeChanged,
                    Emits,
                };
            },

        });
    }

    export default defineGenericComponent();
</script>

<style></style>
