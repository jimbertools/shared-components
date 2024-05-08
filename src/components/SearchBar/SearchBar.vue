<template>
    <div class="flex space-x-5 w-full md:w-max">
        <div class="w-full">
            <div class="mt-1 flex rounded-md">
                <Input
                    class="block w-full sm:text-sm border-gray-300 dark:border-dark-200 dark:bg-dark-400 dark:text-white dark:placeholder:text-gray-200"
                    :input-class="{
                        'rounded-r-md': options.length === 1,
                        'rounded-r-none': options.length > 1,
                    }"
                    :with-button="true"
                    :clearable="true"
                    placeholder="Search"
                    @text-changed="inputTextChanged"
                    @clear="clearSearch"
                    v-model="searchString"
                />
                <label for="typeSearch" class="sr-only">typeSearch</label>
                <select
                    v-if="options.length > 1"
                    id="typeSearch"
                    name="typeSearch"
                    class="-ml-px relative inline-flex items-center space-x-2 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary dark:border-dark-200 dark:bg-dark-400 dark:text-white"
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
                <label for="enumKey" class="block text-sm font-medium text-gray-700 dark:text-white">{{ enumOptions.filterKey }} hi</label>
                <select
                    id="enumKey"
                    name="enumKey"
                    class="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm dark:border-dark-200 dark:bg-dark-400 dark:text-white"
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

<script lang="ts">
    import { defineComponent, ref, watch } from 'vue';
    import { Input, InputEmits } from '../Input';

    interface enumOptions {
        filterKey: string;
        translationKey: string;
        options: string[];
    }

    export enum SearchBarEmits {
        SearchValueChanged = 'update:searchValue',
        SearchClear = 'update:searchClear',
        AppliedFilters = 'update:appliedFilters',
    }

    export default defineComponent({
        name: 'SearchBar',
        props: {
            options: { type: Array as () => string[], required: true },
            enumOptions: { type: Object as () => enumOptions, required: false },
            whitelistedOptions: { type: Array as () => string[], required: false },
            blacklistedOptions: { type: Array as () => string[], required: false },
            data: { type: Array as () => any[], required: true },
            backendSearch: { type: Boolean, required: false, default: false },
        },
        components: { Input },
        emits: [SearchBarEmits.SearchValueChanged, SearchBarEmits.SearchClear, SearchBarEmits.AppliedFilters],
        setup(props, { emit }) {
            const searchKey = ref(props.options[0]);
            const enumKey = ref(props.enumOptions?.options[0]);
            const searchString = ref<string>('');
            const matchCase = ref(false);

            const filter = () => {
                if (props.backendSearch) {
                    return emit(SearchBarEmits.AppliedFilters, { searchString: searchString.value });
                }
                if (searchString.value === '' && (!props.enumOptions || enumKey.value === 'all')) {
                    return emit(SearchBarEmits.SearchClear);
                }
                const result = updateSearch();
                return emit(SearchBarEmits.SearchValueChanged, result);
            };

            const inputTextChanged = (text: string) => {
                searchString.value = text;
                filter();
            };

            const clearSearch = () => {
                searchString.value = '';
                searchKey.value = props.options[0];
                if (props.enumOptions) {
                    enumKey.value = props.enumOptions.options[0];
                }
                return emit(SearchBarEmits.SearchClear);
            };

            const updateSearch = () => {
                let values = Object.values(props.data);

                if (props.enumOptions && enumKey.value !== 'all') {
                    values = values.filter(item => {
                        if (props.enumOptions) return item[props.enumOptions.filterKey] === enumKey.value;
                    });
                }

                if (searchString.value === '') {
                    return values;
                }

                if (searchKey.value === 'all') {
                    return values.filter((item: any) => {
                        const result = Object.keys(item).some((key: string) => {
                            return isPropertyAllowed(key) && doesPropertyContainString(item[key], searchString.value);
                        });
                        return result;
                    });
                }

                const result = values.filter((item: any) => {
                    return doesPropertyContainString(item[searchKey.value], searchString.value);
                });
                return result;
            };

            const isPropertyAllowed = (property: string) => {
                if (props.blacklistedOptions && props.blacklistedOptions.length > 0) {
                    return !props.blacklistedOptions.includes(property);
                }
                if (props.whitelistedOptions && props.whitelistedOptions.length > 0) {
                    return props.whitelistedOptions.includes(property);
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

            watch(
                () => props.data,
                () => {
                    if (!props.backendSearch) filter();
                }
            );

            return {
                filter,
                clearSearch,
                updateSearch,
                isPropertyAllowed,
                doesPropertyContainString,
                searchKey,
                searchString,
                enumKey,
                InputEmits,
                inputTextChanged,
            };
        },
    });
</script>
