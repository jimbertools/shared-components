<template>
    <div class='debug-screens w-full h-full'>
        <!-- <test-table :data="data" :headers="headers" :page-size="20" :page-index="0">
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
        </test-table> -->

        <file-manager
            :data='data'
            :headers='headers'
            :sidebarData='sidebarData'
            :icons='icons'
            withPagination
            @[FileManagerEmits.SelectedChanged]='changeSelected'
            @[FileManagerEmits.SortChanged]='onSort'>
            <template #sideBar>
                <div class=" p-6 ">
                <div class='flex flex-rowborder-b-2 pb-6 border-grey-100' :key="sidebarData.fileType">
                    <em class='text-xl' :class="getIcon(sidebarData.fileType ) + ' ' + getIconColor(sidebarData.fileType )"></em>
                    <h1 class='flex-1 px-4 truncate'>
                        {{getName(sidebarData)}}
                    </h1>
                    <em class='fas fa-save'></em>
                </div>
                <hr />
                <h2 class="text-lg pt-2 font-bold">Details</h2>
                {{sidebarData}}
                <span> 
                    Aangemaakt: {{sidebarData.created}}
                </span>
                <span>
                    Laatst gewijzigd: {{sidebarData.modified}}
                </span>
                </div>
            </template>
            <template #id='name'>
                {{ name.row.id }}
            </template>
                    <!-- <template #data-name='name'>
                overwritesss
            </template> -->
        </file-manager>
    </div>
</template>

<script lang='ts'>
    import { defineComponent, onBeforeMount, ref } from 'vue';
    import Table from './components/Table.vue';
    import ElementTable from './components/ElementTable.vue';
    import axios from 'axios';
    import FileManager, { Emits as FileManagerEmits } from './components/FileManager.vue';
    import jsonData from './data.json';
    import { IHeader, ISort, TEntry } from './infrastructure/types/FileManagerTypes';
import { getFileType } from './infrastructure/utils/FileUtil';
import {getIcon,getIconColor, getName} from './infrastructure/utils/FileUtil'

    const getEverything = async () => {
        // const res = await axios.get('https://randomuser.me/api/?seed=fea8be3e64777240&results=20');
        // let map = res.data.results.map((u: any) => ({
        //     id: u.login.uuid,
        //     name: { first: `${u.name.first}`, last: `${u.name.last}` },
        //     title: 'Regional Paradigm Technician',
        //     department: 'Optimization',
        //     role: 'Admin',
        //     email: u.email,
        //     image: u.picture.thumbnail,
        //     active: true,
        //     age: u.dob.age,
        // }));
        // map[0].age = 3;

        // return map;
        //@ts-ignore
        const dataToReturn = jsonData.map((dataItem)=>{
        //@ts-ignore
            const type = getFileType(dataItem.isFolder? "dir" : dataItem.extension)
            return {...dataItem, fileType:type}
        })
        //@ts-ignore
        return <TEntry[]>dataToReturn;
    };
    const data = ref<any[]>([]);

    const rowClicked = (e: any) => {
        console.log(e);
    };

    const sidebarData = ref<Object>();

    export default defineComponent({
        name: 'App',
        components: {
            Table,
            FileManager,
        },
        setup() {
            onBeforeMount(async () => {
                data.value = await getEverything();
                console.log(data.value);
            });
            const headers: IHeader<TEntry>[] = [];

            const changeSelected = (clickedItem: any) => {
                //@todo actually fetch the data
                console.log('here');
                sidebarData.value = clickedItem;
            };

            const onSort = (e: ISort) => {
                console.log("@todo implement this",e)
                // const i = e.order === 'ascending' ? -1 : 1;

                // const getData = headers?.find((h: any) => h.key == e.prop)?.comparer;
                // data.value = [...data.value.sort((a: any, b: any) => {
                //     const aValue = getData ? getData(a[e.prop]) : a[e.prop];
                //     const bValue = getData ? getData(b[e.prop]) : b[e.prop];
                //     return (
                //         i *
                //         ('' + aValue).localeCompare('' + bValue, undefined, {
                //             sensitivity: 'base',
                //             numeric: true,
                //         })
                //     );
                // })];
            };

            return {
                data,
                rowClicked,
                headers,
                changeSelected,
                sidebarData,
                onSort,
                FileManagerEmits,
                getIcon,
                getIconColor,
                getName

            };
        },
    });
</script>

<style></style>
