<template>
    <div class="debug-screens w-full h-full" id="app">
        <IconButton> blas</IconButton>
        <Table :data="iets" :headers="headers" empty-message="leeg"> </Table>

        <!-- <file-manager
            class="block h-full"
            :data="data"
            drag-and-drop
            withFiltering
            openWithSingleClick
            @start-internal-drag="startInternalDrag"
            @stop-internal-drag="stopInternalDrag"
            display-sidebar="true"
        >
            <template #data-deleted="rowData">
                <span v-if="rowData.row.deleted" class="italic text-red-600">DELETED</span>
            </template>

            <template #dragging-indicator>
                              <div v-if="isInternalDragging" class="max-w-max p-1 border-2 border-black bg-white"><em class="far fa-file"></em>MOVING</div>
            </template>
        </file-manager> -->
    </div>
    <div>
        <!-- {{FileManagerEmits}} -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, onBeforeMount, ref, computed } from 'vue';
    //  import { FileManager, FileManagerEmits, TEntry, IHeader, ISort,  }  from "@jimber/shared-components"
    // import FileManager from "@jimber/shared-components/src/components/FileManager.vue"
    // import {IHeader,IMoveItems,ISort,TEntry,FileManagerEmits,FileManagerViews} from "@jimber/shared-components/src/types/FileManagerTypes"
    import Table from '../src/components/Table/Table.vue';
    import { getFileType } from '@/infrastructure/utils/FileUtil';
    import jsonData from './data.json';
    import { IconButton } from '@/entry.esm';

    const iets = ref([
        {
            userId: 1,
        },
        {
            userId: 2,
        },
    ]);

    const headers = computed(() => [
        {
            key: 'userId',
            displayName: 'Email',
            enableSorting: true,
        },
    ]);

    const getEverything = async () => {
        //@ts-ignore
        const dataToReturn = jsonData.map(dataItem => {
            //@ts-ignore
            const type = getFileType(dataItem.isFolder ? 'dir' : dataItem.extension);
            return { ...dataItem };
        });
        console.log(dataToReturn);
        //@ts-ignore
        return <TEntry[]>dataToReturn;
    };

    const data = ref<any[]>([]);

    // const rowClicked = (e: any) => {
    //   console.log(e);
    // };

    // const sidebarData = ref<TEntry>();

    export default defineComponent({
        name: 'App',
        components: {
            Table,
            IconButton,
        },
        setup() {
            const isInternalDragging = ref<boolean>(false);
            onBeforeMount(async () => {
                data.value = await getEverything();
                console.log(data.value);
            });
            //const headers: IHeader<TEntry>[] = [];
            const startInternalDrag = () => {
                isInternalDragging.value = true;
            };
            const stopInternalDrag = () => {
                isInternalDragging.value = false;
            };
            //const changeSelected = (clickedItem: any) => {
            //  //@todo actually fetch the data
            //  console.log('here');
            //  sidebarData.value = clickedItem;
            //};

            onBeforeMount(() => {});

            return {
                //data,
                iets,
                headers,
                startInternalDrag,
                stopInternalDrag,
                isInternalDragging,
                // rowClicked,
                // headers,
                // changeSelected,
                // sidebarData,
                // FileManagerEmits,
                // getIcon,
                // getIconColor,
                // getName,
            };
        },
    });
</script>

<style></style>
