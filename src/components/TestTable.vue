<template>
    <table class="min-w-full bg-white dark:bg-gray-800">
        <thead class="sticky top-0">
            <tr class="w-full h-16 border-gray-300 border-b py-8">
                <th
                    class="text-gray-600 dark:text-gray-400 font-normal pr-6 text-left text-sm tracking-normal leading-4 cursor-pointer hover:text-gray-400"
                    :class="{ width: header.width }"
                    v-for="header in headers"
                    @click="sortMePlx(header.key)"
                    :key="header"
                >
                    <slot :name="`header-${header}`" :header="header">
                        {{ header.displayName }}
                    </slot>
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="data in dataList" :key="data" @click.prevent="$emit('clickedRow', data)" class="h-12 border-gray-300 border-b cursor-pointer hover:bg-gray-100">
                <td  v-for="header in headers" :data-name="`data-${header.key}`" :key="data[header.key]" class="text-sm pr-6 whitespace-no-wrap text-gray-800 dark:text-gray-100 tracking-normal leading-4">
                    <slot :name="`data-${header.key}`" :data="data[header.key]" :row="data" >
                        {{ header.formatter ? header.formatter(data) : data[header.key] }}
                    </slot>
                </td>
            </tr>
        </tbody>
    </table>
    <div class="block" v-if="withPagination">
        <el-pagination
            :page-sizes="[10, 20, 50, 100]"
            :page-size="currentPageSize"
            :current-page="currentPage"
            :total="!total && data ? data.length : total"
            layout="total, sizes, prev, pager, next"
            @size-change="handleSizeChanged"
            @current-change="handlePageChanged"
        >
        </el-pagination>
    </div>
</template>

<script lang='ts'>
import { computed, defineComponent, onMounted, PropType, ref } from 'vue';
import { IHeader, ISort, TEntry } from '../infrastructure/types/FileManagerTypes';

type AbstractData = {
    [name: string]: string | number | object | boolean;
};

export enum Emits {
    RowClicked = 'clickedRow',
    SortChanged = 'sort-changed',
    PageChanged = 'page-changed',
    PageSizeChanged = 'page-size-changed',
}

export const orderBy = (array: AbstractData[], sortKey:ISort, headers: any[]): AbstractData[] => {
    const i = sortKey.order==='descending' ? -1 : 1;

    const comparer = headers.find((h: any) => h.key == sortKey.prop)?.comparer;
    return array.sort((a: AbstractData, b: AbstractData) => {
        if(comparer)
            return comparer(a,b,i);
        const aValue = a[sortKey.prop];
        const bValue = b[sortKey.prop];
        return (
            i *
            ('' + aValue).localeCompare('' + bValue, undefined, {
                sensitivity: 'base',
                numeric: true,
            })
        );
    });
};

function defineGenericComponent<T>() {
    return defineComponent({
        name: 'TestTable',
        props: {
            data: { type: Array, required: true },
            headers: { type: Array as PropType<IHeader<T>[]>, required: true },
            page: { type: Number, required: false, default: 1 },
            pageSize: { type: Number, required: false, default: 10 },
            total: { type: Number, required: false },
            //@todo naming: is client = is sorting on client
            backendPaginationSorting: { type: Boolean, required: false, default: false },
            withPagination: { type: Boolean, required: false, default: false },
            defaultSort: { type: Object as PropType<ISort>, required: false },
        },
        emits: Object.values(Emits),
        setup(props, { emit }) {
            const sort = ref<ISort|undefined>(props.defaultSort);
            const currentPage = ref<number>(props.page)
            const currentPageSize = ref<number>(props.pageSize)
            const dataList = computed(() => {
                if (props.backendPaginationSorting) {
                    return props.data;
                }
                if (!sort.value) {
                    return props.data.slice((currentPage.value -1) * currentPageSize.value, (currentPage.value) * currentPageSize.value);
                }
                const dataList = orderBy(<any>props.data, sort.value, props.headers);

                if (currentPageSize.value !== -1) return dataList.slice((currentPage.value -1) * currentPageSize.value, (currentPage.value  ) * currentPageSize.value);

                return dataList;
            });

            const sortMePlx = (header: string) => {
                //@todo: add external sort
                console.log(header);
                if (sort && sort.value && sort.value.prop == header) {
                    sort.value.order = sort.value.order === "descending" ? "ascending" : "descending";
                    return;
                }
                sort.value = {
                    order : "ascending",
                    prop : header
                }
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
                currentPage.value = pageEvent
            };

            const handleSizeChanged = (sizeEvent: number) => {
                if (props.backendPaginationSorting) {
                    emit(Emits.PageSizeChanged, sizeEvent);
                    return
                };
                currentPageSize.value = sizeEvent
                console.log(currentPageSize.value)
            };

            return {
                dataList,
                sort,
                sortMePlx,
                paginatedData,
                handleSortChanged,
                handlePageChanged,
                handleSizeChanged,
                Emits,
                currentPage,
                currentPageSize
            };
        },
    });
}

export default defineGenericComponent();
</script>

<style></style>
