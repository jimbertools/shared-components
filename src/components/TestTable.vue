<template>
    <table class="min-w-full bg-white dark:bg-gray-800">
        <thead class="sticky top-0">
            <tr class="w-full h-16 border-gray-300 border-b py-8">
                <th
                    class="pl-8 text-gray-600 dark:text-gray-400 font-normal pr-6 text-left text-sm tracking-normal leading-4 cursor-pointer hover:text-gray-400"
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
            <tr class="h-24 border-gray-300 border-b" v-for="data in dataList" :key="data[header]">
                <slot :name="`data-${header.key}`" :data="data[header.key]" :row="data" v-for="header in headers">
                    <td class="text-sm pr-6 whitespace-no-wrap text-gray-800 dark:text-gray-100 tracking-normal leading-4" :data-name="`data-${header.key}`">
                        {{ data[header.key] }}
                    </td>
                </slot>
            </tr>
        </tbody>
    </table>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';

interface Sort {
    prop: string;
    order: 'ascending' | 'descending';
    init?: any;
    silent?: any;
}

type AbstractData = {
    [name: string]: string | number | object | boolean;
};

// const test: AbstractData = { test: 'test' };

type SortMethod<T> = (data: T) => number;
export const orderBy = (array: AbstractData[], sortKey: string, reverse: boolean, headers:any[]/*sortMethods?: { [name: string]: SortMethod<AbstractData> }*/): AbstractData[] => {
    // if (sortMethods?.[sortKey]) {
    //     return array.sort(sortMethods[sortKey]);
    // }

    const i = reverse ? -1 : 1;

    console.log(headers)
    console.log(sortKey)
    const getData = headers.find((h:any)=> h.key == sortKey).sort
    return array.sort((a: AbstractData, b: AbstractData) => {
        //@todo fixme
        
        // const aValue = sortMethods?.[sortKey] ? sortMethods[sortKey](<any>a[sortKey]) : a[sortKey];
        // const bValue = sortMethods?.[sortKey] ? sortMethods[sortKey](<any>b[sortKey]) : b[sortKey];

        const aValue = getData ? getData(a[sortKey]) : a[sortKey]
        const bValue = getData ? getData(b[sortKey]) : b[sortKey]
        return (
            i *
            ('' + aValue).localeCompare('' + bValue, undefined, {
                sensitivity: 'base',
                numeric: true,
            })
        );
    });
};

const sortKey = ref<string | null>(null);
const reverse = ref<boolean>(false);

//@todo: add pagination
export default defineComponent({
    name: 'TestTable',
    setup(props) {
        const dataList = computed(() => {
            if (!sortKey.value) {
                return props.data;
            }
            return orderBy(<any>props.data, sortKey.value, reverse.value, props.headers);
        });

        const sortMePlx = (header: string) => {
            //@todo: add external sort
            console.log(header)
            if ((sortKey.value = header)) {
                reverse.value = !reverse.value;
                return;
            }
            reverse.value = false;
            sortKey.value = header;
        };
        return {
            dataList,
            sortKey,
            reverse,
            sortMePlx,
        };
    },
    props: {
        data: { type: Array, required: true },
        headers: { type: Array, required: true },
        // sortMethodsOverride: { type: Object, default: {}, required: false },
    },
});
</script>

<style></style>
