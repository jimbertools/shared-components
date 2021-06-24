<template>
    <test-table :data="data" :headers="headers" :page-size="20" :page-index="0">
        <!-- <template v-slot:header-name="{ header }">
                <h2 class="inline">{{ header }} custom header</h2>
            </template>
            <template v-slot:data-name="{ data, row }">
                <td class="pink">
                    <img class="inline-block w-6 h-6 aspect-1/1 rounded-full shadow" :src="row.image" alt="" />
                    <h1 class="ml-4 inline">{{ data.first }}&nbsp</h1>
                    <h2 class="inline">{{ data.last }}</h2>
                </td>
            </template> -->
    </test-table>
</template>


<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
    import TestTable from './TestTable.vue';
    import { IHeader,IFile,IBaseFolder,TEntry } from '../infrastructure/types/FileManagerTypes'




const headers = [
    { displayName: 'id', key: 'id' },
    {
        displayName: 'name',
        key: 'name',
        sort: (data: any) => {
            return `${data.first} ${data.last}`;
        },
    },
    { displayName: 'modified', key: 'modified' },
    { displayName: 'created', key: 'created' },
    { displayName: 'size', key: 'size' },
    { displayName: 'extension', key: 'extension' },
    { displayName: 'isFolder', key: 'isFolder' },
];

export default defineComponent({
    name: 'FileManager',
            components: {
            TestTable
        },
    setup(props) {
        const dataList = computed(() => {
            return props.data;
        });

        return {
            dataList,
            headers,
        };
    },
    props: {
        data: { type: Array as PropType<Partial<TEntry[]>>, required: true },
        // headers: { type: Array as PropType<THeader[]>, required: true },
    },
});
</script>

<style></style>
