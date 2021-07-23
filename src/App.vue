<template>
    <div class="debug-screens w-full h-full">
        <IconButton> blas</IconButton>
        <!-- <Table :data="data" :headers="headers" :page-size="20" :page-index="0">
                <template v-slot:header-name="{ header }">
                    <h2 class="inline">{{ header }} custom header</h2>
                </template>
                <template v-slot:data-name="{ data, row }">
                    <td class="pink">
                        <img class="inline-block w-6 h-6 aspect-1/1 rounded-full shadow" :src="row.image" alt="" />
                        <h1 class="ml-4 inline">{{ data.first }}&nbsp</h1>
                        <h2 class="inline">{{ data.last }}</h2>
                    </td>
                </template>
            </Table> -->

        <file-manager :data="data" withFiltering>
            <!-- <template #sideBar v-if="sidebarData">
              <div class="p-6">
                <div class="flex flex-rowborder-b-2 pb-6 border-grey-100" :key="sidebarData.fileType">
                  <em class="text-xl" :class="getIcon(sidebarData.fileType) + ' ' + getIconColor(sidebarData.fileType)"></em>
                  <h1 class="flex-1 px-4 truncate">
                    {{ getName(sidebarData) }}
                  </h1>
                  <em class="fas fa-save"></em>
                </div>
                <hr />
                <h2 class="text-lg pt-2 font-bold">Details</h2>
                <span class="block"> Aangemaakt: {{ sidebarData.created }} </span>
                <span class="block"> Laatst gewijzigd: {{ sidebarData.modified }} </span>
              </div>
            </template>
            <template #id="name">
              {{ name.row.id }}
            </template>
            <template #data-name='name'>
                      overwritesss
                  </template>  -->
        </file-manager>
    </div>
    <div>
        <!-- {{FileManagerEmits}} -->
    </div>
</template>

<script lang="ts">
    import { defineComponent, onBeforeMount, ref } from 'vue';
    import FileManager from './components/FileManager.vue';
    //  import { FileManager, FileManagerEmits, TEntry, IHeader, ISort,  }  from "@jimber/shared-components"
    // import FileManager from "@jimber/shared-components/src/components/FileManager.vue"
    // import {IHeader,IMoveItems,ISort,TEntry,FileManagerEmits,FileManagerViews} from "@jimber/shared-components/src/types/FileManagerTypes"

    import { getFileType } from './infrastructure/utils/FileUtil';
    import jsonData from './data.json';
    import IconButton from './components/Buttons/IconButton/IconButton.vue';

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
            FileManager,
            IconButton,
        },
        setup() {
            onBeforeMount(async () => {
                data.value = await getEverything();
                console.log(data.value);
            });
            //const headers: IHeader<TEntry>[] = [];

            //const changeSelected = (clickedItem: any) => {
            //  //@todo actually fetch the data
            //  console.log('here');
            //  sidebarData.value = clickedItem;
            //};

            onBeforeMount(() => {});

            return {
                data,
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
