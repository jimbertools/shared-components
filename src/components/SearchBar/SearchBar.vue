<template>
    <div class="flex space-x-5 mb-2 w-full md:w-max">
        <div class="w-full">
            <div class="mt-1 flex rounded-md shadow-sm">
                <div class="relative flex items-stretch flex-grow focus-within:z-10">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none" aria-hidden="true">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mr-3 h-4 w-4 text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        name="search"
                        id="search"
                        class="block w-full pl-9 sm:text-sm border-gray-300 dark:border-dark-200 dark:bg-dark-600 dark:text-white rounded-md dark:placeholder:text-dark-500"
                        :class="{
                            'rounded-r-md': options.length === 1,
                            'rounded-r-none': options.length > 1,
                        }"
                        placeholder="Search"
                        @keyup="filter"
                        v-model="searchString"
                    />
                    <!-- Heroicons xmarkicon-->
                    <div class="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer" aria-hidden="true" @click="clearSearch">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-4 h-4 text-gray-400">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                </div>
                <label for="typeSearch" class="sr-only">typeSearch</label>
                <select
                    v-if="options.length > 1"
                    id="typeSearch"
                    name="typeSearch"
                    class="-ml-px relative inline-flex items-center space-x-2 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                    @change="filter"
                    v-model="searchKey"
                    :disabled="options.length === 1"
                >
                    <option v-for="option in options" :value="option" :key="option">
                        {{ option }}
                    </option>
                </select>
            </div>
        </div>
        <template v-if="enumOptions">
            <div class="flex flex-col">
                <label for="enumKey" class="block text-sm font-medium text-gray-700">Status</label>
                <select
                    id="enumKey"
                    name="enumKey"
                    class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                    v-model="enumKey"
                    @change="filter"
                >
                    <option v-for="option in enumOptions.options" :value="option" :key="option">
                        {{ option }}
                    </option>
                </select>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';

    const emit = defineEmits(['update:searchValue', 'update:searchClear']);

    interface enumOptions {
        filterKey: string;
        translationKey: string;
        options: string[];
    }

    //TODO fix rollup with interface IProps and use it here
    const { data, options, enumOptions, whitelistedOptions, blacklistedOptions } = defineProps<{
        options: string[];
        enumOptions?: enumOptions; // @TODO: make enumOptions an array to filter on multiple (e.g. status, case-ref, victim-ref)
        data: any[];
        whitelistedOptions?: string[];
        blacklistedOptions?: string[];
    }>();

    const searchKey = ref(options[0]);
    const enumKey = ref(enumOptions?.options[0]);
    const searchString = ref<string>('');
    const matchCase = ref(false);

    const filter = () => {
        if (searchString.value === '' && (!enumOptions || enumKey.value === 'all')) {
            return emit('update:searchClear');
        }
        const result = updateSearch();
        return emit('update:searchValue', result);
    };

    const clearSearch = () => {
        searchString.value = '';
        searchKey.value = options[0];
        if (enumOptions) {
            enumKey.value = enumOptions.options[0];
        }
        return emit('update:searchClear');
    };

    const updateSearch = () => {
        let values = Object.values(data);

        if (enumOptions && enumKey.value !== 'all') {
            values = values.filter(item => {
                return item[enumOptions.filterKey] === enumKey.value;
            });
        }

        if (searchString.value === '') {
            return values;
        }

        if (searchKey.value === 'all') {
            console.log(values);
            return values.filter((item: any) => {
                const result = Object.keys(item).some((key: string) => {
                    return isPropertyAllowed(key) && doesPropertyContainString(item[key], searchString.value);
                });
                return result;
            });
        }

        const result = values.filter(item => {
            return doesPropertyContainString(item[searchKey.value], searchString.value);
        });
        return result;
    };

    const isPropertyAllowed = (property: string) => {
        if (blacklistedOptions && blacklistedOptions.length > 0) {
            return !blacklistedOptions.includes(property);
        }
        if (whitelistedOptions && whitelistedOptions.length > 0) {
            return whitelistedOptions.includes(property);
        }
        return true;
    };

    const doesPropertyContainString = (property: string, searchString: string) => {
        if (matchCase.value) {
            return property?.includes(searchString);
        }

        if (typeof property !== 'object') {
            return property && String(property)?.toLowerCase().includes(searchString?.toLowerCase());
        }
    };

    defineExpose({
        filter,
    });
</script>
