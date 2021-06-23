<template>
  <div class="debug-screens w-full h-full bg-gray-200">
    <HelloWorld :data="data" :headers="headers" />
  </div>
</template>

<script lang="ts">
import { defineComponent, onBeforeMount, ref } from 'vue';
import HelloWorld from './components/Table.vue';
import axios from 'axios';

const getEverything = async () => {
  const res = await axios.get('https://randomuser.me/api/?seed=fea8be3e64777240&results=20');
  return res.data.results.map((u: any) => ({
    id: u.id.value,
    name: `${u.name.first} ${u.name.last}`,
    title: 'Regional Paradigm Technician',
    department: 'Optimization',
    role: 'Admin',
    email: u.email,
    image: u.picture.thumbnail,
    active: true,
  }));
};
const data = ref<any[]>([]);
const headers = [
  {
    "key": "id",
    "value": "Identifier"
  },
  "name"
]

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {
    onBeforeMount(async () => {
      data.value = await getEverything();
      console.log(data.value);
    });
    return {
      data,
      headers
    };
  },
});
</script>

<style>
</style>
