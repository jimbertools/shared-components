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
    import { IHeader,TEntry } from '../infrastructure/types/FileManagerTypes'


const defaultHeaders = [
    { displayName: 'Id', key: 'id' },
    { displayName: 'Name', key: 'name' },
    { displayName: 'Modified', key: 'modified' },
    { displayName: 'Created', key: 'created' },
    { displayName: 'Size', key: 'size' },
    { displayName: 'Extension', key: 'extension' },
    { displayName: 'IsFolder', key: 'isFolder' },
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

        const headers = computed(() => {
            if(!props.headers || !(props.headers.length > 0)) return defaultHeaders;
            const headrs =  props.headers.map(h => {
                if(!h?.key) return;
                const defaultValue = defaultHeaders.find(x => x.key === h.key);
                return {
                    ...defaultValue,
                    ...h
                }
            }).filter(h => !!h);
            console.log(headrs);
            return headrs;
        });

        return {
            dataList,
            headers,
        };
    },
    props: {
        data: { type: Array as PropType<Partial<TEntry[]>>, required: true },
        headers: { type: Array as PropType<Partial<IHeader[]>>, required: false},
    },
});
</script>

<style></style>
