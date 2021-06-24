<template>
<div class="flex flex-row w-full">
    <div class="flex-1 border-r-2 border-grey-100 ">
    <div> 
        <slot name="quickAccess"> 
        Quick folder access
        {{quickAccessData}}
        </slot>
    </div>
    <test-table class="" :data="data" :headers="headers" :page-size="20" :page-index="0" @clickedRow="data => $emit('changeSelected', data)"> </test-table>
    </div>
    <div class="w-80" v-if="sidebarData">
        <slot name="sideBar"> 
            <div v-for="key of Object.keys(sidebarData)" :key="key">
            <span class="font-bold"> {{key}} </span> <span class="italic">{{sidebarData[key]}}</span><br/>

            </div>
        </slot>
    </div>
</div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType, ref } from 'vue';
import TestTable from './TestTable.vue';
import { IHeader, TEntry } from '../infrastructure/types/FileManagerTypes';

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
        TestTable,
    },
    setup(props) {
        const dataList = computed(() => {
            return props.data;
        });

        const headers = computed(() => {
            if (!props.headers || !(props.headers.length > 0)) return defaultHeaders;
            const headrs = props.headers
                .map(h => {
                    if (!h?.key) return;
                    const defaultValue = defaultHeaders.find(x => x.key === h.key);
                    return {
                        ...defaultValue,
                        ...h,
                    };
                })
                .filter(h => !!h);
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
        quickAccessData: { type: Array as PropType<Partial<TEntry[]>>, required: true },
        sidebarData: { type: Object, required: false },
        headers: { type: Array as PropType<Partial<IHeader[]>>, required: false },
    },
    emits: ['changeSelected'],
});
</script>

<style></style>
