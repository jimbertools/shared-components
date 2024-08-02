<template>
    <div class="debug-screens w-full h-full" id="app">
        <div>
            <h3>Input field</h3>
            <Input />
        </div>
        <div>
            <h3>IconButton</h3>
            <IconButton>IconButton</IconButton>
        </div>
        <Table
            :searchOptions="searchOptions"
            :data="iets"
            :headers="headers"
            empty-message="leeg"
            :navigate-with-single-click="{
                basePath: '/test',
                navigationKey: 'userId',
            }"
            ><template #actions>yuu</template>
        </Table>

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
    import { SearchOptions } from '@/types/TableTypes';
    import { Input } from '../src/components/Input';

    const iets = ref([
        {
            userId: 1,
            name: 'test',
        },
        {
            userId: 2,
            name: 'test',
        },
    ]);

    const searchOptions = ref<SearchOptions>({
        options: ['all'],
        enableSearch: true,
    });

    const headers = computed(() => [
        {
            key: 'userId',
            displayName: 'Email',
            enableSorting: true,
        },
        {
            key: 'name',
            displayName: 'Name',
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
            Input,
        },
        setup() {
            const isInternalDragging = ref<boolean>(false);
            onBeforeMount(async () => {
                data.value = await getEverything();
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
                searchOptions,
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
