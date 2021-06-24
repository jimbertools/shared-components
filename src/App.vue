<template>
    <div class="debug-screens w-full h-full bg-gray-200">
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

        <file-manager :data="data" />
    </div>
</template>

<script lang="ts">
    import { defineComponent, onBeforeMount, ref } from 'vue';
    import Table from './components/Table.vue';
    import ElementTable from './components/ElementTable.vue';
    import axios from 'axios';
    import TestTable from './components/TestTable.vue';
import FileManager from './components/FileManager.vue';
import jsonData from './data.json' 
    import { IHeader,IFile,IBaseFolder,TEntry } from './infrastructure/types/FileManagerTypes'


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
        return <TEntry[]>jsonData  

    };
    const data = ref<any[]>([]);

    const rowClicked = (e: any) => {
        console.log(e);
    };

    export default defineComponent({
        name: 'App',
        components: {
            TestTable,
            Table,
            ElementTable,
            FileManager,
        },
        setup() {
            onBeforeMount(async () => {
                data.value = await getEverything();
                console.log(data.value);
            });

            return {
                data,
                rowClicked,
            };
        },
    });
</script>

<style></style>
